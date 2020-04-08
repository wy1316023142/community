<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">车辆布控</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="任务名称" v-model="filter.taskName"></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="600100301">创建任务</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column prop="taskName" label="任务名称" align='center'></el-table-column>
                <el-table-column prop="taskType"  label="任务类型" align='center' :formatter="taskTypeFormat"></el-table-column>
                <el-table-column prop="statusName" label="任务状态" align='center'></el-table-column>
                <el-table-column prop="createT" label="创建时间" align='center'></el-table-column>
                <el-table-column prop="createUser" label="创建人" align='center'></el-table-column>
                <el-table-column prop="count" label="目标数量" align='center'></el-table-column>
                <el-table-column  label="操作" align='center' width="220">
                  <template slot-scope="scope">
                    <el-button title="编辑" type="primary" size="mini"    @click="editRow(scope.row)" v-allow="600100302">编辑</el-button>
                    <el-button title="开始" type="primary"  size="mini"  @click="startOrStop(scope.row)" v-if="scope.row.status==0" v-allow="600100304">开始</el-button>
                    <el-button title="停止" type="danger"  size="mini"  @click="startOrStop(scope.row)" v-if="scope.row.status==1" v-allow="600100304">停止</el-button>
                    <el-button title="删除" type="danger"  size="mini"  @click="deleteRow(scope.row)" v-allow="600100303">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
              </div>
            </div>

          </div>
        </el-col>
      </el-row>

    </div>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" :modal-append-to-body='false' width="470px" >
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="任务类型：" prop="taskType">
          <el-select v-model="model.taskType" placeholder="请选择">
            <el-option v-for="item in taskType"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称：" prop="taskName">
          <el-input  autocomplete="off" v-model="model.taskName"></el-input>
        </el-form-item>

        <el-form-item label="目标车辆：" prop="vehicleId">
          <el-popover placement="right" width="400" trigger="click" ref="vehicleIdPopover">
            <div class="popover zhsq-popover">
              <el-input placeholder="搜索"   suffix-icon="el-icon-search" v-model="filterText" style="margin-bottom: 10px;"></el-input>
              <el-tree  :data="vehicleId" ref="vehicleId"  node-key="orgId" :props="defaultProps"
                        :default-checked-keys="model.vehicleId"
                        highlight-current
                        :filter-node-method="filterNode"
                        :default-expanded-keys="model.vehicleId">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <el-checkbox v-model="node.checked" v-if="data.type==3"></el-checkbox>
                  <span class="el-tree-node__label">{{ data.orgName }}</span>
                </div>
              </el-tree>
              <div class="center mt10">
                <el-button type="primary" @click="vehicleIdSubmit" size="mini">确定</el-button>
              </div>
            </div>
            <el-input slot="reference" autocomplete="off" v-model="vehicleIdStr" :readonly="true"></el-input>
            <el-input v-model="model.vehicleId" v-if="false"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="布控区域：" prop="vehicleSnapId"  >
          <el-popover placement="right" width="400" trigger="click" ref="vehicleSnapIdPopover">
            <div class="popover zhsq-popover">
              <el-tree  :data="vehicleSnapId" ref="vehicleSnapId"  node-key="orgId" :props="defaultProps"
                        :default-checked-keys="model.vehicleSnapId"
                        highlight-current
                        :default-expanded-keys="model.vehicleSnapId"
              >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                  <el-checkbox v-model="node.checked" v-if="data.type==3"></el-checkbox>
                  <span class="el-tree-node__label">{{ data.orgName }}</span>
                </div>
              </el-tree>
              <div class="center mt10">
                <el-button type="primary" @click="vehicleSnapIdSubmit" size="mini">确定</el-button>
              </div>
            </div>
            <el-input slot="reference" autocomplete="off" v-model="monitorAreaStr" :readonly="true"></el-input>
            <el-input  v-model="model.vehicleSnapId" v-if="false"></el-input>
          </el-popover>
        </el-form-item>

      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys, cloneDeep } from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  export default {
    name: 'vehicle',
    components: {OrganTree},
    data() {
      return {
        filterText:'',
        editLoading:false,
        vehicleIdStr:'',
        monitorAreaStr:'',
        vehicleId:[],
        vehicleSnapId:[],
        defaultProps: {
          children: 'children',
          label: 'orgName'
        },
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{
        },
        total:0,
        filter: {
          organId: '',
          page: 10,
          rows: 0,
          taskName:''
        },
        treeList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        firstErr:null,
        loading:false,
        taskType:[
          {id: 0, label: '区域布控'},
          {id: 1, label: '目标布控'},
        ],
        rules: {
          taskType: [{
            required: true,
            message: '请选择任务类型',
            trigger: 'blur'
          }],
          taskName: [{
            required: true,
            message: '请填写任务名称',
            trigger: 'blur'
          }],
          taskName: [{
            required: true,
            message: '请填写任务名称',
            trigger: 'blur'
          }],
        }
      }
    },
    mounted(){
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this._fetchData();

    },
    methods: {
      _fetchData: debounce(async function() {
        if(!this.filter.organId){
          const user = JSON.parse(sessionStorage.getItem('user'))
          this.filter.organId = user.organId;
        }
        const data = await Api.vehicleMonitorList.post(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row={
        vehicleId:[],
        vehicleSnapId:[]
      }){
        this.filterText=''
        this.vehicleIdStr=''
        this.monitorAreaStr=''
        row.organId= this.filter.organId
        this.editLoading=true;
        const vehicleId = Api.getMonitorVehicle.get({}, {pathParams: {orgId: this.filter.organId}})
        const vehicleSnapId = Api.getMonitorArea.get({}, {pathParams: {orgId: this.filter.organId}})
        Promise.all([vehicleId, vehicleSnapId]).then(([res1, res2]) => {
            this.editLoading=false;
            this.vehicleId=[res1.data.result];
            this.vehicleSnapId=[res2.data.result];
            if(row.id){
              Api.getVehicleMonitor.get({}, {pathParams: {id: row.id}}).then(res=>{
                row=res.data.result
                this.model = cloneDeep(row)
                this.dialogFormVisible = true
                this.$nextTick(() => {
                  let vehicleId = this.$refs.vehicleId.getCheckedNodes();
                  let vehicleSnapId = this.$refs.vehicleSnapId.getCheckedNodes();
                  vehicleId.map((item,index)=>{
                    this.vehicleIdStr+=item.orgName+" "
                  });
                  vehicleSnapId.map((item,index)=>{
                    if(item.type==3){
                      this.monitorAreaStr+=item.orgName+" "
                    }
                  });
                })
              })
            }else {
              this.model = cloneDeep(row)
            }
          this.dialogFormTitle = !row.id ? '新增' : '编辑'
          this.dialogFormVisible = true

      }).catch(()=>{
          this.editLoading=false;
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.orgName.indexOf(value) !== -1;
      },
       submit() {
        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            await Api.addVehicleMonitor[this.model.id ? 'put' : 'post'](this.model)
              .then(()=>{
                if (this.model.id) {
                  this.$message({ message: '修改成功', type: 'success' })
                } else {
                  this.$message({ message: '新增成功', type: 'success' })
                }
                this.loading = false
                this.dialogFormVisible = false
                this._fetchData()
              }).catch(err => {
                //this.dialogFormVisible = false
                this.loading = false
              })
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
          const data = await Api.deleteVehicleMonitor.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({ message: '删除成功', type: 'success' })
            this._fetchData()
          }).catch(() => {
            /*this.$message({
              type: 'error',
              message: '删除失败!'
            })*/
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      async startOrStop(row) {
        this.$confirm(`确认执行此操作吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.startOrStopTask.put({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            if(row.status){
              this.$message({ message: '任务已停止', type: 'success' })
              this._fetchData()
            }else {
              this.$message({ message: '任务已开始', type: 'success' })
              this._fetchData()
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '操作失败!'
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },

      pageChange(val) {
        this.filter.rows = val-1;
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        console.log(item)
        this.filter.organId = item.id || ''
        this._fetchData()
      },

      taskTypeFormat(row, column) {
        this.taskType.forEach(item => {
          if (item.id == row.taskType) {
            return item.label;
          }
        });
        return this.taskType[0].label;
      },

      vehicleIdSubmit(){
        this.vehicleIdStr=''
        this.model.vehicleId=[]
        let node = this.$refs.vehicleId.getCheckedNodes();
        console.log(node)
        node.map(item=>{
          this.model.vehicleId.push(item.orgId)
          this.vehicleIdStr+=item.orgName+"  ";
        });
        this.$refs.vehicleIdPopover.doClose();
      },

      vehicleSnapIdSubmit(){
        this.monitorAreaStr=''
        this.model.vehicleSnapId=[]
        let node = this.$refs.vehicleSnapId.getCheckedNodes();
        node.map((item,index)=>{
          this.model.vehicleSnapId.push(item.orgId)
          this.monitorAreaStr+=item.orgName;
        });
        this.$refs.vehicleSnapIdPopover.doClose();
      },

    },
    watch: {
      filterText(val) {
        this.$refs.vehicleId.filter(val);
      },
    },
  };
</script>
<style lang="less">

</style>
