<template>
    <div class="workRegisterBox">
        <div class="topM"></div>
        <div class="wapperBox">
            <div class="headTitle">
                <img src="../assets/images/workback.png" alt="">
            </div>
            <div class="paddin20">

            
                <div class="needKnowBox">
                    <p class="needKnowBoxTitle">填    报    须      知</p>
                    <p class="colRed"> &nbsp &nbsp 涉及城市运行和市民生活必需的行业（如供水、供气、供电、通讯、超市卖场、农贸市场、食品批发零售等）及疫情防控必需的行业（医疗器械、药品、防护品销售服务等）无需申报。</p>
                    <p class="colRed"> &nbsp &nbsp 工业企业按照成都市工业经济工作领导小组要求执行，不使用本系统。</p>
                    <p class="colRed"> &nbsp &nbsp 建筑业企业按照成都市市住建局和市卫健委要求执行，不使用本系统。</p>
                    <p class="colRed"> &nbsp &nbsp 如市级部门和主管部门有另行要求的，以市级部门和主管部门意见为准</p>
                    <p> &nbsp &nbsp 企业应严格施行成都市新型冠状病毒感染的肺炎疫情防控指挥部通告（2020第2号）相关要求，做好企业范围内的场所及员工的疫情防控措施，包括复业方案、返岗计划、应急预案、物资储备、防疫承诺等。原则上企业安排在蓉居住14天以上员工返岗上班。提倡远程在家办公，提倡员工分次分批返岗。涉及企业、楼宇及园区的经营物资、生活物资、防控物资由企业自行准备。务必落实“无准备不返岗、准备不充分不复业”的要求。市级部门有最新行业要求的按上级要求核查管理。</p>
                    <p> &nbsp &nbsp 从业人员在100人以上（含100人）的服务业企业，按要求做好复业准备工作后，向行业主管部门提出恢复营业申请，经审查同意，向属地街道社区报到后方可开展返岗复业。（恢复营业申请备案表详见附件1）</p>
                    <p> &nbsp &nbsp 从业人员在100人以下的服务业企业，在属地街道和社区指导要求下分时分批恢复营业，落实疫情防控管理要求，自觉接受监督检查。</p>
                    <div class="">
                        <a href="">企业复工审批部门列表及咨询电话（点击查看或下载）</a>
                    </div>
                    <div class="mb40">
                        <a href="">常见问题（建议申报前先查阅）</a>
                    </div>
                </div>
                <div class="downloadTemplateBox">
                    <p>请点击下载相应模板</p>
                    <div class="collection-cell" @click="downloadBtn(1)">
                        <p class="colBule">《企业复工备案申请表》</p>
                    </div>
                    <div class="collection-cell" @click="downloadBtn(2)">
                        <p class="colBule">《企业复工方案》</p>
                    </div>
                    <div class="collection-cell" @click="downloadBtn(3)">
                        <p class="colBule">《企业复工承诺书》</p>
                    </div>
                    <div class="collection-cell" @click="downloadBtn(4)">
                        <p class="colBule">《疫情防控应急预案》</p>
                    </div>
                    <div class="collection-cell" @click="downloadBtn(5)">
                        <p class="colBule">《企业员工健康情况申报卡》</p>
                    </div>
                    <div class="collection-cell" @click="downloadBtn(6)">
                        <p class="colBule">《企业复工全员健康台账》</p>
                    </div>
                </div>
                <div class="formBox">
                    <el-form ref="form" :model="form" :rules="rules">
                        <el-form-item label="企业名称（要求：填写企业工商注册全称）"  prop="enterpriseName">
                            <el-input v-model="form.enterpriseName"></el-input>
                        </el-form-item>

                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="企业人数" prop="enterpriseName">
                                <el-radio-group v-model="form.peopleNumbers">
                                    <el-radio v-for="item in peopleNumber"
                                        :label="item.id"
                                        >{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="企业经营所在地" prop="streetId">
                                    <el-select v-model="form.streetId" placeholder="请选择区域">
                                    <el-option v-for="item in streetData"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                        </el-col>
                    </el-row>
                    <div>
                        <el-form-item label="所属行业" prop="industry">
                                <br/>
                                <p class="contactTips">非所列行业复工，请联系所在街道办或主管部门</p>
                                <el-radio-group v-model="form.industry">
                                    <el-radio v-for="item in industryData"
                                        :label="item.id"
                                        >{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                    </div>
                        <el-form-item label="经营地址（要求：街道（乡镇）社区 具体门牌号）" prop="address">
                            <el-input v-model="form.address"></el-input>
                        </el-form-item>
                        <el-form-item label="所属楼宇" prop="building">
                            <el-input v-model="form.building"></el-input>
                        </el-form-item> 
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="法人代表" class="mr46" prop="legalPerson">
                                    <el-input v-model="form.legalPerson"></el-input>
                                </el-form-item> 
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="联系方式" prop="tel">
                                    <el-input v-model="form.tel"></el-input>
                                </el-form-item> 
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="联系人" class="mr46" prop="contacts">
                                    <el-input v-model="form.contacts"></el-input>
                                </el-form-item> 
                            </el-col>
                            <el-col :span="14">
                                <el-form-item label="联系方式" prop="telPhone">
                                    <br/>
                                    <p class="contactTips">复工审批结果将通过此手机号发送短信通知，请随时关注手机！</p>
                                    <el-input v-model="form.telPhone"></el-input>
                                </el-form-item> 
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="拟复工时间" class="mr46" prop="workDate">
                                    <el-date-picker
                                        v-model="form.workDate"
                                        type="date"
                                        placeholder="选择日期" 
                                        @change="workDateChange"
                                        >
                                    </el-date-picker>
                                </el-form-item> 
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="拟复工人数(请输入数字)" prop="workNumber">
                                    <el-input v-model="form.workNumber" oninput="value=value.replace(/[^\d]/g,'')" type="number"></el-input>
                                </el-form-item> 
                            </el-col>
                        </el-row>
                        <div>
                            <p class="fw"><span class="redX">*</span>上传《企业复工备案申请表》（盖章扫描，如超过单个文件大小限制，最多可上传9个附件）</p>
                            <input name="file" type="file" ref="file1" v-show="false" @change="fileChange1">
                            <div @click="fileBtn(1)" class="fileBtn">
                                {{this.file.name1}}
                            </div>
                        </div>
                        <div>
                            <p class="fw"><span class="redX">*</span>上传《企业复工方案》（盖章扫描，如超过单个文件大小限制，最多可上传9个附件）</p>
                            <input name="file" type="file" ref="file2" v-show="false" @change="fileChange2">
                            <div @click="fileBtn(2)" class="fileBtn">
                                {{this.file.name2}}
                            </div>
                        </div>
                        <div>
                            <p class="fw"><span class="redX">*</span>上传《企业复工承诺书》（盖章扫描，如超过单个文件大小限制，最多可上传9个附件）</p>
                            <input name="file" type="file" ref="file3" v-show="false" @change="fileChange3">
                            <div @click="fileBtn(3)" class="fileBtn">
                                {{this.file.name3}}
                            </div>
                        </div>
                        <div>
                            <p class="fw"><span class="redX">*</span>上传《企业疫情防控应急预案》（盖章扫描，如超过单个文件大小限制，最多可上传9个附件）</p>
                            <input name="file" type="file" ref="file4" v-show="false" @change="fileChange4">
                            <div @click="fileBtn(4)" class="fileBtn">
                                {{this.file.name4}}
                            </div>
                        </div>
                        <div>
                            <p class="fw"><span class="redX">*</span>上传《企业员工健康情况申报卡》（盖章扫描，如超过单个文件大小限制，最多可上传9个附件）</p>
                            <input name="file" type="file" ref="file5" v-show="false" @change="fileChange5">
                            <div @click="fileBtn(5)" class="fileBtn">
                                {{this.file.name5}}
                            </div>
                        </div>
                        <div class="pb30">
                            <p class="fw"><span class="redX">*</span>上传《企业复工全员健康台账》</p>
                            <input name="file" type="file" ref="file6" v-show="false" @change="fileChange6">
                            <div @click="fileBtn(6)" class="fileBtn">
                                {{this.file.name6}}
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="topB"></div>
        <div class="footerButtonBox">
            <el-button class="footerButton" @click="submit()">提交</el-button >
        </div>
    </div>
</template>

<script>
import Api from '../commom/api.js'
import moment from 'moment'
export default {
  data() {
    return {
        form: {},
        streetData:[],
        fileData1:{},
        fileData2:{},
        fileData3:{},
        fileData4:{},
        fileData5:{},
        fileData6:{},
        industryData:[
           {id:1401,label:'律师事务所，司法鉴定和仲裁机构等'},
           {id:1402,label:'会展场馆设施及服务企业等'},
           {id:1403,label:'IC设计等电子信息研发类企业'},
           {id:1404,label:'生物医学研发企业等'},
           {id:1405,label:'软件、大数据与网络安全、数字文创、人工智能等服务业相关企业等'},
           {id:1406,label:'知识产权服务、专业技术服务、科技服务企业等'},
           {id:1407,label:'城镇燃气（CNG加气站）、成品油经营企业、电信服务企业'},
           {id:1408,label:'商场、超市、餐饮、家政、美容美发'},
           {id:1409,label:'再生资源回收、电子商务平台企业、汽车销售、药品流通市场'},
           {id:1410,label:'国际物流园区；国际班列公司、供应链企业等'},
           {id:1411,label:'房地产和建筑业；开发、 勘察、设计、施工、 监理、 物业管理服务'},
           {id:1412,label:'房地产和建筑行业中介机构，铁路、道路客货运输，高速公路管理'},
           {id:1413,label:'城市公交、出租汽车、客货运输场站'},
           {id:1414,label:'机动车维修、机动车驾驶培训、机动车停车场；仓储邮政快递；建筑劳务外包企业等'},
           {id:1415,label:'银行、保险、证券、基金、信托、消费金融公司'},
           {id:1416,label:'小额贷款、融资担保、融资租赁、商业保理、地方资产管理等公司；地方交易场所、典当行'},
           {id:1417,label:'区级国有企业和平台公司，会计师事务所等'},
           {id:1418,label:'殡葬管理单位、养老服务机构'},
           {id:1419,label:'旅游公司，文化旅游度假区，住宿业，图书馆、文化馆、体育健身场馆，各类文化娱乐场所'},
           {id:1420,label:'教育培训机构、继续教育机构，各类职业培训机构，医疗卫生服务机构；人力资源企业等'},
           {id:1421,label:'环卫服务、环境监测技术企业、节能环保企业'},
           {id:1422,label:'广告服务企业，农贸市场等'},
        ],
        peopleNumber:[
          {id:1,label:'100人以上(含)'},
          {id:2,label:'100人以下'},
        ],
        file:{
            name1:'请上传附件',
            name2:'请上传附件',
            name3:'请上传附件',
            name4:'请上传附件',
            name5:'请上传附件',
            name6:'请上传附件'
        },
        rules:{
            enterpriseName: [
            {
                required: true,
                message: "请填写企业名称",
                trigger: "blur"
            }
            ],
            peopleNumbers: [
            {
                required: true,
                message: "请选择企业人数",
                trigger: "blur"
            }
            ],
            streetId: [
            {
                required: true,
                message: "请选择企业经营所在地",
                trigger: "blur"
            }
            ],
            industry: [
            {
                required: true,
                message: "请选择所属行业",
                trigger: "blur"
            }
            ],
            address: [
            {
                required: true,
                message: "请选择经营地址",
                trigger: "blur"
            }
            ],
            legalPerson: [
            {
                required: true,
                message: "请填写法人代表",
                trigger: "blur"
            }
            ],
            building: [
            {
                required: true,
                message: "请填写楼宇",
                trigger: "blur"
            }
            ],
            tel: [
            {
                required: true,
                message: "请填写联系方式",
                trigger: "blur"
            }
            ],
            contacts: [
            {
                required: true,
                message: "请填写联系人",
                trigger: "blur"
            }
            ],
            telPhone: [
            {
                required: true,
                message: "请填写联系方式",
                trigger: "blur"
            }
            ],
            workDate: [
            {
                required: true,
                message: "请选择拟复工时间",
                trigger: "blur"
            }
            ],
            workNumber: [
            {
                required: true,
                message: "请填写拟复工人数",
                trigger: "blur"
            }
            ],
        }
    };
  },
  mounted() {
    //   console.log(myConfig.baseUrl);
      this.getTreeList()
  },
  methods:{
    downloadBtn(id){
        
         if(id==1){
            window.open(`${myConfig.baseUrl}/business/doc/企业复工备案申请表.docx`)
          }else if(id==2){
            window.open(`${myConfig.baseUrl}/business/doc/企业复工方案.docx`)
          }else if(id==3){
            window.open(`${myConfig.baseUrl}/business/doc/企业复工承诺书.docx`)
          }else if(id==4){
            window.open(`${myConfig.baseUrl}/business/doc/企业疫情防控应急预案范本.docx`)
          }else if(id==5){
            window.open(`${myConfig.baseUrl}/business/doc/企业员工健康情况申报卡.docx`)
          }else if(id==6){
            window.open(`${myConfig.baseUrl}/business/doc/企业复工全员健康台账.xlsx`)
          }
    },
     workDateChange(val){
         this.form.workDate = moment(val).format('YYYY-MM-DD')
     },
     fileChange1(e){  
        let file = e.target.files[0]
        this.file.name1=file.name
        this.fileData1=file 
      },
      fileChange2(e){
        let file = e.target.files[0]
        this.file.name2=file.name
        this.fileData2=file 
      },
      fileChange3(e){
        let file = e.target.files[0]
        this.file.name3=file.name
        this.fileData3=file        
      },
      fileChange4(e){
        let file = e.target.files[0]
        this.file.name4=file.name
        this.fileData4=file        
      },
      fileChange5(e){
        let file = e.target.files[0]
        this.file.name5=file.name
        this.fileData5=file          
      },
      fileChange6(e){
        let file = e.target.files[0]
        this.file.name6=file.name
        this.fileData6=file              
      },
    fileBtn(id){
        if(id==1){
            this.$refs.file1.click();
        }else if(id==2){
            this.$refs.file2.click();
        }else if(id==3){
            this.$refs.file3.click();
        }else if(id==4){
            this.$refs.file4.click();
        }else if(id==5){
            this.$refs.file5.click();
        }else if(id==6){
            this.$refs.file6.click();
        }
    },
    submit(){
        this.$refs.form.validate(async (valid, invalidFields) => {
           if (valid) {
            var formData = new FormData();
                formData.append("sqfile", this.fileData1,this.file.name1);
                formData.append("fgfile", this.fileData2,this.file.name2);
                formData.append("cnfile", this.fileData3,this.file.name3);
                formData.append("ygfile", this.fileData4,this.file.name4);
                formData.append("jkfile", this.fileData5,this.file.name5);
                formData.append("tzfile", this.fileData6,this.file.name6);
                formData.append("enterpriseName", this.form.enterpriseName);
                formData.append("peopleNumbers", this.form.peopleNumbers);
                formData.append("streetId", this.form.streetId);
                formData.append("industry", this.form.industry);
                formData.append("address", this.form.address);
                formData.append("building", this.form.building);
                formData.append("legalPerson", this.form.legalPerson);
                formData.append("tel", this.form.tel);
                formData.append("contacts", this.form.contacts);
                formData.append("telPhone", this.form.telPhone);
                formData.append("workDate", this.form.workDate);
                formData.append("workNumber", this.form.workNumber);
                // this.loading = true;
            fetch(`${myConfig.baseUrl}/business/epidemicEnterpriseDeclaration/addEnterprise`, {
                method: 'POST',
                body:formData,
                // data:this.model
                })
           } else {
            const firstKey = keys(invalidFields)[0];
            this.firstErr = invalidFields[firstKey][0];
        } 
        })
  

    },
    getTreeList: async function () {
        const data=await Api.workTreeList.get({organId: 2330}).then(res => {
            this.streetData = res.data.result.children
        })
    },
  }
};
</script>

<style lang="less">
.workRegisterBox{
    background: #C3E7FF;
    .topM{
        height: 60px;
        width: 640px;
        background: #C3E7FF
    }
    .topB{
        height: 70px;
        width: 640px;
        background: #C3E7FF
    }
    .footerButtonBox{
        width: 100%;
        height: 60px;
        background: #4e4e4e;
        position: fixed;
        bottom: 0px;
        left: 0;
        line-height: 60px;
        .footerButton{
            background: #2C82FC;
            margin-left: 44%;
            width: 12%;
            border: none;
            color: #fff;
            height: 34px;
        }
    }
    .el-form-item__label{
           font-weight: bold!important;
    }
}
.wapperBox {
    width: 640px;
  margin: 0 auto;
  
  background: #fff;
  .paddin20{
      padding : 0 20px;
  }
    .headTitle {
        width: 100%;
        height: 238px;
        margin-bottom: 20px;
        img{
                width: 100%;
        height: 238px;
        }
    }
    .mb40 {
        margin-bottom: 40px;
    }
    .mr46{
        margin-right: 46px;
    }
    a {
        color: #3366cc;
        }
  
    .needKnowBox {
        p {
        font-size: 14px;
        color: #696767;
        }
        div {
        text-align: center;
        margin-top: 20px;
        }
        .colRed {
        color: red;
        }
        .needKnowBoxTitle {
        text-align: center;
        margin-bottom: 10px;
        font-size: 20px;
        }
    }
    .downloadTemplateBox {
        p {
        padding-bottom: 18px;
        border-bottom: 1px dashed;
        }
        .colBule{
            color: #3366cc;
        }
        div {
        margin-top: 20px;
        }
    }
    .contactTips{
        font-size: 12px;
        color: #bbb4b4;
        border-top: 1px dashed #bbb4b4;
    }
    .fileBtn{
        // width: 200px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #8e8e8e;
        font-size: 14px;
        cursor: pointer;
        background: rgb(235, 229, 229);
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .pb30{
        padding-bottom: 30px;
    }
    .fw{
        font-weight:bold;
        font-size: 14px;
        color: #606266;
    }
    .redX{
        color:red;
    }
}
</style>