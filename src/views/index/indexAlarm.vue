<template>
  <div style="height: 100%">
    <el-row :gutter="25" style="height: 100%">
      <el-col :span="16" style="height: 100%">
        <div class="indexAlarm-box indexAlarm-l">
          <el-row>
            <el-col :span="12" class="indexAlarm-item" v-for="(item,index) in list" :style="{borderBottom:(index===1||index===0?'2px solid #dedede':'')}">
              <!--无关注-->
              <div v-if="item.alarmNum==-1" class="no-data">
                <div class="flexItem">
                  <img src="../../assets/images/commom/122.png">
                  <p>暂未关注</p>
                </div>
              </div>
              <!--房屋超限-->
              <template v-else-if="item.analysisModelAlarmVo &&item.analysisModelAlarmVo.analysisModelAlarmHouses.length!==0">
                <h3>{{item.analysisModel.analysisType | analysisType}}</h3>
                <el-row :gutter="20" class="indexAlarm-item-con transfinite">
                  <el-col :span="12">
                    <el-row :gutter="10">
                      <el-col :span="12" v-for="img in item.analysisModelAlarmVo.analysisModelAlarmHouses">
                        <!--<img :src="img.photoPath">-->
                        <el-image :src="img.photoPath" style="width:100%;height: 60px" fit="cover"></el-image>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <h4>告警类型：{{item.analysisModelAlarmVo.analysisModelAlarm.alarmName }}</h4>
                    <p>业主: {{item.analysisModelAlarmVo.analysisModelAlarm.personName}}</p>
                    <p  :title="item.analysisModelAlarmVo.analysisModelAlarm.personTel">联系电话：{{item.analysisModelAlarmVo.analysisModelAlarm.personTel}}</p>
                    <p>居住人口：{{item.analysisModelAlarmVo.analysisModelAlarm.personNum}}</p>
                    <p>房屋类型：{{item.analysisModelAlarmVo.analysisModelAlarm.houseStatusName}}</p>
                    <p class="lineClamp2">联系地址：{{item.analysisModelAlarmVo.analysisModelAlarm.address}}</p>
                  </el-col>
                </el-row>
              </template>
              <!--其他类型-->
              <template v-else-if="item.analysisModelAlarmVo && item.analysisModelAlarmVo.analysisModelAlarm.id">
                <h3>{{item.analysisModel.analysisType | analysisType}}</h3>
                <el-row  :gutter="20" class="indexAlarm-item-con">
                  <el-col  :span="10">
                    <el-image :src="item.analysisModelAlarmVo.analysisModelAlarm.photoPath" style="width:100%;height: 170px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="14">
                    <h4>告警类型：{{item.analysisModelAlarmVo.analysisModelAlarm.alarmName }}</h4>
                    <p>姓名：{{item.analysisModelAlarmVo.analysisModelAlarm.personName}}</p>
                    <p :title="item.analysisModelAlarmVo.analysisModelAlarm.personTel">联系电话：{{item.analysisModelAlarmVo.analysisModelAlarm.personTel}}</p>
                    <p :title="item.analysisModelAlarmVo.analysisModelAlarm.identityNumber">证件号码：{{item.analysisModelAlarmVo.analysisModelAlarm.identityNumber}}</p>
                    <p :title="item.analysisModelAlarmVo.analysisModelAlarm.personTypeName">人员类型：{{item.analysisModelAlarmVo.analysisModelAlarm.personTypeName}}</p>
                   <!-- <p class="lineClamp2">联系地址：{{item.analysisModelAlarmVo.analysisModelAlarm.address}}</p>-->
                  </el-col>
                </el-row>
                <el-row :gutter="10"  class="indexAlarm-item-bottom">
                  <el-col :span="6">
                    <el-image :src="item.analysisModelAlarmVo.photoPath1" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="6">
                    <el-image :src="item.analysisModelAlarmVo.photoPath2" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="6">
                    <el-image :src="item.analysisModelAlarmVo.photoPath3" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="6">
                    <el-image :src="item.analysisModelAlarmVo.photoPath4" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                </el-row >
              </template>
              <!--无数据-->
              <div v-else class="no-data">
                <div class="flexItem">
                  <img src="../../assets/images/commom/index3.png">
                  <p style="color: #513F99">暂无数据</p>
                </div>
              </div>
              <el-dropdown class="dropdown" trigger="click" @command="handleCommand($event,index,item)">
                <span class="el-dropdown-link">
                  <i class="el-icon-tickets"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item  command="point">重点关注</el-dropdown-item>
                  <el-dropdown-item  command="more">更多结果</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8" style="height: 100%">
        <div class="indexAlarm-box indexAlarm-r">
          <el-row>
            <el-col :span="12">
              <div class="circle borderColor1">{{statistics.longLivedNum}}</div>
              <div class="indexAlarm-r-population">常住人口</div>
            </el-col>
            <el-col :span="12">
              <div class="circle borderColor2">{{statistics.floatingNum}}</div>
              <div class="indexAlarm-r-population">流动人口</div>
            </el-col>
            <el-col :span="12">
              <div class="circle borderColor3">{{statistics.emphasisNum}}</div>
              <div class="indexAlarm-r-population">重点人口</div>
            </el-col>
            <el-col :span="12">
              <div class="circle borderColor4">{{statistics.visitorNum}}</div>
              <div class="indexAlarm-r-population">今日访客</div>
            </el-col>
          </el-row>
          <div class="indexAlarm-r-bottom">
            <div v-if="!newAlarm" class="center">暂无告警</div>
            <template v-if="newAlarm">
              <h3>告警类型: 人员告警 ({{newAlarm.personName}})</h3>
              <el-row  :gutter="20">
                <el-col  :span="12">
                  <el-image :src="newAlarm.featureImageUrl" style="width:100%;height: 100px" fit="cover"></el-image>
                </el-col>
                <el-col  :span="12">
                  <el-image :src="newAlarm.baseImage" style="width:100%;height: 100px" fit="cover"></el-image>
                </el-col>
              </el-row>
              <h3 class="mt16">相似度：{{newAlarm.matchScore}}%</h3>
              <p>姓名：{{newAlarm.personName}}</p>
             <!-- <p>性别：{{newAlarm.sexName}}</p>-->
             <!-- <p>底库：{{newAlarm.personType}}</p>-->
              <p>证件号码：{{newAlarm.idCardNo}}</p>
              <p>告警时间：{{newAlarm.captureTime}}</p>
              <p>最近出现地址：{{newAlarm.deviceName}}</p>
              <el-row  :gutter="20" class="mt16"  v-if="newAlarm.state===null||newAlarm.state===-1">
                <el-col  :span="12">
                  <el-button type="primary" class="loginBtn"  @click="handleAlarm(newAlarm.id,newAlarm.alarmId,2)">忽略告警</el-button>
                </el-col>
                <el-col  :span="12">
                  <el-button  type="primary" class="loginBtn" @click="handleAlarm(newAlarm.id,newAlarm.alarmId,1)">标记嫌疑人</el-button>
                </el-col>
              </el-row>
            </template>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--更多结果-->
    <el-dialog   class="indexAlarm-dialog" :title="''" :visible.sync="dialogFormVisible" :modal-append-to-body='false' width="60%" top="6vh" :show-close="false">
      <div class="indexAlarm-l">
        <div v-if="tableData.length==0" style="height: 300px;line-height: 300px;text-align: center">
          暂无数据
        </div>
        <template v-if="tableData.length!=0">
          <el-row>
            <el-col :span="12" class="indexAlarm-item" v-for="(item,index) in tableData" :style="{borderBottom:'2px solid #dedede'}">
              <!--房屋超限-->
              <template v-if="item.analysisModelAlarmHouses.length!==0">
                <h3>{{item.analysisModelAlarm.alarmName}}</h3>
                <el-row :gutter="20" class="indexAlarm-item-con transfinite">
                  <el-col :span="12">
                    <el-row :gutter="10">
                      <el-col :span="12" v-for="img in item.analysisModelAlarmHouses">
                        <!--<img :src="img.photoPath">-->
                        <el-image :src="img.photoPath" style="width:100%;height: 60px" fit="cover"></el-image>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="12">
                    <h4>告警类型：{{item.analysisModelAlarm.alarmName }}</h4>
                    <p>业主：{{item.analysisModelAlarm.personName}}</p>
                    <p :title="item.analysisModelAlarm.personTel">联系电话：{{item.analysisModelAlarm.personTel}}</p>
                    <p>居住人口：{{item.analysisModelAlarm.personNum}}</p>
                    <p>房屋类型：{{item.analysisModelAlarm.houseStatusName}}</p>
                    <p class="lineClamp2" :title="item.analysisModelAlarm.address">联系地址：{{item.analysisModelAlarm.address}}</p>
                  </el-col>
                </el-row>
              </template>
              <!--其他类型-->
              <template v-if="item.analysisModelAlarmHouses.length===0">
                <h3>{{item.analysisModelAlarm.alarmName}}</h3>
                <el-row  :gutter="20" class="indexAlarm-item-con">
                  <el-col  :span="10">
                    <!--<img :src="item.analysisModelAlarm.photoPath">-->
                    <el-image :src="item.analysisModelAlarm.photoPath" style="width:100%;height: 170px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="14">
                    <h4>告警类型：{{item.analysisModelAlarm.alarmName }}</h4>
                    <p>姓名：{{item.analysisModelAlarm.personName}}</p>
                    <p :title="item.analysisModelAlarm.personTel">联系电话：{{item.analysisModelAlarm.personTel}}</p>
                    <p :title="item.analysisModelAlarm.identityNumber">证件号码：{{item.analysisModelAlarm.identityNumber}}</p>
                    <p :title="item.analysisModelAlarm.personTypeName">人员类型：{{item.analysisModelAlarm.personTypeName}}</p>
                    <!-- <p class="lineClamp2">联系地址：{{item.analysisModelAlarm.address}}</p>-->
                  </el-col>
                </el-row>
                <el-row :gutter="10"  class="indexAlarm-item-bottom">
                  <el-col :span="6">
                    <!--<img :src="item.analysisModelAlarm.photoPath1">-->
                    <el-image :src="item.analysisModelAlarm.photoPath1" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="6">
                    <!--<img :src="item.analysisModelAlarm.photoPath2">-->
                    <el-image :src="item.analysisModelAlarm.photoPath2" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="6">
                    <!--<img :src="item.analysisModelAlarm.photoPath3">-->
                    <el-image :src="item.analysisModelAlarm.photoPath3" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                  <el-col :span="6">
                    <!--<img :src="item.analysisModelAlarm.photoPath4">-->
                    <el-image :src="item.analysisModelAlarm.photoPath4" style="width:100%;height: 70px" fit="cover"></el-image>
                  </el-col>
                </el-row >
              </template>

            </el-col>
          </el-row>
          <div class="pageBox">
            <el-pagination  :small="true" @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
          </div>
        </template>
        <div class="indexAlarm-dialog-close">
          <i class="el-icon-error" @click="dialogFormVisible = false"></i>
        </div>
      </div>

    </el-dialog>
    <!--重点关注-->
    <el-dialog  class="indexAlarm-dialog1" :title="dialogFormTitle" :visible.sync="dialogFormVisible1"  :modal-append-to-body='false' width="35%">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="关注类型：" prop="attentionType">
          <el-select v-model="model.analysisType" placeholder="请选择" @change="handleChange">
            <el-option v-for="item in analysisType"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分析范围：" prop="">
          <el-popover placement="bottom" width="300" trigger="click" ref="popover">
            <div class="popover zhsq-popover">
              <el-tree :data="treeList"
                       :props="defaultProps"
                       @node-click="handleNodeClick"
                       highlight-current
                       ref="organTree"
                       :expand-on-click-node="false"
                       node-key="id">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <el-checkbox v-model="node.checked" v-show="false"></el-checkbox>
                  <span class="el-tree-node__label">{{ data.name }}</span>
                </div>
              </el-tree>
            </div>
            <el-input v-model="organName" slot="reference" autocomplete="off" placeholder="分析范围" readonly></el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="关注人员：" prop="personId"  v-if="model.analysisType!==4">
          <el-popover placement="bottom" width="300" trigger="click" ref="person">
            <div  class="popover zhsq-popover">
              <el-tree :data="personList"
                       :props="defaultProps1"
                       ref="personTree"
                       highlight-current
                       :expand-on-click-node="false"
                       node-key="orgId">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <el-checkbox v-model="node.checked" v-if="data.type==3"></el-checkbox>
                  <span class="el-tree-node__label">{{ data.orgName }}</span>
                </div>
              </el-tree>
              <div class="center mt10">
                <el-button type="primary" @click="personSubmit" size="mini">确定</el-button>
              </div>
            </div>
            <el-input v-model="person" slot="reference" autocomplete="off" placeholder="关注人员" readonly></el-input>
          </el-popover>
        </el-form-item>

        <el-form-item :label="title+'时长：'" prop="" v-if="model.analysisType!==4">
          <el-select v-model="model.duration" placeholder="请选择">
            <el-option v-for="item in time"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="限制人数" prop="" v-if="model.analysisType===4">
          <el-select v-model="model.duration" placeholder="请选择">
            <el-option v-for="item in limitNum"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注：" prop="">
          <el-input  placeholder="备注"  v-model="model.comment" ></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce,cloneDeep  } from 'lodash'
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'
  import moment from 'moment'
  import ElImage from "../../../node_modules/element-ui/packages/image/src/main.vue";
  export default {
    components: {
      ElImage,
      ElCol,
      ElRow},
    data: function() {
      return {
        socket:null,
        statistics:{
          emphasisNum:0,
          floatingNum:0,
          longLivedNum:0,
          visitorNum:0
        },
        newAlarm:null,
        tableData:[],
        list:[
          {
            alarmNum:-1,
            analysisModel:{},
            analysisModelAlarmVo:null,
            analysisModelAlarmVo:{
              analysisModelAlarm:{},
              analysisModelAlarmHouses:[]
            },
            analysisModelUsers:[],
          },
          {
            alarmNum:-1,
            analysisModel:{},
            analysisModelAlarmVo:{
              analysisModelAlarm:{},
              analysisModelAlarmHouses:[]
            },
            analysisModelUsers:[],
          },
          {
            alarmNum:-1,
            analysisModel:{},
            analysisModelAlarmVo:{
              analysisModelAlarm:{},
              analysisModelAlarmHouses:[]
            },
            analysisModelUsers:[],
          },
          {
            alarmNum:-1,
            analysisModel:{},
            analysisModelAlarmVo:{
              analysisModelAlarm:{},
              analysisModelAlarmHouses:[]
            },
            analysisModelUsers:[],
          },
        ],
        dialogFormVisible:false,
        analysisModelUsers:[],
        model:{
          modeType:2,
          analysisType:1,
          analysisScope:'',
          duration:'',
          comment:'',
          sortNum:0,
        },
        total:0,
        filter:{
          rows:4,
          page:1
        },
        dialogFormVisible1:false,
        dialogFormTitle:'新增',
        analysisType:[
          {id: 1, label: '独居老人'},
          {id: 2, label: '上访人员'},
          {id: 3, label: '假释人员'},
          {id: 4, label: '房屋居住人口超限'}
        ],
        time:[
          {id: 3, label: '3天'},
          {id: 5, label: '5天'},
          {id: 7, label: '7天'},
        ],
        limitNum:[
          {id: 10, label: '10人'},
          {id: 15, label: '15人'}
        ],
        analysisModelId:'',
        title:'未出现',
        firstErr:null,
        loading:false,
        treeList:[],
        organId:'',
        organName:'',
        personList:[],
        organChecked:[],
        personChecked:[],
        person:'',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultProps1: {
          children: 'children',
          label: 'orgName'
        },
        rules: {
          taskName: [{
            required: true,
            message: '请填写任务名称',
            trigger: 'blur'
          },{
            maxLength: 5,
            message: '长度超长了',
            trigger: 'blur'
          }],
          taskType: [{
            required: true,
            message: '请选择任务类型',
            trigger: 'blur'
          }],
        },
      };
    },
    mounted(){
      this.organPath= JSON.parse(sessionStorage.getItem('user')).organPath;
      this.organPath=this.organPath.replace(new RegExp('/','g'),".")
      this.organId=JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchStatistics();
      this._fetchNewAlarm();
      this._fetchAnalysisModel();
      this._fetchOrganData();
      this.initWebSocket();
    },
    methods: {
      //统计
      _fetchStatistics:debounce(async function() {
        const data = await Api.indexStatistics.get().then(data => data.data.result)
        this.statistics.emphasisNum=data.emphasisNum
        this.statistics.floatingNum=data.floatingNum
        this.statistics.longLivedNum=data.longLivedNum
        this.statistics.visitorNum=data.visitorNum
      }, 100),
      //一条告警
      _fetchNewAlarm:debounce(async function() {
        const data = await Api.indexNewAlarm.get().then(data => data.data.result)
        if(data){
          this.newAlarm=data;
          this.newAlarm.baseImage=data.photoPath;
          this.newAlarm.captureTime=data.alarmTime
          this.newAlarm.idCardNo=data.identitynumber
        }
      }, 100),
      //分析模型
      _fetchAnalysisModel:debounce(async function() {
        const data = await Api.analysisModel.get().then(data => data.data.rows)
        if(data.length!==0){
          data.map((item)=>{
            if(item.analysisModel&&item.analysisModel.sortNum==0) {
              //this.$set(this.list,0,item)
              this.list[0].alarmNum=item.alarmNum
              this.list[0].analysisModel=item.analysisModel
              if(item.analysisModelAlarmVo){
                this.list[0].analysisModelAlarmVo.analysisModelAlarmHouses=item.analysisModelAlarmVo.analysisModelAlarmHouses
                this.list[0].analysisModelAlarmVo.analysisModelAlarm=item.analysisModelAlarmVo.analysisModelAlarm
              }
              this.list[0].analysisModelUsers=item.analysisModelUsers
            }
            if(item.analysisModel&&item.analysisModel.sortNum==1){
              this.list[1].alarmNum=item.alarmNum
              this.list[1].analysisModel=item.analysisModel
              if(item.analysisModelAlarmVo){
                this.list[1].analysisModelAlarmVo.analysisModelAlarmHouses=item.analysisModelAlarmVo.analysisModelAlarmHouses
                this.list[1].analysisModelAlarmVo.analysisModelAlarm=item.analysisModelAlarmVo.analysisModelAlarm
              }
              this.list[1].analysisModelUsers=item.analysisModelUsers
            }
            if(item.analysisModel&&item.analysisModel.sortNum==2){
              this.list[2].alarmNum=item.alarmNum
              this.list[2].analysisModel=item.analysisModel
              if(item.analysisModelAlarmVo){
                this.list[2].analysisModelAlarmVo.analysisModelAlarmHouses=item.analysisModelAlarmVo.analysisModelAlarmHouses
                this.list[2].analysisModelAlarmVo.analysisModelAlarm=item.analysisModelAlarmVo.analysisModelAlarm
              }
              this.list[2].analysisModelUsers=item.analysisModelUsers
            }
            if(item.analysisModel&&item.analysisModel.sortNum==3){
              this.list[3].alarmNum=item.alarmNum
              this.list[3].analysisModel=item.analysisModel
              if(item.analysisModelAlarmVo){
                this.list[3].analysisModelAlarmVo.analysisModelAlarmHouses=item.analysisModelAlarmVo.analysisModelAlarmHouses
                this.list[3].analysisModelAlarmVo.analysisModelAlarm=item.analysisModelAlarmVo.analysisModelAlarm
              }
              this.list[3].analysisModelUsers=item.analysisModelUsers
            }
          })
        }
        console.log(this.list);
      }, 100),
      //机构树
      _fetchOrganData: debounce(async function() {
        const data = await Api.organTree.get().then(data => data.data.result)
        this.treeList=[data] || []
      }, 100),
      //根据机构待布控人员
      _fetchPersonList: debounce(async function(personType=1) {
        const data = await Api.personMonitorPerson.get({
          personType:personType
        },{
          pathParams: {
            orgId: this.organId
          }
        }).then(data => data.data.result)
        this.personList=[data] || []
      }, 100),
      //更多告警
      _fetchAlarmList: debounce(async function() {
        const data = await Api.indexAlarmList.get(this.filter,{
          pathParams: {
            id: this.analysisModelId
          }
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      //下拉
      handleCommand(command,index,data) {
        if(command==='point') {
          this.person="";
          this.analysisModelUsers=[];
          this.personChecked=[];
          this.organName=''
          this.organChecked=[]
          if(data.alarmNum!==-1){
            this.dialogFormTitle="编辑";
            this.model=cloneDeep(data.analysisModel);
            let personChecked=[]
            data.analysisModelUsers.map((item)=>{
              personChecked.push(item.personId);
              this.analysisModelUsers.push({orgId:item.parentId,personId:item.orgId})
            })
            this.personChecked=personChecked
            this.organChecked=[this.model.analysisScope]
            this.$nextTick(() => {
              this.$refs.organTree.setCheckedKeys(this.organChecked);
              let node = this.$refs.organTree.getCheckedNodes();
              node.map((item,index)=>{
                this.organName=item.name;
                this.organId=item.id;
                this.model.analysisScope=item.id
              });
              if(data.analysisModelUsers.length!=0){
                Api.personMonitorPerson.get({
                  personType:data.analysisModel.analysisType,
                },{
                  pathParams: {
                    orgId: this.organId
                  }
                }).then(data => {
                  this.personList=[data.data.result] || []
                  this.$nextTick(() => {
                    this.$refs.personTree.setCheckedKeys(this.personChecked);
                    let personNode = this.$refs.personTree.getCheckedNodes();
                    personNode.map((item,index)=>{
                      if(item.type==3){
                        this.person+=item.orgName+" ";
                        this.analysisModelUsers.push({personId:item.parentId,orgId:item.orgId})
                      }
                    });
                  })
                })
              }
            })
            this.dialogFormVisible1=true
          }else {
            this.dialogFormTitle="新增";
            this.model.duration=''
            this.model.sortNum=index
            this.dialogFormVisible1=true;
          }
        }
        if(command==='more'){
          if(Object.keys(data)==0){
            this.$message({ message: '请先选择重点关注', type: 'info' })
            return false
          }
          if(data.analysisModel.id){
          this.analysisModelId=data.analysisModel.id
            Api.indexAlarmList.get(this.filter,{
              pathParams: {
                id: data.analysisModel.id
              }
            }).then(res => {
              this.tableData =  res.data.rows
              this.total =  res.data.total
              this.dialogFormVisible=true
            })
          }else{
            this.$message({ message: '请先添加重点关注', type: 'info' })
          }
        }
      },
      //选择
      handleChange(val){
        this.title= (val==1 && '未出现') || (val==2  && '脱控') || (val==3 && '脱控');
        this.model.duration=''
        if(val!==4){
          this._fetchPersonList(val);
          this.person="";
          this.analysisModelUsers=[];
          this.personChecked=[]
          this.$nextTick(()=>{
            this.$refs.personTree.setCheckedKeys([]);
          })
        }
      },
      handleNodeClick(item){
        this.organName=item.name
        this.organId=item.id
        this.model.analysisScope=item.id
        this.$refs.popover.doClose()
        this._fetchPersonList()
      },
      personSubmit(){
        this.person='';
        this.analysisModelUsers=[]
        let node = this.$refs.personTree.getCheckedNodes();
        node.map(item=>{
          if(item.type==3){
            this.person+=item.orgName+" ";
            this.analysisModelUsers.push({orgId:item.parentId,personId:item.orgId})
          }
        });
        this.$refs.person.doClose();
      },
      //提交
      submit(){
        if(this.model.id){
          this.loginLoading=true;
          let model={
            analysisModel:this.model,
            analysisModelUsers:this.analysisModelUsers
          }
          Api.editAnalysisModel.put(model,{
            pathParams: {
              id: this.model.id
            }
          }).then(res=>{
            this.loginLoading=false;
            this.dialogFormVisible1=false
            this.$message({ message: '编辑成功', type: 'success' })
            this._fetchAnalysisModel()
          }).catch(()=>{
            this.loginLoading=false;
          })
        }else {
          this.loginLoading=true;
          let model={
            analysisModel:this.model,
            analysisModelUsers:this.analysisModelUsers
          }
          Api.addAnalysisModel.post(model).then(res=>{
            this.loginLoading=false;
            this.dialogFormVisible1=false
            this.$message({ message: '添加成功', type: 'success' })
            this._fetchAnalysisModel()
          }).catch(()=>{
            this.loginLoading=false;
          })
        }
      },
      //右侧告警
      async handleAlarm(eventId,alarmId,state){
        this.$confirm(state === 2 ? `确定忽略此告警？` : '标记为嫌疑人', '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.handleAlarm.put({}, {
            pathParams: {
              eventId: eventId,
              alarmId: alarmId,
              state: state
            }}).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this._fetchNewAlarm();
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '操作失败!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },
      initWebSocket(){
        this.socketError=false;
        this.socket = new SockJS(JSON.parse(sessionStorage.getItem("systemConfig")).mqHost+':'+JSON.parse(sessionStorage.getItem("systemConfig")).mqPort);
        const client = Stomp.over(this.socket);
        client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
        client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
        //client.debug = function(str) {};
        const on_connect = ()=> {
          client.subscribe(`/exchange/TopicExchangeFontAYIC/topic.open.door.front.alarm${this.organPath}.#`, (frame)=> {
            let newAlarm = JSON.parse(frame.body)
            newAlarm.captureTime=moment(newAlarm.captureTime).format('YYYY-M-D, HH:mm:ss');
            this.newAlarm=newAlarm;
          });
        };
        const on_error = ()=> {
          //this.socketError=true;
          //client.connect(process.env.VUE_APP_WEBSOCKET_MQ_USER, process.env.VUE_APP_WEBSOCKET_MQ_PASS, on_connect, on_error, '/');
        };
        client.connect(JSON.parse(sessionStorage.getItem("systemConfig")).mqUsername, JSON.parse(sessionStorage.getItem("systemConfig")).mqPassword, on_connect, on_error, '/');
      },
      //分页
      pageChange(val) {
        this.filter.page = val;
        this._fetchAlarmList();
      },
      beforeRouteLeave(to, from, next) {
        this.socket.close()
        next()
      },
    }
  };
</script>
<style lang="less">

</style>
