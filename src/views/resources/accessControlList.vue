<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">门禁设备管理列表</span>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="门禁名称" v-model="filter.name" clearable></el-input>
        <el-input type="text" placeholder="设备序列号" v-model="filter.machineNumber"
                  clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="900301">新增</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight'
                        :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="machineNumber" label="设备序列号"
                                 align='center'></el-table-column>
                <el-table-column prop="deviceFactory" label="设备厂家" align='center'
                                 :formatter="deviceFactoryFormat"></el-table-column>
                <el-table-column prop="name" label="名称" align='center'></el-table-column>
                <el-table-column prop="controlType" label="门禁类型" align='center'
                                 :formatter="controlTypeFormat"></el-table-column>
                <el-table-column prop="unitId" label="所属单元" align='center'
                                 :formatter="unitFormat"></el-table-column>
                <el-table-column prop="status" label="设备状态" align='center'>
                  <template slot-scope="scope">
                    <template v-if="scope.row.status==='0'">离线</template>
                    <template v-if="scope.row.status==='1'">在线</template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="900302">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="900303">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background
                               layout="prev, pager, next, total"
                               :total='total'
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
        <el-form-item label="设备厂商：">
          <el-select v-model="model.deviceFactory" :disabled="!!model.id">
            <el-option v-for="item in deviceFactoryData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="序列号：" prop="machineNumber">
          <el-input autocomplete="off" v-model="model.machineNumber" maxLength="32"
                    :readonly="!!model.id"></el-input>
        </el-form-item>
        <div v-if="model.deviceFactory==3">
          <el-form-item label="IP地址：" prop="ip">
            <el-input autocomplete="off" v-model="model.ip" maxLength="32"
                      :readonly="!!model.id"></el-input>
          </el-form-item>
          <el-form-item label="端口：" prop="port">
            <el-input autocomplete="off" value="8000" v-model="model.port" maxLength="32"
                      :readonly="!!model.id"></el-input>
          </el-form-item>
          <el-form-item label="账号：" prop="account">
            <el-input autocomplete="off" v-model="model.account" maxLength="32"
                      :readonly="!!model.id"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input autocomplete="off" v-model="model.password" maxLength="32"
                      :readonly="!!model.id"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="门禁类型：">
          <el-select v-model="model.controlType" :disabled="!!model.id"
                     @change="controlTypeChange($event)">
            <el-option v-for="item in controlTypeData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单元：" prop="unitId" v-if="model.controlType == 2">
          <el-select v-model="model.unitId" @change="unitChange($event)">
            <el-option v-for="item in unitList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进出口：">
          <el-select v-model="model.importExport">
            <el-option v-for="item in importExportData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
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
      <div class="dialog-form-error"></div>
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
  import {validateBlackSpace} from '../../commom/validator'

  export default {
    name: 'accessCotrol',
    components: {OrganTree},
    data() {
      return {
        map: {
          lnglat: '',
          zoom: 12,
          center:[121.59996, 31.197646],
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
        tabHeight: '0',
        dialogFormVisible: false,
        dialogFormTitle: '',
        title: '门禁设备',
        organType: 1,
        tableData: [],
        unitList: [],
        model: {},
        total: 0,
        filter: {
          organId: 1,
          organName: '',
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
          }, {
            validator: validateBlackSpace,
            message: '序列号不能有空格',
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
          unitId: [{
            required: true,
            message: '请选择所属单元',
            trigger: 'blur'
          }],
          ip: [{
            required: true,
            message: 'IP地址不能为空',
            trigger: 'blur'
          }],
          port: [{
            required: true,
            message: '端口不能为空',
            trigger: 'blur'
          }],
          account: [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        },
        onlineStatusData: [
          {key: 0, value: '离线'},
          {key: 1, value: '在线'},
        ],
        controlTypeData: [
          {key: 1, value: '大门门禁'},
          {key: 2, value: '单元门禁'},
        ],
        deviceFactoryData: [
          {key: '1', value: '华安门禁设备'},
          {key: '2', value: '天翼门卫机器人'},
          {key: '3', value: '海康门禁设备'},
        ],
        importExportData: [
          {key: 1, value: '进门'},
          {key: 2, value: '出门'},
        ],
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight = this.$refs.content.offsetHeight - 56
        window.onresize = () => {
          this.tabHeight = this.$refs.content.offsetHeight - 56
        };
      })
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this.filter.organName = JSON.parse(sessionStorage.getItem('user')).organName;
      this.organType = JSON.parse(sessionStorage.getItem('user')).organType;
      this._fetchUnitList();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.accessControlList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      //单元列表
      _fetchUnitList: debounce(async function () {
        const data = await Api.getUnitsByVillageId.get({}, {
          pathParams: {
            villageId: this.filter.organId,
          }
        }).then(data => data.data.rows)
        this.unitList = data
      }, 100),
      deviceFactoryFormat(row, column) {
        let value = '';
        this.deviceFactoryData.forEach(item => {
          if (item.key == row.deviceFactory) {
            value = item.value;
            return false;
          }
        });
        return value === '' ? this.deviceFactoryData[0].value : value;
      },
      controlTypeFormat(row, column) {
        let value = '';
        this.controlTypeData.forEach(item => {
          if (item.key == row.controlType) {
            value = item.value;
            return false;
          }
        });
        return value === '' ? this.controlTypeData[0].value : value;
      },
      unitFormat(row, column) {
        let value = '';
        this.unitList.forEach(item => {
          if (item.id == row.unitId) {
            value = item.name;
            return false;
          }
        });
        return value;
      },
      editRow(row = {
        controlType: 1,
        deviceFactory: '1',
        importExport: 1,
      }) {
        // VueAMap.initAMapApiLoader()
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

        } else{
             this.map.lnglat = '';
        }


        this.dialogFormVisible = true
        this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
        this.model.organName = this.filter.organName
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              console.log(this.model);

              await Api.addAccessControl.post(this.model)
                  .then(() => {
                    this.$message({message: '新增成功', type: 'success'})
                    this.dialogFormVisible = false
                    this._fetchData();
                  }).catch(err => {
                  })
            } else {
              await Api.modifyAccessControl.put(this.model, {
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
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteAccessControl.delete({}, {
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
        this.filter.organId = item.id || ''
        this.filter.organName = item.name || ''
        this._fetchData();
        this._fetchUnitList();
      },
      controlTypeChange(val) {
        if (val == this.controlTypeData[1].key) {
          if (!this.model.unitId) {
            // 默认显示第一个单元
            this.model.unitId = this.unitList[0].id;
            this.model.builingId = this.unitList[0].buildingId;
          }
        }
      },
      unitChange(val) {
        let data = this.unitList.find(item => val == item.id);
        this.model.builingId = data.buildingId;
      },
    }
  };
</script>
<style lang="less">

</style>
