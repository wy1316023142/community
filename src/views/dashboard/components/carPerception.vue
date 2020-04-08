<template>
    <div class="carPerceptionBox">
        <div class="carPerceptionTitle">
            <p>
                <img src="../../assets/image/helong/2bb.png" alt="">
            </p>
            <p class="mlr">
                过车感知
            </p>
            <p>
                <span>{{totalNum}}</span>
            </p>
        </div>
        <div class="carPerceptionImg boxWrapper">
            <div class="noMesBox" v-show="noMesBoxShow">暂无数据</div>
            <div class="slideBox hornBox" :style="{marginLeft:ml150}">
                <div v-for="item in data" v-show="dataShow">
                    <p class="carImgBox">
                        <!-- <span class="identification">{{item.imageFragmentPath}}</span> -->
                        <img :src="item.imageFragmentPath" alt="">
                    </p>
                    <p><span>{{item.license}}</span> </p>
                    <p>{{item.deviceName}}</p>
                    <p>{{item.reportTime}}</p>
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
        name: "carPerception", 
        data(){
          return{
                tableData:[
                    {
                        imageFragmentPath:require('../../assets/image/helong/timg (5).jpg'),
                        licensePlate:'川A123456',
                        residentialName:'皇冠国际1号门出口',
                        time:'16:22:22',
                        identification:'重点车辆'
                    },
                    {
                        imageFragmentPath:require('../../assets/image/helong/timg (6).jpg'),
                        licensePlate:'川A123456',
                        residentialName:'皇冠国际1号门出口',
                        time:'16:22:22'
                    },
                    {
                        imageFragmentPath:require('../../assets/image/helong/timg (7).jpg'),
                        licensePlate:'川A123456',
                        residentialName:'皇冠国际1号门出口',
                        time:'16:22:22'
                    },
                    {
                        imageFragmentPath:require('../../assets/image/helong/timg (8).jpg'),
                        licensePlate:'川A123456',
                        residentialName:'皇冠国际1号门出口',
                        time:'16:22:22'
                    },
                    {
                        img:require('../../assets/image/helong/timg (9).jpg'),
                        licensePlate:'川A123456',
                        residentialName:'皇冠国际1号门出口',
                        time:'16:22:22'
                    },
                    {
                        img:require('../../assets/image/helong/timg (10).jpg'),
                        licensePlate:'川A123456',
                        residentialName:'皇冠国际1号门出口',
                        time:'16:22:22'
                    }
                ],
                ml150:'',
                data:[],
                totalNum:0,
                numAdd:0,
                noMesBoxShow:false,
                dataShow:true,
                
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
            initWebSocket(organId){
                this.socketError=false;
                // this.socket = new SockJS('http://25.30.9.145:15674/stomp');
                this.socket = new SockJS('http://222.211.78.60:15674/stomp'); 
                //  this.socket = new SockJS('http://25.30.9.9:15674/stomp');               
                const client = Stomp.over(this.socket);
                client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
                client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
                const on_connect = ()=> {
                    client.subscribe(`/exchange/TopicExchangeFontAYIC/topic.open.door.front.record.#.${organId}.#`, (frame)=> {
                        let frames = JSON.parse(frame.body);
                        if(frames.type==3){
                         this.noMesBoxShow=false
                        this.dataShow=true
                            let data=JSON.parse(frames.data)
                            let time=data.reportTime                         
                            var str=moment(time).format('YYYY-MM-DD HH:mm:ss')
                            var num1=str.indexOf(' ')
                            data.reportTime=str.substring(num1)
                            this.data.unshift(data)
                            // if(data.personType==2){
                            //     this.visitorNum++;
                            // }else{
                            //     this.totalNum++;
                            // }
                            this.totalNum++;
                            if (this.data.length >= 5) {
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
                Api.hlVehicleNumber.get({
                    pageSize:4
                },
                {
                     pathParams: {
                        orgId: organId,
                       
                    }
                }
                ).then(res => {
                    if(res.data.result.list.length==0){
                        this.noMesBoxShow=true
                        this.dataShow=false
                    }else{
                        this.noMesBoxShow=false
                        this.dataShow=true
                    }
                    this.data=res.data.result.list
                    this.totalNum=res.data.result.vehicleSnapCount
                    for (let i = 0; i <  this.data.length; i++) {
                        var str=this.data[i].reportTime
                        var num1=str.indexOf(' ')
                        this.data[i].reportTime=this.data[i].reportTime.substring(num1)
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
            .carImgBox{
                width: 140px;
                height: 100px;
                position: relative;
                .identification{
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    background: red;
                    color: #fff;
                    font-size: 12px;
                    // padding: 2px;
                }
            }
        }             
        p{
            margin-left: 7px;
            margin-top: 6px;
            color: #61b4e9;   
            // text-align: center;         
            img{
                display: block;
                width: 140px;
                height: 100px;
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