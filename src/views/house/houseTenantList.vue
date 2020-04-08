<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">出租屋管理</span>
      <div class="text_r flexItem">
        <el-select v-model="filter.villageId" @change="selectOption(1,filter.villageId)"
                   placeholder="请选择小区">
          <el-option v-for="item in villageListData"
                     :key="item.villageId"
                     :label="item.villageName"
                     :value="item.villageId"
                     @click="selectOption(1,item)"></el-option>
        </el-select>
        <el-select v-model="filter.buildingId" @change="selectOption(2,filter.buildingId)"
                   placeholder="请选择楼栋">
          <el-option v-for="item in buildingListData"
                     :key="item.buildingId"
                     :label="item.buildingName"
                     :value="item.buildingId"
                     @click="selectOption(2,item)"></el-option>
        </el-select>
        <el-select v-model="filter.unitId" @change="selectOption(3,filter.unitId)"
                   placeholder="请选择单元">
          <el-option v-for="item in unitListData"
                     :key="item.unitId"
                     :label="item.unitName"
                     :value="item.unitId"
                     @click="selectOption(3,item)"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>

      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <div class="zhsq-right-con" ref="content">
        <div class="tableBox">
          <div class="tableTopBox houseTenantT">
            <el-popover width="300" trigger="click" ref="poppoverBox">
              <div style="height: 300px;max-height: 300px;overflow: auto" class="popover">
                <el-tree :data="organTreeListData"
                         :props="defaultProps"
                         @node-click="selectOrgId"
                         highlight-current
                         :expand-on-click-node="false"
                         :default-checked-keys="[organId]"
                         node-key="id">
                </el-tree>
              </div>
              <el-input class="index-select-organId" v-model="orgName" slot="reference"
                        autocomplete="off" placeholder="请选择小区" readonly></el-input>
            </el-popover>
          </div>
          <div class="tableBottomBox">
            <div class="tableBottomBoxT" ref="tableBottomBoxT">
              <div class="titleContent" @click="jumpTenant(1)">
                <div>
                  <p>出租房屋</p>
                  <div>
                    {{houseStatistics.tenantHouseCount}} <span>户</span>
                  </div>
                </div>
                <div class="titleContentImg">
                  <img src="../../assets/images/house/1.png" alt="">
                </div>
              </div>
              <div class="titleContent titleContentI2" @click="jumpTenant(2)">
                <div>
                  <p>租住人口</p>
                  <div>
                    {{houseStatistics.tenantPersonCount}} <span>人</span>
                  </div>
                </div>
                <div class="titleContentImg">
                  <img src="../../assets/images/house/2.png" alt="">
                </div>
              </div>
              <div class="titleContent titleContentI3" @click="jumpTenant(3)">
                <div>
                  <p>当月入住租客</p>
                  <div>
                    {{houseStatistics.monthTenantPersonInCount}} <span>人</span>
                  </div>
                </div>
                <div class="titleContentImg">
                  <img src="../../assets/images/house/3.png" alt="">
                </div>
              </div>
              <div class="titleContent titleContentI4" @click="jumpTenant(4)">
                <div>
                  <p>当月退房租客</p>
                  <div>
                    {{houseStatistics.monthTenantPersonOutCount}} <span>人</span>
                  </div>
                </div>
                <div class="titleContentImg">
                  <img src="../../assets/images/house/4.png" alt="">
                </div>
              </div>
            </div>
            <div class="tableBottomBoxB" ref="tableBottomBox">
              <div class="rentalHousingL">
                <div class="mapTitle">
                  <span class="top-icon"></span>
                  <span class="title1">租客户籍分布分析</span>
                </div>
                <div class="emapBox">
                  <IEcharts :option="nativeMap" ref="nativeMap"></IEcharts>
                </div>
                <div class="etableBox">
                  <el-table :data="houseStatistics.tenantPersonPlaces" border="" :height="tabHeight1">
                    <el-table-column type="index" label="排名" width="80" align="center" :width="50"></el-table-column>
                    <el-table-column prop="name" label="地域" align="center"></el-table-column>
                    <el-table-column prop="count" label="人数" align="center"></el-table-column>
                    <el-table-column prop="percentage" label="占比" align="center"></el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="rentalHousingM">
                <div class="aghouseTenant">
                  <div class="mapTitle">
                    <span class="top-icon"></span>
                    <span class="title1">租客入住情况分析</span>
                  </div>
                  <IEcharts :option="inOutLine" ref="inOutLine"></IEcharts>
                </div>
                <div class="occupyBox"></div>
                <div class="houseTenantAnalysis">
                  <div class="mapTitle">
                    <span class="top-icon"></span>
                    <span class="title1">租客年龄结构分析</span>
                  </div>
                  <IEcharts :option="ageBar" ref="ageBar"></IEcharts>
                </div>
              </div>
              <div class="rentalHousingR">
                <div class="houseTenantGender">
                  <div class="mapTitle">
                    <span class="top-icon"></span>
                    <span class="title1">租客性别分析</span>
                  </div>
                  <IEcharts :option="sexPie" ref="sexPie"></IEcharts>
                </div>
                <div class="occupyBox"></div>
                <div class="houseTenantNation">
                  <div class="mapTitle">
                    <span class="top-icon"></span>
                    <span class="title1">租客民族分布分析</span>
                  </div>
                  <IEcharts :option="nationBar" ref="nationBar"></IEcharts>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce} from 'lodash'
  import {domHeightMixin} from '../../commom/mixins.js'
  import IEcharts from 'vue-echarts-v3/src/full.js'
  import 'echarts/map/js/china'

  export default {
    mixins: [domHeightMixin],
    name: 'houseTenantList',
    components: {IEcharts},
    data() {
      return {
        tabHeight1:'',
        organId: '',
        orgName: '',
        organTreeListData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        villageListData: [],
        buildingListData: [],
        unitListData: [],
        houseStatistics: {},
        statisticsType: 1, // 1按月统计，2按周统计，
        statisticsRange: 6,// 12按月统计，7按周统计，
        nativeMapData: [
          {name: '河北', value: 0},
          {name: '山东', value: 0},
          {name: '河南', value: 0},
          {name: '重庆', value: 0},
          {name: '广西', value: 0},
          {name: '四川', value: 0},
          {name: '海南', value: 0},
          {name: '北京', value: 0},
          {name: '天津', value: 0},
          {name: '上海', value: 0},
          {name: '江苏', value: 0},
          {name: '浙江', value: 0},
          {name: '福建', value: 0},
          {name: '安徽', value: 0},
          {name: '江西', value: 0},
          {name: '湖北', value: 0},
          {name: '湖南', value: 0},
          {name: '广东', value: 0},
          {name: '辽宁', value: 0},
          {name: '吉林', value: 0},
          {name: '黑龙江', value: 0},
          {name: '内蒙古', value: 0},
          {name: '云南', value: 0},
          {name: '贵州', value: 0},
          {name: '山西', value: 0},
          {name: '陕西', value: 0},
          {name: '甘肃', value: 0},
          {name: '新疆', value: 0},
          {name: '西藏', value: 0},
          {name: '青海', value: 0},
          {name: '宁夏', value: 0},
          {name: '台湾', value: 0},
          {name: '香港', value: 0},
          {name: '澳门', value: 0},
          {
            name: '南海诸岛',
            value: 0,
            "itemStyle": {"normal": {"opacity": 0, "label": {"show": false}}}
          }
        ],
        map: {
          tooltip: {
            show: true,
            formatter: function (params) {
              if (params.data) {
                return `${params.name}(<span style="font-size:10px;">持有设备量:${params.data.devicesCount}</span>)</br>${params.marker}使用总数：${params.data.value}</br>${params.marker}活跃度：${params.data.devicesUseLv}`
              } else {
                return;
              }
            }
          },
          visualMap: {
            type: "continuous",
            text: ["高", "低"],
            showLabel: true,
            seriesIndex: [0],
            min: 0,
            // calculable: true,
            max: {
              name: "北京",
              devicesCount: 100, //总数
              feiyue1: 40, //肺悦1个数
              feiyue2: 60, //肺悦2个数
              value: 10, //使用个数
              devicesUseLv: '40%', //使用率
            },
            inRange: {
              color: ['#f7fbff', '#4e7cef', '#0549f3']
            },
            textStyle: {
              color: "#ff6700"
            },
            top: 0,
            left: 0
          },
          geo: {
            roam: true,
            map: "china",
            layoutCenter: ["50%", "50%"],
            layoutSize: "70%",
            label: {
              emphasis: {
                show: false
              }
            },
            scaleLimit: {
              min: 1.2,
              max: 10,
            },
            itemStyle: {
              emphasis: {
                areaColor: "#fff464"
              }
            },

          },
          series: [{
            name: "mapSer",
            type: "map",
            roam: false,
            geoIndex: 0,
            label: {
              show: false
            },
            data: [{
              name: "北京",
              devicesCount: 100, //总数
              feiyue1: 40, //肺悦1个数
              feiyue2: 60, //肺悦2个数
              value: 10, //使用个数
              devicesUseLv: '40%', //使用率
            },
              {
                name: "天津",
                devicesCount: 50,
                feiyue1: 40,
                feiyue2: 60,
                value: 20,
                devicesUseLv: '20%',
              }
            ],
          },]
        },
        ageBar: {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '30%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: this.ageData_name,
              data: ['0-17岁', '18-25岁', '26-35岁', '36-45岁', '46-59岁', '60岁(含以上)'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '人数',
              type: 'bar',
              barWidth: '30%',
              data: [0, 0, 0, 0, 0, 0]
            }
          ]
        },
        sexPie: {
          color: ['#94abe0', '#5678CD'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: '65%',
            y: 'center',
            data: ['男', '女']
          },
          series: [
            {
              name: '性别',
              type: 'pie',
              radius: ['0%', '70%'],
              center: ['30%', '55%'],
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  formatter: "{d}%",
                  textStyle: {
                    color: '#fff',
                    fontSize: '10'
                  }
                },
              },
              data: [
                {value: 1, name: '男'},
                {value: 2, name: '女'}
              ]
            }
          ]
        },
        nativeMap: {
          backgroundColor: '#f2f2f2',
          tooltip: {
            trigger: 'item',
            formatter: '{b}',
          },
          roam: true,
          dataRange: {
            min: 0,
            max: 5,
            x: '5%',
            itemWidth: 15,
            itemHeight: 40,
            color: ['#0549f3', '#567acd', '#839edb', '#c3d1ef']
          },
          roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
              'china': true
            }
          },
          series: [{
            name: '数量',
            type: 'map',
            mapType: 'china',
            roam: false,
            itemStyle: {
              normal: {
                label: {
                  show: false
                }
              },
              emphasis: {
                label: {
                  show: true
                }
              }
            },
            data: [
              {name: '河北', value: 0},
              {name: '山东', value: 0},
              {name: '河南', value: 0},
              {name: '重庆', value: 0},
              {name: '广西', value: 0},
              {name: '四川', value: 0},
              {name: '海南', value: 0},
              {name: '北京', value: 0},
              {name: '天津', value: 0},
              {name: '上海', value: 0},
              {name: '江苏', value: 0},
              {name: '浙江', value: 0},
              {name: '福建', value: 0},
              {name: '安徽', value: 0},
              {name: '江西', value: 0},
              {name: '湖北', value: 0},
              {name: '湖南', value: 0},
              {name: '广东', value: 0},
              {name: '辽宁', value: 0},
              {name: '吉林', value: 0},
              {name: '黑龙江', value: 0},
              {name: '内蒙古', value: 0},
              {name: '云南', value: 0},
              {name: '贵州', value: 0},
              {name: '山西', value: 0},
              {name: '陕西', value: 0},
              {name: '甘肃', value: 0},
              {name: '新疆', value: 0},
              {name: '西藏', value: 0},
              {name: '青海', value: 0},
              {name: '宁夏', value: 0},
              {name: '台湾', value: 0},
              {name: '香港', value: 0},
              {name: '澳门', value: 0},
              {
                name: '南海诸岛',
                value: 0,
                "itemStyle": {"normal": {"opacity": 0, "label": {"show": false}}}
              }
            ]
          },]
        },
        inOutLine: {
          color: ['#3398DB', '#f7dfc0'],
          legend: {
            data: ['入住', '退房'],
            top: 20,
            right: 10
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          grid: {
            top: '30%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          yAxis: [
            {
              type: 'value'
            }
          ],
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
          ],
          series: [
            {
              name: '入住',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [820, 932, 901, 934, 1290, 1330, 1320, 222, 333, 444, 444, 111]
            },
            {
              name: '退房',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              data: [120, 132, 101, 134, 90, 230, 210, 888, 222, 555, 111, 555]
            }
          ]
        },
        nationBar: {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: '20%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['汉族', '藏族', '羌族', '维吾尔族']
          },
          series: [
            {
              name: '数量',
              type: 'bar',
              barWidth: 10,
              barMaxWidth: 20,
              data: [182, 234, 290, 349]
            }
          ]
        },
        libraryId: '',
        loading: false,
        tableData: [],
        filter: {
          villageId: '',
          villageName: '',
          buildingId: '',
          buildingName: '',
          unitId: '',
          unitName: ''
        },
      }
    },
    mounted() {
      if(this.$route.params.organId){
        this.organId=this.$route.query.organId
      }
      this._fetchOrganData();
      this._fetchVillageCascadeData();
    },
    updated(){
       //table高度
      this.$nextTick(() => {
      this.tabHeight1 = this.$refs.tableBottomBox.offsetHeight*0.5
        window.onresize = () => {
      this.tabHeight1 = this.$refs.tableBottomBox.offsetHeight*0.5
        };
      })
    },
    methods: {
      //机构树
      _fetchOrganData: debounce(async function () {
        const data = await Api.organTree.get({}).then(data => data.data.result)
        this.organTreeListData = [data] || []
        this.organId = this.organTreeListData[0].id
        this.orgName = this.organTreeListData[0].name;
        this._fetchTenantHouseStatisticsData();
        this._fetchTenantInOutStatisticsData();
      }, 100),
      // 小区级联数据 小区-楼栋-单元
      _fetchVillageCascadeData: debounce(async function () {
        const data = await Api.getVillageCascadeList.get({}).then(data => data.data.result)
        this.villageListData = data || []
        // this.buildingListData = this.villageListData[0].buildings;
        // this.unitListData = this.buildingListData[0].units;
        // this.filter.unitId = this.unitListData[0].unitId;
      }, 100),
      // 获取出租屋统计
      _fetchTenantHouseStatisticsData: debounce(async function () {
        const data = await Api.getTenantHouseStatistics.get({}, {
          pathParams: {
            organId: this.organId
          }
        }).then(data => data.data.result)
        this.houseStatistics = data;
        let nationNameData = [];
        let nationNumData = [];
        this.houseStatistics.tenantPersonNations.forEach((item, index) => {
          nationNameData.push(item.name);
          nationNumData.push(item.count);
        })
        this.$refs.nationBar.resize();
        this.nationBar.yAxis.data = nationNameData;
        this.nationBar.series[0].data = nationNumData;


        // 籍贯地图统计
        this.houseStatistics.tenantPersonPlaces.forEach((item, index) => {
          this.nativeMapData.filter((item1, index1) => {
            if (item.name.indexOf(item1.name) != -1) {
              item1.value = item.count;
            }
          })
        })
        this.$refs.nativeMap.resize();
        this.nativeMap.series[0].data = this.nativeMapData;

        let sexData = [];
        this.houseStatistics.tenantPersonSexs.forEach((item, index) => {
          if (item.name == "femaleNum") {
            sexData.push({name: '女', value: item.count});
          } else {
            sexData.push({name: '男', value: item.count});
          }
          this.$refs.sexPie.resize();
          this.sexPie.series[0].data = sexData;
        })
        let ageData = [];
        this.houseStatistics.tenantPersonAges.forEach((item, index) => {
          var index = 0;
          switch (item.name) {
            case '_17':
              index = 0;
              break;
            case '_18':
              index = 1;
              break;
            case '_26':
              index = 2
              break;
            case '_36':
              index = 3;
              break;
            case '_46':
              index = 4
              break;
            case '_60':
              index = 5;
              break;
          }
          ageData[index] = item.count;
        })
        this.$refs.ageBar.resize();
        this.ageBar.series[0].data = ageData;
      }, 100),
      // 搜索
      _fetchData() {
        if (this.filter.unitId == '') {
          this.$message({message: '请选择搜索条件', type: 'info'});
          return;
        }
        this.$router.push({
          name: 'houseTenantDetails',
          query: {
            organId: this.organId,
            unitId: this.filter.unitId,
            address: this.filter.villageName + this.filter.buildingName + this.filter.unitName
          }
        })
      },
      _fetchTenantInOutStatisticsData: debounce(async function () {
        const data = await Api.getTenantInOutStatistics.get({}, {
          pathParams: {
            organId: this.organId,
            type: this.statisticsType,
            range: this.statisticsRange
          }
        }).then(data => data.data.rows)
        let dateData = [];
        let inData = [];
        let outData = [];
        data.forEach((ite, index) => {
          dateData.push(ite.name);
          inData.push(ite.inCount);
          outData.push(ite.outCount);
        })
        this.$refs.inOutLine.resize();
        this.inOutLine.xAxis[0].data = dateData;
        this.inOutLine.series[0].data = inData;
        this.inOutLine.series[1].data = outData;
      }, 100),
      // 机构选择
      selectOrgId: function (node) {
     
        this.orgName = node.name;
        this.organId = node.id;
        this._fetchTenantHouseStatisticsData();
        this.$refs.poppoverBox.doClose()
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
      jumpTenant(id){
        if(id==1){
            this.$router.push({
            name: 'rentingHouseManager',
            params: {
              organId: this.organId,
              residentialName:this.orgName
            }})
        }else if(id==2){
           this.$router.push({
            name: 'tenantManager',
            params: {
              organId: this.organId,
              residentialName:this.orgName
            }})
        }else if(id==3){
           this.$router.push({
            name: 'checkOutRecurd',
            params: {
              liveStatus:0,
              organId: this.organId,
              residentialName:this.orgName
            }})
        }else if(id==4){
           this.$router.push({
            name: 'checkOutRecurd',
            params: {
              liveStatus:1,
              organId: this.organId,
              residentialName:this.orgName
            }})
        }
      }
    },
  };
