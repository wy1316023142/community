<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">关怀人员</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.peopleName" clearable></el-input>
            <el-input  placeholder="身份证"  v-model="filter.identityNumber" clearable></el-input>
             <el-input  placeholder="责任人姓名"  v-model="filter.createUserName" clearable></el-input>
            <el-select v-model="filter.personType" placeholder="人员类型" clearable>
            <el-option v-for="item in peopleState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small"  @click="add()">新增关注</el-button>
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
                <el-table-column prop="peopleName" label="姓名" align='center' width="100"></el-table-column>
                <el-table-column prop="identityNumber" label="证件号" align='center'  width="180"></el-table-column>
                 <el-table-column prop="houseAddress" label="住址" align='center' width="160"></el-table-column>
                <el-table-column prop="personType" label="人员类型" align='center' width="160">
                   <template slot-scope="scope" >
                         {{scope.row.personType | personType}}
                      </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="责任人"  align='center' width="200"></el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="primary" size="mini" @click="removeConcerns(scope.row)">取消关注</el-button>
                        <el-button type="primary" size="mini" @click="gooutRecords(scope.row)">出入记录</el-button>
                        <el-button type="primary" size="mini" @click="careRecords(scope.row)">关怀记录</el-button>
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
    
    <!-- 进出记录 -->
     <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
      <div class="content">
         <el-row style="font-size:16px">
          <el-col :span="8"><p>姓名：<span>{{inoutName}}</span></p></el-col>
          <el-col :span="12"><p>身份证：<span>{{inoutCareId}}</span></p></el-col>
        </el-row>
          <div class="tableBox" style="margin-top:20px">
              <el-table :data="tableDataRecords" style="width: 100%;margin:20px 0px" stripe :height="300"  border>
                <el-table-column prop="organName"  label="序号" align='center' type="index" width="50"></el-table-column>
                <el-table-column prop="deviceName" label="门禁名称" align='center' width="100"></el-table-column>
                <el-table-column prop="environmentImageUrl" label="开门图片" align='center'  width="180">
                      <template scope="scope">
                        <el-popover placement="left"  trigger="click">
                          <img :src=" scope.row.environmentImageUrl" width="500"/>
                          <img slot="reference" :src=" scope.row.environmentImageUrl" width="40" height="40">
                        </el-popover>
                   </template>
                </el-table-column>
                <el-table-column prop="captureTime" label="开门时间" align='center' >
                </el-table-column>
              </el-table>
              <div class="pageBox pageBox1">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.size' :current-page='filter.current'></el-pagination>
              </div>
          </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false"> 关闭</el-button>
      </div>
    </el-dialog>
    <!-- 关怀记录 -->
    <el-dialog :title="dialogCode1" :visible.sync="dialogCodeVisible1"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
      <div class="content">
         <p class="title">基本信息</p>
         <div class="content-list">
                 <el-row>
                    <el-col :span="8"><p>姓名：<span>{{baseInfo.populationName}} </span></p></el-col>
                    <el-col :span="12"><p>身份行号：<span>{{baseInfo.identityNumber}}</span></p></el-col>
                </el-row>
                <el-row>
                  <el-col :span="24"><p>人员类型：<span>{{baseInfo.personType}}</span></p></el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><p>责任人：<span>{{baseInfo.wgyName}} </span></p></el-col>
                    <el-col :span="12"><p>责任人联系方式<span>{{baseInfo.wgyTel}}</span></p></el-col>
                </el-row>
         </div>
         <p class="title">关怀记录</p>
         <div v-for="(item,index) in careData" :key="index"  class="content-list">
            <el-row>
                <el-col :span="10"><p>时间：<span>{{item.updateTime?item.updateTime:"暂无"}}</span></p></el-col>
                <el-col :span="10"><p >上门关怀人员：<span>{{item.updateUserName?item.updateUserName:"暂无"}}</span></p></el-col>
            </el-row>
             <el-row>
                    <el-col :span="24"><p>记录照片:<br/>
                      <span v-for='(item1,index ) in item.filePathList  ' :key='index' v-show="item.filePathList">
                           <template  >
                          <el-popover placement="left"  trigger="click">
                            <img :src="item1" width="500"/>
                            <img slot="reference" :src="item1" width="40" height="40">
                          </el-popover>
                        </template>
                      </span>
                      <span v-show="!item.filePathList">暂无</span>
                      </p></el-col>
            </el-row>
            <el-row>
                    <el-col :span="24"> <p>上门关怀情况说明：<br/><span>{{item.remarks?item.remarks:"暂无"}}</span></p></el-col>
            </el-row>
         </div>
        
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible1 = false"> 关闭</el-button>
      </div>
    </el-dialog>
    <!-- 新政关注 -->
    <el-dialog :title="dialogCodeAdd" :visible.sync="dialogCodeVisibleAdd"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
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
                        <el-button type="primary" size="mini" @click="addResult(scope.row)">关注</el-button>
                    </template>
                </el-table-column>
              </el-table>
          </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisibleAdd = false"> 关闭</el-button>
      </div>
    </el-dialog>
    <!--修改 -->
     <el-dialog :title="dialogCodeTitle" :visible.sync="dialogCodeVisibleEdit"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px"  >
      <div class="editBox">
          <el-row class="list-1">
                <el-col :span="8"><p>姓名：<span>{{inoutName}}</span></p></el-col>
                <el-col :span="10"><p>身份证号<span>{{inoutCareId}}</span></p></el-col>
            </el-row>
            <el-form :model="filter" :rules="rules" ref="ruleForm" :label-position="top"  >
                <el-form-item label="关怀人员类型" prop="personTypeArr">
                <el-checkbox-group v-model="filter.personTypeArr">
                    <el-checkbox  v-for="i in peopleState" :label="i.id" :key="i.id" >{{i.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisibleEdit = false"> 取消</el-button>
        <el-button type="primary" @click="submit()" :loading="loading">确认</el-button>
        
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
      labelPosition: "top",
      importVisible: false,
      importData: [],
      fileList: [],
      fileHeader: {},
      dialogCodeVisibleAdd: false,
      dialogCodeAdd: "关注人员选择",
      dialogCodeVisibleEdit: false,
      dialogCodeTitle: "修改关怀人员",
      dialogCodeVisible: false,
      dialogCode: "关怀人员进出记录",
      dialogCodeVisible1: false,
      dialogCode1: "关怀记录",
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [
        {
          name: "张三",
          tel: "511322199909151451",
          remarks: "皇冠国际小区皇冠国际小区",
          url: require("../../assets/images/photo.png")
        }
      ],
      tableDataAdd: [],
      tableDataRecords:[],  
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
        name: "",
        peopleName:"",
        identityNumber:"",
        createUserName:"",
        personType:"",
        personTypeArr:[]
      },
      inoutName:"",
      inoutCareId:"",
      loading: false,
      time: [],
      peopleState: [],
      careData: [],
      baseInfo:{ },
      ruleForm: {
        type: []
      },
      rules: {
        personTypeArr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    console.log(this.row);

    //table高度
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 56;
      window.onresize = () => {
        this.tabHeight = this.$refs.content.offsetHeight - 56;
      };
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
    this.getPersonType()
  },
  methods: {
    //查询
    _fetchData: debounce(async function() {
      const data = await Api.getPageList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
        .then(res => res.data);
      if (data.result.records.length > 0) {
        for (var i = 0; i < data.result.records.length; i++) {
          if (data.result.records[i].identityNumber == null) {
          } else {
            var ss = data.result.records[i].identityNumber;
            var str1 = ss.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/, "$1******$2");
            data.result.records[i].identityNumber = str1;
          }
          if(this.filter.personType){
          this.filter.personTypeArr = this.filter.personType.split(",")
          }
        }
      }
      this.tableData = data.result.records;
      this.total = data.result.total;
    }, 100),
    //新增查询
    _fetchDataAdd: debounce(async function() {
      const data = await Api.getAddPageList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
        .then(res => res.data);
      if (data.result.records.length > 0) {
        for (var i = 0; i < data.result.records.length; i++) {
          if (data.result.records[i].identityNumber == null) {
          } else {
            var ss = data.result.records[i].identityNumber;
            var str1 = ss.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/, "$1******$2");
            data.result.records[i].identityNumber = str1;
          }
        }
      }
      this.tableDataAdd = data.result.records;
      this.total = data.result.total;
    }, 100),
    //新增
    addResult(row){
       Api.addList.post({organId:this.filter.organId,populationId:row.id },{ }).then(res=>{
           this.$message({message: '新增成功', type: 'success'})
                  this.dialogCodeVisibleAdd = false
                  this._fetchData();
        })
    },
    //取消关注
    removeConcerns(row){
      Api.unfollow.put({id:row.id, },{ }).then(res=>{
           this.$message({message: '取消关注成功', type: 'success'})
           this._fetchData();
        })
    },
    //新增查询
    add() {
      this.dialogCodeVisibleAdd = true;
      this._fetchDataAdd();
    },
    edit(row) {
      this.inoutName = row.peopleName
      this.filter.populationId = row.populationId
      this.filter.id = row.id
      this.filter.personType = this.filter.personTypeArr.join(',')
      if(row.identityNumber){
          this.inoutCareId =  row.identityNumber.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/, "$1******$2"); 
      }
      this.dialogCodeVisibleEdit = true;
    },
    submit() {
      this.dialogCodeVisibleEdit = false;
       Api.editList.put({populationId:this.filter.populationId,personType:this.filter.personType,id:this.filter.id },{ }).then(res=>{
           this.$message({message: '修改成功', type: 'success'})
            this.dialogCodeVisibleAdd = false
            this._fetchData();
        })
    },
    //进出记录
    gooutRecords(row) {
      this.inoutName = row.peopleName
      if(row.identityNumber){
          this.inoutCareId =  row.identityNumber.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/, "$1******$2"); 
      }
      this.dialogCodeVisible = true;
       Api.gooutRecords.get({populationId:row.id },{ }).then(res=>{
           this.tableDataRecords = res.data.result.records
        })
    },
    //关怀记录
    careRecords(row) {
      this.dialogCodeVisible1 = true;
      Api.careRecords.get({populationId:row.id },{ }).then(res=>{
        var data = res.data.result.records
          for(var i=0;i<data.length;i++){
               this.baseInfo.populationName = data[0].populationName
               this.baseInfo.identityNumber = data[0].identityNumber.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/, "$1******$2");
               this.baseInfo.personType = data[0].personType
               this.baseInfo.wgyName = data[0].wgyName
               this.baseInfo.wgyTel = data[0].wgyTel
          }
           this.careData = data
        })
    },
    getPersonType(){
        Api.getPersonType.get({ },{ }).then(res=>{
          res.data.result.forEach(element => {
            var  obj={
                label:element.name,
                id:element.type
              }
         this.peopleState.push(obj)
          });
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
    changeDate(val) {
      if (val == null) {
        this.filter.startDateStr = "";
        this.filter.endDateStr = "";
        this._fetchData();
      } else {
        this.filter.startDateStr = moment(this.time[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.filter.endDateStr = moment(this.time[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    }
  }
};
</script>
<style lang="less">
.pageBox1 {
  display: flex;
  flex-direction: row-reverse;
}
.content {
  height: 450px;
  overflow-y: auto;
  .title {
    font-size: 20px;
  }
  .content-list {
    padding: 20px;
    p {
      line-height: 30px;
    }
    img {
      margin: 0px 10px;
    }
  }
}

.editBox{
  height: 200px;
  .list-1 {
  margin: 20px 0;
}
.el-form-item__content {
    line-height: 40px;
    position: relative;
    top: 66px;
    left: -88px;
    font-size: 14px;
}
}

</style>
