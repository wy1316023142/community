<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">网格员任务执行情况＞房屋信息采集情况</p>
      <div class="flexItem text_r">
             <el-button type="primary" size="small" @click='back()'>返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
       <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
         <div class="zhsq-tree-box">
            <h3>单元</h3>
            <div class="zhsqBackLine left9 top42"></div>
            <div class="zhsqTopLine left9 top42"></div>
            <el-tree class="zhsq-tree"
                     ref="tree"
                     :expand-on-click-node="true"
                     :data="unitList"
                     :props="defaultProps1"
                     @node-click="unitNodeClick"
                     :default-expanded-keys="defaultExpandKeys"
                     highlight-current
                     current-node-key
                     node-key="id">
                    <template class="zhsq-tree-slot" slot-scope="{ node, data }">
                       <span><img src="../../assets/images/house/45.png" v-if="data.parentId==null" style="padding-right: 5px;vertical-align: middle">{{ data.unitName }}</span>
                    </template>
            </el-tree>
          </div>
        </el-col>
        <el-col :span="19">
           <el-row style="height: 100%">
              <div class="zhsq-right-con" ref="content">
                <div class="tableBox house-con">
                  <el-row>
                    <el-col :span="24" class="br1">
                      <div class="unit-con" ref="unitCon">
                        <div ref="unit">
                          <div class="houseTenantText">
                            <el-row class="list-1">
                                <el-col :span="14" class="color-font"><p>责任人：<span>{{userName}}</span></p></el-col>
                                <el-col :span="4" style="margin-right:20px">
                                  <el-select v-model="selectedLive" placeholder="" clearable>
                                    <el-option v-for="item in liveType"
                                                :key="item.id"
                                                :label="item.label"
                                                :value="item.id"></el-option>
                                  </el-select>
                                </el-col>
                                <el-col :span="4">
                                  <el-select v-model="selectedInput" placeholder="录入情况" clearable>
                                    <el-option v-for="item in inputType"
                                                :key="item.id"
                                                :label="item.label"
                                                :value="item.id"></el-option>
                                  </el-select>
                                </el-col>
                            </el-row>
                            <el-row class="list-1 color-font">
                                <el-col :span="8"  ><p>房屋总数：<span>{{houseInfo.houseTotal}}</span></p></el-col>
                                <el-col :span="8" ><p>未录入信息房屋数：<span>{{houseInfo.notEnteredNum}}</span></p></el-col>
                                <el-col :span="8"><p>其他原因未录入房屋数：<span>{{houseInfo.otherNotEnteredNum}}</span></p></el-col>
                            </el-row>
                          </div>
                        </div>
                         <div v-if="floorList.length==0">
                          <div class="el-tree__empty-block"><span class="el-tree__empty-text">小区下还未新建单元楼，请新建！</span></div>
                        </div>
                        <div class="unitList" ref="unitList">
                          <div class="unitLine" v-for="(item,index) in floorList" :key="index">
                            <div class="unitFirst unitFirstChange">
                            <span> {{item.inFloorNum}}F</span>
                              
                            </div>
                            <template v-for="(item1,index1) in item.houses" >
                              <div class="state2 unitBox unitBox1" >
                              <!-- <div class="state1 unitBox" @click.stop="jump(item1,index1,item.houses)"> -->
                                <div class="floorContant floorContantChange">
                                  <p style="color:#000">{{item1.houseCode}}</p>
                                  <p @click="edit(item1)" style="color:#7f66d2">编辑</p>
                                  <p  :class="[item1.houseStatus=='1'  ? 'color-1' : item1.houseType =='2' ? 'color-2' :  'color-3' ]">
                                    {{item1.houseStatus=='1'?'自住':item1.houseType =='2'?'租住':'空置'}}
                                  </p>
                                  <p :class="[item1.noPersonRemark =='未录入' ? 'type-1' : item1.noPersonRemark =='不配合' ? 'type-2' :  'type-3' ]">{{item1.noPersonRemark}}</p>
                                </div>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-row>
        </el-col>
       </el-row>
    </div>
    <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="550px" >
      <div class="editContent">
          <el-row>
            <el-col :span="4"><p>房屋类型</p></el-col>
            <el-col :span="12">
               <el-select v-model="model.houseStatus" placeholder="" clearable>
                    <el-option v-for="item in liveType"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id"></el-option>
               </el-select>
            </el-col>
          </el-row>
          <el-row style="padding:20px 0">
            <el-col :span="24"><p>未录入信息说明</p></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
                <el-radio v-model="radio" label="1">未录入住户用户</el-radio>
            </el-col>
            <el-col :span="8">
                <el-radio v-model="radio" label="2">不配合录入</el-radio>
            </el-col>
            <el-col :span="8">
                <el-radio v-model="radio" label="3">暂无住户</el-radio>
            </el-col>
            
          </el-row>
      </div>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false"> 取消</el-button>
        <el-button type="primary" :loading="loading"   @click="submit()">确 定</el-button>
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
  },
  data() {
    return {
      importVisible: false,
      importData: [],
      fileList: [],
      fileHeader: {},
      importFormVisible: false,
      dialogFormVisible: false,
      dialogCodeVisible:false,
      dialogCode:"编辑房屋",
      dialogVisible: false,
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [ ],
      model: { },
      total: 0,
       filter: {
        organId: 0,
        size: 10,
        current: 0,
        
      },
      liveType:[
           { id: 1, label: "自主" },
        { id: 2, label: "租住" }, 
         { id: 3, label: "空置" }, 
      ],
      defaultExpandKeys:[],
      treeList: [],
      selectedLive:'',
       inputType:[
        { id: 1, label: "未录入" },
        { id: 2, label: "不配合录入" }, 
        { id: 3, label: "暂无住户" }, 
      ],
      unitId:"",
      selectedInput:'',
       radio: '1',
      firstErr: null,
      loading: false,
      time:[],
      unitName:'',
        unitList:[],
         defaultProps1: {
          children: 'children',
          label: 'unitName'
        },
      floorList:[],
      houseInfo:{},
      userName:"",
      userId:""
    };
  },
  created(){
    this.selectedLive = this.liveType[0].id;
    this.selectedInput = this.$route.query.state;
    
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this.userId = this.$route.query.userId
    this.userName = this.$route.query.userName
    
    this._fetchUnitTree();
    this.getHouseInfo()
  },
  methods: {
     //小区树
      _fetchUnitTree: debounce(async function() {
        const data = await Api.houseTree.get({}, {
          pathParams: {
            userId: this.userId
          }
        }).then(data => data.data.rows)
        this.unitList=data || []
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.unitId)
          this.unitName=this.$refs.tree.getCurrentNode().unitName
        })
      }),
       //点击小区树
      unitNodeClick(data){
          this.unitName=data.unitName
          this.addVisible=true;
          this.unitId=data.id
          this._fetchHouseList();
      },
        //房屋列表
      _fetchHouseList: async function() {
        const data = await Api.getHouseLiat.get({},{ 
            pathParams: {
            unitId: this.unitId
          }
        })
        .then(data => data.data)
        this.floorList=data.rows
      },
     //获取房屋录入信息
     getHouseInfo(){
      Api.getHouseInfo.get({},{ 
          pathParams: {
            userId: this.userId
          }
        })
        .then(res =>{
         this.houseInfo =  res.data.result
        })
     },
    back(){
        this.$router.push({ path: "/gridOperator/gridSituation" });
      },
    edit(info){
       this.dialogCodeVisible=true

       this.model = cloneDeep(info);
        if(this.model.noPersonRemark =='未录入'){
        this.radio=1
      }else if(this.model.noPersonRemark == '不配合'){
        this.radio=2
      }else if(this.model.noPersonRemark == '暂无住户'){
         this.radio=3
      }
       this.model.id = info.id
      if(this.radio==1){
        this.model.noPersonRemark = '未录入'
      }else if(this.radio==2){
        this.model.noPersonRemark = '不配合'
      }else if(this.radio==3){
         this.model.noPersonRemark = '暂无住户'
      }
    },
    submit(){
         Api.editHouseLiat.put({houseStatus:this.model.houseStatus,noPersonRemark:this.model.noPersonRemark},{ 
            pathParams: {
            houseId:this.model.id
          }
        })
        .then(data =>{
          debugger
           this.$message({message: '修改成功', type: 'success'})
          this.dialogCodeVisible = false
           this._fetchHouseList();
        })
    },
  }
};
</script>
<style lang="less">
  .gridName{
    display: inline;
    font-size: 24px;
    // margin-right: 20px;
    span{
        font-size: 20px
    }
}
.list-1{
      margin:16px 0;
      font-size: 20px;
  }
