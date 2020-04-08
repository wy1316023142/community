<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">网格员管理</p>
      <div class="flexItem text_r">
           <el-input  placeholder="姓名"  v-model="filter.name" clearable></el-input>
            <el-select v-model="filter.flag" placeholder="状态" clearable>
            <el-option v-for="item in gridState"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"></el-option>
            </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
         <el-button type="primary" size="small"  @click="edit()">新增</el-button>
         <el-button type="primary" size="small" title="点击下载导入模板"><a href="/template/area_user_temp .xlsx">下载模板</a></el-button>
         <el-button type="primary" size="small"  @click="importFormVisible = true">导入</el-button>
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
                <el-table-column prop="name" label="姓名" align='center' width="100"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align='center'  width="160"></el-table-column>
                 <el-table-column prop="remarks" label="备注" align='center' width="160"></el-table-column>
                <el-table-column prop="flag" label="状态" align='center' width="160" >
                      <template slot-scope="scope" >
                         {{scope.row.flag | GrieStates}}
                      </template>
                </el-table-column>
                <el-table-column prop="streetName" label="关联账号"  align='center' width="200"></el-table-column>
                <el-table-column label="操作" align='center' >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="edit(scope.row)">修改</el-button>
                        <el-button type="danger" size="mini"  @click="deleteRow(scope.row)">删除</el-button>
                        <el-button type="primary" size="mini" v-if="scope.row.flag == 1" @click="DialogFlag(scope.row)">停用</el-button>
                        <el-button type="primary" size="mini"  v-if="scope.row.flag == 0"  @click="DialogFlag(scope.row)">启用</el-button>
                        <el-button type="primary" size="mini"  @click="resetPwd(scope.row)">重置密码</el-button>
                        <el-button type="primary" size="mini" @click="authorization(scope.row)" style="margin:10px">权限管理</el-button>
                    </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total,jumper" :total='total' :page-size='filter.size' :current-page='filter.current'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
     <el-dialog  :title="addDialogFormTitle" :visible.sync="careNotification"
      :close-on-press-escape="false" :modal-append-to-body='false' width="550px" top="5vh">
        <el-form ref="form" :model="model" :show-message="false" :rules="rules" >
           <el-form-item label="姓名：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input autocomplete="off" v-model="model.mobile" maxLength="11"></el-input>
        </el-form-item>
              <el-form-item label="备注:" class="taskintro">
               <el-input type="textarea" v-model="model.desc" style="min-height:50px"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
              <el-button @click="careNotification =false">取 消</el-button>
              <el-button type="primary" @click="submitEdit()" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
   <!--授权-->
    <el-dialog title="授权" :visible.sync="authorizationFormVisible" :close-on-click-modal="false"
              :modal-append-to-body='false' width="500px"
               class="authorization-dialog">
      <el-tree ref="permissionsTree" :data="permissionsData" node-key="id" :props="defaultProps" highlight-current
               :default-expanded-keys="activePermissionsData">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span class="el-tree-node__label">{{ data.name }}</span>
          <el-checkbox v-model="node.checked"></el-checkbox>
        </div>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorizationFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuthorization" :loading="loading">确 定</el-button>
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
import { debounce, keys, cloneDeep } from "lodash";
import {
  validateIdCard,
  validatePhone,
  validateBlackSpace
} from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import moment from "moment";
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
      importFormVisible: false,
      importData: [],
      fileList: [],
      fileHeader: {},
      activePermissionsData:[],
      permissionsData: [],
      userId: 1,
      dialogForm:false,
      dialogFormTitle: "权限管理",
      addDialogFormTitle:"",
      careNotification:false,
      authorizationFormVisible:false,
      DialogTitle:"",
      // DialogFlag:false,
      isPublicity: 0,
      tableData: [ ],
      model: {
        name: "",
         organId: 0,
      },
      total: 0,
       filter: {
        organId: 0,
        size: 10,
        current: 0,
        name :"",
        flag :''

      },
       action: "",
      defaultProps: {
          children: 'chil',
          label: 'name'
        },
      rules:{
          name: [{
            required: true,
            message: '请填写姓名',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '姓名不能有空格',
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请填写手机号码',
            trigger: 'blur'
          }, {
            // validator: validatePhone,
            // message: '请输入正确的手机号码',
            // trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '手机号码不能有空格',
            trigger: 'blur'
          }],
      },
      form:{},
      firstErr: null,
      loading: false,
      time:[],
      gridState:[
           { id: 1, label: "停用" },
        { id: 0, label: "启用" },
      ],
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
    this.action=myConfig.baseUrl+'/system/user/area/import/'+this.filter.organId
    this._fetchData();
  },
  methods: {
    _fetchData: debounce(async function() {
      const data = await Api.AreaPageList
        .get(this.filter, {
          loadingMaskTarget: ".tableBox"
        })
         .then(res => res.data);
         this.tableData = data.rows;
      this.total =data.total;
    }, 100),
    pageChange(val) {
      this.filter.current = val - 1;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.filter.organId = item.id || "";
      this._fetchData();
    },
    edit(row={}){
         this.careNotification = true
          this.addDialogFormTitle = !row.id ? '新增网格员' : '编辑网格员'
        this.model = cloneDeep(row)
        this.model.organId = this.filter.organId
    },
      async submitEdit() {
        this.model.userType=3
        this.model.titleId = 8
        this.model.username = this.model.mobile
        this.model.organId = this.filter.organId
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addUser.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.modifyUser.put(this.model, {
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
            this.careNotification = false
             this.loading = false
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
    DialogFlag(row){
       if(row.flag ==0){
          row.flag =1
       }else if(row.flag ==1){
          row.flag =0
       }
       Api.startStop.put({
            }, {
               pathParams: {
                  userId: row.id,
              flag:row.flag
                }
          }).then(res => {
            this.$message({message: '修改成功', type: 'success'})
            this._fetchData();
          })

    },
    async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteUser.delete({}, {
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
        resetPwd(row){

        this.$confirm(`确定要重置密码吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.resetPwd.put({}, {
            pathParams: {
              userId: row.id
            }
          }).then(res => {
            this.$message({message: '重置成功', type: 'success'})
          })
        })
      },



    //授权
      authorization(row) {
        this.userId = row.id
        this.permissionsData = [];
        this.activePermissionsData = [];
        const getAreaUserPermissionsTree = Api.getAreaUserPermissionsTree.get({}, {
          pathParams: {
             villageId: this.filter.organId
           }
          })
        const getAreaUserPermission = Api.getAreaUserPermission.get({}, {
          pathParams: {
            userId: row.id
          }
        })

        Promise.all([getAreaUserPermissionsTree, getAreaUserPermission]).then(([res1, res2]) => {
          this.permissionsData = res1.data.rows;
          this.activePermissionsData = res2.data.result;
          this.authorizationFormVisible = true;
          this.$nextTick(() => {
            this.$refs.permissionsTree.setCheckedKeys(res2.data.result)
          })
        })

      },
      submitAuthorization() {
        const checkedOrgans = this.$refs.permissionsTree.getCheckedKeys()
        var obj ={}
        var role =[]

        checkedOrgans.forEach((i)=>{
         obj={
           organId:this.filter.organId,
           unitId:i
         }
         role.push(obj)
        })
        this.loading = true
        Api.userAreaPermissions.put(
          {unitIdSet: role}, {
            pathParams: {
              userId: this.userId
            }
          }
        ).then(() => {
          this.loading = false
          this.authorizationFormVisible = false
          this.$message({message: '授权成功', type: 'success'})
        }).catch(err => {
          this.loading = false
        })
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
      console.log(myConfig.baseUrl);

      this.action=myConfig.baseUrl+'/system/user/area/import'+this.filter.organId
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
          "用户名",
          "姓名",
          "联系电话",

        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "username",
          "name",
          "mobile",

        ];
        const list = this.importData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导入人员错误信息列表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
     changeDate( val) {
      if(val == null){
         this.filter.startDateStr=""
         this.filter.endDateStr = ''
          this._fetchData();
      }else{
         this.filter.startDateStr = moment(this.time[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.filter.endDateStr = moment(this.time[1]).format("YYYY-MM-DD HH:mm:ss");
      }
    },

    },

};
</script>
<style lang="less">
.jurisdiction-list{
  display: flex;
  line-height: 30px;
  p{
    margin-left: 30px;
    font-size: 16px
  }

span {
    position: relative;
}
.Checkbox {
    position: absolute;
    visibility: hidden;
}
.Checkbox+label {
    position:absolute;
    width: 16px;
    height: 16px;
    border: 1px solid #A6A6A6;
    // border-radius: 50%;
    // background-color:#DEDEDE;
}
.Checkbox:checked+label:after {
    content: "";
    position: absolute;
    left: 2px;
    top:2px;
    width: 9px;
    height: 4px;
    border: 2px solid #424242;
    border-top-color: transparent;
    border-right-color: transparent;
    transform: rotate(-45deg);
    -ms-transform: rotate(-60deg);
    -moz-transform: rotate(-60deg);
    -webkit-transform: rotate(-60deg);
}
}
</style>
