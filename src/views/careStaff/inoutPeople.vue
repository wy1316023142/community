<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">长时未出入人员</p>
      <div class="flexItem text_r">
           <el-input  placeholder="任务名称"  v-model="filter.taskName" clearable></el-input>
            <el-select v-model="filter.taskFlag" placeholder="状态" clearable>
            <el-option v-for="item in goCareState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small"  @click="add()">新增</el-button>
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
                <el-table-column prop="taskNumber" label="任务编号" align='center'  width="120" ></el-table-column>
                <el-table-column prop="taskName" label="任务名称" align='center'  width="140"></el-table-column>
                 <el-table-column prop="createTime" label="创建时间" align='center'></el-table-column>
                <el-table-column prop="createUserName" label="创建人" align='center'></el-table-column>
                <el-table-column prop="concernsPeopleCount" label="关怀人数"  align='center'  width="50"></el-table-column>
                <el-table-column prop="taskFlag" label="关怀状态"  align='center'>
                    <template slot-scope="scope" >
                         {{scope.row.taskFlag | inoutState}}
                      </template>
                </el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" v-if='scope.row.taskFlag == 1' @click="stopTask(scope.row)">停止</el-button>
                        <el-button type="primary" size="mini" v-if='scope.row.taskFlag == 2' @click="startTask(scope.row)">开始</el-button>
                        <el-button type="primary" size="mini" @click="add(scope.row)">修改</el-button>
                        <el-button type="primary" size="mini" @click="delTask(scope.row)">删除</el-button>
                        <el-button type="primary" size="mini" @click='carePeople(scope.row)'>关怀人员</el-button>
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
        <el-form ref="form" :model="model" :show-message="false" :rules="rules" >
            <el-form-item label="任务名称:" prop="taskName">
                <el-input v-model="model.taskName" maxLength="32"></el-input>
            </el-form-item>
            <el-form-item label="未出现天数:"  prop="dayNum">
                <el-input v-model="model.dayNum" maxLength="32"></el-input>
            </el-form-item>
              <el-form-item label="任务描述:" class="taskintro">
               <el-input type="textarea" v-model="model.remarks" style="min-height:50px"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
              <el-button @click="careNotification =false">取 消</el-button>
              <el-button type="primary" @click="submit()" :loading="loading">确 定</el-button>
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
import { log, debuglog, debug } from "util";
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
      model: {
        dayNum:'',
        taskName: "",
        remarks:"",
        id:"",
        organId:0,
      },
      total: 0,
       filter: {
        organId: 0,
        size: 10,
        current: 0,
        taskName:"",
      },
      name:"",
      firstErr: null,
      loading: false,
      time:[],
      goCareState:[
           { id: 1, label: "关注中" },
        { id: 2, label: "已停止" }, 
      ],
      form:{

      },
      rules:{
        taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
        dayNum: [
            { required: true, message: '请输入未出入天数', trigger: 'blur' }
          ],  
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
    this._fetchData();
  },
  methods: {
    
    _fetchData: debounce(async function() {
      const data = await Api.taskNoAppear
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
    pageChange(val) {
      this.filter.current = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    add(row={}){
      this.addDialogFormTitle = !row.id ? '新增' : '编辑'
      this.model = cloneDeep(row)
      this.model.id = row.id
      this.careNotification=true
    },
    //新增修改
    submit(){
        this.model.dayNum =  this.model.dayNum*1
        this.model.organId = this.filter.organId
         this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addTaskNoAppear.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.editTaskNoAppear.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.dialogFormVisible = false
                this._fetchData();
              }).catch(err => {
              })
            }
            this.careNotification=false
            this.loading = false
            
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
    },
    //删除
    async delTask(row) {
      this.$confirm(`确定删除吗？`, '提示', {
        type: 'warning'
      }).then(async () => {
        const data = await  Api.editTaskNoAppear.put({delFlag:1, id: row.id},{ }).then(res=>{
          this.$message({message: '删除成功', type: 'success'})
          this._fetchData()
        }).catch(() => {

        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    //停止
    stopTask(row){
      this.$confirm(`确定要停止任务吗？`, '提示', {
        type: 'warning'
      }).then(async () => {
        const data = await  Api.editTaskNoAppear.put({taskFlag:2, id: row.id},{ }).then(res=>{
          this.$message({message: '停止成功', type: 'success'})
          this._fetchData()
        })
      })
    },
    //开始
    startTask(row){
      this.$confirm(`确定要开始任务吗？`, '提示', {
        type: 'warning'
      }).then(async () => {
        const data = await  Api.editTaskNoAppear.put({taskFlag:1, id: row.id},{ }).then(res=>{
          this.$message({message: '已开始', type: 'success'})
          this._fetchData()
        })
      })
    },
    carePeople(row){
      this.$router.push({
              path: "/careStaff/inoutCarePeople",
              query: {taskId:row.id,organId:this.filter.organId}
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
