<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">机构类型管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="editRow()">新增</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <div class="tableBox">
        <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight' :max-height="tabHeight">
          <el-table-column type="index" label="序号" align='center'></el-table-column>
          <el-table-column prop="typeName" label="名称" align='center'></el-table-column>
          <el-table-column prop="organTypeCode" label="编码" align='center'></el-table-column>
          <el-table-column prop="sortNo" label="排序" align='center'></el-table-column>
          <el-table-column label="操作" align='center'>
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit-outline" circle
                         @click="editRow(scope.row)"></el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" circle
                         @click="deleteRow(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pageBox">
          <el-pagination @current-change="pageChange" background layout="prev, pager, next, total" :total='total'
                         :page-size='filter.rows' :current-page='filter.page'></el-pagination>
        </div>
      </div>
    </div>


    <el-dialog :title="title" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
               :close-on-press-escape="false" :modal-append-to-body='false' width="470px">

      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="结构类型名称：" prop="typeName">
          <el-input autocomplete="off" v-model="model.typeName"></el-input>
        </el-form-item>
        <el-form-item label="结构类型编码：">
          <el-input autocomplete="off" v-model="model.organTypeCode"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sortNo">
          <el-input autocomplete="off" v-model="model.sortNo"></el-input>
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
    name: 'organizationType',
    data() {
      return {
        loading: false,
        tabHeight: '0',
        dialogFormVisible: false,
        title: '机构类型',
        tableData: [],
        model: [],
        firstErr: [],
        total: 0,
        filter: {
          page: 1,
          rows: 10,
        },
        rules: {
          typeName: [{
            required: true,
            message: '请填写机构类型名称',
            trigger: 'blur'
          },{
            validator: validateBlackSpace,
            message: '名称不能有空格',
            trigger: 'blur'
          }],
          sortNo: [{
            required: true,
            message: '请填排序',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight = this.$refs.innerBody.offsetHeight - 152
        window.onresize = () => {
          this.tabHeight = this.$refs.innerBody.offsetHeight - 152
        };
      })
      this._fetchData();
    },
    methods: {
      _fetchData: debounce(async function () {
        const data = await Api.organTypeList.get(this.filter, {
          loadingMaskTarget: '.tableShow'
        }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row = {}) {
        this.title = !row.id ? '新增机构类型' : '编辑机构类型'
        this.model = cloneDeep(row)
        this.dialogFormVisible = true
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.organTypeId) {
              await Api.addOrganType.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                }).catch(err => {
                  throw err
                  this.loading = false
                })
            } else {
              await Api.modifyOrganType.put(this.model, {
                pathParams: {
                  id: this.model.organTypeId
                }
              }).then(() => {
                this.$message({message: '修改成功', type: 'success'})
              }).catch(err => {
                throw err
                this.loading = false
              })
              this.loading = false
              this.dialogFormVisible = false
              this._fetchData();
            }
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
          const data = await Api.deleteOrganType.delete({}, {
            pathParams: {
              id: row.organTypeId
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
      }
    },
  };
</script>
<style lang="less">

</style>
