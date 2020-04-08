<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">非机动车登记</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="车主姓名" v-model="filter.vehicleOwnerName" clearable></el-input>
        <el-select v-model="filter.nonMotorizedVehicleType" placeholder="车辆类型" clearable>
          <el-option v-for="item in nonMotorizedVehicleType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-if="addBtnVisible">新增</el-button>
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
                <el-table-column prop="organName"  label="所属小区" align='center'></el-table-column>
                <el-table-column prop="rfidNumber" label="RFID号码" align='center'></el-table-column>
                <el-table-column prop="nonMotorizedVehicleTypeName" label="车辆类型" align='center'></el-table-column>
                <el-table-column prop="vehicleOwnerName" label="车主姓名" align='center'></el-table-column>
                <el-table-column prop="vehicleOwnerPhone" label="车主电话" align='center'></el-table-column>
                <el-table-column  label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini"  @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="danger"  size="mini"  @click="deleteRow(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增编辑-->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" top="6vh"  :modal-append-to-body='false' :close-on-click-modal="false" width="40%" >
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-row>
          <el-col :span="12">
            <el-form-item label="RFID号：" prop="rfidNumber">
              <el-input   v-model="model.rfidNumber"  maxLength="8"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车辆类型：" prop="nonMotorizedVehicleType">
              <el-select v-model="model.nonMotorizedVehicleType" placeholder="请选择">
                <el-option v-for="item in nonMotorizedVehicleType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号：">
              <el-input   v-model="model.licenseNumber"  maxLength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属单元：" prop="unitId">
              <el-select  placeholder="请选择" v-model="model.unitId" @change="unitChange($event)"  v-if="!model.id">
                <el-option v-for="item in unitList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="unitName" v-if="!!model.id" readonly></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="所属楼层："  prop="floorId">
              <el-select placeholder="请选择" v-model="model.floorId" @change="floorChange($event)"  v-if="!model.id">
                <el-option v-for="item in floorList"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="floorName" v-if="!!model.id" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门牌号："  prop="houseId">
              <el-select  placeholder="请选择" v-model="model.houseId" v-if="!model.id" @change="houseChange($event)">
                <el-option v-for="item in houseList"
                           :key="item.id"
                           :label="item.houseCode"
                           :value="item.id">
                </el-option>
              </el-select>
              <el-input v-model="houseName" v-if="!!model.id" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主：" prop="ownerId">
              <el-select  placeholder="请选择" v-model="model.ownerId" @change="personChange">
                <el-option v-for="item in housePersonList"
                           :key="item.personId"
                           :label="item.personName"
                           :value="item.personId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主电话：" prop="vehicleOwnerPhone">
              <el-input v-model="model.vehicleOwnerPhone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="dialog-table" v-show="tableVisible">
          <h3 class="flex">
            <span>可骑行人员</span>
            <span class="flexItem text_r">
               <el-select
                 v-model="personId"
                 filterable
                 remote
                 reserve-keyword
                 placeholder="新增人员，输入身份证查找"
                 :remote-method="remoteMethod"
                 :loading="searchLoading"
                  @change="searchChange">
              <el-option
                v-for="item in searchList"
                :key="item.id"
                :label="item.name + '('+item.identityNumber+')'"
                :value="item.id">
              </el-option>
            </el-select>
            </span>
          </h3>
          <el-table :data="personList"  style="width: 100%" stripe  :height='250' :max-height="250"  ref="multipleTable"  @selection-change="handleSelectionChange" >
            <el-table-column  width="55"  type="selection" align='center'></el-table-column>
            <el-table-column prop="personName"  label="姓名" align='center'></el-table-column>
            <el-table-column prop="identityNumber" label="证件号" align='center' width="220"></el-table-column>
            <el-table-column prop="featureImageUrl" label="人脸照片" align='center'>
              <template slot-scope="scope">
                <el-popover placement="left"  trigger="click">
                  <img :src="scope.row.photoPath" width="200"/>
                  <img slot="reference" :src="scope.row.photoPath"  width="40" height="40">
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr" style="margin-top: 15px;">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys, cloneDeep } from 'lodash'
  import { validatePhone, validateBlackSpace } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import { domHeightMixin } from '../../commom/mixins.js'
  import { nonMotorizedType } from '../../constants.js'
  export default {
    mixins: [ domHeightMixin ],
    name: 'nonMotorizedList',
    components: {
      OrganTree
    },
    data() {
      return {
        tableVisible:false,
        addBtnVisible:false,
        searchLoading:false,
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        searchList:[],
        housePersonList:[],
        personList:[],
        floorList:[],
        houseList:[],
        unitList:[],
        /*unitId:'',
        floorId:'',*/
        floorName:'',
        unitName:'',
        houseName:'',
        model:{},
        personId:'',
        total:0,
        filter: {
          organId: 0,
          page: 10,
          rows: 1,
          nonMotorizedVehicleType:'',
          vehicleOwnerName:''
        },
        firstErr:null,
        loading:false,
        nonMotorizedVehicleType:[],
        multipleSelection:[],
        rules: {
          rfidNumber: [{
            required: true,
            message: '请读取RFID卡号',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '请确认RFID卡号',
            trigger: 'blur'
          }],
          nonMotorizedVehicleType: [{
            required: true,
            message: '请选择车辆类型',
            trigger: 'blur'
          }],
          unitId:[{
            required: true,
            message: '请选择所属单元',
            trigger: 'blur'
          }],
          floorId:[{
            required: true,
            message: '请选择楼层',
            trigger: 'blur'
          }],
          houseId:[{
            required: true,
            message: '请选择房屋号',
            trigger: 'blur'
          }],
          ownerId: [{
            required: true,
            message: '请选择车主',
            trigger: 'blur'
          }],
          vehicleOwnerPhone: [{
            required: true,
            message: '请填写电话',
            trigger: 'blur'
          }, {
            validator: validatePhone,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }],

        },
      }
    },
    mounted(){
      this.filter.organId=JSON.parse(localStorage.getItem('user')).organId;
      this.organName=JSON.parse(localStorage.getItem('user')).organName;
      JSON.parse(localStorage.getItem('user')).organType==2?this.addBtnVisible=true:this.addBtnVisible=false;
      this.nonMotorizedVehicleType=nonMotorizedType
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.rfidList.post(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      pageChange(val) {
        this.filter.rows = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id
        item.organType==2?this.addBtnVisible=true:this.addBtnVisible=false;
        this._fetchData()
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteRFID.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({ message: '删除成功', type: 'success' })
            this._fetchData()
          }).catch(() => {

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //单元列表
      _fetchUnitList: async function() {
        const data = await Api.getUnitsByVillageId.get({},{
          pathParams: {
            villageId: this.filter.organId,
          }
        }).then(data => data.data.rows)
        this.unitList=data;
      },
      //房屋列表
      _fetchHouseList: async function(inFloorNum) {
        const data = await Api.getHouseByFloorNum.get({},{
          pathParams: {
            unitId: this.model.unitId,
            inFloorNum: inFloorNum,
          }
        }).then(data => data.data.rows)
        this.houseList=data;
      },
      //人员列表
      _fetchPernson: async function(houseId) {
        const data = await Api.houseDetails.get({}, {
          pathParams: {
            houseId: houseId
          }
        }).then(data => data.data.rows)
        this.personList=data
        this.housePersonList=cloneDeep(data)
      },
      //选择单元
      unitChange(value){
        this.floorList=[]
        this.houseList=[];
        this.personList=[];
        this.housePersonList=[];
        this.model.floorId='';
        this.model.houseId='';
        this.model.ownerId='';
        this.model.vehicleOwnerPhone=''
        this.model.vehicleOwnerName=''
        this.tableVisible=false;
        this.model.unitId=value;
        let floor=this.unitList.find(item => item.id === value);
        for(let i=0;i<floor.floorNum*1;i++){
          this.floorList[i]={label:(i+1),id:(i+1)}
        }
      },
      //选择楼层
      floorChange(val){
        this.houseList=[]
        this.personList=[];
        this.housePersonList=[];
        this.model.houseId='';
        this.model.ownerId='';
        this.model.vehicleOwnerPhone=''
        this.model.vehicleOwnerName=''
        this.tableVisible=false;
        this._fetchHouseList(val);

      },
      //选择房屋
      houseChange(val){
        this.personList=[];
        this.housePersonList=[];
        this.model.ownerId='';
        this.model.vehicleOwnerPhone=''
        this.model.vehicleOwnerName=''
        this.tableVisible=false;
        this._fetchPernson(val);
      },
      //选择人员
      personChange(val){
        this.model.ownerId=val;
        let person=this.housePersonList.find(item => item.personId === val);
        this.model.vehicleOwnerPhone=person.tel;
        this.model.vehicleOwnerName=person.personName;
        this.tableVisible=true;
        this.personList.forEach(item=>{
            if(person.personId==item.personId){
              this.$refs.multipleTable.toggleRowSelection(item,true);
              return false
            }
        })

      },
      //搜索人员
      remoteMethod(query) {
        if (query !== '') {
          this.searchLoading = true;
          let personList = Api.selectPerson.get({queryStr: query,row:1000, page:1}).then(data =>{
            this.searchList=data.data.rows
          })
          this.searchLoading = false;
        } else {
          this.searchList=[]
        }
      },
      searchChange(val){
        let person=this.searchList.find(item => item.id === val);

        let temp=this.personList.find(item => item.personId*1 === person.id*1)
        console.log(temp)
        if(!temp){
          person.personName=person.name
          person.personId=person.id
          this.personList.push(person)
          this.personId='';
          this.searchList=[]
        }else {
          this.$message({message: '不能添加重复的人员', type: 'warning'});
          this.personId='';
          this.searchList=[]
        }
      },
      //table选中
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      async editRow(row={
        licenseNumber:'',
        nonMotorizedVehicleType:'',
        organId:'',
        rfidNumber:'',
        vehicleOwnerName:'',
        vehicleOwnerPhone:'',
        riders:[],
        unitId:'',
        floorId:'',
        houseId:'',
        ownerId:''

      }){
        if(row.id){
          this.dialogFormTitle="编辑"
          const data = await Api.getRFIDById.get({},{
            pathParams: {
              id: row.id
            }
          }).then(data => data.data.result)
          this.houseName = data.houseName;
          this.floorName= data.floorName;
          this.unitName = data.unitName;
          this.personList=data.riders;
          this.housePersonList = await Api.houseDetails.get({}, {
            pathParams: {
              houseId: data.houseId
            }
          }).then(data => data.data.rows)
          this.tableVisible=true;
          this.$nextTick(()=>{
            data.riders.forEach(item=>{
              if(item.flag==0){
                this.$refs.multipleTable.toggleRowSelection(item,true);
              }
            })
          })
          this.model = cloneDeep(data);
        }else {
          this.model = cloneDeep(row);
          this.dialogFormTitle ='新增'
          this.floorList=[];
          this.houseList=[];
          this.personList=[];
          this.housePersonList=[];
          this.model.unitId = '';
          this.model.floorId='';
          this.tableVisible=false;
          this.model.organId = this.filter.organId;
          this._fetchUnitList()
        }
        this.firstErr = null
        this.dialogFormVisible = true
      },
      async submit() {
        console.log(this.model)
        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            let temp=false
            this.multipleSelection.forEach((item)=>{
              if(item.personId*1===this.model.ownerId*1){
                temp=true
                return false
              }
            })
            if(!temp){
              this.$message({message: '车主必须被选中', type: 'warning'});
              return false
            }
            this.personList.forEach((person,index)=>{
              let flag=1;
              this.multipleSelection.forEach((item)=>{
                if(person.personId==item.personId) flag=0
              })
              this.model.riders[index]={
                populationId:person.personId,
                flag:flag
              }
            })
            this.firstErr = null
            this.loading = true
            await Api.addRFID[this.model.id ? 'put' : 'post'](this.model)
              .then(()=>{
                if (this.model.id) {
                  this.$message({ message: '修改成功', type: 'success' })
                } else {
                  this.$message({ message: '新增成功', type: 'success' })
                }
                this.loading = false
                this.dialogFormVisible = false
                this.firstErr = null
                this.$refs.form.resetFields()
                this._fetchData()
              }).catch(err => {
                this.loading = false
              })
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
    },
  };
</script>
<style lang="less">

</style>
