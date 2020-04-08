<template>
    <div class="faceSnapBox">
        <div class="faceSnapTitle">
            <p>
                <img src="../../assets/image/helong/4bb.png" alt="">
            </p>
            <p class="mlr">
                人脸抓拍
            </p>
            <p>
                <span>{{totalNum}}</span>
            </p>
        </div>
        <div class="faceSnapImg boxWrapper">
            <div class="noMesBox" v-show="noMesBoxShow">暂无数据</div>            
            <div class="hornBox">
              <!-- <div class="faceSnapImgBox borderB" :style="{marginLeft:ml150}" v-show="dataShow">
                  <p v-for="item in tableData1" class="ml10">
                      <img :src="item.captureImgName" alt="">
                  </p>
              </div>
               <div class="faceSnapImgBox" :style="{marginLeft:ml150}" v-show="dataShow">
                  <p v-for="item in tableData2" class="ml10">
                      <img :src="item.captureImgName" alt="">
                  </p>
              </div> -->
              <div v-for="item in data" class="faceSnapImgShow">
                  <img :src="item.captureImgName" alt="">
              </div>
            </div>
        </div>
        
    </div>
</template>

<script>
  import Api from '@/common/api.js'
  import { getUrlParame } from '@/common/util.js'
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'
    export default {
          name: "faceSnap", 
          data(){
              return{
                dataLength:'',
                tableData1:[],
                tableData2:[],
                ml150:'',
                num:0,
                data:[],
                noMesBoxShow:false,
                dataShow:true,
                totalNum:0,
                visitorNum:0
              }
          },
          mounted(){
              if(getUrlParame('organId')){
                  let organId= getUrlParame('organId')
                //   this.initWebSocket(organId)
                  this._fetchData(organId)
                  this.timer(organId)
              }
          },
          methods:{

            // initWebSocket(organId){
            //     this.socketError=false;
            //     // this.socket = new SockJS('http://25.30.9.145:15674/stomp');
            //     this.socket = new SockJS('http://222.211.78.60:15674/stomp');                                
            //     const client = Stomp.over(this.socket);
            //     client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
            //     client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
            //     const on_connect = ()=> {
            //         client.subscribe(`/exchange/TopicExchangeFontAYIC/topic.open.door.front.record.#.${organId}.#`, (frame)=> {
            //             let frames = JSON.parse(frame.body);
            //             if(frames.type==1){
            //             this.noMesBoxShow=false
            //             this.dataShow=true
            //                 let data=JSON.parse(frames.data)
            //                 this.data.unshift(data)
                          
            //                     this.totalNum++;
            //                 if (this.data.length >= 7) {
            //                     this.data.pop();
            //                 }
            //             }
            //         });
            //     };
            //     const on_error = ()=> {

            //     };
            //     // client.connect('guest','guest', on_connect, on_error, '/');
            //     client.connect('Scty-admin','mq@)!*2019@Scty', on_connect, on_error, '/');                                
            // },
            timer(organId){
                return setInterval(()=>{
                    this._fetchData(organId)
                },5000)
            },
            _fetchData :  function(organId) {
                Api.hlFaceRecordNum.get({
                    pageSize:6
                }, {
                    pathParams: {
                        orgId: organId
                    }
                }).then(res => {
                    this.data=res.data.result.recordLst
                    this.totalNum=res.data.result.totalNum
                    this.dataLength=res.data.result.recordLst.length
                    if(this.dataLength==0){
                        this.noMesBoxShow=true
                        this.dataShow=false
                    }else{
                        this.noMesBoxShow=false
                        this.dataShow=true
                    }
                })
            },
            handleMessage : function (event) {
                if(event.data.organId){
                    this._fetchData(event.data.organId)
                    this.initWebSocket(event.data.organId)
                }
            }
          }
        
    }
</script>

<style lang="less" scoped>
.faceSnapBox{
    margin-left: 10px;
    .faceSnapTitle{
        display: flex;
        font-size: 18px;
        margin-bottom: 10px;
        margin-top: 10px;
        p{
            color: #61b4e9;
            height: 30px;
            line-height: 30px;
        }
    }
    .faceSnapImg{
        width: 273px;
        height: 185px;
        font-size: 14px;
        border: 1px solid #112a6a; 
        overflow: hidden;  
        position: relative;
        // .slideBox{
        //     transition:all 0.5s linear 0s;
        //     display: flex;
        //     height: 100%;
        // } 
        .faceSnapImgBox{
            transition:all 0.5s linear 0s;
            display: flex;
            height: 46%;
            margin-top: 10px;
            padding-bottom: 6px;
            p{
                width: 83px;
                height: 72px;
                img{
                    width: 83px;
                    height: 72px;
                }
            }
        }                     
    }
     span{
        color: #feb226;
        font-weight: bold;        
    }
    .mlr{
        margin-left: 6px;
        margin-right: 12px;
    }
    .ml10{
        margin-left: 6px;
    }
    .borderB{
        border-bottom: 1px solid #112a6a
    }
}
.hornBox{
    display: flex;
    flex-wrap: wrap;
    .faceSnapImgShow{
        margin-top: 13px;
        margin-left: 6px;
    }
    img{
        width: 83px;
        height: 72px;
    }
}

</style>