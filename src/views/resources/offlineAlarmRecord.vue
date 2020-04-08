<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">离线告警记录</p>
      <div class="flexItem text_r">
        <el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>
        <el-input type="text" placeholder="设备编号" v-model="filter.sourceCode" clearable></el-input>
        <el-input type="text" placeholder="设备名称" v-model="filter.alarmContent" clearable></el-input>
        <el-select v-model="filter.isNoHandle" placeholder="处理状态" clearable>
          <el-option v-for="item in handleStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="filter.sourceType" placeholder="设备类型" clearable>
          <el-option v-for="item in equipmentType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-date-picker @change="changeDate" v-model="time1" type="datetimerange" range-separator="至"
                        start-placeholder="告警开始日期" end-placeholder="告警结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="batchIgnore()">批量忽略</el-button>
        <el-button type="primary" size="small" @click="batchHadle()">批量处理</el-button>
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
              <el-table class="tableLoading" :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight"
                        @selection-change="handleSelectionChange" tooltip-effect="dark">
                <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
                <el-table-column prop="organName" label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="extend.machineNumber" label="设备编号" align='center'></el-table-column>
                <el-table-column prop="extend.deviceType" label="设备类型" align='center'>
                  <template slot-scope="scope">
                    <template v-if="scope.row.extend.deviceType=='IDT2'">门禁设备</template>
                    <template v-if="scope.row.extend.deviceType=='IDT4'">报警盘</template>
                    <template v-if="scope.row.extend.deviceType=='IDT5'">烟感设备</template>
                    <template v-if="scope.row.extend.deviceType=='IDT6'">消防栓设备</template>
                    <template v-if="scope.row.extend.deviceType=='IDT7'">井盖设备</template>
                  </template>
                </el-table-column>
                <el-table-column prop="extend.deviceName" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="organName" label="所属机构" align='center' width="200"></el-table-column>
                <!-- <el-table-column prop="houseAddress" label="设备厂家" align='center' width="200"> </el-table-column> -->
                <el-table-column prop="alarmContent" label="告警内容" align='center' width="100"></el-table-column>
                <el-table-column prop="extend.alarmTimeStr" label="告警时间" align='center' width="100"></el-table-column>
                <el-table-column prop="poType" label="处理状态" align='center' width="100">
                  <template slot-scope="scope">
                    <template v-if="scope.row.status=='0'">待处理</template>
                    <template v-if="scope.row.status=='2'">已完成</template>
                    <template v-if="scope.row.status=='3'">已忽略</template>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleBtn(scope.row)"
                               v-if="scope.row.status==0||scope.row.status==1">处理
                    </el-button>
                    <el-button type="primary" size="mini" @click="ignoreBtn(scope.row)"
                               v-if="scope.row.status==0||scope.row.status==1">忽略
                    </el-button>
                    <el-button type="primary" size="mini" @click="jumpDetail(scope.row)">查看详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" @size-change="handleSizeChange"
                               background layout="prev, pager, next, total ,sizes" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'
                               :page-sizes="[10, 20, 50]">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" :close-on-click-modal="false"
               :modal-append-to-body='false' width="476px">
      <el-form>
        <div class="contentBox">
          <div v-show="batchIgnoreHide">
            <p><span>设备名称 : </span>{{alarmDetailsExtendData.deviceName}}</p>
            <p><span>报警时间 : </span>{{alarmDetailsExtendData.alarmTimeStr}}</p>
            <p><span>所属机构 : </span>{{alarmDetails.organName}}</p>
            <p><span>安装地址 : </span>{{alarmDetailsExtendData.address || alarmDetailsExtendData.deviceName}}</p>
            <p><span>设备编号 : </span>{{alarmDetailsExtendData.machineNumber}}</p>
          </div>
          <el-form-item label="处理结果 : " class="mesgBox">
            <el-input type="textarea" v-model="deviceAlarmModel.feedbackContent"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible =false">取 消</el-button>
        <el-button type="primary" @click="panelHandle(alarmDetails.alarmState)" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from "../../commom/api.js";
  import {debounce, keys, cloneDeep} from "lodash";
  import OrganTree from "../../components/OrganTree.vue";
  import {domHeightMixin} from "../../commom/mixins.js";
  import moment from 'moment'
  import bus from '@/commom/bus.js'

  export default {
    mixins: [domHeightMixin],
    name: "offlineAlarmRecord",
    components: {
      OrganTree
    },
    data() {
      return {
        batchIgnoreHide: true,
        checked: false,
        dataContent: {},
        expireTimeOption: {
          disabledDate(date) {
            //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
            return date.getTime() < Date.now() - 8.64e7;
          }
        },
        model: {},
        time1: '',
        deviceAlarmModel: {},
        tableData: [],
        alarmDetails: {},
        total: 0,
        filter: {
          page: 1,
          rows: 10,
          organPath: '',
          organId: JSON.parse(sessionStorage.getItem("user")).organId,
          alarmType1:9
        },
        num: '',
        person: '',
        dialogTitle: '',
        holderTitle: '',
        loading: false,
        editFormVisible: false,
        handleStatus: [
          {id: 1, label: '待处理'},
          {id: 2, label: '已完成'},
        ],
        equipmentType: [
          {id: 'IDT2', label: '门禁设备'},
          {id: 'IDT4', label: '报警盘'},
          {id: 'IDT5', label: '烟感设备'},
          {id: 'IDT6', label: '消防栓智能闷盖'},
          {id: 'IDT7', label: '井盖检测设备'},
        ],
        holderData: [],
        batchData: [],
        rules: {},
        uploadBatchData: {},
        organPath: JSON.parse(sessionStorage.getItem("user")).organPath,
        organId: JSON.parse(sessionStorage.getItem("user")).organId,
        alarmDetailsExtendData: {}
      };
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight = this.$refs.content.offsetHeight - 56
        window.onresize = () => {
          this.tabHeight = this.$refs.content.offsetHeight - 56
        };
      });

      if (this.$route.params.filter) {
        this.filter = this.$route.params.filter
      }
      if (this.$route.params.organPath) {
        this.filter.organPath = this.$route.params.organPath
        this.filter.organId = ''
      }
      this._fetchData();
    },
    methods: {
      handCkChange(val) {
        if(val){
          this.filter.organId = null
          this.filter.organPath = this.organPath
        }else {
          this.filter.organId = this.organId
          this.filter.organPath = null
        }
        this._fetchData();
      },
      changeDate(val) {
        if (val) {
          this.filter.beginTime = moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
          this.filter.endTime = moment(val[1]).format("YYYY-MM-DD HH:mm:ss");
        } else {
          this.filter.beginTime = ''
          this.filter.endTime = ''
        }
      },
      _fetchData: debounce(async function () {
        if(this.checked){
          this.filter.organId = null
          this.filter.organPath = this.organPath
        }else {
          this.filter.organId = this.organId
          this.filter.organPath = null
        }
        const data = await Api.getAlarmData
          .get(this.filter, {
            loadingMaskTarget: ".tableLoading"
          })
          .then(res => res.data);
        this.tableData = data.rows
        this.total = data.total;
      }, 100),
      //处理请求
      async panelHandle(alarmState) {
        //单个处理
        if (this.batchIgnoreHide == true) {
          Api.deviceAlarm.put(this.deviceAlarmModel, {
            pathParams: {
              id: this.alarmDetails.id,
              alarmState: 2
            }
          }).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this._fetchData()
            this.editFormVisible = false
            bus.$emit('alarmDataNum', null)
          })
        } else {
          //批量处理
          this.uploadBatchData.handleContent = this.deviceAlarmModel.feedbackContent
          Api.batchHandle.post(this.uploadBatchData).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this._fetchData()
            this.editFormVisible = false
          })
        }
      },
      //批量处理
      batchHadle() {
        if (this.batchData.length > 0) {
          this.dialogTitle = '门禁离线告警处理'
          this.batchIgnoreHide = false
          this.editFormVisible = true
          var id = []
          this.batchData.map(item => {
            id.push(item.id)
          })
          this.uploadBatchData.alarmIds = id
          this.uploadBatchData.status = 2
        } else {
          this.$message({message: '请勾选才能批量处理', type: 'warning'});
        }
      },
      //批量忽略
      batchIgnore() {
        if (this.batchData.length > 0) {
          var id = []
          this.batchData.map(item => {
            id.push(item.id)
          })
          this.uploadBatchData.alarmIds = id
          this.uploadBatchData.status = 3
          this.ignore('确定要忽略已选中的离线告警记录')
        } else {
          this.$message({message: '请勾选才能批量忽略', type: 'warning'});
          this._fetchData();
        }
      },
      //忽略请求
      ignore(message) {
        if (message == '确定要忽略已选中的离线告警记录') {
          this.$confirm(message, '提示', {
            type: 'warning'
          }).then(async () => {
            const data = await Api.batchHandle.post(this.uploadBatchData).then(res => {
              this.$message({message: '操作成功', type: 'success'});
              this._fetchData();
            })
          })
        } else {
          this.$confirm(message, '提示', {
            type: 'warning'
          }).then(async () => {
            const data = await Api.deviceAlarm.put({}, {
              pathParams: {
                id: this.alarmDetails.id,
                alarmState: 3
              }
            }).then(res => {
              this.$message({message: '操作成功', type: 'success'});
              this._fetchData();
            })
          })
        }
      },
      ignoreBtn(row) {
        this.alarmDetails = row
        this.ignore('确定要忽略该条离线')
      },
      handleBtn(row) {
        this.dialogTitle = '离线告警处理'
        this.editFormVisible = true
        this.alarmDetails = row
        this.alarmDetailsExtendData = row.extend
        this.batchIgnoreHide = true
      },
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      handleSizeChange(val) {
        this.filter.rows = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.organPath = item.path
        this.organId = item.id
        this._fetchData();
      },
      handleSelectionChange(val) {
        this.batchData = val
      },
      jumpDetail(row) {
        this.$router.push({name: 'offlineRecordDetails', params: {row: row, filter: this.filter}})
      },
      //处理和忽略的不能被批量操作
      selectable(row, index) {
        if (row.status == 2 || row.status == 3) {
          return false//禁用
        } else {
          return true
        }
      }
    }
  };
</script>
<style lang="less">
  .dialogTR {
    text-align: right;
  }

  .contentBox {
    span {
      color: #b9bbbe;
      margin-right: 20px;
      margin-left: 10px;
    }
    p {
      margin-top: 10px;
    }
    .mesgBox {
      .el-textarea {
        margin-top: 10px;
      }
      .el-form-item__label {
        color: #b9bbbe;
        margin-left: 10px;
        width: 20% !important;
        text-align: left !important;
      }
    }
  }
</style>
