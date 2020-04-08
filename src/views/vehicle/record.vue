<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">进出记录</span>

      <div class="text_r flexItem">
        <!--<el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>-->
        <el-input type="text" placeholder="车牌号"  v-model="filter.license"></el-input>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree  @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column label="序号" align='center'   type="index"></el-table-column>
                <el-table-column prop="villageName" label="所属小区" align='center'></el-table-column>
                <el-table-column prop="licenseNumber" label="车牌号" align='center'></el-table-column>
                <el-table-column prop="importOrExport" label="出入场" align='center'></el-table-column>
                <el-table-column prop="vehicleOwnerName" label="车主" align='center'></el-table-column>
                <el-table-column prop="vehicleOwnerPhone" label="联系电话" align='center'></el-table-column>
                <el-table-column prop="imagePath" label="开门图片" align='center'>
                  <template slot-scope="scope">
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.imagePath" width="500"/>
                      <img slot="reference" :src="scope.row.imagePath"  width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="reTime" label="开门时间" align='center'></el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
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
  import { debounce ,keys } from 'lodash'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import moment from 'moment'
  export default {
    name: 'openDoorRecord',
    components: {OrganTree},
    data() {
      return {
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        total:0,
        time:[moment().subtract(1, "days"), moment().endOf('day')],
        checked: false,
        filter: {
          organId: 0,
          page: 10,
          rows: 1,
          license:'',
          startDate:'',
          endDate:'',
        },
        treeList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        firstErr:null,
        loading:false,
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
      this.filter.organId=JSON.parse(localStorage.getItem('user')).organId
      this.filter.startDate=moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
      this.filter.endDate=moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.vehicleRecord.post(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      pageChange(val) {
        this.filter.rows = val;
        this._fetchData();
      },
      changeDate(){
        this.filter.startDate=moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.endDate=moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      },/*
      handCkChange(val){
        this.filter.xj = (val ? 0: 1)
      },*/
      orgNodeClick([item = {}]){
        console.log(item)
        this.filter.organId = item.id || ''
        this._fetchData()
      }
    },
  };
</script>
<style lang="less">

</style>
