<template>
  <div class="zhsq-innerBody" ref="innerBody" >
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">投票活动管理＞候选项管理</p>
      <div class="flexItem text_r">
          候选项名称：<el-input ref="seachName" placeholder="请输入候选项名称"  v-model="filter.name" clearable style="width:180px"></el-input>
          <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
        <el-button type="primary" @click=" back()" size="small" >返回</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="24">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox" >
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight">
                <el-table-column prop=""  label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="候选项名称" align='center'></el-table-column>
                <el-table-column prop="number" label="编号" align='center'>
                   <template scope="scope">
                     <span>{{scope.row.number}}号</span>
                </template>
                </el-table-column>
                <el-table-column prop="photoUrl" label="照片" align='center'>
                   <template scope="scope">
                    <img :src="scope.row.photoUrl" width="40" height="40" />
                </template>
                </el-table-column>
                <el-table-column prop="introduction" label="简介" align='center'></el-table-column>
                <el-table-column  label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini"    @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="danger"  size="mini"  @click="deleteRow(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增编辑-->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="470px" >
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
           <el-col :span="24">
              <el-form-item label="候选项名称:" prop="name">
                <el-input  autocomplete="off" v-model="model.name"></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="24">
              <el-form-item label="编号：" prop="number">
                <el-input  autocomplete="off" v-model="model.number"></el-input>
              </el-form-item>
            </el-col>
            <!--新增头像-->
            <el-col v-if="!model.id">
                <el-form-item label="照片：" prop="photo">
                <div class='imgDiv'>
                    <span v-show='!!model.photo' @click='cancel("add")' class='el-icon-error'></span>
                    <img v-show='!!model.photo' :src="'data:image/jpeg;base64,'+ model.photo"/>
                    <div v-show='!model.photo'>
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event)"/>
                    </div>
                </div>
                <input type="hidden" v-if="false" v-model="model.photo"/>
                </el-form-item>
            </el-col>
            <!--编辑头像-->
            <el-col v-if="!!model.id" prop="photo">
                <el-form-item label="照片：">
                <div class='imgDiv'>
                    <span v-show='!!model.photoUrl' @click='cancel("eidt")' class='el-icon-error'></span>
                    <img v-show='!!model.photoUrl' :src="model.photoUrl"/>
                    <div v-show='!model.photoUrl'>
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                    <input ref='inputFile' type="file" accept="image/*" @change="handleUpload($event,model)"/>
                    </div>
                </div>
                <input type="hidden" v-if="false" v-model="model.photo"/>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="简介：" prop="introduction">
                <el-input  type="textarea" autocomplete="off" v-model="model.introduction"></el-input>
              </el-form-item>
            </el-col>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">保 存</el-button>
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
      tableData: [
        {
         name:"123" ,
         number:"1",
         photo:"",
         introduce:"123"
        }
      ],
      model: {
       photoUrl: "",
        name: "",
        activityId:"",
        photoName:""
      },
      total: 0,
      filter: {
        organId: 0,
        page: 1,
        rows: 10,
        activityId:"",
         photoUrl: "",
      },
      imageUrl: "",
      imgType: "",
      photoName:"",
      firstErr: null,
      loading: false,
      activityId:"",

      rules: {
        name: [
          {
            required: true,
            trigger: "blur",
            message: "请填写请输入候选项名称"
          }
        ],

        number: [
          {
            required: true,
            message: "请填写编号",
            trigger: "blur"
          },
        ],
        photo: [
          {
            required: true,
            message: "请上传头像",
            trigger: "blur"
          }
        ],
        introduce:[
          {
            required: true,
            message: "请输入简介",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
      this.fileHeader = {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      };
        this.tabHeight = this.$refs.content.offsetHeight - 56;
      window.onresize = () => {
        this.tabHeight = this.$refs.content.offsetHeight - 56;
      };
    });
    this.activityId = this.$route.query.activityId
    // console.log(this.activityId);

    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
       this.filter.activityId = this.activityId
      const data = await Api.votingManageList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
        .then(res => {
          // this.$refs.seachName.resetFields()
          this.tableData = res.data.rows;
          this.total = res.data.total;
        });
    }, 100),
    editRow(
      row = {
        photo: ""
      }
    ) {
      this.dialogFormTitle = !row.id ? "新增候选项" : "编辑候选项";
      this.dialogFormVisible = true;
      row.organId = this.filter.organId;
      this.model = cloneDeep(row);
    },
     submit() {
       this.model.activityId = this.activityId
      this.$refs.form.validate(async (valid, invalidFields) => {
        if (valid) {
          if (!this.model.id) {
             Api.votingManageAdd
              .post( this.model,
                  {
                  pathParams: {
                    activityId:this.activityId
                    }
                  }
              )
              .then(res => {
                this.$message({ message: "新增成功", type: "success" });
                this.dialogFormVisible = false;
                this._fetchData();
              })
              .catch(() => {});
          } else {
            let data = cloneDeep(this.model);
            data.photo = data.photoUrl.substring(23);
            // delete data.photo;
            await Api.votingManageEdit
              .put(data)
              .then(() => {
                this.$message({ message: "修改成功", type: "success" });
                this.dialogFormVisible = false;
                this._fetchData();
              })
              .catch(() => {});
          }
        } else {
        }
      });
    },
    async deleteRow(row) {
      // this.activityId = row.activityId
      this.$confirm(`确定删除吗？`, "提示", {
        type: "warning"
      })
        .then(async () => {
          const data = await Api.votingManageDelete
            .delete({ },
            {
               pathParams: {
                  id: row.id
                }
             })
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
     this.filter.page = val;
      this._fetchData();
    },

    //上传头像
    handleUpload(e, model) {
      const files = e.target.files;
      this.model.photoName = files[0].name;
      getBase64(files[0]).then(res => {
        let photo = res;
        console.log(photo);

        if (model) {
          this.model.photoUrl = photo;
        }
        this.model.photo = photo.substring(23);
      });
      e.target.value = "";
    },
    //取消头像
    cancel(type) {
      type == "add" ? (this.model.photo = "") : (this.model.photoUrl = "");
    },

    back(){
        this.$router.push({path:'/propertyManager/voting'})
    }
  }
};
</script>
<style lang="less">
</style>
