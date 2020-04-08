<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">网格员任务执行情况＞异常预警</p>
        
      <div class="flexItem text_r">
            <el-select v-model="selectProcessingState" placeholder="处理状态" clearable>
            <el-option v-for="item in processingState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
            <el-select v-model="filter.epidemicFlag" placeholder="告警类型" clearable>
            <el-option v-for="item in alarmState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
       告警时间：<el-date-picker  @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        处理时间：<el-date-picker  @change="changeDate1" v-model="time1" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small" @click='back()'   >返回</el-button>
      </div>
    </div>
    <p class="gridName">网格员：<span>{{userName}}</span></p>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="alarmType2" label="告警类型" align='center'>
                   <template slot-scope="scope" >
                         {{scope.row.alarmType2 | alarmState}}
                      </template>
                </el-table-column>
                <el-table-column prop="startTime" label="告警时间" align='center' width="180"></el-table-column>
                <el-table-column prop="handleStartTime" label="处理时间" align='center' width="180"></el-table-column>
                <el-table-column prop="handleDuration" label="处理耗时" align='center'></el-table-column>
                <el-table-column prop="streetName" label="处理人" width="180" align='center'></el-table-column>
                <el-table-column prop="status" label="处理状态" width="180" align='center'>
                    <template slot-scope="scope" >
                         {{scope.row.handleState | handleState}}
                      </template>
                </el-table-column>
               <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="details(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
              </el-table>

              <div class="pageBox">
                <!-- <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination> -->
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.size' :current-page='filter.current'></el-pagination>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 查看详情 -->
    <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="750px" >
      <div class="content" v-if="showFlag1">
          <p>处理状态：待处理</p>
          <p >处理状态：已处理</p>
          
          <div class="details">
              <img src="../../assets/images/person.png" alt="">
              <ul>
                  <li>连续三天未出现</li>
                  <li>张三，18300987677</li>
                  <li>独居老人，残疾人</li>
                  <li>状态：异常</li>
              </ul>
          </div>
          <ul class="details-list">
            <el-row>
             <el-col :span="24"> <li>最近出现时间：<span>2020-03-04 17:11:32</span></li></el-col>
            </el-row>
            <el-row>
            <el-col :span="24"><li>住址：<span>清波小区（A区）2栋3单元402</span></li></el-col>
            </el-row>
            <el-row>
            <el-col :span="24"> <li>核实情况说明：<span>暂无</span></li></el-col>
            </el-row>
            <el-row>
            <el-col :span="24"> <li>处理人：<span>暂无</span></li></el-col>
            </el-row>
            <el-row>
            <el-col :span="24"> <li>处理时间：<span>暂无</span></li></el-col>
            </el-row>
          </ul>
      </div>
      <!-- 人员出入 -->
      <div class="content" v-if="showFlag2">
          <p>处理状态：待处理 </p>
          <p>处理状态：待处理 </p>
          
          <ul class="details-list">
              <el-row>
                <el-col :span="10"><li>姓名：<span>张三</span></li></el-col>
                <el-col :span="10"><li style="float:right">身份证：<span>511322199909161341</span></li></el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><li>人员类型<span>独居老人、残疾人</span></li></el-col>
            </el-row>
              <el-row>
                <el-col :span="24"> <li>住址：<span>清波小区（A区）2栋3单元402</span></li></el-col>
              </el-row>
            <el-row>
                    <el-col :span="24"><li>出入大门门禁名称<span>XX小区北门进</span></li></el-col>
            </el-row>
            <el-row>
                    <el-col :span="24"> <li>出入时间<span>2020-03-04 17:11:32</span></li></el-col>
            </el-row>
             <el-row>
                    <el-col :span="24"><li>核实情况说明：<span>暂无</span></li></el-col>
            </el-row>
            <el-row>
                  <el-col :span="24"> <li>处理人：<span>暂无</span></li></el-col>
            </el-row>
              <el-row>
                  <el-col :span="24"> <li>处理时间：<span>暂无</span></li></el-col>
            </el-row>
          </ul>
      </div>
      <!-- 房屋 -->
      <div class='house-content' v-if="showFlag3">
            <el-row class="list-1">
                <el-col :span="8"><p>处理状态：<span>待处理</span></p></el-col>
                <el-col :span="8"><p>处理状态：<span>待处理</span></p></el-col>
                
                <el-col :span="8"><p>当前状态：<span>正常</span></p></el-col>
                <el-col :span="8"><p>处理人：<span>小王</span></p></el-col>
            </el-row>
            <el-row class="list">
                <el-col :span="10"><p><span>清波小区1栋1单元101</span></p></el-col>
                <el-col :span="10"><p>居住人数<span>20</span></p></el-col>
            </el-row>
             <el-row class="list">
                <el-col :span="10"><p>业主：<span>张三</span></p></el-col>
                <el-col :span="10"><p>联系方式：<span>1388004270820</span></p></el-col>
            </el-row>
            <div class="houseDetails">
                <div class="details" v-for='(item,index ) in data  ' :key='index'>
                    <img src="../../assets/images/photo.png" alt="">
                    <ul>
                        <li>姓名：<span>{{item.name}}</span></li>
                        <li>性别：<span>{{item.sex}}</span></li>
                        <li>住户类型：<span>{{item.type}}</span></li>
                        <li>电话号码：<span>{{item.tel}}</span></li>
                        <li>身份证号：<span>{{item.careId}}</span></li>
                        
                    </ul>
                </div>
            </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false"> 关闭</el-button>
        <!-- <el-button type="primary" @click="dialogCodeVisible = false" :loading="loading">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import {
  validateIdCard,
  validatePhone,
  validateBlackSpace
} from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import moment from "moment";
import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
import { domHeightMixin } from "../../commom/mixins.js";
import { getBase64, convert2JPEG } from "../../commom/util.js";
import { log, debuglog } from "util";
export default {
  mixins: [domHeightMixin],
  name: "vehicle",
  components: {
    ElDialog,
    OrganTree
  },
  data() {
    return {
      importVisible: false,
      importData: [],
      fileList: [],
      fileHeader: {},
      importFormVisible: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogCodeVisible:false,
      dialogCode:"长时间未出现预警详情",
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [
        {
            alarmState:'1',
            handleState:"1"
        },
         {
            alarmState:'1',
            handleState:"2"
        }, {
            alarmState:'2',
            handleState:"1"
        }, {
            alarmState:'2',
            handleState:"2"
        }, {
            alarmState:'3',
            handleState:"1"
        }, {
            alarmState:'3',
            handleState:"2"
        },
       ],
      model: {
        imgStr: "",
        name: "",
        phone: ""
      },
      total: 0,
       filter: {
        organId: 0,
        size: 10,
        current: 0,
        
      },
      firstErr: null,
      loading: false,
      time:[],
       time1:[],
       showFlag1:false,
       showFlag2:false,
       showFlag3:false,
       stateFlag1:false,
       stateFlag2:false,
       stateFlag3:false,
       userName:"",
      processingState:[
           { id: 0, label: "待处理" },
        { id: 1, label: "已处理" }, 
      ],
      selectProcessingState:'',
       alarmState:[
           { id: 1, label: "长时间未出入" },
        { id: 2, label: "人员出入通知" },
        { id: 3, label: "房屋居住人员超限" }, 
         
      ],
      data:[
          {
            name:'张三',
            sex:"男",
            type:"租客",
            tel:"13880052708",
            careId:"511322199909161341"
          },
          {
            name:'张三',
            sex:"男",
            type:"租客",
            tel:"13880052708",
            careId:"511322199909161341"
          },
          {
            name:'张三',
            sex:"男",
            type:"租客",
            tel:"13880052708",
            careId:"511322199909161341"
          },
          {
            name:'张三',
            sex:"男",
            type:"租客",
            tel:"13880052708",
            careId:"511322199909161341"
          },{
            name:'张三',
            sex:"男",
            type:"租客",
            tel:"13880052708",
            careId:"511322199909161341"
          },{
            name:'张三',
            sex:"男",
            type:"租客",
            tel:"13880052708",
            careId:"511322199909161341"
          },
      ],
       
    };
  },
  mounted() {
      this.selectProcessingState = this.$route.query.state   
   
    //table高度
    this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this.userName = this.$route.query.userName
    
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.getAbnormalaList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
         .then(res => res.data);
         this.tableData = data.rows;
      this.total =data.total;
    }, 100),
    back(){
        this.$router.push({ path: "/gridOperator/gridSituation" });
      },
    pageChange(val) {
      this.filter.current = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    details(row){
        if(row.alarmState == 1){
          this.showFlag1 = true
          this.showFlag2 = false
          this.showFlag3 = false
        }else if(row.alarmState == 2){
          this.showFlag1 = false
          this.showFlag2 = true
          this.showFlag3 = false
        }else if(row.alarmState == 3){
          this.showFlag1 = false
          this.showFlag2 = false
          this.showFlag3 = true
        }
        this.dialogCodeVisible=true
      },

     changeDate( val) {
      if(val == null){
         this.filter.startDateStr=""
         this.filter.endDateStr = ''
          this._fetchData();
      }else{
         this.filter.startDateStr = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.filter.endDateStr = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },
     changeDate1( val) {
      if(val == null){
         this.filter.startDateStr=""
         this.filter.endDateStr = ''
          this._fetchData();
      }else{
         this.filter.startDateStr = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.filter.endDateStr = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },
  }
};
</script>
<style lang="less">
.el-dialog__body{
    padding: 0px ;
}
.gridName{
    display: inline;
    font-size: 24px;
    span{
        font-size: 20px
    }
}
.content{
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    padding: 20px;
    p{
        font-size: 20px;
        margin: 10px 0px;
    }
    .details{
        display: flex;
        img{
            width: 130px;
            height: 160px;
            margin-right: 50px;
        }
        li{
            line-height: 40px;
            &:nth-of-type(1){
                font-size: 18px;
            }
        }
      
    }
    .details-list{
        margin: 10px 0px;
        li{
            line-height: 40px
        }
    }
    
}
.house-content{
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    padding: 20px;
    font-size: 16px;
  .list-1{
      font-size: 20px;
  }
  .list-1,.list{
      line-height: 30px;
  }
  .houseDetails{
      display: flex;
       flex-wrap:wrap;
       height: 360px;
       overflow-y: scroll; 
    .details{
      width: 48%;
      display: flex;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 10px 10px 0 0 ;
      padding: 10px;
      img{
          width: 100px;
          height: 130px;
          margin-right: 16px;
      }
      li{
          line-height: 30px;
      }

  }
  }
  
}
</style>
