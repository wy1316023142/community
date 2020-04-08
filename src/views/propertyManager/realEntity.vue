<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">实有单位</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="单位名称" v-model="filter.name" clearable></el-input>
         <el-select v-model="filter.companyType" placeholder="单位类型" clearable>
          <el-option v-for="item in companyType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="500301">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox realEntityTab">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="单位名称" align='center'></el-table-column>
                <el-table-column prop="companyType" label="单位类型" align='center'>
                    <template slot-scope="scope">
                    {{scope.row.companyType|residentialCompanyType}}
                  </template>
                </el-table-column>
                <el-table-column prop="legalPerson" label="法人代表" align='center'></el-table-column>
                <el-table-column prop="phone" label="联系方式" align='center'></el-table-column>
                <el-table-column prop="licenseNumber" label="营业执照注册号" align='center'></el-table-column>
                <el-table-column prop="practitionersCount" label="从业人员数量" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="500302">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="500303">删除</el-button>
                    <el-button type="primary" size="mini" @click="jumpPractitioners(scope.row)" v-allow="500304">从业人员</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="单位名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="单位类型: " prop="companyType">
          <el-select v-model="model.companyType">
            <el-option v-for="item in companyType"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人代表" prop="legalPerson">
          <el-input autocomplete="off" v-model="model.legalPerson" maxLength="64" :readonly="!!model.id"></el-input>
        </el-form-item>


        <el-form-item label="联系方式: " prop="phone">
          <el-input autocomplete="off" v-model="model.phone" maxLength="64"></el-input>
        </el-form-item>
        <el-form-item label="营业执照注册号: " prop="licenseNumber">
          <el-input autocomplete="off" v-model="model.licenseNumber" maxLength="64"></el-input>
        </el-form-item>
        <el-form-item label="单位地址: " prop="companyAddress">
          <el-input autocomplete="off" v-model="model.companyAddress" maxLength="64"></el-input>
        </el-form-item>


      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace,validatePhone } from '../../commom/validator'
  import { companyType } from '../../constants.js'
  import { residentialCompanyType } from '../../commom/filter.js'
  export default {
    name: 'realEntity',
    components: {OrganTree},
    data() {
      return {
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        factoryType: [],
        companyType: [],
        model: {},
        total: 0,
        filter: {
          organId: 1,
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
        },
        firstErr: null,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请填写设备名称',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备名称不能有空格',
            trigger: 'blur'
          }],
          companyType: [{
            required: true,
            message: "请选择单位类型",
            trigger: "blur"
          }],
           legalPerson: [{
            required: true,
            message: "请填写法人姓名",
            trigger: "blur"
          }],
          phone: [{
            required: true,
            message: "请填写联系方式",
            trigger: "blur"
          }],
          licenseNumber: [{
            required: true,
            message: "请填写营业执照号码",
            trigger: "blur"
          }],
          companyAddress: [{
            required: true,
            message: '请填写地址',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '地址不能有空格',
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
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.companyType = companyType;
      if(this.$route.params.organId){
        this.filter.organId=this.$route.params.organId
        this._fetchData()
      }
    },
    methods: {
      _fetchData: debounce(async function() {
        if(this.filter.companyType==''){
         this.filter.companyType=null
        }
        const data = await Api.realEntityList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
          this.tableData = data.rows
          this.total = data.total
      }, 100),
      editRow(row = {}) {
        // this.model.organId = this.filter.organId
        this.addDialogFormTitle = !row.id ? '新增' : '编辑'
        this.addDialogFormVisible = true
        this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addRealEntity.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchData()
                }).catch(() => {
                })
            } else {
              await Api.editRealEntity.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.addDialogFormVisible = false
                this._fetchData()
              }).catch(() => {
              })
            }
            this.loading = false
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
          const data = await Api.deleteRealEntity.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
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
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.filter.organId = item.id || ''
        if(item.organType==2){
          this._fetchData()
        }
      },
      jumpPractitioners(row){
        console.log(row);

        this.$router.push({
            name: 'practitioners',
            params: {
              row: row,
            }})
      },
    }
  };
</script>
<style lang="less">
.realEntityTab{
  .el-button+.el-button{
    margin-top: 2px;
  }
}
.zhsq-main .zhsq-innerBody .el-dialog__body .el-form-item__label{
  width: 125px !important;
}
</style>
