<template>
<div class="zhsq-main wisdomSeachBigBox" ref="wisdomSeachBigBox">
   <div class="zhsq-boxWrapper">
    <div class="zhsq-right-con" ref="content">

      <div class="wisdomSeachT">
        <p>
        <img src="../../assets/images/sqx.png" alt="" class="logImg">
        </p>
        <div class="wisdomSeachTInputBox">
          <input type="text" name="" id="" class="wisdomSeachTInput" @click="onPickFile">
          <div class="seachImgBox" v-show="cancelImg">
            <img :src="imgStr" alt="">
            <p @click='cancel()' class='cancelImg'>x</p>
          </div>
        </div>
        <div>
          <el-button size="small" type="primary" @click="seach()" icon="el-icon-search"></el-button>
        </div>
            <input ref='avatarInput' type="file" accept="image/*" @change="handleUpload($event)" v-show="false"/>
      </div>
      <div class="wisdomSeachNoMegBox" v-show="wisdomSeachNoMegBox" :style="{height:tabHeight,lineHeight:tabHeight}">
        暂无数据
      </div>
      <div class="wisdomSeachM" :style="{height:tabHeight}"  v-loading="loading">
        <el-col :span="6" v-for="item in imgData" @click.native="contentClick(item)">
          <el-col :span="10">
            <img :src="item.imagePath" alt="" :style="{height:imgHeight}">
          </el-col>
          <el-col :span="14">
            <div class="wisdomSeachContentBox">
              <p>姓名 : {{item.name}}</p>
              <p>联系电话 : {{item.tel}}</p>
              <p>年龄 : {{item.age}}</p>
              <p>籍贯 : {{item.nationName}}</p>
              <p>相识度 : <span>{{item.score}} %</span></p>

            </div>
          </el-col>
        </el-col>
      </div>
      <!-- <div class="wisdomSeachB">
           <div class="pageBox">
                <el-pagination @current-change="pageChange" background
                               layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
      </div> -->
    </div>
    <!-- 详情 -->
    <el-dialog title="详情" :visible.sync="wisdomSeachContent"
               :close-on-press-escape="false" :modal-append-to-body='false' width="500px" top="5vh">
        <div class="topImgBox">
          <el-col :span="9">
            <img :src="personalDetails.imgStr" alt="">
          </el-col>
          <el-col :span="6">
              <IEcharts :option="pie" ref="cross" ></IEcharts>
          </el-col>
          <el-col :span="9">
            <img :src="personalDetails.imagePath" alt="">
          </el-col>
        </div>
        <div class="detailsBox">
          <el-col :span="12">
            国籍 : {{personalDetails.name}}
          </el-col>
          <el-col :span="12">
            身份证号 : {{personalDetails.identityNumber}}
            </el-col>
          <el-col :span="12">
            姓名 : {{personalDetails.name}}
            </el-col>
          <el-col :span="12">
            性别 : {{personalDetails.sex}}
            </el-col>
          <el-col :span="12">
            手机号码 : {{personalDetails.tel}}
            </el-col>
          <el-col :span="12">
            民族 : {{personalDetails.nationName}}
            </el-col>
          <el-col :span="12">
            年龄 : {{personalDetails.age}}
            </el-col>
          <el-col :span="12">
            政治面貌 : {{personalDetails.age}}
            </el-col>
          <el-col :span="12">
            籍贯 : {{personalDetails.age}}
            </el-col>
          <el-col :span="12">
            职务 : {{personalDetails.age}}
            </el-col>
          <el-col :span="12">
            学历水平 : {{personalDetails.age}}
            </el-col>
        </div>
        <div class="bottomContent">
          <p>
            住址 : 清波小区1栋1单元202号,业主,租客
          </p>
        </div>
    </el-dialog>
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
import IEcharts from "vue-echarts-v3/src/full.js";

// import Socket from '@/common/socket.js'
// import { scoketBus } from '@/common/bus.js'

