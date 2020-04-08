<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">视频点位</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()" v-allow="900201">新增</el-button>
        <el-button type="primary" size="small" @click="equipment()" v-allow="900204">分配设备</el-button>
        <el-button type="primary" size="small" @click="jump(filter.param.organId)"  v-allow="900205">天网分组</el-button>
        <el-input type="text" placeholder="设备名称" v-model="filter.param.searchKey"></el-input>
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
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column prop="name"  label="名称" align='center'></el-table-column>
                <el-table-column prop="naming" label="naming" align='center'></el-table-column>
                <el-table-column  label="操作" align='center'>
                  <template slot-scope="scope" width="150">
                    <el-button type="primary" size="mini"   @click="editRow(scope.row)" v-allow="900202">编辑</el-button>
                    <el-button type="danger"  size="mini"  @click="deleteRow(scope.row)" v-allow="900203">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.length' :current-page='filter.start'></el-pagination>
              </div>
            </div>

          </div>
        </el-col>
      </el-row>

    </div>
    <!--新增编辑-->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' width="450px" :close-on-click-modal="false">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="naming：" prop="naming">
          <el-input  autocomplete="off" v-model="model.naming"></el-input>
        </el-form-item>
        <el-form-item label="别名：" prop="nameLocal">
          <el-input  autocomplete="off" v-model="model.nameLocal" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="名称：" prop="name">
          <el-input  autocomplete="off" v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="原始坐标：" prop="nameLocal">
          <el-input  autocomplete="off" v-model="model.xy" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="修改坐标：" prop="lnglat">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover">
              <el-amap ref="map" :center="map.center" :zoom="map.zoom" :events="map.events">
                <el-amap-marker vid="marker" :position="map.position"></el-amap-marker>
              </el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat" suffix-icon="el-icon-location"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="视频类型：" prop="videoType">
          <el-select v-model="model.videoType" placeholder="请选择">
            <el-option v-for="item in videoType" :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="重点点位：" prop="nameLocal">
          <el-checkbox v-model="model.checked">重点点位</el-checkbox>
        </el-form-item>
        <!--<el-form-item label="RTSP地址：" prop="rtspUrl">
          <el-input  autocomplete="off" v-model="model.rtspUrl"></el-input>
        </el-form-item>-->
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配设备-->
    <el-dialog title="分配天网设备" :visible.sync="equipmentFormVisible"   :modal-append-to-body='false' width="60%" :close-on-click-modal="false">
      <div class="tableBox">
        <div class="text_r">
          <el-input class="equipmentSearchBar" placeholder="请输入摄像头名称" v-model="filterTable.param.searchKey"></el-input>
          <el-button  type="primary" @click="equipment()">筛选</el-button>
        </div>
        <el-table :data="equipmentTableData" style="width: 100%" stripe  :height='400' :max-height="400"  @selection-change="changeSelect">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name"  label="名称" align='center'></el-table-column>
          <el-table-column prop="online" label="状态" align='center' :formatter="onlineFormat"></el-table-column>
          <el-table-column prop="naming" label="naming" align='center'></el-table-column>
        </el-table>
        <div class="pageBox" style="margin-top: 20px;">
          <el-pagination   @current-change="pageChangeTable" background layout="prev, pager, next, total" :total='totalTable' :page-size='filterTable.length' :current-page='filterTable.start'></el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="equipmentFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="batchAssign" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys, cloneDeep } from 'lodash'
  import { validateBlackSpace } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form.vue";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";
  export default {
    name: 'vehicle',
    components: {
      ElFormItem,
      ElForm,
      OrganTree},
    data() {
      return {
        equipmentTableData: [],
        equipmentFormVisible:false,
        map: {
          lnglat: '',
          zoom: 12,
          position:[104.07,30.67],
          center:[104.07,30.67],
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.map.position=[e.lnglat.lng,e.lnglat.lat]
              this.model.yLocal = e.lnglat.lat
              this.model.xLocal = e.lnglat.lng
              this.model.zoom = 12
            }
          },
        },
        tabHeight:'0',
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        modelTable:{},
        total:0,
        totalTable:0,
        multipleSelection:[],
        filter: {
          param:{
            organId:'',
            searchKey:''},
          start: 1,
          length: 10
        },
        filterTable: {
          param:{
            organId:'',
            searchKey:''},
          start: 1,
          length: 10
        },
        firstErr:null,
        loading:false,
        videoType:[
          {id: '0', label: '未知'},
          {id: '1', label: 'dvr'},
          {id: '2', label: 'mvr'},
          {id: '3', label: '枪机'},
          {id: '4', label: '球机'},
          {id: '5', label: '全景摄像机'},
        ],
        onlineData:[
          {id: true, label: '在线'},
          {id: false, label: '离线'}
        ],
        rules: {
          naming: [{
            required: true,
            message: '请填写naming',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: 'naming不能有空格',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '名称不能有空格',
            trigger: 'blur'
          }],
        }
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
        if(!this.filter.param.organId){
          const user = JSON.parse(sessionStorage.getItem('user'))
          this.filter.param.organId = user.organId.toString();
          this.filterTable.param.organId = user.organId.toString();
        }
        const data = await Api.videoDeviceList.post(this.filter, {
          loadingMaskTarget: '.tableBox'
        }).then(res => res.data)
        this.tableData = data.result.data
        this.total = data.result.recordsTotal
      }, 100),
      editRow(row={}){
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
        if(row.id){
          if(row.yLocal!=null && row.xLocal!=null){
            this.map.lnglat= row.yLocal+ "," + row.xLocal;
            this.map.position=[row.xLocal,row.yLocal];
          }else {
            this.map.lnglat='';
          }
          this.model.focusOn==1 ? this.model.checked=true:this.model.checked=false
        }else {
          this.map.lnglat='';
        }
        this.dialogFormVisible = true
        this.model=cloneDeep(row)
      },
      async submit() {
        this.$refs.form.validate(async(valid, invalidFields) => {
          this.model.checked ? this.model.focusOn = 1 : this.model.focusOn = 0;
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id){
              this.model.organId = this.filter.param.organId;
              this.model.flag = 1;
              this.model.isShare = 0;
              this.model.deviceSourceType = 1;
            }
            await Api.addVideoDevice[this.model.id ? 'put' : 'put'](this.model)
              .then(()=>{
                if (this.model.id) {
                  this.$message({ message: '修改成功', type: 'success' })
                } else {
                  this.$message({ message: '新增成功', type: 'success' })
                }
                this.loading = false
                this.dialogFormVisible = false
                this._fetchData()
              }).catch(err => {
                this.loading = false
                throw err
              })

          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteVideoDevice.delete({
            id: row.id,
            organId:this.filter.param.organId}, {
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
      pageChange(val) {
        this.filter.start = val;
        this._fetchData();
      },
      pageChangeTable(val){
        this.filterTable.start = val;
        this.equipment();
      },
      orgNodeClick([item = {}]){
        this.filter.param.organId = item.id || ''
        this.filterTable.param.organId = item.id || ''
        this._fetchData();
      },
      async equipment(){
        //查询
        //........
        const data = await Api.videoDeviceTable.post(this.filterTable, {
          loadingMaskTarget: '.tableBox'
        }).then(res => res.data)
        this.equipmentTableData = data.result.data
        this.totalTable = data.result.recordsTotal
        this.equipmentFormVisible=true;
      },
      async batchAssign(){
        this.modelTable.ids = '';
        for(const i in this.multipleSelection){
          this.modelTable.ids += this.multipleSelection[i].id + ",";
        }
        this.modelTable.organId = this.filter.param.organId;
        const data = await Api.batchAssignVideoDevice.post(this.modelTable,{})
          .then(res=>{
            this.$message({ message: '分配成功', type: 'success' })
            this.loading = false
            this.equipmentFormVisible = false
            this._fetchData()
          }).catch(err => {
            this.loading = false
            this.$message({ message: '分配失败', type: 'success' })
            throw err
          })
      },
      equipmentSearch(){

      },
      onlineFormat(row, column) {
        this.onlineData.forEach(item => {
          if (item.id == row.online) {
            return item.label;
          }
        });
        return this.onlineData[1].label;
      },
      jump(organId){
        this.$router.push({name: 'gbGrouping',query: {organId:organId}})
      },
      changeSelect(val){
        this.multipleSelection = val;
      },

    },
  };
</script>
<style lang="less" scoped>
  .equipmentSearchBar{
    display: inline-block;
    width: 200px;
    margin-right: 10px;
  }
</style>
