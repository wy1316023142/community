<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">异常记录</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.populationName" clearable></el-input>
            <el-select v-model="filter.status" placeholder="人员类型" clearable>
            <el-option v-for="item in allState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <div class="abnorma-list" :style="{height: scrollerHeight}">
                  <div class="houseDetails" >
                <div class="details" v-for='(item,index ) in data  ' :key='index'>
                  <!-- <div v-for='(item1,index1 ) in item.extend  ' :key='index1'> -->
                     <img :src='item.populationPhotoPath' alt="">
                    <ul>
                        <li>
                         <el-row>
                            <el-col :span="8"><p><span>{{item.populationName}} </span></p></el-col>&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-col :span="12"><p><span>{{item.populationTel}}</span></p></el-col>
                         </el-row>
                        </li>
                        <li>连续{{item.noAppearDays}}天未出现</li>
                        <li v-if='item.status == 1'>状态：<span>异常</span></li>
                        <li v-if='item.status == 2'>状态：<span>已解除异常</span></li>
                        
                        <li>
                            <el-row>
                            <el-col :span="8" style="margin-right:30px">
                                  <el-button  size="small" v-if='item.status == 1' @click="delAbnorm(item.id,item.handleExtend1)">解除异常</el-button>
                            </el-col>
                            <el-col :span="12">
                                  <el-button type="primary" size="small"  @click="gooutRecords(item.id)">查看详情</el-button>
                            </el-col>
                         </el-row>
                        </li>
                    </ul>
                  <!-- </div> -->
                    
                </div>
            </div>
              </div>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.size' :current-page='filter.current'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 查看详情 -->
     <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
      <div class="content">
         <div class="content">
          <div class="details-abnorma">
              <img :src="dataDeteil.populationPhotoPath" alt="">
              <!-- <img src="../../assets/images/person.png" alt=""> -->
              <ul>
                  <li>连续{{dataDeteil.noAppearDays}}天未出现</li>
                  <li>{{dataDeteil.populationName}},{{dataDeteil.populationTel}}</li>
                  <li>{{dataDeteil.personType}}</li>
                  <li >状态：{{dataDeteil.states}}</li>
              </ul>
          </div>
          <ul class="details-list">
            <el-row>
             <el-col :span="24"> <li>最近出现时间：<span>{{dataDeteil.latelyAppearTime}}</span></li></el-col>
            </el-row>
            <el-row>
            <el-col :span="24"><li>住址：<span>{{dataDeteil.houseAddress}}</span></li></el-col>
            </el-row>
            <el-row>
            <el-col :span="24"> <li>核实情况说明：<span>{{dataDeteil.handleExtend1}}</span></li></el-col>
            </el-row>
            
          </ul>
      </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false"> 关闭</el-button>
        <el-button @click="dialogCodeVisible = false" v-if='dataDeteil.states == 1'> 解除异常</el-button>
        
      </div>
    </el-dialog>
    
   
    
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import {
  validateIdCard,
  validatePhone,
  validateBlackSpace
} from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import moment from "moment";
import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
import { domHeightMixin } from "../../commom/mixins.js";
import { getBase64, convert2JPEG } from "../../commom/util.js";
import { log, debuglog } from "util";
export default {
  mixins: [domHeightMixin],
  name: "vehicle",
  components: {
    ElDialog,
    OrganTree
  },
  data() {
    return {
      fileList: [],
      fileHeader: {},
      dialogCodeVisible: false,
      dialogCode: "详情",
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [
        {
          name: "张三",
          tel: "511322199909151451",
          remarks: "皇冠国际小区皇冠国际小区",
          url: require("../../assets/images/photo.png")
        }
      ],
      addSeach: "",
      model: {
        imgStr: "",
        name: "",
        phone: ""
      },
      total: 0,
      filter: {
        organId: 0,
        size: 10,
        current: 0,
        name:""
      },
      dataDeteil:{},
      firstErr: null,
      loading: false,
      time: [],
      allState: [
        { id: 1, label: "异常" },
        { id: 2, label: "已解除异常" },
       
      ],
       data:[ ],

    };
  },
  computed: {
    
    scrollerHeight: function() {
      return (window.innerHeight -300) + 'px';
    }
  },
  mounted() {

    //table高度
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 56;
     
      window.onresize = () => {
        this.$refs.abnormaList.offsetHeight = this.tabHeight
      };
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.noAppearAlarmByPage.get(this.filter, {
        loadingMaskTarget: ".tableBox"
      }).then(res => res.data);
      this.data = []
      if (data.result.records.length > 0) {
          data.result.records.forEach(element => {
            element.extend = JSON.parse(element.extend)
            if(element.status){
                element.extend.status = element.status
                element.extend.id = element.id
                element.extend.handleExtend1 = element.handleExtend1
             }
             if(element.extend.noAppearDays){
                element.extend.noAppearDays = Math.round(element.extend.noAppearDays)
             }
             this.data.push( element.extend)
        });
      }
      this.total =data.result.total;
    }, 100),
    pageChange(val) {
      this.filter.current = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    
    gooutRecords(id) {
      this.dialogCodeVisible = true;
       Api.noAppearAlarmByPage.get(this.filter,{ }).then(res=>{
         res.data.result.records.map(i=>{
          if( i.id == id){
            this.dataDeteil =JSON.parse(i.extend)
            if(i.status ==1){
              this.dataDeteil.states = '异常'
            }else if(i.status ==2){
              this.dataDeteil.states = '已解除异常'
            }
            this.dataDeteil.handleExtend1 = i.handleExtend1? i.handleExtend1:'暂无'
          }
         })
        })
    },
                
    delAbnorm(id,handleExtend){
      Api.outAlarmState.put({id,handleExtend1:'暂无'},{ }).then(res=>{
           this.$message({message: '解除成功', type: 'success'})
            this._fetchData()
        })
    },
    changeDate(val) {
      if (val == null) {
        this.filter.startDateStr = "";
        this.filter.endDateStr = "";
        this._fetchData();
      } else {
        this.filter.startDateStr = moment(this.time[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.filter.endDateStr = moment(this.time[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    }
  }
};
</script>
<style lang="less">
.pageBox1 {
  display: flex;
  flex-direction: row-reverse;
}
.tableBox{
    .abnorma-list{
       overflow-y: scroll; 
         .houseDetails{
      display: flex;
       flex-wrap:wrap;
      //  overflow-y: scroll; 
    .details{
      width: 44%;
      display: flex;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 20px 20px 0 0 ;
      padding: 30px;
      img{
          width: 100px;
          height: 160px;
          margin-right: 30px;
      }
      li{
          line-height: 40px;
      }

  }
 }
    }

} 
.details-list{
  li{
    line-height: 30px;
          font-size: 16px
    
  }
}
 .details-abnorma{
     width:100%;
      display: flex;
       li{
          line-height: 30px;
          font-size: 16px
      }
 }
</style>
