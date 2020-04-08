<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">地图资源管理列表</p>
      <div class="flexItem text_r">
        <el-select v-model="filter.customResourceId" placeholder="分组选择" @change="changeCustomResource" clearable>
          <el-option v-for="item in mapCustomResourceData"
                     :key="item.id"
                     :label="item.groupName"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="filter.layerResourceTypeId" placeholder="类型选择" clearable>
          <el-option v-for="item in mapLayerResourceTypeData"
                     :key="item.id"
                     :label="item.layerName"
                     :value="item.id"></el-option>
        </el-select>
        <el-input type="text" placeholder="名称" v-model="filter.name" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="addDialogForm" v-allow="9004001">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="名称" align='center'></el-table-column>
                <el-table-column prop="resourceType" label="类型" align='center'></el-table-column>
                <el-table-column prop="address" label="地址" align='center'></el-table-column>
                <el-table-column label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="9004002">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="9004003">删除</el-button>
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

    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="资源名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="资源地址：" prop="address">
          <el-input autocomplete="off" v-model="model.address" maxLength="64"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="tel">
          <el-input autocomplete="off" v-model="model.tel" maxLength="64"></el-input>
        </el-form-item>
        <el-form-item label="分组选择：" prop="customResourceId">
          <el-select v-model="model.customResourceId" @change="changeCustomResource">
            <el-option v-for="item in mapCustomResourceData"
                       :key="item.id"
                       :label="item.groupName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型选择：" prop="layerResourceTypeId">
          <el-select v-model="model.layerResourceTypeId">
            <el-option v-for="item in mapLayerResourceTypeData"
                       :key="item.id"
                       :label="item.layerName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="天网选择：">
          <el-select v-model="model.deviceIdList" multiple>
            <el-option
              v-for="item in deviceIdList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="坐标：">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover">
              <el-amap ref="map" :zoom="map.zoom" :events="map.events"></el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat" suffix-icon="el-icon-location"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="备注：" prop="content ">
          <el-input autocomplete="off" v-model="model.content" maxLength="128"></el-input>
        </el-form-item>
        <!--新增-->
        <template v-if="!model.id">
          <el-form-item label="全景：">
            <div class='imgDiv1'>
              <ul>
                <li v-for="item in imgList" v-if="item.type==0">
                  <span @click='cancel(item)' class='el-icon-error'></span>
                  <img :src="item.imgBase64"/>
                </li>
              </ul>
              <div>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,0)"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="图片：">
            <div class='imgDiv1'>
              <ul>
                <li v-for="item in imgList" v-if="item.type==1">
                  <span @click='cancel(item)' class='el-icon-error'></span>
                  <img :src="item.imgBase64"/>
                </li>
              </ul>
              <div>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,1)"/>
              </div>
            </div>
          </el-form-item>
        </template>
        <!--编辑-->
        <template v-if="!!model.id">
          <el-form-item label="全景：">
            <div class='imgDiv1'>
              <ul>
                <li v-for="item in imgList" v-if="item.type==0">
                  <span @click='cancelImg(item)' class='el-icon-error'></span>
                  <img :src="item.imgBase64"/>
                </li>
              </ul>
              <div>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input ref='inputFile' type="file" accept="image/*" @change="uploadImg($event,0)"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="图片：">
            <div class='imgDiv1'>
              <ul>
                <li v-for="item in imgList" v-if="item.type==1">
                  <span @click='cancelImg(item)' class='el-icon-error'></span>
                  <img :src="item.imgBase64"/>
                </li>
              </ul>
              <div>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input ref='inputFile' type="file" accept="image/*" @change="uploadImg($event,1)"/>
              </div>
            </div>
          </el-form-item>
        </template>

      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {getBase64} from '../../commom/util.js'
  import {validateBlackSpace,validatePhone } from '../../commom/validator'

  export default {
    name: 'organization',
    components: {OrganTree},
    data() {
      return {
        map: {
          lnglat: '',
          zoom: 12,
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.model.lat = e.lnglat.lat
              this.model.lon = e.lnglat.lng
              this.model.zoom = 12
            }
          },
        },
        deviceName: '',
        tabHeight: '0',
        addDialogFormVisible: false,
        tableData: [],
        mapCustomResourceData: [],
        mapLayerResourceTypeData: [],
        deviceListModel: {
          draw: 0,
          length: 1000,
          param: {
            organId: "",
            searchKey: ""
          },
          start: 0,
        },
        model: {},
        imgList: [],
        deviceIdList: [],
        total: 0,
        filter: {
          orgId: 1,
          customResourceId: null,
          layerResourceTypeId: null,
          name: null,
          page: 1,
          rows: 10,
        },
        layerFilter: {
          customResourceId: 1
        },
        firstErr: null,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请填写资源名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '资源名称不能有空格',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请选填写资源地址',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '资源地址不能有空格',
            trigger: 'blur'
          }],
          tel: [{
            required: true,
            message: '请填联系电话',
            trigger: 'blur'
          },{
            validator: validatePhone,
            message: '电话不能有空格',
            trigger: 'blur'
          }],
          customResourceId: [{
            required: true,
            message: '请选择分组',
            trigger: 'blur'
          }],
          layerResourceTypeId: [{
            required: true,
            message: '请选择类型',
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
      this.filter.orgId = JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchMapCustomResource();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.mapResourceList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      // 加载分组选择数据
      _fetchMapCustomResource: debounce(async function () {
        const data = await Api.mapCustomResourceList.get().then(res => res.data)
        this.mapCustomResourceData = data.result;
        if (this.mapCustomResourceData && this.mapCustomResourceData.length > 0) {
          this.layerFilter.customResourceId = this.mapCustomResourceData[0].id;
          this._fetchMapLayerResourceType();
        }
      }, 100),
      // 加载类型选择数据
      _fetchMapLayerResourceType: debounce(async function () {
        const data = await Api.mapLayerResourceTypeList.get(this.layerFilter).then(res => res.data)
        this.mapLayerResourceTypeData = data.result;
      }, 100),
      // 分组选择事件
      changeCustomResource(val) {
        // 没有改变选择分组，不请求
        if (val == this.layerFilter.customResourceId) {
          return;
        }
        this.layerFilter.customResourceId = val
        this._fetchMapLayerResourceType();
      },
      cancel(item) {
        this.imgList.find((elem, index) => {
          if (elem === item) this.imgList.splice(index, 1)
        })
      },
      //预览图片
      handleUpload(e, type) {
        const files = e.target.files
        let imgPath = files[0].name;
        getBase64(files[0]).then(res => {
          this.imgList.push({
            'imgPath': imgPath,
            'imgBase64': res,
            'type': type,
          })

        })
        e.target.value = ''
      },
      editRow(row = {}) {
        this.deviceListModel.param.organId = this.filter.orgId
        Api.videoDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceIdList = res.data.result.data;
        })
        Api.getMapResource.get({}, {
          pathParams: {
            id: row.id
          }
        }).then(res => {
          this.model = res.data.result;
          this.model.deviceIdList = res.data.result.deviceList.map(item => {
            return item.gbDeviceId
          });
          console.log(this.model.deviceList)
          this.imgList = res.data.result.listImg;
          this.deviceName = res.data.result.gbDeviceName;
          if(res.data.result.lat == null)
            res.data.result.lat="";
          if(res.data.result.lon == null)
            res.data.result.lon=  "";

          this.map.lnglat = res.data.result.lat+ "," + res.data.result.lon;
          this.model.orgId = this.filter.orgId
          this.addDialogFormVisible = true
        })
      },
      addDialogForm() {
        this.deviceListModel.param.organId = this.filter.orgId
        Api.videoDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceIdList = res.data.result.data;
          this.model = {}
          this.model.orgId = this.filter.orgId
          this.imgList = []
          this.deviceName = ''
          this.addDialogFormVisible = true
          this.map.lnglat ='';
        })
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              this.model.listImg = this.imgList
              await Api.addMapResource.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchData()
                }).catch(() => {
                })
            } else {
              await Api.modifyMapResource.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.addDialogFormVisible = false
                this._fetchData()
              }).catch(() => {
              })
            }
            this.loading = false
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteMapResource.delete({}, {
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
      orgNodeClick([item = {}]) {
        this.filter.orgId = item.id || ''
        this._fetchData()
      },
      /*编辑上传图片*/
      uploadImg(e, type) {
        const files = e.target.files
        let imgPath = files[0].name;
        getBase64(files[0]).then(res => {
          Api.addMapResourceImg.post({
            'imgPath': imgPath,
            'imgBase64': res,
            'type': type,
            'resourceId': this.model.id
          }).then(() => {
            this.imgList.push({
              'imgPath': imgPath,
              'imgBase64': res,
              'type': type,
            })
          })
        })
        e.target.value = ''

      },
      /*编辑删除图片*/
      cancelImg(item) {
        console.log(item)
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteMapResourceImg.delete({}, {
            pathParams: {
              id: item.id
            }
          }).then(res => {
            this.imgList.find((elem, index) => {
              if (elem === item) this.imgList.splice(index, 1)
            })
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
    }
  };
</script>
<style lang="less">

</style>
