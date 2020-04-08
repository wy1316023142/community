<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">角色管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="角色名" v-model="filter.name" clearable></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="10001001">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper" ref="content">
      <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
        <el-table-column type="index" label="序号" align='center'></el-table-column>
        <el-table-column prop="name" label="角色名" align='center'></el-table-column>
        <el-table-column prop="remark" label="备注" align='center'></el-table-column>
        <el-table-column prop="seq" label="排序" align='center'></el-table-column>
        <el-table-column label="操作" align='center' width="220">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="10001002">编辑</el-button>
            <el-button type="primary" size="mini" @click="authorization(scope.row)"  v-allow="10001004">授权</el-button>
            <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="10001003">删除</el-button>
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
        <el-form-item label="角色名：" prop="name">
          <el-input autocomplete="off" v-model="model.name" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="seq">
          <el-input autocomplete="off" v-model="model.seq" type="number"  maxLength="2"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input autocomplete="off" type="textarea" :rows="4" placeholder="请输入内容" maxLength="128"
                    v-model="model.remark"></el-input>
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
               :close-on-press-escape="false" :modal-append-to-body='false' width="500px" class="authorization-dialog">
      <el-tree ref="permissionsTree" :data="permissionsData" node-key="id" :props="defaultProps" highlight-current show-checkbox
               :default-expanded-keys="activePermissionsData" :check-strictly="true" @check="clickDeal">
       <!-- <div class="custom-tree-node" slot-scope="{ node, data }">
          <span class="el-tree-node__label">{{ data.name }}</span>
          <el-checkbox v-model="node.checked"></el-checkbox>
        </div>-->
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorizationFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuthorization" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys, cloneDeep} from 'lodash'
  import {validateBlackSpace, validateNumber} from '../../commom/validator'

  export default {
    name: 'role',
    data() {
      return {
        activePermissionsData: [],
        permissionsData: [],
        loading: false,
        tabHeight: '0',
        dialogFormVisible: false,
        authorizationFormVisible: false,
        title: '角色',
        tableData: [],
        model: [],
        firstErr: [],
        total: 0,
        filter: {
          page: 1,
          rows: 10,
          name: null,
        },
        rules: {
          name: [{
            required: true,
            message: '请填写角色名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '名称不能有空格',
            trigger: 'blur'
          }],
          seq: [{
            required: true,
            message: '请填排序',
            trigger: 'blur'
          },{
            validator: validateNumber,
            min: 1,
            max: 99,
            message: '长度在 1 到 99 个之间',
            trigger: 'blur'
          }]
        },
        defaultProps: {
          children: 'chil',
          //label: 'name'
          label:  (data, node)=>{
            if(data.id == 8 || data.id == 9)
              return data.name + "-" + data.remark
            return data.name
          }
        },
        roleId: 0
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
        const data = await Api.roleList.get(this.filter, {
          loadingMaskTarget: '.zhsq-boxWrapper'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row = {}) {
        this.title = !row.id ? '新增角色' : '编辑角色'
        this.model = cloneDeep(row)
        this.dialogFormVisible = true
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addRole.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.dialogFormVisible = false
                  this._fetchData();
                }).catch(err => {
                })
            } else {
              await Api.modifyRole.put(this.model, {
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
          const data = await Api.deleteRole.delete({}, {
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
      clickDeal(currentObj, treeStatus) {
        // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
        let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
        // 选中
        if (selected !== -1) {
          // 子节点只要被选中父节点就被选中
          this.selectedParent(currentObj)
          // 统一处理子节点为相同的勾选状态
          this.uniteChildSame(currentObj, true)
        } else {
          // 未选中 处理子节点全部未选中
          if (currentObj.chil&&currentObj.chil.length !== 0) {
            this.uniteChildSame(currentObj, false)
          }
        }
      },
      // 统一处理子节点为相同的勾选状态
      uniteChildSame (treeList, isSelected) {
        this.$refs.permissionsTree.setChecked(treeList.id, isSelected)
        if(treeList.chil&&treeList.chil.length!==0){
          for (let i = 0; i < treeList.chil.length; i++) {
            this.uniteChildSame(treeList.chil[i], isSelected)
          }
        }

      },
      // 统一处理父节点为选中
      selectedParent (currentObj) {
        let currentNode = this.$refs.permissionsTree.getNode(currentObj)
        if (currentNode.parent.key !== undefined) {
          this.$refs.permissionsTree.setChecked(currentNode.parent, true)
          this.selectedParent(currentNode.parent)
        }
      },
      //授权
      authorization(row) {
        this.roleId = row.id
        this.permissionsData = [];
        this.activePermissionsData = [];
        const getRolePermissionsTree = Api.getRolePermissionsTree.get({})
        const getRolePermissions = Api.getRolePermissions.get({}, {
          pathParams: {
            id: row.id
          }
        })
        Promise.all([getRolePermissionsTree, getRolePermissions]).then(([res1, res2]) => {
          this.permissionsData = res1.data.result;
          this.activePermissionsData = res2.data.result;
          this.authorizationFormVisible = true;
          this.$nextTick(() => {
            this.$refs.permissionsTree.setCheckedKeys(res2.data.result)
          })
        })
      },
      submitAuthorization() {
        const checkedNodes = this.$refs.permissionsTree.getCheckedKeys()
        this.loading = true
        Api.rolePermissions.put({resourceIdSet: checkedNodes}, {pathParams: {id: this.roleId}}).then(() => {
          this.loading = false
          this.authorizationFormVisible = false
          this.$message({message: '授权成功', type: 'success'})
        }).catch(err => {
          this.loading = false
        })
      },
    },
  };
</script>
<style lang="less">

</style>
