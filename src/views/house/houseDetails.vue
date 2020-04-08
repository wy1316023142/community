<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">房屋管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click=" dialogFormVisible = true ">新增</el-button>
        <el-button type="primary" size="small" @click="goBack()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <div class="zhsq-tree-box">
            <h3>单元</h3>
            <el-tree class="zhsq-tree"
                     ref="tree"
                     :expand-on-click-node="false"
                     :data="unitList"
                     :props="defaultProps1"
                     @node-click="unitNodeClick"
                     :default-expanded-keys="defaultExpandKeys"
                     highlight-current
                     node-key="id">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-innerTop flex">
            <span class="top-icon"></span>
            <p class="title">{{this.houseAddress}}</p>
          </div>
          <div class="zhsq-right-con" ref="content">
            <div class=" house-con">
              <div class="house-details" :style="{height:tabHeight+'px',maxHeight:tabHeight+'px'}">
                <el-row>
                  <div v-if="list.length==0">
                    <div class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
                  </div>
                  <el-col :span="12" v-for="item in list">
                    <div class="flex house-item">
                      <div class="house-img">
                        <img :src="item.photoPath">
                      </div>
                      <div class="flexItem house-con">
                        <p>姓名：{{item.personName}}</p>
                        <p>性别：{{item.sex == 0 ? '男':'女 '}}</p>
                        <p >人口类型：{{item.liveTypeName}}</p>
                        <p>电话号码：{{item.tel}}</p>
                        <p>身份证号：{{item.identityNumber}}</p>
                        <p class="houseDetailseffectiveTime">{{item.effectiveTime}}</p>
                        <div class="div text_r">
                          <div class="hold" v-if="item.isHolder==0" @click="changeOwner(item)">业主</div>
                          <div class="sethold" @click="setHouseholder(item)" v-if="item.isHolder==1">非业主</div>
                          <!-- <el-button type="primary" size="small" @click="changeOwner(item)" v-if="item.isHolder==0">业主</el-button> -->
                          <!-- <el-button type="primary" size="small" @click="changeOwner(item)" v-if="item.isHolder==0">非业主</el-button> -->
                          <div class="hold" @click="removePerson(item)">移除</div>
                          <div class="hold" @click="edit(item)">编辑</div>
                          <div class="hold" @click="seeDetailsBtn(item)">查看详情</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="添加住户" :visible.sync="dialogFormVisible"   :close-on-click-modal="false"  :modal-append-to-body='false' width="400px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="新增用户：" prop="personId">
          <el-select
          v-model="model.personId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="remoteMethod"
          :loading="searchloading">
          <el-option
            v-for="item in personList"
            :key="item.id"
            :label="item.name + '('+item.identityNumber+')'"
            :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="人口类型：" prop="liveType">
          <el-select v-model="model.liveType" placeholder="请选择">
            <el-option v-for="item in liveType"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="住户类型：" prop="poType">
          <el-select v-model="model.poType" placeholder="请选择">
            <el-option v-for="item in poType"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权日期 : "  v-show="model.poType===2">
           <el-date-picker
              v-model="model.grantTime"
              type="date"
              @change="changeDate"
              :picker-options="expireTimeOption"
              placeholder="选择日期"
              clearable
              >
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改居住类型" :visible.sync="editFormVisible" :close-on-click-modal="false"   :modal-append-to-body='false' width="400px">
      <el-form ref="form" :show-message="false">
        <el-form-item label="人口类型：">
          <el-select v-model="person.liveType" placeholder="请选择">
            <el-option v-for="item in liveType"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="住户类型：">
          <el-select v-model="person.poType" placeholder="请选择">
            <el-option v-for="item in poType"
                       :label="item.value"
                       :value="item.id"
                       :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权日期："  v-show="person.poType===2">
           <el-date-picker
              v-model="person.grantTime"
              type="date"
              @change="changeDate1"
              :picker-options="expireTimeOption"
              placeholder="选择日期"
              clearable
              >
            </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="PersonSubmit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
      <el-dialog class="population-dialog"  :close-on-click-modal="false" title="人员信息详情" :visible.sync="detailsDataShow"  :modal-append-to-body='false' width="50%" top="5vh">
      <el-form ref="form" :model="detailsData" :rules="rules" :show-message="false">
        <h3><span>人员信息</span></h3>
        <el-row class="houseDetailsMes">


           <el-col :span="10">
            <div class="detailsImgBox">
              <!--编辑头像-->
              <el-col prop="imgStr">
                <el-form-item >
                  <div class='detailsImg'>
                    <img :src="detailsData.photoPath"/>

                  </div>
                </el-form-item>
              </el-col>

             </div>

              <el-col >
                <el-form-item label="民族：">
                  <div>
                    {{detailsData.nationName}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col >
                  <el-form-item label="政治面貌：" >
                  <div>
                    {{detailsData.political}}
                  </div>
                  </el-form-item>
              </el-col>
              <el-col>
                  <el-form-item label="职务：">
                  <div>
                    {{detailsData.post}}
                  </div>
                  </el-form-item>
              </el-col>
           </el-col>
           <el-col :span="14">
             <div>
              <el-col >
                <el-form-item label="姓名：">
                  <div>
                    {{detailsData.name}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="身份证号码：">
                  <div>
                    {{detailsData.identityNumber}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="手机号码：">
                  <div>
                    {{detailsData.tel}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="性别：">
                  <div>
                    {{detailsData.sex}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="年龄：">
                  <div>
                    {{detailsData.age}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="学历水平：" >
                    <div>
                    {{detailsData.education}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="籍贯：">
                  <div>
                   {{detailsData.nativeProvince}} {{detailsData.nativeCity}}
                  </div>
                </el-form-item>
              </el-col>
              <el-col >

              </el-col>
            </div>

           </el-col>
        </el-row>
        <!-- <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div> -->
        <h3 class="flex">
          <span>居住信息</span>
        </h3>
        <el-row class="populationMes" v-for="(item,index) in detailsData.populationHouses" :key="index">
         <el-col :span="12">
           <el-form-item :label="item.addNum">
                  <div>
                   {{item.houseAddress}}
                  </div>
            </el-form-item>
         </el-col>
          <el-col :span="6">
           <el-form-item label="是否业主：">
                <template v-if="item.isHolder=='1'">否</template>
                <template v-if="item.isHolder=='0'">是</template>
            </el-form-item>
         </el-col>
          <el-col :span="6">
           <el-form-item label="住户类型：">
                <template v-if="item.poType=='1'">住户</template>
                <template v-if="item.poType=='2'">租客</template>
            </el-form-item>
         </el-col>
        </el-row>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsDataShow = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys, cloneDeep } from 'lodash'
  import { validateIdCard ,validatePhone } from '../../commom/validator'
  import moment from 'moment'
  export default {
    name: 'houseDetalis',//
    data() {
      return {
        expireTimeOption: {
          disabledDate(date) {
        //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() < Date.now() - 8.64e7;
          }
        },
        addNum:'',
        queryStr:'',
        personList: [],
        searchloading:false,
        loading:false,
        dialogFormVisible:false,
        detailsDataShow:false,
        editFormVisible:false,
        list:[],
        detailsData:{},
        tabHeight:'0',
        unitId:'',
        organId:'',
        houseId:'',
        houseAddress:'',
        unitList:[],
        defaultProps1: {
          children: 'children',
          label: 'unitName'
        },
        person:{
          houseId:'',
          personId:'',
          liveType:'',
          poType:''
        },
        model:{
          houseId:'',
          personId:'',
          liveType:'',
          poType:''
        },
        firstErr:"",
        rules: {
          personId: [{
            required: true,
            message: '请选择添加用户',
            trigger: 'blur'
          }],
          liveType: [{
            required: true,
            message: '请填选择人口类型',
            trigger: 'blur'
          }],
          poType: [{
            required: true,
            message: '请填选择住户类型',
            trigger: 'blur'
          }]
        },
        liveType:[
          {id: 1, value: '户籍人口'},
          {id: 2, value: '常住人口'},
          {id: 3, value: '流动人口'}
        ],
        poType:[
          {id: 1, value: '住户'},
          {id: 2, value: '租客',disabled:false}
        ]
      }
    },
    computed: {
      defaultExpandKeys() {
        return [this.unitList.length ? this.unitList[0].id : '']
      }
    },
    mounted(){
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight
        };
      })
      if(this.$route.query.unitId&&this.$route.query.organId&&this.$route.query.houseId){
        this.unitId= this.$route.query.unitId;
        this.organId= this.$route.query.organId;
        this.houseId= this.$route.query.houseId;
        this.model.houseId= this.$route.query.houseId;
        this._fetchUnitTree();
        this._fetchHouseDetails();
      }else {
        this.$router.push({name: 'houseList'})
      }
    },
    methods: {
      seeDetailsBtn(item){
          Api.getPopulationById
          .get(
            {},
            {
              pathParams: {
                orgId: item.orgId,
                id: item.personId
              }
            }
          ).then(res=>{
            this.detailsDataShow=true
            var data=res.data.result
            data.sex == 0 ? (data.sex = "男") : (data.sex = "女");
              if(data.nationName==''){
                data.nationName='暂无数据'
              }
              if(data.nativeProvince==''){
                data.nativeProvince='暂无数据'
              }
              if(data.education==0){data.education='高中'}
              else if(data.education==1){data.education='中专'}
              else if(data.education==2){data.education='大专'}
              else if(data.education==3){data.education='大学本科'}
              else if(data.education==4){data.education='研究生'}
              else if(data.education==5){data.education='初中以下'}
              else if(data.education==6){data.education='文盲或半文盲'}
              else{data.education='暂无数据'}

              if(data.post==0){data.post='务农'}
              else if(data.post==1){data.post='公职'}
              else if(data.post==2){data.post='经商'}
              else if(data.post==3){data.post='务工'}
              else if(data.post==4){data.post='上学'}
              else if(data.post==5){data.post='退休'}
              else if(data.post==6){data.post='宗教教职'}
              else{data.post='暂无数据'}

              if(data.political==0){data.political='群众'}
              else if(data.political==1){data.political='团员'}
              else if(data.political==2){data.political='党员'}
              else{data.political='暂无数据'}
              for (let i = 0; i < data.populationHouses.length; i++) {
                var addNum=i+1
                data.populationHouses[i].addNum=`住址${addNum}: `
              }
            this.detailsData=res.data.result
          })
      },
      //小区树
      _fetchUnitTree: debounce(async function() {
        const data = await Api.getUnitTreesByOrganId.get({}, {
          pathParams: {
            organId: this.organId
          }
        }).then(data => data.data.rows)
        this.unitList=data || []
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.unitId)
          this.houseAddress=this.$refs.tree.getCurrentNode().unitName+this.$route.query.houseCode
        })
      }),
      //房屋人员列表
      _fetchHouseDetails: debounce(async function() {
        const data = await Api.houseDetails.get({}, {
          pathParams: {
            houseId: this.houseId
          }
        }).then(data => data.data.rows)
        data.forEach(v=>{
          if(v.effectiveTime){
            v.effectiveTime=`截止授权日期:${moment(v.effectiveTime).format('YYYY-MM-DD')}`
          }
          var ss=v.identityNumber
          var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p

        })
        v.identityNumber=str1
          if(v.photoPath==null){
            v.photoPath=require('../../assets/images/mr.png')
          }
        })
        this.list=data
      }),
      changeDate(val){
        if(val){
          this.model.grantTime=moment(val).format('YYYY-MM-DD')
        }else {
          this.model.grantTime=''
        }
      },
      changeDate1(val){
        if(val){
          this.person.grantTime=moment(val).format('YYYY-MM-DD')
        }else {
          this.person.grantTime=''
        }
      },
      //返回
      goBack(){
        this.$router.push({name: 'unitList',query: {unitId:this.unitId,organId:this.organId}})
      },
      //点击小区树
      unitNodeClick(data){
        if(data.parentId!==null){
          this.unitId=data.id
          this.organId=data.parentId
          this.$router.push({name: 'unitList',query: {unitId:this.unitId,organId:this.organId}})
        }else {
          this.goBack()
        }
      },
      //查询人员
      remoteMethod(query) {
        if (query !== '') {
          this.searchloading = true;
          let personList = Api.selectPerson.get({queryStr: query,row:1000, page:1}).then(data =>{
            this.personList=data.data.rows
          })
          this.searchloading = false;
        } else {
          this.personList=[]
        }
      },
      //提交
     async submit(){

        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            await Api.addHousePerson.post( this.model
            ).then(()=>{
              this.$message({ message: '添加成功', type: 'success' })
              this.loading = false
              this.dialogFormVisible=false;
              this._fetchHouseDetails()
            }).catch(()=>{
              this.loading = false
            })
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })


      },
      PersonSubmit(){
        this.loading = true
        Api.editLiveType.post(this.person).then(()=>{
          this.$message({ message: '修改成功', type: 'success' })
          this.loading = false
          this.editFormVisible=false;
          this._fetchHouseDetails()
        }).catch(()=>{
          this.loading = false
        })
      },

      //编辑
      edit(item){
        console.log(item)
        if(item.effectiveTime!='Invalid date'){
          item.grantTime=item.effectiveTime
        }
        this.person=cloneDeep(item);
        if(item.isHolder==0){
          //户主
          this.poType[1].disabled=true
          this.person.poType=1
        }else{
          //非户主
          this.poType[1].disabled=false

        }

        this.editFormVisible=true
      },
      //移除
      removePerson(item){
        this.$confirm(item.isHolder == 0 ? '当前为业主，确定移除吗？': `确定要移除当前住户吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          //
          await Api.removePerson.delete({},{
            pathParams: {
              houseId: this.houseId,
              personId: item.personId
            }
          }).then(()=>{
            this.$message({ message: '移除成功', type: 'success' })
            this._fetchHouseDetails()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      changeOwner(item){
        Api.cancelhouseholder.put({}, {
          pathParams: {
            houseId: this.houseId,
            personId: item.personId,
          }
        }).then(()=>{
          this.$message({ message: '设置成功', type: 'success' })
          this._fetchHouseDetails()

        })
      },
      //设置业主
      setHouseholder(item){
         Api.setHouseholder.put({},{
          pathParams: {
            houseId: this.houseId,
            personId: item.personId
          }
        }).then(()=>{
          this.$message({ message: '设置成功', type: 'success' })
          this._fetchHouseDetails()
        })
      },
    },
  };
</script>
<style lang="less">
.houseDetailseffectiveTime{
     height: 19px;
}
.detailsImgBox{
  width: 181px;
  height: 214px;
  border:1px solid #ccc;
  margin-left: 50px;
}
.detailsImg{
  img{
    height: 214px;
     width: 181px;
    }
}
.populationMes{
  border-bottom: 1px dashed #DCDFE6;
  .el-form-item__label{
    color: #757795
  }
}
.houseDetailsMes{
  .el-form-item__label{
    color: #757795
  }
  .el-form-item__content{
    font-weight: 600
  }
}
</style>