.unitFirstChange,{
  height: 100px  !important;
  line-height: 187px  !important;
  position: relative;
  span{
    position: absolute;
    top: -40%;
  }
}
.floorContantChange{
  //  height: 100px  !important;
  line-height:50px !important;
  


  p{
    width: 74px;
    float: left;
  }
 
}
.unitBox1{
  height: 100px  !important;
  width: 150px  !important;
  
}
.zhsq-main .zhsq-innerBody .zhsq-boxWrapper .tableBox .unit-con .unitList{
  border: none;
  height: 500px;
}
.zhsq-main .zhsq-innerBody .zhsq-boxWrapper .tableBox .unit-con .state2{
 background: #fff !important;
 border: 1px solid #ccc;
 border-radius: 4px;
}
.editContent{
  padding: 20px;
}
.color-1{
  color:#7f66d2;
}
.color-2{
  color:#2f58c1
}
.color-3{
  color:#999
}
.color-font{
  color:#3B3D58
}
.type-1{
  color:red;
  border: 1px solid red;
  border-radius: 4px;
  line-height: 30px;
  margin-top:10px;
}
.type-2{
  color:#999;
  border: 1px solid #999;
  border-radius: 4px;
  line-height: 30px;
  margin-top:10px;
}
.type-3{
 display: none;
}
</style>
