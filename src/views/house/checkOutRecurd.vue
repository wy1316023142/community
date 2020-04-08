<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">入住退房记录</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="租客姓名"  v-model="filter.personName" clearable></el-input>
        <el-input type="text" placeholder="登记人姓名"  v-model="filter.creatorName" clearable></el-input>
        <el-select v-model="liveStatus" placeholder="登记类型" clearable @change="selectLiveStatus()">
          <el-option v-for="item in liveStatusData"
                     :key="item.key"
                     :label="item.value"
                     :value="item.key"></el-option>
        </el-select>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="信息变更开始日期" end-placeholder="信息变更结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="jumpBack()">返回</el-button>
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
                <el-table-column prop="personName" label="租客姓名" align='center'></el-table-column>
                <el-table-column prop="tel" label="手机号" align='center'>
                </el-table-column>
                <el-table-column prop="identityNumber" label="证件号" align='center'></el-table-column>
                <el-table-column prop="createTime" label="信息变更时间" align='center' width='100px'></el-table-column>
                <el-table-column prop="creatorName" label="登记人" align='center'></el-table-column>
                <el-table-column prop="houseAddress" label="房屋地址" align='center'></el-table-column>
                <el-table-column prop="liveStatus" label="登记类型" align='center'>
                      <template slot-scope="scope">
                        <template v-if="scope.row.liveStatus=='2'">重新授权</template>
                        <template v-if="scope.row.liveStatus=='1'">注销</template>
                       <template v-if="scope.row.liveStatus=='0'">入住</template>
                   </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="jumpPractitioners(scope.row)">查看房屋</el-button>
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
        liveStatus:'',
        liveStatusData: [
          {key: 0, value: '入住'},
          {key: 1, value: '注销'},
          {key: 2, value: '重新授权'},
        ],
        tabHeight: '0',
        time:'',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        factoryType: [],
        companyType: [],
        model: {},
        total: 0,
        residentialName:JSON.parse(sessionStorage.getItem('treeListName')),
        filter: {
          // organId: 1,
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
        },
        firstErr: null,
        loading: false,

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
      if(this.$route.params.residentialName){
        this.residentialName = this.$route.params.residentialName
      }
      if(this.$route.params.organId){
        this.filter.startTime=moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")
        this.filter.endTime=moment().format("YYYY-MM-DD HH:mm:ss")
        this.filter.organId=this.$route.params.organId
        this.liveStatus=this.$route.params.liveStatus
        this.filter.liveStatus=this.$route.params.liveStatus
        this._fetchData()
      }
    },
    methods: {
      selectLiveStatus(){
        this.filter.liveStatus=this.liveStatus
      },
      _fetchData: debounce(async function() {

        const data = await Api.populationHouseTenantPageList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
          this.tableData = data.rows
          this.tableData.forEach(v=>{
            v.createTime=moment(v.createTime).format('YYYY-MM-DD')
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
      changeDate(val){
        if(val){
          this.filter.startTime=moment(val[0]).format('YYYY-MM-DD HH:mm:ss')
          this.filter.endTime=moment(val[1]).format('YYYY-MM-DD HH:mm:ss')
        }else {
          this.filter.startTime=''
          this.filter.endTime=''
        }
      },
      pageChange(val) {

        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.residentialName=item.name
        if(item.organType==2){
          this.filter={
          // organId: 1,
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
        },
        this.filter.organId = item.id || ''

          this._fetchData()
        }
      },
      jumpPractitioners(row){
        this.$router.push({
            name: 'houseTenantDetails',
            query: {
              organId:this.filter.organId,
              unitId:row.unitId,
              houseId:row.houseId,
              residentialName : this.residentialName,
              type:'checkOutRecurd'
            }
            })
      },
      jumpBack(){
          this.$router.push({
            name: 'houseTenantList',
            params: {
              organId:this.filter.organId,
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
