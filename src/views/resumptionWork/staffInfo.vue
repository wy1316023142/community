<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">单位职工申报信息</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.name" clearable></el-input>
        <el-input  placeholder="证件号"  v-model="filter.identityNumber" clearable  ></el-input>
        <el-input  placeholder="电话号码"  v-model="filter.tel" clearable  ></el-input>
        <el-input  placeholder="单位名称"  v-model="filter.enterpriseName" clearable></el-input>
       
        <a title='是否于2020年1月8日以后由湖北（途径）来（返）成都' >
            <el-select v-model="filter.hubeiToChengdu" placeholder="是否于2020年1月8日以后由湖北（途径）来（返）成都" clearable>
            <el-option v-for="item in hubeiToChengdu"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        </a>
          <a title='是否有发热/干咳/乏力/连续拉肚子等感冒症状' >
            <el-select v-model="filter.epidemicFlag" placeholder="是否有发热/干咳/乏力/连续拉肚子等感冒症状" clearable>
            <el-option v-for="item in epidemicFlag"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        </a>
        <a href="#" title='是否有接触过疑似病患/接待来自湖北的亲友' >
            <el-select v-model="filter.touchWithHubeiFlag" placeholder="是否有接触过疑似病患/接待来自湖北的亲友" clearable>
            <el-option v-for="item in touchWithHubeiFlag"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        </a>
        <a href="#" title='是否知道身边人员有上述情况'  >
            <el-select v-model="filter.knowOtherPersonnel" placeholder="是否知道身边人员有上述情况" clearable>
            <el-option v-for="item in knowOtherPersonnel"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        </a>
        
       申报时间：<el-date-picker  @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small" @click='download()'  v-allow="1100201" >导出</el-button>
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
                <el-table-column prop="name" label="姓名" align='center'></el-table-column>
                <el-table-column prop="identityNumber" label="身份证号" align='center' width="180"></el-table-column>
                <el-table-column prop="tel" label="手机号" align='center' width="180"></el-table-column>
                <el-table-column prop="declarationTime" label="申报时间" align='center'  width="180">
                     <!-- <template slot-scope="scope" >
                         {{scope.row.declarationTime | daterful('YYYY-MM-DD HH:mm:ss')}}
                      </template> -->
                </el-table-column>
                <el-table-column prop="photoPath" label="照片" align='center'>
                     <template scope="scope">
                    <!-- <img :src=" scope.row.photoPath" width="40" height="40" /> -->
                     <el-popover placement="left"  trigger="click">
                      <img :src=" scope.row.photoPath" width="500"/>
                      <img slot="reference" :src=" scope.row.photoPath" width="40" height="40">
                    </el-popover>
                   </template>
                </el-table-column>
                <el-table-column prop="enterpriseName" label="单位名称" align='center'></el-table-column>
                <el-table-column prop="streetName" label="企业经营所在地" width="180" align='center'></el-table-column>
                <el-table-column prop="address" label="企业所在楼宇及房号" width="180" align='center'></el-table-column>
                <el-table-column prop="comefrom" label="从什么地方返回成都" width="180" align='center'>
                    <!-- <template slot-scope="scope" >
                                  {{scope.row.hubeiToChengdu|trueType}}
                       </template> -->
                </el-table-column>
                <el-table-column prop="epidemicFlag" label="是否有发热/干咳/乏力/连续拉肚子等感冒症状" width="120" align='center'>
                       <template slot-scope="scope" >
                                  {{scope.row.epidemicFlag|trueType}}
                       </template>
                </el-table-column>
                <el-table-column prop="hubeiToChengdu" label="是否于2020年1月8日以后由湖北（途径）来（返）成都" width="120" align='center'>
                        <template slot-scope="scope" >
                                  {{scope.row.hubeiToChengdu|trueType}}
                       </template>
                </el-table-column>
                <el-table-column prop="touchWithHubeiFlag" label="是否有接触过疑似病患/接待来自湖北的亲友" width="120" align='center'>
                       <template slot-scope="scope" >
                                  {{scope.row.touchWithHubeiFlag|trueType}}
                       </template>
                </el-table-column>
                <el-table-column prop="knowOtherPersonnel" label="是否知道身边人员有上述情况" width="120" align='center'>
                      <template slot-scope="scope" >
                                  {{scope.row.knowOtherPersonnel|trueType}}
                       </template>
                </el-table-column>
                <el-table-column prop="remarks" label="有上述情况之一的详细描述" width="180" align='center'></el-table-column>

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
      hubeiToChengdu:[
           { id: 0, label: "是" },
        { id: 1, label: "否" }, 
      ],
       epidemicFlag:[
           { id: 0, label: "是" },
        { id: 1, label: "否" }, 
      ],
       touchWithHubeiFlag:[
           { id: 0, label: "是" },
        { id: 1, label: "否" }, 
      ],
      knowOtherPersonnel:[
           { id: 0, label: "是" },
        { id: 1, label: "否" }, 
      ],
    };
  },
  mounted() {
    console.log(this.row);

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
      const data = await Api.WorkersSearchPageList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
         .then(res => res.data);
         if(data.result.records.length>0){
            for(var i=0;i<data.result.records.length;i++){
              if(data.result.records[i].identityNumber==null){
              }else{
              var ss=data.result.records[i].identityNumber
              var str1=ss.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/,"$1******$2")
               data.result.records[i].identityNumber=str1
              }

           }
      }
         this.tableData = data.result.records;
      this.total =data.result.total;
    }, 100),
    download(){
        window.open(`${myConfig.baseUrl}/business/epidemicDeclarationWorkers/searchPageListToExcel?organId=${this.filter.organId}`)
      },
    pageChange(val) {
      this.filter.current = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    //公示
  

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

</style>
