<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">居民入住审核</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="名字"  v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="身份证号"  v-model="filter.identityNumber" clearable></el-input>
        <el-select v-model="filter.status" placeholder="审核状态" clearable>
          <el-option v-for="item in AuditStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-date-picker @change="changeDate" v-model="time1" type="datetimerange" range-separator="至" start-placeholder="登记开始日期" end-placeholder="登记结束日期"></el-date-picker>
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
                <el-table-column prop="identityNumber" label="身份证号码" align='center'> </el-table-column>
                <el-table-column prop="tel" label="联系电话" align='center'></el-table-column>
                <el-table-column prop="houseAddress" label="地址" align='center' width="200"> </el-table-column>
                <el-table-column prop="poType" label="入住身份" align='center'  width="100">
                    <template slot-scope="scope">
                       <template v-if="scope.row.poType=='1'">住户</template>
                       <template v-if="scope.row.poType=='0'">业主</template>
                       <template v-if="scope.row.poType=='2'">租客</template>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="申请时间" align='center'  width="100"> </el-table-column>
                <el-table-column prop="status" label="审核状态" align='center'  width="100">
                    <template slot-scope="scope">
                       <template v-if="scope.row.status=='1'">待审核</template>
                       <template v-if="scope.row.status=='0'">通过</template>
                       <template v-if="scope.row.status=='2'">不通过</template>
                    </template>
                </el-table-column>
                <el-table-column prop="photoPath" label="照片" align='center'>
                   <template scope="scope" >
                    <!-- <img :src="scope.row.photo" width="40" height="40" v-popover:popover2/> -->
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.photoPath" width="400" height="500"/>
                      <img slot="reference" :src="scope.row.photoPath" width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column  label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row,0)" v-if="scope.row.status=='1'">通过</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row,2)" v-if="scope.row.status=='1'">不通过</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row,3)">业主信息</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row,4)" v-if="scope.row.status=='2'">审核信息</el-button>
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
   <el-dialog :title="dialogTitle" :visible.sync="editFormVisible" :close-on-click-modal="false"   :modal-append-to-body='false' width="500px">
      <div v-show="num==3">
          <p>{{holderTitle}}</p>
          <div  class="holderTitleBox">
              <el-row>
                <el-form :show-message="false" ref="form">

                  <el-col :span="24" v-for="item in holderData">
                    <el-col :span='12'>
                      <el-form-item label="业主名称 : " class="mesgBox">
                          {{item.personName}}
                      </el-form-item>

                    </el-col>
                    <el-col :span='12'>
                      <el-form-item label="联系方式 : " class="mesgBox">
                          {{item.tel}}
                      </el-form-item>
                    </el-col>
                  </el-col>
                </el-form>
              </el-row>
          </div>
              <div slot="footer" class="dialog-footer dialogTR">
                <el-button @click="editFormVisible = false">关 闭</el-button>
            </div>
      </div>
      <div  v-show="num==0">
        <el-form :show-message="false" ref="form">
          <el-form-item label="租客名称 : " class="mesgBox">
            <div>
              {{dataContent.name}}
            </div>
          </el-form-item>
          <el-form-item label="授权日期 : " >
            <el-date-picker
                v-model="model.grantTime"
                type="date"
                @change="changeDate1"
                :picker-options="expireTimeOption"
                placeholder="选择日期"
                clearable
                >
              </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer dialogTR">
            <el-button @click="editFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="personSubmit" :loading="loading">确 定</el-button>
        </div>
      </div>
    <div  v-show="num==2">
      <el-form ref="form" :show-message="false">
        <el-form-item label="租客名称 : " class="mesgBox">
            {{dataContent.name}}
        </el-form-item>
        <el-form-item label="不通过原因 : " class="mesgBox">
            <el-input type="textarea" v-model="model.content"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer dialogTR">
            <el-button @click="editFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="personSubmit" :loading="loading">确 定</el-button>
        </div>
    </div>
     <div  v-show="num==4">
      <el-form ref="form" :show-message="false">
        <el-form-item label="租客名称 : " class="mesgBox">
            {{dataContent.name}}
        </el-form-item>
        <el-form-item label="不通过原因 : " class="mesgBox">
            <el-input type="textarea" v-model="dataContent.approvalContent" disabled></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer dialogTR">
            <el-button @click="editFormVisible = false">关 闭</el-button>
        </div>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import OrganTree from "../../components/OrganTree.vue";
