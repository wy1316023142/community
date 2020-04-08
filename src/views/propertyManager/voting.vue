<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">投票活动管理</span>

      <div class="text_r flexItem">
        <!--<el-checkbox v-model="checked" @change="handCkChange" title="包含机构下级">下级</el-checkbox>-->
        投票活动名称：<el-input  placeholder=""  v-model="filter.activityTitle" clearable></el-input>
        活动时间：<el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" title="点击新增投票" v-allow="800301">新增</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column label="序号" align='center'   type="index"></el-table-column>
                <el-table-column prop="activityCode" label="活动编号" align='center' width="140"></el-table-column>
                <el-table-column prop="activityTitle" label="投票活动名称" align='center'></el-table-column>
                <el-table-column prop="activityType" label="投票类型" align='center'>
                   <template slot-scope="scope" >
                    {{scope.row.activityType|activityType}}
                  </template>
                </el-table-column>
                <el-table-column prop="activityCreateTime" label="创建时间" align='center' width="200">
                  <template slot-scope="scope" >
                   {{scope.row.activityCreateTime | daterful('YYYY-MM-DD HH:mm:ss')}}
                  </template>
                </el-table-column>
                <el-table-column prop="activityStatus" label="状态" align='center' >
                  <template slot-scope="scope" >
                   {{scope.row.activityStatus|votingState}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width="350">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-show="scope.row.activityStatus== 0" v-allow="800302">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-show="scope.row.activityStatus== 0" v-allow="800303">删除</el-button>
                    <el-button type="primary" size="mini" @click="votingManage(scope.row)" v-show="scope.row.activityType==1201 && scope.row.activityStatus== 0">候选人管理</el-button>
                    <el-button type="primary" size="mini" @click='preview(scope.row)' v-show="scope.row.activityStatus== 0">预览</el-button>
                    <el-button type="primary" size="mini"  @click="end(scope.row)" v-show="scope.row.activityStatus== 1">结束</el-button>
                    <el-button type="primary" size="mini" @click="votingDetaols(scope.row)" v-show="scope.row.activityStatus== 1 ||scope.row.activityStatus== 2">投票情况</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
      <!--二维码-->
    <el-dialog :title="dialogCode" :visible.sync="dialogCodeVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="470px" >
      <div class="codeImg">
        <img :src= activityPreviewUrl alt="">
      </div>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogCodeVisible = false" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import bus from '../../commom/bus.js';
import moment from "moment";
import { debounce, keys, cloneDeep } from "lodash";
import { validateIdCard, validatePhone } from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import {
  provinceAndCityData,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import { getBase64, convert2JPEG } from "../../commom/util.js";
import { domHeightMixin } from "../../commom/mixins.js";
export default {
  name: "population",
  components: { OrganTree },
  data() {
    return {
      edited: "",
      editFileList: [],
      array: [],
      hideUpload: false,
      passportType: "",
      eventImg: [],
      chinaShow: true,
      otherShow: false,
      photoStatusData: [],
      photoStatusVisible: false,
      importData: [],
      importVisible: false,
      fileList: [],
      action: "",
      fileHeader: {},
      importFormVisible: false,
      populationHouses: [],
        time: [],
      address: ["四川省", "成都市"],
      organId: "",
      organName: "",
      unitId: "",
      unitList: [],
      floorList: [],
      houseList: [],
      liveTypeList: [],
      poTypeList: [],
      options: provinceAndCityData,
      tabHeight: "0",
      dialogFormVisible: false,
      dialogCodeVisible: false,
      dialogFormTitle: "",
      dialogCode: "",
      tableData: [],
      model: {

      },
      total: 0,
      checked: false,
      filter: {
       organId: 0,
        page: 1,
        rows: 10,
        activityType:"",
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeList: [],
      personType: [],
      post: [],
      education: [],
      country: [],
      liveType: [],
      poType: [{ id: 1, label: "住户" }, { id: 2, label: "租客" }],
      firstErr: null,
      loading: false,
      tableData: [],
      id: "",
      organIds: "",
      activityStatus:[
         { id: 0, label: "未开始" },
        { id: 1, label: "进行中" },
        { id: 2, label: "已结束" },

      ],
      votingDetaolsData:{},
      activityPreviewUrl:""
    };
  },
  mounted() {
    this.fileHeader = {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    };
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 56;
      window.onresize = () => {
        // this.tabHeight = this.$refs.content.offsetHeight - 56;
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this.action = myConfig.baseUrl + "/business/population/import/" + this.filter.organId;
    this._fetchData();

  },
  methods: {

    votingDetaols(row) {
      //投票详情
         Api.votingDetaols
        .get(
          {  },
          {
            pathParams: {
              id: row.id,
            }
          }
        )
        .then(res => {
          this.votingDetaolsData = res.data.result
              if (row.activityType === "1201") {
            this.$router.push({
              path: "/propertyManager/votingDetails",
              query: { isShow: true,votingDetaolsData:this.votingDetaolsData }
            });
          } else if (row.activityType === "1202") {
            this.$router.push({
              path: "/propertyManager/votingDetails",
              query: { isShow: false,votingDetaolsData:this.votingDetaolsData }
            });
          }

        })

    },
    votingManage(row) {
      //候选人管理
      this.$router.push({
         path: "/propertyManager/votingManage",
         query: { activityId: row.id }
      });
    },
    preview(row) {//预览
         Api.getVotingList
        .get(
          this.filter,
          {
            pathParams: {
              id: row.id,
            }
          }
        )
        .then(res => {
          res.data.rows.map(item=>{
            if(item.id == row.id){
              this.activityPreviewUrl = item.activityPreview
            }
          })

          this.dialogCodeVisible = true;
        })

    },
    end(row) {
      //结束
       Api.stopVotingById
        .put(
          {  },
          {
            pathParams: {
              id: row.id,
            }
          }
        )
        .then(res => {
           this.$message({ message: "活动结束成功", type: "success" });
            //  if (row.activityStatus == 1) {
            //   row.activityStatus = 2;
            //  }
              this._fetchData();
        })


    },
    changeDate( val) {
      if(val == null){
         this.filter.activityStartTime=""
         this.filter.activityEndTime = ''
          this._fetchData();
      }else{
         this.filter.activityStartTime = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.filter.activityEndTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    //左侧机构数点击
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this.action = myConfig.baseUrl + "/business/population/import/" + this.filter.organId;
      this._fetchData();
    },
    //分页查询
    _fetchData: debounce(async function() {
      const data = await Api.getVotingList
        .get(this.filter, {
           loadingMaskTarget: ".tableBox"
        })
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        });
    }, 100),
    //查询
    async seach() {

    },
    //分页
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    handCkChange(val) {
      this.filter.xj = val ? 0 : 1;
      this._fetchData();
    },
    //编辑
    editRow(
      row = {
        activityCreateTime: "",
        activityEndTime: "",
        activityPreview: "",
        activitySetMold: 0,
        activitySetVotes: 0,
        activityStartTime: "Z",
        activityStatus: 0,
        activityTitle: "",
        activityType: "",
        id: 0,

      }
    ) {
      if(row.id){
        this.id = row.id;
       Api.seachVoting
        .get(
          { id: row.id },
          {
            pathParams: {
              id: row.id,
              // organIds: row.organIds
            }
          }
        )
        .then(res => {
         this.model=row
         var activityType = this.activityType(res.data.result.activityType)
         var activityStatus = this.votingState(res.data.result.activityStatus)
         var activityCreateTime = this.activityCreateTime(res.data.result.activityCreateTime,'YYYY-MM-DD')
          this.model.activityType=activityType
          this.model.id=res.data.result.id
          this.model.activityTitle=res.data.result.activityTitle
          this.model.activityStatus=activityStatus
          this.model.activityCreateTime=activityCreateTime
          this.model.activityStartTime=res.data.result.activityStartTime
          this.model.activityEndTime=res.data.result.activityEndTime
          this.model.organIds=res.data.result.organIds
          this.organIds = res.data.result.organIds;
           this.$router.push({ path: "/propertyManager/votingAdd",
              query:{
                id:this.model.id,
                activityTitle:this.model.activityTitle,
                activityType:this.model.activityType,
                activityStatus:this.model.activityStatus,
                organIds: this.model.organIds,
                activityContent:res.data.result.activityContent,
                activityStartTime:this.model.activityStartTime,
                activityEndTime:this.model.activityEndTime,
                title:"修改",
                typeFlag:true,
                }
         });
        })
        .catch(res => {});
      }else{
        this.$router.push({ path: "/propertyManager/votingAdd",query:{title:"新增", organId:this.filter.organId}});
      }

    },
    submit() {
      //修改提交
      this.$refs.form.validate(valid => {
         if(this.model.activityType == '选举投票'){
          this.model.activityType = 1201
        }else if(this.model.activityType == '表决投票'){
          this.model.activityType = 1202
        }

        Api.editVoting
          .put(this.model, {
            pathParams: {
              id: this.model.id,
              organIds: this.organIds
            }
          })
          .then(res => {
            this.$message({ message: "修改成功", type: "success" });
            this.dialogFormVisible = false;
            this._fetchData();
          })
          .catch(res => {});
      });
    },
    //删除
    deleteRow(row) {
      this.$confirm(`确定删除吗？`, "提示", {
        type: "warning"
      })
        .then(async () => {
          const data = await Api.deleteVotingById
            .delete(
              {},
              {
                pathParams: {
                  id: row.id
                }
              }
            )
            .then(res => {
              this.$message({ message: "删除成功", type: "success" });
              this._fetchData();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    activityType(value) {
      if (value == 1201) return value= "选举投票";
      if (value == 1202) return value= "表决投票";
    },
     votingState(value) {
      if (value === 0) return value= "未开始";
      if (value === 1) return value= "进行中";
      if (value === 2) return value= "已结束";
    },
    activityCreateTime(oldval,filerw){
        return moment(oldval).format( filerw || 'YYYY-MM-DD  HH:mm:ss' );
    }
  },

};
</script>
<style lang="less">
.codeImg {
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.codeImg img{
  margin-left:70px;
}
</style>
