<template>
<div class="zhsq-main">
   <div class="zhsq-boxWrapper">
    <div class="zhsq-right-con wisdomSeachBox" ref="content" >

      <div class="wisdomSeachT">
          <p class="wisdomSeachTImg">
              <img src="../../assets/images/sqd.png" alt="">
          </p>

            <div style="margin-top: 15px;" class="wisdomSeachInputBox">
            <!-- <el-input @click.native="onPickFile" >
                <i slot="suffix" class="el-input__icon el-icon-menu"></i>
                <template slot="append">
                     <el-button  type="primary"  @click="seach()" icon="el-icon-search"></el-button>
                <div class="seachImgBox" @click="onPickFile">
                    <img :src="imgStr" alt="">
                </div>
                </template>
            </el-input> -->
                <input type="text" class="wisdomSeachInput" @click="onPickFile">
                <el-button  type="primary"  @click="seach()" icon="el-icon-search"></el-button>
                <div class="seachImgBox" @click="onPickFile">
                    <img :src="imgStr" alt="">
                </div>
                <input ref='avatarInput' type="file" accept="image/*" @change="handleUpload($event)" v-show="false"/>
            <!-- <el-button  type="primary" size="mini" @click="seach()" icon="el-icon-search"></el-button> -->
            </div>
            <p class="textP">提示:图片不要超过2MB哦</p>

      </div>
    </div>

  </div>
</div>
</template>
<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import { validateIdCard ,validatePhone } from '../../commom/validator';
import moment from 'moment';
import { getBase64, convert2JPEG } from "../../commom/util.js";
import bus from '@/commom/bus.js'

// import Socket from '@/common/socket.js'
// import { scoketBus } from '@/common/bus.js'

export default {
  name: "wisdomSeach",

  data() {
    return{
      imgStr:'',
      model:{},
      organPath:'',
      num:0
    }
  },
  mounted() {
      this.organPath = JSON.parse(sessionStorage.getItem('user')).organPath;
      this.organPath = this.organPath.replace(new RegExp('/', 'g'), ".")
      this.initWebSocket()
  },

  methods:{
       initWebSocket() {

        /*this.socket = new SockJS(JSON.parse(sessionStorage.getItem("systemConfig")).mqHost+':'+JSON.parse(sessionStorage.getItem("systemConfig")).mqPort);*/
        var urlMQ = JSON.parse(sessionStorage.getItem("systemConfig")).mqHost
        this.socket = new SockJS(`http://${urlMQ}:15674/stomp`);
        const client = Stomp.over(this.socket);
        client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
        client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
        //client.debug = function(str) {};
        const on_connect = () => {
          client.subscribe(`/exchange/FanoutExchangeFeatureSearch`, (frame) => {
            const data = JSON.parse(frame.body)
            if(data){
              if(this.num==1){
                this.getListData(data)
               client.disconnect();
              }
            }

          });
        };
        const on_error = () => {
          // this.socketError=true;
          client.connect(process.env.VUE_APP_WEBSOCKET_MQ_USER, process.env.VUE_APP_WEBSOCKET_MQ_PASS, on_connect, on_error, '/');
        };
        client.connect(JSON.parse(sessionStorage.getItem("systemConfig")).mqUsername, JSON.parse(sessionStorage.getItem("systemConfig")).mqPassword, on_connect, on_error, '/');
        // client.connect('guest', 'guest', on_connect, on_error, '/');
      },
    onPickFile() {
     this.$refs.avatarInput.dispatchEvent(new MouseEvent("click"));
    },
    handleUpload(e){
      const files = e.target.files;
       getBase64(files[0]).then(res => {
        this.imgStr=res
        this.model.imagesBase64=res.substring(23)
        this.model.taskId=12
       })

    },
   async seach(){
     this.num=1
      const data = await Api.wisdomSeachFeatures.post(this.model).then(res=>{
        this.initWebSocket()
      })
   },
   async getListData(data1){
      const data = await Api.wisdomSeachList.post({
        feature:data1.feature,
        confidence:'50',
      }).then(res=>{
        for (let i = 0; i < res.data.result.rows.length; i++) {
          res.data.result.rows[i].imgStr=this.imgStr
        }
        this.$router.push({
          name: 'wisdomSeach',
          params: {
            res: res.data.result.rows,
          }})
      })
   },

  },

  }

</script>
<style lang="less" >
.wisdomSeachBox{
    position: relative;
    .wisdomSeachT{
      padding: 12% 0 10px 20px;
      position: absolute;
      left: 50%;
      margin-left: -192px;
      .wisdomSeachTImg{
        text-align: center;
      }
      .seachImgBox{
        position: absolute;
        // border: 1px solid #ededed;
        // background: #ccc;
        width: 40px;
        height: 40px;
        top: 3px;
        left: 3px;
        img{
          width: 40px;
          height: 34px;
        }
      }
      .wisdomSeachInputBox{
        position: relative;
        margin: 0 auto;
      .wisdomSeachInput{
        height: 41px;
        width: 300px;
        border: 1px solid #ccc;
        border-right: none;
        border-radius: 5px;
      }
      }
    }
    .el-input-group{
        width: 44%!important;
    }
    .color2F58C1{
      color: #2F58C1;
      margin-bottom: 5px;
    }
    .textP{
        font-size: 12px;
        margin-top: 20px;
    }
}
</style>
