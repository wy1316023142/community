<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">房屋管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()" v-if="addVisible">新增</el-button>
        <el-button type="primary" size="small" @click="exportData()">导出</el-button>
        <el-button type="primary" size="small" @click="goBack()">返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35"  style="height: 100%">
        <el-col :span="5"  style="height: 100%">
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
        <el-col :span="19"  style="height: 100%">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox house-con">
              <el-row :gutter="20">
                <el-col :span="16">
                  <div class="unit-con">
                    <div ref="unit">
                      <h3>{{unitName}}</h3>
                      <ul class="ul">
                        <li class="state1">出租</li>
                        <li class="state2">自住</li>
                        <li class="state3">空置</li>
                      </ul>
                      <div class="img">
                        <img src="../../assets/images/house/634.png" ref="img">
                      </div>
                    </div>
                    <div class="unitList" ref="unitList">
                      <div class="unitLine" v-for="item in houseList">
                        <template  v-for="(item1,index1) in item.houses">
                          <div class="unitFirst" v-if="index1==0">
                            {{item.inFloorName}}
                          </div>
                          <div  class="state2 unitBox"  @click.stop="jump(item1)" v-if="item1.houseStatus===1">
                            {{item1.houseCode}}
                            <div class="unitBox-icon">
                              <span @click.stop="editRow(item1)" class="el-icon-edit" circle></span>
                              <span @click.stop="del(item1)"  class="el-icon-delete" circle></span>
                            </div>
                          </div>
                          <div  class="state1 unitBox"  @click.stop="jump(item1)" v-if="item1.houseStatus===2">
                            {{item1.houseCode}}
                            <div class="unitBox-icon">
                              <span @click.stop="editRow(item1)" class="el-icon-edit" circle></span>
                              <span @click.stop="del(item1)"  class="el-icon-delete" circle></span>
                            </div>
                          </div>
                          <div  class="state3 unitBox"  @click.stop="jump(item1)" v-if="item1.houseStatus===3">
                            {{item1.houseCode}}
                            <div class="unitBox-icon">
                              <span @click.stop="editRow(item1)" class="el-icon-edit" circle></span>
                              <span @click.stop="del(item1)"  class="el-icon-delete" circle></span>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </el-col>
                <div class="unitListPartitionLine"></div>
                <el-col :span="8">
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
                          <h1>{{houseListData.unitCount}}</h1>
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
                          <h1>{{houseListData.householdCount}}</h1>
                          <p>住户</p>
                          </div>
                        </div>
                        <div class="houseNum">
                          <div>
                          <h1>{{houseListData.leasePersonCount}}</h1>
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

        <el-form-item label="所在楼层：" prop="buildingId">
          <el-select v-model="model.inFloorNum" placeholder="请选择" :disabled="!!model.id">
            <el-option v-for="item in floor"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="房 屋 号：">
          <el-input  autocomplete="off" v-model="model.houseCode"></el-input>
        </el-form-item>

        <el-form-item label="房屋类型：" prop="houseStatus">
          <el-select v-model="model.houseStatus" placeholder="请选择">
            <el-option v-for="item in liveType"
                       :label="item.value"
                       :value="item.id">
            </el-option>
          </el-select>
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
  import { debounce ,keys,cloneDeep } from 'lodash'
  import IEcharts from 'vue-echarts-v3/src/full.js'
  export default {
    name: 'unitList',//
    components: {IEcharts},
    data() {
      return {
        activeKey:'',
        addVisible:true,
        tabHeight:'0',
        unitHeight:'0',
        organId:'',
        unitId:'',
        unitName:'',
        unitList:[],
        floor:[],
        houseList:[],
        houseListData:{},
        liveType:[
          {id: '1', value: '自住'},
          {id: '2', value: '出租'},
          {id: '3', value: '空置'},
        ],
        treeList: [],
        model:{},
        dialogFormTitle:'',
        dialogFormVisible:false,
        defaultProps1: {
          children: 'children',
          label: 'unitName'
        },
        filter:{},

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
              name:'人员类型',
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
        loading:false,
        firstErr:"",
        rules: {
          inFloorNum: [{
            required: true,
            message: '请填选择所在楼层',
            trigger: 'blur'
          }],
          houseStatus: [{
            required: true,
            message: '请填选择居住类型',
            trigger: 'blur'
          }],
          houseCode: [{
            required: true,
            message: '请填写房屋号',
            trigger: 'blur'
          } ,{
            pattern: /^\d*$/g,
            message: '房屋号只能为数字',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      defaultExpandKeys() {
        return [this.unitList.length ? this.unitList[0].id : '']
      }
    },
    mounted(){
      this._height();
      if(this.$route.query.unitId&&this.$route.query.organId){
        this.unitId= this.$route.query.unitId;
        this.organId= this.$route.query.organId;
        this._fetchUnitTree();
        this._fetchHouseList()
        this._fetchEchartData()
      }else {
        this.$router.push({'name':'house'})
      }
    },

    methods: {
      _height:function(){
        this.$refs.img.onload = ()=>{
          this.tabHeight=this.$refs.content.offsetHeight-40
          this.$refs.unitList.style.height=this.$refs.content.offsetHeight-this.$refs.unit.offsetHeight-125+'px'
          this.$refs.unitList.style.maxHeight=this.$refs.content.offsetHeight-this.$refs.unit.offsetHeight-125+'px'
        }
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-40
          this.$refs.unitList.style.height=this.$refs.content.offsetHeight-this.$refs.unit.offsetHeight-125+'px'
          this.$refs.unitList.style.maxHeight=this.$refs.content.offsetHeight-this.$refs.unit.offsetHeight-125+'px'
          this.$refs.pie.resize();

        };
      },
      //Echar数据
      _fetchEchartData: debounce(async function() {
        const data = await Api.getDistrictStatistics.get({},{
          pathParams: {
            id: this.unitId,
            type:2
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

        // if(data.personTypesStatistics && data.personTypesStatistics.length!==0){
        //   this.pie.series[0].data=data.personTypesStatistics
        // }else {
        //   this.pie.series[0].data= [{value:0, name:'无数据'}]
        // }
      }, 100),
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
          this.unitName=this.$refs.tree.getCurrentNode().unitName
        })
      }),
      //点击小区树
      unitNodeClick(data){
        if(data.parentId!==null){
          this.unitName=data.unitName
          this.addVisible=true;
          this.unitId=data.id
          this._fetchHouseList();
          this._fetchEchartData();
        }else {
          this.addVisible=false;
          this.goBack();

        }
      },
      //房屋列表
      _fetchHouseList: async function() {
        const data = await Api.getHousesByUnitId.get({},{
          pathParams: {
            unitId: this.unitId,
          }
        }).then(data => data.data)
        this.houseList=data.rows
        let num=data.result.unitFloorNum
        for(let i=0;i<num*1;i++){
          this.floor[i]={id:i+1,value:i+1}
        }
      },
      //删除
      del(item){
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteHouse.delete({}, {
            pathParams: {
              id: item.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchHouseList();
          }).catch(() => {
            /*this.$message({
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
        this.$router.push({name: 'houseDetails',query: {unitId:this.unitId,organId:this.organId,houseId:item.id,houseCode:item.houseCode}})
      },
      //返回
      goBack(){
        this.$router.push({'name':'house',query: {organId:this.organId}})
      },

      //编辑 新增
      editRow(row={}) {
        this.dialogFormTitle = !row.id ? '新增房屋' : '编辑房屋'
        this.model = cloneDeep(row);
        if(this.model.houseStatus) this.model.houseStatus+='';
        this.model.orgId=this.organId;
        this.model.unitId=this.unitId;
        this.dialogFormVisible=true
      },
      //提交
      submit(){
        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if(!this.model.id){
              await Api.addHouse.post(this.model).then(()=>{
                this.$message({ message: '新增成功', type: 'success' })
                this.loading = false
              }).catch(err => {
                throw err
                this.loading = false
              })
            }else {
              await Api.updateHouse.put(this.model,{
                pathParams: {
                  id: this.model.id,
                }
              }).then(()=>{
                this.$message({ message: '修改成功', type: 'success' })
                this.loading = false

              }).catch(err => {
                this.loading = false
                throw err
              })
            }
            this.dialogFormVisible = false
            this._fetchHouseList();
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      exportData(){
        var organId,unitId

          organId=`organId=${this.organId}`

          unitId=`&unitId=${this.unitId}`

        window.open(`${myConfig.baseUrl}/business/house/exportXls?${organId}${unitId}`)
        
    }
    },
  };
</script>
<style lang="less">
    // .el-row{
    //   height: 89%;
    // }

    .tableBox {

      position: relative;
      .el-row{
         .unitListPartitionLine{
          height: 120%;
          width: 1px;
          background: #CFD0E0;
          position: absolute;
          top: 0px;
          right: 35%
        }
      }
    }
</style>
