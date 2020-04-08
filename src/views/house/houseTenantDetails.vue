<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">出租屋管理</p>
      <div class="flexItem text_r">
        <el-select v-model="filter.villageId" @change="selectOption(1,filter.villageId)"
                   placeholder="请选择小区" clearable>
          <el-option v-for="item in villageListData"
                     :key="item.villageId"
                     :label="item.villageName"
                     :value="item.villageId"
                     @click="selectOption(1,item)"></el-option>
        </el-select>
        <el-select v-model="filter.buildingId" @change="selectOption(2,filter.buildingId)"
                   placeholder="请选择楼栋" clearable>
          <el-option v-for="item in buildingListData"
                     :key="item.buildingId"
                     :label="item.buildingName"
                     :value="item.buildingId"
                     @click="selectOption(2,item)"></el-option>
        </el-select>
        <el-select v-model="filter.unitId" @change="selectOption(3,filter.unitId)"
                   placeholder="请选择单元" clearable>
          <el-option v-for="item in unitListData"
                     :key="item.unitId"
                     :label="item.unitName"
                     :value="item.unitId"
                     @click="selectOption(3,item)"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        
        <el-button type="primary" size="small" @click="goBack()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row style="height: 100%">
        <div class="zhsq-right-con" ref="content">
          <div class="tableBox house-con">
            <el-row>
              <el-col :span="12" class="br1">
                <div class="unit-con" ref="unitCon">
                  <div ref="unit">
                    <div class="houseTenantText">
                      <div class="houseTenantTextTitle">{{unitName}}</div>
                      <div class="houseTenantTextNumBox">
                      <p>
                            <img src="../../assets/images/house.png" alt="">出租房<span class="color324">{{tenantHouseNum}} </span> 户
                          </p>
                      <p class="houseTenantTextNum">
                            <img src="../../assets/images/person.png" alt="">出租房人口<span class="color324">{{tenantPopulationNum}}</span>  人
                          </p>
                      </div>
                    </div>
                    <div class="img">
                      <img src="../../assets/images/house/634.png" ref="img">
                    </div>
                  </div>
                  <div class="unitList" ref="unitList">
                    <div class="unitLine" v-for="(item,index) in floorList">
                      <div class="unitFirst">
                        {{item.inFloorName}}
                      </div>
                      <template v-for="(item1,index1) in item.houses">
                        <div class="state2 unitBox" @click.stop="jump(item1,index1,index)" :style="{backgroundColor:item1.back}">
                        <!-- <div class="state1 unitBox" @click.stop="jump(item1,index1,item.houses)"> -->
                          <p class="floorContant">
                            {{item1.houseCode}}
                            <span>租房人口 {{item1.liveNum}} 人</span>
                          </p>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
              </el-col>
              <!-- <div class="unitListPartitionLine"></div> -->
              <el-col :span="12">
                <div class="noDataBox" v-show="noDataMsg">
                  <img src="" alt="">
                  点击左侧房间号显示详细信息
                </div>
                <div class="unit-con populationBBox" v-show="populationShow" ref="populationBBox">
                  <div class="populationTitleBox" ref="populationTitleBox">
                    <p class="populationTitle">{{selectionName}}</p>
                    <div>
                      <p>业主:{{ownerData.name}}</p>
                      <p>联系电话:{{ownerData.tel}}</p>
                      <p>身份证号:{{ownerData.identityNumber}}</p>
                    </div>
                  </div>
                  <div class="populationMsgBox" ref="populationMsgBox"> 
                    <div class="mapTitle">
                      <span class="top-icon"></span>
                      <span class="title1">人口信息</span>
                    </div>
                    <div class="populationMsg">
                      <el-row>
                        <el-col v-for="item in tenantPersonData"  :span="12">
                       <div class="populationMsg1" >
                        <img :src="item.photoPath" alt="">
                        <div class="populationTxt">
                          <p>姓名:{{item.personName}}</p>
                          <p>性别:{{item.sex == 0 ? '男':'女 '}}</p>
                          <p>居住类型:租住人口</p>
                          <p>联系电话:{{item.tel}}</p>
                          <p>身份证号:{{item.identityNumber}}</p>
                          <p class="houseEffectiveTime">授权截止日期:{{item.effectiveTime}}</p>
                          <el-button type="primary" size="small" @click="removePerson(item)">移除</el-button>
                        </div>
                      </div>
                        </el-col>
                      </el-row>
                    
                    </div>
                  </div>
                  <div class="populationFormBox" ref="unitcon">
                    <div class="mapTitle">
                      <span class="top-icon"></span>
                      <span class="title1">租住人口登记记录</span>
                    </div>
                    <div class="populationForm">
                      <el-table :data="tenantPersonRegisterData" border="" :height="400">
                        <el-table-column type="index" label="序列" width="60"></el-table-column>
                        <el-table-column prop="personName" label="姓名"></el-table-column>
                        <el-table-column prop="tel" label="手机号"></el-table-column>
                        <el-table-column prop="identityNumber" label="身份证号"
                                         width="120"></el-table-column>
                        <el-table-column prop="effectiveTime" label="时间"></el-table-column>
                        <el-table-column prop="creatorName" label="登记人"></el-table-column>
                        <el-table-column prop="liveStatus" width="90" :formatter="liveStatusFormat"
                                         label="登记类型"></el-table-column>
                      </el-table>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-row>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'      
  import {debounce} from 'lodash'
  import Api from '../../commom/api.js'

  export default {
    name: 'houseTenantDetails',
    data() {
      return {
        selectionName:'',
        housesActive:[],
        index1:'',
        back:'red',
        tabHeight1:'',
        unitId: '',
        unitName: '',
        tenantHouseNum: 0,
        tenantPopulationNum: 0,
        unitList: [],
        unitcon: '',
        floor: [],
        residentialName:'',
        filter:{
          villageId: '',
          villageName: '',
          buildingId: '',
          buildingName: '',
          unitId: '',
          unitName:''
        },
        villageListData: [],
        buildingListData: [],
        unitListData: [],
        houseData: {},
        ownerData:{},
        tenantPersonData: [],
        tenantPersonRegisterData: [],
        noDataMsg: true,
        populationShow: false,
        list: [{personName: '', tel: '', identityNumber: '', orgName: ''}],
        floorList: [],
        liveStatusData: [
          {key: 0, value: '入住'},
          {key: 1, value: '注销'},
          {key: 2, value: '重新授权'},
        ]
      }
    },
    computed: {
      defaultExpandKeys() {
        return [this.unitList.length ? this.unitList[0].id : '']
      }
    },
    mounted() {
      this._fetchVillageCascadeData()
      this._height();
      if(this.$route.query.address){
        this.unitName = this.$route.query.address;
      }
      if(this.$route.query.residentialName){
        this.residentialName = this.$route.query.residentialName
      }
      if (this.$route.query.organId && this.$route.query.unitId) {
        this.organId = this.$route.query.organId;
        this.unitId = this.$route.query.unitId;
      } else {
        this.$router.push({'name': 'houseTenantList'})
      }
      // if(this.$route.params.row){
      //     this.houseData.id=this.$route.params.row.id
      // }
      this._fetchHouseList()

    },
 
    methods: {

      _height: function () {
        this.$refs.img.onload = () => {
          this.$refs.unitCon.style.height = this.$refs.content.offsetHeight +'px'
          this.$refs.unitCon.style.maxHeight = this.$refs.content.offsetHeight+'px'
          this.$refs.unitList.style.height = this.$refs.content.offsetHeight - this.$refs.unit.offsetHeight -60 +'px'
          this.$refs.unitList.style.maxHeight = this.$refs.content.offsetHeight - this.$refs.unit.offsetHeight -60 +'px'
          this.$refs.populationBBox.style.height=this.$refs.content.offsetHeight +'px'
          this.$refs.populationBBox.style.maxHeight=this.$refs.content.offsetHeight +'px'
       }
        window.onresize = () => {
          this.$refs.unitCon.style.height = this.$refs.content.offsetHeight +'px'
          this.$refs.unitCon.style.maxHeight = this.$refs.content.offsetHeight +'px'
          this.$refs.unitList.style.height = this.$refs.content.offsetHeight - this.$refs.unit.offsetHeight -60 +'px'
          this.$refs.unitList.style.maxHeight = this.$refs.content.offsetHeight - this.$refs.unit.offsetHeight -60 +'px'
          this.$refs.populationBBox.style.height=this.$refs.content.offsetHeight +'px'
          this.$refs.populationBBox.style.maxHeight=this.$refs.content.offsetHeight +'px'
        };
        
        
      },
      // 搜索
      _fetchData() {
      this.tenantPersonData=[]
      this.houseData={}
      this.ownerData={}
      this.$route.query.houseId=null
      this.unitId=this.filter.unitId
      this.floorList=[]
      this.selectionName=''
      this.populationShow=false
      this.noDataMsg=true
      this.tenantPersonRegisterData=[]
      this._fetchHouseList()

      },
      selectOption: function (type, id) {
        if (1 == type) {
          this.buildingListData = [];
          this.unitListData = [];
          this.filter.unitId = '';
          this.filter.buildingId = '';
          this.villageListData.filter((item, index) => {
            if (item.villageId == id) {
              this.filter.villageName = item.villageName;
              this.buildingListData = item.buildings;
            }
          })
        } else if (2 == type) {
          this.unitListData = [];
          this.filter.unitId = '';
          this.buildingListData.filter((item, index) => {
            if (item.buildingId == id) {
              this.filter.buildingName = item.buildingName;
              this.unitListData = item.units;
            }
          })
        } else if (3 == type) {
          this.unitListData.filter((item, index) => {
            if (item.unitId == id) {
              this.filter.unitName = item.unitName;
            }
          })
        }
      },
                 // 小区级联数据 小区-楼栋-单元
      _fetchVillageCascadeData: debounce(async function () {
        const data = await Api.getVillageCascadeList.get({}).then(data => data.data.result)
            this.villageListData = data || []
      }, 100),
   
      setHouseholder(item){
         Api.setHouseholder.put({},{
          pathParams: {
            houseId: item.houseId,
            personId: item.personId
            }
          }).then(()=>{
            this.$message({ message: '设置成功', type: 'success' })
            this._fetchTenantPersonList();
              this._fetchTenantPersonRegisterList();
          })
      },
      //房屋列表
      _fetchHouseList: async function () {
        const data = await Api.getTenantHouseByUnitId.get({}, {
          pathParams: {
            unitId: this.unitId,
          }
        }).then(data => data.data.result)
        this.tenantHouseNum = data.tenantHouseNum;
        this.tenantPopulationNum = data.tenantPopulationNum;
        if(this.residentialName!=''){
          this.unitName=`${this.residentialName}${data.unitName}`
        }
        if(this.filter.villageName){
          this.unitName=`${this.filter.villageName}${data.unitName}`
        }
       
        data.floorVos.forEach((item, index) => {
          this.floorList.push(item);
        })
        if( this.$route.query.houseId){
          this.houseData.id=this.$route.query.houseId
          this.reappearance()
        }
        let num = data.unitFloorNum;
        for (let i = 0; i < num * 1; i++) {
          this.floor[i] = {id: i + 1, value: i + 1}
        }

      },
      // //加载房屋租客列表
      _fetchTenantPersonList: async function () {
        const data = await Api.getHouseTenantPersonDetails.get({}, {
          pathParams: {
            houseId: this.houseData.id,
          }
        }).then(data => data.data.rows)

        for (let i = 0; i < data.length; i++) {
           if( data[i].effectiveTime){
             data[i].effectiveTime=moment(data[i].effectiveTime).format('YYYY-MM-DD')
           }
        if(data[i].identityNumber){
          var ss=data[i].identityNumber
          var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
          var i="";
          while(i.length<z.length){i+="*"}
          return y+i+p})
          data[i].identityNumber=str1
        }
        }
        this.tenantPersonData = data;
      },

      //加载房屋租客登记信息
      _fetchTenantPersonRegisterList: async function () {
        const data = await Api.getTenantPersonRegisterLst.get({}, {
          pathParams: {
            houseId: this.houseData.id,
          }
        }).then(data => data.data.rows)
          if(data.length>0){
              
        }
         for (let i = 0; i < data.length; i++) {
           if( data[i].effectiveTime){
             data[i].effectiveTime=moment(data[i].effectiveTime).format('YYYY-MM-DD')
           }
          if(data[i].identityNumber){
            var ss=data[i].identityNumber
            var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p})
            data[i].identityNumber=str1
          }
        }
        this.tenantPersonRegisterData = data;
      },
      async jump(item,index1,index) {
        console.log(item);
        
        this.selectionName=`${this.unitName}${item.houseCode}`
        for (var j = 0; j < this.floorList.length; j++) {
          for (var i = 0; i < this.floorList[j].houses.length; i++) {
            this.floorList[j].houses[i].back='#5678CD'
          }
        }
         this.floorList[index].houses[index1].back='#304bab'

        if(item.phlist){
          for (let i = 0; i < item.phlist.length; i++) {
            // if(item.phlist[i].identityNumber){
              var ss=item.phlist[i].identityNumber
              var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
              var i="";
              while(i.length<z.length){i+="*"}
              return y+i+p})
              item.phlist[i].identityNumber=str1
            // }
          }
         this.ownerData = item.phlist[0]

        }else{
          this.ownerData={}
        }
          this.noDataMsg = false
          this.populationShow = true
          this.houseData = item;
          this._fetchTenantPersonRegisterList();
          this._fetchTenantPersonList();
             
      },
      reappearance(){
        for (var i = 0; i < this.floorList.length; i++) {
         for (var j = 0; j < this.floorList[i].houses.length; j++) {
           
            this.floorList[i].houses[j].back='#5678CD'
            if(this.floorList[i].houses[j].id==this.houseData.id){
              this.floorList[i].houses[j].back='#304bab'
            this.selectionName=`${this.unitName}${this.floorList[i].houses[j].houseCode}`
            }   
          if(this.floorList[i].houses[j].phlist){
            
          for (let x = 0; x < this.floorList[i].houses[j].phlist.length; x++) {
            // if(item.phlist[i].identityNumber){
              var ss=this.floorList[i].houses[j].phlist[x].identityNumber
              var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
              var i="";
              while(i.length<z.length){i+="*"}
              return y+i+p})
              this.floorList[i].houses[j].phlist[x].identityNumber=str1
            // }
          }
         this.ownerData =  this.floorList[i].houses[j].phlist[0]
        }else{
           this.ownerData = {}
        }   
         
          // this.houseData = this.floorList[i].houses[j];
         }
        }
          this.noDataMsg = false
          this.populationShow = true
          this._fetchTenantPersonRegisterList();
          this._fetchTenantPersonList();
      },
      //移除
      removePerson(item) {
        this.$confirm(`确定要移除当前租户吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          //
          await Api.removePerson.delete({}, {
            pathParams: {
              houseId: this.houseData.id,
              personId: item.personId
            }
          }).then(() => {
            this.$message({message: '移除成功', type: 'success'})
            this._fetchTenantPersonList();
            this._fetchTenantPersonRegisterList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //返回
      goBack() {
        if(this.$route.query.type){
          if(this.$route.query.type=='checkOutRecurd'){
             this.$router.push({
            name: 'checkOutRecurd',
            params: {
              organId: this.organId,
              residentialName:this.residentialName
            }})
          }else if(this.$route.query.type=='tenantManager'){
               this.$router.push({
                name: 'tenantManager',
                params: {
                  organId: this.organId,
                residentialName:this.residentialName                  
                }})
          }else if(this.$route.query.type=='rentingHouseManager'){
               this.$router.push({
              name: 'rentingHouseManager',
              params: {
                organId: this.organId,
              residentialName:this.residentialName                
              }})
          }
        }else{
          this.$router.push({'name': 'houseTenantList'})
        }
      },
      // 入住状态
      liveStatusFormat(row, column) {
        let value = this.liveStatusData[0].value;
        this.liveStatusData.forEach(item => {
          if (item.key == row.liveStatus) {
            value = item.value;
            return;
          }
        });
        return value;
      },
    },
  };
</script>
<style lang="less">
  .tableBox {
    position: relative;

    .el-row {
      .unitListPartitionLine {
        height: 120%;
        width: 1px;
        background: #CFD0E0;
        position: absolute;
        top: 0px;
        right: 35%
      }
    }
  }
  .populationBBox{
    overflow-y: auto
  }
  .populationTitleBox {
    height: 10%;
    width: 100%;
    font-size: 14px;
    .populationTitle{
      font-weight: bold;
      font-size: 18px;
    }
    div {
      margin-top: 2%;
      display: flex;
      justify-content: space-between
    }
  }

  .populationMsgBox {
    margin-top: 9%;
    width: 100%;
    // height: 33%;
    margin-bottom: 2%;
    .houseEffectiveTime{
      height: 30px;
      line-height: 100%;
    }
    .populationMsg {
      // width: 100%;
      // display: flex;
      // justify-content: space-between;
      display: inline;
      font-size: 10px;
      .populationMsg1 {
        margin-right: 5px;
        margin-bottom: 5px;
        display: flex;
        border: 1px solid #cfd2e0;
        background: #f1f8fd;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        // min-height: 250px;
        img {
          margin: 15px 5px 10px 5px; 
          width: 95px;
          height: 130px;
        }

        .populationTxt {
          padding: 4px 4px;
          p{
            margin-top: 7px;
          }
        }
      }

      .populationMsg2 {
        width: 48%;
        display: flex;
        border: 1px solid #cfd2e0;
        background: #f1f8fd;

        img {
          margin: 5% 5% 0 2%;
          width: 31%;
          height: 77%;
        }

        .populationTxt {
          padding: 4px 4px;
        }
      }
    }
  }

  .populationFormBox {
    width: 100%;
    // height: 50%;

    .populationForm {
      height: 80%;

    }
  }
  .state2{
    background: #5678CD
  }
  .mapTitle {
    margin-bottom: 2%;

    .top-icon {
      display: inline-block;
      width: 4px;
      height: 18px;
      background: #184DA8;
      margin-right: 10px;
    }

    .title {
      font-size: 16px;
      color: #3B3D58;
      margin-left: 10px;
    }
  }

  .noDataBox {
    width: 100%;
    height: 400px;
    color: #CFD0E0;
    text-align: center;
    line-height: 400px
  }

  .floorContant {
    height: 50%;
    position: relative;

    span {
      position: absolute;
      top: 40%;
      left: 15%;
      font-size: 12px;
      height: 30px;
    }
  }

  .houseTenantText {
    display: flex;
    justify-content: space-between;
    .houseTenantTextNumBox{
      display: flex;
      justify-content: space-between;
      img{
        height: 18px;
        width: 18px;
      }
      .houseTenantTextNum {
        padding-left: 30px;
      }
    }
    .houseTenantTextTitle{
      font-weight:bold;
    }
    .color324{
      color: #324cac
    }
  }
//   .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
//   white-space: nowrap
// }
//    .el-table td, .el-table th{
//     padding: 0;
//   }
</style>
