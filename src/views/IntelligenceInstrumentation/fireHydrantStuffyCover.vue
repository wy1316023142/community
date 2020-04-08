<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">消防栓智能闷盖</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="设备名称" v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="设备编号" v-model="filter.machineNumber" clearable></el-input>
         <el-select v-model="filter.communicationStatus" placeholder="通讯状态" clearable>
           <!--<el-option value="">全部</el-option>-->
          <el-option v-for="item in mapLayerResourceStatusData"
                     :key="item.typeCode"
                     :label="item.typeName"
                     :value="item.typeCode">

          </el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="addDialogForm" v-allow="700300101">新增</el-button>
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
                <!-- <el-table-column prop="coordinate" label="坐标" align='center'></el-table-column> -->
                <el-table-column prop="heartReportTimeStr" label="最新上报" align='center'></el-table-column>
                <el-table-column prop="communicationStatusName" label="通讯状态" align='center'></el-table-column>
                <el-table-column prop="signals" label="信号强度" align='center'></el-table-column>
                <el-table-column label="操作" align='center'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="700300102">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="700300103">删除</el-button>
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
    <el-dialog :title="dialogFormTitle" :visible.sync="addDialogFormVisible" :close-on-press-escape="false"
               :modal-append-to-body='false' width="400px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="设备名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="设备编号：" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="64"></el-input>
        </el-form-item>

        <el-form-item label="设备厂家: " prop="manufacturer">
          <el-select v-model="model.manufacturer">
            <el-option v-for="item in mapLayerResourceTypeData"
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
  import {debounce, keys,cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {getBase64} from '../../commom/util.js'
  import {validateBlackSpace,validatePhone } from '../../commom/validator'

  export default {
    name: 'fireHydrantStuffyCover',
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
        dialogFormTitle:'',
        tabHeight: '0',
        addDialogFormVisible: false,
        tableData: [],
        mapCustomResourceData: [],
        mapLayerResourceTypeData: [],
        mapLayerResourceStatusData: [],
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
          communicationStatus: null,
          name: null,
          page: 1,
          rows: 10,
        },
        layerTypeFilter: {
          typeClassification: 8,
          typeLevel: 2,
          parentTypeId: 803
        },
        layerStatusFilter: {
          typeClassification: 9,
          typeLevel: 2,
          parentTypeId: 9
        },
        firstErr: null,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请填写资源名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '资源名称不能有空格',
            trigger: 'blur'
          }],
          machineNumber:[{
            required: true,
            message: '请填写设备编号',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '设备编号不能有空格',
            trigger: 'blur'
          }],
          manufacturer: [{
            required: true,
            message: '请选择厂家',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '请选填写资源地址',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '资源地址不能有空格',
            trigger: 'blur'
          }],
          tel: [{
            required: true,
            message: '请填联系电话',
            trigger: 'blur'
          },{
            validator: validatePhone,
            message: '电话不能有空格',
            trigger: 'blur'
          }],
          customResourceId: [{
            required: true,
            message: '请选择分组',
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
      this._fetchMapCustomResource();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.pagingDeviceFire.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows;
        this.total = data.total;
        this._fetchCommonType();
        this._fetchCommunicationStatus();
      }, 100),
      // 加载分组选择数据
      _fetchMapCustomResource: debounce(async function () {
        const data = await Api.mapCustomResourceList.get().then(res => res.data)
        this.mapCustomResourceData = data.result;
      }, 100),
      // 加载类型选择数据
      _fetchCommonType: debounce(async function () {
        const data = await Api.getCommonType.get(this.layerTypeFilter).then(res => res.data)
        this.mapLayerResourceTypeData = data.rows;
      }, 100),
      // 加载类型选择数据
      _fetchCommunicationStatus: debounce(async function () {
        const data = await Api.getCommonType.get(this.layerStatusFilter).then(res => res.data)
        this.mapLayerResourceStatusData = data.rows;
      }, 100),
      // 分组选择事件
      changeCustomResource(val) {
        console.log('分组选择事件');
        // 没有改变选择分组，不请求
        if (val == this.layerTypeFilter.typeClassification) {
          return;
        }
        this.layerTypeFilter.typeClassification = val
        this._fetchCommonType();
      },
      cancel(item) {
        this.imgList.find((elem, index) => {
          if (elem === item) this.imgList.splice(index, 1)
        })
      },
      //预览图片
      handleUpload(e, type) {
        const files = e.target.files
        let imgPath = files[0].name;
        getBase64(files[0]).then(res => {
          this.imgList.push({
            'imgPath': imgPath,
            'imgBase64': res,
            'type': type,
          })

        })
        e.target.value = ''
      },
      editRow(row = {}) {
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
        if(row.id){
          if(row.locationx!=null && row.locationy!=null){
            this.map.lnglat= row.locationy+ "," + row.locationx;
            this.map.position=[row.locationx,row.locationy];
             this.map.marker.position[0]=row.locationx
              this.map.marker.position[1]=row.locationy
              let position = this.map.marker.position;
              this.map.marker.position = [position[0], position[1]];
          }else {
            this.map.lnglat='';
             this.map.marker.position=[121.59996, 31.197646]
          }
        }else {
          this.map.lnglat='';
        }
        this.deviceListModel.param.organId = this.filter.organId
        this.model = cloneDeep(row)
        this.addDialogFormVisible = true
      },
      addDialogForm() {
        this.dialogFormTitle = '新增';
        this.deviceListModel.param.organId = this.filter.organId
        Api.videoDeviceList.post(this.deviceListModel).then((res) => {
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
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              this.model.listImg = this.imgList
              this.model.organId = this.filter.organId
              await Api.addDeviceFire.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchData()
                }).catch(() => {
                })
            } else {
              await Api.editDeviceFire.put(this.model, {
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
        console.log(row.id);
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteDeviceFire.delete({}, {
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
      /*编辑上传图片*/
      uploadImg(e, type) {
        const files = e.target.files
        let imgPath = files[0].name;
        getBase64(files[0]).then(res => {
          Api.addMapResourceImg.post({
            'imgPath': imgPath,
            'imgBase64': res,
            'type': type,
            'resourceId': this.model.id
          }).then(() => {
            this.imgList.push({
              'imgPath': imgPath,
              'imgBase64': res,
              'type': type,
            })
          })
        })
        e.target.value = ''

      },
      /*编辑删除图片*/
      cancelImg(item) {
        console.log(item)
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteMapResourceImg.delete({}, {
            pathParams: {
              id: item.id
            }
          }).then(res => {
            this.imgList.find((elem, index) => {
              if (elem === item) this.imgList.splice(index, 1)
            })
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
    }
  };
</script>
<style lang="less">
.videoTitle{
  display: flex
}
</style>
