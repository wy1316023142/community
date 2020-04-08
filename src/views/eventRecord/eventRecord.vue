<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">上报事件记录</span>

      <div class="text_r flexItem">
        <el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>
        <el-input type="text" placeholder="上报人"  v-model="filter.reportUserName" clearable></el-input>
        <el-input type="text" placeholder="事件编号"  v-model="filter.recordNumber" clearable></el-input>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-select v-model="filter.eventStatus" placeholder="事件状态" clearable>
          <el-option v-for="item in eventStatusData"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
        <el-select v-model="filter.eventType" placeholder="事件类型" clearable>
          <el-option v-for="item in eventTypeData"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key">
          </el-option>
        </el-select>
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
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index" width="50"></el-table-column>
                <el-table-column prop="recordNumber" label="事件编号" align='center' width="150"></el-table-column>
                <el-table-column prop="organName" label="上报小区" align='center'></el-table-column>
                <el-table-column prop="reportUserName" label="上报人" align='center'></el-table-column>
                <el-table-column prop="reportUserTel" label="上报人电话" align='center' width="150"></el-table-column>
                <el-table-column prop="reportTime" label="上报时间" align='center' width="160"></el-table-column>
                <el-table-column  label="事件描述" align='center'>
                  <div slot-scope="scope" class="twoLine">
                    {{scope.row.eventContent}}
                  </div>
                </el-table-column>
                <el-table-column prop="handleUserName" label="处理人" align='center' width="150"></el-table-column>
                <el-table-column prop="eventStatus" label="事件状态" align='center'>
                  <template slot-scope="scope" >
                    <template v-if="scope.row.eventStatus==1">待处理</template>
                    <template v-if="scope.row.eventStatus==2">已处理</template>
                  </template>
                </el-table-column>
                <el-table-column prop="eventTypeStr" label="事件类型" align='center'></el-table-column>
                <el-table-column label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-if="scope.row.eventStatus==1">处理</el-button>
                    <el-button type="danger" size="mini" @click="seeDetails(scope.row)" v-if="scope.row.eventStatus==2">查看详情</el-button>
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

    <el-dialog  title="报警盘报警" :visible.sync="alarmRecord" :close-on-press-escape="false" :modal-append-to-body='false' width="400px" top="5vh">
      <el-form>
        <div class="contentBox">
          <p><span>报警内容</span>{{model.content}}</p>
          <p><span>报警时间</span>{{model.alarmTimeStr}}</p>
          <p><span>所属机构</span>{{model.organName}}</p>
          <p><span>安装地址</span>{{model.address}}</p>
          <p><span>设备编号</span>{{model.machineNumber}}</p>
          <el-form-item label="反馈信息" class="mesgBox" v-show="mesgBoxShow">
            <el-input type="textarea"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="alarmRecord =false">取 消</el-button>
        <el-button type="primary" @click="addPosition(status)" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys } from 'lodash'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import moment from 'moment'
  import { domHeightMixin ,pageMixin } from '../../commom/mixins.js'

  export default {
    mixins: [ domHeightMixin,pageMixin ],
    name: 'alarmRecord',
    components: {OrganTree},
    data() {
      return {
        chlidData:[],
        mesgBoxShow:false,

        alarmRecord:false,
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        total:0,
        status:0,
        time:[moment().subtract(1, "days"), moment().endOf('day')],
        checked: false,
        filter: {
          organId: 1,
          startTime:moment().subtract(1, "days").format('YYYY-MM-DD HH:mm:ss'),
          endTime:moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          xj:1,
          eventStatus:''
        },
        firstErr:null,
        loading:false,
        eventTypeData: [
          {key: '1', value: '卫生环境'},
          {key: '2', value: '公共设施'},
          {key: '3', value: '乱停乱放'},
          {key: '4', value: '其它'},
        ],
        eventStatusData: [
          {key: 1, value: '待处理'},
          {key: 2, value: '已完成'},
        ],
      }
    },
    mounted(){
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this.filter.organId=JSON.parse(sessionStorage.getItem('user')).organId
      this.filter.organName = JSON.parse(sessionStorage.getItem('user')).organName;
      this.organType=JSON.parse(sessionStorage.getItem('user')).organType;
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.getEventList.get(this.filter).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),

      changeDate(val){
        if(val){
          this.filter.startTime=moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
          this.filter.endTime=moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
        }else {
          this.filter.startTime=''
          this.filter.endTime=''
        }

      },
      handCkChange(val){
        this.filter.xj = (val ? 0: 1)
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this._fetchData()
      },
      editRow(row){
        this.$router.push({ name: 'eventHandle', params: { eventId: row.id }})
      },

      seeDetails(row){
        this.$router.push({ name: 'eventFeedback', params: { eventId: row.id }})
      },
      addPosition(status){
        if(status==0){
          this.mesgBoxShow=true
        }
      },

    },
  };
</script>
<style lang="less">
  .twoLine{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
</style>
