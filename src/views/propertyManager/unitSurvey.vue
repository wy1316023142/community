<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">单位概况</p>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19" style="height: 100%">

                <el-row :gutter="20" style="height: 100%" class="unitSurveyBBox">
                    <el-col :span="14" style="height: 100%">
                        <div class="unitSurveyContent">
                            <p class="unitSurveyTitle">
                                辖区单位概况
                            <span class="onBorder"></span>
                            </p>
                            <div class="unitSurveyNum">
                            <el-col :span="12" class="back2F">
                                <div>
                                    <p>单位总数</p>
                                    <p>{{companySurveyData.companyCount}}</p>
                                </div>
                                <div>
                                    <img src="../../assets/images/house/1.png" alt="">
                                </div>
                            </el-col>
                            <el-col :span="12" class="back567">
                                <div>
                                    <p>从业人员</p>
                                    <p>{{companySurveyData.practitionersCount}}</p>
                                </div>
                                <div>
                                    <img src="../../assets/images/house/2.png" alt="">
                                </div>
                            </el-col>
                            </div>
                        </div>
                        <div class="unitDistribution">
                            <p>
                                辖区单位分布分析
                                <span class=""></span>
                            </p>
                            <div class="sexPie">
                                <IEcharts :option="sexPie" ref="sexPie"></IEcharts>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                        <div class="unitSurveyR">
                            <p>
                                辖区单位类型统计
                                <span></span>
                            </p>
                            <div class="shadow">
                                <IEcharts :option="shadow" ref="shadow"></IEcharts>
                            </div>
                        </div>
                    </el-col>
                </el-row>

        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import IEcharts from 'vue-echarts-v3/src/full.js'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace,validatePhone } from '../../commom/validator'
  export default {
    name: 'unitSurvey',
    components: {OrganTree,IEcharts},
    data() {
      return {
        companySurveyData:{},
        tabHeight: '0',
        tableData: [],
        model: {},
        path:'',
        filter: {
          organId: 1,
          customResourceId: null,
          layerResourceTypeId: null,
          name: null,
          page: 1,
          rows: 10,
        },
        sexPie: {
          color: ['#567acd', '#94abe0','#c1c5e1'],
          tooltip: {
            trigger: 'item',
            formatter: " {b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: '65%',
            y: 'center',
            // data: ['皇冠社区', '艺锦苑','天悦国际']
          },
          series: [
            {
            //   name: '小区',
              type: 'pie',
              radius: ['0%', '80%'],
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
                // {value: 1, name: '皇冠社区'},
                // {value: 2, name: '艺锦苑'},
                // {value: 3, name: '天悦国际'},
              ]
            }
          ]
        },
        shadow:{
            // color:['#5678CD'],
             tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                  formatter: "{b0}: {c0}"
            },
            grid: {
                top:'5%',
                left: '1%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                show: false,                //是否显示x轴
                type: 'value'
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                data: []
            },
            series: [
                  {
                    name:'数据内框',
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        normal: {
                            color: '#7995d7',
                        }
                    },
                        barWidth: 10,
                  },
                  {
                    name: '外框',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: 'rgba(233, 239, 250,0.4)' //rgba设置透明度0.14
                        }
                    },
                    barGap: '-100%',
                    z: 0,
                    barWidth: 10,
                    data: []
                  }

            ]
        },
        loading: false,
      }
    },

    mounted() {

        this.$nextTick(() => {
            // this.tabHeight=this.$refs.content.offsetHeight-56
            this.$refs.shadow.resize();
            this.$refs.sexPie.resize();
            window.onresize =()=> {
            //   this.tabHeight=this.$refs.content.offsetHeight-56
            this.$refs.shadow.resize();
            this.$refs.sexPie.resize();
            };
          })
        this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
        this.path = JSON.parse(sessionStorage.getItem('user')).organPath;
        this._getCompanyClassify()
        this._getCompanyDistribution()
        this._getCompanySurvey()
    },
    methods: {
    getClassifyData(data){
            var classifyName=[]
            var classifyNum=[]
            for (let i = 0; i < data.length; i++) {
              classifyName.push(data[i].companyTypeName)
              classifyNum.push(data[i].companyCount)
            }
            var max=classifyNum[0]
            var maxData=[]
            for(let i = 1; i < classifyNum.length; i++){
                if( max < classifyNum[i] ){
                    max = classifyNum[i];
                }
            }
            for (let j = 0; j < classifyNum.length; j++) {
                maxData[j]=max+5
            }

           this.shadow.yAxis.data=classifyName
           this.shadow.series[0].data=classifyNum
           this.shadow.series[1].data=maxData
      },
    getDistributionData(data){

        var obj=[]
        for (let i = 0; i < data.length; i++) {
            var arr={}
            arr.value=data[i].companyCount
            arr.name=data[i].organName
            obj.push(arr)
        }

        this.sexPie.series[0].data=obj
      },
        // 辖区单位分类统计
    _getCompanyClassify:debounce(async function(){
          const data = await Api.companyClassify.get({
            path: this.path
          }).then(res=>res.data)
          this.getClassifyData(data.rows)
      },100),
      // 辖区单位分布情况
    _getCompanyDistribution:debounce(async function(){
          const data = await Api.companyDistribution.get({
            path: this.path
          }).then(res=>res.data)
          this.getDistributionData(data.rows)
      },100),
       // 辖区单位概况
    _getCompanySurvey:debounce(async function(){
          const data = await Api.companySurvey.get({
            path: this.path
          }).then(res=>res.data)
          this.companySurveyData=data.result
      },100),
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
          console.log(item.path);

        //   if(item.organType==2){
            //   var substr= item.path.substr(1)
            //   this.path=substr
            //   this.path='1/2/3/4/6/8/2323'
              this.path=item.path
              this.filter.organId = item.id || ''
              this._getCompanyClassify()
              this._getCompanyDistribution()
              this._getCompanySurvey()
        //   }
      },
    }
  };
