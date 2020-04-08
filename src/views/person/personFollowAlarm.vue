<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">抓拍记录</span>

      <div class="text_r flexItem">
        <el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>
        <el-select v-model="filter.state" placeholder="状态">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="正常"></el-option>
          <el-option value="1" label="尾随"></el-option>
          <el-option value="2" label="疑似尾随"></el-option>
          <el-option value="3" label="普通抓拍"></el-option>
        </el-select>
        <el-input type="text" placeholder="抓拍机名称"  v-model="filter.deviceName" clearable></el-input>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
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
                <el-table-column prop="deviceName" label="抓拍机名称" align='center'></el-table-column>
                <el-table-column prop="alarmTimeStr" label="抓拍时间" align='center'></el-table-column>
                <el-table-column prop="imgUrls" label="抓拍人脸" align='center'>
                  <template slot-scope="scope">
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.imgUrlBig" width="500"/>
                      <img slot="reference" :src="scope.row.imgUrls"  width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="stateName" label="状态" align='center'></el-table-column>
                <el-table-column label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" v-if="scope.row.state == 2" @click="details(scope.row)">处理</el-button>
                    <el-button type="danger" size="mini" v-if="scope.row.state != 2" @click="details(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="详情" class="personFollow-dialog" :visible.sync="dialogFormVisible" :modal-append-to-body='false' :close-on-click-modal="false" width="40%" >

      <div class="flex">
        <p class="flexItem">抓拍机名称：{{model.deviceName}}</p>
        <p>{{model.state | personFollowStatus}}</p>
      </div>
      <div class="mt10">
        <p>抓拍时间：{{model.alarmTimeStr}}</p>
      </div>
      <div class="flex personFollow-img-box" >
        <el-image class="flexItem personFollow-img" style="height: 220px" :src="model.imgUrls" fit="cover"></el-image>
        <el-image class="flexItem personFollow-img" style="height: 220px" :src="model.imgUrlBig" fit="contain"></el-image>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="model.state==2" @click="dealPersonFollow(model.id,0)">忽略嫌疑</el-button>
        <el-button type="danger" v-if="model.state==2" @click="dealPersonFollow(model.id,1)">确认尾随</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys ,cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import { domHeightMixin } from '../../commom/mixins.js'
  import moment from 'moment'
  import ElImage from "../../../node_modules/element-ui/packages/image/src/main.vue";
  export default {
    mixins: [ domHeightMixin ],
    name: 'personFollowAlarm',
    components: {
      ElImage,
      OrganTree},
    data() {
      return {
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        total:0,
        time:[moment().subtract(1, "days"), moment().endOf('day')],
        checked: false,
        filter: {
          orgId: 0,
          state: null,
          page: 1,
          rows: 10,
          deviceName:'',
          startTime:'',
          endTime:'',
          xj:1
        },
        firstErr:null,
        loading:false,
      }
    },
    mounted(){
      this.filter.orgId=JSON.parse(sessionStorage.getItem('user')).organId
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.getPersonFollow.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      changeDate(){
        this.filter.startTime=moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.filter.endTime=moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
      },
      handCkChange(val){
        this.filter.xj = (val ? 0: 1)
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.orgId = item.id || ''
        this._fetchData()
      },
      details(row){
        this.dialogFormVisible=true;
        this.model=cloneDeep(row);
      },
      dealPersonFollow  (id,status){
        this.$confirm(status==0?`确认要解除嫌疑？`:'确认要标记为尾随', '提示', {
          type: 'warning'
        }).then(() => {
          Api.dealPersonFollow.put({},{
            pathParams: {
              eventId:id,
              state:status
            }
          }).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this._fetchData()
            this.dialogFormVisible=false
          }).catch(() => {
            this.dialogFormVisible=false
          })
        }).catch(() => {
          this.dialogFormVisible=false
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      }
    },
  };
</script>
<style lang="less">
  .personFollow-dialog{
    .el-dialog__body{
      padding-top: 10px;
    }
    .personFollow-img-box{
      margin-top: 15px;

      & .personFollow-img:first-child{
        padding-right: 10px;
      }
      & .personFollow-img:last-child{
        padding-left: 10px;
      }
    }
  }
</style>