export default {
  name: "wisdomSeach",
  components:{
      IEcharts,
  },
  data() {
    return{
      wisdomSeachNoMegBox:false,
      loading:false,
      personalDetails:{
        name:'',
        identityNumber:'',
        sex:'',
        age:'',
        nationName:'',
        tel:''
      },
      imgStr:'',
      tabHeight:'',
      imgHeight:'',
      model:{},
      organPath:'',
      filter:{},
      wisdomSeachContent:false,
      imgData:[
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
        // {imgUrl:require('../../assets/images/timg.jpg')},
      ],
      pie:{
        title: {
          subtext: '相似度',
          text: '50%',
          x: 'center',
          y: 'center',
          textStyle: {
              fontWeight: 'bold',
              color: '#ec646b',
              fontSize: '20'
          }
        },
        color: ['#f9a2a6'],

        series: [{
            name: 'Line 1',
            type: 'pie',
            clockWise: true,
            radius: ['100%', '70%'],
            center: ['50%', '60%'],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }
            },
            hoverAnimation: false,
            data: [{
                value: 20,
                name: '01',
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#e9649a' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#f1797e' // 100% 处的颜色
                            }]
                        },
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }, {
                name: '02',
                value: 20,
            }]
        }]
      },
      total:0,
      cancelImg:false,
    }
  },
  mounted() {
      this.organPath = JSON.parse(sessionStorage.getItem('user')).organPath;
      this.organPath = this.organPath.replace(new RegExp('/', 'g'), ".")
      this.imgData=this.$route.params.res
  },
   updated(){
      //table高度
    this.$nextTick(() => {
      this.tabHeight = this.$refs.wisdomSeachBigBox.offsetHeight*0.85+'px'
      this.imgHeight = this.$refs.wisdomSeachBigBox.offsetHeight*0.85*0.26+'px'
      window.onresize = () => {
      this.tabHeight = this.$refs.wisdomSeachBigBox.offsetHeight*0.85+'px'
      this.imgHeight = this.$refs.wisdomSeachBigBox.offsetHeight*0.85*0.26+'px'
      };
    });
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
            this.getListData(data)
            client.disconnect();
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
        this.cancelImg=true
        this.model.imagesBase64=res.substring(23)
        this.model.taskId=12
        })

    },
    async seach(){
      this.loading=true
      const data = await Api.wisdomSeachFeatures.post(this.model).then(res=>{
        this.initWebSocket()
      })
    },
    async getListData(data1){
      const data = await Api.wisdomSeachList.post({
        feature:data1.feature,
        confidence:'50',
      }).then(res=>{
        if(res.data.result.rows.length==0){
          this.wisdomSeachNoMegBox=true
        }
         this.loading=false
         for (let i = 0; i < res.data.result.rows.length; i++) {
          res.data.result.rows[i].imgStr=this.imgStr
        }
        this.imgData=res.data.result.rows
      })
    },
    contentClick(item){
      var ss=item.identityNumber
      var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
      var i="";
      while(i.length<z.length){i+="*"}
      return y+i+p})
      item.identityNumber=str1
      this.personalDetails=item
      this.pie.title.text=item.score+'%'
      this.pie.series[0].data[0].value=item.score
      var num=100-item.score
      this.pie.series[0].data[1].value=num
      this.wisdomSeachContent=true
    },
    cancel(){
      this.imgStr=''
      this.cancelImg=false
    },
    pageChange(val) {
      // this.filter.page = val;
    },

  },

  }

</script>
<style lang="less" >
.wisdomSeachBigBox{
  .wisdomSeachT{
    padding: 20px 0 10px 20px;
    display: flex;
    .el-button--primary {
      height: 32px;
      line-height: 11px;
    }
    .wisdomSeachTInputBox{
      position: relative;
      .wisdomSeachTInput{
            height: 32px;
            width: 300px;
            border: 1px solid #ccc;
            border-right: none;
            // border-radius: 5px;
            margin-left: 10px;
            font-size: 20px;
      }
      .seachImgBox{
        position: absolute;
        top: 1px;
        left: 15px;
        // border: 1px solid #ededed;
        // background: #ccc;
        width: 30px;
        height: 30px;
        img{
          width: 30px;
          height: 30px;
        }
        .cancelImg{
          width: 14px;height: 14px;
          color: #fff;
          background: rgb(141, 138, 138);
          position: absolute;
          top: 1px;
          right: -1px;
          text-align: center;
          line-height: 14px;
          font-size: 12px;
          border-radius: 50%;
          z-index: 999;
        }

    }
    }
        .logImg{
          width: 66px;
          height: 30px;
        }
  }
  .wisdomSeachM{
    overflow-y: auto;
    .wisdomSeachContentBox{
      p{
        margin-bottom: 1%;
      }
    }
      .el-col-6:hover{
        box-shadow: 5px 5px 5px #ccc;
            // transform: scale(1.01)

      }
    .el-col-6 {
      transition: all 0.3s linear 0s;
        font-size: 12px;
        background: #f1f8fd;
        height: 30%;
        margin-top: 20px;
        margin-left: 10px;
        border: 1px solid #cfd2e0;
        padding: 7px 0px 5px 10px;
        width: 23.7%!important;
        img{
          width: 80%;
        }
    }
  }
  .wisdomSeachB{
    margin-top: 40px;
    margin-bottom: 20px;
  .pageBox{
    margin-top: 15px;
   text-align: right;

  }
  }
  .color2F58C1{
    color: #2F58C1;
    margin-bottom: 5px;
  }
  .el-dialog__header{
    background: #8083a9;
  }
  .el-dialog__title{
    color: #fff!important;
  }
  .el-dialog__headerbtn .el-dialog__close{
    color: #fff!important;
  }
  .topImgBox{
    height: 186px;
    border-bottom: 1px solid #ccc;
    .el-col-9{
      text-align: center;
    }
    .el-col-6{
      height: 154px;
    }
    img{
      width: 115px;
      height: 151px;
      // font-weight: bold
    }
  }
  .detailsBox{
    height: 210px;
    margin-top: 20px;
    .detailsBox{
      margin-bottom: 10px;
    }
  }
  .wisdomSeachNoMegBox{
    color: rgb(126, 120, 120);
    font-size: 16px;
    text-align: center;
  }
}
</style>
