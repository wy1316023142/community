<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">日志记录</p>
    </div>
    <div class="zhsq-boxWrapper" ref="content">
      <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
        <el-table-column type="index" label="序号" align='center'></el-table-column>
        <el-table-column prop="operatorname" label="操作人" align='center'></el-table-column>
        <el-table-column prop="operationcontent" label="操作" align='center'></el-table-column>
        <el-table-column prop="operationtime" label="操作时间" align='center'></el-table-column>
        <el-table-column prop="optUrl" label="操作URL" align='center'></el-table-column>
        <el-table-column prop="optIp" label="客户端ip" align='center'></el-table-column>
        <el-table-column prop="clientType" label="客户端类型" align='center'></el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                       :page-size='filter.rows' :current-page='filter.page'></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys} from 'lodash'

  export default {
    name: 'role',
    data() {
      return {
        activePermissionsData: [],
        permissionsData: [],
        loading: false,
        tabHeight: '0',
        dialogFormVisible: false,
        tableData: [],
        model: [],
        firstErr: [],
        total: 0,
        filter: {
          page: 1,
          rows: 10,
        },
        rules: {
          name: [{
            required: true,
            message: '请填写角色名称',
            trigger: 'blur'
          }],
          sortNo: [{
            required: true,
            message: '请填排序',
            trigger: 'blur'
          }]
        },
        defaultProps: {
          children: 'chil',
          label: 'name'
        },
        roleId: 0
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-32
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-32
        };
      })

      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.logList.get(this.filter, {
          loadingMaskTarget: '.zhsq-boxWrapper'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),

      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
    },
  };
</script>
<style lang="less">

</style>
