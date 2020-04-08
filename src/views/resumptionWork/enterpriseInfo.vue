<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">企业复工登记信息</p>
      <div class="flexItem text_r">
           <el-input  placeholder="企业名称"  v-model="filter.enterpriseName" clearable></el-input>
         <el-select v-model="filter.peopleNumbers" placeholder="企业人数" clearable>
          <el-option v-for="item in companyNumber"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <a title='所属行业'>
            <el-select v-model="filter.industry" placeholder="所属行业" clearable>
            <el-option v-for="item in industry"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        </a>
        申报时间：<el-date-picker  @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small" @click='download()'  v-allow="1100301">导出</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="enterpriseName" label="企业名称" align='center'></el-table-column>
                 <el-table-column prop="createTime" label="申报时间" align='center' width="180">
                     <template slot-scope="scope" >
                         {{scope.row.createTime | daterful('YYYY-MM-DD HH:mm:ss')}}
                      </template>
                </el-table-column>
                 <el-table-column prop="peopleNumbers" label="企业人数" width="140" align='center'>
                       <template slot-scope="scope" >
                                  {{scope.row.peopleNumbers|companyNumber}}
                       </template>
                </el-table-column>
                <el-table-column prop="streetName" label="企业经营所在地" align='center'></el-table-column>
                 <el-table-column prop="industry_dictText" label="所属行业" width="220" align='center'>
                    
                </el-table-column>
                <el-table-column prop="address" label="经营地址" align='center' width="200"></el-table-column>
                <el-table-column prop="building" label="所在楼宇" align='center' width="140"> </el-table-column>
                <el-table-column prop="legalPerson" label="法人代表" align='center'  width="120"></el-table-column>
                <el-table-column prop="tel" label="联系方式" width="180" align='center'></el-table-column>
                <el-table-column prop="contacts" label="联系人" width="140" align='center'></el-table-column>
                <el-table-column prop="telPhone" label="复工结果通知联系方式" width="180" align='center'></el-table-column>
                <el-table-column prop="workNumber" label="拟复工人数" align='center' width="140"></el-table-column>
                <el-table-column prop="workDate" label="拟复工时间"  align='center' width="140"></el-table-column>
                <el-table-column label="操作" align='center' width="100">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  @click="toDetails(scope.row)">附件查看</el-button>
                
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
      tableData: [ ],
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
      companyNumber:[
        { id: 1, label: "100人以上（含）" },
        { id: 2, label: "100人以下" },
      ],
      industry:[],
     
      
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
    this.getIndustry()
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.epidemicEnterpriseDeclaration
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
       .then(res => res.data);
      
         this.tableData = data.result.records;
      this.total =data.result.total;
    }, 100),
    getIndustry(){
        Api.getIndustry.get({},{ }).then(res=>{
            for(var i =0;i<res.data.result.length;i++){
                var obj={} 
                obj.id = i;
                obj.label = res.data.result[i].itemText
            this.industry.push(obj)
            }
        })
    },
    download(){
    window.open(`${myConfig.baseUrl}/business/epidemicEnterpriseDeclaration/searchPageListToExcel?organId=${this.filter.organId}`)
    },
    toDetails(rows){
        console.log(rows);
        this.$router.push({
            path:'/resumptionWork/enclosureUpdown' ,
            query: { activityId: rows.id }
            })
    },
    pageChange(val) {
      this.filter.current = val - 1;
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

.el-pager{
  margin-top: 0px !important;
}

</style>
