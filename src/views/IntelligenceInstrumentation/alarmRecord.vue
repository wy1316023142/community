<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">一键报警记录</span>

      <div class="text_r flexItem">
        <el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>
        <el-input type="text" placeholder="设备名称"  v-model="filter.alarmContent" clearable></el-input>
        <el-input type="text" placeholder="设备编号"  v-model="filter.sourceCode" clearable></el-input>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-select v-model="filter.alarmType2" placeholder="报警内容" clearable>
            <el-option v-for="item in contentData"
                      :key="item.key"
                      :label="item.value"
                      :value="item.key">
            </el-option>
        </el-select>
        <el-select v-model="filter.status" placeholder="处理状态" clearable>
            <el-option v-for="item in alarmStateData"
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
          <organ-tree  @node-click="orgNodeClick" :activeKey="activeKey"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="extend.deviceName" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="extend.machineNumber" label="设备编号" align='center'></el-table-column>
                <el-table-column prop="extend.address" label="安装地址" align='center'></el-table-column>
                <el-table-column prop="extend.content" label="报警内容" align='center'></el-table-column>
                <el-table-column prop="extend.alarmTimeStr" label="报警时间" align='center'></el-table-column>
                <el-table-column prop="status" label="处理状态" align='center'>
                  <template slot-scope="scope">
                    <template v-if="scope.row.status=='0'">待确认</template>
                    <template v-if="scope.row.status=='1'">待反馈</template>
                    <template v-if="scope.row.status=='2'">已完成</template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-if="scope.row.status==0">确认</el-button>
                    <el-button type="danger" size="mini" @click="editRow(scope.row)" v-if="scope.row.status===1">反馈</el-button>
                    <el-button type="danger" size="mini" @click="seeDetails(scope.row)" v-if="scope.row.status==2">查看详情</el-button>
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
          <p><span>报警内容</span>{{extend.content}}</p>
          <p><span>报警时间</span>{{extend.alarmTimeStr}}</p>
          <p><span>所属机构</span>{{model.organName}}</p>
          <p><span>安装地址</span>{{extend.address}}</p>
          <p><span>设备编号</span>{{extend.machineNumber}}</p>
          <el-form-item label="反馈信息" class="mesgBox" v-show="mesgBoxShow">
            <el-input type="textarea" v-model="filter.feedbackMeg"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button @click="alarmRecord =false">取 消</el-button>
            <el-button type="primary" @click="addPosition(model.status)" :loading="loading">确 定</el-button>
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
        organId: '',
        organPath:'',
        chlidData:[],
        mesgBoxShow:false,
        alarmRecord:false,
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        activeKey:0,
        model:{},
        extend:{},
        total:0,
        status:0,
        time:[moment().subtract(1, "days"), moment().endOf('day')],
        checked: false,
        filter: {
          organId: 1,
          organPath:'',
          alarmContent:'',
          sourceCode:'',
          alarmType2:'',
          startTime:moment().subtract(1, "days").format('YYYY-MM-DD HH:mm:ss'),
          endTime:moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          xj:1,
          status:'',
          sourceType:'IDT4',
          feedbackMeg:''
        },
        deviceAlarmModel:{
        feedbackContent:''
        },
        firstErr:null,
        loading:false,
        alarmStateData: [
          {key: '0', value: '待确认'},
          {key: '1', value: '待反馈'},
          {key: '2', value: '已完成'},
        ],
        contentData: [
          {key: 501, value: '报警盘报警'},
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
      this.organId=JSON.parse(sessionStorage.getItem('user')).organId;
      this.organPath=JSON.parse(sessionStorage.getItem('user')).organPath;
      this.filter.organName = JSON.parse(sessionStorage.getItem('user')).organName;
      this.filter.organId=this.organId
      this.organType=JSON.parse(sessionStorage.getItem('user')).organType;
      let o = this.$route.params.organId;
      if(o){
        this.filter.organId = o;
        this.checked = true;
        this.filter.xj = this.$route.params.xj;
        this.activeKey = o;
        this.filter.startTime = '';
        this.filter.endTime = '';
        this.time = [];
      }else this.activeKey = JSON.parse(sessionStorage.getItem('user')).organId;
      var x=this.$route.params.details
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.alarmPage.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
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
        if(val){
          this.filter.organId=''
          this.filter.organPath = this.organPath
        }else{
          this.filter.organId=this.organId
          this.filter.organPath = ''
        }
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.organId=item.id;
        this.organPath= item.path;
        if(this.filter.xj==0){
          this.filter.organId=''
          this.filter.organPath = this.organPath
        }else{
          this.filter.organId=this.organId
          this.filter.organPath = ''
        }
        this._fetchData()
      },
      seeDetails(row){
        this.$router.push({ name: 'alarmDetails',
         params: {
            row: row ,
            tableData: this.tableData,
            total: this.total,
            filter: this.filter
            }})
      },

      editRow(row){
        this.extend=row.extend;
        this.filter.feedbackMeg=''
        this.status=row.status
        this.alarmRecord=true
        this.mesgBoxShow=false
        this.dialogFormTitle ='报警盘告警'
        if(row.status==1){
          this.mesgBoxShow=true
        }
        this.model = row
      },
      async addPosition(status){
      var state
       if(status==0){
         state = 1
       }else if(status==1){
         state = 2
       }
       this.deviceAlarmModel.feedbackContent= this.filter.feedbackMeg
      const data = await Api.deviceAlarm.put(this.deviceAlarmModel, {
        pathParams: {
          id: this.model.id,
          alarmState: state
        }
      }).then(res => res.data)
      if(data.msg=='请求成功'){
        this.mesgBoxShow=false;
        this.alarmRecord=false;
        this._fetchData()
        if(state == 1){
          this.$message({ message: '确认成功', type: 'success' })
        }else {
          this.$message({ message: '反馈成功', type: 'success' })
        }
      }else{
        this.$message({ message: '失败', type: 'success' })
      }
      },

    },
  };
</script>
<style lang="less">
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
