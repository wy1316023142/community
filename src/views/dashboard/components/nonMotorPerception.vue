<template>
    <div class="nonMotorPerception">
        <div class="nonMotorTitle">
            <p>
                <img src="../../assets/image/helong/1bb.png" alt="">
            </p>
            <p class="mlr">非机动车感知</p>
            <p><span>{{totalNum}}</span></p>
        </div>
        <div class="nonMotorTable boxWrapper">
            <div class="noMesBox" v-show="noMesBoxShow">暂无数据</div>
            <div class="hornBox">
            <!-- <div class="rollBox"> -->
                <div class="nonMotorContent" v-for="item in data" v-show="dataShow">
                    <!-- <p class="ml14">{{item.licenseNumber}}<span>{{item.pai}}</span></p> -->
                    <p class="ml14">{{item.licenseNumber}}</p>
                    <p class="overEllipsis">{{item.deviceName}}</p>
                    <p>{{item.captureTime}}</p>
                </div>
            <!-- </div> -->
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
        name: "nonMotorPerception",
        data(){
            return{
            data:[],
            data1:[],
            noMesBoxShow:false,
            dataShow:true,
            totalNum:0,            
            filter:{
                organId: 0,
                page: 1,
                rows: 5,
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
                for (let i = 0; i < 10; i++) {
                    this.data1.push(this.data[i])
                }
                this.data.splice(0,5)
                for (let j = 0; j < 5; j++) {
                    this.data.push(this.data1[j])                    
                }
                // console.log(this.data);
                
                var _this=this
                setInterval(function(){
                       _this.data1=[]
                       _this.data1=_this.data.slice(0,10)
                       _this.data.splice(0,5)
                        for (let i = 0; i < 5; i++) {
                            _this.data.push(_this.data1[i])
                        }

                },1000*10)
                
            },
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
                        if(frames.type==2){
                        this.noMesBoxShow=false
                        this.dataShow=true
                            let data=JSON.parse(frames.data)
                            var str=data.captureTime
                            var num1=str.indexOf(' ')
                           data.captureTime=data.captureTime.substring(num1)
                            this.data.unshift(data)
                                this.totalNum++;
                            if (this.data.length >= 6) {
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
                Api.hlRfidRecordNum.get({
                    pageSize:5
                },
                {
                     pathParams: {
                        orgId: organId,
                    }
                }
                ).then(res => {
                    var dataLength=res.data.result.recordLst.length
                    if(dataLength==0){
                        this.noMesBoxShow=true
                        this.dataShow=false
                    }else{
                        this.noMesBoxShow=false
                        this.dataShow=true
                    }
                    this.data=res.data.result.recordLst
                    this.totalNum=res.data.result.totalNum
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
.nonMotorPerception{
    // margin-left: 30px;
    .nonMotorTitle{
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
    .nonMotorTable{
        width: 273px;
        height: 185px;
        overflow: hidden;
        border-top: 1px solid #112a6a;
        border-left: 1px solid #112a6a;
        border-right: 1px solid #112a6a;
        font-size: 12px; 
        color: #61b4e9;  
        position: relative;
    //     .rollBox{
    //          position:relative;
    //         animation: moveUp linear 10s infinite 0s normal; 
    //         -webkit-animation: moveUp linear 10s infinite 0s normal;
    //     }
    //      @keyframes moveUp {
    //     0% {
    //         top: 0;
    //     }
    //     10% {
    //         top: -38px;
    //     }
    //     20% {
    //         top: -38px;
    //     }
    //     30% {
    //         top: -75px;
    //     }
    //     40% {
    //         top: -75px;
    //     }
    //     50% {
    //         top: -112px;
    //     }
    //     60% {
    //         top: -112px;
    //     }
    //     70% {
    //         top: -149px;
    //     }
    //     80% {
    //         top: -149px;
    //     }
    //     90% {
    //         top: -186px;
    //     }
    //     100% {
    //         top: -186px;
    //     }
    // }
        .nonMotorContent{
            height: 36px;
            line-height: 36px;
            display: flex;
            border-bottom: 1px solid #112a6a;
            p{
                // margin-right: 6px;
            }            
        }                                            
    }
    .ml14{
        margin-left: 14px;
    }
    span{
        color: #feb226;
        font-weight: bold;
        
    }
    .mlr{
        margin-left: 6px;
        margin-right: 12px;
    }
    .overEllipsis{
        width: 90px;
        overflow: hidden;
         white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center
    }
}
</style>