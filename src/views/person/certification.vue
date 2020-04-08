<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">用户记录</span>

      <div class="text_r flexItem">
        <el-input type="text" placeholder="姓名" v-model="filter.username" clearable></el-input>
        <el-input type="text" placeholder="身份证号码"  v-model="filter.identitynumber" clearable></el-input>
        <el-input type="text" placeholder="电话号码"  v-model="filter.phone" clearable></el-input>
        <el-date-picker @change="changeDate" v-model="time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable></el-date-picker>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="24"  style="height: 100%">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center'   type="index"></el-table-column>
                <el-table-column prop="username" label="姓名" align='center'></el-table-column>
                <el-table-column prop="phone" label="电话号码" align='center'></el-table-column>
                <el-table-column prop="identitynumber" label="证件号" align='center'></el-table-column>
                <el-table-column prop="photopath" label="照片" align='center'>
                  <template slot-scope="scope">
                    <el-popover placement="left"  trigger="click">
                      <img :src="scope.row.photopath" width="500"/>
                      <img slot="reference" :src="scope.row.photopath"  width="40" height="40">
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column prop="createtimeStr" label="认证时间" align='center'></el-table-column>
                <el-table-column  label="登记时间" align='center'>
                  <template slot-scope="scope">
                    {{scope.row.createtime | moment('YYYY-MM-DD hh:mm')}}
                  </template>
                </el-table-column>
                <el-table-column prop="appid" label="微信id" align='center'></el-table-column>
                <el-table-column  label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="untying(scope.row)">解除绑定</el-button>
                    <!-- <el-button type="primary" size="mini" @click="editRow(scope.row)">新增地址</el-button>                  -->
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

    <el-dialog title="新增地址" :visible.sync="addAdrees" :close-on-press-escape="false" :modal-append-to-body='false' width="50%" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false" class="population-dialog">
         <h3 class="flex">
          <span>居住信息</span>
          <span class="flexItem text_r" @click="addLive">+新增一个居住信息</span>
        </h3>
      <el-row class="population-dialog-box" v-for="(item,index) in model.populationHouses" :key="index">
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="所属小区：" >
              <el-popover  width="300" trigger="click" v-model="item.visible">
                <div style="height: 300px;max-height: 300px;overflow: auto" class="popover">
                  <el-tree :data="treeList"
                           :props="defaultProps"
                           @node-click="selectOrgId"
                           highlight-current
                           :expand-on-click-node="false"
                           :default-checked-keys="[organId]"
                           node-key="id">
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                          <span v-if="data.organType==1">机构 : {{ data.name }}</span>
                          <span v-if="data.organType==2" style="color:#00C2FF">小区 : {{ data.name }}</span>
                     </span>
                  </el-tree>
                   <div class="center">
                        <el-button  type="primary" size="mini" @click="submitUnit(item,index)">确定</el-button>
                   </div>
                </div>
                <el-input v-model="item.orgName" slot="reference" autocomplete="off" placeholder="请选择小区" readonly></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="所属单元：" >
              <el-select  placeholder="请选择" v-model="item.unitId" @change="unitChange($event,index)">
                <el-option v-for="item in unitList[index]"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="所属楼层：" >
              <el-select placeholder="请选择" v-model="item.floorId" @change="floorChange($event,index)">
                <el-option v-for="item in floorList[index]"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font-houseId font">*</span>
            <el-form-item label="门牌号：" >
              <el-select  placeholder="请选择" v-model="item.houseId">
                <el-option v-for="item in houseList[index]"
                           :key="item.id"
                           :label="item.houseCode"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="人口类型：" >
              <el-select v-model="item.liveType" placeholder="请选择">
                <el-option v-for="item in liveType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="住户类型：" >
              <el-select v-model="item.poType" placeholder="请选择">
                <el-option v-for="item in poType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="是否业主：">
              <el-select v-model="item.isHolder" placeholder="请选择">
                <el-option v-for="item in isHolderType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

          </el-col>
          <el-col>
            <div class="remove" @click="removeLive(index)"> 移除</div>
          </el-col>
        </el-row>
     </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAdrees = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys } from "lodash";
