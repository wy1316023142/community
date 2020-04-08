<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">事件记录>事件处理</span>
      <div class="text_r flexItem">
        <el-button type="primary" size="small" @click="returnalarmRecord()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper oneClickAlarmDetailsBox">
      <el-row :gutter="35" style="height: 100%" class="eventContant" v-model="eventDetails">

          <div class="stateBox">
          <p class="mt10">
            <span class="textMagin" v-if="eventDetails.eventStatus == 1"><span>事件状态</span>  : 待处理</span>
            <span class="textMagin" v-if="eventDetails.eventStatus == 2"><span>事件状态</span>  : 已确认</span>
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

          <div class="mb20 bb1">
              <p><span class="textMagin"><span>事件照片:</span></span></p>

              <div class="handleImgBox">
                <div v-for="item in eventDetails.reportImage">
                  <el-popover   trigger="click" width="500">
                    <el-image :src="item" width="500"></el-image>
                    <el-image  slot="reference" :src="item" fit="cover" style="width: 100px;height: 100px;"></el-image>
                  </el-popover>
                </div>
              </div>
          </div>

          <div class="feedbackMsgBox">
                <p>反馈信息 : </p>
                <el-input type="textarea" v-model="filter.feedbackMeg" :rows="5" placeholder="请输入内容"></el-input>
          </div>
          <div class="mb20 imgHandleBigBox">
              <p>处理照片 : </p>
            <div class="disFlex">
              <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="onUploadChange"
              :class="{hide:hideUpload}"
              :limit='4'>
              <i class="el-icon-plus"></i>
            </el-upload>
            </div>
          </div>
           <p slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addPosition" :loading="loading">提 交</el-button>
                <el-button type="warning" @click="clearPosition">取 消</el-button>
            </p>
          </div>
      </el-row>
    </div>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
    export default {
      components: {ElForm},
      name: 'eventDetails',
        data() {
            return {
            //    eventDetails:this.$route.params.row,
               hideUpload: false,
               dialogVisible: false,
               eventDetails:'',
               eventId:'',
               type:'',
               model:'',
               filter:{
                   feedbackMeg:''
               },
                eventImg:[],
            }
        },
        mounted(){
          this.eventId = this.$route.params.eventId;
          this.type = this.$route.params.type;
          this._fetchData();
        },
        methods:{
          handleRemove(file, fileList) {
            this.eventImg=[]
            for (let i = 0; i < fileList.length; i++) {
             this.eventImg.push(fileList[i].name)
            }
            },
          onUploadChange(file,fileList){
               var reader = new FileReader();
              reader.readAsDataURL(file.raw);
              reader.onload = (e)=>{
                  var imgcode = e.target.result;
                  var pos = imgcode.indexOf(",",0);
                  var substr2 = imgcode.substr(pos+1);
                  file.name=substr2
                  this.eventImg.push(substr2)
              }
            },
          handlePictureCardPreview(file) {
          },
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
          addPosition(){
              this.submitData()
          },
          clearPosition(){
            this.returnalarmRecord();
          },

          async submitData(){
            if(this.filter.feedbackMeg.length <1){
                this.$message({message: '请填写反馈信息', type: 'error'})
                return;
              }

                //需要发送给后台的图片数组this.imageUrl
                this.eventDetails.handleImage = this.eventImg;
                this.eventDetails.handleDescribe = this.filter.feedbackMeg;
                this.eventDetails.handleUserId = JSON.parse(sessionStorage.getItem('user')).id;
                this.eventDetails.handleUserName = JSON.parse(sessionStorage.getItem('user')).name;
                this.model = cloneDeep(this.eventDetails);
                this.model.reportTime='';
                this.model.handleTime = '';
                this.model.eventStatus = 2;
                await Api.handleEvent.put(this.model, {
                  pathParams: {
                    id: this.eventDetails.id
                  }
                }).then(() => {
                  this.$message({message: '处理完成', type: 'success'})
                  this.returnalarmRecord();
                }).catch(err => {
                  this.eventImg=''
                })
            },
        },

    }
</script>
<style lang="less">
.eventContant{
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
          margin-bottom: 10px;

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
        border-bottom: 1px solid #dedede;
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
.imgHandleBigBox{
    margin-top: 20px!important;
    display: flex;
    p{
        color: #b9bbbe
    }
    .imgHandleBox{
        display: flex;
        width: 150px;
        height: 150px;
        position: relative;
        margin-right: 10px;
        border: 1px solid #dedede;
        margin-left: 5px;
        background-size:90px;
        div{
            margin-left: 2px;
        }
      input:after,input:before{
        content: " ";
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        background-color: #000;
        z-index: ;
      }
      input:before {
        width: 2px;
        height: 50px;
      }
      input:after {
        width: 50px;
        height: 2px;
      }


    }
}

  .oneClickAlarmDetailsBox div{
      margin-top: 0;
  }
  .feedbackMsgBox{
      display: flex;
      p{
           color: #8c939d;
      }
      .el-textarea{
          width: 50%;
          margin-left: 5px;
      }
  }
  .eventImgBox{
      margin-left: 39px;
      margin-top: 10px!important;
      .eventImg{
          width: 150px;
          height: 150px;
      }
  }
  #preview1 {
        display: inline-block;
        width: 150px;
        height: 150px;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        // background: #dedede;

      }
        #file {
          width: 100%;
          height: 100%;
          opacity: 0;
          position: absolute;
          left: 0;
          top: 0;
          cursor: pointer;
          z-index: 5;
  }
  .disFlex{
      display: flex;
      width: 650px;
      overflow: hidden;
      height: 160px;
      margin-left: 4px;
  }
  .cancelBtn{
      position: absolute;
      top: 5px;
      right: 5px;
      color: white;
      text-align: center;
      line-height: 16px;
      width: 16px;height: 16px;
      border-radius: 50%;
      background: red;
      z-index: 10;
  }
  .bb1{
      border-bottom: 1px solid #dedede;
      padding-bottom: 10px;
    .handleImgBox{
      width: 100%;
      margin-top: 10px;
      display: flex;
      margin-left: 39px;
     div{
        display: inline-block;
        margin-right: 15px;
      }
    }
  }
.el-icon-zoom-in{
  display: none
}
.mt10{
  margin-top: 10px;
}
</style>
