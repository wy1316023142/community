<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">车辆抓拍机管理列表</span>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="名称" v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="设备序列号" v-model="filter.machineNumber" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="900601">新增</el-button>
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
                <el-table-column prop="ip" label="ip地址" align='center'></el-table-column>
                <el-table-column prop="machineNumber" label="序列号" align='center'></el-table-column>
                <el-table-column prop="importExport" label="进出口" align='center'>
                  <template slot-scope="scope">
                    <template v-if="scope.row.importExport===1">进口</template>
                    <template v-if="scope.row.importExport===2">出口</template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="900602">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="900603">删除</el-button>
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
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="设备ip：" prop="ip">
          <el-input autocomplete="off" v-model="model.ip" maxLength="20"></el-input>
        </el-form-item>
        <el-form-item label="进出口：">
          <el-select v-model="model.importExport">
            <el-option v-for="item in importExportTypeData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="序列号：" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="32"></el-input>
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
  import {validateBlackSpace } from '../../commom/validator'

  export default {
    name: 'accessCotrol',
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
              // this.model.y = e.lnglat.lat
              // this.model.x = e.lnglat.lng
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
        tabHeight: '0',
        dialogFormVisible: false,
        dialogFormTitle: '',
        title: '抓拍机设备',
        organType: '',
        tableData: [],
        model: {},
        total: 0,
        filter: {
          organId: 1,
          name: null,
          machineNumber: null,
          page: 1,
          rows: 10
        },
        treeList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
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
          ip: [{
            required: true,
            message: '请填写设备IP',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: 'IP不能有空格',
            trigger: 'blur'
          }]
        },
        importExportTypeData: [
          {key: 1, value: '进口'},
          {key: 2, value: '出口'},
        ]
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
      this.organType=JSON.parse(sessionStorage.getItem('user')).organType;
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.vehicleSnapList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row = {
        importExport: 1
      }) {
        if (this.organType == 1) {
          this.$message({message: '业务机构才能新增', type: 'info'});
          return;
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

          }
           else {
            this.map.lnglat=''
              this.map.center=[104.062644,30.660939],
             this.map.marker.position=[121.59996, 31.197646]
          };
        } else
          this.map.lnglat = '';

        this.dialogFormVisible = true
        this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addVehicleSnap.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.modifyVehicleSnap.put(this.model, {
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
        console.log(row);
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteVehicleSnap.delete({}, {
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
      }
      ,
      orgNodeClick([item = {}]) {
        this.organType = item.organType
        this.filter.organId = item.id || ''
        this._fetchData();
      }
    },
  };
</script>
<style lang="less">

</style>
