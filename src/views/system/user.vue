<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">用户管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="用户名" v-model="filter.username" clearable></el-input>
        <el-input type="text" placeholder="姓名" v-model="filter.name" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="10002001">新增</el-button>
         <el-button type="primary" size="small" title="点击下载导入模板"><a href="/template/user_temp .xlsx">下载模板</a></el-button>
        <el-button type="primary" size="small" title="点击导入信息" @click="importFormVisible = true">导入</el-button>
        
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
                <!--<el-table-column label="序号" align='center' type="index"></el-table-column>-->
                <el-table-column prop="username" label="用户名" align='center'></el-table-column>
                <el-table-column prop="name" label="姓名" align='center'></el-table-column>
                <el-table-column prop="userType" label="登录类型" align='center'
                                 :formatter="userTypeFormat"></el-table-column>
                <el-table-column prop="titleId" label="用户类型" align='center' :formatter="titleFormat"></el-table-column>
                <el-table-column prop="mobile" label="电话号码" align='center'></el-table-column>
                <!--<el-table-column prop="gpsNumber" label="定位编号" align='center'></el-table-column>-->
                <el-table-column label="操作" align='center' width="300">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="resetPwd(scope.row)" v-allow="10002004">重置密码</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="10002002">编辑</el-button>
                    <el-button type="primary" size="mini" @click="authorization(scope.row)" v-allow="10002005">授权</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="10002003">删除</el-button>
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
        <el-form-item label="用户名：" prop="username">
          <el-input autocomplete="off" v-model="model.username" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="mobile">
          <el-input autocomplete="off" v-model="model.mobile" maxLength="11"></el-input>
        </el-form-item>
        <el-form-item label="登录类型：">
          <el-select v-model="model.userType">
            <el-option v-for="item in userTypeData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型：">
          <el-select v-model="model.titleId">
            <el-option v-for="item in titleTypeData"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SIP服务：">
          <el-select v-model="model.sipId" clearable>
            <el-option v-for="item in sipData"
                       :key="item.id"
                       :label="item.serverName"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
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
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validatePhone,validateBlackSpace} from '../../commom/validator'

  export default {
    name: 'user',
    components: {OrganTree},
    data() {
      return {
         fileList:[],
          importData:[],
           importVisible:false,
         action: "",
         fileHeader: {},
        importFormVisible: false,
        activePermissionsData: [],
        tabHeight: '0',
        permissionsData: [],
        dialogFormVisible: false,
        authorizationFormVisible: false,
        sipData: [],
        title: '用户',
        tableData: [],
        model: [],
        total: 0,
        filter: {
          organId: 1,
          name: null,
          username: null,
          page: 1,
          rows: 10,
        },
        sipFilter: {
          page: 1,
          rows: 100,
        },
        userId: 1,
        activeOrg: [],
        firstErr: null,
        loading: false,
        rules: {
          username: [{
            required: true,
            message: '请填写用户名',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '用户名不能有空格',
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: '请选填姓名',
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
            validator: validatePhone,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '手机号码不能有空格',
            trigger: 'blur'
          }],
        },
        defaultProps: {
          children: 'chil',
          label: 'name'
        },
        titleTypeData: [
          {key: 1, value: '民警'},
          {key: 2, value: '巡控人员'},
          {key: 3, value: '社区人员'},
          {key: 4, value: '护区队'},
          {key: 5, value: '社会单位'},
          {key: 6, value: '楼栋长'},
          {key: 7, value: '站长'}
        ],
        userTypeData: [
          {key: 1, value: 'Web用户'},
          {key: 2, value: 'APP用户'}
        ]
      }
    },
    mounted() {
      this.fileHeader = {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    };
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-56
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-56
        };
      })
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      console.log(JSON.parse(sessionStorage.getItem('user')).organId,'1111111');
      
      
      
      this._fetchSipData();
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.userList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total * 1
      }, 100),
      _fetchSipData: debounce(async function () {
        const data = await Api.pageSipServer.get(this.sipFilter, {
        }).then(res => res.data)
        this.sipData = data.rows;
      }, 100),
      titleFormat(row, column) {
        let titleType = this.titleTypeData[0].value;
        this.titleTypeData.forEach(item => {
          if (item.key == row.titleId) {
            titleType = item.value;
            return;
          }
        });
        return titleType;
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
      userTypeFormat(row, column) {
        let userType = this.userTypeData[0].value;
        this.userTypeData.forEach(item => {
          if (item.key == row.userType) {
            userType = item.value;
            return;
          }
        });
        return userType;
      },
      editRow(row = {
        titleId: 1,
        userType: 1
      }) {
        this.title = !row.id ? '新增用户' : '编辑用户'
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
      pageChange(val) {
        this.filter.page = val;
        this._fetchData();
      },
      orgNodeClick([item = {}]) {
      
        this.action=myConfig.baseUrl+'/system/user/import/'+item.id
        this.filter.organId = item.id || '';
         
        this._fetchData();
      },
      //授权
      authorization(row) {
        this.userId = row.id
        this.permissionsData = [];
        this.activePermissionsData = [];
        const getUserPermissionsTree = Api.getUserPermissionsTree.get({})
        const getUserPermissions = Api.getUserPermissions.get({}, {
          pathParams: {
            id: row.id
          }
        })

        Promise.all([getUserPermissionsTree, getUserPermissions]).then(([res1, res2]) => {
          this.permissionsData = res1.data.result;
          this.activePermissionsData = res2.data.result;
          this.authorizationFormVisible = true;
          this.$nextTick(() => {
            this.$refs.permissionsTree.setCheckedKeys(res2.data.result)
          })
        })
      },
      submitAuthorization() {
        const checkedOrgans = this.$refs.permissionsTree.getCheckedKeys()
        this.loading = true
        Api.userPermissions.put(
          {roleIdSet: checkedOrgans}, {
            pathParams: {
              id: this.userId
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
        // this.action=myConfig.baseUrl+'/system/user/import/'+this.filter.parentId
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
    }
    },
  };
</script>
<style lang="less">

</style>
