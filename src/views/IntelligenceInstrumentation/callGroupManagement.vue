<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">呼叫组管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()" v-allow="700100401">新增</el-button>
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
                <el-table-column prop="groupName" label="呼叫组名称" align='center'></el-table-column>
                <el-table-column prop="account" label="呼叫组账号" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="700100402">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="700100403">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background
                               layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
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
        <el-form-item label="呼叫组名称：" prop="groupName">
          <el-input autocomplete="off" v-model="model.groupName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="呼叫组账号：" prop="account">
          <el-input autocomplete="off" v-model="model.account" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="关联设备：" class="deviceBox" v-show="devicePositionHide">
          <el-input class="deviceBoxInput" v-model="model.gbDeviceName"></el-input>
          <img src="../../assets/images/commom/a.png" alt="" class="deviceBoxImg"
               @click="devicePositionShow(model)">
        </el-form-item>
        <el-form-item label="关联用户：" class="userBox" v-show="userPositionHide">
          <el-input class="userBoxInput" v-model="model.userName"></el-input>
          <img src="../../assets/images/commom/a.png" alt="" class="userBoxImg"
               @click="userPositionShow(model)">
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 关联设备 -->
    <el-dialog title="关联报警设备" :visible.sync="devicePosition" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh"
               :before-close="clearDevicePosition">
      <template>
        <el-table style="width: 100%" ref="multipleDeviceTable" :data="deviceListData"
                  tooltip-effect="dark"
                  highlight-current-row @current-change="handleDeviceSelectionChange1"
                  @selection-change="handleDeviceSelectionChange2" :height='tabHeight'
                  :max-height="tabHeight">
          <el-table-column type="selection" width="60" label="选择" align="right"></el-table-column>
          <el-table-column prop="name" label="设备名称" align="left"></el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="clearDevicePosition">取 消</el-button>
        <el-button type="primary" @click="addDevicePosition" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 关联用户 -->
    <el-dialog title="关联用户" :visible.sync="userPosition" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh"
               :before-close="clearUserPosition">
      <template>
        <el-table style="width: 100%" ref="multipleUserTable" :data="userListData"
                  tooltip-effect="dark"
                  highlight-current-row @current-change="handleUserSelectionChange1"
                  @selection-change="handleUserSelectionChange2" :height='tabHeight'
                  :max-height="tabHeight">
          <el-table-column type="selection" width="60" label="选择" align="right"></el-table-column>
          <el-table-column prop="name" label="用户名称" align="left"></el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="clearUserPosition">取 消</el-button>
        <el-button type="primary" @click="addUserPosition" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace} from '../../commom/validator'

  export default {
    name: 'organization',
    components: {OrganTree},
    data() {
      return {
        dialogFormTitle: '',
        deviceName: '',
        tabHeight: '0',
        devicePositionHide: true,
        userPositionHide: true,
        addDialogFormVisible: false,
        addDialogFormDeviceVisible: false,
        addDialogFormUserVisible: false,
        devicePosition: false,
        userPosition: false,
        tableData: [],
        tableDeviceData: [],
        tableUserData: [],
        model: {},
        deviceListData: [],
        deviceSelectMode: [],
        userListData: [],
        userSelectMode: [],
        total: 0,
        organType: 1,
        filter: {
          organId: 1,
          groupName: null,
          page: 1,
          rows: 10,
        },
        firstErr: null,
        loading: false,
        rules: {
          groupName: [{
            required: true,
            message: '请填写呼叫组名称',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '呼叫组名称不能有空格',
            trigger: 'blur'
          }],
          account: [{
            required: true,
            message: '请填呼叫组账号',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '呼叫组账号不能有空格',
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
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.organType = JSON.parse(sessionStorage.getItem('user')).organType;
      this._fetchData();
      // 获取点位
      this._fetchDeviceData();
      this._fetchUserData();

    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.sipGreoupList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      _fetchDeviceData: debounce(async function () {
        const data = await Api.getAlarmPanelList.get({},{
          pathParams: {
            organId: this.filter.organId,
          }
        }).then(res => res.data)
        this.deviceListData = data.rows
      }, 100),
      _fetchUserData: debounce(async function () {
        const data = await Api.getSipUserList.get({}, {
          pathParams: {
            organId: this.filter.organId,
          }
        }).then(res => res.data)
        this.userListData = data.result
      }, 100),
      // 编辑
      editRow(row = {}) {
        console.log(row);

        this.deviceSelectMode = [];
        this.dialogFormTitle = '编辑';
        this.model = row;
        this.model.userName = '';
        this.model.gbDeviceName = '';
        this.model.organId = this.filter.organId
        if (this.model.userIds) {
          this.userListData.forEach((ite, index) => {
            if (this.model.userIds.indexOf(ite.userId) > -1) {
              this.model.userName += ite.name + ";";
            }
          })
        }
        if (this.model.deviceIds) {
          this.deviceListData.forEach((ite, index) => {
            if (this.model.deviceIds.indexOf(ite.deviceId) > -1) {
              this.model.gbDeviceName += ite.name + ";";
            }
          })
        }
        // 视频点位
        this.addDialogFormVisible = true
        this.devicePositionHide = true
        this.userPositionHide = true
      }
      ,
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addSipGreoup.post(this.model)
                  .then(() => {
                    this.$message({message: '新增成功', type: 'success'})
                    this.addDialogFormVisible = false
                    this._fetchData()
                  }).catch(() => {
                  })
            } else {
              await Api.editSipGreoup.put(this.model, {
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
      }
      ,
      async deleteRow(row) {
        this.$confirm(`确定要删除当前呼叫组？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteSipGreoup.delete({}, {
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
      }
      ,
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      }
      ,
      orgNodeClick([item = {}]) {
        this.organType = item.organType
        this.filter.organId = item.id || ''
        this._fetchData()
        // 获取点位
        this._fetchDeviceData();
        this._fetchUserData();
      },
      // 设备选择
      devicePositionShow(model) {
        this.addDialogFormDeviceVisible = false;
        this.devicePosition = true;
        var modelX=model.deviceIds.reverse()
        this.$nextTick(() => {
          this.$refs.multipleDeviceTable.clearSelection()
          for (let i = 0; i <  this.deviceListData.length; i++) {
            for (let j = 0; j < modelX.length; j++) {
                 if(modelX[j]==this.deviceListData[i].deviceId){
                   this.$refs.multipleDeviceTable.toggleRowSelection(this.deviceListData[i]);
                 }

               }
        }

        })


      }
      ,
      // 用户选择
      userPositionShow(model) {
        this.addDialogFormUserVisible = false;
        this.userPosition = true;
        var modelX=model.userIds.reverse()
        this.$nextTick(() => {
          this.$refs.multipleUserTable.clearSelection()
             for (let i = 0; i <  this.userListData.length; i++) {
               for (let j = 0; j < modelX.length; j++) {
                 if(modelX[j]==this.userListData[i].userId){
                   this.$refs.multipleUserTable.toggleRowSelection(this.userListData[i]);
                 }

               }
        }
        })

      }
      ,
      addUserPosition() {
        this.model.userIds = [];
        this.model.userName = "";
        const tableData = this.$refs.multipleUserTable.selection
        if (tableData.length < 1) {
          this.$message({
            showClose: true,
            message: '未选择用户',
            type: 'info'
          });
          this.$refs.multipleUserTable.clearSelection();
          this.userSelectMode = [];
        } else {
          this.userSelectMode = tableData;
          this.userSelectMode.forEach(item => {
            this.model.userIds.push(item.userId);
            this.model.userName += item.name + ";";
          })
        }
        this.addDialogFormUserVisible = true;
        this.userPosition = false;
      },
      clearUserPosition() {
        this.addDialogFormUserVisible = true;
        this.userPosition = false;
        this.userSelectMode = [];
      }
      ,
      addDevicePosition() {
        this.model.deviceIds = [];
        this.model.gbDeviceName = "";
        const tableData = this.$refs.multipleDeviceTable.selection
        if (tableData.length < 1) {
          this.$message({
            showClose: true,
            message: '未选择报警设备',
            type: 'info'
          });
          this.$refs.multipleDeviceTable.clearSelection();
          this.deviceSelectMode = [];
        } else {
          this.deviceSelectMode = tableData;
          this.deviceSelectMode.forEach(item => {
            this.model.deviceIds.push(item.deviceId);
            this.model.gbDeviceName += item.name + ";";
          })
        }
        this.addDialogFormDeviceVisible = true;
        this.devicePosition = false;
      }
      ,
      clearDevicePosition() {
        this.addDialogFormDeviceVisible = true;
        this.devicePosition = false;
        this.deviceSelectMode = [];
      }
      ,
      handleDeviceSelectionChange2(val) {
        // if (val.length > 4) {
        //   this.$refs.multipleDeviceTable.toggleRowSelection(val.pop(), false);
        //   this.$message({
        //     showClose: true,
        //     message: '最多支持4个点位',
        //     type: 'info'
        //   });
        // }
      }
      ,
      handleUserSelectionChange2(val) {
        // if (val.length > 4) {
        //   this.$refs.multipleUserTable.toggleRowSelection(val.pop(), false);
        //   this.$message({
        //     showClose: true,
        //     message: '最多支持4个点位',
        //     type: 'info'
        //   });
        // }
      }
      ,
      handleDeviceSelectionChange1(val) {
        this.$refs.multipleDeviceTable.toggleRowSelection(val);
      }
      ,
      handleUserSelectionChange1(val) {
        this.$refs.multipleUserTable.toggleRowSelection(val);
      }
      ,
      sipIdFormat(row, column) {
        let value = '';
        this.sipServerData.forEach(item => {
          if (item.id == row.sipId) {
            value = item.serverName;
            return false;
          }
        });
        return value;
      }
    }
  };
</script>
<style lang="less">
  .deviceBox, .userBox {
    position: relative;
  }

  .deviceBoxInput, .userBoxInput {
    width: 90%;
  }

  .deviceBoxImg, .userBoxImg {
    position: absolute;
    top: 30%;
    right: 0%
  }

  thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }

  .deviceTitle .userTitle {
    display: flex
  }
</style>

