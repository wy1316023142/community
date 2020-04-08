<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">资源类型管理列表</span>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height:100%;">
        <el-col :span="6" style="height:100%;">
          <div class="res-left-List" >
            <h3 class="flex">
              自定义资源
              <span class="flexItem text_r">
                 <el-button type="primary" size="mini" @click="editRow1()" v-allow="9005001">新增</el-button>
              </span>
            </h3>
                <div class="zhsqBackLine left3 w19 top60"></div>
            <div class="zhsqTopLine left3 top60 w72"></div>
            <ul>
              <li :class="item.id===filter.customResourceId ? 'active':''" class="flex" v-for="item in groupList" @click="details(item)">
                <span>{{item.groupName}}</span>
                <span class="flexItem text_r">
                  <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click="editRow1(item)"></el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteItem(item)"></el-button>
                </span>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="18" style="height:100%;">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="layerName" label="图层名称" align='center'></el-table-column>
                <el-table-column prop="createTimeStr" label="创建时间" align='center'></el-table-column>
                <el-table-column prop="updateTimeStr" label="修改时间" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="9005002">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="9005003">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 自定义资源 -->
    <el-dialog :title="title1" :visible.sync="dialogFormVisible1" :close-on-click-modal="false"
               :close-on-press-escape="false" :modal-append-to-body='false' width="470px">
      <el-form ref="form1" :model="groupModel" :rules="rules1" :show-message="false">

        <el-form-item label="分组名称：" prop="groupName">
          <el-input autocomplete="off" v-model="groupModel.groupName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="排    序：" prop="sort">
          <el-input autocomplete="off" v-model="groupModel.sort" type="number" maxLength="2"></el-input>
        </el-form-item>
        <el-form-item label="分组图标：" prop="imgBase64">
          <div class='imgDiv'>
            <span v-show='groupModel.imgBase64' @click='cancel(1)' class='el-icon-error'></span>
            <img :src="groupModel.imgBase64" v-show='groupModel.imgBase64'/>
            <div v-show='!groupModel.imgBase64'>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,1)"/>
            </div>
          </div>
          <el-input type="hidden" v-model="groupModel.imgBase64" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="选中图标：" prop="checkedImgBase64">
          <div class='imgDiv'>
            <span v-show='groupModel.checkedImgBase64' @click='cancel(2)' class='el-icon-error'></span>
            <img v-show='groupModel.checkedImgBase64' :src="groupModel.checkedImgBase64"/>
            <div v-show='!groupModel.checkedImgBase64'>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,2)"/>
            </div>
          </div>
          <el-input type="hidden" v-model="groupModel.checkedImgBase64" v-show="false"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="groupSubmit" :loading="loading1">确 定</el-button>
      </div>
    </el-dialog>
    <!--资源图层-->
    <el-dialog :title="title2" :visible.sync="dialogFormVisible2"
               :close-on-press-escape="false" :modal-append-to-body='false' width="470px">
      <el-form ref="form2" :model="model" :rules="rules2" :show-message="false">

        <el-form-item label="图层名称：" prop="layerName">
          <el-input autocomplete="off" v-model="model.layerName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="排    序：" prop="sort">
          <el-input autocomplete="off" v-model="model.sort" type="number" maxLength="2"></el-input>
        </el-form-item>
        <!--<el-form-item label="数据权限：" prop="security">
          <el-input autocomplete="off" v-model="model.security"></el-input>
        </el-form-item>-->
        <el-form-item label="图层图标：" prop="layerImgBase64">
          <div class='imgDiv'>
            <span v-show='model.layerImgBase64' @click='cancel(3)' class='el-icon-error'></span>
            <img v-show='model.layerImgBase64' :src="model.layerImgBase64"/>
            <div v-show='!model.layerImgBase64'>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,3)"/>
            </div>
          </div>
          <el-input type="hidden" v-model="model.layerImgBase64" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="选中图标：" prop="checkedLayerImgBase64">
          <div class='imgDiv'>
            <span v-show='model.checkedLayerImgBase64' @click='cancel(4)' class='el-icon-error'></span>
            <img v-show='model.checkedLayerImgBase64' :src="model.checkedLayerImgBase64"/>
            <div v-show='!model.checkedLayerImgBase64'>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,4)"/>
            </div>
          </div>
          <el-input type="hidden" v-model="model.resourceImgBase64" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="资源图标：" prop="resourceImgBase64">
          <div class='imgDiv'>
            <span v-show='model.resourceImgBase64' @click='cancel(5)' class='el-icon-error'></span>
            <img v-show='model.resourceImgBase64' :src="model.resourceImgBase64"/>
            <div v-show='!model.resourceImgBase64'>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,5)"/>
            </div>
          </div>
          <el-input type="hidden" v-model="model.resourceImgBase64" v-show="false"></el-input>
        </el-form-item>
        <el-form-item label="资源选中：" prop="checkedResourceImgBase64">
          <div class='imgDiv'>
            <span v-show='model.checkedResourceImgBase64' @click='cancel(6)' class='el-icon-error'></span>
            <img v-show='model.checkedResourceImgBase64' :src="model.checkedResourceImgBase64"/>
            <div v-show='!model.checkedResourceImgBase64'>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,6)"/>
            </div>
          </div>
          <el-input type="hidden" v-model="model.checkedResourceImgBase64" v-show="false"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading2">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import {getBase64} from '../../commom/util.js'
  import {validateBlackSpace } from '../../commom/validator'

  export default {
    name: 'resTypeList',
    data() {
      return {
        id:0,
        tabHeight: '0',
        dialogFormVisible1: false,
        dialogFormVisible2: false,
        title1: '分组管理',
        title2: '资源类型管理',
        groupList: [],
        tableData: [],
        groupModel: {},
        model: {},
        total: 0,
        filter: {
          customResourceId: 0,
          page: 1,
          rows: 10
        },
        firstErr: null,
        loading1: false,
        loading2: false,
        rules1: {
          groupName: [{
            required: true,
            message: '请填分组名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '分组名称不能有空格',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '请填写排序',
            trigger: 'blur'
          }],
          imgBase64: [{
            required: true,
            message: '请选择分组图标',
            trigger: 'blur'
          }],
          checkedImgBase64: [{
            required: true,
            message: '请选择选中图标',
            trigger: 'blur'
          }]
        },
        rules2: {
          layerName: [{
            required: true,
            message: '请填图层名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '图层名称不能有空格',
            trigger: 'blur'
          }],
          sort: [{
            required: true,
            message: '请填写排序',
            trigger: 'blur'
          }],
          layerImgBase64: [{
            required: true,
            message: '请选择图层图标',
            trigger: 'blur'
          }],
          checkedLayerImgBase64: [{
            required: true,
            message: '请选择选中图标',
            trigger: 'blur'
          }],
          resourceImgBase64: [{
            required: true,
            message: '请选择资源图标',
            trigger: 'blur'
          }],
          checkedResourceImgBase64: [{
            required: true,
            message: '请选择选中资源图标',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this._fetchGroupData();

    },
    methods: {
      _fetchGroupData: debounce(async function () {
        const data = await Api.mapCustomResourceList.get({}, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.groupList = data.result
        /*if (this.groupList.length > 0) {
          this.filter.customResourceId = this.groupList[0].id;
        }
        this._fetchData();*/
      }, 100),
      details(item) {
        this.filter.customResourceId=item.id;
        this._fetchData();
      },
      cancel(type) {
        if (type === 1) this.groupModel.imgBase64 = ''
        if (type === 2) this.groupModel.checkedImgBase64 = ''
        if (type === 3) this.model.layerImgBase64 = ''
        if (type === 4) this.model.checkedLayerImgBase64 = ''
        if (type === 5) this.model.resourceImgBase64 = ''
        if (type === 6) this.model.checkedResourceImgBase64 = ''

      },
      editRow1(row = {
        groupName: '',
        sort: '',
        imgBase64: '',
        checkedImgBase64: ''
      }) {
        this.title1 = !row.id ? '新增分组' : '编辑分组'
        this.dialogFormVisible1 = true
        this.groupModel = cloneDeep(row)
        this.firstErr = null;
      },
      async groupSubmit() {
        this.firstErr = null;
        this.$refs.form1.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading1 = true
            if (!this.groupModel.id) {
              await Api.addMapCustomResource.post(this.groupModel).then(() => {
                this.$message({message: '新增成功', type: 'success'})
                this.dialogFormVisible1 = false
                this._fetchGroupData();
              }).catch(err => {
              })
            } else {
              await Api.modifyMapCustomResource.put(this.groupModel, {
                pathParams: {
                  id: this.groupModel.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.dialogFormVisible1 = false
                this._fetchGroupData();
              }).catch(err => {
              })
            }
            this.loading1 = false
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      async deleteItem(item) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteMapCustomResource.delete({}, {
            pathParams: {
              id: item.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchGroupData()
          }).catch(() => {
            /*this.$message({
              type: 'error',
              message: '删除失败!'
            })*/
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      _fetchData: debounce(async function () {
        const data = await Api.mapLayerResourceTypePageList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),

      editRow(row = {
        name: '',
        sort: '',
        security: '',
        layerImgBase64: '',
        checkedLayerImgBase64: '',
        resourceImgBase64: "",
        checkedResourceImgBase64: '',
        customResourceId: ''
      }) {
        if(this.filter.customResourceId===0){
          this.$message({message: '请先选中资源', type: 'warning'})
          return false
        }
        this.title2 = row ? '新增资源图层' : '编辑资源图层'
        this.dialogFormVisible2 = true
        this.model = row
        this.model.customResourceId = this.filter.customResourceId
        this.firstErr = null;
      },
      async submit() {
        this.firstErr = null
        this.$refs.form2.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading2 = true
            if (!this.model.id) {
              await Api.addMapLayerResourceType.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible2 = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.modifyMapLayerResourceType.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              })
                .then(() => {
                  this.$message({message: '修改成功', type: 'success'})
                  this.dialogFormVisible2 = false
                  this._fetchData();
                }).catch(err => {
                })
            }
            this.loading2 = false
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
            console.log(firstKey);
            console.log(this.firstErr);
          }
        })
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteMapLayerResourceType.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchData()
          }).catch(() => {
            /*this.$message({
              type: 'error',
              message: '删除失败!'
            })*/
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },

      //分组预览图片
      handleUpload(e, type) {
        const files = e.target.files
        let fileName = files[0].name;
        getBase64(files[0]).then(res => {
          if (type === 1) {
            this.groupModel.imgBase64 = res
            this.groupModel.imgPath = fileName
          }
          if (type === 2) {
            this.groupModel.checkedImgBase64 = res
            this.groupModel.checkedImgPath = fileName
          }
          if (type === 3) {
            this.model.layerImgBase64 = res
            this.model.layerImgPath = fileName
          }
          if (type === 4) {
            this.model.checkedLayerImgBase64 = res
            this.model.checkedLayerImgPath = fileName
          }
          if (type === 5) {
            this.model.resourceImgBase64 = res
            this.model.resourceImgPath = fileName
          }
          if (type === 6) {
            this.model.checkedResourceImgBase64 = res
            this.model.checkedResourceImgPath = fileName
          }

        })
        e.target.value = ''
      }
    },
  };
</script>

<style lang="less" scoped>
  .res-left-List {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    box-shadow: 0 0px 3px 0px rgba(0, 0, 0, .2);
    box-sizing: border-box;
    padding: 20px;
    color: #909399;
    overflow: auto;
  h3 {
    font-weight: bold;
  }

  ul {
    margin-top: 20px;

  li {
    margin-top: 10px;
    cursor: pointer;
    font-size: 16px;
    padding:5px 10px;
    background: #F2F6FC;
    &.active{
      background: #E4E7ED;
      box-sizing: border-box;
      border-radius: 5px;
    }
  }
  .el-button--mini {
    padding: 5px;
  }
  }
  }

</style>
