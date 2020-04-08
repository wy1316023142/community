<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">呼叫组管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="addDialogForm">新增</el-button>
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
                <el-table-column prop="manufacturerName" label="名称" align='center'></el-table-column>
                <el-table-column prop="communicationStatusName" label="账号" align='center'></el-table-column>
                <el-table-column label="操作" align='center'  width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-press-escape="false" :modal-append-to-body='false' width="500px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="呼叫组名称" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="28"></el-input>
        </el-form-item>
        <el-form-item label="呼叫组账号" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="32"></el-input>
        </el-form-item>
           <el-form-item label="关联设备" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="32" type="textarea"></el-input>
        </el-form-item>
           <el-form-item label="关联用户" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="32" type="textarea"></el-input>
        </el-form-item>
         <!-- <p class="textareaBox">
            <span class="textareaTitle">关联设备</span> 
            <span class="qwe">关联设备</span>
             <textarea class="textarea" id="" cols="30" rows="8"></textarea>
          </p>
             <p class="textareaBox">
            <span class="textareaTitle">关联用户</span> 
            <span class="qwe">关联用户</span>
             <textarea class="textarea" id="" cols="30" rows="8"></textarea>
          </p> -->

      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 视频点位 -->
    <el-dialog title="视频点位" :visible.sync="videoPosition" :close-on-press-escape="false" :modal-append-to-body='false' width="400px" top="5vh" :before-close="clearPosition">
      <div class="videoTitle">
       <!-- <el-select placeholder="请选择机构" clearable>

        </el-select>-->
        <el-input type="text" placeholder="请输入点位名称" v-model="deviceListModel.param.searchKey" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchGbDeviceData()">搜索</el-button>
      </div>
      <template>
        <el-table style="width: 100%" ref="multipleTable" :data="deviceList" tooltip-effect="dark" highlight-current-row @current-change="handleSelectionSingleChange" @selection-change="handleSelectionChange" :height='tabHeight' :max-height="tabHeight">
          <el-table-column type="selection" width="60" label="选择" align="right"></el-table-column>
          <el-table-column prop="name" label="点位名称" align="left"></el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="clearPosition">取 消</el-button>
        <el-button type="primary" @click="addPosition" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {getBase64} from '../../commom/util.js'
  import {validateBlackSpace, validateIp } from '../../commom/validator'

  export default {
    name: 'callGroup',
    components: {OrganTree},
    data() {
      return {
        map: {
          lnglat: '',
          zoom: 12,
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.model.locationy = e.lnglat.lat
              this.model.locationx = e.lnglat.lng
              this.model.zoom = 12
            }
          },
        },
        dialogFormTitle:'',
        deviceName: '',
        tabHeight: '0',
        videoPositionHide: true,
        addDialogFormVisible: true,
        videoPosition: false,
        tableData: [],
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
        deviceList: [],
        deviceSelectMode:{},
        total: 0,
        organType:1,
        filter: {
          organId: 1,
          communicationStatus: null,
          name: null,
          machineNumber: null,
          page: 1,
          rows: 10,
        },
        communicationStatus: [
          {id: 0, label: '正常'},
          {id: 1, label: '离线'}
        ],
        manufactorData:[],
        firstErr: null,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请填写设备名称',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备名称不能有空格',
            trigger: 'blur'
          }],
          machineNumber: [{
            required: true,
            message: '请填设备编号',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备编号不能有空格',
            trigger: 'blur'
          }],
          ip: [{
            required: true,
            message: '请填设备IP',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备IP不能有空格',
            trigger: 'blur'
          }, {
            validator: validateIp,
            message: '设备IP不正确',
            trigger: 'blur'
          }],
          manufacturer: [{
            required: true,
            message: '请选择设备厂家',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请填写安装地址',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '资源地址不能有空格',
            trigger: 'blur'
          }]
        }
      }
    },

    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight = this.$refs.content.offsetHeight - 56
        window.onresize = () => {
          this.tabHeight = this.$refs.content.offsetHeight - 56
        };
      })
      this.filter.organId = JSON.parse(localStorage.getItem('user')).organId;
      this.organType = JSON.parse(localStorage.getItem('user')).organType;
      this._fetchData();
      this._manufactorData(); //获取报警盘厂家
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.pagingAlarmPanel.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      // 设备厂家
      _manufactorData: debounce(async function () {
        const data = await Api.getCommonType.get({
          typeLevel:2,
          typeClassification:8,
          parentTypeId:801
        }).then(res => res.data)
        this.manufactorData = data.rows
      }, 100),
      // 编辑
      editRow(row = {}) {
        this.dialogFormTitle ='编辑';
        this.model = row;
        this.model.organId = this.filter.organId
        if(row.locationx != null && row.locationy != null){
          this.map.lnglat = row.locationy + ',' + row.locationx;
        }
        this.deviceListModel.param.organId = this.filter.organId
        Api.gbDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceList = res.data.result.data;
          this.deviceList.forEach(item => {
            if (item.id == row.gbDeviceId) {
              this.deviceSelectMode = item;
              this.model.gbDeviceName = item.name;
            }
          })
        })
        // 视频点位
        this.addDialogFormVisible = true
        this.videoPositionHide = true
      },
      addDialogForm() {
        if (this.organType == 1) {
          this.$message({message: '业务机构才能新增', type: 'info'});
          return;
        }
        this.dialogFormTitle ='新增';
        this.model = {}
        this.model.organId = this.filter.organId
        this.videoPositionHide = true
        this.addDialogFormVisible = true
        this.map.lnglat = '';
        this.deviceListModel.param.organId = this.filter.organId
        this.deviceName = ''
        Api.gbDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceList = res.data.result.data;
        })
      },
      // 视频点位
      _fetchGbDeviceData(){
        Api.gbDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceList = res.data.result.data;
          this.$nextTick(()=>{
            this.$refs.multipleTable.toggleRowSelection(this.deviceSelectMode)
          })
        })
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addAlarmPanel.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchData()
                }).catch(() => {
                })
            } else {
              await Api.editAlarmPanel.put(this.model, {
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
        this.$confirm(`确定要删除当前设备？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteAlarmPanel.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchData()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除出现错误!'
            })
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
        this.organType = item.organType
        this.filter.organId = item.id || ''
        this._fetchData()
      },
      // 视频点位选择
      videoPositionShow() {
        this.addDialogFormVisible = false;
        this.videoPosition = true;
        this.$nextTick(()=>{
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(this.deviceSelectMode)
        })

      },
    addPosition() {
      const tableData = this.$refs.multipleTable.selection
      if(tableData.length == 0){
        this.$message({
          showClose: true,
          message: '未选择点位',
          type: 'info'
        });
        this.model.gbDeviceId = null;
        this.model.gbDeviceName = null;
      }else{
        this.deviceSelectMode = tableData[0];
        this.model.gbDeviceId = this.deviceSelectMode.id;
        this.model.gbDeviceName = this.deviceSelectMode.name;
      }
      this.addDialogFormVisible = true;
      this.videoPosition = false;
      },
      clearPosition(){
        this.addDialogFormVisible = true;
        this.videoPosition = false;
        this.deviceSelectMode = [];
      },
      handleSelectionChange(val) {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(val.pop())
        }
      },
      handleSelectionSingleChange(val){
        this.$refs.multipleTable.toggleRowSelection(val)
      }
    }
  };
</script>
<style lang="less">
  .videoBox {
    position: relative;
    .videoBoxInput {
      width: 90%;
    }
    .videoBoxImg {
      position: absolute;
      top: 30%;
      right: 0%
    }
  }
  thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
  .videoTitle {
    display: flex
  }
  .contentBox{
  span{
     color: #b9bbbe;
     margin-right: 20px;
     margin-left: 10px;
  }
  p{
    margin-top: 10px;
  }
  .mesgBox{
    .el-form-item__label{
      color: #b9bbbe;
      margin-left: 7px;
      width: 20%!important; 
    }
  }
}
  .textareaBox{
  position: relative;
  .textarea{
    border: 1px solid gray
  }
  .textareaTitle{
  position: absolute;
  top: 0;
  left: 0;
  }
  .qwe{
  color: white;
  }
}
</style>
