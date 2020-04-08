<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">sip服务管理</p>
      <div class="flexItem text_r">
        <el-button type="primary" size="small" @click="addDialogForm" v-allow="700100401">新增</el-button>
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
              <el-table :data="sipServerData" style="width: 100%" stripe :height='tabHeight'
                        :max-height="tabHeight">
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="serverName" label="名称" align='center'></el-table-column>
                <el-table-column prop="serverIp" label="IP地址" align='center'></el-table-column>
                <el-table-column prop="serverPort" label="端口" align='center'></el-table-column>
                <el-table-column label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="700100402">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="700100403">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination @current-change="pageChange" background
                               layout="prev, pager, next, total" :total='total'
                               :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 新增 -->
    <el-dialog :title="dialogFormTitle" :visible.sync="addDialogFormVisible"
               :close-on-press-escape="false" :modal-append-to-body='false' width="500px" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="名称：" prop="name">
          <el-input autocomplete="off" v-model="model.serverName" maxLength="32"></el-input>
        </el-form-item>
        <el-form-item label="IP地址：" prop="ip">
          <el-input autocomplete="off" v-model="model.serverIp" maxLength="20"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="account">
          <el-input autocomplete="off" v-model="model.serverPort" maxLength="32"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--  -->
  </div>

</template>

<script>
  import Api from '../../commom/api.js'
  import {debounce, keys} from 'lodash'
  import OrganTree from '../../components/OrganTree.vue'
  import {validateBlackSpace, validateIp} from '../../commom/validator'

  export default {
    name: 'sipManagement',
    components: {OrganTree},
    data() {
      return {
        selectionB:'true',
        dialogFormTitle: '',
        deviceName: '',
        tabHeight: '0',
        addDialogFormVisible: false,
        tableData: [],
        sipServerData: [],
        model: {},
        deviceList: [],
        deviceSelectMode: [],
        total: 0,
        organType: 1,
        filter: {
          organId: 1,
          communicationStatus: null,
          name: null,
          machineNumber: null,
          page: 1,
          rows: 10,
        },
        communicationStatus: [
          {id: 0, label: '正常'},
          {id: 1, label: '离线'}
        ],
        manufactorData: [],
        firstErr: null,
        loading: false,
        rules: {
          serverName: [{
            required: true,
            message: '请填写名称',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '名称不能有空格',
            trigger: 'blur'
          }],
        },
      }
    },

    mounted() {
      //table高度
      this.$nextTick(() => {
        this.tabHeight = this.$refs.content.offsetHeight - 56
        window.onresize = () => {
          this.tabHeight = this.$refs.content.offsetHeight - 56
        };
      })
      this.filter.organId = JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchSipServerData();
    },
    methods: {
      _fetchSipServerData: debounce(async function () {
        const data = await Api.pageSipServer.get(this.filter).then(res => res.data)
        this.sipServerData = data.rows
      }, 100),
      // 编辑
      editRow(row = {}) {
        console.log(row)
        this.deviceSelectMode=[];
        this.dialogFormTitle = '编辑';
        this.model = row;
        this.model.organId = this.filter.organId
        // 视频点位
        this.addDialogFormVisible = true
        this.videoPositionHide = true
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, '提示', {
          type: 'warning'
        }).then(async () => {
          const data = await Api.deleteSipServer.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({message: '删除成功', type: 'success'})
            this._fetchSipServerData()
          }).catch(() => {

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addDialogForm() {
        this.dialogFormTitle = '新增';
        this.model = {}
        this.model.organId = this.filter.organId
        this.addDialogFormVisible = true
      },
      async submit() {
        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            if (!this.model.id) {
              await Api.addSipServer.post(this.model)
                .then(() => {
                  this.$message({message: '新增成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchSipServerData();
                }).catch(err => {
                })
            } else {
              await Api.editSipServer.put(this.model)
                .then(() => {
                  this.$message({message: '修改成功', type: 'success'})
                  this.addDialogFormVisible = false
                  this._fetchSipServerData();
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
      pageChange(val) {
        this.filter.page = val;
        this._fetchSipServerData();
      },
      orgNodeClick([item = {}]) {
        this.organType = item.organType
        this.filter.organId = item.id || ''
        this._fetchSipServerData()
      },
    }
  };
</script>
<style lang="less">
  .videoBox {
    position: relative;

    .videoBoxInput {
      width: 90%;
    }

    .videoBoxImg {
      position: absolute;
      top: 30%;
      right: 0%
    }
  }

  thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }

  .videoTitle {
    display: flex
  }
</style>
