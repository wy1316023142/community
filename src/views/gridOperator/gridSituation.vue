<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">网格员任务执行情况</p>
      <div class="flexItem text_r">
            <el-input  placeholder="姓名"  v-model="filter.userName" clearable></el-input>
            <el-input  placeholder="电话号码"  v-model="filter.mobile" clearable  ></el-input>
            <el-button type="primary" size="small">搜索</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" :header-cell-style="rowClass" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="userName" label="姓名" align='center'></el-table-column>
                <el-table-column prop="mobile" label="手机号" align='center'></el-table-column>
                <el-table-column prop="handledAlarmNum" label="已处理告警数量" align='center' >
                    <template slot-scope="scope" >
                         <el-button type="text"  @click="jump(1,scope.row)">{{scope.row.handledAlarmNum}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="executedConcernsNum" label="已执行关怀任务数量" align='center' >
                   <template slot-scope="scope" >
                         <el-button type="text"  @click="jump(3,scope.row)">{{scope.row.executedConcernsNum}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="enterHouseNum" label="已录入信息房屋数量" align='center' >
                  <template slot-scope="scope" >
                         <el-button type="text"  @click="jump(5,scope.row)">{{scope.row.enterHouseNum}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="untreatedAlarmNum" label="待处理告警数量" align='center' >
                  <template slot-scope="scope" >
                         <el-button type="text"  @click="jump(2,scope.row)">{{scope.row.untreatedAlarmNum}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="notExecutedConcernsNum" label="待执行关怀任务数量" align='center' >
                  <template slot-scope="scope" >
                         <el-button type="text"  @click="jump(4,scope.row)">{{scope.row.notExecutedConcernsNum}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="notEnterHouseNum" label="未录入信息房屋数量" align='center'  >
                  <template slot-scope="scope" >
                         <el-button type="text"  @click="jump(6,scope.row)">{{scope.row.notEnterHouseNum}}</el-button>
                    </template>
                </el-table-column>

              </el-table>
              <div class="pageBox">
                <!-- <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination> -->
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.rows' :current-page='filter.page '></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
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
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [{
        mobile:"1263565",
        handledAlarmNum:"1",
        executedConcernsNum:"9",
        enterHouseNum:"9",
        untreatedAlarmNum:"0",
        notExecutedConcernsNum:"0",
        notEnterHouseNum:"0",
      } 
      ,
      {
        mobile:"1263565",
        handledAlarmNum:"1",
        executedConcernsNum:"9",
        enterHouseNum:"9",
        untreatedAlarmNum:"0",
        notExecutedConcernsNum:"0",
        notEnterHouseNum:"0",
      } ],
      model: {
        imgStr: "",
        name: "",
        phone: ""
      },
      total: 0,
       filter: {
        organId: 0,
        rows: 10,
        page : 0,
        
      },
      firstErr: null,
      loading: false,
      time:[],
     
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
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.getAreaPageList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
         .then(res => res.data);
         this.tableData = data.rows;
      this.total =data.total;
    }, 100),
    jump(type,row){
      console.log(row,' this.userId');
      
       if(type == 1){
       this.$router.push({
              path: "/gridOperator/grisldAbnormalalarm",
              query: { state:1,userName:row.userName }
            });
      }else if(type == 2){
        this.$router.push({
              path: "/gridOperator/grisldAbnormalalarm",
              query: { state:0,userName:row.userName }
            });
      }else if(type == 3){
        this.$router.push({
              path: "/gridOperator/grisldTask",
              query: { state:0,userId:row.userId,userName:row.userId}
            });
      }else if(type == 4){
        this.$router.push({
              path: "/gridOperator/grisldTask",
              query: { state:1,userId:row.userId,userName:row.userId }
            });
      }else if(type == 5){
        this.$router.push({
              path: "/gridOperator/houseCollection",
              query: { userId:row.userId,userName:row.userName }
            });
      }else if(type == 6){
        this.$router.push({
              path: "/gridOperator/houseCollection",
              query: { state:1,userId:row.userId,userName:row.userName}
            });
      }
    },
    rowClass({row, column, rowIndex, columnIndex}){
    //       console.log(columnIndex,rowIndex,);
    //       if(rowIndex === 0 && columnIndex === 1 || columnIndex === 2|| columnIndex === 0){ //指定坐标
    //     return ''
    // }else{
    //     return ' cursor: pointer'
    // }
    },
    pageChange(val) {
      this.filter.page = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
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
.el-button--text{
   color: #606266 !important;
}
</style>
