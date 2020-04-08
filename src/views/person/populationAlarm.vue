<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">告警记录</span>

      <div class="text_r flexItem">
        <!--<el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>-->
        <el-input type="text" placeholder="人员姓名"  v-model="filter.alarmContent" clearable></el-input>
        <el-select v-model="filter.sourceType" placeholder="人员类型" clearable>
          <el-option v-for="item in personType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="filter.status" placeholder="告警状态" clearable>
          <el-option v-for="item in alarmType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-date-picker @change="changeDate()" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <div class="zhsq-right-con" ref="content">
        <div class="tableBox" >
          <div class="alarm-main" :style="{height: tabHeight + 'px',maxHeight:tabHeight + 'px'}">
            <el-row :gutter="20">
              <el-col :span="8" v-for=" item in tableData">
                <div class="alarm-box">
                  <div class="flex ">
                    <div class="flexItem personAlarm-img">
                      <!--<img :src="item.photoPath">-->
                      <el-image style="width: 100%; height: 100px" :src="item.extend.photoPath" fit="cover"></el-image>
                      <span class="background1">模板图</span>
                    </div>
                    <div class="flexItem personAlarm-img">
                      <!--<img :src="item.featureImageUrl">-->
                      <el-image style="width: 100%; height: 100px" :src="item.extend.imgUrls" fit="cover"></el-image>
                      <span class="itembackground2">抓拍图</span>
                    </div>
                  </div>
                  <div class="alarm-con">
                    <div class="flex">
                      <div>姓名:</div>
                      <div class="flexItem">{{item.extend.personName}}<span class="fr color1">{{item.extend.matchScore}}%</span></div>
                    </div>
                    <div class="flex">
                      <div>任务名称:</div>
                      <div class="flexItem">{{item.extend.taskName}}</div>
                    </div>
                    <div class="flex">
                      <div>出现地点:</div>
                      <div class="flexItem">{{item.organName}}</div>
                    </div>
                    <div class="flex">
                      <div>抓拍时间:</div>
                      <div class="flexItem">{{item.extend.captureTime}}</div>
                    </div>
                    <div class="flex">
                      <div class="flexItem text_r">
                        <el-button  type="primary" size="mini" @click="details(item)">查看详情</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="pageBox">
            <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!--查看详情-->
    <el-dialog  :close-on-click-modal="false" class="alarm-dialog" :title="''" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="40%" :show-close=false>
      <div class="el-icon-error alarm-dialog-icon"  v-if="model.state == 0"></div>
      <div class="el-icon-success alarm-dialog-icon"  v-if="model.state == 1"></div>
      <div class="alarm-dialog-con">
        <div class="alarm-header">
          <ul class="flex">
            <li class="flexItem"  :class="index==1?'active':'' " @click="select(1)">告警详情</li>
            <li class="flexItem"  :class="index==2?'active':'' " @click="select(2)">场景图片</li>
            <li class="flexItem"  :class="index==3?'active':'' " @click="select(3)">轨迹分析</li>
          </ul>
        </div>
        <div class="alarm-con">
          <div class="info"  v-show="index==1">
            <div class="flex">
              <div class="flexItem">
                <!--<img :src="model.photoPath">-->
                <el-image style="width: 100%; height: 250px" :src="model.extend.photoPath" fit="cover"></el-image>
                <span class="background1">模板图</span>
              </div>
              <div class="flexItem">
                <!-- <img :src="model.featureImageUrl">-->
                <el-image style="width: 100%; height: 250px" :src="model.extend.imgUrls" fit="cover"></el-image>
                <span class="background2">抓拍图</span>
              </div>
            </div>
            <div class="info-con">
              <div>
                姓名：{{model.extend.personName}} <span class="fr">相似度：{{model.extend.confidence}}%</span>
              </div>
              <p>性别：{{model.extend.sex==1?'男':'女'}}</p>
              <p>抓拍时间：{{model.extend.captureTime}}</p>
              <p>抓拍地点：{{model.organName}}</p>
            </div>
          </div>
          <div class="scene"  v-show="index==2">
            <div class="flex">
              <!--<img :src="model.environmentImageUrl">-->
              <el-image style="width: 100%; height: 350px" :src="model.extend.imgUrlBig" fit="contain"></el-image>
            </div>
          </div>
          <div class="trajectory" v-show="index==3">
            <div class="tableBox">
              <p>出现次数:{{trajectoryDataTotal}}</p>
              <el-table :data="trajectoryData" style="width: 100%" stripe  height="290" max-height="290">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="captureTime"  label="出现时间" align='center'></el-table-column>
                <el-table-column prop="orgName" label="出现地点" align='center'></el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination  :small="true" @current-change="trajectoryPageChange" background layout="prev, pager, next, total" :total='trajectoryDataTotal' :page-size='trajectoryFilter.rows' :current-page='trajectoryFilter.page'></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  :loading="loading" v-if="model.state == null" @click="handleAlarm(model.id,3)">忽略告警</el-button>
        <el-button type="primary" :loading="loading" v-if="model.state == null" @click="handleAlarm(model.id,2)">标记嫌疑人</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys } from 'lodash'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  import moment from 'moment'
  import OrganTree from '../../components/OrganTree.vue'
  export default {
    name: 'populationAlarm',
    components: {OrganTree},
    data() {
      return {
        index:1,
        trajectoryData:[],
        trajectoryDataTotal:0,
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        total:0,
        time:[moment().subtract(1, "days"), moment().endOf('day')],
        checked: false,
        filter: {
          orgId: null,
          page: 1,
          rows: 12,
          personName:'',
          queryPersonType:'',
          state:'',
          startTime:moment().subtract(1, "days").format('YYYY-MM-DD HH:mm:ss'),
          endTime:moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          xj:1
        },
        trajectoryFilter: {
          personId: null,
          page: 1,
          rows: 10,
          orgId: null,
          xj:0
        },
        treeList: [],
        alarmType: [
          {id: '0', label: '已忽略'},
          {id: '1', label: '已标记'}
        ],
        personType:[
        {id: '1',label:'独居老人'},
        {id: '2',label:'上访人员'},
        {id: '3',label:'刑释人员'},
        {id: '4',label:'社区矫正'},
        {id: '5',label:'重点关注人员'}
        ],
        firstErr:null,
        loading:false,
        dialogFormVisible:false
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
      this.filter.orgId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.trajectoryFilter.orgId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.trajectoryFilter.orgId = JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.getPopulationAlarmLst.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      _fetchTrajectoryData: debounce(async function() {
        const data = await Api.openDoorRecord.get(this.trajectoryFilter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.trajectoryData = data.rows
        this.trajectoryDataTotal = data.total
      }, 100),
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      trajectoryPageChange(val) {
        this.trajectoryFilter.page = val;
        this._fetchTrajectoryData();
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
      handCkChange(val){
        this.filter.xj = (val ? 0: 1)
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.orgId = item.id || ''
        this._fetchData()
      },
      details(item){
        //查询
        this.model = item;
        this.trajectoryFilter.personId = item.extend.personId;
        this.dialogFormVisible=true
      },
      select(index){
        this.index=index;
        if(index == 3){
          this._fetchTrajectoryData();
        }
      },
      async handleAlarm(alarmId,state){
        this.$confirm(state === 2 ? `确定忽略此告警？` : '标记为嫌疑人', '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.handleAlarm.put({}, {
            pathParams: {
              alarmId: alarmId,
              state: state //0无法使用URL传输，传2
            }
          }).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this.dialogFormVisible = false
            this._fetchData()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '操作失败!'
            })
            this.dialogFormVisible=false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.dialogFormVisible=false
        })
      }
    },
  };
</script>
<style lang="less">

</style>