</script>
<style lang="less">
.unitSurveyBBox{
    border: 1px solid #ededed;
    border-radius: 4px;
    // background: rgba(193, 197, 225,0.4)
}
.unitSurveyContent{
   width: 100%;
   height: 33%;
   .unitSurveyTitle{
       width: 100%;
       height: 30%;
       padding-top: 2%;
       font-weight: bold;
       border-bottom: 1px solid #ededed;
       position: relative;
       .onBorder{
           width: 97px;
           height: 2px;
           background: #2f59c2;
           position: absolute;
           bottom: 0%;
           left: 0;
       }
   }
   .unitSurveyNum{
       width: 100%;
       .el-col{
       height: 75%!important;
       margin-top: 2%;
           width: 48.5%;
           height: 70%;
           padding-top: 2%;
           color: #fff;
           display: flex;
           justify-content: space-between;
           border-radius: 4px;
           p{
               margin-top: 10px;
           }
       }
       .back2F{
           background: #2f59c0;
           margin-right: 3%;
       }
       .back567{
           background: #567acd
       }
   }
}
.unitDistribution{
    width: 100%;
   height: 62%;
   margin-top: 4%;
   p{
        border-bottom: 1px solid #ededed;
        position: relative;
        width: 100%;
        height: 20%;
        padding-top: 2%;
        font-weight: bold;
        span{
           width: 127px;
           height: 2px;
           background: #2f59c2;
           position: absolute;
           bottom: 0%;
           left: 0;
        }
   }
   .sexPie{
       width: 100%;
       height: 80%;
   }
}
.unitSurveyR{
    width: 100%;
    height: 100%;
    p{
        border-bottom: 1px solid #ededed;
        position: relative;
        width: 100%;
        height: 10%;
        padding-top: 2%;
        font-weight: bold;
        span{
           width: 127px;
           height: 2px;
           background: #2f59c2;
           position: absolute;
           bottom: 0%;
           left: 0;
        }
    }
    .shadow{
        height: 89%;
        width: 100%;
    }
}
</style>
