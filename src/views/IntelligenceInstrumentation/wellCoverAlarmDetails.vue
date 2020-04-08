<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">井盖报警详情</span>
      <div class="text_r flexItem">

        <el-button type="primary" size="small" @click="returnalarmRecord()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper oneClickAlarmDetailsBox">
      <el-row :gutter="35" style="height: 100%" class="processingBox" >
          <div class="stateBox">
            <p>
            <span class="textMagin"><span class="mr20">处理状态 :</span>
              <span v-if="alarmDetails.status==0">待处理</span>
              <span v-if="alarmDetails.status==1">待反馈</span>
              <span v-if="alarmDetails.status==2">已完成</span>
            </span>

              <span class="textMagin"><span class="mr20">报警内容 :</span> {{alarmDetails.extend.content}}</span>

            </p>
            <p>
              <span class="textMagin"><span class="mr20">报警时间 :</span> {{alarmDetails.extend.alarmTimeStr}}</span>

              <span class="textMagin"><span class="mr20">设备名称 :</span> {{alarmDetails.extend.deviceName}}</span>

            </p>
            <p class="mb20">
              <span class="textMagin"><span class="mr20">设备编号 :</span> {{alarmDetails.extend.machineNumber}}</span>

              <span class="textMagin"><span class="mr20">安装地址 :</span> {{alarmDetails.extend.address}}</span>

            </p>
          </div>
          <!--<div class="confirmBox">
              <h3>确认信息</h3>
              <p><span>确认人</span>  : 张三</p>
              <p class="mb20"><span>确认时间</span> : 2019/08/12</p>
          </div>-->
          <div class="feedbackBox">
              <h3>处理信息</h3>
              <p><span class="mr35">处理人 :</span> {{alarmDetails.extend.feedbackPerson}}</p>
              <p><span class="mr20">处理时间 :</span> {{alarmDetails.extend.feedbackTime}}</p>
              <p class="mb20"><span class="mr20">处理结果 :</span> {{alarmDetails.extend.feedbackContent}}</p>
          </div>

      </el-row>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
    export default {
        data() {
            return {
              alarmDetails:[],
              tableData:[],
              total:0,
               filter: {
                organId: 1,
                deviceName:'',
                alarmState:'',
                machineNumber:'',
                deviceType:'IDT7',
                content:'',
                feedbackMeg:'',
                page:1,
                rows:10,
                startTime:moment().subtract(1, "days").format('YYYY-MM-DD HH:mm:ss'),
                endTime:moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                xj:1
                },
            }
        },
        mounted(){
          this.alarmDetails = this.$route.params.details;
          this.tableData = this.$route.params.tableData;
          this.total = this.$route.params.total;
          this.filter = this.$route.params.filter;
        },
        methods:{
            returnalarmRecord(){
                this.$router.push({
                    name: 'wellCoverAlarm',
                    params: {
                      tableData: this.tableData,
                      total: this.total,
                      filter: this.filter,
                      organId:this.alarmDetails.organId
                    }
                    })
            }
        }
    }
</script>
<style lang="less">
.processingBox{
    border: 1px solid #dedede;
    overflow: auto
}
.oneClickAlarmDetailsBox{
    div{
        margin-top: 20px;
        .mb20{
            margin-bottom: 20px;
        }
        p{
            margin-left: 40px;
            margin-top: 15px;

        .textMagin{
            display: inline-block;
            width: 400px;
            span{
                width: 50%;
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
    .confirmBox{
        border-bottom: 1px solid #dedede;
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
