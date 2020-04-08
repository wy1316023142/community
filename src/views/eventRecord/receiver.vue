<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">短信接收人管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="姓名"  v-model="filter.peopleName" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="add()">新增</el-button>
        <el-button type="primary" size="small" @click="jumpBack()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="24">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox realEntityTab">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index" width='200px'></el-table-column>
                <el-table-column prop="peopleName" label="姓名" align='center'></el-table-column>
                <el-table-column prop="receiveTel" label="手机号" align='center'>
                </el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="deleteRow(scope.row)">移除</el-button>
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

    <el-dialog  title="接收人员选择" :visible.sync="concernPerson"
     :close-on-press-escape="false" :modal-append-to-body='false' width="600px" top="5vh">
            <el-input placeholder="搜索" v-model="addData.name">
               <el-button slot="append" icon="el-icon-search" @click="add()"></el-button>
            </el-input>
              <el-table :data="peopleData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="姓名" align='center'></el-table-column>
                <el-table-column prop="mobile" label="手机号" align='center'>
                </el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="submit(scope.row)">选择</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange1" background layout="prev, pager, next, total" :total='total1'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
        <div slot="footer" class="dialog-footer">
              <el-button @click="concernPerson =false">关 闭</el-button>
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
    name: 'checkOutRecurd',
    components: {OrganTree},
    data() {
      return {
        concernPerson:false,
        addDialogFormTitle:'',
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        factoryType: [],
        companyType: [],
        addData:{
          page: 1,
          rows: 10,
          ruleId: 1,
        },
        model: {},
        total: 0,
        total1: 0,
        filter: {
          ruleId: 1,
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
        },
        firstErr: null,
        loading: false,
        eventType:[
            {id:1,label:'关注人员处小区门'},
            {id:2,label:'关注人员处单元门'}
        ],
        peopleData:[],
      }
    },

    mounted() {
      this.filter.relationType = 2
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this.filter.ruleId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.addData.ruleId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.companyType = companyType;
      if(this.$route.params.row.id){
        this.filter.ruleId=this.$route.params.row.id
        this.addData.ruleId=this.$route.params.row.id
        this._fetchData()
      }
    },
    methods: {

      _fetchData: debounce(async function() {
        const data = await Api.peopleListRecep.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
          this.tableData = data.rows
          this.tableData.forEach(v=>{

          var ss=v.identityNumber
          var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p

        })
        v.identityNumber=str1
        })
          this.total = data.total
      }, 100),
      add(){
        this.addData.organId=this.$route.params.organId
        this.concernPerson=true
        this.addList()
      },
      async addList(){
      const data = await Api.orgUserList.get(this.addData, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
          this.peopleData = data.rows
          this.total1 = data.total

      },
      async submit(row) {
        this.model.peopleId=row.id
        this.model.ruleId =this.filter.ruleId
        this.model.relationType = this.filter.relationType
        //  this.model.relationType = this.filter.relationType
        //  this.model.ruleId  = this.$route.params.row.id

        await Api.addPeople.post(this.model)
          .then(() => {
            this.$message({message: '新增成功', type: 'success'})
            this.concernPerson = false
            this._fetchData()
          }).catch(() => {
          })
      },
      async deleteRow(row) {
        this.$confirm(`确定移除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.delPeople.delete({}, {
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
      pageChange1(val) {
        this.addData.page = val;
        this.addList();
      },
      jumpBack(){
         this.$router.push({
              name: 'smsNotification',
              params: {
                organId:this.$route.params.organId
              }
            })
      }
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
