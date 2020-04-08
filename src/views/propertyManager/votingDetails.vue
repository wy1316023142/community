<template>
<!-- import { longStackSupport } from 'q'; -->
    <div class="zhsq-innerBody" ref="innerBody">
        <div class="zhsq-innerTop flex" >
            <span class="top-icon"></span>
            <span class="title">投票活动管理>详情</span>
            <div class="text_r flexItem">
                <el-button type="primary" @click=" back()" size="small" >返回</el-button>
            </div>
        </div>
        <el-col class="zhsq-boxWrapper"   >
            <el-row :gutter="35" style="height: 100%">
                <el-col :span="24" >
                    <el-card shadow="never" style="height: 100%;overflow: auto;">
                        <el-col :span="12">
                            <div class="flex">
                                <h3>{{votingDetaolsData.activityName }}</h3>
                                <div class="voting-time">{{votingDetaolsData.endTime}}结束</div>
                            </div>
                            <div class="font">
                                <p>状 &nbsp;&nbsp;&nbsp;&nbsp;态：{{votingDetaolsData.status | votingState}}</p>
                                <p>投票区域：{{activityAreas}}</p>
                            </div>
                        </el-col>
                        <el-col :span="24">
                            <el-card shadow="never" style="height: 100%">
                                 <span class="top-icon"></span>
                                 <span class="title">{{ votingTitle }}</span>
                                 <!-- 表格 -->
                                <div class="routine mt16 tableBox" v-show="isShow" >
                                     <el-table
                                        :data="tableData"
                                        border
                                        style="width: 100%"
                                        :height="tableHeight"
                                        >
                                        <el-table-column
                                        prop="date"
                                        label="排名"
                                        align='center'
                                        type="index"
                                        width="120">
                                        </el-table-column>
                                        <el-table-column
                                        prop="name"
                                        label="姓名"
                                        align='center'
                                       >
                                        </el-table-column>
                                        <el-table-column
                                        prop="photo"
                                        label="头像"
                                        align='center'>
                                         <template scope="scope">
                                            <img :src="scope.row.photo" width="40" height="40" />
                                        </template>
                                        </el-table-column>
                                         <el-table-column
                                        prop="number"
                                        label="编号"
                                        align='center'>
                                           <template slot-scope="scope" >
                                            {{scope.row.number}}号
                                            </template>
                                        </el-table-column>
                                         <el-table-column
                                        prop="ballotCount"
                                        label="票数"
                                        align='center'>
                                           <template slot-scope="scope" >
                                            {{scope.row.ballotCount}}票
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <!-- <el-pagination class="page-box"  @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination> -->
                                </div>
                                <!--  -->
                                <div class="vote" v-show="!isShow" >
                                  <el-row class="flex ">
                                    <el-col :span="12" >
                                      <p class="pkFontLeft">{{numberOpposition}}票 &nbsp;&nbsp;&nbsp;&nbsp;{{percentOpposition}}</p>
                                    </el-col>
                                    <el-col :span="12">
                                            <p  class="pkFontRight">{{ numberAgree}}票 &nbsp;&nbsp;&nbsp;&nbsp;{{percentAgree}}</p>
                                    </el-col>
                                          
                                  </el-row>
                                  <el-row :gutter="35" class="pk-box" >
                                        <el-col :span="9" class=" pk"  ref="line1">
                                            <div class='line-left color-ccc '>
                                                <div :style="{width:widthagree}">
                                                </div>
                                                <div  class='line1   color-bule' :style="{width:widthoppostion}" >
                                                </div>
                                            </div>
                                        </el-col>
                                        <el-col :span="4" class="flex vs">
                                            <h4>v<span>s</span></h4>
                                        </el-col>
                                        
                                        <el-col :span="9" class=" pk" ref="line2" >
                                            <div class='line-right color-ccc' >
                                              <div class='line2 color-red' :style="{width:widthagree}" >
                                              </div>
                                            </div>
                                        </el-col>
                                  </el-row>
                                  <el-row class="flex ">
                                    <el-col :span="12">
                                      <div class="agree-box color-bule shadow-bule">
                                        <h5>{{ nameOpposition}}</h5>
                                        <p>投票数</p>
                                      </div>
                                    </el-col>
                                    <el-col :span="12">
                                      <div class="opposition-box color-red shadow-red">
                                         <h5>{{ nameAgree}}</h5>
                                        <p>投票数</p>
                                      </div>
                                    </el-col>
                                  </el-row>
                                </div>
                            </el-card>  
                        </el-col>
                    </el-card>
                </el-col>
            </el-row>
        </el-col>
    </div>

</template>

