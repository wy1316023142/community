<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">天网账号管理列表</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()" v-allow="900101">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper" ref="content">
      <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
        <el-table-column type="index" label="序号" align='center'></el-table-column>
        <el-table-column prop="platNum" label="平台编号" align='center'></el-table-column>
        <el-table-column prop="platName" label="平台名称" align='center'></el-table-column>
        <el-table-column prop="logonname" label="登录账号" align='center'></el-table-column>
        <el-table-column prop="password" label="密码" align='center'></el-table-column>
        <el-table-column prop="megaUrl" label="url" align='center'></el-table-column>
        <el-table-column prop="updateTimeStr" label="更新时间" align='center'></el-table-column>
        <el-table-column label="操作" align='center' width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="900102">编辑</el-button>
            <el-button type="primary" size="mini" @click="syncRow(scope.row)" v-allow="900104">同步</el-button>
            <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="900103">删除</el-button>
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

      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="平台编号：" prop="platNum">
          <el-input autocomplete="off" v-model="model.platNum" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="平台名称：" prop="platName">
          <el-input autocomplete="off" v-model="model.platName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="登录账号：" prop="logonname">
          <el-input autocomplete="off" v-model="model.logonname" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input autocomplete="off" v-model="model.password" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="url：" prop="megaUrl">
          <el-input autocomplete="off" v-model="model.megaUrl" maxLength="128"></el-input>
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
  import {validateBlackSpace } from '../../commom/validator'

  export default {
    name: 'organGBUser',
    data() {
      return {
        activePermissionsData: [],
        permissionsData: [],
        loading: false,
        tabHeight: '0',
        dialogFormVisible: false,
        authorizationFormVisible: false,
        title: '天网账号',
        tableData: [],
        model: [],
        firstErr: [],
        total: 0,
        filter: {
          page: 1,
          rows: 10,
        },
        rules: {
          platNum: [{
            required: true,
            message: '请填平台编号',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '平台编号不能有空格',
            trigger: 'blur'
          }],
          platName: [{
            required: true,
            message: '请填平台名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '平台名称不能有空格',
            trigger: 'blur'
          }],
          logonname: [{
            required: true,
            message: '请填账号名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '账号名称不能有空格',
            trigger: 'blur'
          }],
          passwrod: [{
            required: true,
            message: '请填账号密码',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '账号密码不能有空格',
            trigger: 'blur'
          }],
          megaUrl: [{
            required: true,
            message: '请填平台url',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: 'url不能有空格',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.content.offsetHeight-32
        window.onresize =()=> {
          this.tabHeight=this.$refs.content.offsetHeight-32
        };
      })
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.organGBUserList.get(this.filter, {
          loadingMaskTarget: '.zhsq-boxWrapper'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row = {}) {
        this.title = !row.id ? '新增天网账号' : '编辑天网账号'
        this.model = cloneDeep(row)
        this.dialogFormVisible = true
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              const user = JSON.parse(sessionStorage.getItem('user'));
              this.model.accountType = '1';
              this.model.status = true;
              this.model.userId = user.id;
              this.model.organCode = "";
                await Api.addOrganGBUser.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                }).catch(err => {
                  this.loading = false
                  throw err
                })
            } else {
              await Api.modifyOrganGBUser.put(this.model, {
                pathParams: {
                  id: this.model.id
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
              }).catch(err => {
                throw err
                this.loading = false
              })
            }
            this.loading = false
            this.dialogFormVisible = false
            this._fetchData();
          } else {
            const firstKey = keys(invalidFields)[0]
            this.firstErr = invalidFields[firstKey][0]
          }
        })
      },
      async syncRow(row) {
        const data = await Api.syncOrganGBUser.get({}, {
          pathParams: {
            id: row.id
          }
        }).then(res => {
          this.$message({message: '同步成功', type: 'success'})
          this._fetchData()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '同步失败!'
          })
        })
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteOrganGBUser.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchData()
          }).catch(() => {
            /*this.$message({
              type: 'error',
              message: '删除失败!'
            })*/
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
      //同步
      sync(row) {
        console.log(row);
        this.roleId = row.id
      }
    }
  };
</script>
<style lang="less">

</style>
