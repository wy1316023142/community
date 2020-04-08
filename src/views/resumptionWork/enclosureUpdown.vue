<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">企业复工登记信息>附件查看</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click='back()' >返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <ul >
          <li class="programme programme1">
              <p>《疫情防控应急预案》</p>
              <div class="list">
                  <img src='../../assets/images/xls.jpg' alt="">
                  <span>疫情防控应急预案.xls</span>
                  <el-button type="primary" size="small" @click="upDown(4)">下载</el-button>
              </div>
          </li>
          <li class="programme programme2">
               <p>《企业复工备案申请表》</p>
              <div class="list">
                  <img src='../../assets/images/xls.jpg' alt="">
                  <span>企业复工备案申请表.xls</span>
                  <el-button type="primary" size="small" @click="upDown(1)" >下载</el-button>
              </div>
          </li>
          <li class="programme programme3">
               <p>《企业员工健康情况申报卡》</p>
              <div class="list">
                  <img src='../../assets/images/xls.jpg' alt="">
                  <span>企业员工健康情况申报卡.xls</span>
                  <el-button type="primary" size="small" @click="upDown(5)">下载</el-button>
              </div>
          </li>
          <li class="programme programme4">
               <p>《企业复工方案》</p>
              <div class="list">
                  <img src='../../assets/images/xls.jpg' alt="">
                  <span>企业复工方案.xls</span>
                  <el-button type="primary" size="small" @click="upDown(2)" >下载</el-button>
              </div>
          </li>
          <li class="programme programme5">
               <p>《企业复工全员健康台账》</p>
              <div class="list">
                  <img src='../../assets/images/xls.jpg' alt="">
                  <span>企业复工全员健康台账.xls</span>
                  <el-button type="primary" size="small"  @click="upDown(6)" >下载</el-button>
              </div>
          </li>
          <li class="programme programme6">
               <p>《企业复工承诺书》</p>
              <div class="list">
                  <img src='../../assets/images/xls.jpg' alt="">
                  <span>企业复工承诺书.xls</span>
                  <el-button type="primary" size="small"  @click="upDown(3)">下载</el-button>
              </div>
          </li>
      </ul>
    </div>
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
  components: {
    ElDialog,
    OrganTree
  },
  data() {
    return {
        id:""
    }
  },
  mounted() {
    //   this.$nextTick(() => {
    //     this.tabHeight=this.$refs.content.offsetHeight-56
    //     window.onresize =()=> {
    //       this.tabHeight=this.$refs.content.offsetHeight-56
    //     };
      
    // });
      this.id = this.$route.query.activityId
    console.log(this.$route.query.activityId);
  },
  methods: {
    
    upDown(type){
        //  window.open(`${myConfig.baseUrl}/business/epidemicEnterpriseDeclaration/enterpriseFiles?id=${this.id}`)
          Api.enterpriseFiles.get({id:this.id},{ }).then(res=>{
            res.data.result.map(item=>{
                if(item.type == type){
                   window.open(item.filePath) 
                }
            })
        })
    },
   back(){
      this.$router.push({ path: "/resumptionWork/enterpriseInfo" });
   },
   
  
  }
};
</script>
<style lang="less">
   .zhsq-boxWrapper{
       ul{
          
           width: 80%;
          
           margin-top: 30px;
           .programme2,.programme4,.programme6{
               width: 40%;
               float: left;
           }
            .programme1,.programme3,.programme5{
               width: 46%;
               float: right;
           }
           .programme{
               margin-top: 40px;
           }
           p{
               font-size: 24px;
               color: #009DDA;
               font-weight: 700
           }
           .list{
               display: flex;
               margin-top: 20px;
               span{
                   margin: 10px 20px 0;
                   line-height: 26px;
                   text-align: center;
                   font-size: 18px;
               }
           }
           
       }

   }
</style>