import { validateIdCard, validatePhone } from "../../commom/validator";
import { domHeightMixin } from "../../commom/mixins.js";
import OrganTree from "../../components/OrganTree.vue";
import moment from "moment";
export default {
  name: "certification",
  mixins: [domHeightMixin],
  components: { OrganTree },
  data() {
    return {
      isHolderType: [{ id: 0, label: "是" }, { id: 1, label: "否" }],
      organId:'',
      poType: [{ id: 1, label: "住户" }, { id: 2, label: "租客" }],
      liveType: [
        { id: 1, label: "户籍人口" },
        { id: 2, label: "常住人口" },
        { id: 3, label: "流动人口" }
      ],
      dialogFormVisible: false,
      dialogFormTitle: "",
      unitList: [],
      floorList: [],
      houseList: [],
      tableData: [
        /*{
            'username':'',
            'identitynumber':'',
            'phone':'',
            'photopath':'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552401882318&di=ea36cf57e53ab298ccc1d515ea43ddd2&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimage%2Fc0%253Dpixel_huitu%252C0%252C0%252C294%252C40%2Fsign%3D721df1f7f7039245b5b8e94feeecc1ae%2Fd043ad4bd11373f033d168a5af0f4bfbfbed0419.jpg',
            'createtimeStr':''
          }*/
      ],
      total: 0,
      time: [],
      item:{},
      addAdrees:false,
      rules:{},
      filter: {
        orgId: 1,
        page: 1,
        rows: 10,
        username: "",
        identitynumber: "",
        startTime: "",
        endTime: ""
      },
      model:{
        populationHouses:[]
      },
      treeList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      firstErr: null,
      loading: false
    };
  },
  mounted() {
    this._fetchData();
    this._fetchOrganData()
  },
  methods: {
        //机构树
    _fetchOrganData: debounce(async function() {
      const data = await Api.organTree.get({}).then(data => data.data.result);
      this.treeList = [data] || [];
    }, 100),
      //单元列表
    _fetchUnitList: debounce(async function(index) {
      const data = await Api.getUnitsByVillageId
        .get(
          {},
          {
            pathParams: {
              villageId: this.organId
            }
          }
        )
        .then(data => data.data.rows);
      this.$set(this.unitList, index, data);
      //this.unitList[index]=data;
    }, 100),
    //房屋列表
    _fetchHouseList: debounce(async function(inFloorNum, index) {
      const data = await Api.getHouseByFloorNum
        .get(
          {},
          {
            pathParams: {
              unitId: this.unitId,
              inFloorNum: inFloorNum
            }
          }
        )
        .then(data => data.data.rows);
      //this.houseList[index]=data
      this.$set(this.houseList, index, data);
    }, 100),
     //选择小区
    selectOrgId(item) {
      this.organId = item.id;
      this.organName = item.name;
    },
    submitUnit(item, index) {

      this.model.populationHouses[index].orgId = this.organId;
      this.model.populationHouses[index].orgName = this.organName;
      this.model.populationHouses[index].visible = false;
      this.model.populationHouses[index].unitId = "";
      this.model.populationHouses[index].floorId = "";
      this.model.populationHouses[index].houseId = "";
      this.floorList[index] = [];
      this.houseList[index] = [];
      this._fetchUnitList(index);
    },
    //选择楼层
    unitChange(value, index) {
      this.houseList[index] = [];
      this.model.populationHouses[index].floorId = "";
      this.model.populationHouses[index].houseId = "";
      this.unitId = value;
      let floor = this.unitList[index].find(item => item.id === value);
      for (let i = 0; i < floor.floorNum * 1; i++) {
        this.floorList[index][i] = { label: i + 1, id: i + 1 };
      }
    },
    //选择门牌号
    floorChange(val, index) {
      this.model.populationHouses[index].houseId = "";
      this._fetchHouseList(val, index);
    },
      //添加居住信息
    addLive() {
      this.model.populationHouses.push({
        houseId: "",
        liveType: "",
        poType: "",
        orgId: "",
        orgName: "",
        visible: false,
        unitId: "",
        floorId: "",
        isHolder: 1,
        effectiveTime:'',
      });
    },
    //移除居住信息
    removeLive(index) {
      this.model.populationHouses.splice(index, 1);
      this.houseList.splice(index, 1);
      this.unitList.splice(index, 1);
      this.floorList.splice(index, 1);
      this.liveTypeList.split(index, 1);
      this.poTypeList.split(index, 1);
    },
    _fetchData: debounce(async function() {
      const data = await Api.getCertificationLst
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);
         console.log(data.rows);
       if(data.rows.length>0){
            for(var i=0;i<data.rows.length;i++){
              if(data.rows[i].identitynumber==null){

              }else{
              var ss=data.rows[i].identitynumber
              var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
                var i="";
                while(i.length<z.length){i+="*"}
                return y+i+p

            })
              data.rows[i].identitynumber=str1
              }

           }
      }


      this.tableData = data.rows;
      this.total = data.total;
      // console.log(this.tableData);

    }, 100),
    untying(row){
        this.$confirm(`确定要解除该人员的绑定微信？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.removeWechatEr.put({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '解绑微信成功', type: 'success'})
            this._fetchData()
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '解绑微信出现错误!'
            })
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    editRow(){
       this.model.populationHouses = [
          {
            poType: 1,
            liveType: 1,
            unitId: "",
            floorId: "",
            houseId: "",
            isHolder: 1,
            effectiveTime:'',
          }
        ];
      this.addAdrees=true
    },
    submit(){},
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    changeDate(val) {
      if (val) {
        this.filter.startTime = moment(val[0]).format("YYYY-MM-DD HH:mm:ss");
        this.filter.endTime = moment(val[1]).format("YYYY-MM-DD HH:mm:ss");
      }else {
        this.filter.startTime=''
        this.filter.endTime=''
      }
    }
  }
};
</script>
<style lang="less">
.input {
  position: relative;
}
.font {
  font-size: 14px;
  color: red;
  position: absolute;
  top: 14px;
  left: 28px;
}
</style>
