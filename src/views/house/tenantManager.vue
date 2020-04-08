<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">租客管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="姓名"  v-model="filter.personName" clearable></el-input>
        <el-input type="text" placeholder="身份证号"  v-model="filter.identityNumber" clearable></el-input>
        <el-select v-model="filter.effectiveStatus" placeholder="授权状态" clearable>
          <el-option v-for="item in authorizationType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
         <el-select v-model="filter.buildingId" @change="selectOption(1,filter.buildingId)"
         placeholder="所在楼栋" clearable>
          <el-option v-for="item in buildingListData"
                     :key="item.buildingId"
                     :label="item.buildingName"
                     :value="item.buildingId"
                     @click="selectOption(1,item)"
                     ></el-option>
        </el-select>
        <el-select v-model="filter.unitId" placeholder="所在单元" @change="selectOption(2,filter.unitId)" clearable>
          <el-option v-for="item in unitListData"
                     :key="item.unitId"
                     :label="item.unitName"
                     :value="item.unitId"
                     @click="selectOption(2,item)"
                     ></el-option>
        </el-select>
        <el-select v-model="filter.inFloorNum " placeholder="所在楼层" @change="selectOption(3,filter.villageId)" clearable>
          <el-option v-for="item in floorData"
                     :key="item.inFloorNum"
                     :label="item.inFloorName"
                     :value="item.inFloorNum"
                     @click="selectOption(3,item)"
                     ></el-option>
        </el-select>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>

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
                <el-table-column prop="personName" label="姓名" align='center'></el-table-column>
                <el-table-column prop="identityNumber" label="证件号" align='center'>
                </el-table-column>
                <el-table-column prop="sex" label="性别" align='center'>
                      <template slot-scope="scope">

                        <template v-if="scope.row.sex=='1'">女</template>
                       <template v-if="scope.row.sex=='0'">男</template>
                   </template>
                </el-table-column>
                <el-table-column prop="tel" label="联系电话" align='center'></el-table-column>
                <el-table-column prop="effectiveTime" label="授权截止时间" align='center' width='100px'></el-table-column>
                <el-table-column prop="effectiveStatus" label="授权状态" align='center'>
                   <template slot-scope="scope">

                        <template v-if="scope.row.effectiveStatus=='1'">已过期</template>
                       <template v-if="scope.row.effectiveStatus=='0'">正常</template>
                   </template>
                </el-table-column>
                <el-table-column prop="houseAddress" label="住址" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="authorizationBtn(scope.row)" v-allow="301101">授权</el-button>
                    <el-button type="primary" size="mini" @click="deleteRow(scope.row)" v-allow="301102">删除</el-button>
                    <el-button type="primary" size="mini" @click="jumpHouseTenantDetails(scope.row)">查看房屋</el-button>
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

    <el-dialog  title="授权" :visible.sync="authorization" :close-on-press-escape="false" :modal-append-to-body='false' width="600px" top="5vh">
        <el-form>
          <div class="tenantManagerContentBox">
            <el-form-item label="租客名称 : " class="mesgBox">
              {{authorizationMsg.personName}}
            </el-form-item>
            <el-form-item label="授权状态 : " class="mesgBox">
              <span v-if="authorizationMsg.effectiveStatus=='1'">已过期</span>
              <span v-if="authorizationMsg.effectiveStatus=='0'">正常</span>
            </el-form-item>
            <el-form-item label="授权截止时间 : " class="mesgBox">
              {{authorizationMsg.effectiveTime}}
            </el-form-item>
            <el-form-item label="新授权时间 : " class="mesgBox">
              <el-date-picker
              v-model="timeNew"
              type="date"
              @change="changeDate1"
              :picker-options="expireTimeOption"
              placeholder="选择日期"
              >
            </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
              <el-button @click="authorization =false">取 消</el-button>
              <el-button type="primary" @click="panelHandle(authorizationMsg)" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace,validatePhone } from '../../commom/validator'
  import { residentialCompanyType } from '../../commom/filter.js'
  import moment from 'moment'
  export default {
    name: 'tenantManager',
    components: {OrganTree},
    data() {
      return {
        expireTimeOption: {
          disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
            return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
          }
        },
        time:'',
        timeNew:'',
        buildingListData:[],
        unitListData:[],
        floorData:[],
        authorizationMsg:{},
        authorization:false,
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        factoryType: [],
        companyType: [],
        residentialName:JSON.parse(sessionStorage.getItem('treeListName')),
        model: {},
        total: 0,
        filter: {
          organId: 1,
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
        },
        firstErr: null,
        loading: false,
        authorizationType:[
          {id: 1, label: '已过期'},
          {id: 0, label: '正常'},
        ]
      }
    },

    mounted() {
      // this.treeListName=JSON.parse(sessionStorage.getItem('treeListName'))

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
      }
      if(this.$route.params.residentialName){
        this.residentialName = this.$route.params.residentialName
      }
        this._fetchData()
        this._fetchVillageCascadeData()
    },
    methods: {
      _fetchData: debounce(async function() {
        if(this.filter.buildingId){
          this.getBuildData()
        }

        const data = await Api.rentingList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
         data.rows.forEach(v=>{

            var ss=v.identityNumber
          var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p

        })
        v.identityNumber=str1
        })
          this.total = data.total
          this.tableData = data.rows

      }, 100),
      getBuildData(){
        var buildingId,unitName,inFloorName=''
        if(this.filter.buildingId){
          for (let i = 0; i < this.buildingListData.length; i++) {
            if(this.buildingListData[i].buildingId==this.filter.buildingId){
              buildingId=this.buildingListData[i].buildingName
            }
          }
        //  this.filter.houseAddress=`${buildingId}`
        }
        if(this.filter.unitId){
          for (let i = 0; i < this.unitListData.length; i++) {
            if(this.unitListData[i].unitId==this.filter.unitId){
              unitName=this.unitListData[i].unitName
            }
          }
      //  this.filter.houseAddress=`${buildingId}${unitName}`

        }
        if(this.filter.inFloorNum){
          for (let i = 0; i < this.floorData.length; i++) {
            if(this.floorData[i].inFloorNum==this.filter.inFloorNum){
              inFloorName=this.floorData[i].inFloorNum
            }
          }
      //  this.filter.houseAddress=`${buildingId}${unitName}${inFloorName}`
        }

      },
           // 小区级联数据 小区-楼栋-单元
      _fetchVillageCascadeData: debounce(async function () {
        const data = await Api.getVillageCascadeList.get({}).then(data => data.data.result)
           data.filter((item, index) => {
            if (item.villageId == this.filter.organId) {
              this.filter.villageName = item.villageName;
              this.buildingListData = item.buildings;
            }
          })
        // this.buildingListData = this.villageListData[0].buildings;
        // this.unitListData = this.buildingListData[0].units;
        // this.filter.unitId = this.unitListData[0].unitId;
      }, 100),
       _fetchHouseList: async function() {
        const data = await Api.getHousesByUnitId.get({},{
          pathParams: {
            unitId: this.filter.unitId,
          }
        }).then(data => data.data)
        // for (let i = 0; i < data.rows.length; i++) {
        //   data.rows[i].inFloorName= data.rows[i].inFloorNum+'层'
        // }

        this.floorData=data.rows || []

      },
       selectOption: function (type, id) {
        if (1 == type) {
          if(this.floorData.length>0){
            this.filter.inFloorNum=''
          }
          this.unitListData = [];
          this.filter.unitId=''
          this.floorData = []
          this.buildingListData.filter((item, index) => {
            if (item.buildingId == id) {
              this.unitListData = item.units;
            }
          })
        } else if (2 == type) {
          if(this.floorData.length==0){
            this._fetchHouseList()
          }else{
          this.floorData = []
          this.filter.inFloorNum=''
          }
        }
      },
      async deleteRow(row) {
        this.$confirm(`确定要移除当前租户吗？`, '提示', {
           confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //
          await Api.deleteTenant.delete({}, {
            pathParams: {
              id: row.populationHouseId
            }
          }).then(() => {
            this.$message({message: '移除成功', type: 'success'})
            this._fetchData()
            this._fetchVillageCascadeData()
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
          this.filter.startEffectiveTime=moment(val[0]).format('YYYY-MM-DD HH:mm:ss')
          this.filter.endEffectiveTime=moment(val[1]).format('YYYY-MM-DD HH:mm:ss')
        }else {
          this.filter.startEffectiveTime=''
          this.filter.endEffectiveTime=''
        }
      },
      changeDate1(val){
        if(val){
          this.timeNew=moment(val).format('YYYY-MM-DD HH:mm:ss')
        }else {
          // this.filter.effectiveTime=''
          this.timeNew=''
        }
      },
      authorizationBtn(row){
        this.timeNew=''
        this.authorization=true
        this.authorizationMsg=row
      },
      panelHandle(){

        if(!this.timeNew){
          // this.$message({ message: "请输入授权时间", type: "error" });
          this.authorization=false
          this._fetchData()
          this._fetchVillageCascadeData()
        }else{
          this.timeNew  = moment(this.timeNew).format('YYYY-MM-DD')
          Api.rentingGrant.post({
            houseId: this.authorizationMsg.houseId,
            populationId: this.authorizationMsg.personId,
            effectiveTime:this.timeNew
          }).then(()=>{
            this.authorization=false
            this.$message({ message: "授权成功", type: "success" });
            this._fetchData()
            this._fetchVillageCascadeData()
          })

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
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
         }
          this.filter.organId = item.id || ''
          this._fetchData()
          this._fetchVillageCascadeData()
        }
      },
      jumpHouseTenantDetails(row){

        this.$router.push({
            name: 'houseTenantDetails',
            query: {
              organId:this.filter.organId,
              unitId:row.unitId,
              residentialName : this.residentialName,
              houseId:row.houseId,
              type:'tenantManager'
            }})
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
.tenantManagerContentBox{
  .el-input__inner{
   padding-left: 50px!important;
  }
}
</style>
