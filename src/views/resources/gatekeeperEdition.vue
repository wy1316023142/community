<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex gatekeeperEditionBox">
      <span class="top-icon"></span>
      <p class="title">设备版本管理</p>
      <div class="flexItem text_r">
         <el-select v-model="filter.deviceType" placeholder="设备类型" clearable >
              <el-option
                v-for="item in deviceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
           <el-select v-model="filter.deviceFactory" placeholder="设备厂家" clearable>
              <el-option
                v-for="item in deviceFactory"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        <el-input type="text" placeholder="设备型号" v-model="filter.deviceModel" clearable></el-input>
         <el-input type="text" placeholder="版本号" v-model="filter.softwareVer" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper" ref="content">
      <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
        <el-table-column type="index" label="序号" align='center'></el-table-column>
        <el-table-column prop="deviceType" label="设备类型" align='center'>
            <template slot-scope="scope" >
                   {{scope.row.deviceType|deviceType}}
            </template>
        </el-table-column>
        <el-table-column prop="deviceFactory" label="设备厂家" align='center'>
        </el-table-column>
        <el-table-column prop="deviceModel" label="设备型号" align='center'></el-table-column>
         <el-table-column prop="softwareVer" label="版本号" align='center'></el-table-column>
        <!-- <el-table-column prop="remarks" label="备注" align='center'></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" align='center'>
           <template slot-scope="scope" >
                   {{scope.row.createTime | daterful('YYYY-MM-DD HH:mm:ss')}}
                  </template>
        </el-table-column>
        <el-table-column label="状态" prop="valid" align='center' >
            <template slot-scope="scope">
                   {{scope.row.valid|validState}}
            </template>
          </el-table-column>
        <el-table-column label="操作" align='center' width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editRow(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="deleteRow(scope.row)">删除</el-button>
            <el-button type="danger" size="mini" @click="syncRow(scope.row)"  >{{scope.row.valid | validStateBtn}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                       :page-size='filter.rows' :current-page='filter.page'></el-pagination>
      </div>
    </div>

    <!--新增编辑-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" :modal-append-to-body='false' width="400px">

      <el-form ref="form" :model="model" :show-message="false" :rules="rules">

        <el-form-item label="版本号" prop="softwareVer" >
          <el-input autocomplete="off" v-model="model.softwareVer" maxLength="32" :disabled="typeFlag" @change="CheckChinese"></el-input>
        </el-form-item>
         <el-form-item label="设备类型：" prop="deviceType">
          <el-select v-model="model.deviceType" placeholder="请选择" :disabled="typeFlag" @change="getvalue">
              <el-option
                v-for="item in deviceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
         </el-form-item>
         <el-form-item label="设备厂家" prop="deviceFactory">
          <el-select v-model="model.deviceFactory" placeholder="请选择" :disabled="typeFlag">
              <el-option
                v-for="item in deviceFactoryAdd"
                :key="item.label"
                :label="item.label"
                :value="item.label">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input autocomplete="off" v-model="model.deviceModel" maxLength="32" :disabled="typeFlag"></el-input>
        </el-form-item>
        <el-form-item label="升级文件" prop="upgradeFileName">
              <el-col class="inputDIv" v-model="model.upgradeFileName">{{upgradeFileName}}</el-col>
              <input type="file" ref='fileInput' id="fileExport"  @change="handleFileChange" class="cloose_input" >
              <el-button type="primary" size="small" @click="onPickFile" :loading="loading" class="cloose_button">选择文件</el-button>
        </el-form-item>
        <el-form-item label="效验文件" prop="checkFileName">
              <el-col class="inputDIv" v-model="model.checkFileName">{{checkFileName}}</el-col>
              <input type="file" ref='checkInput'  @change="checkFileChange"  class="cloose_input" >
              <el-button type="primary" size="small" @click="checkPickFile" :loading="loading" class="cloose_button">选择文件</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <template>
            <el-radio v-model="valid" label="0">启用</el-radio>
            <el-radio v-model="valid" label="1">停用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input autocomplete="off" v-model="model.remarks" maxLength="128" type="textarea"></el-input>
        </el-form-item>

      </el-form>
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
import { validateBlackSpace, validateNoChinese } from "../../commom/validator";

export default {
  name: "gatekeeperEdition",
  data() {
    return {
      activePermissionsData: [],
      permissionsData: [],
      loading: false,
      tabHeight: "0",
      dialogFormVisible: false,
      authorizationFormVisible: false,
      title: "天网账号",
      tableData: [],
      upgradeFileNameBase64: "",
      checkFileNameBase64: "",
      upgradeFileName: "",
      checkFileName: "",
      valid: "",
      vaolidState: "停用",
      model: {
        valid: 0,
        remarks: "",
        upgradeFileNameBase64: "",
        checkFileNameBase64: "",
        upgradeFileName: "",
        checkFileName: "",
        deviceFactory: "",
        deviceModel: "",
        deviceType: "",
        softwareVer: ""
      },
      firstErr: [],
      total: 0,
      filter: {
        page: 1,
        rows: 10,
        softwareVer: "",
        deviceType: ""
      },
      typeFlag: false,
      deviceType: [],
      deviceFactory: [],
      deviceFactoryAdd:[],
      rules: {
        softwareVer: [
          {
            required: true,
            message: "请填写版本号",
            trigger: "blur"
          },
        ],
        deviceType: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "blur"
          }
        ],
        deviceFactory: [
          {
            required: true,
            message: "请选择设备厂家",
            trigger: "blur"
          }
        ],
        deviceModel: [
          {
            required: true,
            message: "请填写设备型号",
            trigger: "blur"
          }
        ],
        upgradeFile: [
          {
            required: true,
            message: "请选择升级文件",
            trigger: "blur"
          }
        ],
        checkFile: [
          {
            required: true,
            message: "请选择校验文件",
            trigger: "blur"
          }
        ],
        remarks: [
          {
            required: true,
            message: "请填写备注",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 32;
      window.onresize = () => {
        this.tabHeight = this.$refs.content.offsetHeight - 32;
      };
      this.upgradeFileName = sessionStorage.getItem("upgradeFileName");
      this.checkFileName = sessionStorage.getItem("checkFileName");
    });
    this._fetchData();
    this.getdevicetype();

  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    checkPickFile() {
      this.$refs.checkInput.click();
    },
    //上传文件
    handleFileChange(e) {
      let inputDOM = this.$refs.fileInput;
      // 通过DOM取文件数据
      let file = inputDOM.files[0];
      this.upgradeFileName = file.name;
      let size = Math.floor(file.size / 1024 / 1024 < 10);
      let fileName = file.name.lastIndexOf("."); //获取到文件名开始到最后一个“.”的长度。
      let fileNameLength = file.name.length; //获取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength); //截取后缀名
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(this.upgradeFileName)) {
        this.$message.error("文件名不能有中文！");
        return;
      }
      // if (fileFormat != "zip") {
      //   this.$message.error("上传模板只能是zip格式!");
      //   return;
      // }
      if (!size) {
        this.$message.error("文件大小不能超过 10MB!");
        return;
      }
      //new一个FileReader实例
      let reader = new FileReader();
      let _this = this;
      reader.readAsDataURL(file); //base 64 读取
      reader.onload = function(e) {
        _this.upgradeFileNameBase64 = this.result;
      };
    },
    checkFileChange(e) {
      let inputDOM = this.$refs.checkInput;
      // 通过DOM取文件数据
      let file = inputDOM.files[0];
      this.checkFileName = file.name;

      let size = Math.floor(file.size / 1024 / 1024 < 10);
      let fileName = file.name.lastIndexOf("."); //获取到文件名开始到最后一个“.”的长度。
      let fileNameLength = file.name.length; //获取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength); //截取后缀名
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(this.checkFileName)) {
        this.$message.error("文件名不能有中文！");
        return;
      }
      // if (fileFormat != "zip") {
      //   this.$message.error("上传模板只能是zip格式!");
      //   return;
      // }
      if (!size) {
        this.$message.error("文件大小不能超过 10MB!");
        return;
      }
      //new一个FileReader实例
      let reader = new FileReader();
      let _this = this;
      reader.readAsDataURL(file); //base 64 读取
      reader.onload = function(e) {
        _this.checkFileNameBase64 = this.result;
      };
    },
    _fetchData: debounce(async function() {
      const data = await Api.getGuardList
        .get(this.filter, {
          loadingMaskTarget: ".zhsq-boxWrapper"
        })
        .then(res => res.data);
      this.tableData = data.rows;
      this.total = data.total;
    }, 100),
    syncRow(row) {
      var data = {};
      data.checkFileName = row.checkFileName;
      data.upgradeFileName = row.upgradeFileName;
      data.deviceFactory = row.deviceFactory;
      data.deviceModel = row.deviceModel;
      data.deviceType = row.deviceType;
      data.remarks = row.remarks;
      data.softwareVer = row.softwareVer;
      data.upgradeFileNameBase64 = sessionStorage.getItem(
        "upgradeFileNameBase64"
      );
      data.checkFileNameBase64 = sessionStorage.getItem("checkFileNameBase64");
      if (row.valid == 0) {
        data.valid = 1 * 1;
      } else if (row.valid == 1) {
        data.valid = 0 * 1;
      }
      Api.editGuard
        .put(data, {
          pathParams: {
            id: row.id
          }
        })
        .then(() => {
          this._fetchData();
        })
        .catch(err => {
          throw err;
          this.loading = false;
        });
    },
    editRow(
      row = {
        softwareVer: "",
        upgradeFileName: "",
        checkFileName: "",
        checkFileNameBase64: "",
        upgradeFileNameBase64: "",
        remarks: "",
        valid: "",
        deviceFactory:''
      }
    ) {
      this.title = !row.id ? "新增" : "编辑";
      if (this.title == "新增") {
        this.upgradeFileName = "";
        this.checkFileName = "";
        this.valid = "0";
        this.typeFlag = false;
      } else if (this.title == "编辑") {
        this.upgradeFileName = sessionStorage.getItem("upgradeFileName");
        this.checkFileName = sessionStorage.getItem("checkFileName");
        this.valid = row.valid.toString();
        this.typeFlag = true;
      }
      this.model = cloneDeep(row);
      this.dialogFormVisible = true;
    },
    async submit() {
      this.$refs.form.validate(async (valid, invalidFields) => {
        if (valid) {
          this.firstErr = null;
          this.loading = true;
          if (!this.model.id) {
            const user = JSON.parse(sessionStorage.getItem("user"));
            this.model.upgradeFileNameBase64 = this.upgradeFileNameBase64.substring(
              28
            );
            this.model.checkFileNameBase64 = this.checkFileNameBase64.substring(
              28
            );
            this.model.upgradeFileName = this.upgradeFileName;
            this.model.checkFileName = this.checkFileName;
            this.model.valid = this.valid * 1;
            sessionStorage.setItem("upgradeFileName", this.model.upgradeFileName);
            sessionStorage.setItem("checkFileName", this.model.checkFileName);
            sessionStorage.setItem(
              "upgradeFileNameBase64",
              this.model.upgradeFileNameBase64
            );
            sessionStorage.setItem(
              "checkFileNameBase64",
              this.model.checkFileNameBase64
            );
            await Api.addGuard
              .post(this.model)
              .then(() => {
                this.$message({ message: "新增成功", type: "success" });
              })
              .catch(err => {
                this.loading = false;
                throw err;
              });
          } else {
            let data = cloneDeep(this.model);
            data.upgradeFileNameBase64 = this.upgradeFileNameBase64.substring(
              28
            );
            data.checkFileNameBase64 = this.checkFileNameBase64.substring(28);
            data.upgradeFileName = this.upgradeFileName;
            data.checkFileName = this.checkFileName;
            data.valid = this.valid * 1;
             sessionStorage.setItem("upgradeFileName", this.model.upgradeFileName);
            sessionStorage.setItem("checkFileName", this.model.checkFileName);
            sessionStorage.setItem(
              "upgradeFileNameBase64",
              this.model.upgradeFileNameBase64
            );
            sessionStorage.setItem(
              "checkFileNameBase64",
              this.model.checkFileNameBase64
            );
            await Api.editGuard
              .put(data, {
                pathParams: {
                  id: this.model.id
                }
              })
              .then(() => {
                this.$message({ message: "修改成功", type: "success" });
              })
              .catch(err => {
                throw err;
                this.loading = false;
              });
          }
          this.loading = false;
          this.dialogFormVisible = false;
          this._fetchData();
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
          const data = await Api.deleteGuard
            .delete(
              {},
              {
                pathParams: {
                  id: row.id
                }
              }
            )
            .then(res => {
              this.$message({ message: "删除成功", type: "success" });
              this._fetchData();
            })
            .catch(() => {

            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    //获取设备类型
    getdevicetype() {
      Api.getDeviceType.get().then(res => {
        var data = res.data.result;
        for (var i in data) {
           let obj={}
           obj.value = i;
           obj.label = data[i]
           this.deviceType.push(obj)
        }
      });
      this.getDeviceFactory()
    },
    //获取设备厂家
    getDeviceFactory() {
      Api.getDeviceFactory.get({
          typeClassification: 8,
          typeLevel: 2
      }).then(res => {
        console.log(res);

          for (var i = 0; i < res.data.rows.length; i++) {
            if (res.data.rows[i].note) {//拿到所有厂家
              var obj = {};
              obj.value = res.data.rows[i].note;
              obj.label = res.data.rows[i].typeName;
              this.deviceFactory.push(obj);
            }
          }
        });
    },
    getvalue(val){
      const list=[]
      this.deviceFactoryAdd=[]
      this.deviceFactory.map(item=>{
        if(val == item.value ){
          var obj = {};
          obj.label = item.label;
          obj.value = item.value;
          list.push(obj)
        }
        this.deviceFactoryAdd=list
        this.model.deviceFactory=''
      })
    },
    //中文验证
    CheckChinese(val) {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
      if (reg.test(val)) {
         this.$message.error("请勿输入中文！");
      }
    }
  }
};
</script>
<style lang="less">
.inputDIv {
  border: 1px solid #ccc;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.cloose_input {
  display: none;
  position: relative;
}
.cloose_button {
  position: absolute;
  top: 5px;
  right: 4px;
}
</style>
