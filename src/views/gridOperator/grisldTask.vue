<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">网格员任务执行情况＞关怀任务</p>
      <div class="flexItem text_r">
            <el-select v-model="filter.concernsFlag" placeholder="处理状态" clearable>
            <el-option v-for="item in implementState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
       任务发起时间：<el-date-picker  @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
       执行时间：<el-date-picker  @change="changeDate1" v-model="time1" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small" @click='back()'   >返回</el-button>
      </div>
    </div>
    <p class="gridName">网格员：<span>{{userName}}</span></p>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <!-- <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col> -->
        <el-col :span="24">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="被关怀姓名" align='center'></el-table-column>
                <el-table-column prop="addres" label="被关怀人住址" align='center' width="180"></el-table-column>
                <el-table-column prop="taskUpdateTime" label="任务发起时间" align='center' width="180"></el-table-column>
                <el-table-column prop="timeSlot" label="执行时间段" align='center'></el-table-column>
                <el-table-column prop="concernsFlag" label="状态" width="180" align='center'>
                  <template slot-scope="scope" >
                         {{scope.row.concernsFlag | concernsFlag}}
                      </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="执行时间" width="180" align='center'></el-table-column>
               <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="details(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
              </el-table>

              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.size' :current-page='filter.page'></el-pagination>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 查看详情 -->
    <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
      <div class="content" v-for='(item,index) in tableData' :key='index'>
          <p>执行状态：<span>{{detailsData.concernsFlag==0?'已关怀':'未关怀'}}</span></p>
          <ul class="details-list">
              <el-row>
                <el-col :span="10"><li>姓名：<span>{{detailsData.name ? detailsData.name : '暂无' }}</span></li></el-col>
                <el-col :span="10"><li style="float:right">身份证：<span>{{detailsData.identityNumber ? detailsData.identityNumber : '暂无'}}</span></li></el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><li>人员类型:<span>{{detailsData.personTypeName ? detailsData.personTypeName : '暂无' }}</span></li></el-col>
            </el-row>
              <el-row>
                <el-col :span="24"> <li>住址：<span>{{detailsData.addres ? detailsData.addres : '暂无' }}</span></li></el-col>
              </el-row>
            <el-row>
                    <el-col :span="24"><li>上门关怀照片：
                      <span v-for='(item,index ) in  detailsData.images  ' :key='index' v-show="detailsData.images">
                           <template  >
                          <el-popover placement="left"  trigger="click">
                            <img :src="item" width="500"/>
                            <img slot="reference" :src="item" width="40" height="40">
                          </el-popover>
                        </template>
                      </span>
                       <span v-show="!detailsData.images">暂无</span>
                      </li></el-col>
            </el-row>
            <el-row>
                    <el-col :span="24"> <li>上门关怀说明：<span>{{detailsData.remarks ? detailsData.remarks : '暂无' }}</span></li></el-col>
            </el-row>
            
            <el-row>
                  <el-col :span="24"> <li>执行人：<span>{{detailsData.updateUserName ? detailsData.updateUserName : '暂无' }}</span></li></el-col>
            </el-row>
              <el-row>
                  <el-col :span="24"> <li>执行时间：<span>{{detailsData.updateTime ? detailsData.updateTime : '暂无' }}</span></li></el-col>
            </el-row>
          </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false"> 关闭</el-button>
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
      dialogCode:"关怀任务详情",
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [],
      model: {
        imgStr: "",
        name: "",
        phone: ""
      },
      total: 0,
       filter: {
        rows: 10,
        page: 0,
        userId:""
      },
      userId:"",
      userName:"",
      detailsData:{},
      firstErr: null,
      loading: false,
      time:[],
       time1:[],
      implementState:[
           { id: 1, label: "未执行" },
        { id: 0, label: "已执行" }, 
      ],
    };
  },
  mounted() {
   this.filter.concernsFlag = this.$route.query.state
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
    this.userId = this.$route.query.userId
    this.userName = this.$route.query.userName
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      this.filter.userId = this.userId
      delete this.filter.organId;
      const data = await Api.implementation
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
          .then(res => res.data);
           data.rows.map(item=>{
            item.timeSlot = ''
            item.timeSlot = item.startTime + '至' + item.endTime
          })
         this.tableData = data.rows;
         console.log( this.tableData,' this.tableData');
         
      this.total =data.total;
    }, 100),
    back(){
        this.$router.push({ path: "/gridOperator/gridSituation" });
      },
    pageChange(val) {
      this.filter.page = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    //查看详情
    details(row){
        this.dialogCodeVisible=true
        this.tableData.map(item=>{
          if(item.id == row.id){
            item.identityNumber =  item.identityNumber.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/,"$1******$2")
            item.addres = item.addres.join(',')
            this.detailsData = item
          }
        })
      },

     changeDate( val) {
      if(val == null){
         this.filter.startTime=""
         this.filter.endTime = ''
          this._fetchData();
      }else{
         this.filter.startTime = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.filter.endTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },
     changeDate1( val) {
      if(val == null){
         this.filter.implementationStartTime=""
         this.filter.implementationEndTime = ''
          this._fetchData();
      }else{
         this.filter.implementationStartTime = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.filter.implementationEndTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");
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
        .taskImg{
          margin-right: 10px;
        }
        img{
           margin-right: 10px;
        }
    }
    
}

</style>