</script>
<style lang="less" scoped>
  .tableBox {
    overflow-y: auto !important;
    box-sizing: border-box;

    .index-select-organId {
      width: 200px;
      padding: 5px 0 0 10px;
    }
  }

  .tableTopBox {


    .el-input--suffix .el-input__inner {
      margin-left: 5%;
      margin-top: 3%;
    }
  }

  .tableBottomBox {
    height: 85%;

    .tableBottomBoxT {
      // height: 20%;
      width: 100%;
      display: flex;
      justify-content: space-between;
      // background: red
      .titleContent {
        width: 21%;
        height: 90px;
        border-radius: 6px;
        margin-left: 10px;
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        background: #2f59c0;
        color: white;

        p {
          margin-top: 30%;
          margin-bottom: 20%;
          font-size: 12px;
        }

        div {
          font-size: 22px;

          span {
            font-size: 12px;
          }
        }

        .titleContentImg {
          margin-top: 6%
        }
      }

      .titleContentI2 {
        background: #567acd;
      }

      .titleContentI3 {
        background: #839edb;
      }

      .titleContentI4 {
        background: #c3d1ef;
      }
    }

    .tableBottomBoxB {
      height: 100%;
      width: 100%;
      display: flex;
      // background: blue
      .top-icon {
        display: inline-block;
        width: 4px;
        height: 14px;
        background: #184DA8;
      }

      .title1 {
        font-size: 12px;
        color: #3B3D58;
        margin-left: 10px;
      }

      .rentalHousingL {
        margin-top: 20px;
        margin-left: 10px;
        height: 100%;
        width: 25%;
        border: 1px solid gray;
        border-radius: 5px;
        position: relative;

        .mapTitle {
          position: absolute;
          top: 5px;
          left: 10px;
          z-index: 2;
        }

        .emapBox {
          width: 100%;
          height: 48%;
          margin-bottom: 5%;
        }

        .etableBox {
          width: 100%;
          height: 48%;
        }
      }

      .rentalHousingM {
        margin-top: 20px;
        margin-left: 10px;
        height: 100%;
        width: 50%;

        .aghouseTenant {
          width: 100%;
          height: 47%;
          border: 1px solid gray;
          // margin-bottom: 10%;
          border-radius: 5px;
          position: relative;

          .mapTitle {
            position: absolute;
            top: 5px;
            left: 10px;
            z-index: 2;
          }

          .conditionBtn {
            position: absolute;
            top: 0px;
            right: 10px;
            font-size: 10px;
            color: white;
            z-index: 3;

            span {
              padding: 2px 5px;
              background: #c3d1ef;
            }
          }
        }

        .occupyBox {
          height: 6%;
          width: 100%;
        }

        .houseTenantAnalysis {
          width: 100%;
          border: 1px solid gray;
          height: 47%;
          border-radius: 5px;
          position: relative;

          .mapTitle {
            position: absolute;
            top: 5px;
            left: 10px;
            z-index: 2;
          }
        }
      }

      .rentalHousingR {
        margin-top: 20px;
        margin-left: 10px;
        height: 100%;
        width: 25%;

        .houseTenantGender {
          width: 100%;
          height: 47%;
          border: 1px solid gray;
          // margin-bottom: 10%;
          border-radius: 5px;
          position: relative;

          .mapTitle {
            position: absolute;
            top: 5px;
            left: 10px;
            z-index: 2;
          }
        }

        .occupyBox {
          height: 6%;
          width: 100%;
        }

        .houseTenantNation {
          width: 100%;
          height: 47%;
          border: 1px solid gray;
          border-radius: 5px;
          position: relative;

          .mapTitle {
            position: absolute;
            top: 5px;
            left: 10px;
            z-index: 2;
          }
        }
      }
    }
  }
</style>
