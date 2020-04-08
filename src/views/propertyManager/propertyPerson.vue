<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">物业负责人</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe :height="tabHeight" :max-height="tabHeight" >
                <el-table-column prop="organName"  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="负责人姓名" align='center'></el-table-column>
                <el-table-column prop="phone" label="联系电话" align='center'></el-table-column>
                <el-table-column prop="activeName" label="是否公示" align='center'>

                </el-table-column>
                <el-table-column prop="picPath" label="照片" align='center'>
                   <template scope="scope">
                    <img :src="scope.row.picPath" width="40" height="40" />
                </template>
                </el-table-column>
                <el-table-column  label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini"    @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="danger"  size="mini"  @click="deleteRow(scope.row)">删除</el-button>
                    <el-button type="primary"  size="mini" v-show="scope.row.activeName=='否'" @click="submitPublicity(scope.row)">公示</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <!-- <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination> -->
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增编辑-->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="470px" >
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">

        <el-form-item label="负责人姓名：" prop="name">
          <el-input  autocomplete="off" v-model="model.name"  maxLength="5"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input  autocomplete="off" v-model="model.phone"  maxLength="11"></el-input>
        </el-form-item>
           <!--新增头像-->
          <el-col v-if="!model.id">
            <el-form-item label="头像：" prop="imgStr">
              <div class='imgDiv'>
                <span v-show='!!model.imgStr' @click='cancel("add")' class='el-icon-error'></span>
                <img v-show='!!model.imgStr' :src="'data:image/jpeg;base64,'+ model.imgStr"/>
                <div v-show='!model.imgStr'>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event)"/>
                </div>
              </div>
              <input type="hidden" v-if="false" v-model="model.imgStr"/>
            </el-form-item>
          </el-col>
          <!--编辑头像-->
          <el-col v-if="!!model.id" prop="imgStr">
            <el-form-item label="头像：">
              <div class='imgDiv'>
                <span v-show='!!model.picPath' @click='cancel("eidt")' class='el-icon-error'></span>
                <img v-show='!!model.picPath' :src="model.picPath"/>
                <div v-show='!model.picPath'>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,model)"/>
                </div>
              </div>
              <input type="hidden" v-if="false" v-model="model.imgStr"/>
            </el-form-item>
          </el-col>
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
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import {
  validateIdCard,
  validatePhone,
  validateBlackSpace
} from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
import { domHeightMixin } from "../../commom/mixins.js";
import { getBase64, convert2JPEG } from "../../commom/util.js";
import { log, debuglog } from "util";
export default {
  mixins: [domHeightMixin],
  name: "vehicle",
  components: {
    ElDialog,
    OrganTree
  },
  data() {
    return {
      importVisible: false,
      importData: [],
      fileList: [],
      fileHeader: {},
      importFormVisible: false,
      dialogFormVisible: false,
      dialogVisible: false,
      dialogFormTitle: "",
      isPublicity: 0,
      tableData: [],
      model: {
        imgStr: "",

        name: "",
        phone: ""
      },
      total: 0,
      filter: {
        organId: 0,
        page: 10,
        rows: 0,
      },
      imageUrl: "",
      imgType:"",
      firstErr: null,
      loading: false,

      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "请填写负责人姓名"
          }
        ],

        phone: [
          {
            required: true,
            message: "请填写联系电话",
            trigger: "blur"
          }
        ],
        imgStr: [
          {
            required: true,
            message: "请上传头像",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    console.log(this.row);

    //table高度
    this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.propertyPersonList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
        .then(res => {
          res.data.rows.map(item => {
            if (item.active == 0) {
              item.activeName = "否";
            } else if (item.active == 1) {
              item.activeName = "是";
            }
          });
          this.tableData = res.data.rows;
          this.total = res.data.total;
        });
    }, 100),
    editRow(
      row = {
        imgStr: ""
      }
    ) {
      this.dialogFormTitle = !row.id ? "新增" : "编辑";
      this.dialogFormVisible = true;
      row.organId = this.filter.organId;
      this.model = cloneDeep(row);

    },
    async submit() {
      this.$refs.form.validate(async (valid, invalidFields) => {
        if (valid) {
          this.firstErr = null;
          this.loading = true;
          if (!this.model.id) {
            await Api.addPropertyPerson
              .post(this.model)
              .then(res => {
                this.$message({ message: "新增成功", type: "success" });
                this.dialogFormVisible = false;
                this._fetchData();
              })
              .catch(() => {});
          } else {

            let data=cloneDeep(this.model)
            delete data.picPath
            await Api.editPropertyPerson.put(data)
              .then(() => {
                this.$message({ message: "修改成功", type: "success" });
                this.dialogFormVisible = false;
                this._fetchData();
              })
              .catch(() => {});
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
          const data = await Api.deletePropertyPerson
            .delete({ id: row.id }, {})
            .then(res => {
              this.$message({ message: "删除成功", type: "success" });
              this._fetchData();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    pageChange(val) {
      this.filter.rows = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    //公示
    async submitPublicity(row) {
      this.dialogVisible = true;
      this.$confirm(
        `公示后，人员信息将在智慧大屏处公示，确定要公示？`,
        "提示",
        {
          type: "warning"
        }
      )
        .then(async () => {
          const data = await Api.editPropertyPerson
            .put({ id: row.id,active:1 }, {})
            .then(res => {
              this._fetchData();
            })
            .catch(res => {
            });
        })
        .catch(() => {});
    },

    //上传头像
    handleUpload(e, model) {
      const files = e.target.files;
      this.model.imgType = files[0].name;
      getBase64(files[0]).then(res => {
        let imgStr = res;
        if (model) {
          this.model.picPath =imgStr
        }
         this.model.imgStr = imgStr.substring(23);
      });
      e.target.value = "";
    },
    //取消头像
    cancel(type) {
      type=='add'? this.model.imgStr = "":this.model.picPath = ""

    }
  }
};
</script>
<style lang="less">

</style>
