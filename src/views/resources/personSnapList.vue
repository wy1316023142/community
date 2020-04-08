<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">人脸抓拍机管理</span>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="设备名称" v-model="filter.name" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="900701">新增</el-button>
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
                <el-table-column prop="machineNumber" label="编号" align='center'></el-table-column>
                <el-table-column prop="ip" label="ip地址" align='center'></el-table-column>
                <el-table-column prop="deviceEntranceName" label="所属门禁" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="900702">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="900703">删除</el-button>
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" :modal-append-to-body='false' width="470px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">

        <el-form-item label="设备名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" ></el-input>
        </el-form-item>
        <el-form-item label="所属小区：">
          <el-input autocomplete="off" v-model="organName"  readonly></el-input>
        </el-form-item>
        <el-form-item label="所属门禁：" porp="deviceEntranceId">
          <el-select v-model="model.deviceEntranceId">
            <el-option v-for="item in importExportTypeData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属厂家：" porp="factoryType">
          <el-select v-model="model.factoryType">
            <el-option v-for="item in importFactoryTypeData"
                       :key="item.typeCode"
                       :label="item.typeName"
                       :value="item.typeCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名：" prop="deviceUserName">
          <el-input autocomplete="off" v-model="model.deviceUserName" ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="devicePassword">
          <el-input autocomplete="off" v-model="model.devicePassword" ></el-input>
        </el-form-item>
        <el-form-item label="序列号：" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" ></el-input>
        </el-form-item>
        <el-form-item label="设备ip：" prop="ip">
          <el-input autocomplete="off" v-model="model.ip" ></el-input>
        </el-form-item>
        <el-form-item label="端口：" prop="port">
          <el-input  autocomplete="off" v-model="model.port"></el-input>
        </el-form-item>
         <el-form-item label="坐标：">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover" id="wrapper">
              <el-amap ref="map" :zoom="map.zoom" :events="map.events" :center="map.center">
                <el-amap-marker :position="map.marker.position" visible='true'></el-amap-marker>
              </el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat"
                      suffix-icon="el-icon-location"></el-input>
          </el-popover>
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
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace, validateIp } from '../../commom/validator'
  import { domHeightMixin } from '../../commom/mixins.js'
  export default {
    mixins: [ domHeightMixin ],
    name: 'personSnapList',
    components: {OrganTree},
    data() {
      return {
         map: {
          lnglat: '',
          zoom: 12,
          center:[104.062644,30.660939],
          marker: {
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [121.59996, 31.197646]
          },
          events: {
            'click': (e) => {
              this.map.lnglat = e.lnglat.lat + ',' + e.lnglat.lng
              this.model.locationy = e.lnglat.lat
              this.model.locationx = e.lnglat.lng
              this.model.zoom = 12
              this.map.marker.position[1] = e.lnglat.lat
              this.map.marker.position[0] = e.lnglat.lng
              let position = this.map.marker.position;
              this.map.marker.position = [position[0], position[1]];
            }
          },
        },
        dialogFormVisible: false,
        dialogFormTitle: '',
        title: '抓拍机设备',
        organType: '',
        organName:'',
        tableData: [],
        model: {},
        total: 0,
        filter: {
          organId: 1,
          name: null,
          page: 1,
          rows: 10
        },
        importExportTypeData: [],
        importFactoryTypeData: [],
        layerTypeFilter: {
          typeClassification: 8,
          typeLevel: 2,
          parentTypeId: 802
        },
        firstErr: null,
        loading: false,
        rules: {
          machineNumber: [{
            required: true,
            message: '请填写设备序列号',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '序列号不能有空格',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '名称不能有空格',
            trigger: 'blur'
          }],
          deviceEntranceId: [{
            required: true,
            message: '请选择所属门禁',
            trigger: 'blur'
          }],
          deviceUserName: [{
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '序列号不能有空格',
            trigger: 'blur'
          }],
          devicePassword: [{
            required: true,
            message: '请填写密码',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '密码不能有空格',
            trigger: 'blur'
          }],
          ip: [{
            required: true,
            message: '请填写设备IP',
            trigger: 'blur'
          },{
            validator: validateIp,
            message: '请输入正确的IP地址',
            trigger: 'blur'
          }],
          port: [{
            required: true,
            message: '请填写设备端口号',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '端口号不能有空格',
            trigger: 'blur'
          }]
        },

      }
    },
    mounted() {
      this.organType=JSON.parse(sessionStorage.getItem('user')).organType;
      this.organName=JSON.parse(sessionStorage.getItem('user')).organName;
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchData();
      this._fetchCommonType();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.personSnapList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      _fetchAccessControlData: async function () {
        const data = await Api.accessControlList.get({
          organId: this.filter.organId,
          page: 1,
          rows: 1000
        }).then(res => res.data)
        this.importExportTypeData = data.rows
      },
      _fetchCommonType: debounce(async function () {
        const data = await Api.getCommonType.get(this.layerTypeFilter).then(res => res.data)
        this.importFactoryTypeData = data.rows;
      }, 100),
      editRow(row = {}) {
        if (this.organType == 1) {
          this.$message({message: '业务机构才能新增', type: 'info'});
          return false;
        }
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
         if (row) {
          this.model.importExport *= 1;
          this.model.unitId *= 1;
          if (row.locationx != null && row.locationy != null) {
            this.map.lnglat = row.locationy + "," + row.locationx;
            this.map.marker.position[0] = row.locationx
            this.map.marker.position[1] = row.locationy
            let position = this.map.marker.position;
            this.map.marker.position = [position[0], position[1]];
            this.map.center = [position[0], position[1]];

          }else {
            this.map.lnglat=''
            this.map.center=[104.062644,30.660939],
             this.map.marker.position=[121.59996, 31.197646]
          };
        } else
          this.map.lnglat = '';
        this.model = cloneDeep(row)

        this.model.organId = this.filter.organId
        this._fetchAccessControlData();
        this.dialogFormVisible = true
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addPersonSnap.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.editPersonSnap.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.dialogFormVisible = false
                this._fetchData();
              }).catch(err => {
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
        this.$confirm(`删除后可能导致此抓拍机布控任务失效，请确认是否要删除？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.delPersonSnap.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
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
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
        this.organType = item.organType
        this.organName = item.name
        this.filter.organId = item.id || ''
        this._fetchData();
      }
    },
  };
</script>
<style lang="less">

</style>
