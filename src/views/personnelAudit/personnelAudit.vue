<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">人员审核</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="名字"  v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="省份证号"  v-model="filter.idcard" clearable></el-input>
        <el-select v-model="filter.status" placeholder="审核状态" clearable>
          <el-option v-for="item in AuditStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="姓名" align='center'></el-table-column>
                <!-- <el-table-column prop="phone" label="联系电话" align='center'></el-table-column> -->
                <el-table-column prop="idcard" label="身份证号码" align='center'> </el-table-column>
                <el-table-column prop="address" label="地址" align='center' width="200"> </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align='center'  width="100"> </el-table-column>
                <el-table-column prop="type" label="审核状态" align='center'>
                  <template slot-scope="scope">
                       <template v-if="scope.row.status=='0'">待审核</template>
                       <template v-if="scope.row.status=='1'">通过</template>
                       <template v-if="scope.row.status=='2'">不通过</template>
                       <!-- <template v-if="scope.row.status=='3'">审核通过</template>
                       <template v-if="scope.row.status=='4'">审核不通过</template> -->
                  </template>
                </el-table-column>
                <el-table-column prop="photo" label="照片" align='center'>
                   <template scope="scope" >
                    <!-- <img :src="scope.row.photo" width="40" height="40" v-popover:popover2/> -->
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.photo" width="400" height="500"/>
                      <img slot="reference" :src="scope.row.photo" width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row,1)" v-if="scope.row.status=='0'" v-allow="301001">审核通过</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row,2)" v-if="scope.row.status=='0'" v-allow="301001">审核不通过</el-button>
                    <!-- <el-button type="info" size="mini" v-if="scope.row.status!='0'">已审核</el-button> -->
                    <template v-if="scope.row.status!='0'">已审核</template>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
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
import { debounce, keys, cloneDeep } from "lodash";
import OrganTree from "../../components/OrganTree.vue";
import { domHeightMixin } from "../../commom/mixins.js";
export default {
  mixins: [domHeightMixin],
  name: "personnelAudit",
  components: {
    OrganTree
  },
  data() {
    return {
      fileHeader: {},
      tableData: [],
      total: 0,
      filter: {
        organId: 0,
        page: 10,
        rows: 0
      },
      loading: false,
      AuditStatus:[
        {id: 0, label: '待审核'},
        {id: 1, label: '通过'},
        {id: 2, label: '不通过'},
        // {id: 3, label: '审核通过'},
        // {id: 4, label: '审核不通过'},
      ]
    };
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.auditList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
        .then(res => {
        res.data.result.records.forEach(v=>{
          // if(v.effectiveTime){
          //   v.effectiveTime=moment(v.effectiveTime).format('YYYY-MM-DD')
          // }
          // v.photo=`http://25.30.9.9:38080${v.photo}`
          // v.photo=`${myConfig.baseUrl}${v.photo}`
          var ss=v.idcard
          var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p

        })
        v.idcard=str1
        })
          this.tableData = res.data.result.records;
          this.total = res.data.result.total;
        });
    }, 100),
   async editRow(row,num){
        await Api.approval.put({},{
          pathParams:{
            id:row.id,
            status:num
          }
        }).then(() => {
                  this.$message({message: '审核成功', type: 'success'})
                  this._fetchData()
                })
    },
    async deleteRow(row) {
        //   this.$confirm(`确定删除吗？`, "提示", {
        //     type: "warning"
        //   })
        //     .then(async () => {
        //       const data = await Api.deletePropertyPerson
        //         .delete({ id: row.id }, {})
        //         .then(res => {
        //           this.$message({ message: "删除成功", type: "success" });
        //           this._fetchData();
        //         })
        //         .catch(() => {});
        //     })
        //     .catch(() => {
        //       this.$message({
        //         type: "info",
        //         message: "已取消删除"
        //       });
        //     });
    },
    pageChange(val) {
      this.filter.rows = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },

  }
};
</script>
<style lang="less">

</style>
