<template>
    <div class="entryExitBox">
        <IEcharts :option="inOutLine"></IEcharts>         
    </div>
</template>

<script>
  import IEcharts from "vue-echarts-v3/src/full.js";
  import { getUrlParame } from '@/common/util.js'  
  import Api from '@/common/api.js'
  import { getParentParame } from '../zhsq/mixins.js'  

    export default {
        mixins: [ getParentParame ],
        name: "entryExit",
        components:{IEcharts},
         data() {
             return{
                  inOutLine: {
                    color: ['rgba(2, 190, 248,0.8)', 'rgba(234, 168, 87,0.8)','rgba(240, 82, 92,0.8)'],
                    legend: {
                        data: ['通行人次', '通行车次','通行非机动车车次'],
                        show:true,
                        x:'center',
                        top:'5%',
                        y:'35',
                        icon: 'stack',
                        itemWidth:20,
                        itemHeight:10,
                        textStyle:{
                            color:'#72a5cd'
                        },
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
                    top: '20%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                    },
                    yAxis: [
                    {
                        type: 'value',
                        axisLabel:{
                            color: '#72a5cd'
                        },
                    }
                    ],
                    xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                          axisLabel:{
                            color: '#72a5cd'
                        },
                        // data: ['1点','2点','3点','4点','5点','6点','7点','8点','9点','10点','11点','12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点','24点']
                        data:[]
                    }
                    ],
                    series: [
                    {
                        name: '通行人次',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: '通行车次',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: '通行非机动车车次',
                        type: 'line',
                        stack: '总量',
                        smooth: true,
                        areaStyle: {},
                        data: []
                    }
                    ]
                },
                filter:{
                    type:1
                }
             }
         },
         mounted(){
                 if(getUrlParame('organId')){
                  let organId= getUrlParame('organId')
                  this._fetchData(organId)
              }
         },
         methods:{
              _fetchData :  function(organId) {
                Api.hlThrough.get(this.filter, {
                    pathParams: {
                        organId : organId
                    }
                }).then(res => {
                     this.inOutLine.xAxis[0].data=[]
                    this.data=res.data.result
                    for (let i = 0; i < this.data.length; i++) {
                        this.inOutLine.series[0].data.push(this.data[i].popCount)
                        this.inOutLine.series[1].data.push(this.data[i].vehicleCount)
                        this.inOutLine.series[2].data.push(this.data[i].nonMotorCount)
                        this.inOutLine.xAxis[0].data.push(this.data[i].title)
                    }
                })
            },
         }
    }
</script>

<style lang="less" scoped>
.entryExitBox{
    position: relative;
    font-size: 12px;
    color: #6a98c5;
    width: 324px;
    height: 292px;
    .entryExitBtn{
        position: absolute;
        display: flex;
        left: 100px;
        top: 18px;
        border: 1px solid #6a98c5;
        p{
            width: 65px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            z-index: 5;
        }
    }
}
</style>