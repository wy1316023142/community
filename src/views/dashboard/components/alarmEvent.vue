<template>
  <div class="alarmEventBigBox">
    <div class="">
      <div class="alarmEventTop"  v-show="alarmEventTopChartsShow">
        <div class="alarmEventTopText1 " >
          <p class="mt12">发生</p>
          <p class="b7ebfe">{{gaugeTotal1}}</p>
        </div>
        <div class="alarmEventTopCharts " >
          <p>{{organName1}}</p>
          <div class="meterCharts">
            <IEcharts :option="gauge1" ref="gauge1"></IEcharts>
          </div>
        </div>
        <div class="alarmEventTopText2 ">
          <p class="mt12">处置</p>
          <p class="b7ebfe">{{gaugeHandler1}}</p>
        </div>
      </div>
      <div class="alarmEventBottom" v-show="alarmEventBottomShow">
        <div class="alarmEventBottomText1">
          <p class="mt121">发生</p>
          <p class="ffefbe">{{gaugeTotal2}}</p>
        </div>
        <div class="alarmEventBottomCharts">
          <p>{{organName2}}</p>
          <div class="meterCharts">
            <IEcharts :option="gauge2" ref="gauge2"></IEcharts>
          </div>
        </div>
        <div class="alarmEventBottomText2">
          <p class="mt121">处置</p>
          <p class="ffefbe">{{gaugeHandler2}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  /*今日实有警情事件统计*/
  import IEcharts from "vue-echarts-v3/src/full.js";
  import Api from '@/commom/api.js'

  export default {
    name: "alarmEvent",
    components: {IEcharts},
    data() {
      return {
        alarmEventBottomShow: true,
        alarmEventTopChartsShow: true,
        gauge1: {},
        gauge2: {},
        data: [],
        gaugeHandler1: 0,
        gaugeTotal1: 0,
        gaugeHandler2: 0,
        gaugeTotal2: 0,
        organName1: '',
        organName2: '',
      }
    },
    mounted() {
      if (this.$route.query.organId) {
        this._fetchData(this.$route.query.organId)
      }
    },
    methods: {
      _fetchData: function (organId) {
        Api.hlAlarmStatistics.get({}, {
          pathParams: {
            orgId: organId
          }
        }).then(res => {
          if (res.data.result.length == 0) {
            this.alarmEventTopChartsShow = false
            this.alarmEventBottomShow = false
          } else if (res.data.result.length == 1) {
            this.alarmEventTopChartsShow = true
            this.alarmEventBottomShow = false
            this.organName1 = res.data.result[0].organName
            this.gaugeHandler1 = res.data.result[0].handlerAlarmCount
            this.gaugeTotal1 = res.data.result[0].totalAlarmCount
          } else {
            this.alarmEventTopChartsShow = true
            this.alarmEventBottomShow = true
            this.organName1 = res.data.result[0].organName
            this.gaugeHandler1 = res.data.result[0].handlerAlarmCount
            this.gaugeTotal1 = res.data.result[0].totalAlarmCount
            this.organName2 = res.data.result[1].organName
            this.gaugeHandler2 = res.data.result[1].handlerAlarmCount
            this.gaugeTotal2 = res.data.result[1].totalAlarmCount
          }
          this.getGauge()

        })
      },
      getGauge() {
        var num1 = this.gaugeHandler1 / this.gaugeTotal1
        var num2 = this.gaugeHandler2 / this.gaugeTotal2

        if (this.gaugeHandler1 == 0 || this.gaugeTotal1 == 0) {
          num1 = 0
        }
        if (this.gaugeHandler2 == 0 || this.gaugeTotal2 == 0) {
          num2 = 0
        }
        this.gauge1 = {
          // backgroundColor: '#11264f',
          series: [
            {
              name: "白色圈刻度",
              type: "gauge",
              radius: "180%",
              splitNumber: 6,
              center: ["50%", "100%"],
              startAngle: 180, //刻度起始
              endAngle: 0, //刻度结束
              z: 4,
              axisTick: {
                show: false
              },
              splitLine: {

                length: 15, //刻度节点线长度
                lineStyle: {
                  width: 2,
                  color: '#0e1963'
                } //刻度节点线
              },
              axisLabel: {
                show: false,
                color: '#',
                fontSize: 12,
              }, //刻度节点文字颜色
              pointer: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  opacity: 0
                }
              },
              detail: {
                show: false
              },
              data: [{
                value: 0,
                name: ""
              }]
            },
            {
              name: '蓝圈背景', //刻度背景
              type: 'gauge',
              z: 2,
              radius: '180%',
              splitNumber: 6,
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 15,
              center: ["50%", "100%"], //整体的位置设置
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [num1, '#0ab6f9'],//data数据
                    [1, '#0b397f']
                  ],
                  width: 15,
                  opacity: 1, //刻度背景宽度
                }
              },
              splitLine: {
                show: false
              },
              data: [{
                show: true,
                value: '180'
              }],
              axisLabel: {
                show: false,
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: false
              },
              detail: {
                show: 0
              }
            },
            {
              name: '刻度尺', //刻度背景
              type: 'gauge',
              z: 2,
              radius: '120%',
              splitNumber: 3,
              startAngle: 180,
              endAngle: 0,
              // min: 0,
              // max: 15,
              center: ["50%", "100%"], //整体的位置设置
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [0.8, '#07ccbf'],
                    [1, '#102c6e']
                  ],
                  width: 0,
                  opacity: 0, //刻度背景宽度
                }
              },
              data: [{
                show: false,
                value: '80'
              }],
              axisLabel: {
                show: false
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#0a3a7f',
                  width: 1
                },
                length: 7,
                splitNumber: 6,
              },
              detail: {
                show: 0
              },
              splitLine: {
                show: false,
              },
            },
            {
              name: '蓝色刻度尺', //刻度背景
              type: 'gauge',
              z: 4,
              radius: '120%',
              splitNumber: 3,
              startAngle: 180,
              endAngle: 180 - (180 * num1),//data数据
              // min: 0,
              // max: 15,
              center: ["50%", "100%"], //整体的位置设置
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [0.8, '#00B3FE'],
                    [1, '#212D43']
                  ],
                  width: 1,
                  opacity: 0, //刻度背景宽度
                }
              },
              data: [{
                // show: false,
                value: '4'
              }],
              axisLabel: {
                show: false
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#00B3FE',
                  width: 2
                },
                length: 7,
                splitNumber: 26,
              },
              detail: {
                formatter: function (params) {
                  // if (min.length > 1) {
                  //     return '{gray|' + '处置率' + '\n' + '}{white|' + min[0] + "%" + min[1] + "s" + '}'
                  // } else {
                  //     return '{gray|' + '处置率' + '\n' + '}{white|' + min[0] + "%" + '}'
                  // }
                  return '{gray|' + '处置率' + '\n' + '}{white|' + parseInt(num1 * 100) + "%" + '}'

                },
                rich: {
                  gray: {
                    fontSize: 12,
                    color: '#0ab6f9',
                    // padding: 20
                  },
                  white: {
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#0ab6f9'
                  }
                },
                offsetCenter: ['0', '-30%'],
              },
              splitLine: {
                show: false,
              },
            },
          ]
        }
        this.gauge2 = {
          // backgroundColor: '#11264f',
          series: [{
            name: "白色圈刻度",
            type: "gauge",
            radius: "180%",
            splitNumber: 6,
            center: ["50%", "100%"],
            startAngle: 180, //刻度起始
            endAngle: 0, //刻度结束
            z: 4,
            axisTick: {
              show: false
            },
            splitLine: {

              length: 15, //刻度节点线长度
              lineStyle: {
                width: 2,
                color: '#0e1963'
              } //刻度节点线
            },
            axisLabel: {
              show: false,
              color: '#',
              fontSize: 12,
            }, //刻度节点文字颜色
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            },
            data: [{
              value: 0,
              name: ""
            }]
          },
            {
              name: '蓝圈背景', //刻度背景
              type: 'gauge',
              z: 2,
              radius: '180%',
              splitNumber: 6,
              startAngle: 180,
              endAngle: 0,
              min: 0,
              max: 15,
              center: ["50%", "100%"], //整体的位置设置
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [num2, '#fbb326'],
                    [1, '#3d3d52']
                  ],
                  width: 15,
                  opacity: 1, //刻度背景宽度
                }
              },
              splitLine: {
                show: false
              },
              data: [{
                show: true,
                value: '180'
              }],
              axisLabel: {
                show: false,
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: false
              },
              detail: {
                show: 0
              }
            },
            {
              name: '刻度尺', //刻度背景
              type: 'gauge',
              z: 2,
              radius: '120%',
              splitNumber: 3,
              startAngle: 180,
              endAngle: 0,
              // min: 0,
              // max: 15,
              center: ["50%", "100%"], //整体的位置设置
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [0.8, '#fbb326'],
                    [1, '#3d3d52']
                  ],
                  width: 1,
                  opacity: 0, //刻度背景宽度
                }
              },
              data: [{
                show: false,
                value: '80'
              }],
              axisLabel: {
                show: false
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#0a3a7f',
                  width: 2
                },
                length: 7,
                splitNumber: 6,
              },
              detail: {
                show: 0
              },
              splitLine: {
                show: false,
              },
            },
            {
              name: '蓝色刻度尺', //刻度背景
              type: 'gauge',
              z: 4,
              radius: '120%',
              splitNumber: 3,
              startAngle: 180,
              endAngle: 180 - (180 * num2),
              // min: 0,
              // max: 15,
              center: ["50%", "100%"], //整体的位置设置
              axisLine: { // 坐标轴线
                lineStyle: { // 属性lineStyle控制线条样式
                  color: [
                    [0.8, '#00B3FE'],
                    [1, '#212D43']
                  ],
                  width: 1,
                  opacity: 0, //刻度背景宽度
                }
              },
              data: [{
                // show: false,
                value: '4'
              }],
              axisLabel: {
                show: false
              },
              pointer: {
                show: false
              },
              axisTick: {
                show: true,
                lineStyle: {
                  color: '#fbb326',
                  width: 2
                },
                length: 7,
                splitNumber: 6,
              },
              detail: {
                formatter: function (params) {
                  // if (min.length > 1) {
                  //     return '{gray|' + '处置率' + '\n' + '}{white|' + min[0] + "%" + min[1] + "s" + '}'
                  // } else {
                  //     return '{gray|' + '处置率' + '\n' + '}{white|' + min[0] + "%" + '}'
                  // }
                  // return '{gray|' + '处置率' + '\n' + '}{white|' + num2 + "%" + '}'
                  return '{gray|' + '处置率' + '\n' + '}{white|' + parseInt(num2 * 100) + "%" + '}'


                },
                rich: {
                  gray: {
                    fontSize: 12,
                    color: '#fbb326',
                    // padding: 20
                  },
                  white: {
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fbb326'
                  }
                },
                offsetCenter: ['0', '-30%'],
              },
              splitLine: {
                show: false,
              },
            },
          ]
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .alarmEventBigBox {

    box-sizing: border-box;
    padding: 0 18px;
    margin-top: 30px;
    .alarmEventTop {
      display: flex;
      .alarmEventTopText1 {
        width: 114px;
        height: 97px;
        background: url('../../../assets/images/templete/helong/1.png') no-repeat;
        p {
          margin-left: 20px;
          font-family: "TT0246M_";
        }
      }
      .alarmEventTopText2 {
        width: 114px;
        height: 97px;
        background: url('../../../assets/images/templete/helong/2.png') no-repeat;
        p {
          text-align: right;
          margin-right: 20px;
          font-family: "TT0246M_";
        }
      }
      .alarmEventTopCharts {
        flex: 1;
        text-align: center;
        position: relative;
        p {
          font-size: 14px;
          color: #47b1f6
        }
        .meterCharts {
          width: 148px;
          height: 66px;
          position: absolute;
          left: 0;
          bottom:0px;
          transform: translateX(-25%);
        }
      }
    }


    .alarmEventBottom {
      display: flex;
      margin-top: 38px;
      .alarmEventBottomText1 {
        width: 114px;
        height: 97px;
        background: url('../../../assets/images/templete/helong/3.png') no-repeat;
        p {
          margin-left: 20px;
          font-family: "TT0246M_";
        }
      }
      .alarmEventBottomText2 {
        width: 114px;
        height: 97px;
        background: url('../../../assets/images/templete/helong/4.png') no-repeat;
        p {
          text-align: right;
          margin-right: 20px;
          font-family: "TT0246M_";
        }
      }
      .alarmEventBottomCharts {
        flex: 1;
        text-align: center;
        position: relative;
        p {
          font-size: 14px;
          color: #de9f31
        }
        .meterCharts {
          width: 148px;
          height: 66px;
          position: absolute;
          left: 0;
          bottom:0px;
          transform: translateX(-25%);
        }
      }
    }
    .mt12 {
      color: #91cbee;
      margin-top: 12px;
      font-size: 12px;
    }
    .b7ebfe {
      font-size: 24px;
      color: #91cbee;
      margin-top: 8px;
      font-weight: bold;
    }
    .mt121 {
      color: #e9d6b0;
      margin-top: 12px;
      font-size: 12px;
    }
    .ffefbe {
      font-size: 24px;
      color: #e9d6b0;
      margin-top: 8px;
      font-weight: bold;
    }

  }
</style>
