<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">井盖监控设备</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="设备名称" v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="设备编号" v-model="filter.machineNumber" clearable></el-input>
         <el-select v-model="filter.status" placeholder="通讯状态" clearable>
          <el-option v-for="item in comunicationStatusType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="700200101">新增</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="machineNumber" label="设备编号" align='center'></el-table-column>
                <el-table-column prop="manufacturerName" label="设备厂家" align='center'></el-table-column>
                <el-table-column prop="address" label="安装地址" align='center'></el-table-column>
                <el-table-column prop="heartbeat" label="最新上报时间" align='center'></el-table-column>
                <el-table-column prop="statusName" label="通讯状态" align='center'></el-table-column>
                <el-table-column prop="rssi" label="信号强度" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width='150px' >
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="700200102">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="700200103">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="addDialogFormVisible" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="设备名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="设备编号：" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="64" :readonly="!!model.id"></el-input>
        </el-form-item>

        <el-form-item label="设备厂家: " prop="factory">
          <el-select v-model="model.factory">
            <el-option v-for="item in factoryType"
                       :key="item.typeCode"
                       :label="item.typeName"
                       :value="item.typeCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装地址: " prop="address">
          <el-input autocomplete="off" v-model="model.address" maxLength="64"></el-input>
        </el-form-item>

        <el-form-item label="坐标：">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover">
              <el-amap ref="map" :zoom="map.zoom" :events="map.events">
                 <el-amap-marker :position="map.marker.position" visible='true'></el-amap-marker>
              </el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat" suffix-icon="el-icon-location"></el-input>
          </el-popover>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace,validatePhone } from '../../commom/validator'
  import { comunicationStatusType } from '../../constants.js'
  export default {
    name: 'wellCoverMonitor',
    components: {OrganTree},
    data() {
      return {
        map: {
          lnglat: '',
          zoom: 12,
          marker:{
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position:[121.59996,31.197646]
                },
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.model.locationy = e.lnglat.lat
              this.model.locationx = e.lnglat.lng
              this.model.zoom = 12
              this.map.marker.position[1]=e.lnglat.lat
              this.map.marker.position[0]=e.lnglat.lng
              let position = this.map.marker.position;
              this.map.marker.position = [position[0], position[1]];
            }
          },
        },
        deviceName: '',
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle:'',
        tableData: [],
        mapCustomResourceData: [],
        factoryType: [],
        comunicationStatusType: [],
        deviceListModel: {
          draw: 0,
          length: 1000,
          param: {
            organId: "",
            searchKey: ""
          },
          start: 0,
        },
        model: {},
        imgList: [],
        deviceIdList: [],
        total: 0,
        filter: {
          organId: 1,
          customResourceId: null,
          layerResourceTypeId: null,
          name: null,
          page: 1,
          rows: 10,
        },
        layerFilter: {
          customResourceId: 1
        },
        firstErr: null,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请填写设备名称',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备名称不能有空格',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请填写地址',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '地址不能有空格',
            trigger: 'blur'
          }],
          machineNumber: [{
            required: true,
            message: '请填写设备编号',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '设备编号不能有空格',
            trigger: 'blur'
          }],
          factory: [{
            required: true,
            message: '请选择厂家',
            trigger: 'blur'
          }]
        }
      }
    },

    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.comunicationStatusType = comunicationStatusType;
      this._fetchFactory();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.pagingWellCover.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      // 加载分组选择数据
      _fetchFactory: debounce(async function () {
        const data = await Api.getCommonType.get({
          typeLevel: 2,
          typeClassification:8,
          parentTypeId:801
        }).then(res => res.data)
        this.factoryType = data.rows;
      }, 100),
      cancel(item) {
        this.imgList.find((elem, index) => {
          if (elem === item) this.imgList.splice(index, 1)
        })
      },
      editRow(row = {}) {
        // this.model.organId = this.filter.organId
        this.addDialogFormTitle = !row.id ? '新增' : '编辑'
        if (row.id) {
          if (row.locationx!= null && row.locationy!= null) {
            this.map.lnglat = row.locationy + "," + row.locationx;
            this.map.position=[row.locationx,row.locationy];
            this.map.marker.position[0]=row.locationx
            this.map.marker.position[1]=row.locationy
            let position = this.map.marker.position;
            this.map.marker.position = [position[0], position[1]];
          }
          else {
            this.map.lnglat='';
             this.map.marker.position=[121.59996, 31.197646]
          }
        } else{
          this.map.lnglat = '';
        }
        this.addDialogFormVisible = true
        this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
      },
      addDialogForm() {
        this.model.param.organId = this.filter.organId
        Api.addWellCover.post(this.model).then((res) => {
          this.deviceIdList = res.data.result.data;
          this.model = {}
          this.model.organId = this.filter.organId
          this.imgList = []
          this.deviceName = ''
          this.addDialogFormVisible = true
          this.map.lnglat ='';
        })
      },
      async submit() {
        // console.log(this.model);

        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              // this.model.listImg = this.imgList
              await Api.addWellCover.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchData()
                }).catch(() => {
                })
            } else {
              await Api.editWellCover.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.addDialogFormVisible = false
                this._fetchData()
              }).catch(() => {
              })
            }
            this.loading = false
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
          const data = await Api.deleteWellCover.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchData()
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
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.filter.organId = item.id || ''
        this._fetchData()
      },
    }
  };
</script>
<style lang="less">

</style>
