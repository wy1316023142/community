<template>
    <div class="carPerceptionBox">
        <div class="carPerceptionTitle">
            <p>
                <img src="../../assets/image/helong/3bb.png" alt="">
            </p>
            <p class="mlr">
                开门记录
            </p>
            <p>
                <span>{{totalNum}}</span>
            </p>
        </div>
        <div class="carPerceptionImg boxWrapper">
            <div class="noMesBox" v-show="noMesBoxShow">暂无数据</div>
            <div class="slideBox hornBox" :style="{marginLeft:ml150}">
                <div v-for="item in data">
                    <p class="carImgBox">
                        <span class="identification">{{item.personType==5?'重点人员':''}}</span>
                        <img :src="item.environmentImageUrl" alt="">
                    </p>
                    <p>{{item.personName}}</p>
                    <p>{{item.deviceName}}</p>
                    <p>{{item.captureTime}}</p>
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
  import moment from 'moment'    
    export default {
          name: "openDoorRecord", 
          data(){
              return{
                totalNum:0,            
                ml150:'',
                data:[],
                noMesBoxShow:false,
                dataShow:true,
                numAdd:0,
                filter:{
                    organId: 1,
                    page: 1,
                    rows: 4,
                }
              }
          },
          mounted(){
              if(getUrlParame('organId')){
                  let organId= getUrlParame('organId')
                  this.initWebSocket(organId)
                  this._fetchData(organId)
              }
          },
          methods:{
            carousel(){  
                this.numAdd++
                var num=-148
                this.ml150=this.numAdd*num +'px'
            },
            initWebSocket(organId){
                this.socketError=false;
                // this.socket = new SockJS('http://25.30.9.9:15674/stomp');
                this.socket = new SockJS('http://222.211.78.60:15674/stomp');                
                const client = Stomp.over(this.socket);
                client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
                client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
                const on_connect = ()=> {
                    client.subscribe(`/exchange/TopicExchangeFontAYIC/topic.open.door.front.record.#.${organId}.#`, (frame)=> {
                        let frames = JSON.parse(frame.body);
                        if(frames.type==1){
                        this.noMesBoxShow=false
                        this.dataShow=true
                            let data=JSON.parse(frames.data)
                             let time=data.captureTime                      
                            var str=moment(time).format('YYYY-MM-DD HH:mm:ss')
                            var num1=str.indexOf(' ')
                            data.captureTime=str.substring(num1)
                            this.data.unshift(data)
                                this.totalNum++;
                            if (this.data.length >= 7) {
                                this.data.pop();
                            }
                        }
                    });
                };
                const on_error = ()=> {

                };
                // client.connect('guest','guest', on_connect, on_error, '/');
                client.connect('Scty-admin','mq@)!*2019@Scty', on_connect, on_error, '/');                
            },
            _fetchData :  function(organId) {
                Api.hiOpenDoorNumber.get({
                    pageSize:6                    
                },
                {
                     pathParams: {
                        orgId: organId,
                    }
                }
                ).then(res => {
                    this.dataLength=res.data.result.openDoorList.length
                    if(this.dataLength==0){
                        this.noMesBoxShow=true
                        this.dataShow=false
                    }else{
                        this.noMesBoxShow=false
                        this.dataShow=true
                    }
                    this.data=res.data.result.openDoorList
                    this.totalNum=res.data.result.totaleNum
                    for (let i = 0; i <  this.data.length; i++) {
                    var str=this.data[i].captureTime
                    var num1=str.indexOf(' ')
                    this.data[i].captureTime=this.data[i].captureTime.substring(num1)
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
.carPerceptionBox{
    margin-left: 10px;
    .carPerceptionTitle{
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
    .carPerceptionImg{
        width: 592px;
        height: 184px;
        font-size: 14px;
        border: 1px solid #112a6a; 
        overflow: hidden;  
        position: relative;
        .slideBox{
            transition:all 0.5s linear 0s;
            display: flex;
            height: 100%;
            div{
                width: 70px;
                margin-left: 8px;
                margin-right: 20px;
                font-size: 12px;
                .carImgBox{
                    width: 70px;
                    height: 100px;
                    position: relative;
                    .identification{
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        background: red;
                        color: #fff;
                        font-size: 12px;
                    }
                }
            }
        }             
        p{
            margin-left: 7px;
            margin-top: 6px;
            color: #61b4e9;  
            width: 70px;
            white-space: nowrap;
            overflow: hidden;          
            img{
                width: 70px;
                height: 100px;
                display: block;
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
}
</style>