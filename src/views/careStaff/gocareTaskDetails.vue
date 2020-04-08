<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">上门关怀任务>关怀任务详情</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.populationName" clearable></el-input>
           <el-select v-model="filter.concernsFlag" placeholder="是否上门关怀" clearable>
            <el-option v-for="item in goCareState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small"  @click="back()">返回</el-button>
         
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="24">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="姓名" align='center'   ></el-table-column>
                 <el-table-column prop="identityNumber" label="身份证号" align='center'  ></el-table-column>
                <el-table-column prop="areaUserName" label="责任人" align='center'  ></el-table-column>
                <el-table-column prop="concernsFlag" label="是否上门关怀" align='center'  >
                       <template slot-scope="scope" >
                         {{scope.row. concernsFlag | concernsFlag}}
                      </template>
                </el-table-column>
                <el-table-column prop="updateUserName" label="执行人" align='center'  ></el-table-column>
                <el-table-column prop="updateTime" label="执行时间" align='center'  ></el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="toDeails(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
               
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
     <!-- 查看详情 -->
    <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
      <div class="content">
          <p>关怀状态：<span>{{deailsData.concernsFlag==0?'已关怀':'未关怀'}}</span></p>
          <ul class="details-list">
              <el-row>
                <el-col :span="10"><li>姓名：<span>{{deailsData.name}}</span></li></el-col>
                <el-col :span="10"><li style="float:right">身份证：<span>{{deailsData.identityNumber}}</span></li></el-col>
            </el-row>
            <el-row>
                <el-col :span="24"><li>人员类型:<span>{{deailsData.personTypeName?deailsData.personTypeName : '暂无 '}}</span></li></el-col>
            </el-row>
              <el-row>
                <el-col :span="24"> <li>住址：<span>{{deailsData.addres ?deailsData.addres : '暂无 '}}</span></li></el-col>
              </el-row>
            <el-row>
                    <el-col :span="24"><li>上门关怀照片：
                      <span v-for='(item,index ) in deailsData.images  ' :key='index' v-show="deailsData.images">
                           <template  >
                          <el-popover placement="left"  trigger="click">
                            <img :src="item" width="500"/>
                            <img slot="reference" :src="item" width="40" height="40">
                          </el-popover>
                        </template>
                      </span>
                      <span v-show="!deailsData.images">暂无</span>
                      </li></el-col>
            </el-row>
            <el-row>
                    <el-col :span="24"> <li>上门关怀说明：<span>{{deailsData.remarks ?deailsData.remarks : '暂无 '}}</span></li></el-col>
            </el-row>
            
            <el-row>
                  <el-col :span="24"> <li>执行人：<span>{{deailsData.updateUserName ?deailsData.updateUserName : '暂无 '}}</span></li></el-col>
            </el-row>
              <el-row>
                  <el-col :span="24"> <li>执行时间：<span>{{deailsData.updateTime?deailsData.updateTime : '暂无 ' }}</span></li></el-col>
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
      dialogCodeVisible:false,
      dialogCode:"关怀人员详情",
      labelPosition:"top",
      isPublicity: 0,
      tableData: [ ],
      model: { },
      total: 0,
       filter: {
        populationName:"",
        concernsFlag:"",
          rows: 10,
        page: 0,
      },
      goCareName:"",
      goCareId:"",
      deailsData:{},
      firstErr: null,
      loading: false,
      time:[],
      taskId:"",
      goCareState:[
        { id: 0, label: "已关怀" },
        { id: 1, label: "未关怀" }, 
      ],       
       
    };
  },
  mounted() {
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
    this.taskId = this.$route.query.taskId
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      this.filter.taskId = this.taskId
      delete this.filter.organId;
      const data = await Api.records
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
         .then(res => res.data);
         if(data.rows.length>0){
            for(var i=0;i<data.rows.length;i++){
              if(data.rows[i].identityNumber==null){
              }else{
              var ss=data.rows[i].identityNumber
              var str1=ss.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/,"$1******$2")
               data.rows[i].identityNumber=str1
              }
           }
      }
         this.tableData =data.rows;
      this.total =data.total;
    }, 100),
    //点击查看详情
    toDeails(row){
        this.dialogCodeVisible = true
       Api.toDeails.get({taskId:this.taskId,populationId:row.populationId},{ }).then(res=>{
         res.data.result.identityNumber = res.data.result.identityNumber.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/,"$1******$2")
         res.data.result.addres = res.data.result.addres.join(',')
         this.deailsData = res.data.result
        })
    },
    pageChange(val) {
      this.filter.page = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    back(){
        this.$router.push({
              path: "/careStaff/gocareTask",
              // query: { state:1 }
            });
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
  }
};
</script>
<style lang="less">
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
