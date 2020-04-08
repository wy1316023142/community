<template>
  <div class="zhsq-container">
    <div class="zhsq-aside">
      <el-menu
        class="zhsq-menu"
        :unique-opened="true"
        :router="true"
        :collapse="isCollapse"
        background-color="#3450b2"
        text-color="#FFFFFF"
        active-text-color="#fff"
        :default-active="$route.path"
      >
        <el-menu-item class="title">
          <img src="../assets/images/commom/a.png">
          <span slot="title">{{ title }}</span>
        </el-menu-item>
        <div v-for="item in treeListData">

          <el-submenu :index="String(item.id)" v-show="item.remark">
            <template slot="title">
              <img :src="item.icon">
              <span slot="title">{{item.name}}</span>
            </template>
            <el-menu-item v-for="arr in item.chil" :index="arr.pageUrl" v-if="arr.remark&&arr.type==0"
                          @click.native="largeScreenjump(arr.id)">
              <template slot="title">
                <span slot="title">{{arr.name}}</span>
              </template>
            </el-menu-item>
            <!-- 三级菜单 -->
            <el-submenu v-for="arr in item.chil" :index="String(arr.id)" v-if="arr.pid&&arr.type==0"
                        class="thirdMenu">
              <template slot="title">
                <span slot="title">{{arr.name}}</span>
              </template>
              <el-menu-item v-for="third in arr.chil" :index="third.pageUrl">
                <template slot="title">
                  <span slot="title">{{third.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-submenu>
          <!-- 如果有只有一个子菜单显示这个 -->
          <el-menu-item :index="item.pageUrl" v-show="item.pid" @click.native="largeScreenjump(item.id)">
            <template slot="title">
              <img :src="item.icon">
              <span slot="title" style="fontSize:16px">{{item.name}}</span>
            </template>
          </el-menu-item>
        </div>

      </el-menu>
    </div>
    <div class="zhsq-body">
      <div class="zhsq-head">
        <div class="head-main">
          <ul class="clearfix head-info">
            <li class="userName">Hello {{userName}}</li>
            <li class="alarmTipsIcon" @click="alarmTipsIcon" v-allow="1005">
              <el-badge :value="tableData4Total" v-show="tableData4Total>0">
                <img src="../assets/images/ling.png">
              </el-badge>
            </li>
            <li class="fullscreen-icon">
              <img src="../assets/images/commom/b.png">
            </li>
            <li>
              <el-dropdown trigger="click" @command="handleCommand">
                <img src="../assets/images/commom/d.png" class="dropdown">
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="pwd">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout">注销</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </ul>
        </div>
      </div>
      <div class="zhsq-content">
        <div class="zhsq-fluid">
          <router-view></router-view>
        </div>
      </div>
      <div class="zhsq-footer">四川天翼网络服务有限公司</div>
    </div>
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :modal-append-to-body='false'
               width="30%">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item prop="oldPwd" label="旧密码">
          <el-input type="password" v-model="model.oldPwd" value=""></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input type="password" v-model="model.newPwd" value=""></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" label="重复密码">
          <el-input type="password" v-model="model.confirmPwd" value=""></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 报警 -->
    <div v-show="alarmImg" class="alarmImg" @click="alarmImgShow" v-allow="1004"><!---->
      <img src="../assets/images/5778.png" alt="">
      <audio :src="audio" controls ref='audio' loop="loop"></audio>
    </div>
    <!-- 一键报警 -->
    <el-dialog :visible.sync="alarmOnekey" :close-on-click-modal="false" title="报警盘报警" :modal-append-to-body='false'
               width="40%" top="20vh" :before-close="handleClose">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @row-click='alarmOnekeyDetails'
        max-height="300px"
        heigt="300px"
      >
        <el-table-column
          prop="organName"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="extend.address"
          label="安装地址">
        </el-table-column>
        <el-table-column prop="alarmTime" label="报警时间" width="200">
          <template slot-scope="scope">
            {{scope.row.alarmTime | moment('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
      </el-table>
      <div class="alarmSwitch" @click="alarmSwitch">
        <img src="../assets/images/switch.png" alt="" v-show="alarmSwitchO">
        <img src="../assets/images/switch1.png" alt="" v-show="alarmSwitchC">
      </div>
    </el-dialog>
    <!-- 报警详情 -->
    <div class="alarmRecordContnentVideo" v-show="alarmRecord" v-allow="1004">
      <div class="elastiFrame1">
        <p class="titleContent">一键报警</p>
        <div class="alarmRecordContnent">
          <div class="contentBox1">
            <p><span>报警内容 </span>{{alarmData.alarmContent}}</p>
            <p><span>报警时间 </span>{{alarmData.alarmTime | moment('YYYY-MM-DD HH:mm:ss')}}</p>
            <p><span>所属机构 </span>{{alarmData.organName}}</p>
            <p><span>安装地址 </span>{{subordinateData.address}}</p>
            <p><span>设备编号 </span>{{subordinateData.machineNumber}}</p>
          </div>
          <!-- <div class="contentBox2">
            <div class="talkbackBox"></div>
            <div class="talkbackBtn" @click="talkbackBtn" v-show="talkbackBtnShow">
              <el-button type="primary">下呼</el-button>
            </div>
          </div> -->
        </div>
        <div slot="footer" class="dialog-footer ml300">
          <el-button @click="alarmConfirm(alarmData)">告警确认</el-button>
          <el-button @click="talkbackBtn" type="primary">{{distinguish == 0 ? '下呼' : '接听'}}</el-button>
          <!-- <el-button type="primary" @click="videoPlay">视频播放</el-button> -->
        </div>
        <div class="closedH" @click="closedContent">
          <img src="../assets/images/x.png" alt="">
        </div>
      </div>
      <div class="elastiFrame2" v-show="elastiFrameVideo">
        <div class="dialog-video" style="height:100%;">
          <el-row style="height: 100%" :gutter="5">
            <el-col :span="12" style="height: 50%;padding-bottom: 3px;box-sizing: border-box">
              <video id="video1" class="video-js vjs-default-skin js-video" data-setup="{}" controls>
                <source src="" type="rtmp/flv">
              </video>
            </el-col>
            <el-col :span="12" style="height: 50%;padding-bottom: 3px;box-sizing: border-box">
              <video id="video2" class="video-js vjs-default-skin js-video" data-setup="{}" controls>
                <source src="" type="rtmp/flv">
              </video>
            </el-col>
            <el-col :span="12" style="height: 50%;padding-top: 3px;box-sizing: border-box">
              <video id="video3" class="video-js vjs-default-skin js-video" data-setup="{}" controls>
                <source src="" type="rtmp/flv">
              </video>
            </el-col>
            <el-col :span="12" style="height: 50%;padding-top: 3px;box-sizing: border-box">
              <video id="video4" class="video-js vjs-default-skin js-video" data-setup="{}" controls>
                <source src="" type="rtmp/flv">
              </video>
            </el-col>
          </el-row>
          <!-- <el-tabs @tab-click="handleClick">
             <el-tab-pane :label="item.name" v-for="(item,index) in gbDevices"></el-tab-pane>
           </el-tabs>
           <div class="dialog-video-box" v-loading="videoLoading">
             <video id="video" class="video-js vjs-default-skin" data-setup="{}" controls>
               <source src="" type="rtmp/flv">
             </video>
           </div>-->
        </div>
        <!--<div class="closedH" @click="closedVideo">
          <img src="../assets/images/x.png">
        </div>-->
      </div>
    </div>

    <el-dialog title="新告警" :visible.sync="newAlarmTab">
      <el-table
        :data="tableData4"
        border
        ref="tableData4"
        style="width: 100%"
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        :height='500'
        :max-height="500">
        <el-table-column prop="alarmName" label="告警来源"></el-table-column>
        <el-table-column label="告警位置">
          <template slot-scope="scope">
            {{scope.row.extend.address || scope.row.extend.deviceName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="alarmContent"
          label="告警内容"
        >
        </el-table-column>
        <el-table-column
          prop="alarmTime"
          label="上报时间"
          width='200'
        >
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="newAlarmClick(scope.row)" type="text" size="small">
              处理
            </el-button>
            <!-- <el-button @click="goAlarmDetails(scope.row)" type="text" size="small" v-if="alarmFilter.isNoHandle == 1">更多</el-button>
          <el-button @click="goAlarmDetails(scope.row)" type="text" size="small" v-if="alarmFilter.isNoHandle != 1">查看详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @current-change="pageChange" background layout="prev, pager, next, total"
                       :total='tableData4Total'
                       :page-size='alarmFilter.rows' :current-page='alarmFilter.page'></el-pagination>
      </div>
    </el-dialog>
    <!-- 告警盘告警 离线告警 -->
    <el-dialog :title="alarmTitle" :visible.sync="newAlarmRecord" :close-on-click-modal="false"
               :modal-append-to-body='false' width="476px">
      <el-form>
        <div class="newContentBox">
          <p><span>报警内容 : </span>{{newAlarmDetails.alarmContent}}</p>
          <p><span>报警时间 : </span>{{newAlarmDetails.alarmTime}}</p>
          <p><span>所属机构 : </span>{{newAlarmDetails.organName}}</p>
          <p><span>安装地址 : </span>{{subordinateData.address || subordinateData.deviceName}}</p>
          <p><span>设备编号 : </span>{{subordinateData.machineNumber}}</p>
          <el-form-item label="反馈信息： " class="mesgBox"
                        v-show="newAlarmDetails.alarmType1 == 5&&newAlarmDetails.status == 1">
            <el-input type="textarea" v-model="deviceAlarmText.feedbackContent"></el-input>
          </el-form-item>
          <el-form-item label="处理结果： " class="mesgBox"
                        v-show="newAlarmDetails.alarmType1 == 6||newAlarmDetails.alarmType1==7||newAlarmDetails.alarmType1==8||newAlarmDetails.alarmType1==9">
            <el-input type="textarea" v-model="deviceAlarmText.feedbackContent"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newAlarmRecord =false">取 消</el-button>
        <el-button type="primary" @click="panelHandle(newAlarmDetails)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  import videoPlayer from '@/components/video.vue'
  import SockJS from "sockjs-client";
  import Stomp from "stompjs";
  import Api from "../commom/api.js";
  import bus from "@/commom/bus.js";
  import moment from "moment";
  import {encrypt} from "@/commom/util.js";
  import {cloneDeep, keys} from "lodash";
  import audio from "@/assets/images/2.mp3";
  import videojs from "video.js/es5/video.js";
  import "video.js/dist/video-js.css";
  import SWF_URL from "videojs-swf/dist/video-js.swf";
  import {debounce} from "lodash";
  import ElRow from "element-ui/packages/row/src/row";

  let Base64 = require("js-base64").Base64;
  videojs.options.flash.swf = SWF_URL;
  export default {
    components: {ElRow,
    videoPlayer
    },
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.model.newPwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        tableData4Total: 0,
        newAlarmTab: false,
        deviceAlarmModel: "",
        deviceAlarmText: {
          feedbackContent: ""
        },
        alarmDetails: {},
        alarmRecordContnent: false,
        alarmSwitchO: true,
        alarmSwitchC: false,
        videoLoading: false,
        talkbackBtnShow: false,
        gbDevices: [],
        alarmData: {},
        organPath: "",
        audio: audio,
        alarmOnekey: false,
        alarmImg: false,
        loading3: false,
        alarmRecord: false,
        elastiFrameVideo: false,
        distinguish: 0,
        tableData: [],
        treeListData: [],
        src: "",
        organType: "",
        orgId: "",
        authorities: [],
        title: " ",
        userName: "",
        model: {
          oldPwd: "",
          newPwd: "",
          confirmPwd: ""
        },
        userId: "",
        isCollapse: false,
        dialogFormVisible: false,
        loading: false,
        rules: {
          oldPwd: [
            {
              required: true,
              message: "请输入旧密码",
              trigger: "blur"
            }
          ],
          newPwd: [
            {
              required: true,
              message: "请输入新密码",
              trigger: "blur"
            },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{8,}$/,
              trigger: "blur",
              message: "密码以“字母+特殊字符+数字”组成组成，长度不少于8位"
            }
          ],
          confirmPwd: [
            {
              required: true,
              message: "请输入新密码",
              trigger: "blur"
            },
            {
              validator: validatePass2,
              trigger: "blur"
            }
          ]
        },
        firstErr: null,
        flag: true,
        getMqData: [],
        tableData4: [],
        alarmFilter: {
          page: 1,
          rows: 10,
          // organId: 1,
          isNoHandle: 1,
          organPath: '/1',
          excludePerson: 0
        },
        alarmTitle: "",
        iotDeviceAlarmTitle: "",
        newAlarmRecord: false,
        iotDeviceAlarm: false,
        newAlarmDetails: {},
        subordinateData: {}
      };
    },
    methods: {
      pageChange(val) {
        this.alarmFilter.page = val;
        this._fetchAlarmData();
      },
      _fetchAlarmData: async function () {
        const data = await Api.getAlarmData.get(this.alarmFilter).then(res => res.data);
        data.rows.map(item => {
          item.alarmTime = moment(item.alarmTimeStr).format("YYYY-MM-DD HH:mm:ss");
        })
        this.tableData4 = data.rows;
        this.tableData4Total = data.total;
      },
      alarmTipsIcon() {
        this.newAlarmTab = true;
      },
      /*告警列表*/
      newAlarmClick(row) {
        this.alarmTitle = `${row.alarmName}`;
        this.deviceAlarmText.feedbackContent = "";
        this.newAlarmDetails = row;
        this.subordinateData = row.extend
        this.newAlarmRecord = true;
      },
      async panelHandle(item) {
        let state = item.status == 0 ? 1 : 2
        Api.deviceAlarm.put(this.deviceAlarmText, {
          pathParams: {
            id: this.newAlarmDetails.id,
            alarmState: state
          }
        }).then(res => {
          this.newAlarmRecord = false;
          this.alarmOnekey = false
          this._fetchAlarmData();
          bus.$emit("alarmData", res.data);
          if (state == 1) {
            this.$message({message: "确认成功", type: "success"});
          } else {
            this.$message({message: "反馈成功", type: "success"});
          }
          Api.getAlarmData.get({
            alarmType1: 5,
            page: 1,
            rows: 999,
            organPath: JSON.parse(sessionStorage.getItem("user")).organPath,
            isNoHandle: 1
          }).then(res => {
            this.tableData = res.data.rows;
            this.alarmImg = res.data.rows.length ? true : false;
          });
        });
      },
      getMq(data) {
        if (data) {
          this.getMqData.push(data);
        }
        if (this.alarmRecord == false) {
          this.alarmOnekeyDetails(this.getMqData[0]);
        }
      },
      initWebSocket() {
        /*this.socket = new SockJS(JSON.parse(sessionStorage.getItem("systemConfig")).mqHost+':'+JSON.parse(sessionStorage.getItem("systemConfig")).mqPort);*/
        var urlMQ = JSON.parse(sessionStorage.getItem("systemConfig")).mqHost;
        this.socket = new SockJS(`http://${urlMQ}:15674/stomp`);
        const client = Stomp.over(this.socket);
        client.heartbeat.outgoing = 0; // 客户端每20000ms发送一次心跳检测
        client.heartbeat.incoming = 0; // 0 代表client不接收server端的心跳检测
        //client.debug = function(str) {};
        const on_connect = () => {
          client.subscribe(`/exchange/TopicExchangeAlarm/${this.organPath}.#`, frame => {
              const data = JSON.parse(frame.body);
              bus.$emit("indexWork", data);
              this._fetchAlarmData()
              if (data.extend.deviceType === "IDT4") {
                // this.alarmOnekeyDetails(data)
                this.distinguish = 1;
                this.getMq(data);
                this.alarmImg = true;
                data.alarmState = 0;
                data.deviceTypeStr = "报警盘";
                data.alarmTimeStr = moment(data.alarmTimeStr).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                this.tableData.unshift(data);
                this.alarmSwitchO = true;
                this.alarmSwitchC = false;
                this.$refs.audio && this.$refs.audio.play();
              }
            }
          );
        };
        const on_error = () => {
          client.connect(JSON.parse(sessionStorage.getItem("systemConfig")).mqUsername, JSON.parse(sessionStorage.getItem("systemConfig")).mqPassword, on_connect, on_error, "/");
        };
        client.connect(JSON.parse(sessionStorage.getItem("systemConfig")).mqUsername, JSON.parse(sessionStorage.getItem("systemConfig")).mqPassword, on_connect, on_error, "/");
      },
      handleCommand(command) {
        if (command === "logout") {
          sessionStorage.setItem("user", null);
          sessionStorage.setItem("token", "");
          sessionStorage.setItem("authorities", null);
          this.$router.push({name: "login"});
        }
        if (command === "pwd") {
          this.dialogFormVisible = true;
        }
      },
      //新告警
      async getAlarmData() {
        const data = await Api.getAlarmData.get({
          /*deviceType: "IDT4",*/
          alarmType1: 5,
          page: 1,
          rows: 999,
          organPath: JSON.parse(sessionStorage.getItem("user")).organPath,
          /* alarmState: 0,*/
          isNoHandle: 1
        }).then(res => res.data.rows);
        this.alarmImg = data.length == 0 ? false : true;
        if (data.length != 0) {
          this.alarmSwitchO = true;
          this.alarmSwitchC = false;
          this.$refs.audio && this.$refs.audio.play();
        } else {
          this.$refs.audio && this.$refs.audio.pause();
        }
        this.tableData = data;
      },
      async getRolePermissionsTreeIndex() {
        this.treeListData = await Api.getRolePermissionsTreeIndex.get({}).then(res => res.data.result);
        for (let i = 0; i < this.treeListData.length; i++) {
          this.treeListData[i].icon = "/icon/" + this.treeListData[i].icon;
          if (this.treeListData[i].chil) {
            // var asd= this.treeListData[i].chil.filter(function(element, index) {
            //       return element['type'] == 0;
            //   });
            // this.treeListData[i].chil=asd
            this.treeListData[i].remark = true;
            this.treeListData[i].pid = false;
            for (let j = 0; j < this.treeListData[i].chil.length; j++) {
              if (
                this.treeListData[i].chil[j].pageUrl ||
                this.treeListData[i].chil[j].url
              ) {
                this.treeListData[i].chil[j].remark = true;
                this.treeListData[i].chil[j].pid = false;
              } else {
                this.treeListData[i].chil[j].remark = false;
                this.treeListData[i].chil[j].pid = true;
              }
            }
          } else {
            this.treeListData[i].remark = false;
            this.treeListData[i].pid = true;
          }
        }

      },
      largeScreenjump(id) {
        if (id == 1002) {
          let model = {
            url:
            JSON.parse(sessionStorage.getItem("bigscreenConfig")).bsUrl +
            "&organId=" +
            this.orgId +
            "&parentId=" +
            this.orgId +
            "&organName=" +
            JSON.parse(sessionStorage.getItem("user")).organName,
            username: JSON.parse(sessionStorage.getItem("bigscreenConfig")).bsUsername,
            password: encrypt(JSON.parse(sessionStorage.getItem("bigscreenConfig")).bsPassword)
          };
          Api.goToBigScreen
            .get(
              {},
              {
                baseURL: myConfig.goToBigScreenUrl,
                params: model,
                headers: {
                  Authorization: null
                }
              }
            )
            .then(res => {
              window.open(
                `${res.data.result.url}&token=${
                  res.data.result.accessToken.access_token
                  }`
              );
            });
        }
      },

      async submit() {
        await this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.loading = true;
            this.firstErr = null;
            let model = cloneDeep(this.model);
            model.oldPwd = Base64.encode(model.oldPwd);
            model.newPwd = Base64.encode(model.newPwd);
            model.confirmPwd = Base64.encode(model.confirmPwd);
            await Api.changePwd
              .put(model, {pathParams: {userId: this.userId}})
              .then(res => {
                this.loading = false;
                this.dialogFormVisible = false;
                this.$message({message: "修改成功", type: "success"});
              })
              .catch(err => {
                this.loading = false;
                throw err;
              });
          } else {
            const firstKey = keys(invalidFields)[0];
            this.firstErr = invalidFields[firstKey][0];
          }
        });
      },
      alarmSwitch() {
        this.flag = !this.flag;
        if (this.flag == false) {
          this.$refs.audio.pause();
          this.alarmSwitchO = false;
          this.alarmSwitchC = true;
        } else {
          this.$refs.audio.play();
          this.alarmSwitchO = true;
          this.alarmSwitchC = false;
        }
      },
      alarmImgShow() {
        this.alarmImg = false;
        this.alarmOnekey = true;
      },
      handleClose() {
        this.alarmImg = true;
        this.alarmOnekey = false;
      },
      alarmConfirm(item) {
        let state = item.status == 0 ? 1 : 2
        Api.deviceAlarm.put(this.deviceAlarmModel, {
          pathParams: {
            id: this.alarmData.id,
            alarmState: state
          }
        }).then(res => {
          this.distinguish = 0;
          this.getAlarmData();
          this.alarmRecord = false;
          if (this.getMqData.length > 1) {
            this.getMqData.splice(0, 1);
            this.alarmOnekeyDetails(this.getMqData[0]);
          }
          if (state == 1) {
            this.$message({message: "确认成功", type: "success"});
          } else {
            this.$message({message: "反馈成功", type: "success"});
          }
        });
      },
      videoPlay() {
        // this.gbDevices = []
        // this.elastiFrameVideo = true
        // Api.getAlarmPanelCamera.get({
        //   'machineNumber': this.alarmData.machineNumber
        // }).then(res => {
        //   this.gbDevices = res.data.result.gbDevices
        //   this.videoLoading = true
        //   Api.getVideoRtmp.get({
        //     naming: this.gbDevices[0].naming
        //   }).then(res => {
        //     let rtmp = res.data.msg + '\\';
        //     setTimeout(() => {
        //       this.videoLoading = false
        //       this.$message({message: '请求成功', type: 'success'});
        //       videojs('video').src('')
        //       videojs('video').src(rtmp)
        //       videojs('video').play()
        //     }, 1500)
        //   }).catch(() => {
        //     this.videoLoading = false
        //   })
        // })
      },
      handleClick(tab, event) {
        this.videoLoading = true;
        Api.getVideoRtmp
          .get({
            naming: this.gbDevices[tab.index].naming
          })
          .then(res => {
            let rtmp = res.data.msg + "\\";
            setTimeout(() => {
              this.videoLoading = false;
              this.$message({message: "请求成功", type: "success"});
              videojs("video").src("");
              videojs("video").src(rtmp);
              videojs("video").play();
            }, 1500);
          })
          .catch(() => {
            this.videoLoading = false;
          });
      },
      alarmOnekeyDetails(item) {
        if (item.status == 1) {
          this.alarmTitle = `${item.alarmName}`;
          this.deviceAlarmText.feedbackContent = "";
          this.newAlarmDetails = item;
          this.subordinateData = item.extend
          this.newAlarmRecord = true;
        } else if (item.status == 0) {
          const ele = document.querySelectorAll(".js-video")
          this.alarmOnekey = false;
          this.alarmRecord = true;
          this.$nextTick(() => {
            this.alarmData = item;
            this.subordinateData = item.extend
          });
          this.gbDevices = [];
          this.elastiFrameVideo = true;
          Api.getAlarmPanelCamera
            .get({
              machineNumber: item.sourceCode
            })
            .then(res => {
              this.gbDevices = res.data.result.gbDevices;
              this.gbDevices
              this.gbDevices.forEach((item, index) => {
                if (index < 4) {
                  const loading = this.$loading({
                    target: ele[index]
                  });
                  Api.getVideoRtmp.get({
                    naming: item.naming
                  }).then(res => {
                    let rtmp = res.data.msg + "\\";
                    setTimeout(() => {
                      /*this.$message({message: "请求成功", type: "success"});*/
                      videojs("video" + (index + 1)).src("");
                      videojs("video" + (index + 1)).src(rtmp);
                      videojs("video" + (index + 1)).play();
                      loading.close();
                    }, 1500);
                  }).catch(() => {
                    loading.close();
                  })
                }
              })
            });
        }
      },
      closedVideo() {
        videojs("video1") && videojs("video1").src("");
        videojs("video2") && videojs("video2").src("");
        videojs("video3") && videojs("video3").src("");
        videojs("video4") && videojs("video4").src("");
        setTimeout(() => {
          this.elastiFrameVideo = false;
        }, 1000)

      },
      closedContent() {
        videojs("video1") && videojs("video1").src("");
        videojs("video2") && videojs("video2").src("");
        videojs("video3") && videojs("video3").src("");
        videojs("video4") && videojs("video4").src("");
        this.alarmImg = true;
        this.alarmRecord = false;
        this.distinguish = 0;
        if (this.getMqData.length > 1) {
          this.getMqData.splice(0, 1);
          this.alarmOnekeyDetails(this.getMqData[0]);
        }
        //videojs("video").src("");
      },
      async alarmHistory() {
        var filter = {
          deviceType: "IDT4",
          organId: 1,
          alarmState: 0,
          page: 1,
          rows: 5
        };
        const data = await Api.alarmPage.get(filter).then(res => res.data);
      },
      talkbackBtn() {
        this.callByCS();
      },
      async getSipUser() {
        var loginName = JSON.parse(sessionStorage.getItem("user")).loginName;
        const data = await Api.getSipUser
          .get({
            account: loginName
          })
          .then(res => res.data);
        this.sipData = data.result;
        this.registByCS();
        if (this.sipData) {
          this.talkbackBtnShow = true;
        } else {
          this.talkbackBtnShow = false;
        }
      },
      registByCS() {
        var res = this.sipData;
        if (!res) {
          return;
        }
        var sipManage = {
          username: "",
          password: "",
          sipIp: "",
          sipPort: 0
        };
        sipManage.username = res.username;
        sipManage.password = res.password;
        sipManage.sipIp = res.serverIp;
        sipManage.sipPort = res.serverPort;
        location.href =
          "SIPCLIENT://" +
          sipManage.username +
          "&" +
          sipManage.password +
          "&" +
          sipManage.sipIp +
          "&" +
          sipManage.sipPort +
          "&";
        // var link = "<a id=\"sipClient\" href=\"SIPCLIENT://" + sipManage.username + "&" + sipManage.password + "&" + sipManage.sipIp + "&" + sipManage.sipPort + "&" + "\"></a>";
        // var link = document.createElement("a")
        // link.setAttribute('id', 'sipClient')
        // link.setAttribute('href', "SIPCLIENT://" + sipManage.username + "&" + sipManage.password + "&" + sipManage.sipIp + "&" + sipManage.sipPort + "&" + "")
        // document.querySelector('body').append(link)
        // this.$refs.audio.pause();
        // document.querySelector('#sipClient').click();
        // document.querySelector('#sipClient').remove();
      },
      callByCS() {
        this.$refs.audio.pause();
        this.alarmSwitchO = false;
        this.alarmSwitchC = true;
        var account = this.alarmData.machineNumber;
        var res = this.sipData;
        var sipManage = {
          username: "",
          password: "",
          sipIp: "",
          sipPort: 0
        };
        sipManage.username = res.username;
        sipManage.password = res.password;
        sipManage.sipIp = res.serverIp;
        sipManage.sipPort = res.serverPort;
        location.href =
          "SIPCLIENT://" +
          sipManage.username +
          "&" +
          sipManage.password +
          "&" +
          sipManage.sipIp +
          "&" +
          sipManage.sipPort +
          "&" +
          account;
        // var link = document.createElement("a")
        // link.setAttribute('id', 'sipClient')
        // link.setAttribute('href', "SIPCLIENT://" + sipManage.username + "&" + sipManage.password + "&" + sipManage.sipIp + "&" + sipManage.sipPort + "&" + account + "")
        // document.querySelector('body').append(link)
        // document.querySelector('#sipClient').click();
        // document.querySelector('#sipClient').remove();
      }
    },
    created() {
      this.getRolePermissionsTreeIndex();
    },
    beforeRouteLeave(to, from, next) {
      videojs("video1").dispose();
      videojs("video2").dispose();
      videojs("video3").dispose();
      videojs("video4").dispose();
      next();
    },
    mounted() {
      this.organPath = JSON.parse(sessionStorage.getItem("user")).organPath;
      this.organPath = this.organPath.replace(new RegExp("/", "g"), ".");
      this.userId = JSON.parse(sessionStorage.getItem("user")).id;
      this.userName = JSON.parse(sessionStorage.getItem("user")).name;
      this.title = JSON.parse(sessionStorage.getItem("user")).organShortName;
      this.organType = JSON.parse(sessionStorage.getItem("user")).organType;
      this.orgId = JSON.parse(sessionStorage.getItem("user")).organId;
      // this.active = this.$route.fullPath;
      this.alarmFilter.organPath = JSON.parse(sessionStorage.getItem("user")).organPath;
      this.getAlarmData();
      let authorities = JSON.parse(sessionStorage.getItem("authorities"));
      this.initWebSocket();
      this.getSipUser();
      this._fetchAlarmData();
      bus.$off("alarmDataNum");
      bus.$on('alarmDataNum', res => {
        this._fetchAlarmData()
        Api.getAlarmData.get({
          alarmType1: 5,
          page: 1,
          rows: 999,
          organPath: JSON.parse(sessionStorage.getItem("user")).organPath,
          isNoHandle: 1
        }).then(res => {
          this.tableData = res.data.rows;
          this.alarmImg = res.data.rows.length ? true : false;
        });
      })
    }
  };
</script>
<style lang="less">
  .newContentBox {
    span {
      color: #b9bbbe;
      margin-right: 20px;
      margin-left: 10px;
    }
    p {
      margin-top: 10px;
    }
    .mesgBox {
      .el-textarea {
        margin-top: 10px;
      }
      .el-form-item__label {
        color: #b9bbbe;
        margin-left: 10px;
        width: 20% !important;
        text-align: left !important;
      }
    }
  }

  .zhsq-container {
    width: 100%;
    height: 100%;
    position: relative;

    .zhsq-aside {
      .bigscreen {
        background: #3450b2;
        color: #fff;
      }

      .el-menu-item.is-active {
        background-color: #4761b8 !important;
      }
      .thirdMenu {
        .el-submenu__title {
          font-size: 14px !important;
          margin-left: 8%;
        }

        .el-menu {
          margin-left: 8%;
        }
      }

      position: fixed;
      width: 250px;
      height: 100%;
      left: 0;
      top: 0;
      // overflow-y: auto;
      background: #3450b2;
      transition: all 0.3s;
      -webkit-transition: all 0.3s;

      .title {
        height: 88px;
        line-height: 88px;
        font-size: 24px;
        background: rgba(13, 72, 161) !important;
      }

      .title:hover {
        background: rgba(13, 72, 161) !important;
      }

      .el-menu {
        border: none !important;
      }

      .el-submenu .el-menu-item {
        padding-left: 60px !important;
      }

      .el-submenu__title {
        font-size: 16px;
      }

      .el-menu-item img,
      .el-submenu img {
        padding-right: 20px;
        width: 20%;
      }

      .el-menu-item.is-active {
        color: #fff;
      }
    }

    .zhsq-body {
      position: fixed;
      width: calc(100% - 250px);
      height: 100%;
      left: 250px;
      background: #f4f4f4;

      .zhsq-content {
        position: absolute;
        top: 98px;
        width: 100%;
        height: calc(100% - 144px);
        z-index: 1;
        overflow: auto;

        .zhsq-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 287px;
          // background:linear-gradient(90deg,rgba(219,112,108,1),rgba(77,62,154,1));
          background: #f4f4f4;
          z-index: 1;
        }

        .zhsq-fluid {
          position: relative;
          width: 100%;
          height: calc(100% - 2px);
          box-sizing: border-box;
          padding: 0 40px;
          z-index: 99;
        }
      }

      .zhsq-head {
        width: 100%;
        height: 88px;
        // background:linear-gradient(90deg,rgba(219,112,108,1),rgba(77,62,154,1));
        background: url("../assets/images/house/899.png") #252a97;
        background-size: cover;
        z-index: 2;

        .head-main {
          text-align: right;
          padding-right: 40px;
          height: 70px;
          padding-top: 22px;

          .head-info > li {
            display: inline-block;
            color: #a6c7fe;
            font-size: 18px;
            margin-left: 20px;
            cursor: pointer;
          }

          .head-info > li > img {
            vertical-align: middle;
            margin-top: -2px;
          }

          .head-info img.dropdown {
            vertical-align: middle;
            margin-top: -3px;
          }
        }
      }

      .zhsq-footer {
        position: absolute;
        width: 100%;
        height: 46px;
        line-height: 46px;
        bottom: 0px;
        text-align: center;
        color: #999999;
        font-size: 16px;
      }
    }

    .alarmImg {
      position: absolute;
      bottom: 0;
      right: 0;
      audio {
        display: none;
      }
    }

    .alarmRecordContnentVideo {
      display: flex;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      // -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      position: absolute;
      top: 0;
      left: 0;

      .elastiFrame1 {
        .closedH {
          position: absolute;
          top: 14px;
          right: 16px;
          color: #909399;

          img {
            width: 15px;
            height: 15px;
          }
        }

        position: relative;
        width: 374px;
        height: 400px;
        margin-left: 30%;
        margin-top: 10%;
        background: #fff;

        .titleContent {
          margin-left: 30px;
          line-height: 50px;
          color: #909399;
        }
      }

      .elastiFrame2 {
        width: 400px;
        height: 400px;
        background: #fff;
        margin-top: 10%;
        margin-left: 20px;
        position: relative;

        .closedH {
          position: absolute;
          top: 14px;
          right: 16px;

          img {
            width: 15px;
            height: 15px;
          }
        }

        .videoTitle {
          margin-left: 10px;
          line-height: 50px;
          // span{
          //   margin-right: 20px;
          //   color: #909399
          // }
        }
      }
    }
  }

  .dialog-video {
    box-sizing: border-box;
    padding: 5px;
    .video-js {
      width: 100%;
      height: 100%;
    }

    /*.video-control {
      position: absolute;
      left: 15px;
      bottom: 15px;
    }
    .dialog-video-box {
      width: 100%;
      height: 100%;
    }*/
  }

  .el-dialog__body {
    position: relative;

    .alarmSwitch {
      position: absolute;
      top: 40px;
      right: 30px;

      img {
        width: 25px;
        height: 25px;
      }
    }
  }

  .alarmRecordContnent {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 70%;

    .contentBox1 {
      margin-left: 30px;
      margin-top: 20px;
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: #606266;

      p {
        margin-bottom: 16px;

        span {
          margin-right: 10px;
        }
      }
    }

    .contentBox2 {
      margin-right: 20px;
      margin-top: 20px;
      width: 42%;
      height: 180px;
      border: 1px solid #ededed;

      .talkbackBox {
        width: 100%;
        height: 70%;
        border-bottom: 1px solid #ededed;
      }

      .talkbackBtn {
        .el-button {
          margin-left: 140px;
          margin-top: 8px;
        }
      }
    }
  }

  .ml300 {
    margin-left: 175px;
  }

  .zhsq-container .zhsq-aside .el-menu-item.is-active {
    span {
      border-bottom: 1px solid #fff;
      padding-bottom: 5px;
    }
  }

  .zhsq-aside {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .zhsq-aside::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 8px;
    // height: 1px;
  }

  .zhsq-aside::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    background: rgb(52, 80, 178);
  }

  .zhsq-aside::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    // border-radius: 10px;
    background: #ededed;
  }

  .alarmTipsIcon {
    // width: 20px;
    // height: 5px;
    position: relative;
    img {
      height: 22px;
      width: 22px;
    }
    .alarmTipsIconNum {
      position: absolute;
      width: auto;
      height: 15px;
      background: red;
      top: -4px;
      right: -10px;
      text-align: center;
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      line-height: 15px;
      padding: 0 1px;
    }
  }
</style>
