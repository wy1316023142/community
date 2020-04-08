<template>
  <div class="zhsq-innerBody oneThreeBox" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <p class="title">一标三实</p>
      <div class="flexItem text_r ">
        <div class="topSeachBox oneThree">
          <el-input type="text" placeholder="姓名" v-model="filter.name" clearable></el-input>
          <el-input placeholder="证件号" v-model="filter.identityNumber" clearable></el-input>
          <el-select v-model="filter.inHouseStatus" placeholder="人员状态" clearable>
            <el-option v-for="item in isHolderStrData"
                       :key="item.id"
                       :label="item.label"
                       :value="item.id"></el-option>
          </el-select>

          <el-select v-model="filter.villageId" placeholder="所在小区" @change="selectOption(1,filter.villageId)" clearable>
            <el-option v-for="item in villageListData"
                       :key="item.villageId"
                       :label="item.villageName"
                       :value="item.villageId"
                       @click="selectOption(1,item)"

            ></el-option>
          </el-select>
          <el-select v-model="filter.buildingId" placeholder="所在楼栋" @change="selectOption(2,filter.buildingId)"
                     clearable>
            <el-option v-for="item in buildingListData"
                       :key="item.buildingId"
                       :label="item.buildingName"
                       :value="item.buildingId"
                       @click="selectOption(2,item)"
            ></el-option>
          </el-select>
          <el-select v-model="filter.unitId" placeholder="所在单元" @change="selectOption(3,filter.unitId)" clearable>
            <el-option v-for="item in unitListData"
                       :key="item.unitId"
                       :label="item.unitName"
                       :value="item.unitId"
                       @click="selectOption(3,item)"
            ></el-option>
          </el-select>


          <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
          <el-button type="primary" size="small" @click="exportData()" v-allow="300903">导出</el-button>
          <el-popover placement="bottom" trigger="click">
            <el-date-picker style="margin: 0 5px" @change="changeDate" v-model="time1" type="daterange" range-separator="至" start-placeholder="登记开始日期" end-placeholder="登记结束日期"></el-date-picker>
            <el-date-picker style="margin: 0 5px" @change="changeOpenDoorDate" v-model="time2" type="daterange" range-separator="至" start-placeholder="最后开门开始日期" end-placeholder="最后开门结束日期"></el-date-picker>
            <el-date-picker style="margin: 0 5px" @change="changeLeaveDate" v-model="time3" type="daterange" range-separator="至" start-placeholder="离开开始日期" end-placeholder="离开结束日期"></el-date-picker>
            <el-button  style="margin-left: 10px;" type="primary" size="small"  slot="reference" @click="showSeachData = !showSeachData">高级搜索</el-button>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree :active-key="filter.organId" @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox realEntityTab">
              <el-table :data="tableData" style="width: 100%" stripe :height='tabHeight'
                        :max-height="tabHeight" @sort-change='sortthiscolumn'
                        :default-sort="{prop: 'date', order: 'descending'}"
              >
                <el-table-column label="序号" align='center' type="index"></el-table-column>
                <el-table-column prop="name" label="姓名" align='center'></el-table-column>
                <el-table-column prop="identityNumber" label="证件号" align='center'></el-table-column>
                <!-- <el-table-column prop="tel" label="手机号" align='center'>
                </el-table-column>
                <el-table-column prop="age" label="年龄" align='center'>

                </el-table-column>
                <el-table-column prop="sexStr" label="性别" align='center'></el-table-column>
                <el-table-column prop="nationName" label="民族" align='center'></el-table-column>
                <el-table-column prop="nativeProvince" label="籍贯" align='center'></el-table-column> -->
                <!-- <el-table-column prop="openDoorCount" label="出入次数" align='center'></el-table-column> -->
                <el-table-column prop="opendoorTime" label="最后开门时间" align='center' minWidth='150px'
                                 sortable='custom'></el-table-column>
                <el-table-column prop="personTypeStr" label="人员类型" align='center'></el-table-column>
                <el-table-column prop="createTime" label="登记时间" minWidth='130px' align='center'
                                 sortable='custom'></el-table-column>
                <el-table-column prop="address" label="住址" align='center' sortable='custom'></el-table-column>
                <el-table-column prop="isHolderStr" label="是否是业主" align='center' minWidth='100px'></el-table-column>
                <el-table-column prop="deleteTime" label="离开时间" align='center' width='100px'></el-table-column>
                <el-table-column prop="inHouseStatus" label="人员状态" align='center'>
                  <template slot-scope="scope">
                    <template v-if="scope.row.inHouseStatus=='4'">过期</template>
                    <template v-if="scope.row.inHouseStatus=='0'">正常</template>
                    <template v-if="scope.row.inHouseStatus=='3'">已离开</template>
                  </template>
                </el-table-column>

                <el-table-column label="操作" align='center' width='150px'>
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="300901">编辑</el-button>
                    <el-button type="primary" size="mini" @click="deleteRow(scope.row)" v-allow="300902">删除</el-button>
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


    <el-dialog class="population-dialog" :close-on-click-modal="false" title="编辑" :visible.sync="dialogFormVisible"
               :modal-append-to-body='false' width="50%" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <h3><span>人员信息</span></h3>
        <el-row>


          <el-col :span="12">
            <div class="photoDiv">
              <!--编辑头像-->
              <el-col v-if="!!model.id" prop="imgStr">
                <el-form-item>
                  <div class='imgDiv'>
                    <span v-show='!!model.imgStr' @click='cancel()' class='el-icon-error'></span>
                    <img v-show='!!model.imgStr' :src="model.imgStr"/>
                    <div v-show='!model.imgStr'>
                      <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
                      <input ref='fileInput' type="file" accept="image/*" @change="handleUpload($event,model)"/>
                    </div>
                  </div>
                  <input type="hidden" v-if="false" v-model="model.imgStr"/>
                </el-form-item>
              </el-col>
              <el-col class="photoFont">
                <!-- <button  @click="onPickFile">选择文件</button> -->
                <el-button type="primary" size="mini" @click="onPickFile">选择文件</el-button>

                <p>照片拍摄要求：<br/>
                  <span>请确保拍摄的人脸照片为清晰的正脸照（不要上传仰头、低头、侧脸照），不要戴帽子、墨镜类影响面部识别的物品</span></p>
                <p>尺寸要求：<br/>
                  <span>建议长宽3:4，不小于100PX，JPG、PNG、GIF格式</span>
                </p>
              </el-col>

            </div>


            <el-col>
              <el-form-item label="民族：" prop="nationName">
                <el-select v-model="model.nationName" placeholder="请选择">
                  <el-option v-for="(item,i) in nationName" :key="i"
                             :label="item.label"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="政治面貌：">
                <el-select v-model="model.political" placeholder="请选择">
                  <el-option v-for="item in political"
                             :key="item.id"
                             :label="item.label"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="职务：">
                <el-select v-model="model.post" placeholder="请选择">
                  <el-option v-for="item in post"
                             :key="item.id"
                             :label="item.label"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <div>
              <el-col>
                <el-form-item label="姓名：" prop="name">
                  <el-input autocomplete="off" v-model="model.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="身份证号码：" prop="identityNumber">
                  <el-input autocomplete="off" v-model="model.identityNumber" @blur="handleInputConfirm"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="手机号码：" prop="tel">
                  <el-input autocomplete="off" v-model="model.tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="性别：">
                  <el-input autocomplete="off" v-model="sex" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="年龄：">
                  <el-input autocomplete="off" v-model="age" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="学历水平：">
                  <el-select v-model="model.education" placeholder="请选择">
                    <el-option v-for="item in education"
                               :key="item.id"
                               :label="item.label"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="籍贯：" prop="nativeCity">
                  <el-cascader :options="options" v-model="nativeCity" @change="handleArea"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="人员类型：">
                  <el-select v-model="model.personType" placeholder="请选择" multiple>
                    <el-option v-for="item in personType"
                               :key="item.id"
                               :label="item.label"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>

          </el-col>
        </el-row>
        <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
        <h3 class="flex">
          <span>居住信息</span>
          <span class="flexItem text_r" @click="addLive">+新增一个居住信息</span>
        </h3>
        <el-row class="population-dialog-box" v-for="(item,index) in populationHouses" :key="index">
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="所属小区：">
              <el-input v-model="item.orgName" autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="所属单元：">
              <el-input v-model="item.unitName" autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="所属楼层：">
              <el-input v-model="item.inFloorNum" autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="门牌号：">
              <el-input v-model="item.houseCode" autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="人口类型：">
              <el-select v-model="item.liveType" placeholder="请选择" disabled>
                <el-option v-for="item in liveType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="住户类型：">
              <el-select v-model="item.poType" placeholder="请选择" disabled>
                <el-option v-for="item in poType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="是否业主：">
              <el-select v-model="item.isHolder" placeholder="请选择" disabled>
                <el-option v-for="item in isHolderType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

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
  import OrganTree from '../../components/OrganTree.vue'
  import {
    provinceAndCityData,
    CodeToText,
    TextToCode
  } from "element-china-area-data";
  import {residentialCompanyType} from '../../commom/filter.js'
  import moment from 'moment'
  import {validateIdCard, validatePhone} from "../../commom/validator";

  export default {
    name: 'checkOutRecurd',
    components: {OrganTree},
    data() {
      return {
        time1: '',
        time2: '',
        time3: '',
        dialogFormVisible: false,
        tabHeight: '0',
        addDialogFormVisible: false,
        addDialogFormTitle: '',
        tableData: [],
        factoryType: [],
        model: {},
        total: 0,
        populationHouses: [],
        nativeCity: [],

        filter: {
          villageId: '',
          villageName: '',
          buildingId: '',
          buildingName: '',
          unitId: '',
          unitName: '',
          organId: '',
          page: 1,
          rows: 10,
          name: null,
          companyType: null,
        },
        isHolderType: [{id: 0, label: "是"}, {id: 1, label: "否"}],
        sex: "",
        age: "",
        sexData: [{id: 0, label: "男"}, {id: 1, label: "女"}],
        firstErr: null,
        loading: false,
        villageListData: [],
        buildingListData: [],
        unitListData: [],
        options: provinceAndCityData,

        nationName: [
          {id: "汉族", label: "汉族"},
          {id: "维吾尔族", label: "维吾尔族"},
          {id: "回族", label: "回族"},
          {id: "哈萨克族", label: "哈萨克族"},
          {id: "蒙古族", label: "蒙古族"},
          {id: "柯尔克孜族", label: "柯尔克孜族"},
          {id: "乌孜别克族", label: "乌孜别克族"},
          {id: "俄罗斯族", label: "俄罗斯族"},
          {id: "锡伯族", label: "锡伯族"},
          {id: "藏族", label: "藏族"},
          {id: "苗族", label: "苗族"},
          {id: "彝族", label: "彝族"},
          {id: "壮族", label: "壮族"},
          {id: "布依族", label: "布依族"},
          {id: "朝鲜族", label: "朝鲜族"},
          {id: "满族", label: "满族"},
          {id: "侗族", label: "侗族"},
          {id: "瑶族", label: "瑶族"},
          {id: "白族", label: "白族"},
          {id: "土家族", label: "土家族"},
          {id: "哈尼族", label: "哈尼族"},
          {id: "傣族", label: "傣族"},
          {id: "黎族", label: "黎族"},
          {id: "傈僳族", label: "傈僳族"},
          {id: "佤族", label: "佤族"},
          {id: "畲族", label: "畲族"},
          {id: "高山族", label: "高山族"},
          {id: "拉祜族", label: "拉祜族"},
          {id: "水族", label: "水族"},
          {id: "东乡族", label: "东乡族"},
          {id: "纳西族", label: "纳西族"}
        ],
        liveType: [
          {id: 1, label: "户籍人口"},
          {id: 2, label: "常住人口"},
          {id: 3, label: "流动人口"}
        ],
        tenantType: [
          {id: 1, label: "在租租客"},
          {id: 2, label: "过期租客"},
        ],
        isHolderStrData: [
          {id: 4, label: "过期"},
          {id: 0, label: "正常"},
          {id: 3, label: "已离开"},
        ],
        personType: [
          {id: 1, label: "独居老人"},
          {id: 2, label: "上访人员"},
          {id: 3, label: "刑释人员"},
          {id: 4, label: "社区矫正"},
          {id: 5, label: "重点关注人员"}
        ],
        post: [
          {id: 0, label: "务农"},
          {id: 1, label: "公职"},
          {id: 2, label: "经商"},
          {id: 3, label: "务工"},
          {id: 4, label: "上学"},
          {id: 5, label: "退休"},
          {id: 6, label: "宗教教职"}
        ],
        education: [
          {id: 0, label: "高中"},
          {id: 1, label: "中专"},
          {id: 2, label: "大专"},
          {id: 3, label: "大学本科"},
          {id: 4, label: "研究生"},
          {id: 5, label: "初中以下"},
          {id: 6, label: "文盲或半文盲"}
        ],
        political: [
          {id: 0, label: "群众"},
          {id: 1, label: "团员"},
          {id: 2, label: "党员"}
        ],
        rules: {
          country: [
            {
              required: true,
              message: "请选择国籍",
              trigger: "blur"
            }
          ],
          imgStr: [
            {
              required: true,
              message: "请上传头像",
              trigger: "blur"
            }
          ],
          name: [
            {
              required: true,
              message: "请填写姓名",
              trigger: "blur"
            }
          ],
          identityNumber: [
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
          tel: [
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
          ],
          nativeCity: [
            {
              required: true,
              message: "请选择籍贯",
              trigger: "blur"
            }
          ],
          nationName: [
            {
              required: true,
              message: "请选择民族",
              trigger: "blur"
            }
          ]
        },
        showSeachData: false,

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
      this.filter.orgId = JSON.parse(sessionStorage.getItem("user")).organId;

      this._fetchData()
      this._fetchVillageCascadeData()
    },
    methods: {
      showSeachBox() {
        this.showSeachData = !this.showSeachData
      },
      sortthiscolumn(column) {
        if (column.prop == "opendoorTime") {
          this.filter.sort = '1'
        } else if (column.prop == "createTime") {
          this.filter.sort = '3'
        } else {
          this.filter.sort = '2'
        }
        // column.prop == "opendoorTime" ? (this.filter.sort = '1') : (this.filter.sort = '2');
        if (column.order) {
          column.order == "ascending" ? (this.filter.sortType = 'asc') : (this.filter.sortType = 'desc');
        } else {
          this.filter.sortType = ''
        }
        this._fetchData()
      },
      selectOption: function (type, id) {
        if (1 == type) {
          this.buildingListData = [];
          this.unitListData = [];
          this.filter.organId = id
          this.filter.unitId = '';
          this.filter.buildingId = ''
          this.villageListData.filter((item, index) => {
            if (item.villageId == id) {
              this.filter.villageName = item.villageName;
              this.buildingListData = item.buildings;
            }
          })
        } else if (2 == type) {
          this.unitListData = [];
          // this.filter.buildingId=''
          this.filter.unitId = '';
          this.buildingListData.filter((item, index) => {
            if (item.buildingId == id) {
              this.filter.buildingName = item.buildingName;
              this.unitListData = item.units;
            }
          })
        } else if (3 == type) {
          this.unitListData.filter((item, index) => {
            if (item.unitId == id) {
              this.filter.unitName = item.unitName;
            }
          })
        }
      },
      // 小区级联数据 小区-楼栋-单元
      _fetchVillageCascadeData: debounce(async function () {
        const data = await Api.getVillageCascadeList.get({}).then(data => data.data.result)
        this.villageListData = data || []
        // this.buildingListData = this.villageListData[0].buildings;
        // this.unitListData = this.buildingListData[0].units;
        // this.filter.unitId = this.unitListData[0].unitId;
      }, 100),
      _fetchData: debounce(async function () {
        const data = await Api.oneThreeList
          .get(this.filter, {
            loadingMaskTarget: ".tableShow"
          })
          .then(res => res.data);
        if (data.result.records.length > 0) {
          for (var i = 0; i < data.result.records.length; i++) {
            var ss = data.result.records[i].identityNumber;
            var str1 = ss.replace(/(\d{3})(\d+)(\d{3})/, function (x, y, z, p) {
              var i = "";
              while (i.length < z.length) {
                i += "*";
              }
              return y + i + p;
            });
            data.result.records[i].identityNumber = str1;
          }
        }
        this.tableData = data.result.records;
        this.total = data.result.total
        // thi.filter.
      }, 100),
      //通过身份证获取信息
      handleInputConfirm() {
        let identityCard = this.model.identityNumber + "";
        var sexNum = parseInt(identityCard.substring(16, 17));
        if (identityCard.length == 15) {
          sexNum = parseInt(identityCard.substring(13, 14));
        }
        if (!window.isNaN(sexNum)) {
          if (sexNum % 2 == 0) this.sex = "女";
          else this.sex = "男";
        }
        let len = identityCard.length;
        let strBirthday = "";
        if (len == 18) {
          //处理18位的身份证号码从号码中得到生日和性别代码
          strBirthday =
            identityCard.substr(6, 4) +
            "/" +
            identityCard.substr(10, 2) +
            "/" +
            identityCard.substr(12, 2);
        } else if (len == 15) {
          strBirthday =
            "19" +
            identityCard.substr(6, 2) +
            "/" +
            identityCard.substr(8, 2) +
            "/" +
            identityCard.substr(10, 2);
        } else {
          return false;
        }
        //时间字符串里，必须是“/”
        let birthDate = new Date(strBirthday);
        let nowDateTime = new Date();
        let age = nowDateTime.getFullYear() - birthDate.getFullYear();
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (
          nowDateTime.getMonth() < birthDate.getMonth() ||
          (nowDateTime.getMonth() == birthDate.getMonth() &&
            nowDateTime.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        this.age = age;
      },
      //添加居住信息
      addLive() {
        this.model.populationHouses.push({
          houseId: "",
          liveType: "",
          poType: "",
          orgId: "",
          orgName: "",
          visible: false,
          unitId: "",
          floorId: "",
          isHolder: 1
        });
      },
      editRow(row = {
        orgId: "",
        imgStr: "",
        imgType: "",
        name: "",
        identityNumber: "",
        age: "",
        tel: "",
        sex: "",
        nationName: "",
        political: "",
        education: "",
        post: "",
        nativeProvince: "",
        nativeCity: "",
        personType: [],
        poType: [{id: 1, label: "住户"}, {id: 2, label: "租客"}],
        populationHouses: [
          {
            houseId: "",
            liveType: "",
            poType: "",
            orgId: "",
            orgName: "",
            visible: false,
            unitId: "",
            floorId: "",
            isHolder: 1
          }
        ]
      }) {
        Api.getPopulationById
          .get(
            {},
            {
              pathParams: {
                orgId: this.filter.orgId,
                id: row.id
              }
            }
          )
          .then(res => {

            this.editFileList = [];
            this.dialogFormVisible = true;
            this.populationHouses = res.data.result.populationHouses;
            this.model = res.data.result;
            if (this.model.picImages.length > 0) {
              this.edited = "1";
              for (let i = 0; i < this.model.picImages.length; i++) {
                var arrPic = {};
                arrPic.name = this.model.picImages[i].id;
                arrPic.url = this.model.picImages[i].path;
                this.editFileList.push(arrPic);
              }
              this.model.picImages = [];
            }

            this.age = res.data.result.age;
            res.data.result.sex == 0 ? (this.sex = "男") : (this.sex = "女");
            if (res.data.result.personType) {
              let personType = res.data.result.personType.split(",");
              this.model.personType = personType.map(Number);
            } else {
              this.model.personType = [];
            }
            this.model.populationHouses = [];
            this.model.imgStr = res.data.result.photoPath;
            this.nativeCity = [];
            let nativeCity =
              TextToCode[res.data.result.nativeProvince][
                res.data.result.nativeCity
                ].code;
            let nativeProvince =
              TextToCode[res.data.result.nativeProvince].code;
            this.nativeCity = [nativeProvince, nativeCity];
          });
      },
      handleUpload(e, model) {
        const files = e.target.files;
        this.model.imgType = files[0].name;
        getBase64(files[0]).then(res => {
          let imgStr = res;
          if (model) {
            Api.editPersonPic
              .put(
                {
                  imgStr: res.substring(23),
                  imgType: this.model.imgType
                },
                {
                  pathParams: {
                    personId: model.id
                  }
                }
              )
              .then(res => {
                this.model.imgStr = imgStr;
              });
          } else {
            this.model.imgStr = imgStr;
          }
        });
        e.target.value = "";
      },
      //省，市选择
      handleArea(val) {
        this.model.nativeProvince = CodeToText[val[0]];
        this.model.nativeCity = CodeToText[val[1]];
      },
      //取消头像
      cancel() {
        this.model.imgStr = "";
      },
      //提交
      async submit() {

        this.$refs.form.validate(async (valid, invalidFields) => {
          if (valid) {
            if (this.model.personType) {
              this.model.personType = this.model.personType.join(",");
            }
            this.firstErr = null;
            this.loading = true;

            let model = cloneDeep(this.model);
            delete model.imgStr;
            this.model.populationHouses.map(item => {
              if (item.houseId == "") {
                this.$message({message: "请完善居住信息", type: "error"});
                return false;
              }
            });
            await Api.editPopulation
              .put(model, {
                pathParams: {
                  personId: this.model.id
                }
              })
              .then(() => {
                this.$message({message: "编辑成功", type: "success"});
                this.loading = false;
                this.dialogFormVisible = false;
                this._fetchData();
              })
              .catch(() => {
                this.loading = false;
              });

          } else {
            const firstKey = keys(invalidFields)[0];
            this.firstErr = invalidFields[firstKey][0];
          }
        });
      },
      async deleteRow(row) {
        this.$confirm(`确定删除吗？`, "提示", {
          type: "warning"
        })
          .then(async () => {
            const data = await Api.removePerson
              .delete({},
                {
                  pathParams: {
                    houseId: row.houseId,
                    personId: row.id
                  }
                }
              )
              .then(res => {
                this.$message({message: "删除成功", type: "success"});
                this._fetchData();
              })
              .catch(() => {
              });
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
      //左侧机构数点击
      orgNodeClick([item = {}]) {
        if (item.organType == 2) {
          this.filter = {
            villageId: '',
            villageName: '',
            buildingId: '',
            buildingName: '',
            unitId: '',
            unitName: '',
            organId: '',
            page: 1,
            rows: 10,
            name: null,
            companyType: null,
          }
        }
        this.filter.organId = item.id || "";
        this.filter.orgId = item.id || "";
        // this.action = myConfig.baseUrl + "/business/population/import/" + this.filter.orgId;
        this._fetchData();
      },
      //上传头像
      onPickFile() {
        this.$refs.fileInput.click();
      },
      changeDate(val) {
        if (val) {
          this.filter.beginTime = moment(val[0]).format('YYYY-MM-DD')
          this.filter.endTime = moment(val[1]).format('YYYY-MM-DD')
        } else {
          this.filter.beginTime = ''
          this.filter.endTime = ''
        }
        // item.effectiveTime=moment(item.effectiveTime).format('YYYY-MM-DD')

      },
      changeOpenDoorDate(val) {
        if (val) {
          this.filter.caputeStartTime = moment(val[0]).format('YYYY-MM-DD')
          this.filter.caputeEndTime = moment(val[1]).format('YYYY-MM-DD')
        } else {
          this.filter.caputeStartTime = ''
          this.filter.caputeEndTime = ''
        }

      },
      changeLeaveDate(val) {
        if (val) {
          this.filter.deleteStartTime = moment(val[0]).format('YYYY-MM-DD')
          this.filter.deleteEndTime = moment(val[1]).format('YYYY-MM-DD')
        } else {
          this.filter.deleteStartTime = ''
          this.filter.deleteEndTime = ''
        }
      },
      exportData() {
        var organId, buildingId, unitId
        buildingId = ''
        unitId = ''
        organId = `organId=${this.filter.organId}`
        if (this.filter.villageId) {
          organId = `organId=${this.filter.villageId}`
        }
        if (this.filter.buildingId) {
          buildingId = `&buildingId=${this.filter.buildingId}`
        }
        if (this.filter.unitId) {
          unitId = `&unitId=${this.filter.unitId}`
        }
        window.open(`${myConfig.baseUrl}/business/openDoorRecord/exportXls?${organId}${buildingId}${unitId}`)

      }
    }
  };
</script>
<style lang="less">
  .oneThree {
    padding-bottom: 5px;
    .el-input {
      width: 98px !important;
    }
  }

  .bottomSeachBox {
    margin-top: 3px;
    margin-bottom: 5px;
    .el-input__inner {
      /*width: 276px;*/
    }
  }

  .realEntityTab {
    .el-button + .el-button {
      margin-top: 2px;
    }
  }

  .zhsq-main .zhsq-innerBody .el-dialog__body .el-form-item__label {
    width: 125px !important;
  }

  .passportImg {
    width: 100%;
    overflow: hidden;
    height: 154px;
  }

  .bigImgShow {
    width: 300px;
    height: 300px;
  }

  .photoDiv {
    height: 350px;
    width: 90%;
    margin-bottom: 20px;
    margin-left: 10%;
    background: #f2f6fd;
    color: #9879e1;
    display: flex;

    // background-position: 20px 20px
  }

  .photoDiv button {
    width: 100px;
    height: 30px;
    color: #fff;
    background: #2f59c0;
    border-radius: 4px;
  }

  .photoFont {
    margin: 20px 20px 20px 0;
  }

  .photoFont p {
    color: #9879e1;
    font-size: 16px;
    margin-top: 30px;
  }

  .photoFont p span {
    font-size: 12px;
    color: #a5a9af;
    margin-top: 10px;
  }

  .zhsq-main .imgDiv {
    height: 280px;
    width: 205px;
    margin: 20px;
    border: none;
    background: url("../../assets/images/photo.png") no-repeat;
  }

  .zhsq-main .imgDiv img {
    width: 100%;
    height: 100%;
  }

  // .avatar-uploader-icon{
  //   margin-top:35%;
  //   margin-left: 40%
  // }
  .input {
    position: relative;
  }

  .font {
    font-size: 14px;
    color: red;
    position: absolute;
    top: 14px;
    left: 28px;
  }

  .font-houseId {
    position: absolute;
    top: 14px;
    left: 42px;
  }

  .changeDate {
    .el-form-item__label {
      margin-left: -4px;
    }
  }


</style>
