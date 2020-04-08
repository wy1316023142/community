<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">居民车辆管理</p>
      <div class="flexItem text_r">
        <el-input type="text" placeholder="车牌号" v-model="filter.licenseNumber"></el-input>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" v-allow="600200101">新增</el-button>
        <el-button type="primary" size="small" @click="importFormVisible = true">导入</el-button>
        <el-button type="primary" size="small" ><a :href="templateUrl">下载模板</a></el-button>
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
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column prop="organName"  label="所属机构" align='center'></el-table-column>
                <el-table-column prop="licenseNumber" label="车牌号" align='center'></el-table-column>
                <el-table-column prop="vehicleOwnerName" label="车主" align='center'></el-table-column>
                <el-table-column prop="vehicleOwnerPhone" label="联系电话" align='center'></el-table-column>
                <el-table-column prop="colorName" label="颜色" align='center'></el-table-column>
                <el-table-column prop="vehicleTypeName" label="车辆类型" align='center'></el-table-column>
                <el-table-column  label="操作" align='center' width="150">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini"    @click="editRow(scope.row)" v-allow="600200102">编辑</el-button>
                    <el-button type="danger"  size="mini"  @click="deleteRow(scope.row)" v-allow="600200103">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.page' :current-page='filter.rows'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--新增编辑-->
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible"   :modal-append-to-body='false' :close-on-click-modal="false" width="470px" >
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <el-form-item label="车牌号：" prop="licenseNumber">
          <el-input  autocomplete="off" v-model="model.licenseNumber"  maxLength="8"></el-input>
        </el-form-item>
        <el-form-item label="颜色：" prop="color">
          <el-select v-model="model.color" placeholder="请选择">
            <el-option v-for="item in colorType"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="车辆类型：" prop="vehicleType">
          <el-select v-model="model.vehicleType" placeholder="请选择">
            <el-option v-for="item in vehicleType"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停车位：" prop="parkingSpace">
          <el-input  autocomplete="off" v-model="model.parkingSpace"  maxLength="16"></el-input>
        </el-form-item>
        <el-form-item label="车主姓名：" prop="vehicleOwnerName">
          <el-input  autocomplete="off" v-model="model.vehicleOwnerName"  maxLength="5"></el-input>
        </el-form-item>

        <el-form-item label="车主性别：" prop="vehicleOwnerSex">
          <el-select v-model="model.vehicleOwnerSex" placeholder="请选择">
            <el-option v-for="item in sex"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车主电话：" prop="vehicleOwnerPhone">
          <el-input  autocomplete="off" v-model="model.vehicleOwnerPhone"  maxLength="11"></el-input>
        </el-form-item>
        <el-form-item label="车主证件号：" prop="vehicleOwnerNumber">
          <el-input  autocomplete="off" v-model="model.vehicleOwnerNumber"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
    <!--导入-->
    <el-dialog title="导入" :visible.sync="importFormVisible"   :modal-append-to-body='false' width="350px" >
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
    <el-dialog title="导入失败信息" :visible.sync="importVisible"   :modal-append-to-body='false' width="300px">
      <el-table :data="importData" style="width: 100%" stripe >
        <el-table-column prop="rowNumber" label="行数" align='center'></el-table-column>
        <el-table-column prop="errorMsg" label="错误信息" align='center'></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '../../commom/api.js'
  import { debounce ,keys, cloneDeep } from 'lodash'
  import { validateIdCard ,validatePhone, validateBlackSpace } from '../../commom/validator'
  import OrganTree from '../../components/OrganTree.vue'
  import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component.vue";
  import { domHeightMixin } from '../../commom/mixins.js'
  export default {
    mixins: [ domHeightMixin ],
    name: 'nonMotorizedList',
    components: {
      ElDialog,
      OrganTree},
    data() {
      return {
        templateUrl:process.env.VUE_APP_VEHICLE_URL,
        action:process.env.VUE_APP_API_HOST+'/business/cvehicle/import',
        importVisible:false,
        importData:[],
        fileList:[],
        fileHeader:{},
        importFormVisible:false,
        dialogFormVisible:false,
        dialogFormTitle:'',
        tableData: [],
        model:{},
        total:0,
        filter: {
          organId: 0,
          page: 10,
          rows: 0,
          licenseNumber:''
        },
        firstErr:null,
        loading:false,
        sex:[
          {id: 0, label: '男'},
          {id: 1, label: '女'}
        ],
        colorType:[
          {id: 0, label: '未知'},
          {id: 1, label: '蓝色'},
          {id: 2, label: '黄色'},
          {id: 3, label: '白色'},
          {id: 4, label: '黑色'},
          {id: 5, label: '绿色'},
        ],
        vehicleType:[
          {id: 0, label: '未知车牌'},
          {id: 1, label: '蓝牌小汽车'},
          {id: 2, label: '黑牌小汽车'},
          {id: 3, label: '单排黄牌'},
          {id: 4, label: '双排黄牌'},
          {id: 5, label: '警车车牌'},
          {id: 6, label: '武警车牌'},
          {id: 7, label: '个性化车牌'},
          {id: 8, label: '单排军车牌'},
          {id: 9, label: '双排军车牌'},
          {id: 10, label: '使馆车牌'},
          {id: 11, label: '香港进出中国大陆车牌'},
          {id: 14, label: '澳门进出中国大陆车牌'},
          {id: 12, label: '农用车牌'},
          {id: 13, label: '教练车牌'},
          {id: 15, label: '双层武警车牌'},
          {id: 16, label: '武警总队车牌'},
          {id: 17, label: '双层武警总队车牌'},
        ],
        rules: {
          licenseNumber: [{
            required: true,
            message: '请填写车牌号',
            trigger: 'blur'
          }, {
            validator: validateBlackSpace,
            message: '请填写车牌号',
            trigger: 'blur'
          }],
          vehicleType: [{
            required: true,
            message: '请选择车辆类型',
            trigger: 'blur'
          }],
          color: [{
            required: true,
            message: '请选择颜色',
            trigger: 'blur'
          }],
          vehicleOwnerName: [{
            required: true,
            trigger: 'blur',
            message: '请填写车主姓名'
          }],
          vehicleOwnerSex: [{
            required: true,
            message: '请填写车主信息',
            trigger: 'blur'
          }],
          vehicleOwnerPhone: [{
            required: true,
            message: '请填写车主电话',
            trigger: 'blur'
          }, {
            validator: validatePhone,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }],
          parkingSpace: [{
            required: true,
            message: '请输入停车位',
            trigger: 'blur'
          }]
        }
      }
    },
    mounted(){
      console.log(1234)
      this.fileHeader={
        'Authorization' : 'Bearer ' + sessionStorage.getItem("token")
      }
      this.filter.organId=JSON.parse(sessionStorage.getItem('user')).organId;
      this._fetchData();

    },
    methods: {
      _fetchData: debounce(async function() {
        const data = await Api.vehicleList.post(this.filter, {
            loadingMaskTarget: '.tableBox'
          }).then(res => res.data)
        this.tableData = data.rows
        this.total = data.total
      }, 100),
      editRow(row={}){
        this.dialogFormTitle = !row.id ? '新增' : '编辑'
        this.dialogFormVisible = true
        row.organId = this.filter.organId;
        this.model=cloneDeep(row)
      },
      async submit() {
        this.$refs.form.validate(async(valid, invalidFields) => {
          if (valid) {
            this.firstErr = null
            this.loading = true
            await Api.addVehicle[this.model.id ? 'put' : 'post'](this.model)
              .then(()=>{
                if (this.model.id) {
                  this.$message({ message: '修改成功', type: 'success' })
                } else {
                  this.$message({ message: '新增成功', type: 'success' })
                }
                this.loading = false
                this.dialogFormVisible = false
                this._fetchData()
              }).catch(err => {
                this.loading = false
                throw err
              })

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
          const data = await Api.deleteVehicle.delete({}, {
            pathParams: {
              id: row.id
            }
          }).then(res => {
            this.$message({ message: '删除成功', type: 'success' })
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
        this.filter.rows = val-1;
        this._fetchData();
      },
      orgNodeClick([item = {}]){
        this.filter.organId = item.id || ''
        this._fetchData()
      },

      //上传文件前判断
      beforeUpload(file) {
        const isType = file.name.indexOf('.xls')!=-1 ||  file.name.indexOf('.xlsx')!=-1
        const isLimit = file.size / 1024 / 1024 < 5;
        if (!isType) {
          this.$message.error('文件格式只能是 xls或xlsx 格式!');
        }
        if (!isLimit) {
          this.$message.error('文件大小不能超过 5MB!');
        }
        return isType && isLimit;
      },
      //上传
      submitUpload() {
        this.fileLoading=true;
        this.$refs.upload.submit();
      },
      //上传成功
      fileSuccess(res, file, fileLis){
        console.log(res);
        this.fileList=[]
        if(res.code==0){
          this.$message.info(res.msg);
          this._fetchData();
          this.importFormVisible=false
          if(res.rows.length!==0){
            this.importData=res.rows
            this.importVisible=true
          }
        }else {
          this.$message.error(res.msg);

        }
      },
      //上传失败
      onRrror(err, file, fileList){
        this.$message.error(err);
      }


    },
  };
</script>
<style lang="less">

</style>
