<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">告警设备管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="设备名称" v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="设备编号" v-model="filter.machineNumber"
                  clearable></el-input>
        <el-select v-model="filter.communicationStatus" placeholder="通讯状态" clearable>
          <el-option v-for="item in communicationStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
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
                <el-table-column prop="name" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="ip" label="设备IP" align='center'></el-table-column>
                <el-table-column prop="account" label="账号" align='center'></el-table-column>
                <el-table-column prop="password" label="密码" align='center'></el-table-column>
                <el-table-column prop="sipId" label="sip服务" align='center'
                                 :formatter="sipIdFormat"></el-table-column>
                <el-table-column prop="address" label="安装地址" align='center'></el-table-column>
                <el-table-column label="坐标" align='center'>
                  <template slot-scope="scope">
                    {{scope.row.locationy == null ? '-': scope.row.locationy +','+
                    (scope.row.locationx == null ? '-' : scope.row.locationx)}}
                  </template>
                </el-table-column>
                <el-table-column prop="manufacturerName" label="设备厂家"
                                 align='center'></el-table-column>
                <el-table-column prop="communicationStatusName" label="通讯状态"
                                 align='center'></el-table-column>
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
        <el-form-item label="设备名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="设备IP：" prop="ip">
          <el-input autocomplete="off" v-model="model.ip" maxLength="20"></el-input>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input autocomplete="off" v-model="model.account" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input autocomplete="off" v-model="model.password" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="sip服务: " prop="sipId">
          <el-select v-model="model.sipId">
            <el-option v-for="item in sipServerData"
                       :key="item.id"
                       :label="item.serverName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂家: " prop="manufacturer">
          <el-select v-model="model.manufacturer">
            <el-option v-for="item in manufactorData"
                       :key="item.typeCode"
                       :label="item.typeName"
                       :value="item.typeCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装地址: " prop="address">
          <el-input autocomplete="off" v-model="model.address" maxLength="64"></el-input>
        </el-form-item>
        <el-form-item label="关联视频：" class="videoBox" v-show="videoPositionHide">
          <el-input class="videoBoxInput" v-model="model.gbDeviceName"></el-input>
          <img src="../../assets/images/commom/a.png" alt="" class="videoBoxImg"
               @click="videoPositionShow">
        </el-form-item>
        <el-form-item label="坐标：">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover">
              <el-amap ref="map" :zoom="map.zoom" :events="map.events">
                <el-amap-marker :position="map.marker.position" visible='true'></el-amap-marker>
              </el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat"
                      suffix-icon="el-icon-location"></el-input>
          </el-popover>
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
  import {debounce, keys} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace, validateIp} from '../../commom/validator'

  export default {
    name: 'alarmPanel',
    components: {OrganTree},
    data() {
      return {
        map: {
          lnglat: '',
          zoom: 12,
          marker: {
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [121.59996, 31.197646]
          },
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.model.locationy = e.lnglat.lat
              this.model.locationx = e.lnglat.lng
              this.model.zoom = 12
              this.map.marker.position[1] = e.lnglat.lat
              this.map.marker.position[0] = e.lnglat.lng
              let position = this.map.marker.position;
              this.map.marker.position = [position[0], position[1]];
            }
          },
        },
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
        manufactorData: [],
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
          account: [{
            required: true,
            message: '请填设备账号',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备账号不能有空格',
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
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.organType = JSON.parse(sessionStorage.getItem('user')).organType;
      this._fetchSipServerData();
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
      _fetchSipServerData: debounce(async function () {
        const data = await Api.pageSipServer.get().then(res => res.data)
        this.sipServerData = data.rows
      }, 100),
      // 设备厂家
      _manufactorData: debounce(async function () {
        const data = await Api.getCommonType.get({
          typeLevel: 2,
          typeClassification: 8,
          parentTypeId: 801
        }).then(res => res.data)
        this.manufactorData = data.rows
      }, 100),
      // 编辑
      editRow(row = {}) {
        this.deviceSelectMode = [];
        this.dialogFormTitle = '编辑';
        this.model = row;
        this.model.organId = this.filter.organId
        if (row.locationx != null && row.locationy != null) {
          this.map.lnglat = row.locationy + ',' + row.locationx;
          this.map.marker.position[0] = row.locationx
          this.map.marker.position[1] = row.locationy
          let position = this.map.marker.position;
          this.map.marker.position = [position[0], position[1]];
        } else{
            this.map.lnglat=''
             this.map.marker.position=[121.59996, 31.197646]
          };
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
        this.model.organId = this.filter.organId
        this.videoPositionHide = true
        this.addDialogFormVisible = true
        this.map.lnglat = '';
        this.map.marker.position=[121.59996, 31.197646]
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
</style>
