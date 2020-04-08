<template>
  <div class="zhsq-innerBody smsNotification" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">短信通知</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="规则名称"  v-model="filter.name" clearable></el-input>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="800401">新增</el-button>
        <el-button type="primary" size="small" @click="download()"  v-allow="800407">导出</el-button>
        <!-- <el-button type="primary" size="small"><a href="/business/sms/exportXls">asd</a></el-button> -->
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
                <el-table-column prop="ruleNumber" label="规则编号" align='center' minWidth='140px'></el-table-column>
                <el-table-column prop="name" label="规则名称" align='center' minWidth='90px'>
                </el-table-column>
                <el-table-column prop="type" label="事件类型" align='center' width='150px'>
                  <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                         <template>{{scope.row.typeName1}}{{scope.row.typeName2}}{{scope.row.typeName3}}{{scope.row.typeName4}}</template>

                      <div slot="reference" class="name-wrapper">
                         <template v-if="scope.row.type.length>1">{{scope.row.typeName}}...</template>
                         <template v-if="scope.row.type.length==1">{{scope.row.typeName}}</template>
                      </div>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="创建人" align='center' minWidth='90px'></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align='center' width='100px'></el-table-column>
                <el-table-column label="发送短信数" align='center'>
                     <template slot-scope="scope">
                        <span @click="msmNum(scope.row)">{{scope.row.smsSendCount}}</span>
                    <!-- <el-button type="primary" size="mini" @click="msmNum(scope.row)">{{smsSendCount}}</el-button> -->

                    </template>
                </el-table-column>
                <el-table-column prop="state" label="状态" align='center'>
                   <template slot-scope="scope">
                       <template v-if="scope.row.state=='1'">启用</template>
                       <template v-if="scope.row.state=='0'">停用</template>
                   </template>
                </el-table-column>

                <el-table-column label="操作" align='center' width='270px' >
                  <template slot-scope="scope">
                     <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="800402">编辑</el-button>
                    <el-button type="primary" size="mini" @click="deleteRow(scope.row)" v-allow="800403">删除</el-button>
                    <el-button type="primary" size="mini" @click="startOver(scope.row)" v-if="scope.row.state=='1'" v-allow="800404">停用</el-button>
                    <el-button type="primary" size="mini" @click="startOver(scope.row)" v-if="scope.row.state=='0'" v-allow="800404">启用</el-button>
                    <el-button type="primary" size="mini" @click="jumpConcernPerson(scope.row)" v-allow="800405">关注人</el-button>
                    <el-button type="primary" size="mini" @click="jumpReceiver(scope.row)" v-allow="800406">接收人</el-button>
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
    <el-dialog  :title="addDialogFormTitle" :visible.sync="smsNotification"
     :close-on-press-escape="false" :modal-append-to-body='false' width="480px" top="5vh">
        <el-form ref="form" :model="model" :show-message="false">
            <el-form-item label="规则名称：">
                <el-input v-model="model.name" maxLength="32"></el-input>
            </el-form-item>
            <el-form-item label="事件类型: ">
            <el-select v-model="model.type " multiple>
                <el-option v-for="item in eventType"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
            </el-select>
            </el-form-item>
            <!-- <el-form-item label="关注区域: ">
                <el-select v-model="model.regionFollow">
                <el-option v-for="item in eventType"
                            :key="item.label"
                            :label="item.label"
                            :value="item.label"></el-option>
                </el-select>
            </el-form-item> -->
             <el-form-item label="消息通知方式">
               <el-radio v-model="radio" label="1">短信</el-radio>
                <el-radio v-model="radio" label="2">公众号</el-radio>
            </el-form-item>
              <el-form-item label="是否启用">
                <el-switch v-model="state"></el-switch>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
              <el-button @click="smsNotification =false">取 消</el-button>
              <el-button type="primary" @click="submit()" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 短信发送明细 -->
    <el-dialog  title="短信发送明细" :visible.sync="smsSendDetailed" width="900px"
        :close-on-press-escape="false" :modal-append-to-body='false' top="5vh" class="smsSendDetailed">
         <el-input type="text" placeholder="关注人姓名"  v-model="detailedFilter.attpName"></el-input>
         <el-input type="text" placeholder="短信接收人姓名"  v-model="detailedFilter.recepName"></el-input>
        <el-date-picker @change="changeDetailedDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="detaileSeach()">搜索</el-button>
        <el-table :data="detaileData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="attpName" label="关注人" align='center'></el-table-column>
                <el-table-column prop="identityNumber" label="身份证号" align='center'></el-table-column>
                <el-table-column prop="deviceName" label="开门门禁名称" align='center'></el-table-column>
                <el-table-column prop="recepName" label="短信接收人" align='center'></el-table-column>
                <el-table-column prop="sendSmsTime" label="发送时间" align='center'></el-table-column>
        </el-table>
        <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total1'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
        <div slot="footer" class="dialog-footer">
              <el-button @click="smsSendDetailed =false">关 闭</el-button>
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
  import moment from 'moment'
  export default {
    name: 'checkOutRecurd',
    components: {OrganTree},
    data() {
      return {
        state:false,
        time:'',
        smsSendDetailed:false,
        smsNotification:false,
        addDialogFormTitle:'',
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        detaileData:[],
        factoryType: [],
        companyType: [],
        model: {
          
        },
        total: 0,
        total1:0,
        detailedFilter:{
          page: 1,
          rows: 10,
        },
        filter: {
          organId: 1,
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
        },
        radio:"",
        firstErr: null,
        loading: false,
        eventType:[
            {id:1,label:'关注人员出单元门'},
            {id:2,label:'关注人员出小区门'},
            {id:3,label:'关注人员进单元门'},
            {id:4,label:'关注人员进小区门'}
        ],
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
      if(this.$route.params.organId){
         this.filter.organId=this.$route.params.organId
        //  this.orgNodeClick()
      }
      this.companyType = companyType;
        this._fetchData()

    },
    methods: {

      _fetchData: debounce(async function() {
        const data = await Api.smsList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
          this.tableData = data.rows
          for (let i = 0; i <  this.tableData.length; i++) {
            this.tableData[i].createTime=moment( this.tableData[i].createTime).format('YYYY-MM-DD HH:mm:ss')
            var saa=this.tableData[i].type
             var sbb=saa.toString()
            this.tableData[i].type=sbb.split("")
            for (let j = 0; j < this.tableData[i].type.length; j++) {
             if(this.tableData[i].type[j]==1){
               this.tableData[i].typeName1='关注人员出单元门,'
               this.tableData[i].typeName='关注人员出单元门'
             }
              if(this.tableData[i].type[j]==2){
               this.tableData[i].typeName2='关注人员出小区门,'
               this.tableData[i].typeName='关注人员出小区门'
             }
              if(this.tableData[i].type[j]==3){
               this.tableData[i].typeName3='关注人员进单元门,'
               this.tableData[i].typeName='关注人员进单元门'
             }
              if(this.tableData[i].type[j]==4){
               this.tableData[i].typeName4='关注人员进小区门,'
               this.tableData[i].typeName='关注人员进小区门'
             }
            }
          }
          this.total = data.total
      }, 100),
      editRow(row = {}) {
        this.model={}
        this.addDialogFormTitle = !row.id ? '新增' : '编辑'
        this.smsNotification = true
        if(row.id){
          if(row.state==1){
            this.state=true
            this.model.state=1

          }else if(row.state==0){
            this.state=false
          this.model.state=0
          }
          console.log();
          for (let i = 0; i < row.type.length; i++) {
            row.type[i]=parseInt(row.type[i]);
          }
          this.model = {
            name:row.name,
            type:row.type,
            id:row.id
          }
        }else{
          this.model={}
        }
      },
     async startOver(row){
        if(row.state==0){
          row.state=1
        }else{
          row.state=0
        }
        this.model.state=row.state
        this.model.id=row.id
        // this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
          await Api.smsUpdate.put(this.model,{}).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.smsNotification = false
                this._fetchData()
              }).catch(() => {
          })
      },
      async msmNum(row){
          this.detailedFilter.ruleId =row.id
          this.smsSendDetailed=true
          this.detaileSeach()
      },
      async detaileSeach(){
        const data=await Api.sendHistoryList.get(this.detailedFilter,{ loadingMaskTarget: '.tableShow'}).then(res=>res.data)
        for (let i = 0; i < data.rows.length; i++) {
         data.rows[i].sendSmsTime=moment( data.rows[i].sendSmsTime).format('YYYY-MM-DD HH:mm:ss')
        }
        this.detaileData=data.rows
        this.total1=data.total

    },
      download(){
        // Api.smsExportXls.get(this.filter, {
        //   loadingMaskTarget: ".tableShow"
        // })
        // .then(res => {
        //   const blob = new Blob([res])
        //   const fileName = '导出信息.xlsx'
        //   const elink = document.createElement('a')
        //   elink.download = fileName
        //   elink.style.display = 'none'
        //   elink.href = URL.createObjectURL(blob)
        //   document.body.appendChild(elink)
        //   elink.click()
        //   URL.revokeObjectURL(elink.href) // 释放URL 对象
        //   document.body.removeChild(elink)
        // });

        window.open(`${myConfig.baseUrl}/business/sms/exportXls?organId=${this.filter.organId}`)

      },
      async submit() {
        var arr=this.model.type.toString()
        this.model.type=arr.replace(/,/g,'');
        this.model.smsPushType = this.radio*1
        if(this.state==false){
          this.model.state=0
        }else{
          this.model.state=1
        }
        this.model.organId = this.filter.organId
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              console.log(this.model,'this.modelthis.model');
              
              await Api.smsInsert.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.smsNotification = false
                  this._fetchData()
                }).catch(() => {
                })
            } else {
              console.log(this.model,'this.model');
              
              await Api.smsUpdate.put(this.model,{}).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.smsNotification = false
                this._fetchData()
              }).catch(() => {
              })
            }
            this.loading = false
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.delRule.delete({}, {
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
      changeDate(val){
        if(val){
          this.filter.startTimeStr = moment( val[0]).format('YYYY-MM-DD HH:mm:ss')
          this.filter.endTimeStr  = moment( val[1]).format('YYYY-MM-DD HH:mm:ss')
        }else{
          this.filter.startTimeStr =''
          this.filter.endTimeStr  = ''
        }
      },
      changeDetailedDate(val){
        if(val){
          this.detailedFilter.startTimeStr = moment( val[0]).format('YYYY-MM-DD HH:mm:ss')
          this.detailedFilter.endTimeStr  = moment( val[1]).format('YYYY-MM-DD HH:mm:ss')
        }else{
           this.detailedFilter.startTimeStr = ''
          this.detailedFilter.endTimeStr  = ''
        }
      },
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.filter.organId = item.id || ''
          this._fetchData()
      },

      jumpConcernPerson(row){
          this.$router.push({
              name: 'concernPerson',
              params: {
                row: row,
                organId:this.filter.organId
              }})
      },
      jumpReceiver(row){
          this.$router.push({
              name: 'receiver',
              params: {
                row: row,
                organId:this.filter.organId
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
.smsNotification{
    .smsSendDetailed{
        .el-input{
            width: 100px!important;
            margin-right: 10px;
        }
       .el-date-editor--datetimerange.el-input__inner{
           width: 387px!important;
           margin-right: 10px;
       }
       .el-pagination{
           text-align: right;
           margin-top: 10px;
       }

    }
}
</style>