<script>
export default {
  data() {
    return {
      votingTitle: "选举投票排行榜",
      tableData: [],
      filter: {
        organId: 0,
        page: 10,
        rows: 0
      },
      total: 0,
      tabHeight: "",
      agreeBoxWidth: "",
      oppostionBoxWidth: "",

      widthagree: "0px",
      widthoppostion: "0px",
      width: "",
      tableHeight: window.innerHeight * 0.5,
      isShow: true,
      votingDetaolsData: {},
      activityAreas: "",
      // ballot:[],
      ballotData: [],
      numberAgree: "",
      percentAgree: "",
      nameAgree: "",
      numberOpposition: "",
      percentOpposition: "",
      nameOpposition: ""
    };
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
      this.agreeBoxWidth = this.$refs.line1.$el.clientWidth;
      this.oppostionBoxWidth = this.$refs.line2.$el.clientWidth;
      this.a();
    });
    this.isShow = this.$route.query.isShow;
    this.votingDetaolsData = this.$route.query.votingDetaolsData;
    this.activityAreas = this.votingDetaolsData.activityAreas.join(",");

    if (this.isShow) {
      this.votingTitle = "选举投票排行榜";
    } else {
      this.votingTitle = "表决投票情况";
    }
  },
  methods: {
    back() {
      this.$router.push({ path: "/propertyManager/voting" });
    },
    pageChange(val) {
      this.filter.rows = val - 1;
      this._fetchData();
    },
    a() {
      if (!this.isShow) {
        this.ballotData = this.votingDetaolsData.ballot;
        this.numberAgree = this.ballotData[1].ballotCount;
        this.percentAgree = this.ballotData[1].percent;
        // this.percentAgree = '0.00%'//同意百分比
        this.nameAgree = this.ballotData[1].name;
        this.numberOpposition = this.ballotData[0].ballotCount;
        this.percentOpposition = this.ballotData[0].percent;
        // this.percentOpposition='100.00%' //反对百分比
        this.nameOpposition = this.ballotData[0].name;
        this.widthoppostion =
          this.oppostionBoxWidth * parseInt(this.percentOpposition) * 0.01 +
          "px";
        this.widthagree =
          this.agreeBoxWidth * parseInt(this.percentAgree) * 0.01 + "px";
      } else {
        this.tableData = this.votingDetaolsData.ballot;
      }
    }
  }
};
</script>

<style >
.tableBox {
}
.page-box {
  margin: 10px 20px 10px 0;
  display: flex;
  justify-content: flex-end;
}
h3 {
  color: #344fb1;
  font-size: 30px;
}
.voting-time {
  line-height: 30px;
  width: 260px;
  margin-left: 20px;
  text-align: center;
  border-radius: 16px;
  color: #fff;
  background: #f2aa5b;
}
.font {
  margin: 20px 0;
}
.font p {
  margin: 10px 0;
}
.top-icon {
  display: inline-block;
  width: 4px;
  height: 14px;
  background: #184da8;
}
.title {
  color: #3b3d58;
  margin-left: 10px;
}
.vote {
  height: 420px;
  background-image: url("../../assets/images/voting-bg.jpg");
  background-size: 100% 100%;
}
.vote .pk-box {
  margin: 0px 0 40px 0;
  display: flex;
  justify-content: space-around;
}
.vote h4 {
  font-size: 50px;
  line-height: 50px;
  color: #184da8;
  padding: 0 55px;
}
.vote h4 span {
  color: #ee6e68;
}
.line-left {
  height: 50px;
  transform: skew(-315deg);
  display: flex;
}
.line-right {
  height: 50px;
  transform: skew(315deg);
  display: flex;
}
.pkFontLeft {
  width: 30%;
  color: #344fb1;
  font-size: 20px;
  transform: translateX(170%);
  margin: 10px 0;
}
.pkFontRight {
  width: 30%;
  color: #ee6e68;
  font-size: 20px;
  transform: translateX(80%);
  margin: 10px 0;
}
.line1 {
  height: 50px;
}
.line2 {
  height: 50px;
}
.pk {
  justify-content: space-around;
}
.agree-box,
.opposition-box {
  width: 90px;
  height: 90px;
  border-radius: 45px;
  margin: 0 auto;
  color: #fff;
  font-size: 12px;
  text-align: center;
}
h5 {
  color: #fff;
  padding-top: 20px;
  padding-bottom: 5px;
  text-align: center;
  font-size: 20px;
}

.color-ccc {
  background: -webkit-linear-gradient(#fbfbfb, #dedede); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#fbfbfb, #dedede); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#fbfbfb, #dedede); /* Firefox 3.6 - 15 */
  background: linear-gradient(#fbfbfb, #dedede); /* 标准的语法 */
}
.color-bule {
  background: -webkit-linear-gradient(#a0bbf8, #1a44a1); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#a0bbf8, #1a44a1); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#a0bbf8, #1a44a1); /* Firefox 3.6 - 15 */
  background: linear-gradient(#a0bbf8, #1a44a1); /* 标准的语法 */
}
.color-red {
  background: -webkit-linear-gradient(#faafac, #ee6e68); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#faafac, #ee6e68); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#faafac, #ee6e68); /* Firefox 3.6 - 15 */
  background: linear-gradient(#faafac, #ee6e68); /* 标准的语法 */
}
.shadow-bule {
  box-shadow: #a0bbf8 0px 0px 5px 2px;
}
.shadow-red {
  box-shadow: #faafac 0px 0px 5px 2px;
}
</style>