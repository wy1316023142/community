<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">上门关怀任务</p>
      <div class="flexItem text_r">
           <el-input  placeholder="任务名称"  v-model="filter.taskName" clearable></el-input>
            <el-select v-model="filter.taskFlag" placeholder="状态" clearable>
            <el-option v-for="item in goCareState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small"  @click="edit()">新增</el-button>
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
                <el-table-column prop="taskName" label="任务名称" align='center'  width="130"></el-table-column>
                 <el-table-column prop="createTime" label="创建时间" align='center' width="100"></el-table-column>
                <el-table-column prop="createUserName" label="创建人" align='center'></el-table-column>
                <el-table-column prop="concernsPersonNum" label="关怀人数"  align='center'  width="100"></el-table-column>
                <el-table-column prop=" taskFlag" label="关怀状态"  align='center'>
                    <template slot-scope="scope" >
                         {{scope.row. taskFlag | votingStates}}
                      </template>
                </el-table-column>
                <el-table-column prop="concernsSituation" label="执行情况"  align='center'  width="100"></el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" v-if='scope.row. taskFlag == 2' @click="stopStartTask(scope.row)">停止</el-button>
                        <el-button type="primary" size="mini" v-if='scope.row. taskFlag == 3' @click="careDetails(scope.row)">查看详情</el-button>
                        <el-button type="primary" size="mini" v-if='scope.row. taskFlag == 1' @click="edit(scope.row)">修改</el-button>
                        <el-button type="primary" size="mini" v-if='scope.row. taskFlag == 1' @click="deleteRow(scope.row)">删除</el-button>
                        <el-button type="primary" size="mini" @click='carePeople(scope.row)'>关怀人员</el-button>
                        
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
        <el-form ref="form" :model="model" :show-message="false" :rules="rules" >
            <el-form-item label="任务名称:" prop="taskName">
                <el-input v-model="model.taskName" maxLength="32"></el-input>
            </el-form-item>
             <el-form-item label="活动时间：" prop="time">
                <el-date-picker @change="changeDate" v-model="model.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
              </el-form-item>
              <el-form-item label="任务描述:" class="taskintro" prop="remarks">
               <el-input type="textarea" v-model="model.remarks" style="min-height:50px"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
              <el-button @click="careNotification =false">取 消</el-button>
              <el-button type="primary" @click="submitEdit()" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import OrganTree from "../../components/OrganTree.vue";
import moment from "moment";
import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
import { domHeightMixin } from "../../commom/mixins.js";
import { getBase64, convert2JPEG } from "../../commom/util.js";
import { validDate } from "../../commom/validator";
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
      tableData: [  ],
      model: {
       taskName:"",
       endTime:"",
       startTime:"",
       remarks:"",
       time:[]
      },
      total: 0,
       filter: {
        organId: 0,
        rows: 10,
        page: 0,
        taskName:"",
        taskFlag:'',
        
      },
      name:"",
      firstErr: null,
      loading: false,
      time:[],
      goCareState:[
           { id: 1, label: "未开始" },
        { id: 2, label: "进行中" }, 
        { id: 3, label: "已结束" },
      ],
       rules:{
        taskName: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
        time: [
            {  required: true, message: '请选择日期', trigger: 'change' }
          ],  
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
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.goCareSeach
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
         .then(res => res.data);
         if(data.rows.length>0){
          data.rows.forEach(item=>{
              item.time = []
              item.time.push(item.startTime,item.endTime)
             
          })
      }
         this.tableData = data.rows;
      this.total =data.total;
    }, 100),
   edit(row={}){
        this.model.id = row.id
         this.careNotification = true
          this.addDialogFormTitle = !row.id ? '新增任务' : '编辑任务'
        this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
    },
    async submitEdit() {
        this.model.organId = this.filter.organId
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addCareTask.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.careNotification = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.editCareTask.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.careNotification = false
                this._fetchData();
              }).catch(err => {
              })
            }
            this.careNotification = false
          this.loading = false;
            
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      //删除
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.delCareTask.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
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
      async stopStartTask(row) {
        this.$confirm(`确定停止吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.stopCareTask.put({}, {
            pathParams: {
              id: row.id,
              taskFlag:3
            }
          }).then(res => {
            this.$message({message: '停止成功', type: 'success'})
            this._fetchData()
          }).catch(() => {

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停止'
          })
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
    carePeople(row){
      this.$router.push({
              path: "/careStaff/gocareTaskPeople",
              query: {taskId:row.id,concernsFlag:row.taskFlag}
            });
    },
    careDetails(row){
       this.$router.push({
              path: "/careStaff/gocareTaskDetails",
               query: {taskId:row.id}
            });
    },
     changeDate( val) {
      if(val == null){
         this.model.startTime=""
         this.model.endTime = ''
          this._fetchData();
      }else{
         this.model.startTime = moment(this.model.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.model.endTime = moment(this.model.time[1]).format("YYYY-MM-DD HH:mm:ss");
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
