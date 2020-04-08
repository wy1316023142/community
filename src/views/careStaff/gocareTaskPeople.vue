<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">上门关怀任务>关怀人员</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.populationName" clearable></el-input>
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
                <el-table-column prop="name" label="姓名" align='center'   ></el-table-column>
                <el-table-column prop="identityNumber" label="身份证号" align='center'  ></el-table-column>
                
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="delChoose(scope.row)">移除</el-button>
                       
                        
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
      labelPosition:"top",
      isPublicity: 0,
      tableData: [ 
          {
              name:'11',
              careState:"0",
              tel:"11111111111",
              remarks:"dfffds",
              enterpriseName:"dzf",
              streetName:'33'
          },
           {
              name:'11',
              careState:"1"
          }, {
              name:'11',
              careState:"2"
          },
      ],
      tableDataAdd:[], 
       model: {
        imgStr: "",
        name: "",
        phone: ""
      },
      total: 0,
       filter: {
        // organId: 0,
        rows: 10,
        page: 0,
        // populationName:""
        
      },
      taskId:"",
      concernsFlag:"",
      name:"",
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
    this.concernsFlag = this.$route.query.concernsFlag
    this._fetchData();

  },
  methods: {
    _fetchData: debounce(async function() {
      this.filter.taskId = this.taskId
      this.filter.concernsFlag = this.concernsFlag
      delete this.filter.organId;
      const data = await Api.concernsPersonnel
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
         this.tableData = data.rows;
      this.total =data.total;
    }, 100),
    //新增查询
    _fetchDataAdd: debounce(async function() {
      this.filter.taskId = this.taskId
      this.filter.concernsFlag = this.concernsFlag
      
      delete this.filter.organId;
      const data = await Api.waitConcernsPersonnel
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
         this.tableDataAdd = data.rows;
      this.total =data.total;
    }, 100),
    pageChange(val) {
      this.filter.page = val - 1;
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
    submit(){
        this.careNotification=false
    },
    choose(row){
        Api.chooseCare.put({},{ 
            pathParams: {
                  populationId:row.populationId, taskId:this.taskId
                }
        }).then(res=>{
            this.$message({message: '选择成功', type: 'success'})
                this.careNotification = false
                this._fetchData();
        })
    },
    delChoose(row){
        Api.delChooseCare.delete({},{ 
            pathParams: {
                  populationId:row.populationId, taskId:this.taskId
                }
        }).then(res=>{
            this.$message({message: '取消成功', type: 'success'})
                this.careNotification = false
                this._fetchData();
        })
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
.propForm{
    color: red;
    position: absolute;
  }
  .left28{
    top: 11px;
    left: 33px;
  }
  .left0{
    top: 75px;
    left: 25px;
  }
.taskintro{
 .el-textarea__inner{
  min-height: 150px !important;
}
}

</style>
