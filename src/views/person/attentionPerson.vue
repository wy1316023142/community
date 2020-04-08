<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">关注人员库</span>
      <div class="text_r flexItem">
        <el-input type="text" placeholder="姓名"  v-model="filter.personName" clearable></el-input>
        <el-input type="text" placeholder="身份证号"  v-model="filter.identityNumber" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small"  @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <div class="zhsq-right-con" ref="content">
        <div class="tableBox">
          <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
            <el-table-column label="序号" align='center'   type="index"></el-table-column>
            <el-table-column prop="personName" label="姓名" align='center'></el-table-column>
            <el-table-column prop="identityNumber" label="身份证号" align='center'></el-table-column>
            <el-table-column prop="createTimeStr" label="创建时间" align='center' width="280">
            </el-table-column>
            <el-table-column prop="creatorName" label="创建人" align='center'></el-table-column>
            <el-table-column prop="organName" label="创建机构" align='center'></el-table-column>
            <el-table-column  label="人脸照片" align='center'>
              <template slot-scope="scope">
                <el-popover placement="left"  trigger="click">
                  <img :src="scope.row.imagePath" width="500"/>
                  <img slot="reference" :src="scope.row.imagePath"  width="40" height="40">
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="deleteRow(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageBox">
            <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
          </div>
        </div>
      </div>
    </div>


    <el-dialog title="新增关注人员" :visible.sync="dialogFormVisible"  class="attentionPersonDialog"  :modal-append-to-body='false' width="450px" :close-on-click-modal="false">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="人员所属：">
          <el-select placeholder="请选择" v-model="personAppertain" @change="handleSelect">
            <el-option :key="0" label="小区外人员" :value="0"></el-option>
            <el-option :key="1" label="小区内人员" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号：" v-if="idCardVisible">
          <el-select
            v-model="personId"
            filterable
            remote
            reserve-keyword
            placeholder="新增人员，输入身份证查找"
            :remote-method="remoteMethod"
            :loading="searchLoading"
            @change="searchChange">
            <el-option
              v-for="item in searchList"
              :key="item.id"
              :label="item.name + '('+item.identityNumber+')'"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="infoVisible">
          <el-form-item label="头像：" prop="imgStr" >
            <div class='imgDiv'>
              <span v-show='(!!model.imgStr)&&(!appertain)' @click='cancel()' class='el-icon-error'></span>
              <img v-show='!!model.imgStr' :src="model.imgStr"/>
              <div v-show='(!model.imgStr)&&(!appertain)'>
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event)"/>
              </div>
            </div>
            <input type="hidden" v-if="false" v-model="model.imgStr"/>
          </el-form-item>
          <el-form-item label="姓名：" prop="personName" >
            <el-input  autocomplete="off" v-model="model.personName" :disabled="appertain"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码：" prop="identityNumber" >
            <el-input  autocomplete="off" v-model="model.identityNumber" :disabled="appertain"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="tel">
            <el-input  autocomplete="off" v-model="model.tel" :disabled="appertain"></el-input>
          </el-form-item>
        </template>
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
import { domHeightMixin } from "../../commom/mixins.js";
import OrganTree from "../../components/OrganTree.vue";
import { validateIdCard, validatePhone } from "../../commom/validator";
import { getBase64, convert2JPEG } from "../../commom/util.js";
export default {
  mixins: [domHeightMixin],
  name: "openDoorRecord",
  components: { OrganTree },
  data() {
    return {
      personId: "",
      libraryId: "",
      appertain: false,
      loading: false,
      personAppertain: "",
      dialogFormVisible: false,
      infoVisible: false,
      idCardVisible: false,
      tableData: [],
      model: {},
      total: 0,
      searchList: [],
      searchLoading: false,
      filter: {
        page: 1,
        rows: 10,
        organId: 1,
        personName: null,
        identityNumber: null
      },
      rules: {
        imgStr: [
          {
            required: true,
            message: "请上传头像",
            trigger: "blur"
          }
        ],
        personName: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          }
        ],
        identityNumber: [
          {
            required: true,
            message: "请填写身份证",
            trigger: "blur"
          },
          {
            validator: validateIdCard,
            message: "请输入正确的身份证",
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          },
          {
            validator: validatePhone,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.filter.organId = JSON.parse(localStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.getAttentionPerson
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);
      if(data.rows.length>0){
         for(var i=0;i<data.rows.length;i++){
         var ss=data.rows[i].identityNumber
         var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
          var i="";
          while(i.length<z.length){i+="*"}
          return y+i+p
          
      })
        data.rows[i].identityNumber=str1
      }
      }
      this.tableData = data.rows;
      this.total = data.total;
      this.libraryId = data.result.id;
    }, 100),
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    editRow(
      row = {
        personName: "",
        identityNumber: "",
        tel: "",
        imgStr: "",
        imgType: "",
        rowKeyId: null,
        imagePath: "",
        id: ""
      }
    ) {
      this.model = cloneDeep(row);
      this.dialogFormVisible = true;
      this.model.organId = this.filter.organId;
      this.personAppertain = "";
    },
    searchChange(val) {
      let person = this.searchList.find(item => item.id === val);
      this.model.personName = person.name;
      this.model.identityNumber = person.identityNumber;
      this.model.tel = person.tel;
      this.model.imgStr = person.photoPath;
      this.searchList = [];
      this.infoVisible = true;
      this.model.rowKeyId = person.id;
      this.model.imagePath = person.photoPath;
    },
    handleSelect(val) {
      this.model.personName = "";
      this.model.identityNumber = "";
      this.model.tel = "";
      this.model.imgStr = "";
      this.model.imgType = "";
      this.personAppertain = val;
      if (val === 0) {
        //小区外
        this.idCardVisible = false;
        this.infoVisible = true;
        this.appertain = false;
        this.model.rowKeyId = null;
      } else if (val === 1) {
        //小区内
        this.idCardVisible = true;
        this.infoVisible = false;
        this.appertain = true;
      }
    },
    //上传头像
    handleUpload(e, model) {
      const files = e.target.files;
      //this.model.imgType="."+files[0].name.split(".")[1];
      this.model.imgType = files[0].name;
      console.log(this.model.imgType);
      getBase64(files[0]).then(res => {
        this.model.imgStr = res;
      });
      e.target.value = "";
    },
    //取消头像
    cancel() {
      this.model.imgStr = "";
    },
    //搜索人员
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        let personList = Api.selectPerson
          .get({ queryStr: query, row: 1000, page: 1 })
          .then(data => {
            this.searchList = data.data.rows;
          });
        this.searchLoading = false;
      } else {
        this.searchList = [];
      }
    },
    async submit() {
      this.$refs.form.validate(async (valid, invalidFields) => {
        if (valid) {
          this.firstErr = null;
          this.loading = true;
          this.model.id = this.libraryId;
          let model = cloneDeep(this.model);
          model.imgStr = model.imgStr.substring(23);
          await Api.addAttentionPerson
            .post(model)
            .then(() => {
              this.$message({ message: "新增成功", type: "success" });
              this.loading = false;
              this.dialogFormVisible = false;
              this._fetchData();
            })
            .catch(err => {
              this.loading = false;
            });
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
          const data = await Api.delAttentionPerson
            .delete(
              {},
              {
                pathParams: {
                  libraryId: this.libraryId,
                  personId: row.personId
                }
              }
            )
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
    }
  }
};
</script>
<style lang="less">
</style>
