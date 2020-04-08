<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">机构管理列表</p>
      <div class="flexItem text_r">
        <el-select v-model="filter.typeId" placeholder="机构类型" clearable>
          <el-option v-for="item in typeListData"
                     :key="item.organTypeId"
                     :label="item.typeName"
                     :value="item.organTypeId"></el-option>
        </el-select>
        <el-input type="text" placeholder="机构名称" v-model="filter.name" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="10003001">新增</el-button>
         <el-button type="primary" size="small" title="点击下载导入模板"><a href="/template/organ_temp.xlsx">下载模板</a></el-button>
        <el-button type="primary" size="small" title="点击导入信息" @click="importFormVisible = true">导入</el-button>
        
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.parentId" @node-click="orgNodeClick" ref="organTree"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
                <el-table-column prop="name" label="机构名称" align='center'></el-table-column>
                <el-table-column prop="code" label="机构编码" align='center'></el-table-column>
                <el-table-column prop="typeId" label="机构类型" align='center' :formatter="typeFormat"></el-table-column>
                <el-table-column label="操作" align='center' width="240">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="storageCycleBtn(scope.row)"
                               v-if="scope.row.organType==2">储存配置
                    </el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="10003002">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="10003003">删除</el-button>
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
    <el-dialog title="储存周期配置" :visible.sync="storageCycle" :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body='false' width="470px">
      <p class="storageCycleTitle">小区名称 : {{storageCycleTitle}}</p>
      <el-form ref="form" :show-message="false" :model="storageCycleData">
        <el-form-item label='人员开门记录：'>
          <el-col :span="22">
            <el-input v-model="storageCycleData.entanceStoragePeriod" maxLength="32"></el-input>
          </el-col>
          <el-col class="text_r" :span="2">天</el-col>
        </el-form-item>
        <el-form-item label="车辆开门记录：">
          <el-col :span="22">
            <el-input v-model="storageCycleData.vehicleStoragePeriod" maxLength="32"></el-input>
          </el-col>
          <el-col class="text_r" :span="2">天</el-col>
        </el-form-item>
        <el-form-item label="抓拍记录：">
          <el-col :span="22">
            <el-input v-model="storageCycleData.faceSnapStoragePeriod" maxLength="32"></el-input>
          </el-col>
          <el-col class="text_r" :span="2">天</el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storageCycle = false">取 消</el-button>
        <el-button type="primary" @click="storageCycleSubmit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" :modal-append-to-body='false' width="470px">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="机构属性：" prop="licenseNumber">
          <el-select v-model="model.organType" @change="changeOrganType">
            <el-option v-for="item in organTypeData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="text+'名称：'" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item :label="text+'编码：'" prop="code">
          <el-input autocomplete="off" v-model="model.code" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item :label="text+'简称：'" prop="shortName">
          <el-input autocomplete="off" v-model="model.shortName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="机构类型：">
          <el-select v-model="model.typeId">
            <el-option v-for="item in typeListData"
                       :key="item.organTypeId"
                       :label="item.typeName"
                       :value="item.organTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋数量：" prop="buildingNumber" v-if="text==='小区'&&!model.id">
          <el-input autocomplete="off" v-model="model.buildingNumber"></el-input>
        </el-form-item>
        <el-form-item label="房屋限制人数：" prop="houseNumber" v-if="text==='小区'">
          <el-input autocomplete="off" v-model="model.houseNumber"></el-input>
        </el-form-item>
        <el-form-item :label="text+'坐标：'">
          <el-popover placement="right" width="500" trigger="click">
            <div style="height: 500px" class="popover">
              <el-amap ref="map" :zoom="map.zoom" :events="map.events">
                <el-amap-marker vid="marker" :position="map.position"></el-amap-marker>
              </el-amap>
            </div>
            <el-input slot="reference" :readonly="true" v-model="map.lnglat" suffix-icon="el-icon-location"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input type="textarea" placeholder="例:XX省XX市XX区九兴大道XX号" maxLength="120" autocomplete="off"
                    v-model="model.address"></el-input>
        </el-form-item>
        <el-form-item :label="text+'电话：'" prop="phone">
          <el-input resize="none" type="textarea" :rows="2" placeholder="例:028-88888888;15877777777" maxLength="64"
                    autocomplete="off" v-model="model.phone"></el-input>
        </el-form-item>
        <el-form-item :label="text+'备注：'" prop="note">
          <el-input resize="none" type="textarea" :rows="2" autocomplete="off" v-model="model.note"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 导入 -->
    <el-dialog title="导入" :visible.sync="importFormVisible" :modal-append-to-body='false' width="350px">
      <el-upload
        ref="upload"
        :action="action"
        :headers="fileHeader"
        :multiple="false"
        :auto-upload="false"
        :limit="1"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-success="fileSuccess"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls或xlsx文件，且不超过5M</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </div>
    </el-dialog>
     <!--导入结果-->
    <el-dialog title="导入失败信息" :visible.sync="importVisible"   :modal-append-to-body='false' width="60%">
      <el-table :data="importData" style="width: 100%" stripe >
        <el-table-column label="序号" align='center'  type="index"></el-table-column>
        <el-table-column prop="SHEETNAME" label="sheet名" align='center'></el-table-column>
        <el-table-column prop="errRow" label="行数" align='center'></el-table-column>
        <el-table-column prop="errorMsg" label="错误信息" align='center'  width="340"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import Api from "../../commom/api.js";
  import {debounce, keys, cloneDeep} from "lodash";
  import OrganTree from "../../components/OrganTree.vue";
  
  import {
    validateBlackSpace,
    validatePositiveInteger,
    betterFifteen
  } from "../../commom/validator";

  export default {
    name: "organization",
    components: {OrganTree},
    data() {
      return {
        fileList:[],
          importData:[],
           importVisible:false,
         action: "",
         fileHeader: {},
        importFormVisible: false,
        map: {
          center: [104.07, 30.67],
          position: [104.07, 30.67],
          lnglat: "",
          zoom: 12,
          events: {
            click: e => {
              this.map.lnglat = e.lnglat.lat + "," + e.lnglat.lng;
              this.map.position = [e.lnglat.lng, e.lnglat.lat];
              this.model.y = e.lnglat.lat;
              this.model.x = e.lnglat.lng;
              this.model.zoom = 12;
            }
          }
        },
        storageCycleTitle: "",
        storageCycle: false,
        tabHeight: "0",
        dialogFormVisible: false,
        dialogFormTitle: "",
        text: "机构",
        organType: 1,
        tableData: [],
        storageCycleData: {
          entanceStoragePeriod:'',
          vehicleStoragePeriod:'',
          faceSnapStoragePeriod:''
        },
        typeListData: [],
        model: {
          houseNumber: 15
        },
        total: 0,
        filter: {
          parentId: "",
          name: null,
          typeId: null,
          page: 1,
          rows: 10
        },
        activeOrg: [],
        firstErr: null,
        loading: false,
        rules: {
          name: [
            {
              required: true,
              message: "请填写名称",
              trigger: "blur"
            },
            {
              maxLength: 3,
              message: "请填写名称",
              trigger: "blur"
            },
            {
              validator: validateBlackSpace,
              message: "名称不能有空格",
              trigger: "blur"
            }
          ],
          code: [
            {
              required: true,
              message: "请选填写编码",
              trigger: "blur"
            },
            {
              validator: validateBlackSpace,
              message: "编码不能有空格",
              trigger: "blur"
            }
          ],
          shortName: [
            {
              required: true,
              message: "请填写简称",
              trigger: "blur"
            },
            {
              validator: validateBlackSpace,
              message: "简称不能有空格",
              trigger: "blur"
            }
          ],
          buildingNumber: [
            {
              required: true,
              message: "请填楼栋数",
              trigger: "blur"
            },
            {
              validator: validatePositiveInteger,
              message: "请输入正确的楼栋数",
              trigger: "blur"
            }
          ],
          address: [
            {
              required: true,
              message: "请填写详细地址",
              trigger: "blur"
            }
          ],
          houseNumber: [
            {
              required: true,
              message: "请填写简称",
              trigger: "blur"
            },
            {
              validator: betterFifteen,
              message: "请输入大于0的数字",
              trigger: "blur"
            }
          ]
        },
        // typeName:[],
        organTypeData: [
          {key: 1, value: "管理机构"},
          {key: 2, value: "业务机构"}
        ]
      };
    },
    mounted() {
       this.fileHeader = {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    };
      //table高度
      this.$nextTick(() => {
        this.tabHeight = this.$refs.content.offsetHeight - 56;
        window.onresize = () => {
          this.tabHeight = this.$refs.content.offsetHeight - 56;
        };
      });
      this.filter.parentId = JSON.parse(sessionStorage.getItem("user")).organId;
       this.action=myConfig.baseUrl+'/system/organ/import/'+this.filter.parentId
      this._fetchOrganType();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.organList
          .get(this.filter, {
            loadingMaskTarget: ".tableShow"
          })
          .then(res => res.data);
        this.tableData = data.rows;
        this.total = data.total;
      }, 100),
      _fetchOrganType: debounce(async function () {
        const data = await Api.getOrganTypeList.get().then(res => res.data);
        this.typeListData = data.result;
      }, 100),
      typeFormat(row, column) {
        let typeName = this.typeListData[0].typeName;
        this.typeListData.forEach(item => {
          if (item.organTypeId === row.typeId) {
            typeName = item.typeName;
            return;
          }
        });
        return typeName;
      },
      //
      editRow(row = {
        organType: 1,
        typeId: 1,
        houseNumber: 15
      }) {
        if (this.organType == 2) {
          this.$message({message: "管理机构才能新增", type: "warning"});
          return;
        }
        this._fetchOrganType();
        this.dialogFormTitle = !row.id ? "新增" : "编辑";
        this.dialogFormVisible = true;

        if (row.id) {
          if (row.organType == 1) this.text = "机构";
          if (row.organType == 2) this.text = "小区";
          if (row.y != null && row.x != null) {
            this.map.lnglat = row.y + "," + row.x;
            this.map.position = [row.x, row.y];
          } else {
            this.map.lnglat = "";
          }
        } else {
          this.map.lnglat = "";
          this.text = "机构";
        }
        this.model = cloneDeep(row);
        this.model.parentId = this.filter.parentId;
      },

      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null;
            this.loading = true;
            if (!this.model.id) {
              await Api.addOrgan
                .post(this.model)
                .then(() => {
                  this.$message({message: "新增成功", type: "success"});
                  this.dialogFormVisible = false;
                  this._fetchData();
                  // 重新加载机构树
                  this.$refs.organTree._fetchData();
                })
                .catch(err => {
                });
            } else {
              await Api.modifyOrgan
                .put(this.model, {
                  pathParams: {
                    id: this.model.id
                  }
                })
                .then(() => {
                  this.$message({message: "修改成功", type: "success"});
                  this.dialogFormVisible = false;
                  this._fetchData();
                  // 重新加载机构树
                  this.$refs.organTree._fetchData();
                })
                .catch(err => {
                });
            }
            this.loading = false;
          } else {
            const firstKey = keys(invalidFields)[0];
            this.firstErr = invalidFields[firstKey][0];
          }
        });
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, "提示", {
          type: "warning"
        })
          .then(async () => {
            const data = await Api.deleteOrgan
              .delete(
                {},
                {
                  pathParams: {
                    id: row.id
                  }
                }
              )
              .then(res => {
                this.$message({message: "删除成功", type: "success"});
                this._fetchData();
                // 重新加载机构树
                this.$refs.organTree._fetchData();
              })
              .catch(() => {
                /*this.$message({
                type: 'error',
                message: '删除失败!'
              })*/
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      async storageCycleBtn(row) {
        console.log(row.id)
        this.storageCycle = true;
        const data = await Api.storageConfigDetails.get({}, {
          pathParams: {
            organId: row.id
          }
        }).then(res => res.data);
        if (data.result) {
          this.storageCycleData = data.result;
        } else {
          this.storageCycleData.entanceStoragePeriod = ''
          this.storageCycleData.vehicleStoragePeriod = ''
          this.storageCycleData.faceSnapStoragePeriod = ''
        }
        this.storageCycleData.organId = row.id;
        this.storageCycleTitle = row.name;
      },
      storageCycleSubmit() {
        Api.storageConfigSave.post(this.storageCycleData).then(() => {
          this.$message({message: "储存时间保存成功", type: "success"});
          this.storageCycle = false;
          this._fetchData();
        });
      },
          //上传文件前判断
    beforeUpload(file) {
      const isType = file.name.indexOf('.xls')!=-1 ||  file.name.indexOf('.xlsx')!=-1
      if (!isType) {
        this.$message.error('文件格式只能是 xls或xlsx 格式!');
      }
      const isLimit = file.size / 1024 / 1024 < 5;
      if (!isLimit) {
        this.$message.error('文件大小不能超过 5MB!');
      }
      return isType && isLimit;
    },
         //上传
    submitUpload() {
      this.$refs.upload.submit();
    },
     //上传成功
    fileSuccess(res, file, fileLis) {
      this.fileList = [];
      if (res.code == 0) {
        this.$message.info(res.msg);
        this._fetchData();
        this.importData = res.result;
        this.importFormVisible = false;
        this.importVisible = true;
      } else {
        this.$message.error(res.msg);
      }
    },
    //上传失败
      onRrror(err, file, fileList) {
        this.$message.error(err);
      },
       //导出错误EXCEL
    exportExcel() {
      require.ensure([], () => {
        const tHeader = [
          "机构名称",
          "机构编码",
          "机构简称",
          
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "name",
          "code",
          "shortName",
          
        ];
        const list = this.importData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导入人员错误信息列表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
      changeOrganType(val) {
        val == 1 ? (this.text = "机构") : (this.text = "小区");
      },
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
        
      orgNodeClick([item = {}]) {
        // console.log(item,'!!!!!!');
         this.action=myConfig.baseUrl+'/system/organ/import/'+item.id
        this.organType = item.organType;
        this.filter.parentId = item.id || "";
        this._fetchData();
      }
    }
  };
</script>
<style lang="less">
  .storageCycleTitle {
    margin-top: -18px;
    margin-bottom: 18px;
  }
</style>