import { domHeightMixin } from "../../commom/mixins.js";
import moment from 'moment'

export default {
  mixins: [domHeightMixin],
  name: "personnelAudit",
  components: {
    OrganTree
  },
  data() {
    return {
      dataContent:{},
      expireTimeOption: {
        disabledDate(date) {
      //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
        return date.getTime() < Date.now() - 8.64e7;
        }
      },
      model:{},
      time1:'',
      fileHeader: {},
      tableData: [],
      total: 0,
      filter: {
        organId: 0,
        page: 1,
        rows: 10
      },
      num:'',
      person:'',
      dialogTitle:'',
      holderTitle:'',
      loading: false,
      editFormVisible:false,
      AuditStatus:[
        {id: 0, label: '通过'},
        {id: 1, label: '待审核'},
        {id: 2, label: '不通过'},
      ],
      holderData:[],
      rules:{},
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
    async personSubmit(){
      if(this.num==2){
        if(this.model.content){
          this.populationHouseApprovalData()
        }else{
          this.$message({ message: '请填写不通过原因', type: 'error' })
        }
      }else{
        this.populationHouseApprovalData()
      }
    },
   async populationHouseApprovalData(){
         const data = await Api.populationHouseApproval
            .post(this.model).then(() =>{
          // if(this.model.status==2){
            this.$message({ message: '请求成功', type: 'success' })

            this.editFormVisible=false
            this._fetchData()
        });
    },
    changeDate(val){
        if (val) {
            this.filter.beginTime = moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
            this.filter.endTime = moment(val[1]).format("YYYY-MM-DD HH:mm:ss");
        }else{
           this.filter.beginTime = ''
            this.filter.endTime = ''
        }
    },
      changeDate1(val){

        if (val) {
          this.model.grantTime = moment(val).format("YYYY-MM-DD");
        }else{
          this.model.grantTime=''
        }
    },
    _fetchData: debounce(async function() {
        const data = await Api.populationHouseList
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);
      this.tableData=data.result.records
      this.total = data.result.total;
       this.tableData.map(item=>{
            var ss = item.identityNumber;
            var str1 = ss.replace(/(\d{3})(\d+)(\d{3})/, function(x, y, z, p) {
              var i = "";
              while (i.length < z.length) {
                i += "*";
              }
              return y + i + p;
            });
            item.identityNumber = str1;
         if(item.isHolder==0){
           item.poType=0
         }
       })


    }, 100),
   async editRow(row,num){
     this.dataContent=row
     this.model={}
      this.model.phId=row.id
      this.model.status=num


       this.num=num
       if(num==0){
         if(row.poType==2){

           this.editFormVisible=true
            this.dialogTitle='租客审核'
           }else{
            this.$confirm(`确定要通过该人员的入住申请?`, "提示", {
              type: "warning"
            }).then(()=>{this.personSubmit()})
            .catch(() => {
               this.$message({message: '已取消', type: 'success'})
            })

           }
       }else if(num==2){
          this.editFormVisible=true
           this.dialogTitle='不通过审核'
       }else if(num==3){
          this.editFormVisible=true
          this.dialogTitle='业主信息'
          this.holderData=[]
          const data = await Api.houseDetails.get({}, {
          pathParams: {
            houseId: row.houseId
          }
          }).then(data => data.data.rows)
          data.map(item=>{
            if(item.isHolder==0){
              this.holderData.push(item)
            }
          })
          if(this.holderData.length>0){
            this.holderTitle=`${this.holderData[0].orgName}${this.holderData[0].unitName}`
          }else{
            this.holderTitle='暂无业主'
          }
       }else if(num==4){
          this.editFormVisible=true
           this.dialogTitle='审核信息'
       }
    },

    pageChange(val) {
      this.filter.page = val;
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
.dialogTR{
  text-align: right;
}
.holderTitleBox{
  margin-top: 30px!important;
}
</style>
