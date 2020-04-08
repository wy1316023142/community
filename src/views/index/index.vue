<template>
  <div class="zhsq-main" ref="innerBody">
    <div class="index">
      <el-amap ref="map" :center="center" :zoom="zoom">
        <el-amap-info-window  :position="center" :content="content"  :offset="[0,-5]" showShadow :visible="windowVisible"></el-amap-info-window>
        <el-amap-marker vid="marker" :position="center" :offset="[-9,-9]" :icon="houseIcon" :events="events" ></el-amap-marker>
      </el-amap>
      <div class="index-r" :style="{height: tabHeight + 'px',maxHeight:tabHeight + 'px'}">
        <el-row  :gutter="15">
          <el-col :span="12">
            <h3>车辆进出记录</h3>
            <div class="img-box" v-for="item in vehicleData">
              <img :src="item.imagePath">
            </div>
          </el-col>
          <el-col :span="12">
            <h3>人脸进出记录</h3>
            <div class="img-box" v-for="item in personData">
              <img :src="item.environmentImageUrl">
            </div>
          </el-col>
        </el-row>
        <div class="refresh" v-if="socketError" @click="initWebSocket">服务器断开，请点击刷新  <i class="el-icon-refresh"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { aMapManager } from 'vue-amap';
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'
export default {
  data: function() {
    return {
      socketError:false,
      windowVisible:true,
      content:"",
      houseIcon:'data:image/png;base64,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',
      zoom: 12,
      center: [104.065735,30.659462],
      events: {
        click: () => {
          this.windowVisible=!this.windowVisible
        },
      },
      socket:null,
      tabHeight:0,
      vehicleData:[],
      personData:[],
      personFilter:{
        orgId: 1,
        page: 1,
        rows: 4,
        deviceName:'',
        personName:'',
        startTime:'',
        endTime:'',
        xj:1
      },
      vehicleFilter:{
        organId: 0,
        page: 4,
        rows: 1,
        license:'',
        startDate:'',
        endDate:'',
      }
    };
  },
  mounted(){
    this._height();
    if(JSON.parse(sessionStorage.getItem('user')).x!==null&&JSON.parse(sessionStorage.getItem('user')).y!==null){
      this.center=[JSON.parse(sessionStorage.getItem('user')).x,JSON.parse(sessionStorage.getItem('user')).y]
    }else {
      this.center=[104.065735,30.659462]
    }

    this.organPath= JSON.parse(sessionStorage.getItem('user')).organPath;
    this.organPath=this.organPath.replace(new RegExp('/','g'),".")
    this.personFilter.orgId=JSON.parse(sessionStorage.getItem('user')).organId;
    this.vehicleFilter.organId=JSON.parse(sessionStorage.getItem('user')).organId;
    this._fetchVehicleData();
    this._fetchPersonData();
    this._fetchStatistics();

    this.initWebSocket();
  },
  methods: {
    _height(){
      this.tabHeight=this.$refs.innerBody.offsetHeight-40
      window.onresize =()=> {
        this.tabHeight=this.$refs.innerBody.offsetHeight-40
      };
    },
    _fetchVehicleData:async function() {
      const data = await Api.vehicleRecord.post(this.vehicleFilter, {
      }).then(res => res.data)
      this.vehicleData = data.rows
    },
    _fetchPersonData:async function() {
      const data = await Api.openDoorRecord.get(this.personFilter, {
      }).then(res => res.data)
      this.personData = data.rows
    },
    //统计
    _fetchStatistics:async function() {
      const house = await Api.getDistrictStatistics.get({},{pathParams: {id: this.personFilter.orgId, type:1}})
      const person =  await Api.indexStatistics.get()
      Promise.all([house, person]).then(([res1, res2]) => {
        let organName=JSON.parse(sessionStorage.getItem('user')).organName;
        this.content=
          '<div class="map-content">' +
          ' <h4>'+organName+'</h4>' +
          ' <div class="flex">' +
              '<div class="flexItem">共有房屋:'+(res1.data.result.leaseCount+res1.data.result.vacantCount+res1.data.result.selfOccupiedCount)+ '</div>' +
              '<div class="flexItem">出租房屋:'+res1.data.result.leaseCount+'</div>' +
          ' </div>'+
          ' <div class="flex">' +
            '<div class="flexItem">空置房屋:'+res1.data.result.vacantCount+'</div>' +
            '<div class="flexItem">自住房屋:'+res1.data.result.selfOccupiedCount+'</div>' +
          ' </div>'+
          ' <div class="flex">' +
            '<div class="flexItem">常住人口:'+res2.data.result.longLivedNum+'</div>' +
            '<div class="flexItem">暂住人口:'+res2.data.result.floatingNum+'</div>' +
          ' </div>'
      })
    },
    //
    initWebSocket(){
      this.socketError=false;

      this.socket = new SockJS(JSON.parse(sessionStorage.getItem("systemConfig")).mqHost+':'+JSON.parse(sessionStorage.getItem("systemConfig")).mqPort);
      const client = Stomp.over(this.socket);
      client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
      client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
      client.debug = function(str) {};
      const on_connect = ()=> {
        client.subscribe(`/exchange/TopicExchangeAlarm/${this.organPath}`, (frame)=> {
          let frames = JSON.parse(frame.body)
          if(frames.type==1){
            this.personData.unshift(JSON.parse(frames.data));
            if (this.personData.length > 4) {
              this.personData.pop()
            }
          }else if(frames.type==3){
            this.vehicleData.unshift(JSON.parse(frames.data));
            if (this.vehicleData.length >4) {
              this.vehicleData.pop()
            }
          }
        });
      };
      const on_error = ()=> {
        this.socketError=true;
        //client.connect(process.env.VUE_APP_WEBSOCKET_MQ_USER, process.env.VUE_APP_WEBSOCKET_MQ_PASS, on_connect, on_error, '/');
      };
      client.connect(JSON.parse(sessionStorage.getItem("systemConfig")).mqUsername, JSON.parse(sessionStorage.getItem("systemConfig")).mqPassword, on_connect, on_error, '/');
    },
  },
  beforeRouteLeave(to, from, next) {
    this.socket.close()
    next()
  },
};
</script>
<style lang="less">
  .map-content{
    width: 200px;
    padding:5px 5px 0;
    font-size: 14px;
    h4{
      color: #00C2FF;
      font-size: 16px;
    }
    div{
      margin-top: 5px;
      color: #00C2FF;
    }
  }
</style>
