<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">天网分组</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
        <el-button type="primary" size="small" @click="jump()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35">
        <!--<el-col :span="6">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>-->
        <el-col :span="24">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight"  ref="table">
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <div v-for="item in props.row.gbDeviceList" class="flex">
                      <span class="flexItem" style="padding-left: 20px;">{{item.name}}</span>
                      <el-button class="text_r" title="删除" type="danger"  size="mini" icon="el-icon-minus" circle @click="removeRow(item.id)"></el-button>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align='left' >
                  <template slot-scope="scope">
                    <el-button title="展开" type="primary" size="mini" icon="el-icon-menu" circle   @click="openRow(scope.row)"></el-button>
                    <el-button title="编辑" type="primary" size="mini" icon="el-icon-edit-outline" circle   @click="editRow(scope.row)"></el-button>
                    <el-button title="删除" type="danger"  size="mini" icon="el-icon-delete" circle @click="deleteRow(scope.row)"></el-button>
                  </template>
                </el-table-column>
                <el-table-column  label="分组名称" align='center'>
                  <template slot-scope="scope">
                    {{scope.row.name}} ({{scope.row.deviceCount}})
                  </template>
                </el-table-column>
                <el-table-column  label="编辑点位"  align='right'>
                  <template slot-scope="scope">
                    <el-button title="管理点位" type="primary" size="mini" icon="el-icon-plus" circle   @click="equipment(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.length' :current-page='filter.start'></el-pagination>
              </div>
            </div>

          </div>
        </el-col>
      </el-row>

    </div>
    <!--新增编辑-->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' width="40%" :close-on-click-modal="false">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="名称：" prop="name">
          <el-input  autocomplete="off" v-model="model.name"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配设备-->
    <el-dialog title="分配天网设备" :visible.sync="equipmentFormVisible"   :modal-append-to-body='false' width="60%" @closed="closed" :close-on-click-modal="false">
      <div class="tableBox">
        <div class="text_r">
          <el-input class="equipmentSearchBar" placeholder="请输入摄像头名称" v-model="filterTable.param.searchKey"></el-input>
          <el-button  type="primary" @click="equipment(temprow)">筛选</el-button>
        </div>
        <el-table :data="equipmentTableData" style="width: 100%" stripe  :height='400' :max-height="400"  @selection-change="changeSelect">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name"  label="名称" align='center'></el-table-column>
          <el-table-column prop="online" label="状态" align='center'></el-table-column>
          <el-table-column prop="naming" label="naming" align='center'></el-table-column>
        </el-table>
        <div class="pageBox" style="margin-top: 20px;">
          <el-pagination   @current-change="pageChangeTable" background layout="prev, pager, next, total" :total='totalTable' :page-size='filterTable.length' :current-page='filterTable.start'></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="equipmentFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchAssignGroup()" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys, cloneDeep } from 'lodash'
  import { validateLocation } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  export default {
    name: 'vehicle',
    components: {
      ElFormItem,
      ElForm,
      OrganTree},
    data() {
      return {
        equipmentTableData: [],
        equipmentFormVisible:false,
        map: {
          lnglat: '',
          zoom: 12,
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.model.y = e.lnglat.lat
              this.model.x = e.lnglat.lng
              this.model.zoom = 12
            }
          },
        },
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        modelTable:{},
        total:0,
        totalTable:0,
        multipleSelection:[],
        filter: {
          organId:''
        },
        filterTable: {
          param:{organId:'',searchKey:''},
          start: 1,
          length: 10,
          name:''
        },
        temprow:'',
        firstErr:null,
        loading:false,
        rules: {
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted(){
      //table高度
      this.filter.organId = this.$route.query.organId;
      this.filterTable.param.organId = this.$route.query.organId;
      this.$nextTick(() => {
        this.tabHeight=this.$refs.innerBody.offsetHeight-152
        window.onresize =()=> {
          this.tabHeight=this.$refs.innerBody.offsetHeight-152
        };
      })
      this._fetchData();

    },
    methods: {
      _fetchData: debounce(async function() {
        if(!this.filter.organId){
          const user = JSON.parse(localStorage.getItem('user'))
          this.filter.organId = user.organId.toString();
          this.filterTable.organId = user.organId.toString();
        }
        const data = await Api.DeviceGroups.post(this.filter, {
          loadingMaskTarget: '.tableBox'
        }).then(res => res.data)
        this.tableData = data.result
      }, 100),
      closed(){
        this.filterTable.param.searchKey=''
      },
      editRow(row={}){
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
        this.dialogFormVisible = true
        this.model = cloneDeep(row)
      },
      async submit() {
        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id){
              this.model.organId = this.filter.organId;
            }
            await Api.addDeviceGroup[this.model.id ? 'put' : 'put'](this.model)
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
                this.loading = false
                throw err
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
          const data = await Api.deleteGroup.delete({}, {
            pathParams: {
              id: row.id
          }
          }).then(res => {
            this.$message({ message: '删除成功', type: 'success' })
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
      async removeRow(id){
        console.log(id)
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteGroupDevice.post({
            deviceId: id,
            organId: this.filter.organId
          }, {}).then(res => {
            this.$message({ message: '删除成功', type: 'success' })
            this._fetchData()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      pageChange(val) {
        this.filter.start = val;
        this._fetchData();
      },
      pageChangeTable(val){
        this.filterTable.start = val;
        this.equipment(this.temprow);
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this.filterTable.organId = item.id || ''
        this._fetchData();
      },
      async equipment(row){
        //查询
        //........
        this.temprow = row;
        console.log(row)
        this.modelTable.groupId = row.id;
        const data = await Api.groupTables.post(this.filterTable, {
          loadingMaskTarget: '.tableBox'
        }).then(res => res.data)
        this.equipmentTableData = data.result.data
        this.totalTable = data.result.recordsTotal
        this.equipmentFormVisible=true;
      },
      async batchAssignGroup(){
        this.modelTable.ids = '';
        for(const i in this.multipleSelection){
          this.modelTable.ids += this.multipleSelection[i].id + ",";
        }
        this.modelTable.organId = this.filter.organId;
        const data = await Api.batchAssignGroupUpdate.post(this.modelTable,{})
          .then(res=>{
            this.$message({ message: '分配成功', type: 'success' })
            this.loading = false
            this.equipmentFormVisible = false
            this._fetchData()
          }).catch(err => {
            this.loading = false
            this.$message({ message: '分配失败', type: 'success' })
            throw err
          })
      },
      equipmentSearch(){

      },
      jump(){
        this.$router.go(-1);
      },
      changeSelect(val){
        this.multipleSelection = val;
      },
      openRow(row){
        this.$refs.table.toggleRowExpansion(row)
      }

    },
  };
</script>
<style lang="less" scoped>
  .equipmentSearchBar{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
</style>
