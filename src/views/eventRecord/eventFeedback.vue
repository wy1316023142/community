<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">事件记录>事件结果反馈</span>
      <div class="text_r flexItem">

        <el-button type="primary" size="small" @click="returnalarmRecord()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper oneClickAlarmDetailsBox">
      <el-row :gutter="35" style="height: 100%" class="stateBigBox">
          <div class="stateBox">
            <p class="mt10">
              <span class="textMagin"><span>事件状态</span>  : 已确认</span>
              <span class="textMagin"><span>事件号</span>  : {{eventDetails.recordNumber}}</span>
            </p>
            <p>
              <span class="textMagin"><span>报警时间</span>  : {{eventDetails.reportTime}}</span>
              <span class="textMagin"><span>上报人</span> : {{eventDetails.reportUserName}}</span>
            </p>
            <p>
              <span class="textMagin"><span>上报人电话</span> : {{eventDetails.reportUserTel}}</span>
              <span class="textMagin"><span>上报小区</span> : {{eventDetails.organName}}</span>
            </p>
            <p>
              <span class="textMagin"><span>事件类型</span> : {{eventDetails.eventTypeStr}}</span>
            </p>
            <p>
              <span class="textMagin"><span>事件描述</span> : {{eventDetails.eventContent}}</span>
            </p>
          <div class="mb20">
              <p><span>事件照片</span>  : </p>
              <div class="handleImgBox">
                <div class="ml20m"></div>
                <div v-for="item in eventDetails.reportImage">
                  <img :src="item" alt="">
                </div>
              </div>
          </div>
          <p>
            <span class="textMagin"><span>反馈人</span> : {{eventDetails.handleUserName}}</span>

              <span class="textMagin"><span>反馈时间</span> : {{eventDetails.handleTime}}</span>
          </p>
         <div class="feedbackMsgBoxo">
                <p><span>处理结果</span> : </p>
                <el-input type="textarea" v-model="eventDetails.handleDescribe" :rows="5" readonly="true"></el-input>
          </div>
          <div class="mb20">
              <p><span>处理照片</span> : </p>
              <div class="handleImgBox">
                <div class="ml20m"></div>
                <div v-for="item in eventDetails.handleImage">
                    <img :src="item" alt="">
                </div>
              </div>
          </div>
          </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
    export default {

        name: 'alarmDetails',

        data() {
            return {
            //    tableData:this.$route.params.row,
              eventId:'',
              type:'',
              eventDetails:'',
                filter:{
                   feedbackMeg:''
               }
            }
        },
        mounted(){
          this.eventId = this.$route.params.eventId;
          this.type = this.$route.params.type;
          this._fetchData();
        },
        methods:{
            _fetchData: debounce(async function() {
              const data = await Api.getEvent.get('', {
                pathParams: {
                  id: this.eventId
                }
              }).then(res => res.data)
              this.eventDetails = data.result
            }, 100),
            returnalarmRecord(){
              if(this.type == 1){
                this.$router.push({name: 'indexWork'})
              }else this.$router.push({name: 'eventRecord'})
            },
          
        },
      

    }
</script>
<style lang="less">
.stateBigBox{
    border: 1px solid #dedede;
    overflow: auto
}
.oneClickAlarmDetailsBox{
    div{
        margin-top: 20px;
        .mb20{
          p{
            span{
              color: #b9bbbe
            }
          }
            margin-bottom: 20px;
        }
        p{
            margin-left: 40px;
            margin-top: 5px;

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
.handleImgBox{
  display: flex;
  .ml20m{
    margin-left: 20px;
  }
  img{
    margin-left: 20px;
    width: 100px;
    height: 100px;
  }
}
.feedbackMsgBoxo{
  p{
    span{
      color: #b9bbbe;
    }
   }
   .el-textarea__inner {
     margin-left: 40px;
   }
}
.mt10{
  margin-top: 10px;
}
</style>
