<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">离线记录详情</span>
      <div class="text_r flexItem">

        <el-button type="primary" size="small" @click="returnalarmRecord()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper offlineRecordDetailsBox">
      <el-row :gutter="35" style="height: 100%" class="processingBox" v-model="alarmDetails">
          <div class="stateBox">
          <p>
            <span class="textMagin"><span class="mr20">处理状态 :</span>
              <template v-if="alarmDetails.status==0">待处理</template>
              <template v-if="alarmDetails.status==2">已完成</template>
              <template v-if="alarmDetails.status==3">已忽略</template>
            </span>


            <span class="textMagin"><span class="mr20">设备类型 :</span>
                    <template v-if="alarmDetailsExtend.deviceType=='IDT2'">门禁设备</template>
                    <template v-if="alarmDetailsExtend.deviceType=='IDT4'">报警盘</template>
                    <template v-if="alarmDetailsExtend.deviceType=='IDT5'">烟感设备</template>
                    <template v-if="alarmDetailsExtend.deviceType=='IDT6'">消防栓设备</template>
                    <template v-if="alarmDetailsExtend.deviceType=='IDT7'">井盖设备</template>
            </span>

          </p>
          <p>
              <span class="textMagin"><span class="mr20">报警时间 :</span>{{alarmDetailsExtend.alarmTimeStr}}</span>

              <span class="textMagin"><span class="mr20">设备名称 :</span>{{alarmDetailsExtend.deviceName}}</span>

          </p>
          <p class="mb20">
              <span class="textMagin"><span class="mr20">设备编号 :</span>{{alarmDetailsExtend.machineNumber}}</span>


          </p>
          </div>
          <div class="offlineConfirmBox">
              <h3>处理信息</h3>
              <p><span class="mr35">处理人 :</span> {{alarmDetails.loginName}}</p>
              <p><span class="mr20">处理时间 :</span> {{alarmDetailsExtend.feedbackTime}}</p>
              <p class="mb20"><span class="mr20">处理结果 :</span>{{alarmDetailsExtend.feedbackContent}}</p>
          </div>

      </el-row>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
    export default {

        name: 'offlineRecordDetails',

        data() {
            return {
              alarmDetails:{},
              filter:{},
              total:0,
            }
        },
         mounted(){

             this.alarmDetails=this.$route.params.row,
             this.alarmDetailsExtend=this.alarmDetails.extend
             this.filter = this.$route.params.filter
             this.alarmDetails.loginName=JSON.parse(sessionStorage.getItem("user")).loginName;
        },
        methods:{
            returnalarmRecord(){
                this.$router.push({name: 'offlineAlarmRecord',
                 params: {
                      row:this.alarmDetails,
                      filter:this.filter
                    }
                })
            },
        },

    }
</script>
<style lang="less">
.processingBox{
    border: 1px solid #dedede;
    overflow: auto
}
.offlineRecordDetailsBox{
    div{
        margin-top: 28px;
        .mb20{
            margin-bottom: 20px;
        }
        p{
            margin-left: 40px;
            margin-top: 20px;

        .textMagin{
            display: inline-block;
            width: 400px;
            span{
                color: #b9bbbe
            }
        }
        }
        h3{
            font-size: 16px;
            margin-bottom: 10px;
            text-indent: 40px;

        }
    }
    .stateBox{
        border-bottom: 1px solid #dedede
    }
    .offlineConfirmBox{
        span{
            color: #b9bbbe
        }
    }
    .feedbackBox{
        span{
            color: #b9bbbe
        }
    }
}
  .mr20{
    margin-right: 20px;
  }
  .mr35{
    margin-right: 35px;
  }
</style>
