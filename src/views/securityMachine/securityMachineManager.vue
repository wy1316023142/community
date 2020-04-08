<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">保安机管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="设备名称" v-model="filter.safeMachineName" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchDataOne()">搜索</el-button>
        <el-button type="primary" size="small" @click="addDialogForm" v-allow="700100101">新增</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight'
                        :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="safeMachineOrganName" label="所属小区" align='center'></el-table-column>
                <el-table-column prop="safeMachineName" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="safeMachineNo" label="设备编号" align='center'></el-table-column>
                <el-table-column prop="safeMachineAddress" label="安装地址" align='center'></el-table-column>
                <el-table-column prop="safeMachineIp" label="ip地址" align='center'></el-table-column>
                <el-table-column prop="safeMachineUname" label="用户名" align='center' ></el-table-column>
                <el-table-column prop="safeMachineUpwd" label="密码" align='center'></el-table-column>
                <el-table-column  prop="safeMachineStatus" label="状态" align='center'>
                   <template slot-scope="scope" >
                         {{scope.row.safeMachineStatus | securityState}}
                      </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="700100102">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="700100103">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background
                               layout="prev, pager, next, total" :total='total'
                               :page-size='filter.pageSize' :current-page='filter.pageNo'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="addDialogFormVisible"
               :close-on-press-escape="false" :modal-append-to-body='false' width="500px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="设备名称：" prop="safeMachineName">
          <el-input autocomplete="off" v-model="model.safeMachineName" maxLength="32"></el-input>
        </el-form-item>
          <el-form-item label="设备编号: " prop="safeMachineNo">
          <el-input autocomplete="off" v-model="model.safeMachineNo" maxLength="64"></el-input>
        </el-form-item>
          <el-form-item label="安装地址: " prop="safeMachineAddress">
          <el-input autocomplete="off" v-model="model.safeMachineAddress" maxLength="64"></el-input>
        </el-form-item>
        <el-form-item label="IP地址：" prop="safeMachineIp">
          <el-input autocomplete="off" v-model="model.safeMachineIp" maxLength="20"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="safeMachineUname">
          <el-input autocomplete="off" v-model="model.safeMachineUname" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="safeMachineUpwd">
          <el-input autocomplete="off" v-model="model.safeMachineUpwd" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="关联保安机" class="videoBox" v-show="videoPositionHide">
          <el-input class="videoBoxInput" v-model="model.safeMachineMachine"></el-input>
          <img src="../../assets/images/commom/a.png" alt="" class="videoBoxImg"
               @click="videoPositionShow">
        </el-form-item>
        <el-form-item label="关联视频：" class="videoBox" v-show="videoPositionHide">
          <el-input class="videoBoxInput" v-model="model.safeMachineVideoUrl"></el-input>
          <img src="../../assets/images/commom/a.png" alt="" class="videoBoxImg"
               @click="videoPositionShow">
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 视频点位 -->
    <el-dialog title="视频点位" :visible.sync="videoPosition" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh"
               :before-close="clearPosition">
      <div class="videoTitle">
        <el-input type="text" placeholder="请输入点位名称" v-model="deviceListModel.param.searchKey"
                  clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchGbDeviceData()">搜索</el-button>
      </div>
      <template>
        <el-table style="width: 100%" ref="multipleTable" :data="deviceList"
                  tooltip-effect="dark"
                  highlight-current-row @current-change="handleSelectionSingleChange"
                  @selection-change="handleSelectionChange" :height='tabHeight'
                  :max-height="tabHeight">
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
  import { debounce, keys, cloneDeep } from "lodash";
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace, validateIp} from '../../commom/validator'

  export default {
    name: 'alarmPanel',
    components: {OrganTree},
    data() {
      return {
        selectionB: 'true',
        dialogFormTitle: '',
        deviceName: '',
        tabHeight: '0',
        videoPositionHide: true,
        addDialogFormVisible: false,
        videoPosition: false,
        tableData: [],
        sipServerData: [],
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
        deviceSelectMode: [],
        total: 0,
        organType: 1,
        filter: {
          // organId: 1,
          pageNo: 1,
          pageSize: 10,
        },
        communicationStatus: [
          {id: 0, label: '正常'},
          {id: 1, label: '离线'}
        ],
        manufactorData: [],
        firstErr: null,
        loading: false,
        rules: {
          safeMachineName: [{
            required: true,
            message: '请填写设备名称',
            trigger: 'blur'
          }, ],
           safeMachineNo:[{
            required: true,
            message: '请填写设备编号',
            trigger: 'blur'
          }],
          safeMachineUname: [{
            required: true,
            message: '请填用户名',
            trigger: 'blur'
          },],
          safeMachineUpwd:[{
            required: true,
            message: '请填密码',
            trigger: 'blur'
          },],
          safeMachineIp: [{
            required: true,
            message: '请填设备IP',
            trigger: 'blur'
          },],
          manufacturer: [{
            required: true,
            message: '请选择设备厂家',
            trigger: 'blur'
          }],
          safeMachineAddress: [{
            required: true,
            message: '请填写安装地址',
            trigger: 'blur'
          }, ],
         
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
      this.filter.safeMachineOrganId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.organType = JSON.parse(sessionStorage.getItem('user')).organType;
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        delete this.filter.organId
        const data = await Api.securityPageList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.result.records
        this.total = data.result.total
      }, 100),
      //模糊查询
       _fetchDataOne: debounce(async function () {
        delete this.filter.organId
        const data = await Api.securityOne.get({}, {
          // loadingMaskTarget: '.tableShow'
           pathParams: {
                  name: this.filter.safeMachineName,
                  safeMachineOrganId:this.filter.safeMachineOrganId

                }
        }).then(res => res.data)
        this.tableData = data.result
        // this.total = data.result.total
      }, 100),
      // 编辑
      editRow(row = {}) {
        this.deviceSelectMode = [];
        this.dialogFormTitle = '编辑';
        this.model = cloneDeep(row)
        this.model.safeMachineOrganId = this.filter.safeMachineOrganId
        this.deviceListModel.param.organId = this.filter.organId
        // 获取点位
        Api.gbDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceList = res.data.result.data;
          if (this.model.cameraIds) {
            let filter = this.deviceList.filter(item => {
              return this.model.cameraIds.includes(item.id);
            });
            this.deviceSelectMode = filter;
            this.model.gbDeviceName = "";
            filter.forEach(item => this.model.gbDeviceName += item.name + ';')
          }
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
        this.deviceSelectMode = [];
        this.dialogFormTitle = '新增';
        this.model = {}
        this.model.safeMachineOrganId = this.filter.safeMachineOrganId
        this.videoPositionHide = true
        this.addDialogFormVisible = true
        this.deviceListModel.param.organId = this.filter.organId
        this.deviceName = ''
        Api.gbDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceList = res.data.result.data;
        })
      },
      // 视频点位
      _fetchGbDeviceData() {
        Api.gbDeviceList.post(this.deviceListModel).then((res) => {
          this.deviceList = res.data.result.data;
          this.$nextTick(() => {
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
              await Api.addSecurity.post(this.model)
                  .then(() => {
                    debugger
                    this.$message({message: '新增成功', type: 'success'})
                    this.addDialogFormVisible = false
                    this._fetchData()
                  }).catch(() => {
                  })
            } else {
              await Api.editSecurity.put(this.model, {
                // pathParams: {
                //   id: this.model.id
                // }
              }).then(() => {
                debugger
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
          const data = await Api.DelesecurityPageList.delete({ id: row.id}, {
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
        this.filter.safeMachineOrganId = item.id || ''
        this._fetchData()
      },
      // 视频点位选择
      videoPositionShow() {
        this.addDialogFormVisible = false;
        this.videoPosition = true;
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection()
          this.deviceSelectMode.forEach(item => {
            this.$refs.multipleTable.toggleRowSelection(item);
          })
        })

      },
      addPosition() {
        this.model.cameraIds = [];
        this.model.gbDeviceName = "";
        const tableData = this.$refs.multipleTable.selection
        if (tableData.length < 1) {
          this.$message({
            showClose: true,
            message: '未选择点位',
            type: 'info'
          });
          this.deviceSelectMode = [];
          this.$refs.multipleTable.clearSelection();
        } else {
          this.deviceSelectMode = tableData;
          this.deviceSelectMode.forEach(item => {
            this.model.cameraIds.push(item.id);
            this.model.gbDeviceName += item.name + ";";
          })
        }
        this.addDialogFormVisible = true;
        this.videoPosition = false;
      },
      clearPosition() {
        this.addDialogFormVisible = true;
        this.videoPosition = false;
        this.deviceSelectMode = [];
      },
      handleSelectionChange(val) {
        if (val.length > 4) {
          this.$refs.multipleTable.toggleRowSelection(val.pop(), false);
          this.$message({
            showClose: false,
            message: '最多支持4个点位',
            type: 'info'
          });
        }
      },
      handleSelectionSingleChange(val) {
        this.$refs.multipleTable.toggleRowSelection(val);
      },
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
      right: 0%;
      cursor: pointer;
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
</style>
