<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">投票活动管理>{{ title }}投票管理</span>
      <div class="text_r flexItem">
         <el-button type="primary" @click=" back()" size="small" >返回</el-button>
      </div>
    </div>
   <div class="zhsq-boxWrapper votingAddBox">
      <el-row :gutter="35" style="height: 100%;">
        <el-col :span="24" >
            <el-card shadow="never" style="height: 100%;overflow: auto;">
                <el-col :span="19">
                    <div class="zhsq-right-con" ref="content">
                      <el-form ref="form" :model="model" :show-message="false" label-width="120px" :rules="rules">
                        <el-row>
                          <div v-if="chinaShow">
                            <el-col>
                              <span class="propForm left28">*</span>
                              <el-form-item label="投票类型："  prop="votingType"  >
                                <el-select v-model="model.activityType" placeholder="请选择" :disabled="typeFlag">
                                  <el-option v-for="(item,index) in votingType" :key="index"
                                            :label="item.label"
                                            :value="item.id">
                                  </el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="12">
                              <span class="propForm left0">*</span>
                              <el-form-item label="投票活动名称："  prop="votingName" >
                                <el-input  autocomplete="off" v-model="model.activityTitle"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col>
                              <span class="propForm left28">*</span>
                               <el-form-item label="活动时间：" prop="time">
                                  <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" >
                              <span class="propForm left28">*</span>
                              <el-form-item label="活动说明：" prop="votingIntroduce" >
                                <el-input type="textarea" autocomplete="off" v-model="model.activityContent"></el-input>
                                 <!-- <editor-bar v-model="model.activityContent" :isClear="isClear" @change="change"></editor-bar> -->
                              </el-form-item>

                            </el-col>

                            <el-col>
                              <span class="propForm left28">*</span>
                                <el-form-item label="活动区域：" prop="organIds">
                                  <el-select v-model="model.organIds"  multiple  placeholder="请选择" >
                                     <el-option v-for="(item) in political"
                                             :key="item.id"
                                            :label="item.shortName"
                                             :value="item.id"
                                            >
                                  </el-option>
                                  </el-select>
                                </el-form-item>
                            </el-col>
                          </div>
                        </el-row>
                      </el-form>
                      <div slot="footer" class="dialog-footer footer" >
                        <el-button type="primary" @click="submit" :loading="loading">保存</el-button>
                        <el-button @click="back()">取 消</el-button>
                      </div>
                    </div>
                </el-col>
            </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import EditorBar from "../../components/tinymce.vue";
