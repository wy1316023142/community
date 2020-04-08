<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">进出记录</span>

      <div class="text_r flexItem">
        <el-input type="text" placeholder="车主姓名"  v-model="filter.personName"></el-input>
        <el-input type="text" placeholder="门禁名称"  v-model="filter.deviceName"></el-input>
        <el-select v-model="filter.nonMotorizedVehicleType" placeholder="车辆类型" clearable>
          <el-option v-for="item in vehicleType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="filter.status" placeholder="状态" clearable>
          <el-option v-for="item in vehicleState"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree  @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column label="序号" align='center'   type="index"></el-table-column>
                <el-table-column prop="organName" label="所属小区" align='center'></el-table-column>
                <el-table-column prop="deviceName" label="门禁名称" align='center'></el-table-column>
                <el-table-column prop="nonMotorizedVehicleType" label="车辆类型" align='center'>
                  <template slot-scope="scope">
                    {{scope.row.nonMotorizedVehicleType|vehicleType}}
                  </template>
                </el-table-column>
                <el-table-column prop="personName" label="车主姓名" align='center'></el-table-column>
                <el-table-column prop="rfidNumber" label="RFID号" align='center'></el-table-column>
                <el-table-column prop="captureTime" label="开门时间" align='center'></el-table-column>
                <el-table-column prop="status" label="出入状态" align='center'>
                  <template slot-scope="scope">
                    {{scope.row.status|vehicleStatus}}
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="scope.row.status==0||scope.row.status==2"  @click="editRow(scope.row)">查看详情</el-button>
                    <el-button type="danger"  size="mini"  v-if="scope.row.status==1" @click="editRow(scope.row)">处理</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="进出记录" class="nonMotorized-dialog" :visible.sync="dialogFormVisible" :modal-append-to-body='false' :close-on-click-modal="false" width="40%" >
      <div>
        <div class="flex" nonMotorized-dialog-p>
          <p class="flexItem ">开门时间：{{model.captureTime}}</p>
          <p class="flexItem"></p>
          <p class="flexItem">状态：{{model.status | vehicleStatus}}</p>
        </div>
        <div class="flex nonMotorized-dialog-p">
          <p class="flexItem">所属小区：{{model.organName}}</p>
          <p class="flexItem">门禁名称：{{model.deviceName}}</p>
          <p class="flexItem">车辆类型: {{model.nonMotorizedVehicleType|vehicleType}}</p>
        </div>
        <div class="flex nonMotorized-dialog-p">
          <p class="flexItem">RFID号：{{model.rfidNumber}}</p>
          <p class="flexItem">车主姓名：{{model.personName}}</p>
          <p class="flexItem">车主电话：{{model.ownerPhone}}</p>
        </div>
      </div>
      <div class="nonMotorized-dialog-box">

        <div class="nonMotorized-dialog-cell">
          <h3>抓拍人脸图</h3>
          <div v-for="(item,index) in model.featureImageUrl" style="margin-top: 20px;">
            <el-image :src="item" fit="cover"></el-image>
          </div>
          <h3>抓拍场景图</h3>
          <div v-for="(item,index) in model.enviromentImageUrl" style="margin-top: 20px;">
            <el-popover   trigger="click" width="500">
              <el-image :src="item" width="500"></el-image>
              <el-image  slot="reference" :src="item" fit="cover"></el-image>
            </el-popover>
          </div>
        </div>

        <h3>全部非机动车所有者</h3>
        <div class="nonMotorized-dialog-cell">
          <div v-for="(item,index) in model.populations">
            <el-image :src="item.photoPath" fit="cover"></el-image>
            <p class="center">姓名:{{item.name}}</p>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="model.status==1" @click="dealRfidrecord(model.id,0)">解除嫌疑</el-button>
        <el-button type="danger" v-if="model.status==1" @click="dealRfidrecord(model.id,2)">标记为嫌疑车辆</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys ,cloneDeep } from 'lodash'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import { domHeightMixin } from '../../commom/mixins.js'
  import { nonMotorizedType } from '../../constants.js'
  import moment from 'moment'
  export default {
    mixins: [ domHeightMixin ],
    name: 'openDoorRecord',
    components: {OrganTree},
    data() {
      return {
        src:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        dialogFormVisible:false,
        tableData: [],
        model:{},
        total:0,
        time:[moment().subtract(1, "days"), moment().endOf('day')],
        filter: {
          organId: 0,
          page: 1,
          rows: 10,
          personName:'',
          startTime:'',
          endTime:'',
          deviceName:'',
          nonMotorizedVehicleType:'',
          status:''
        },
        firstErr:null,
        loading:false,
        vehicleType:[],
        vehicleState:[
          {id: 0, label: '正常'},
          {id: 1, label: '异常'},
          {id: 2, label: '嫌疑车辆'},
        ]
      }
    },
    mounted(){
      this.vehicleType=nonMotorizedType
      this.filter.organId=JSON.parse(sessionStorage.getItem('user')).organId
      this.filter.startTime=moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
      this.filter.endTime=moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.rfidRecordList.post(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      changeDate(val){
        if(val){
          this.filter.startTime=moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
          this.filter.endTime=moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
        }else {
          this.filter.startTime=''
          this.filter.endTime=''
        }
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this._fetchData()
      },
      async editRow(row){
        const data =await Api.getRfidrecord.get({},{
          pathParams: {
            id: row.id,
          }
        }).then(res => res.data.result)
        this.model=cloneDeep(row);
        this.model.enviromentImageUrl=data.enviromentImageUrl
        this.model.featureImageUrl=data.featureImageUrl
        this.model.populations=data.populations
        this.model.ownerPhone=data.ownerPhone
        this.dialogFormVisible=true
      },
      dealRfidrecord(id,status){
        this.$confirm(status==0?`确认要解除嫌疑？`:'标记为嫌疑', '提示', {
          type: 'warning'
        }).then(() => {
          Api.dealRfidrecord.put({
            id:id,
            status:status
          }).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this._fetchData()
            this.dialogFormVisible=false
          }).catch(() => {
            this.dialogFormVisible=false
          })
        }).catch(() => {
          this.dialogFormVisible=false
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    },
  };
</script>
<style lang="less">
  .nonMotorized-dialog{
    .nonMotorized-dialog-p{
      margin-top: 10px;
    }
    .el-dialog__body{
      padding-top: 10px;
    }
    .el-image{
      width: 100px;
      height: 100px;
    }
    .nonMotorized-dialog-box{
      h3{
        margin-top: 20px;
      }
    }
    .nonMotorized-dialog-cell{
      margin-top: 10px;
      overflow-x: auto;
      white-space: nowrap;
      &::-webkit-scrollbar {/*滚动条整体样式*/
        width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 10px;
      }
      &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius:20px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #535353;
      }
      &::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 20px;
        background: #EDEDED;
      }
    }
    .nonMotorized-dialog-cell>div{
      display: inline-block;
      margin-right: 15px;
    }
  }

</style>
