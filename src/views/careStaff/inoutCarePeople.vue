<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">长时未出入>关怀人员</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.concernsName" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small"  @click="add()">新增</el-button>
         <el-button type="primary" size="small"  @click="back()">返回</el-button>
         
      </div>
    </div>
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
                <el-table-column prop="concernsName" label="姓名" align='center'   ></el-table-column>
                <el-table-column prop="identityNumber" label="身份证号" align='center'  ></el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="remove(scope.row)">移除</el-button>
                    </template>
                </el-table-column>
               
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.size' :current-page='filter.current'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
     <el-dialog  :title="addDialogFormTitle" :visible.sync="careNotification"
     :close-on-press-escape="false" :modal-append-to-body='false' width="550px" top="5vh">
        <div class="content">
           <el-input
            placeholder="姓名"
            v-model="filter.name">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="_fetchDataAdd()" style="cursor: pointer;"></i>
          </el-input>
          <div class="tableBox" style="margin-top:20px">
              <el-table :data="tableDataAdd" style="width: 100%" stripe :height="300"  border>
                <el-table-column prop="organName"  label="序号" align='center' type="index" width="50"></el-table-column>
                <el-table-column prop="name" label="姓名" align='center' width="100"></el-table-column>
                <el-table-column prop="identityNumber" label="证件号" align='center'  width="180"></el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="choose(scope.row)">选择</el-button>
                    </template>
                </el-table-column>
              </el-table>
          </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="careNotification = false"> 关闭</el-button>
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
      careNotification:false,
      addDialogFormTitle:"新增",
      isPublicity: 0,
      tableData: [ ],
      tableDataAdd:[],
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
      name:"",
      taskId:"",
      organId:"",
      loading: false,
      time:[],
      goCareState:[
           { id: 0, label: "未开始" },
        { id: 1, label: "进行中" }, 
        { id: 2, label: "已结束" },
      ],
      form:{

      },
       
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
    
  this.taskId = this.$route.query.taskId
  this.organId = this.$route.query.organId
    console.log(this.taskId);    
    this._fetchData();
  },
  methods: {
    //查新
    _fetchData: debounce(async function() {
      const data = await Api.getTaskNoAppear
        .get({taskId:this.taskId,concernsName:this.filter.concernsName}, {
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
    //新增查询
     _fetchDataAdd: debounce(async function() {
      const data = await Api.getAddTaskNoAppear
        .get({taskId:this.taskId,organId:this.organId,name:this.filter.name}, {
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
         this.tableDataAdd = data.result.records;
      this.total =data.result.total;
    }, 100),
    //选择
    choose(row){
         Api.choose.put({populationId:row.id, taskId:this.taskId},{ }).then(res=>{
            this.$message({message: '选择成功', type: 'success'})
                this.careNotification = false
                this._fetchData();
        })
    },
     //移除
    remove(row){
         Api.remove.put({id:row.id},{ }).then(res=>{
            this.$message({message: '移除成功', type: 'success'})
                // this.careNotification = false
                this._fetchData();
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
    add(){
      this.careNotification=true
      this._fetchDataAdd()
    },
    back(){
        this.$router.push({
              path: "/careStaff/inoutPeople",
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

.taskintro{
 .el-textarea__inner{
  min-height: 150px !important;
}
}

</style>
