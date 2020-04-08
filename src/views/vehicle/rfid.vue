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
      <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
        <el-table-column prop="sort"  label="排序" align='center'></el-table-column>
        <el-table-column prop="id" label="ID" align='center'></el-table-column>
        <el-table-column prop="coding" label="编码" align='center'></el-table-column>
        <el-table-column prop="name" label="名称" align='center'></el-table-column>
        <el-table-column  label="操作" align='center'>
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit-outline" circle   @click="editRow(scope.row)"></el-button>
            <el-button type="danger"  size="mini" icon="el-icon-delete" circle @click="deleteRow(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox">
        <el-pagination background layout="prev, pager, next, total" :total="50" :page-size=10></el-pagination>
      </div>
    </div>


    <el-dialog :title="title" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' width="470px">

      <el-form>
        <el-form-item label="结构类型名称：">
          <el-input  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结构类型编码：">
          <el-input  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序：" >
          <el-input  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: 'rfid',//
    data() {
      return {
        tabHeight:'0',
        dialogFormVisible:false,
        title:'机构类型',
        tableData: [],
        model:[]
      }
    },
    mounted(){
      //table高度
      this.$nextTick(() => {
        this.tabHeight=this.$refs.innerBody.offsetHeight-138
        window.onresize =()=> {
          this.tabHeight=this.$refs.innerBody.offsetHeight-138
        };
      })
    },
    methods: {

      editRow(row={}){
        this.title = row ? '新增机构类型' : '编辑机构类型'
        this.dialogFormVisible = true
      },
    },
  };
</script>
<style lang="less">

</style>
