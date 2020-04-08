<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title"><span>实有单位</span> > 从业人员</span>
      <div class="text_r flexItem">
        <el-input type="text" placeholder="姓名"  v-model="filter.companyUserName" clearable></el-input>
        <el-button type="primary" size="small" @click="returnRealEntity()">返回</el-button>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small" title="点击下载导入模板"><a href="/template/practitioner.xlsx">下载模板</a></el-button>
        <el-button type="primary" size="small" title="点击导入信息" @click="importFormVisible = true">导入</el-button>
        <el-button type="primary" size="small"  @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <div class="zhsq-right-con" ref="content">
        <div class="tableBox">
          <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
            <el-table-column label="序号" align='center'   type="index"></el-table-column>
            <el-table-column prop="companyUserName" label="姓名" align='center'></el-table-column>
            <el-table-column prop="companyUserIdentity" label="身份证号" align='center'></el-table-column>
            <el-table-column prop="phone" label="联系方式" align='center' width="280"></el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="editRow(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteRow(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pageBox">
            <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
          </div>
        </div>
      </div>
    </div>


    <el-dialog :title="addDialogFormTitle" :visible.sync="dialogFormVisible"  class="attentionPersonDialog"  :modal-append-to-body='false' width="450px" :close-on-click-modal="false">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <template>
          <el-form-item label="姓名：" prop="companyUserName" >
            <el-input  autocomplete="off" v-model="model.companyUserName" :disabled="appertain"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码：" prop="companyUserIdentity" >
            <el-input  autocomplete="off" v-model="model.companyUserIdentity" :disabled="appertain"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="phone">
            <el-input  autocomplete="off" v-model="model.phone" :disabled="appertain"></el-input>
          </el-form-item>
        </template>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">保 存</el-button>
      </div>
    </el-dialog>

   <!--导入-->
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
import { debounce, keys, cloneDeep } from "lodash";
import { domHeightMixin } from "../../commom/mixins.js";
import { validateIdCard, validatePhone } from "../../commom/validator";
import { getBase64, convert2JPEG } from "../../commom/util.js";
export default {
  mixins: [domHeightMixin],
  name: "practitioners",
  data() {
    return {
      addDialogFormTitle:'',
      importFormVisible:false,
      personId: "",
      libraryId: "",
      fileHeader:{},
      fileList:[],
      importData:[],
      action:'',
      appertain: false,
      loading: false,
      dialogFormVisible: false,
      importVisible:false,
      tableData: [],
      model: {},
      total: 0,
      filter: {
        page: 1,
        rows: 10,
        companyId : this.$route.params.row.id,
        companyUserName: null,
        identityNumber: null
      },
      rules: {
        companyUserName: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          }
        ],
        companyUserIdentity: [
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
        phone: [
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
    this.fileHeader={
      'Authorization' : 'Bearer ' + sessionStorage.getItem("token")
    }
    this.action=myConfig.baseUrl+'/business/practitioners/import/'+this.filter.companyId
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.practitionersList
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);
      if(data.rows.length>0){
         for(var i=0;i<data.rows.length;i++){
         var ss=data.rows[i].companyUserIdentity
         var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
          var i="";
          while(i.length<z.length){i+="*"}
          return y+i+p

      })
        data.rows[i].companyUserIdentity=str1
      }
      }
      this.tableData = data.rows;
      this.total = data.total;
    }, 100),
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },

    editRow(row={}){
      this.model={}
      this.model.companyId=this.filter.companyId
      this.addDialogFormTitle = !row.id ? '新增' : '编辑'
      if(row.id){
          Api.getPractitioners.get({},{
            pathParams: {
              id: row.id,
            }
        }).then(res=>{
        this.model = res.data.result
        // this.model.companyId = this.filter.companyId

        })
      }
      this.dialogFormVisible = true
    },

    async submit() {
      this.$refs.form.validate(async (valid, invalidFields) => {
        if (valid) {
          this.firstErr = null;
          this.loading = true;
         if (!this.model.id) {
              await Api.addPractitioners.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false

                  this._fetchData()
                }).catch(() => {
                })
            } else {
              await Api.editaddPractitioners.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
                this.dialogFormVisible = false
                this._fetchData()
              }).catch(() => {
              })
            }
            this.loading = false
        } else {
          const firstKey = keys(invalidFields)[0];
          this.firstErr = invalidFields[firstKey][0];
        }
      });
    },
    async deleteRow(row) {
      this.$confirm(`确定删除吗？`, "提示", {
        type: "warning"
      }).then(async () => {
          const data = await Api.deletePractitioners.delete({},{
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
    fileSuccess(res, file, fileLis){
      this.fileList=[]
    if(res.code==0){
      if(res.rows.length!==0){
          this.$message.info('上传错误');
          this.importData=res.rows
          this.importVisible=true
          }else{
          this._fetchData();
          this.$message({message: '上传成功', type: 'success'})
          this.importFormVisible=false
          }
        }else {
          this.$message.error(res.msg);

        }
    },
      //上传失败
    onRrror(err, file, fileList){
      this.$message.error(err);
    },
    returnRealEntity(){
      var organId=this.$route.params.row.organId

       this.$router.push({
            name: 'realEntity',
             params: {
              organId: organId,
            }})
    }
  }
};
</script>
<style lang="less">
</style>
