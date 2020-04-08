<template>
  <div>
    <div class="dashboard-content" id="content" ref="content">
      <div class="map">

      </div>
      <!-- <div class="top-shadow"></div>-->
      <div class="head">
        <div class="time flexItem">
          <img src="@/assets/images/dashboard/dashboard1/clock.png">
          <span class="nowTime">{{nowTime}}</span>
          <span class="nowDate">{{nowDate}}<br/>{{nowWeek}}</span>
        </div>
        <div class="title flexItem center" @click="dialogFormVisible=true">{{title}}</div>
        <div class="weather flexItem">
          <iframe scrolling="no" src="https://tianqiapi.com/api.php?style=ty&skin=durian&color=6DC5FF" frameborder="0" allowtransparency="true"></iframe>
        </div>
      </div>
      <div class="left-shadow"></div>
      <div class="right-shadow"></div>
      <div class="bottom">
        <div class="bottom-con">
          <el-row :gutter="22">
            <el-col :span="4"  class="dashboard">

            </el-col>
            <el-col :span="8" class="dashboard">

            </el-col>
            <el-col :span="8" class="dashboard">

            </el-col>
            <el-col :span="4" class="dashboard">

            </el-col>
          </el-row>
        </div>

      </div>
      <div class="left-con box">
        <div class="box-top dashboard">
          <h3>一标三实</h3>
          <pho-number></pho-number>
        </div>
        <div class="box-bottom dashboard" >
          <h3 >今日实有警情事件统计</h3>
          <alarm-event></alarm-event>
        </div>
      </div>
      <div class="right-con box">
        <div class="box-top dashboard">
          <h3>物业负责人</h3>
        </div>
        <div class="box-bottom dashboard">
          <h3>出入口通行统计</h3>
        </div>
      </div>
      <div class="bottom-shadow">
        <div class="text">
          <div class="center">今日感知情况</div>
        </div>
      </div>
    </div>

    <!--选择机构-->
    <el-dialog title="选择机构" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body='false' width="500px">
      <el-tree
        ref="tree"
        :data="treeList"
        :props="defaultProps"
        highlight-current
        default-expand-all
        :default-checked-keys='defaultChecked'
        @node-click="nodeClick"
        :expand-on-click-node="false"
        node-key="id">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <!--<el-button type="primary" @click="treeSubmit">确 定</el-button>-->
      </div>

    </el-dialog>

  </div>

</template>

<script>
  import Api from '@/commom/api.js'
  import {cloneDeep} from 'lodash'
  import moment from 'moment'
  import phoNumber from '@/views/dashboard/components/phoNumber'
  import alarmEvent from '@/views/dashboard/components/alarmEvent'
  moment.locale('zh-cn')
  export default {
    components:{
      phoNumber,
      alarmEvent
    },
    name: 'dashborad1',
    data() {
      return {
        nowTime: moment().format('HH:mm:ss'),
        nowDate: moment().format('YYYY年MM月DD'),
        nowWeek: moment().format('dddd'),
        dialogFormVisible: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        treeList: [],
        title: '安翼社区',
      }
    },
    mounted() {
      setInterval(() => {
        this.nowTime = moment().format('HH:mm:ss')
        this.nowDate = moment().format('YYYY年MM月DD')
        this.nowWeek = moment().format('dddd')
      }, 1000)
      if (this.$route.query.organId) {
        this._fetchzhsqTreeList(this.$route.query.organId)
      }

    },
    methods: {
      _fetchzhsqTreeList: async function (organId) {
        const data = await  Api.bigscreenTreeList.get({
          organId: organId
        }).then(res => res.data.result)
        this.treeList = [data]
      },
      nodeClick(node) {
        if (node.bsUrl) location.href = `${node.bsUrl}&organName=${node.name}&organId=${node.id}&parentId=${this.permissions.parentId}`
        this.formVisible = false
      },
    }
  }
</script>
<style lang="less" scoped>
  .dashboard-content {
    width: 1920px;
    height: 1080px;
    position: relative;
    .map {
      position: absolute;
      top: 78px;
      left: 0;
      width: 1920px;
      height: 739px;
      z-index: 1;
    }
    .head {
      width: 100%;
      height: 162px;
      background: url("../../assets/images/dashboard/dashboard1/head.png") no-repeat;
      position: absolute;
      display: flex;
      z-index: 100;
      .time {
        margin-top: 16px;
        padding-left: 30px;
        color: #6DC5FF;
        vertical-align: middle;
        img {
          display: inline-block;
          width: 31px;
          height: 31px;
          vertical-align: middle;
          margin-top: -19px;
          margin-right: 9px;
        }
        .nowTime {
          display: inline-block;
          font-size: 35px;
          margin-right: 9px;
        }
        .nowDate {
          display: inline-block;
          font-size: 12px;
        }
      }
      .title {
        width: 418px;
        height: 100px;
        color: #FCFAFB;
        font-size: 44px;
        font-weight: bold;
        background: url("../../assets/images/dashboard/dashboard1/title-bg.png") no-repeat bottom center;
        margin-top: 35px;
      }
      .weather {
        text-align: right;
        padding-right: 30px;
        padding-top: 11px;
        iframe {
          width: 190px;
        }
      }
    }
    .top-shadow {
      position: absolute;
      top: 0;
      left: 0;
      width: 1920px;
      height: 252px;
      background: url("../../assets/images/dashboard/dashboard1/s.png") no-repeat;
      z-index: 10;
    }
    .left-shadow {
      position: absolute;
      top: 0;
      left: 0;
      width: 228px;
      height: 1080px;
      background: url("../../assets/images/dashboard/dashboard1/z.png") no-repeat;
      z-index: 10;
    }
    .right-shadow {
      position: absolute;
      top: 0;
      right: 0;
      width: 228px;
      height: 1080px;
      background: url("../../assets/images/dashboard/dashboard1/y.png") no-repeat;
      z-index: 10;
    }
    .bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 1920px;
      height: 332px;
      background: url("../../assets/images/dashboard/dashboard1/bg-bottom.png") no-repeat;
      .bottom-con {
        box-sizing: border-box;
        padding: 0 30px;
        height: 240px;
        margin-top: 80px;
        .el-col {
          height: 240px;
        }
      }
    }
    .box {
      position: absolute;
      width: 340px;
      height: 654px;
      top: 118px;
      z-index: 100;
      h3 {
        color: #6dc5ff;
        font-size: 18px;
        font-weight: normal;
        padding-left: 45px;
        line-height: 42px;
      }
      .box-top {
        width: 100%;
        height: 304px;
        iframe {
          height: calc(100% - 44px);
        }
      }
      .box-bottom {
        width: 100%;
        height: 350px;
        iframe {
          height: calc(100% - 50px);
        }
      }
    }
    .left-con {
      left: 30px;
      background: url("../../assets/images/dashboard/dashboard1/left.png") no-repeat;
      transform: perspective(500px) rotateY(5deg);
    }
    .right-con {
      right: 30px;
      background: url("../../assets/images/dashboard/dashboard1/right.png") no-repeat;
      transform: perspective(500px) rotateY(-5deg);
    }
  }

</style>
