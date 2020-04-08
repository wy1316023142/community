<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">房屋管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="edit()" v-if="addVisible" v-allow="400101">新增单元</el-button>
        <el-button type="primary" size="small" @click="exportData()" v-if="addVisible" v-allow="400102">导出</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree  @node-click="orgNodeClick" :activeKey="activeKey" :defaultExpandKey="defaultExpandKey"></organ-tree>
        </el-col>
        <el-col :span="19" style="height: 100%">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox house-con">
              <el-row :gutter="20">
                <el-col :span="14">
                  <div class="house-l" :style="{height:tabHeight+'px',maxHeight:tabHeight+'px'}">
                    <el-row :gutter="20">
                      <template v-if="addVisible">
                        <div v-if="houseList.length==0">
                          <div class="el-tree__empty-block"><span class="el-tree__empty-text">小区下还未新建单元楼，请新建！</span></div>
                        </div>
                        <el-col :span="8" v-for="item in houseList">
                          <div class="unitBox" @click.stop="jump(item)">
                            <div class="flex">
                              {{item.name}}
                              <div class="text_r flexItem">
                                <el-button @click.stop="edit(item)" type="primary" size="mini" icon="el-icon-edit" circle></el-button>
                                <el-button @click.stop="del(item)" type="primary" size="mini" icon="el-icon-delete" circle></el-button>
                              </div>
                            </div>
                          </div>
                        </el-col>
                      </template>
                      <template v-if="!addVisible">
                        <div class="el-tree__empty-block"><span class="el-tree__empty-text">请选择小区机构管理单元房屋</span></div>
                      </template>
                    </el-row>
                  </div>
                </el-col>
                 <div class="houseListPartitionLine"></div>
                <el-col :span="10">
                  <div class="house-r" :style="{height:tabHeight+'px',maxHeight:tabHeight+'px'}">
                    <div class="house-charts">
                      <h3>辖区房屋居住情况</h3>
                      <div class="backLine"></div>
                      <div class="topLine w143"></div>
                      <div class="house-chartsRadar" v-if="addVisible">
                         <IEcharts :option="pie" ref="pie" ></IEcharts>
                      </div>
                    </div >
                    <div class="houseDataBox">
                      <h3>辖区房屋数据</h3>
                      <div class="backLine"></div>
                      <div class="topLine w106"></div>
                      <div class="houseData">
                        <div class="unitNum">
                          <div>
                          <h1>{{houseListData.unitCount }}</h1>
                          <p>单元数量</p>
                          </div>
                        </div>
                        <div class="houseNum">
                          <div>
                          <h1>{{houseListData.houseCount}}</h1>
                          <p>房屋数量</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="houseDataBox">
                      <h3>辖区人员情况</h3>
                      <div class="backLine"></div>
                      <div class="topLine w106"></div>
                      <div class="houseData">
                        <div class="unitNum">
                          <div>
                          <h1>{{houseListData.householdCount  }}</h1>
                          <p>住户</p>
                          </div>
                        </div>
                        <div class="houseNum">
                          <div>
                          <h1>{{houseListData.leasePersonCount }}</h1>
                          <p>租户</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"  :close-on-click-modal="false" :modal-append-to-body='false' width="470px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="小区名称：">
          <el-input  autocomplete="off" v-model="villageName" readonly></el-input>
        </el-form-item>

        <el-form-item label="所在楼栋：" prop="buildingId">
          <el-select v-model="model.buildingId" placeholder="请选择" @change="selectBuilding" :disabled="!!model.id">
            <el-option v-for="item in floor"
                       :label="item.buildingNumber"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-row class="dialog-input-row">
          <el-col :span="20">
            <el-form-item label="单元名称：" prop="unitNum">
              <el-input  autocomplete="off" v-model="model.unitNum " :readonly="!!model.id"></el-input>
            </el-form-item>
          </el-col>
          <el-col  :span="4" class="flexItem center">单元</el-col>
        </el-row>

        <el-form-item label="楼层数量：" prop="floorNum">
          <el-input  autocomplete="off" v-model="model.floorNum" :readonly="!!model.id"></el-input>
        </el-form-item>

        <el-form-item label="梯  户 比："  class="dialog-input-row" prop="elevatorNum">
          <el-row >
            <el-col :span="10">
              <el-input  autocomplete="off" v-model="model.elevatorNum "></el-input>
            </el-col>
            <el-col :span="2"  class="center">梯</el-col>
            <el-col  :span="10">
              <el-input  autocomplete="off" v-model="model.houseNum"></el-input>
            </el-col>
            <el-col :span="2" class="center">户</el-col>
          </el-row>
        </el-form-item>

        <el-form-item v-show='false'  prop="houseNum">
          <el-input v-model="model.houseNum"></el-input>
        </el-form-item>

      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
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
  import OrganTree from '../../components/OrganTree.vue'
  import IEcharts from 'vue-echarts-v3/src/full.js'
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    name: 'houseList',//
    components: {OrganTree,IEcharts},
    data() {
      return {
        defaultExpandKey:[],
        activeKey:'',
        addVisible:false,
        loading:false,
        firstErr:null,
        floor:[],
        dialogFormTitle:'',
        dialogFormVisible:false,
        organName:'',
        villageName:'',
        organId:'',
        tabHeight:'0',
        unitList:[],
        houseList:[],
        filter:{},
        model:{},
        houseListPartitionLineHeight:'',
        houseListData:{
          unitCount :'-',
          houseCount :'-',
          householdCount :'-',
          leasePersonCount:'-',
        },

        pie:{
          color:['#7F66D2','#5678CD','#C1C5E2'],
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
           legend: {
              orient: 'vertical',
              x: '65%',
              y:'center',
              data:['出租','自住','空置']
          },
          series: [
            {
              name:'房屋类型',
              type:'pie',
              radius : ['50%', '80%'],
              center: ['30%', '55%'],
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  formatter: "{d}%",
                  textStyle: {
                      color: '#fff',
                      fontSize:'10'
                  }
                },
              },
              data:[
                 {value:1, name:'出租'},
                {value:2, name:'自住'},
                {value:3, name:'空置'}
              ]
            }
          ]
        },
        treeList: [],
        rules: {
          buildingId: [{
            required: true,
            message: '请选择所在楼栋',
            trigger: 'blur'
          }],
          unitNum: [{
            required: true,
            message: '请填写单元名称',
            trigger: 'blur'
          } ,{
            pattern: /^\d*$/g,
            message: '单元名称只能为数字',
            trigger: 'blur'
          }],
          floorNum: [{
            required: true,
            message: '“请填写楼层数',
            trigger: 'blur'
          } ,{
            pattern: /^\d*$/g,
            message: '单元名称只能为数字',
            trigger: 'blur'
          }],
          elevatorNum: [{
            required: true,
            message: '请填写梯户比',
            trigger: 'blur'
          } ,{
            pattern: /^\d*$/g,
            message: '梯户比只能为数字',
            trigger: 'blur'
          }],
          houseNum: [{
            required: true,
            message: '请填写梯户比',
            trigger: 'blur'
          } ,{
            pattern: /^\d*$/g,
            message: '梯户比只能为数字',
            trigger: 'blur'
          }],
        }
      }
    },
    mounted(){
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-40
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-40
          this.$refs.pie.resize();

        };
      })
      this.activeKey=this.$route.query.organId?this.$route.query.organId:JSON.parse(sessionStorage.getItem('user')).organId
      this.defaultExpandKey=[this.activeKey*1]
      this.organName=JSON.parse(sessionStorage.getItem('user')).organName;
      if(JSON.parse(sessionStorage.getItem('user')).organType===2 || (!!this.$route.query.organId)){
        this._fetchUnitList();
        this._fetchEchartData();
        this.villageName=JSON.parse(sessionStorage.getItem('user')).organName;
        this.addVisible=true;
      }else {
        this.addVisible=false;
      }
    },
    methods: {
      //Echar数据
      _fetchEchartData: debounce(async function() {
        const data = await Api.getDistrictStatistics.get({},{
          pathParams: {
            id: this.activeKey,
            type:1
          }
        }).then(data => data.data.result)


        this.$refs.pie.resize();
        this.houseListData=data
        this.pie.series[0].data[0].value=data.leaseCount
        this.pie.series[0].data[1].value=data.selfOccupiedCount
        this.pie.series[0].data[2].value=data.vacantCount
        let selfOccupiedCount=data.selfOccupiedCount || 0
        let vacantCount=data.vacantCount || 0
        let leaseCount=data.leaseCount || 0
      }, 100),
      //小区列表
      _fetchUnitList: debounce(async function() {
        const data = await Api.getUnitsByVillageId.get({},{
          pathParams: {
            villageId: this.activeKey,
          }
        }).then(data => data.data.rows)
        this.houseList=data;
      }, 100),
      selectBuilding(val){
        let item = this.floor.find((item)=>{
          return item.id === val;
        });
        this.model.buildingCode=item.buildingNumber
      },
      //删除
      del(item){
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteUnit.delete({}, {
            pathParams: {
              id: item.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchUnitList();
          }).catch(() => {
           /* this.$message({
              type: 'error',
              message: '删除失败!'
            })*/
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //跳转
      jump(item){
        this.$router.push({name: 'unitList',query: {unitId:item.id,organId:this.activeKey}})
      },
      //选择机构点击
      orgNodeClick(item){
        if(item[0].organType==2){
          this.addVisible= true
          this.activeKey= item[0].id
          this.villageName=item[0].name
          this._fetchEchartData()
          this._fetchUnitList()
        }else {
          this.addVisible= false
          this.houseList=[]
        }
      },

      edit(row={
        organId:'',
        buildingId:'',
        buildingCode:'',
        unitNum:'',
        floorNum:'',
        elevatorNum:'',
        houseNum:''
      }) {
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
        Api.getbuildingLst.get({},{
          pathParams: {
            organId:  this.activeKey
          }
        }).then(data => {
          this.floor=data.data.rows
          this.model = cloneDeep(row)
          if(!row.id){
            //新增
            this.model.organId= this.activeKey;
          } else {
            //编辑
            this.floor.map((item)=>{
              if(item.id===this.model.buildingId)  this.model.buildingId=item.buildingNumber
            })
          }
          this.dialogFormVisible=true;
        })
      },
      //提交
      submit(){
        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if(!this.model.id){
              await Api.addUnit.post(this.model).then(()=>{
                  this.$message({ message: '新增成功', type: 'success' })
                  this.loading = false
                }).catch(err => {
                  this.loading = false
                })
            }else {
              await Api.updateUnit.put(this.model,{
                pathParams: {
                  id: this.model.id,
                }
              }).then(()=>{
                  this.$message({ message: '修改成功', type: 'success' })
                  this.loading = false
                }).catch(err => {
                  this.loading = false
                })
            }
            this.dialogFormVisible = false
            this._fetchUnitList();

          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
       exportData(){
        var organId
          organId=`organId=${this.activeKey}`

        //  if(this.filter.buildingId){
        //   buildingId=`&buildingId=${this.filter.buildingId}`
        // }
        //  if(this.filter.unitId){
        //   unitId=`&unitId=${this.filter.unitId}`
        // }
        window.open(`${myConfig.baseUrl}/business/house/exportXls?${organId}`)

    }

    },
  };
</script>
<style lang="less" scoped="scoped">
  //分割线
.tableBox {

  position: relative;
  .el-row{
     .houseListPartitionLine{
      height: 120%;
      width: 1px;
      background: #CFD0E0;
      position: absolute;
      top: 0px;
      left: calc(58.3333% - 10px);
    }
  }
}
</style>
