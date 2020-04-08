<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">车辆告警</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="车牌号"  v-model="filter.licenseNumber"></el-input>
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
            <div class="tableBox" >
              <div class="alarm-main" :style="{height: tabHeight + 'px',maxHeight:tabHeight + 'px'}">
                <el-row :gutter="20">
                  <el-col :span="8" v-for=" item in tableData">
                    <div class="alarm-box">
                      <div class="flex alarm-img">
                        <img :src="item.imagePath">
                      </div>
                      <div class="alarm-con">
                        <div class="flex">
                          <div>车牌号:</div>
                          <div class="flexItem">{{item.licenseNumber}}</div>
                        </div>
                        <div class="flex">
                          <div>颜 色:</div>
                          <div class="flexItem">{{item.color}}</div>
                        </div>
                        <div class="flex">
                          <div>出现地点:</div>
                          <div class="flexItem">{{item.address}}</div>
                        </div>
                        <div class="flex">
                          <div>抓拍时间:</div>
                          <div class="flexItem">{{item.alarmTime}}</div>
                        </div>
                        <div class="flex">
                          <div class="flexItem text_r">
                            <el-button  type="primary" size="mini" @click="details(item)">查看详情</el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>

    <el-dialog  class="alarm-dialog" :title="''" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' width="40%" :show-close=false>
      <div class="el-icon-error alarm-dialog-icon"  v-if="detail.isSuspect == 2"></div>
      <div class="el-icon-success alarm-dialog-icon"  v-if="detail.isSuspect == 1"></div>
     <div class="alarm-dialog-con">
       <div class="alarm-header">
         <ul class="flex">
           <li class="flexItem"  :class="index==1?'active':'' " @click="select(1)">告警详情</li>
           <li class="flexItem"  :class="index==2?'active':'' " @click="select(2)">场景图片</li>
           <li class="flexItem"  :class="index==3?'active':'' " @click="select(3,detail.licenseNumber)">轨迹分析</li>
         </ul>
       </div>
       <div class="alarm-con">
         <div class="info"  v-show="index==1">
          <div class="flex">
             <img :src="detail.imagePath">
          </div>
          <div class="info-con">
            <p>车牌号：{{detail.licenseNumber}}</p>
            <p>车主：{{detail.vehicleOwnerName}}</p>
            <p>联系方式：{{detail.vehicleOwnerPhone}}</p>
            <p>抓拍时间：{{detail.alarmTime}}</p>
            <p>抓拍地点：{{detail.address}}</p>
          </div>
        </div>
         <div class="scene"  v-show="index==2">
          <div class="flex">
            <img :src="detail.imagePath">
          </div>
         </div>
         <div class="trajectory" v-show="index==3">
             <div class="tableBox">
               <p>出现次数:{{historyCount}}</p>
               <el-table :data="trajectoryData" style="width: 100%" stripe  height="290" max-height="290">
                 <el-table-column prop="alarmTime"  label="出现时间" align='center'></el-table-column>
                 <el-table-column prop="name" label="出现地点" align='center'></el-table-column>
               </el-table>
               <div class="pageBox">
               <el-pagination  :small="true" @current-change="trajectoryPageChange" background layout="prev, pager, next, total" :total='historyCount' :page-size='trajectoryFilter.page' :current-page='trajectoryFilter.rows'></el-pagination>
             </div>
             </div>
         </div>
       </div>
     </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" v-if="detail.isSuspect == 0" @click="mark(detail.id,2)">忽略告警</el-button>
        <el-button type="primary" :loading="loading" v-if="detail.isSuspect == 0" @click="mark(detail.id,1)">标记嫌疑人</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys } from 'lodash'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  export default {
    name: 'vehicle',
    components: {OrganTree},
    data() {
      return {
        licenseNumber:'',
        activeName : 'first',
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        detail:{},
        organ:0,
        total:0,
        historyCount:0,
        filter: {
          organId: 1,
          page: 12,
          rows: 0,
          licenseNumber:'',
        },
        trajectoryFilter: {
          page: 10,
          rows: 0,
        },
        firstErr:null,
        personType:[],
        loading:false,
        rules: {
          licenseNumber: [{
            required: true,
            message: '请填写车牌号',
            trigger: 'blur'
          }],
          vehicleType: [{
            required: true,
            message: '请选择车辆类型',
            trigger: 'blur'
          }],
          color: [{
            required: true,
            message: '请选择颜色',
            trigger: 'blur'
          }],
          vehicleOwnerName: [{
            required: true,
            trigger: 'blur',
            message: '请填写车主姓名'
          }],
          vehicleOwnerSex: [{
            required: true,
            message: '请填写车主信息',
            trigger: 'blur'
          }],
          vehicleOwnerPhone: [{
            required: true,
            message: '请填写车主电话',
            trigger: 'blur'
          }, {
            validator: validatePhone,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }],
          parkingSpace: [{
            required: true,
            message: '请输入停车位',
            trigger: 'blur'
          }]
        },
        index:1,
        trajectoryData:[]
      }
    },
    mounted(){
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.alarmList.post(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      details(data){
        this.index=1;
        //查询
        //...
        this.dialogFormVisible=true
        this.detail = data;
      },
      pageChange(val) {
        this.filter.rows = val-1;
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this.filter.organPath = item.path || ''
        this._fetchData()
      },
      async select(index,licenseNumber){
        this.licenseNumber=licenseNumber
        this.index=index;
        if(licenseNumber){
          const data1 = await Api.history.get(this.trajectoryFilter, {
            pathParams: {
              licenseNumber:this.licenseNumber,
            },
            loadingMaskTarget: '.tableShow'
          }).then(res => res.data)
          this.trajectoryData = data1.rows
          this.historyCount = data1.total
        }
      },

      async mark(id,isSuspect){
        this.$confirm(isSuspect === 2 ? `确定忽略此告警？` : '标记为嫌疑人', '提示', {
          type: 'warning'
        }).then(async () => {
        const data1 = await Api.mark.put({
          id: id,
          isSuspect: isSuspect
        }, {
          loadingMaskTarget: '.tableShow'
        }).then(()=>{
          if (isSuspect==1) {
            this.$message({ message: '已标记为嫌疑车辆', type: 'success' })
          } else {
            this.$message({ message: '已忽略', type: 'success' })
          }
          this.loading = false
          this.dialogFormVisible = false
          this._fetchData()
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
      trajectoryPageChange(val) {
        this.trajectoryFilter.rows = val;
        this.select(3, this.licenseNumber);
      }
    },
  };
</script>
<style lang="less" scoped>

</style>
