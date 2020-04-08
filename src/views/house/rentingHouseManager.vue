<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">出租房屋</p>
      <div class="flexItem text_r">
         <el-select v-model="filter.buildingId" placeholder="所在楼栋" @change="selectOption(1,filter.buildingId)" clearable>
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
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="jumpBack()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.orgId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox realEntityTab">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="buildingNum" label="楼栋" align='center'></el-table-column>
                <el-table-column prop="unitNum" label="单元" align='center'>
                </el-table-column>
                <el-table-column prop="inFloorNum" label="楼层" align='center'></el-table-column>
                <el-table-column prop="houseCode" label="房号" align='center'></el-table-column>
                <el-table-column prop="liveNum" label="租客数量" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="jumpPractitioners(scope.row)">查看详情</el-button>
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
  export default {
    name: 'rentingHouseManager',
    components: {OrganTree},
    data() {
      return {
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        factoryType: [],
        companyType: [],
        residentialName:JSON.parse(sessionStorage.getItem('treeListName')),
        buildingListData:[],
        floorData:[],
        unitListData:[],
        model: {},
        total: 0,
        filter: {
          page: 1,
          rows: 10,
          name:null,
          companyType:null,
          orgId : 1,
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
      // this.filter.orgId  = JSON.parse(sessionStorage.getItem('user')).organId;
      this.companyType = companyType;
      if(this.$route.params.residentialName){
        this.residentialName = this.$route.params.residentialName
      }
      if(this.$route.params.organId){
        this.filter.orgId =this.$route.params.organId
        this._fetchData()
        this._fetchVillageCascadeData()
      }
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.rentingHouseManagerList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)

          this.tableData = data.rows

          this.total = data.total
      }, 100),
             // 小区级联数据 小区-楼栋-单元
      _fetchVillageCascadeData: debounce(async function () {
        const data = await Api.getVillageCascadeList.get({
          organId:this.filter.organId
        }, {
          loadingMaskTarget: '.tableShow'
        }).then(data => data.data.result)
         data.filter((item, index) => {

            if (item.villageId == this.filter.orgId) {
              this.filter.villageName = item.villageName;
              this.buildingListData = item.buildings;
            }
          })
        // this.villageListData = data || []

      }, 100),
       _fetchHouseList: async function() {
        const data = await Api.getHousesByUnitId.get({},{
          pathParams: {
            unitId: this.filter.unitId,
          }
        }).then(data => data.data)
        this.floorData=data.rows || []
      },
      selectOption: function (type, id) {
           if (1 == type) {
             if(this.floorData.length>0){
               this.filter.inFloorNum=''
             }
          this.unitListData = [];
          this.floorData = []
          this.filter.unitId=''
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
          this.filter.orgId  = item.id || ''
          this._fetchData()
          this._fetchVillageCascadeData()
        }
      },
      jumpPractitioners(row){
        this.$router.push({
            name: 'houseTenantDetails',
            query: {
              organId:this.filter.orgId,
              unitId:row.unitId,
              residentialName : this.residentialName,
              type:'rentingHouseManager',
              houseId:row.id,
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
</style>