// components: { },

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
  components: { OrganTree, EditorBar },
  data() {
    return {
      isClear: false,
      detail:"",
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
      // time: "",
        time: [],
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
      dialogFormTitle: "",
      tableData: [],
      model: {
         id:'',
        activityCreateTime:'',
        activityStatus:0,
         activityTitle:'',
         activityType:'',
         organIds:'',
         activityContent:'',
         activityStartTime:'',
         activityEndTime:'',
         time:'',
         organId:0,
         activitySetMold:2,
       },
      total: 0,
      checked: false,
      filter: {
        organId: 0,
        page: 1,
        rows: 10,
        name: "",
        identityNumber: "",
        tel: "",
        status: "",
        photoStatus: "",
        personType: "",
        xj: 1
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeList: [],

      personType: [],
      post: [],
      education: [],
      political: [],
      votingType: [
        { id: "1201", label: "常规投票" },
        { id: "1202", label: "表决投票" }
      ],
      // rules:{
      //   votingType:[{
      //       required: true,
      //       message: "请选择投票类型",
      //       trigger: "blur"
      //   }],
      //   votingName:[{
      //       required: true,
      //       message: "请填写活动名称",
      //       trigger: "blur"
      //   }],
      //     time:[{
      //       required: true,
      //       message: "请选择活动时间",
      //       trigger: "blur"
      //   }],
      //    votingIntroduce:[{
      //       required: true,
      //       message: "请填写活动说明",
      //       trigger: "blur"
      //   }],
      //   organIds:[{
      //       required: true,
      //       message: "请选择活动区域",
      //       trigger: "blur"
      //   }],
      // },
      poType: [{ id: 1, label: "住户" }, { id: 2, label: "租客" }],
      firstErr: null,
      loading: false,
      title:"新增",
      typeFlag:false,

    };
  },
  mounted() {
     this.getSelectData()
      this.model.id =  this.$route.query.id


   if( this.model.id ){

    this.model.activityTitle =  this.$route.query.activityTitle
    this.model.activityType = this.$route.query.activityType
    this.model.activityStatus = this.$route.query.activityStatus
    this.model.activityContent = this.$route.query.activityContent

    this.model.organIds = this.$route.query.organIds.split(",")
    this.time.push(this.$route.query.activityStartTime,this.$route.query.activityEndTime)
    this.title = this.$route.query.title
    this.typeFlag = this.$route.query.typeFlag
   }
    let temp=this.model.organIds
    this.model.organIds=[]
    temp.forEach(item => {
      this.model.organIds.push(item*1)
    })
    this.filter.organId = this.$route.query.organId
    this.action = myConfig.baseUrl + "/business/population/import/" + this.filter.organId;
    this.model.organId =this.filter.organId
  },
  methods: {
     change(val) {
      console.log(val)

    },
    back(){//返回
      this.$router.push({path:'/propertyManager/voting'})
    },
    getSelectData(){//获取小区
          Api.getSelectData
            .get({
              organType:2 ,
              path:JSON.parse(sessionStorage.getItem('user')).organPath
            }, {})
            .then(res => {
              res.data.result.map((item)=>{
                this.political.push(item)

              })
            })
            .catch(res => {
            });
    },
    changeDate(val) {
         this.model.time=val[0]+val[1]
      console.log( this.model.time)
      this.model.activityStartTime = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.model.activityEndTime = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");


    },
    handCkChange(val) {
      this.filter.xj = val ? 0 : 1;
      this._fetchData();
    },
   async submit() {
     if(this.model.activityType==''){
       this.$message('请选择投票类型')
     }else if(this.model.activityTitle==''){
        this.$message('请填写活动名称')
     }else if(this.model.time==''){
        this.$message('请选择活动时间')
     }else if(this.model.activityContent==''){
        this.$message('请填写活动说明')
     }else if(this.model.organIds==''){
        this.$message('请选择活动区域')
     }else{
            //新增
      this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            if (!this.model.id) {
              // console.log(this.model.organIds);
              if(this.model.organIds instanceof Array ){
                this.model.organIds = this.model.organIds.join(",")
              }

              await Api.addVoting
                .post(  this.model,{
                pathParams: {
                    organId: this.filter.organId,
                  }
              })
              .then(res => {
                if(res.data.code==0){
                      this.$message({ message: "新增成功", type: "success" });
                this.$router.push({path:'/propertyManager/voting'})
                }
              })
              .catch(err => {
                if(err.data.code == 1){
                    let temp=this.model.organIds.split(",")
                      this.model.organIds=[]
                      temp.forEach(item => {
                        this.model.organIds.push(item*1)
                      })

                }
              });
            } else {
              let data=cloneDeep(this.model)
              if(data.activityType=='表决投票'){
                data.activityType = 1202
              }else if(data.activityType == '选举投票'){
                  data.activityType = 1201
              }
              data.organIds = data.organIds.join(",")
              await Api.addVoting
              delete data.activityStatus
              await Api.editVoting
              .put(data, {
                  pathParams: {
                    id: this.model.id,
                    organIds: this.organIds
                  }
                })
                .then(() => {

                  this.$message({ message: "修改成功", type: "success" });
                  this.$router.push({path:'/propertyManager/voting'})
                  // this._fetchData();
                })
                .catch(() => {});
            }
          } else {

          }
        });

     }

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


  }
};
</script>
<style lang="less">
.votingAddBox{
  .passportImg {
    width: 100%;
    overflow: hidden;
    height: 154px;
  }
  .footer {
    margin: 30px;
  }
  .w-e-toolbar{
    width: 485px;
  }
  .w-e-text-container{
    width: 485px;
    height: 200px;
  }
  .el-col{
    position: relative;
  .propForm{
    color: red;
    position: absolute;
  }
  .left28{
    top: 12px;
    left: 28px;
  }
  .left0{
    top: 12px;
    left: 0px;
  }
  }
}
</style>

