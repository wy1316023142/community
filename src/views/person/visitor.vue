<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">访客管理</span>

      <div class="text_r flexItem">

        <el-input type="text" placeholder="访客姓名"  v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="手机号码"  v-model="filter.tel" clearable></el-input>
        <el-input type="text" placeholder="身份证号"  v-model="filter.identityNumber" clearable></el-input>
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
                <el-table-column prop="name" label="访客姓名" align='center'></el-table-column>
                <el-table-column prop="identityNumber" label="身份证号" align='center'></el-table-column>
                <el-table-column prop="tel" label="手机号" align='center'></el-table-column>
                <el-table-column  label="录入照片" align='center'>
                  <template slot-scope="scope">
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.imgStr" width="500"/>
                      <img slot="reference" :src="scope.row.imgStr"  width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="ownerName" label="受访人" align='center'></el-table-column>
                <el-table-column prop="houseAddress" label="受访地址" align='center'></el-table-column>
                <el-table-column prop="captureTime" label="最新到访时间" align='center' width="280">
                  <template slot-scope="scope">
                    {{scope.row.captureTime| moment('YYYY-MM-DD HH:mm:ss')}}
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
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys } from "lodash";
import { validateIdCard, validatePhone } from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
export default {
  name: "openDoorRecord",
  components: { OrganTree },
  data() {
    return {
      tabHeight: "0",
      tableData: [],
      model: {},
      total: 0,
      checked: false,
      filter: {
        page: 1,
        rows: 10,
        organId: 1,
        name: "",
        tel: "",
        identityNumber: ""
      }
    };
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 56;
      window.onresize = () => {
        this.tabHeight = this.$refs.content.offsetHeight - 56;
      };
    });
    this.filter.organId = JSON.parse(localStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.getVistorList
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);
      if(data.rows.length>0){
         for(var i=0;i<data.rows.length;i++){
         var ss=data.rows[i].identityNumber
         var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
          var i="";
          while(i.length<z.length){i+="*"}
          return y+i+p
          
      })
        data.rows[i].identityNumber=str1
      }
      }
      this.tableData = data.rows;
      this.total = data.total;
    }, 100),

    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    }
  }
};
</script>
<style lang="less">
</style>
