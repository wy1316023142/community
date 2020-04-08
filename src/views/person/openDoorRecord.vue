<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">开门记录</span>

      <div class="text_r flexItem">
        <el-checkbox v-model="checked" @change="handCkChange">查询下级</el-checkbox>
        <el-select v-model="filter.personType" placeholder="出入类型">
          <el-option value="" label="全部"></el-option>
          <el-option value="2" label="临时访客"></el-option>
          <el-option value="1" label="住户"></el-option>
        </el-select>
        <el-input type="text" placeholder="门禁名称"  v-model="filter.deviceName" clearable></el-input>
        <el-input type="text" placeholder="姓名"  v-model="filter.personName" clearable></el-input>
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
                <el-table-column prop="deviceName" label="门禁名称" align='center'></el-table-column>
                <el-table-column prop="personName" label="姓名" align='center'></el-table-column>
                <el-table-column prop="identitynumber" label="证件号" align='center'></el-table-column>
                <el-table-column prop="openType" label="开门方式" align='center'>
                  <template slot-scope="scope" >
                    <template v-if="scope.row.openType==0">人脸</template>
                    <template v-if="scope.row.openType==1">刷卡</template>
                  </template>
                </el-table-column>
                <el-table-column  label="住户类型" align='center'>
                  <template slot-scope="scope" >
                    <template v-if="scope.row.personType==2">临时访客</template>
                    <template v-if="scope.row.personType==1">住户</template>
                  </template>
                </el-table-column>
                <el-table-column prop="featureImageUrl" label="开门图片" align='center'>
                  <template slot-scope="scope">
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.environmentImageUrl" width="500"/>
                      <img slot="reference" :src="scope.row.featureImageUrl"  width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="captureTime" label="开门时间" align='center'></el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys } from "lodash";
import { validateIdCard, validatePhone } from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import moment from "moment";
import { domHeightMixin, pageMixin } from "../../commom/mixins.js";
export default {
  mixins: [domHeightMixin, pageMixin],
  name: "openDoorRecord",
  components: { OrganTree },
  data() {
    return {
      tabHeight: "0",
      dialogFormVisible: false,
      dialogFormTitle: "",
      tableData: [],
      model: {},
      total: 0,
      time: [moment().subtract(1, "days"), moment().endOf("day")],
      checked: false,
      filter: {
        orgId: 1,
        deviceName: "",
        personName: "",
        startTime: moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment()
          .endOf("day")
          .format("YYYY-MM-DD HH:mm:ss"),
        xj: 1,
        personType: ""
      },
      firstErr: null,
      loading: false
    };
  },
  mounted() {
    this.filter.orgId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.openDoorRecord
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);

     if(data.rows.length>0){
       for(var i=0;i<data.rows.length;i++){
         var ss=data.rows[i].identitynumber
        console.log(ss);
         var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
          var i="";
          while(i.length<z.length){i+="*"}
          return y+i+p

      })
        data.rows[i].identitynumber=str1
      }
      }
      this.tableData = data.rows;
      this.total = data.total;
    }, 100),

    changeDate(val) {
      if (val) {
        this.filter.startTime = moment(this.time[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.filter.endTime = moment(this.time[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      } else {
        this.filter.startTime = "";
        this.filter.endTime = "";
      }
    },
    handCkChange(val) {
      this.filter.xj = val ? 0 : 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.orgId = item.id || "";
      this._fetchData();
    }
  }
};
</script>
<style lang="less">
</style>
