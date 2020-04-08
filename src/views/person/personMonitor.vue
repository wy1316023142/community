<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">布控任务</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="任务名称" v-model="filter.taskName" clearable></el-input>
        <el-select v-model="filter.status" placeholder="任务状态" clearable>
          <el-option v-for="item in taskStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" :loading="editLoading" size="small" @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <div class="zhsq-right-con" ref="content">
        <div class="tableBox">
          <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
            <el-table-column label="序号" align='center' type="index"></el-table-column>
            <el-table-column prop="taskName" label="任务名称" align='center'></el-table-column>
            <el-table-column prop="statusName" label="任务状态" align='center'></el-table-column>
            <el-table-column prop="createTimeStr" label="创建时间" align='center' width="150"></el-table-column>
            <el-table-column prop="createUserName" label="创建人" align='center'></el-table-column>
            <el-table-column prop="organName" label="创建机构" align='center'></el-table-column>
            <el-table-column prop="targetNum" label="目标人数" align='center'></el-table-column>
            <el-table-column prop="matchScore" label="相似度" align='center' ></el-table-column>
            <el-table-column label="操作" align='center' width="220">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"  v-if="scope.row.status == 1" @click="editRow(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" v-if="scope.row.status == 1"  @click="deleteRow(scope.row)">删除</el-button>
                <el-button type="success" size="mini" v-if="scope.row.status == 1" @click="startTask(scope.row.id)">开始</el-button>
                <el-button type="danger" size="mini" v-if="scope.row.status == 0" @click="stopTask(scope.row.id)">停止</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageBox">
            <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog class="monitorPersons-dialog"  :title="dialogFormTitle" :visible.sync="dialogFormVisible"  :close-on-click-modal="false"  :modal-append-to-body='false' width="400px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="任务名称：" prop="taskName">
          <el-input autocomplete="off" v-model="model.taskName"></el-input>
        </el-form-item>
        <el-form-item label="布控状态：" prop="status">
          <el-radio v-model="model.status" :label='0'>开启</el-radio>
          <el-radio v-model="model.status" :label='1'>关闭</el-radio>
        </el-form-item>
        <el-form-item label="识别度：" prop="matchScore">
          <el-input   v-model.number="model.matchScore" ></el-input>
        </el-form-item>
        <el-form-item label="任务描述：" prop="describes">
          <el-input type="textarea" autocomplete="off" v-model="model.describes"></el-input>
        </el-form-item>
        <el-form-item label="目标人：" prop="monitorPersons">
          <el-popover placement="right" width="714" trigger="click" ref="targetPersonPopover">
            <i class="el-icon-circle-plus-outline font32" slot="reference"  ></i>
            <div class="monitorPersons-popover">
              <el-transfer
                v-model="targetPersons"
                filterable
                filter-placeholder="请输入姓名"
                :props="{
                  key: 'personId',
                  label: 'personName'
                }"
                :titles="['选择人员', '已选择人员']"
                :button-texts="['移除', '添加']"
                :data="monitorPersons">
                <div slot-scope="{ option }" class="monitorPersons-transfer">
                  {{ option.personName }}{{ option.identityNumber }}
                  <el-popover placement="left"  trigger="click">
                    <img :src="option.imagePath" width="300"/>
                    <img slot="reference" :src="option.imagePath"  width="40" height="40">
                  </el-popover>
                </div>
              </el-transfer>
            </div>
          </el-popover>
          <el-input  v-model="model.monitorPersons" v-if="false"></el-input>
        </el-form-item>
        <el-form-item label="布控区域：" prop="monitorDevices"  >
          <el-popover placement="right" width="500" trigger="click" ref="targetAreaPopover">
            <i class="el-icon-circle-plus-outline font32" slot="reference"  ></i>
            <div class="popover zhsq-popover">
              <el-tree
                :data="targetArea"
                ref="targetArea"
                node-key="treeKey"
                :props="defaultProps"
                highlight-current
                :default-expanded-keys="activmMonitorArea"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <el-checkbox v-model="node.checked" v-if="data.type==3"></el-checkbox>
                  <span class="el-tree-node__label" :style="{color:(data.type==3?'#409EFF':'')}">{{ data.orgName }}</span>
                </div>
              </el-tree>
              <div class="center mt10">
                <el-button type="primary" @click="targetAreaSubmit" size="mini">确定</el-button>
              </div>
            </div>
            <el-input  v-model="model.monitorDevices" v-if="false"></el-input>
          </el-popover>
        </el-form-item>

      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import { domHeightMixin } from '../../commom/mixins.js'
  import ElImage from "../../../node_modules/element-ui/packages/image/src/main.vue";
  export default {
    mixins: [ domHeightMixin ],
    name: 'vehicle',
    components: {
      ElImage,
      OrganTree},
    data() {
      return {

        editLoading:false,
        targetArea:[],
        targetPersons:[],
        monitorPersons:[],
        activmMonitorArea:[],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        dialogFormVisible: false,
        dialogFormTitle: '',
        tableData: [],
        model: {},
        total: 0,
        filter: {
          organId: 1,
          page: 1,
          rows: 10,
          taskName: '',
          xj: 1,
          status: '',
        },
        firstErr: null,
        loading: false,
        taskStatus: [
          {id: 0, label: '开启'},
          {id: 1, label: '关闭'}
        ],
        rules: {
          taskName: [{
            required: true,
            message: '请填写任务名称',
            trigger: 'blur'
          },{
            max: 5,
            message: '任务名称长度小于5',
            trigger: 'blur'
          }],
          matchScore: [{
            required: true,
            message: '请填写相似度',
            trigger: 'blur'
          },{
            pattern: /^100$|^(\d|[1-9]\d)$/,
            message: '相似度范围为0-100',
            trigger: 'blur'
          }],
          monitorDevices: [{
            required: true,
            message: '请选择布控区域',
            trigger: 'blur'
          }],
          monitorPersons: [{
            required: true,
            message: '请选择目标人',
            trigger: 'blur'
          }]


        }
      }
    },
    mounted() {
      this.filter.organId = JSON.parse(localStorage.getItem('user')).organId;
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.personMonitor.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row = {
        status:1, //默认关闭
        monitorDevices:[],
        monitorPersons:[]
      }) {
        this.editLoading=true;
        const targetPerson = Api.getAttentionPerson.get({organId: this.filter.organId,page: null,rows: null,})
        const targetArea = Api.getTargetArea.get({}, {pathParams: {orgId: this.filter.organId}})
        Promise.all([targetPerson, targetArea]).then(([res1, res2]) => {
          this.editLoading=false;
          this.monitorPersons=res1.data.rows;
          this.targetArea=[res2.data.result];
          this.dialogFormTitle = !row.id ? '新增' : '编辑'
          this.activmMonitorArea=[]
          this.targetPersons=[]
          if(!row.id){
            this.dialogFormVisible = true
            this.model = cloneDeep(row)
          }else {
            Api.getPersonMonitor.get({}, {pathParams: {id: row.id}}).then(res=>{
              row=res.data.result
              this.model = cloneDeep(row);
              this.model.monitorPersons.forEach(item=>{
                this.targetPersons.push(item.personId)
              })
              this.model.monitorPersons=[];
              this.model.monitorDevices.map(item=>{
                this.activmMonitorArea.push(item.treeKey);
              })
              this.dialogFormVisible = true
              this.$nextTick(() => {
                this.$refs.targetArea.setCheckedKeys( this.activmMonitorArea);
              })
            })
          }
        }).catch(()=>{
          this.editLoading=false;
        })
      },
      async submit() {
        this.targetPersons.forEach(item=>{
          this.model.monitorPersons.push({
            personId:item
          })
        })
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {

            this.firstErr = null
            this.loading = true
            if(this.model.id){
              await Api.updatePersonMonitor.put(this.model,{
                pathParams: {
                  id: this.model.id,
                }
              }).then(() => {
                  this.$message({message: '修改成功', type: 'success'})
                  this.loading = false
                  this.dialogFormVisible = false
                  this._fetchData()
                }).catch(err => {
                  this.loading = false
                })
            }else{
              await Api.personMonitor.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.loading = false
                  this.dialogFormVisible = false
                  this._fetchData()
                }).catch(err => {
                  this.loading = false
                })
            }
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.personMonitorById.delete({}, {
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
      async startTask(id){
        this.$confirm(`确定启动任务吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.personMonitorStartOrStop.put({}, {
            pathParams: {
              id: id,
              status: 2 //无法发送0，后台转换
            }
          }).then(res => {
            this.$message({message: '启动成功', type: 'success'})
            this._fetchData()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '启动失败!'
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启动'
          })
        })
      },
      async stopTask(id){
        this.$confirm(`确定停止任务吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.personMonitorStartOrStop.put({}, {
            pathParams: {
              id: id,
              status: 1
            }
          }).then(res => {
            this.$message({message: '停止成功', type: 'success'})
            this._fetchData()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '停止失败!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停止'
          })
        })
      },
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this._fetchData()
      },
      targetAreaSubmit(){
        this.model.monitorDevices=[]
        let node = this.$refs.targetArea.getCheckedNodes();
        node.map((item,index)=>{
          this.model.monitorDevices.push({deviceId:item.orgId})
        });
        this.$refs.targetAreaPopover.doClose();
      },
    },
  };
</script>
<style lang="less">
  .monitorPersons-popover{
    padding: 20px;
    .monitorPersons-transfer{
     vertical-align: middle;
      margin-bottom: 10px;
      img{
        vertical-align: middle;
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-top: -2px;
        margin-left: 5px;
      }
    }
    .el-checkbox{
      margin-right: 0;
    }
  }

  .el-transfer-panel{
    width: 250px;
  }
  .monitorPersons-dialog{

    .font32{
      font-size: 32px;
    }
    .el-form-item__content{
      line-height: 1;
    }
  }

</style>
