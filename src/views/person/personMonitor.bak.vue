<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">布控任务</p>
      <div class="flexItem text_r">
        <el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>
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
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" align='center'></el-table-column>
                <el-table-column prop="taskTypeName" label="任务类型" align='center'></el-table-column>
                <el-table-column prop="statusName" label="状态" align='center'></el-table-column>
                <el-table-column prop="createUserName" label="创建人" align='center'></el-table-column>
                <el-table-column prop="targetNum" label="目标人数" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width="220">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini"   @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini"   @click="deleteRow(scope.row)">删除</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.status == 1" @click="startTask(scope.row.id)">开始</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.status == 0" @click="stopTask(scope.row.id)">停止</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog  :title="dialogFormTitle" :visible.sync="dialogFormVisible"  :close-on-click-modal="false"  :modal-append-to-body='false' width="470px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="任务类型：" prop="taskType">
          <el-select v-model="model.taskType" placeholder="请选择">
            <el-option v-for="item in taskTypes"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="任务名称：" prop="taskName">
          <el-input autocomplete="off" v-model="model.taskName"></el-input>
        </el-form-item>
        <el-form-item label="布控状态：" prop="status">
          <el-radio v-model="model.status" :label='0'>开启</el-radio>
          <el-radio v-model="model.status" :label='1'>关闭</el-radio>
        </el-form-item>
        <el-form-item label="识别度：" prop="matchScore">
          <el-input type="number" autocomplete="off" v-model="model.matchScore" max="3" min="0"></el-input>
        </el-form-item>
        <el-form-item label="目标人：" prop="monitorPersons">
          <el-popover placement="right" width="300" trigger="click" ref="targetPersonPopover">
            <div class="popover zhsq-popover">
              <el-tree
                ref="targetPerson"
                :data="targetPerson"
                node-key="treeKey"
                :props="defaultProps"
                highlight-current
                :default-expanded-keys="activmMonitorPersons"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <el-checkbox v-model="node.checked" v-if="data.type==3"></el-checkbox>
                  <span class="el-tree-node__label">{{ data.orgName }}</span>
                </div>
              </el-tree>
              <div class="center mt10">
                <el-button type="primary" @click="targetPersonSubmit" size="mini">确定</el-button>
              </div>
            </div>
            <el-input slot="reference" autocomplete="off" v-model="monitorPersonStr" :readonly="true"></el-input>
            <el-input v-model="model.monitorPersons" v-if="false"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="布控区域：" prop="monitorDevices"  >
          <el-popover placement="right" width="300" trigger="click" ref="targetAreaPopover">
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
                  <span class="el-tree-node__label">{{ data.orgName }}</span>
                </div>
              </el-tree>
              <div class="center mt10">
                <el-button type="primary" @click="targetAreaSubmit" size="mini">确定</el-button>
              </div>
            </div>
            <el-input slot="reference" autocomplete="off" v-model="monitorAreaStr" :readonly="true"></el-input>
            <el-input  v-model="model.monitorDevices" v-if="false"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="任务描述：" prop="describes">
          <el-input type="textarea" autocomplete="off" v-model="model.describes" maxlength="100"></el-input>
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
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    name: 'vehicle',
    components: {
      ElButton,
      OrganTree},
    data() {
      return {
        editLoading:false,
        monitorPersonStr:'',//
        monitorAreaStr:'',
        targetPerson:[],
        targetArea:[],
        activmMonitorPersons:[],
        activmMonitorArea:[],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        tabHeight: '0',
        dialogFormVisible: false,
        dialogFormTitle: '',
        tableData: [],
        model: {},
        total: 0,
        checked: false,
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
        taskTypes: [
          {id: 1, label: '目标监控'},
          {id: 2, label: '区域布防'}
        ],
        rules: {
          taskName: [{
            required: true,
            message: '请填写任务名称',
            trigger: 'blur'
          },{
            maxLength: 5,
            message: '长度超长了',
            trigger: 'blur'
          }],
          taskType: [{
            required: true,
            message: '请选择任务类型',
            trigger: 'blur'
          }],
        }
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
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
        monitorPersons:[],
        monitorDevices:[]
      }) {
        this.editLoading=true;
        const targetPerson = Api.getTargetPerson.get({}, {pathParams: {orgId: this.filter.organId}})
        const targetArea = Api.getTargetArea.get({}, {pathParams: {orgId: this.filter.organId}})
        Promise.all([targetPerson, targetArea]).then(([res1, res2]) => {
          this.editLoading=false;
          this.targetPerson=[res1.data.result];
          this.targetArea=[res2.data.result];
          this.dialogFormTitle = !row.id ? '新增' : '编辑'
          this.monitorPersonStr=''
          this.monitorAreaStr=''
          this.activmMonitorPersons=[]
          this.activmMonitorArea=[]
          if(!row.id){
            this.dialogFormVisible = true
            this.model = cloneDeep(row)
          }else {
            Api.getPersonMonitor.get({}, {pathParams: {id: row.id}}).then(res=>{
              row=res.data.result
              this.model = cloneDeep(row);
              this.model.monitorPersons.map(item=>{
                this.activmMonitorPersons.push(item.treeKey);
              })
              this.model.monitorDevices.map(item=>{
                this.activmMonitorArea.push(item.treeKey);
              })
              this.dialogFormVisible = true
              this.$nextTick(() => {
                this.$refs.targetPerson.setCheckedKeys( this.activmMonitorPersons);
                let personNode = this.$refs.targetPerson.getCheckedNodes();
                this.$refs.targetArea.setCheckedKeys( this.activmMonitorArea);
                let areaNode = this.$refs.targetArea.getCheckedNodes();
                personNode.map((item,index)=>{
                  this.monitorPersonStr+=item.orgName+" "
                });
                areaNode.map((item,index)=>{
                  if(item.type==3){
                    this.monitorAreaStr+=item.orgName+" "
                  }
                });
              })
            })
          }
        }).catch(()=>{
          this.editLoading=false;
        })
      },
      async submit() {
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
                  this.dialogFormVisible = false
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
                  this.dialogFormVisible = false
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
      handCkChange(val){
        this.filter.xj = (val ? 0: 1)
        this._fetchData()
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this._fetchData()
      },
      targetPersonSubmit(){
        this.monitorPersonStr=''
        this.model.monitorPersons=[]
        let node = this.$refs.targetPerson.getCheckedNodes();
        console.log(node)
        node.map(item=>{
          this.model.monitorPersons.push({userId:item.orgId,orgId:item.parentId})
          this.monitorPersonStr+=item.orgName+"  ";
        });
        console.log(this.model.monitorPersons);
        this.$refs.targetPersonPopover.doClose();
      },

      targetAreaSubmit(){
        this.monitorAreaStr=''
        this.model.monitorDevices=[]
        let node = this.$refs.targetArea.getCheckedNodes();
        node.map((item,index)=>{
          this.model.monitorDevices.push({deviceId:item.orgId})
          this.monitorAreaStr+=item.orgName;
        });

        this.$refs.targetAreaPopover.doClose();
      },
    },
  };
</script>
<style lang="less">

</style>
