<template>
  <div class="zhsq-main">
    <div class="zhsq-boxWrapper">
      <div class="zhsq-right-con" ref="content">
        <div class="tableBox">
          <div class="tableTopBox indexWorkTab">
            <el-popover width="300" trigger="click" ref="poppoverBox">
              <div style="height: 300px;max-height: 300px;overflow: auto" class="popover">
                <el-tree :data="organTreeListData"
                         :props="defaultProps"
                         @node-click="selectOrgId"
                         highlight-current
                         :expand-on-click-node="false"
                         :default-checked-keys="[organId]"
                         node-key="id">
                </el-tree>
              </div>
              <el-input class="index-select-organId" v-model="orgName" slot="reference"
                        autocomplete="off" placeholder="请选择小区" readonly></el-input>
            </el-popover>
          </div>
          <div class="tableBottomBox" ref="tableBottomBox">
            <el-col :span="12">
              <div class="tableBottomBoxL">
                <div class="indexWorkLBox1" ref="indexWorkLBox1">
                  <div class="LBox1Title">
                    <p>
                      <span :class="{span1:todayShow}" @click="rentingDay(1)">今日</span>
                      <span class="span2" :class="{span1:sevenShow}" @click="rentingDay(2)">最近7日</span>
                      <span :class="{span1:thirtyShow}" @click="rentingDay(3)">最近30日</span>
                    </p>
                    <!-- <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker> -->
                  </div>
                  <div class="LBox1Top" v-model="alarmCensus">
                    <div class="titleContent titleContentI2">
                      <div class="titleContentText">
                        <p class="topText">告警数</p>
                        <p class="bottomText">
                          <span class="color5678cc" :style="{fontSize:fs}">{{alarmCensus.alarmCount}}</span>
                        </p>
                      </div>
                      <div class="titleContentImg">
                        <img src="../../assets/images/house/a1.png" alt="">
                      </div>
                    </div>
                    <div class="titleContent titleContentI2">
                      <div class="titleContentText">
                        <p class="topText">已处理告警</p>
                        <p class="bottomText">
                          <span class="color5678cc" :style="{fontSize:fs}">{{alarmCensus.handleCount}}</span>
                        </p>
                      </div>
                      <div class="titleContentImg">
                        <img src="../../assets/images/house/a1.png" alt="">
                      </div>
                    </div>
                    <div class="titleContent titleContentI2">
                      <div class="titleContentText">
                        <p class="topText">未处理告警</p>
                        <p class="bottomText">
                          <span class="colorf94a66" :style="{fontSize:fs}">{{alarmCensus.noHandleCount}}</span>
                        </p>
                      </div>
                      <div class="titleContentImg">
                        <img src="../../assets/images/house/a2.png" alt="">
                      </div>
                    </div>
                  </div>
                  <div class="LBox1Bottom" v-model="eventCensus">
                    <div class="titleContent titleContentI2">
                      <div class="titleContentText">
                        <p class="topText">事件数</p>
                        <p class="bottomText">
                          <span class="color5678cc" :style="{fontSize:fs}">{{eventCensus.eventCount}}</span>
                        </p>
                      </div>
                      <div class="titleContentImg">
                        <img src="../../assets/images/house/a3.png" alt="">
                      </div>
                    </div>
                    <div class="titleContent titleContentI2">
                      <div class="titleContentText">
                        <p class="topText">已处理事件</p>
                        <p class="bottomText">
                          <span class="color5678cc" :style="{fontSize:fs}">{{eventCensus.handleEventCount}}</span>
                        </p>
                      </div>
                      <div class="titleContentImg">
                        <img src="../../assets/images/house/a3.png" alt="">
                      </div>
                    </div>
                    <div class="titleContent titleContentI2">
                      <div class="titleContentText">
                        <p class="topText">未处理事件</p>
                        <p class="bottomText">
                          <span class="colorf94a66" :style="{fontSize:fs}">{{eventCensus.noHandleEventCount}}</span>
                        </p>
                      </div>
                      <div class="titleContentImg">
                        <img src="../../assets/images/house/a4.png" alt="">
                      </div>
                    </div>
                  </div>
                </div>
                <div class="indexWorkLBox3">
                  <div class="aghouseTenant">
                    <div class="mapTitle">
                      <span class="top-icon"></span>
                      <span class="title1">网格员任务执行情况</span>
                    </div>
                    <el-table :data="gridPersonnelData"  border :header-cell-style="{background:'#eef1f6',color:'#606266'}" :height="tabHeight2">
                      <el-table-column prop="name"  label="网格员姓名" min-width="100px"></el-table-column>
                      <el-table-column prop="name"  label="异常预警待处理" min-width="120px"></el-table-column>
                      <el-table-column prop="name"  label="待处理关怀任务数" min-width="140px"></el-table-column>
                      <el-table-column prop="name"  label="未录入信息房屋数量" min-width="150px"></el-table-column>
                      <el-table-column  label="操作" align='center'>
                        <template slot-scope="scope">
                          <el-button type="text" size="small">查看详情</el-button>
                        </template>
                      </el-table-column>                      
                    </el-table>

                     <!-- <div class="mapTitle">
                      <span class="top-icon"></span>
                      <span class="title1">事件分析</span>
                    </div> -->
                    <!-- <IEcharts :option="cross" ref="cross"></IEcharts> -->
                  </div>
                </div>
                <div class="indexWorkLBox3">
                  <div class="optionNav">
                    <p :class="{newEvent:stayShow}" @click="newEvent(1)">待处理({{eventsTotal}})</p>
                    <p :class="{newEvent:alreadyShow}" @click="newEvent(2)">已完成</p>
                  </div>
                  <div class="aghouseTenant">
                    <div class="mapTitle">
                      <span class="top-icon"></span>
                      <span class="title1">新事件</span>
                    </div>
                    <el-table
                      :data="tableData3"
                      border
                      :height='tabHeight1'
                      ref="tableData3"
                      style="width: 100%"
                      v-show="tableData3Show1"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                      <el-table-column
                        prop="organName"
                        label="上报小区"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="eventContent"
                        label="事件描述"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="reportTime"
                        label="上报时间"
                      >
                      </el-table-column>
                      <el-table-column
                        width="100"
                        label="操作">
                        <template slot-scope="scope">
                          <el-button @click="handleEvent(scope.row)" type="text" size="small"
                                     v-if="scope.row.eventStatus == 1">处理
                          </el-button>
                          <el-button @click="goEventDetails(scope.row)" type="text" size="small"
                                     v-if="scope.row.eventStatus == 2">查看详情
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-table
                      :data="tableData3"
                      :height='tabHeight1'
                      border
                      ref="tableData3"
                      style="width: 100%"
                      v-show="tableData3Show2"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                      <el-table-column
                        prop="organName"
                        label="上报小区"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="eventContent"
                        label="事件描述"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="handleTime"
                        label="处理时间"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="reportTime"
                        label="处理耗时"
                      >
                      </el-table-column>
                      <el-table-column
                        width="100"
                        label="操作">
                        <template slot-scope="scope">
                          <el-button @click="handleEvent(scope.row)" type="text" size="small"
                                     v-if="scope.row.eventStatus == 1">处理
                          </el-button>
                          <el-button @click="goEventDetails(scope.row)" type="text" size="small"
                                     v-if="scope.row.eventStatus == 2">查看详情
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="tableBottomBoxR">
                <div class="indexWorkRBox1">
                  <el-row style="height: 100%;">
                    <el-col :span="12" style="height:50%">
                      <div :class="[index==1 ? 'active'  : '', 'videoBox']" v-loading="loading1">
                        <video id="video1" class="video-js vjs-default-skin" data-setup="{}" controls>
                          <source ref="video1" type="rtmp/flv">
                        </video>
                        <div class="video-control">
                          <el-button icon="el-icon-menu" circle size="mini" @click="select(1)"></el-button>
                          <!-- <el-button icon="el-icon-menu" circle size="mini" @click="fullscreen(1)"></el-button>-->
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12" style="height:50%">
                      <div :class="[index==2 ? 'active' : '', 'videoBox']" v-loading="loading2">
                        <video id="video2" class="video-js vjs-default-skin" data-setup="{}" controls>
                          <source src="" type="rtmp/flv">
                        </video>
                        <div class="video-control">
                          <el-button icon="el-icon-menu" circle size="mini" @click="select(2)"></el-button>
                          <!-- <el-button icon="el-icon-menu" circle size="mini" @click="fullscreen(2)"></el-button>-->
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12" style="height:50%">
                      <div :class="[index==3 ? 'active'  : '', 'videoBox']" v-loading="loading3">
                        <video id="video3" class="video-js vjs-default-skin" data-setup="{}" controls>
                          <source src="" type="rtmp/flv">
                        </video>
                        <div class="video-control">
                          <el-button icon="el-icon-menu" circle size="mini" @click="select(3)"></el-button>
                          <!-- <el-button icon="el-icon-menu" circle size="mini" @click="fullscreen(3)"></el-button>-->
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="12" style="height:50%">
                      <div :class="[index==4 ? 'active'  : '', 'videoBox']" v-loading="loading4">
                        <video id="video4" class="video-js vjs-default-skin" data-setup="{}" controls>
                          <source src="" type="rtmp/flv">
                        </video>
                        <div class="video-control">
                          <el-button icon="el-icon-menu" circle size="mini" @click="select(4)"></el-button>
                          <!-- <el-button icon="el-icon-menu" circle size="mini" @click="fullscreen(4)"></el-button>-->
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="indexWorkRBox2">
                  <div class="optionNav">
                    <p :class="{newAlarm:stayAlarm}" @click="newAlarm(1)">待处理({{alarmTotal}})</p>
                    <p :class="{newAlarm:alreadyAlarm}" @click="newAlarm(2)">已完成</p>
                  </div>
                  <div class="aghouseTenant">
                    <div class="mapTitle">
                      <span class="top-icon"></span>
                      <span class="title1">新告警</span>
                    </div>
                    <el-table
                      :data="tableData4"
                      border
                      :height='tabHeight1'
                      ref="tableData4"
                      style="width: 100%"
                      v-show="tableData4Show1"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                      <el-table-column
                        prop="alarmName"
                        label="告警来源"
                      >
                      </el-table-column>
                      <el-table-column  label="告警位置">
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
                      >
                      </el-table-column>
                      <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                          <el-button @click="handleClick(scope.row)" type="text" size="small"
                                     v-if="alarmFilter.isNoHandle == 1">处理
                          </el-button>
                          <el-button @click="goAlarmDetails(scope.row)" type="text" size="small"
                                     v-if="alarmFilter.isNoHandle == 1">更多
                          </el-button>
                          <el-button @click="goAlarmDetails(scope.row)" type="text" size="small"
                                     v-if="alarmFilter.isNoHandle != 1">查看详情
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-table
                      :data="tableData4"
                      :height='tabHeight1'
                      border
                      ref="tableData4"
                      style="width: 100%"
                      v-show="tableData4Show2"
                      :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                      <el-table-column
                        prop="deviceTypeStr"
                        label="告警来源"

                      >
                      </el-table-column>
                      <el-table-column
                        prop="extend.address"
                        label="告警位置"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="alarmContent"
                        label="告警内容"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="extend.feedbackTime"
                        label="处理时间"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="alarmTimeConsume"
                        label="处理耗时"
                      >
                      </el-table-column>
                      <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                          <el-button @click="handleClick(scope.row)" type="text" size="small"
                                     v-if="alarmFilter.isNoHandle == 1">处理
                          </el-button>
                          <el-button @click="goAlarmDetails(scope.row)" type="text" size="small"
                                     v-if="alarmFilter.isNoHandle != 1">查看详情
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-col>
          </div>
        </div>
        <!-- 报警盘 -->
        <el-dialog :title="alarmTitle" :visible.sync="alarmRecord" :close-on-press-escape="false"
                   :modal-append-to-body='false' width="476px" top="5vh">
          <el-form>
            <div class="contentBox">
              <p><span>报警内容 : </span>{{alarmDetails.alarmContent}}</p>
              <p><span>报警时间 : </span>{{alarmDetailsExtend.alarmTimeStr}}</p>
              <p><span>所属机构 : </span>{{alarmDetails.organName}}</p>
              <p><span>安装地址 : </span>{{alarmDetailsExtend.address }}</p>
              <p><span>设备编号 : </span>{{alarmDetailsExtend.machineNumber}}</p>
              <!-- <el-form-item label="处置情况" class="mesgBox" v-show="ManagementShow">
               <el-input type="textarea" v-model="deviceAlarmModel.feedbackContent"></el-input>
             </el-form-item> -->
              <el-form-item label="反馈信息 : " class="mesgBox" v-show="mesgBoxShow">
                <el-input type="textarea" v-model="deviceAlarmModel.feedbackContent"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="alarmRecord =false">取 消</el-button>
            <el-button type="primary" @click="panelHandle(alarmDetails)" :loading="loading">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="iotDeviceAlarmTitle" :visible.sync="iotDeviceAlarm" :close-on-press-escape="false" :modal-append-to-body='false' width="476px" top="5vh" v-model="alarmDetails">
          <el-form>
            <div class="contentBox">
              <p><span>报警内容：</span>{{alarmDetails.alarmContent}}</p>
              <p><span>报警时间：</span>{{alarmDetailsExtend.alarmTimeStr}}</p>
              <p><span>所属机构：</span>{{alarmDetails.organName}}</p>
              <p><span>安装地址：</span>{{alarmDetailsExtend.address || alarmDetailsExtend.deviceName}}</p>
              <p><span>设备编号：</span>{{alarmDetailsExtend.machineNumber}}</p>
              <el-form-item label="处理结果： " class="mesgBox">
                <el-input type="textarea" v-model="deviceAlarmModel.feedbackContent"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="iotDeviceAlarm =false">取 消</el-button>
            <el-button type="primary" @click="addPosition()" >确 定</el-button>
            <el-button type="warning" @click="addPosition(3)"  v-if="ignoreVIsble">忽 略</el-button>
          </div>
        </el-dialog>
        <!--告警记录-->
        <el-dialog :close-on-click-modal="false" class="alarm-dialog" :title="''" :visible.sync="dialogFormVisible"
                   :modal-append-to-body='false' width="40%" :show-close=false>
          <div class="el-icon-error alarm-dialog-icon" v-if="popAlarmDetails.state == 0"></div>
          <div class="el-icon-success alarm-dialog-icon" v-if="popAlarmDetails.state == 1"></div>
          <div class="alarm-dialog-con">
            <div class="alarm-header">
              <ul class="flex">
                <li class="flexItem">告警详情</li>
                <!-- <li class="flexItem"  :class="index==2?'active':'' " @click="selectAlarm(2)">场景图片</li>
                <li class="flexItem"  :class="index==3?'active':'' " @click="selectAlarm(3)">轨迹分析</li> -->
              </ul>
            </div>
            <div class="alarm-con">
              <div class="info">
                <div class="flex">
                  <div class="flexItem">
                    <img :src="popAlarmDetails.photoPath">
                    <el-image style="width: 100%; height: 250px" :src="popAlarmDetails.photoPath"
                              fit="cover"></el-image>
                    <span class="background1">模板图</span>
                  </div>
                  <div class="flexItem">
                    <img :src="popAlarmDetails.featureImageUrl">
                    <el-image style="width: 100%; height: 250px" :src="popAlarmDetails.featureImageUrl"
                              fit="cover"></el-image>
                    <span class="background2">抓拍图</span>
                  </div>
                </div>
                <br>
                <div class="info-con">
                  <div>
                    姓名：{{popAlarmDetails.personName}} <span class="fr">相似度：{{popAlarmDetails.matchScore}}%</span>
                  </div>
                  <p>性别：{{popAlarmDetails.sexName}}</p>
                  <p>抓拍时间：{{popAlarmDetails.alarmTime}}</p>
                  <p>抓拍地点：{{popAlarmDetails.orgName}}</p>
                </div>
              </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" v-if="popAlarmDetails.state == null"
                       @click="handleAlarm(popAlarmDetails.id,popAlarmDetails.alarmId,2)">忽略告警
            </el-button>
            <el-button type="primary" :loading="loading" v-if="popAlarmDetails.state == null"
                       @click="handleAlarm(popAlarmDetails.id,popAlarmDetails.alarmId,1)">标记嫌疑人
            </el-button>
            <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
          </div>
        </el-dialog>
        <el-dialog class="alarm-dialog" :title="''" :visible.sync="dialogVehicleFormVisible"
                   :modal-append-to-body='false' width="40%" :show-close=false>
          <div class="el-icon-error alarm-dialog-icon" v-if="vehicleDetail.isSuspect == 2"></div>
          <div class="el-icon-success alarm-dialog-icon" v-if="vehicleDetail.isSuspect == 1"></div>
          <div class="alarm-dialog-con">
            <div class="alarm-header">
              <ul class="flex">
                <li class="flexItem">告警详情</li>
              </ul>
            </div>
            <div class="alarm-con">
              <div class="info">
                <div class="flex">
                  <img :src="vehicleDetail.imagePath">
                </div>
                <div class="info-con">
                  <p>车牌号：{{vehicleDetail.licenseNumber}}</p>
                  <p>车主：{{vehicleDetail.vehicleOwnerName}}</p>
                  <p>联系方式：{{vehicleDetail.vehicleOwnerPhone}}</p>
                  <p>抓拍时间：{{vehicleDetail.alarmTime}}</p>
                  <p>抓拍地点：{{vehicleDetail.address}}</p>
                </div>
              </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="loading" v-if="vehicleDetail.isSuspect == 0"
                       @click="mark(vehicleDetail.id,2)">忽略告警
            </el-button>
            <el-button type="primary" :loading="loading" v-if="vehicleDetail.isSuspect == 0"
                       @click="mark(vehicleDetail.id,1)">标记嫌疑车辆
            </el-button>
            <el-button type="primary" @click="dialogVehicleFormVisible = false">返回</el-button>
          </div>
        </el-dialog>
        <!-- 视频点位选择 -->
        <el-dialog title="视频点位选择" :visible.sync="videoChoice" :close-on-press-escape="false"
                   :modal-append-to-body='false' width="400px" top="5vh">
          <el-tree
            class="zhsq-tree indexWorkTree"
            :data="data"
            :props="props"
            :load="loadNode"
            node-key="id"
            @node-click="nodeClick"
            highlight-current
            :expand-on-click-node="false"
            lazy>
              <span class="zhsq-tree-slot" slot-scope="{ node, data }">
                 <span v-if="data.naming" class="community-icon"><img src="">{{ data.name }}</span>
                 <span v-if="!data.naming" class="organType-icon">{{ data.name }}</span>
              </span>
          </el-tree>
          <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="alarmRecord =false">取 消</el-button>
                <el-button type="primary" @click="addPosition(status)" :loading="loading">确 定</el-button>
          </div> -->
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
  import SockJS from 'sockjs-client'
  import Stomp from 'stompjs'
  import Api from "../../commom/api.js";
  import {debounce, keys, cloneDeep} from "lodash";
  import {validateIdCard, validatePhone} from '../../commom/validator';
  import moment from 'moment';
  import OrganTree from '../../components/OrganTree.vue';
  import {domHeightMixin} from "../../commom/mixins.js";
  import IEcharts from "vue-echarts-v3/src/full.js";
  import "echarts/map/js/china";
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import 'video.js/dist/video-js.css'
  import videojs from 'video.js/es5/video.js'
  import SWF_URL from 'videojs-swf/dist/video-js.swf'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  import bus from '@/commom/bus.js'

  videojs.options.flash.swf = SWF_URL
  export default {
    name: "indexWork",
    components: {
      IEcharts,
      ElButton,
      ElCol,
      ElRow,
      OrganTree
    },
    data() {
      return {
        ignoreVIsble: false,//设备告警忽略按钮
        alarmTitle: '',
        iotDeviceAlarmTitle: '',
        fs: '',
        cross: {
          color: ['#2b6fd5', '#45a0ea', '#739cdd', "#b6d3fc"],
          legend: {
            data: ["卫生环境", "公共设施", "乱停乱放", "其它"],
            top: 20,
            right: 10,
            icon: 'stack',
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              label: {
                backgroundColor: "#6a7985"
              }
            }
          },
          grid: {
            top: "30%",
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "卫生环境",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: []
            },
            {
              name: "公共设施",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: []
            },
            {
              name: "乱停乱放",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: []
            },
            {
              name: "其它",
              type: "line",
              stack: "总量",
              areaStyle: {},
              data: []
            }
          ]
        },
        gridPersonnelData:[
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
          {name:'asd'},
        ],
        trajectoryFilter: {
          personId: null,
          page: 1,
          rows: 10,
          orgId: null,
          xj: 0
        },
        tableData3: [],
        tableData4: [],
        model: {},
        id: '',
        organTreeListData: [],
        organId: 0,
        orgName: '',
        organPath: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        eventCensus: '',
        alarmCensus: '',
        tableData3Show1: true,
        tableData3Show2: false,
        tableData4Show1: true,
        tableData4Show2: false,
        videoList: [],
        index: 1,
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false,
        trajectoryData: [],
        ManagementShow: false,
        trajectoryDataTotal: 0,
        videoChoice: false,
        dialogFormVisible: false,
        dialogVehicleFormVisible: false,
        alarmRecord: false,
        mesgBoxShow: true,
        stayAlarm: true,
        alreadyAlarm: false,
        iotDeviceAlarm: false,
        stayShow: true,
        alreadyShow: false,
        todayShow: true,
        sevenShow: false,
        thirtyShow: false,
        libraryId: "",
        loading: false,
        tableData: [],
        data: [],
        eventFilter: {
          page: 1,
          rows: 20,
          eventStatus: 1,
          organId: 1,
          xj: 0
        },
        eventsTotal: 0,
        eventTotal: 1,
        alarmFilter: {
          page: 1,
          rows: 20,
          isNoHandle: 1,
          organPath: '/1',
          excludePerson:0
        },
        deviceAlarmModel: {
          feedbackContent: ''
        },
        alarmTotal: 0,
        alTotal: 1,
        alarmDetails: {},
        alarmDetailsExtend: {},
        popAlarmDetails: '',
        vehicleDetail: '',
        alarmCensusFilter: {
          organPath: '',
          type: 1
        },
        eventCensusFilter: {
          organId: 0,
          type: 1
        },
        eventStatistcsFilter: {
          type: 1,
          organId: 0
        },
        filter: {
          feedbackMeg: '',
          ManagementMeg: '',
          page: 1,
          rows: 10,
          organId: 1,
          personName: null,
          identityNumber: null,
          loading1: false,
          loading2: false,
          loading3: false,
          loading4: false,
          index: 1,
          id: '',
          videoList: [],
          props: {
            label: 'name',
            children: 'zones',
            isLeaf: 'leaf'
          },
          data: [],
        },
        tabHeight1: '0',
        tabHeight2: '0',
        props: {
          label: 'name',
          children: 'zones',
          isLeaf: 'leaf'
        },
        tableHeight: '0',
        userId: '',
        num: '',
      };
    },
    mounted() {
      this.userId = JSON.parse(sessionStorage.getItem('user')).id;
      // this.filter.organId=JSON.parse(sessionStorage.getItem('user')).organId
      videojs('video1').options().notSupportedMessage = '请打开浏览器flash'
      videojs('video2').options().notSupportedMessage = '请打开浏览器flash'
      videojs('video3').options().notSupportedMessage = '请打开浏览器flash'
      videojs('video4').options().notSupportedMessage = '请打开浏览器flash'
      this.organPath = JSON.parse(sessionStorage.getItem('user')).organPath;
      this.organPath = this.organPath.replace(new RegExp('/', 'g'), ".")
      this.eventFilter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.alarmFilter.organPath = JSON.parse(sessionStorage.getItem('user')).organPath;
      this.alarmCensusFilter.organPath = JSON.parse(sessionStorage.getItem('user')).organPath;
      this.eventStatistcsFilter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.eventCensusFilter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchEchartData();
      this._fetchEventsData();
      this._fetchAlarmData();
      this._fetchOrganData();
      this._fetchEventCensus();
      this._fetchAlarmCensus();
      this._fetchEventStatistcs();
      this._fetchUserConfigVideoList();
      this.initWebSocket();
      bus.$off('alarmData')
      bus.$on('indexWork', res => {
        this.refreshData()
      })
      bus.$off('alarmData')
      bus.$on('alarmData', res => {
        this._fetchAlarmData()
      })


    },
    updated() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight1 = this.$refs.tableBottomBox.offsetHeight * 0.32
        this.tabHeight2 = this.$refs.tableBottomBox.offsetHeight * 0.27
        window.onresize = () => {
          this.tabHeight1 = this.$refs.tableBottomBox.offsetHeight * 0.32
          this.tabHeight2 = this.$refs.tableBottomBox.offsetHeight * 0.27
          this.$refs.cross.resize();
        };
      });
      this.fs = this.tabHeight1 * 0.14 + 'px'
      // this._fetchAlarmData()
    },
    methods: {
      fullscreen(i) {
        if (i = 1) {
          this.$refs.fullscreen1.requestFullscreen();
        } else if (i = 2) {
          this.$refs.fullscreen2.requestFullscreen();
        } else if (i = 3) {
          this.$refs.fullscreen3.requestFullscreen();
        } else if (i = 4) {
          this.$refs.fullscreen4.requestFullscreen();
        }

      },
      initWebSocket() {

        // /*this.socket = new SockJS(JSON.parse(sessionStorage.getItem("systemConfig")).mqHost+':'+JSON.parse(sessionStorage.getItem("systemConfig")).mqPort);*/

        // this.socket = new SockJS("http://"+JSON.parse(sessionStorage.getItem("systemConfig")).mqHost+":15674/stomp");
        // const client = Stomp.over(this.socket);
        // client.heartbeat.outgoing = 0 // 客户端每20000ms发送一次心跳检测
        // client.heartbeat.incoming = 0 // 0 代表client不接收server端的心跳检测
        // //client.debug = function(str) {};
        // const on_connect = ()=> {
        //   client.subscribe(`/exchange/TopicExchangeEventReport/topic.ayic.event.report${this.organPath}.#`, (frame)=> {
        //     this.refreshData();
        //   });
        // };
        // const on_error = ()=> {
        //   //this.socketError=true;
        //   //client.connect(process.env.VUE_APP_WEBSOCKET_MQ_USER, process.env.VUE_APP_WEBSOCKET_MQ_PASS, on_connect, on_error, '/');
        // };
        // client.connect(JSON.parse(sessionStorage.getItem("systemConfig")).mqUsername, JSON.parse(sessionStorage.getItem("systemConfig")).mqPassword, on_connect, on_error, '/');
      },
      _fetchEventsData: debounce(async function () {
        const data = await Api.getEventsData.get(this.eventFilter
        ).then(res => res.data)
        this.tableData3 = data.rows
        if (this.eventTotal == 1) {
          this.eventsTotal = data.total
        }
        this.getTime(data.rows)
      }, 100),
      _fetchEventCensus: debounce(async function () {
        const data = await Api.getEventCensus.get(this.eventCensusFilter).then(res => res.data)
        this.eventCensus = data.result
      }, 100),
      _fetchAlarmCensus: debounce(async function () {
        const data = await Api.getAlarmCensus.get(this.alarmCensusFilter).then(res => res.data)
        this.alarmCensus = data.result
      }, 100),
      _fetchEventStatistcs: debounce(async function () {
        this.cross.xAxis[0].data = []
        this.cross.series[0].data = []
        this.cross.series[1].data = []
        this.cross.series[2].data = []
        this.cross.series[3].data = []
        const data = await Api.getEventStatistcs.get(this.eventStatistcsFilter).then(res => res.data)
        this.crossData(data.rows)
      }, 100),
      _fetchUserConfigVideoList: debounce(async function () {
        const data = await Api.getUserConfigVideoList.get({}, {
          pathParams: {
            userId: this.userId
          }
        }).then(res => res.data)
        setTimeout(() => {
          if (data.result.index1) {
            Api.getVideoRtmp.get({
              naming: data.result.index1
            }).then(res => {
              // this.videoChoice=false
              // 视频点击次数上传
              let rtmp = res.data.msg + '\\';
              this.loading1 = false
              videojs('video1').src('')
              videojs('video1').src(rtmp)
              videojs('video1').play()
              this.videoChoice = false

            }).catch(() => {
              // this.$message({message: '视频加载失败', type: 'error'});
              this.loading1 = false
              this.videoChoice = false
            })
          }
          if (data.result.index2) {
            Api.getVideoRtmp.get({
              naming: data.result.index2
            }).then(res => {
              // this.videoChoice=false
              // 视频点击次数上传
              let rtmp = res.data.msg + '\\';
              this.loading2 = false
              videojs('video2').src('')
              videojs('video2').src(rtmp)
              videojs('video2').play()
              this.videoChoice = false

            }).catch(() => {
              // this.$message({message: '视频加载失败', type: 'error'});
              this.loading2 = false
              this.videoChoice = false
            })
          }
          if (data.result.index3) {
            Api.getVideoRtmp.get({
              naming: data.result.index3
            }).then(res => {
              // this.videoChoice=false
              // 视频点击次数上传
              let rtmp = res.data.msg + '\\';
              this.loading3 = false
              videojs('video3').src('')
              videojs('video3').src(rtmp)
              videojs('video3').play()
              this.videoChoice = false

            }).catch(() => {
              // this.$message({message: '视频加载失败', type: 'error'});
              this.loading3 = false
              this.videoChoice = false
            })
          }
          if (data.result.index4) {
            Api.getVideoRtmp.get({
              naming: data.result.index4
            }).then(res => {
              // this.videoChoice=false
              // 视频点击次数上传
              let rtmp = res.data.msg + '\\';
              this.loading4 = false
              videojs('video4').src('')
              videojs('video4').src(rtmp)
              videojs('video4').play()
              this.videoChoice = false

            }).catch(() => {
              // this.$message({message: '视频加载失败', type: 'error'});
              this.loading4 = false
              this.videoChoice = false
            })
          }
        }, 1500)


      }, 100),
      crossData(data) {
        for (let i = 0; i < data.length; i++) {
          this.cross.xAxis[0].data.push(data[i].name)
          this.cross.series[0].data.push(data[i].type1Count)
          this.cross.series[1].data.push(data[i].type2Count)
          this.cross.series[2].data.push(data[i].type3Count)
          this.cross.series[3].data.push(data[i].type4Count)
        }
      },
      _fetchAlarmData: debounce(async function () {
        const data = await Api.getAlarmData.get(this.alarmFilter
        ).then(res => res.data)
        data.rows.map(item => {
          item.alarmTime = moment(item.alarmTimeStr).format("YYYY-MM-DD HH:mm:ss");
        })
        this.tableData4 = data.rows
        if (this.alTotal == 1) {
          this.alarmTotal = data.total
        }
        this.getAlarmTime(data.rows)
      }, 100),

      // 机构选择
      selectOrgId: function (node) {
        this.orgName = node.name;
        this.organId = node.id;
        this.eventFilter.organId = this.organId;
        this.alarmFilter.organPath = node.path;
        this.alarmCensusFilter.organId = this.organId;
        this.eventCensusFilter.organId = this.organId;
        this.eventStatistcsFilter.organId = this.organId;
        this._fetchEventsData();
        this._fetchAlarmData();
        this._fetchEventCensus();
        this._fetchAlarmCensus();
        this._fetchEventStatistcs();
        this.$refs.poppoverBox.doClose()
      },
      //机构树
      _fetchOrganData: debounce(async function () {
        const data = await Api.organTree.get({}).then(data => data.data.result)
        this.organTreeListData = [data] || []
        this.organId = this.organTreeListData[0].id
        this.orgName = this.organTreeListData[0].name;
      }, 100),
      async handleClick(row) {
        //报警盘
        if (row.alarmType1 == 5) {
          this.alarmTitle = `${row.alarmName}`
          this.deviceAlarmModel.feedbackContent = '';
          this.alarmDetails = row;
          this.alarmDetailsExtend = row.extend;
          this.alarmRecord = true;
          if (row.status == 1) {
            this.mesgBoxShow = true;
            this.ManagementShow = false
          } else if (row.status == 0) {
            this.ManagementShow = true
            this.mesgBoxShow = false;
          }
        } else if (row.alarmType1 == 6 || row.alarmType1 == 7 || row.alarmType1 == 8 || row.alarmType1 == 9) {
          //物联网设备
          this.iotDeviceAlarmTitle = `${row.alarmName}`
          this.alarmDetails = row;
          this.alarmDetailsExtend = row.extend;
          console.log(this.alarmDetails)
          this.deviceAlarmModel.feedbackContent = '';
          this.iotDeviceAlarm = true;
          this.ignoreVIsble = row.alarmType1 == 9 ? true : false
        } else if (row.alarmType1 == 1) {
          const popAlarm = await Api.getPopAlarmById.get({}, {
            pathParams: {
              id: row.id
            }
          })
          this.popAlarmDetails = popAlarm.data.result
          this.dialogFormVisible = true;
        } else if (row.alarmType1 == 2) {
          const vAlarm = await Api.getVehicleAlarmById.get({}, {
            pathParams: {
              id: row.id
            }
          })
          this.vehicleDetails = vAlarm.data.result
          this.dialogVehicleFormVisible = true;
        }
      },
      getTime(mss) {
        for (var i = 0; i < mss.length; i++) {
          if (mss[i].eventStatus == 2) {
            var handleTime = mss[i].handleTime
            var time1 = Date.parse(handleTime);
            var reportTime = mss[i].reportTime
            var time2 = Date.parse(reportTime);
            var timeOver = time1 - time2
            var days = parseInt(timeOver / (1000 * 60 * 60 * 24));
            var hours = parseInt((timeOver % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((timeOver % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (timeOver % (1000 * 60)) / 1000;
            var duration = days + " 天 " + hours + " 小时 " + minutes + " 分钟 "
            if (days < 1) {
              duration = hours + " 小时 " + minutes + " 分钟 "
            }
            if (days < 1 && hours < 1) {
              duration = minutes + " 分钟 "
            }
            this.tableData3[i].reportTime = duration
            if (mss[i].handleTime == null) {
              this.tableData3.reportTime = null
            }
          }
        }
      },
      getAlarmTime(mss) {
        for (var i = 0; i < mss.length; i++) {
          if (mss[i].alarmState == 2) {
            var feedbackTime = mss[i].feedbackTime;
            var time1 = Date.parse(feedbackTime);
            var alarmTimeStr = mss[i].alarmTimeStr
            var time2 = Date.parse(alarmTimeStr);
            var timeOver = time1 - time2
            var days = parseInt(timeOver / (1000 * 60 * 60 * 24));
            var hours = parseInt((timeOver % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((timeOver % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (timeOver % (1000 * 60)) / 1000;
            var duration = days + " 天 " + hours + " 小时 " + minutes + " 分钟 "
            if (days < 1) {
              duration = hours + " 小时 " + minutes + " 分钟 "
            }
            if (days < 1 && hours < 1) {
              duration = minutes + " 分钟 "
            }
            this.tableData4[i].alarmTimeConsume = duration
          }
          if (mss[i].feedbackTime == null) {
            this.tableData4[i].alarmTimeConsume = null
          }
        }
      },
      goAlarmDetails(row) {
        if (row.alarmType1 == 5) {
          this.$router.push({name: 'alarmRecord', params: {organPath: this.alarmFilter.organPath}})
        } else if (row.alarmType1 == 6) {
          this.$router.push({name: 'smokeAlarm', params: {organPath: this.alarmFilter.organPath}})
        } else if (row.alarmType1 == 7) {
          this.$router.push({name: 'fireHydrantAlarm', params: {organPath: this.alarmFilter.organPath}})
        } else if (row.alarmType1 == 8) {
          this.$router.push({name: 'wellCoverAlarm', params: {organPath: this.alarmFilter.organPath}})
        } else if (row.alarmType1 == 1) {
          this.$router.push({name: 'populationAlarm'})
        } else if (row.alarmType1 == 2) {
          this.$router.push({name: 'alarm'})
        } else if (row.alarmType1 == 3) {
          this.$router.push({name: 'nonMotorizedRecord'})
        } else if (row.alarmType1 == 9) {
          this.$router.push({name: 'offlineAlarmRecord', params: {organPath: this.alarmFilter.organPath}})
        }
      },
      handleEvent(row) {
        if (row.eventStatus == 1) {
          this.$router.push({name: 'eventHandle', params: {eventId: row.id, type: 1}})
        } else {
          this.$router.push({name: 'eventRecord'})
        }
      },

      async handleAlarm(eventId, alarmId, state) {
        this.$confirm(state === 2 ? `确定忽略此告警？` : '标记为嫌疑人', '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.handleAlarm.put({}, {
            pathParams: {
              eventId: eventId,
              alarmId: alarmId,
              state: state //0无法使用URL传输，传2
            }
          }).then(res => {
            this.$message({message: '操作成功', type: 'success'})
            this.dialogFormVisible = false
            this.refreshData();
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '操作失败!'
            })
            this.dialogFormVisible = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
          this.dialogFormVisible = false
        })
      },
      addPosition:function(type = 2) {
        Api.deviceAlarm.put(this.deviceAlarmModel, {
          pathParams: {
            id: this.alarmDetails.id,
            alarmState: type //确认2 //忽略 3
          }}).then(res => {
          this.mesgBoxShow = false;
          this.iotDeviceAlarm = false;
          this.$message({message: '确认成功', type: 'success'})
          this.refreshData();
          bus.$emit('alarmDataNum', null)
        }).catch(()=>{})
      },

      panelHandle(item) {
        let state=item.status == 0?1:2
        Api.deviceAlarm.put(this.deviceAlarmModel, {
          pathParams: {
            id: this.alarmDetails.id,
            alarmState: state
          }
        }).then(res => {
          this.mesgBoxShow = false;
          this.alarmRecord = false;
          this.refreshData()
          bus.$emit('alarmDataNum', null)
          if (state == 1) {
            this.$message({message: '确认成功', type: 'success'})
          } else {
            this.$message({message: '反馈成功', type: 'success'})
          }
        })
      },
      goEventDetails(row) {
        this.$router.push({name: 'eventFeedback', params: {eventId: row.id, type: 1}})
      },
      async mark(id, isSuspect) {
        this.$confirm(isSuspect === 2 ? `确定忽略此告警？` : '标记为嫌疑人', '提示', {
          type: 'warning'
        }).then(async () => {
          const data1 = await Api.mark.put({
            id: id,
            isSuspect: isSuspect
          }, {
            loadingMaskTarget: '.tableShow'
          }).then(() => {
            if (isSuspect == 1) {
              this.$message({message: '已标记为嫌疑车辆', type: 'success'})
            } else {
              this.$message({message: '已忽略', type: 'success'})
            }
            this.loading = false
            this.dialogVehicleFormVisible = false
            this.refreshData();
          }).catch(err => {
            this.loading = false
            throw err
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      },

      newEvent(i) {
        if (i == 1) {
          this.eventTotal = 1;
          this.stayShow = true;
          this.alreadyShow = false;
          this.eventFilter.eventStatus = 1;
          this._fetchEventsData();
          this.tableData3Show1 = true;
          this.tableData3Show2 = false;

        } else {
          this.eventTotal = 2;
          this.stayShow = false;
          this.alreadyShow = true;
          this.eventFilter.eventStatus = 2;
          this._fetchEventsData();
          this.tableData3Show2 = true
          this.tableData3Show1 = false
        }
      },
      newAlarm(i) {
        if (i == 1) {
          this.alTotal = 1;
          this.stayAlarm = true;
          this.alreadyAlarm = false;
          this.alarmFilter.isNoHandle = 1;
          this._fetchAlarmData();
          this.tableData4Show1 = true
          this.tableData4Show2 = false
        } else {
          this.alTotal = 2;
          this.stayAlarm = false;
          this.alreadyAlarm = true;
          this.alarmFilter.isNoHandle = 2;
          this._fetchAlarmData();
          this.tableData4Show1 = false
          this.tableData4Show2 = true
        }
      },
      refreshData() {
        this.newEvent(1);
        this.newAlarm(1);
        this._fetchEventCensus();
        this._fetchAlarmCensus();
        this._fetchEventStatistcs();
      },
      rentingDay(i) {
        if (i == 1) {
          this.todayShow = true;
          this.sevenShow = false;
          this.thirtyShow = false;
          this.alarmCensusFilter.type = i;
          this.eventCensusFilter.type = i;

        } else if (i == 2) {
          this.todayShow = false;
          this.sevenShow = true;
          this.thirtyShow = false;
          this.alarmCensusFilter.type = i;
          this.eventCensusFilter.type = i;
        } else {
          this.todayShow = false;
          this.sevenShow = false;
          this.thirtyShow = true;
          this.alarmCensusFilter.type = i;
          this.eventCensusFilter.type = i;
        }
        this._fetchEventCensus();
        this._fetchAlarmCensus();
      },
      _fetchEchartData: debounce(async function () {
        const data = await Api.getDistrictStatistics
          .get(
            {},
            {
              pathParams: {
                id: 2323,
                type: 1
              }
            }
          )
          .then(data => data.data.result);
        //   this.$refs.pie.resize();
        //   this.houseListData=data
        //   this.pie.series[0].data[0].value=data.leaseCount
        //   this.pie.series[0].data[1].value=data.selfOccupiedCount
        //   this.pie.series[0].data[2].value=data.vacantCount
        //   let selfOccupiedCount=data.selfOccupiedCount || 0
        //   let vacantCount=data.vacantCount || 0
        //   let leaseCount=data.leaseCount || 0
      }, 100),
      async videoData(isRoot, parentId) {
        let filter = {}
        filter.parentId = parentId;
        if (isRoot) filter.isRoot = 1;
        const data = await Api.getEquipmentList.get(filter).then(res => res.data.rows)
        this.data = data;
      },
      loadNode(node, resolve) {
        if (node.data.naming) {
          return resolve([]);
        }
        if (node.level == 0) {
          let organId = JSON.parse(sessionStorage.getItem('user')).organId;
          this.videoData(true, organId);
        } else {
          Api.getEquipmentList.get({parentId: node.key}).then(res => {
            res.data.rows.forEach(item => {
              if (item.hasOwnProperty("naming")) item.leaf = true
            })
            resolve(res.data.rows);
          })
        }
      },
      select(index) {
        this.index = index
        this.num = 'index' + index

        this.videoChoice = true
      },
      stop(index) {
        if (index === 1) {
          videojs('video1').src('')
          videojs('video1').play()
        }
        if (index === 2) {
          videojs('video2').src('')
          videojs('video2').play()
        }
        if (index === 3) {
          videojs('video3').src('')
          videojs('video3').play()
        }
        if (index === 4) {
          videojs('video4').src('')
          videojs('video4').play()
        }
      },
      nodeClick(item) {
        if (!item.naming) return false
        if (this.index === 1) this.loading1 = true
        if (this.index === 2) this.loading2 = true
        if (this.index === 3) this.loading3 = true
        if (this.index === 4) this.loading4 = true
        Api.getVideoRtmp.get({
          naming: item.naming
        }).then(res => {
          // this.videoChoice=false
          // 视频点击次数上传
          let rtmp = res.data.msg + '\\';
          setTimeout(() => {
            this.$message({message: '请求成功', type: 'success'});
            if (this.index === 1) {
              this.loading1 = false
              videojs('video1').src('')
              videojs('video1').src(rtmp)
              videojs('video1').play()
              this.videoChoice = false
            }
            if (this.index === 2) {
              this.loading2 = false
              videojs('video2').src('')
              videojs('video2').src(rtmp)
              videojs('video2').play()
              this.videoChoice = false
            }
            if (this.index === 3) {
              this.loading3 = false
              videojs('video3').src('')
              videojs('video3').src(rtmp)
              videojs('video3').play()
              this.videoChoice = false
            }
            if (this.index === 4) {
              this.loading4 = false
              videojs('video4').src('')
              videojs('video4').src(rtmp)
              videojs('video4').play()
              this.videoChoice = false
            }

          }, 1500)
          this.setUserConfigVideoList(item)

        }).catch(() => {
          // this.$message({message: '视频加载失败', type: 'error'});
          this.loading1 = false
          this.loading2 = false
          this.loading3 = false
          this.loading4 = false
          this.videoChoice = false
        })
        //this.videoList.push('rtmp://202.69.69.180:443/webcast/bshdlive-pc');
      },

      async setUserConfigVideoList(item) {
        const data = await Api.setUserConfigVideoList.put({}, {
          pathParams: {
            naming: item.naming,
            num: this.num,
            userId: this.userId,
          }
        }).then(res => res.data).catch(() => {
          //视频加载失败
        })
      },
      selectAlarm() {
      },
      trajectoryPageChange(val) {
        this.trajectoryFilter.page = val;
        // this._fetchTrajectoryData();
      },
    },
    beforeRouteLeave(to, from, next) {
      videojs('video1').dispose()
      videojs('video2').dispose()
      videojs('video3').dispose()
      videojs('video4').dispose()
      next()
    },
    // orgNodeClick([item = {}]){
    //   this.filter.organId = item.id || ''
    //   this._fetchVideoData()
    // },

  }

</script>
<style lang="less">
  .tableBox {
    overflow-y: auto !important;
    box-sizing: border-box;

    .index-select-organId {
      width: 200px;
      padding: 5px 0 0px 10px;
    }
  }

  .tableTopBox {
    height: 9%;
    .el-input--suffix .el-input__inner {
      margin-left: 5%;
      margin-top: 3%;
    }
  }

  .zhsq-boxWrapper {
    height: 99%;
    width: 100%;
    .zhsq-right-con {
      height: 100%;
      width: 100%;
    }
    .tableBox {
      height: 100%;
      width: 100%;
    }
  }

  .tableBottomBox {
    height: 90%;
    width: 96%;
    .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
      white-space: nowrap
    }
    .el-table td, .el-table th {
      padding: 0;
    }
    .vjs-icon-pause, .video-js .vjs-play-control.vjs-playing {
      display: none;
    }
    .el-col-12 {
      height: 100%;
    }
    .tableBottomBoxL {
      margin-top: 5px;
      width: 100%;
      height: 100%;
      margin-left: 10px;
      .indexWorkLBox1 {
        border-radius: 5px;
        width: 100%;
        height: 33%;
        border: 1px solid #ededed;
        // background: #c9c9ce;
        .LBox1Title {
          display: flex;
          width: 100%;
          height: 20%;
          p {
            font-size: 12px;
            width: 50%;
            margin-left: 5px;
            span {
              margin-top: 10px;
              text-align: center;
              display: inline-block;
              width: 28%;
              padding-top: 5px;
              padding-bottom: 5px;
              background: #c2d0ee;
              color: #fff;
            }
            .span1 {
              background: #567acd !important;
            }
            .span2 {
              background: #a0b5e5;
            }
            // .span3{
            //     background: #c2d0ee;
            // }
          }
        }
        .LBox1Top {
          display: flex;
          width: 100%;
          height: 48%;
          .titleContent {
            width: 31%;
            display: flex;
            background: #fff;
            margin-left: 8px;
            margin-bottom: 10px;
            justify-content: space-between;
            margin-top: 3%;
            border-radius: 3px;
            box-shadow: 10px 10px 20px #888888;
            p {
              font-size: 12px;
              margin-top: 4px;
            }
          }
        }
        .LBox1Bottom {
          width: 100%;
          display: flex;
          height: 36%;
          .titleContent {
            width: 31%;
            justify-content: space-between;
            display: flex;
            background: #fff;
            margin-left: 8px;
            margin-bottom: 10px;
            box-shadow: 5px 5px 5px #888888;
            border-radius: 3px;
            p {
              margin-top: 4px;
              font-size: 12px;
            }
          }
        }
      }
      .indexWorkLBox2 {
        border-radius: 5px;
        margin-top: 1%;
        height: 32%;
        width: 100%;
        border: 1px solid #ededed;
        .aghouseTenant {
          width: 100%;
          height: 100%;
          border-radius: 5px;
          position: relative;
          .mapTitle {
            position: absolute;
            top: 5px;
            left: 10px;
            z-index: 2;
          }
          .conditionBtn {
            position: absolute;
            top: 0px;
            right: 10px;
            font-size: 10px;
            color: white;
            z-index: 3;
            span {
              padding: 2px 5px;
              background: #c3d1ef;
            }
            .activeBtn {
              background: #5678cc;
            }
          }
        }
      }
      .indexWorkLBox3 {
        border-radius: 5px;
        margin-top: 1%;
        height: 32%;
        width: 100%;
        border: 1px solid #ededed;
        // overflow-y: auto;
        position: relative;
      }
    }
    .tableBottomBoxR {
      margin-top: 5px;
      width: 100%;
      height: 99%;
      margin-left: 5%;
      .indexWorkRBox1 {
        width: 100%;
        border: 1px solid #ededed;
        height: 66%;
        border-radius: 5px;
      }
      .indexWorkRBox2 {
        border-radius: 5px;
        margin-top: 1%;
        width: 100%;
        border: 1px solid #ededed;
        // overflow-y: auto;
        height: 33%;
        position: relative;
      }
    }
  }

  .optionNav {
    position: absolute;
    display: flex;
    top: 0px;
    right: 0px;
    font-size: 12px;
    p {
      background: #c3d1ef;
      width: 80px;
      color: #fff;
      text-align: center;
    }
  }

  .top-icon {
    display: inline-block;
    width: 4px;
    height: 14px;
    background: #184DA8;
    margin-right: 5px;
  }

  .video-js {
    width: 99%;
    height: 96%;
  }

  .videoBox {
    position: relative;
    height: 100%;
  }

  .video-control {
    position: absolute;
    left: 10px;
    bottom: 9px;
    z-index: 20;
  }

  .titleContentImg {
    margin-top: 5%;
    margin-right: 3%;
    img {
      // width: 100%;
      height: 90%;
    }
  }

  .newEvent {
    background: #5678cc !important;
  }

  .newAlarm {
    background: #5678cc !important;
  }

  .tableTopBox {

    .el-input--suffix .el-input__inner {
      margin-left: 5%;
      margin-top: 3%;
    }
  }

  .indexWorkTree {
    .zhsq-tree-slot {
      font-size: 14px;
      .community-icon {
        background: url("../../assets/images/commom/shexiangtou.png") no-repeat left top;
        padding-left: 22px;;
      }
      .organType-icon {
        background: url("../../assets/images/commom/xiaoqu.png") no-repeat left center;
        padding-left: 22px;;
      }
    }
  }

  video::-webkit-media-controls {
    display: none !important;
  }

  .color5678cc {
    color: #5678cc;
    // font-weight: 600;
  }

  .colorf94a66 {
    color: #f94a66
  }

  .el-table--border th.gutter:last-of-type {
    background: #eef1f6 !important
  }

  .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    text-align: center
  }

  .contentBox {
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

  .titleContentText {
    // position: relative;
    //   top: 50%;
    //   margin-top: -10%;
    //   left: 10%;
    padding-left: 3%;
    position: relative;
    width: 70%;
  }

  .topText {
    width: 100%;
    position: absolute;
    left: 10%;
    top: 5%;
  }

  .bottomText {
    position: absolute;
    bottom: 0%;
    margin-top: -10%;
    left: 10%;
  }
</style>
