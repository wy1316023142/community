<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">居住人员超限告警</span>

      <div class="text_r flexItem">
        <el-select v-model="filter.numberStatus" placeholder="全部状态" clearable>
          <el-option v-for="item in AuditStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" v-show="btnVisible" @click="setBtn()">设置</el-button>
      </div>
    </div>
    <div class="zhsq-boxWrapper">
      <el-row :gutter="35" style="height: 100%">
        <el-col :span="5">
          <organ-tree  @node-click="orgNodeClick"></organ-tree>
        </el-col>
        <el-col :span="19">
          <div class="zhsq-right-con" ref="content">
            <div class="tableBox">
              <el-table :data="tableData" style="width: 100%" stripe  :height='tabHeight' :max-height="tabHeight" >
                <el-table-column label="序号" align='center'   type="index"></el-table-column>
                <el-table-column prop="houseAddress" label="房屋地址" align='center'></el-table-column>
                <el-table-column prop="houseStatus" label="房屋类型" align='center'>
                    <template slot-scope="scope">
                       <template v-if="scope.row.houseStatus=='2'">出租</template>
                       <template v-if="scope.row.houseStatus=='1'">居住</template>
                    </template>
                </el-table-column>
                <el-table-column prop="personNum" label="居住人口数" align='center'></el-table-column>
                <el-table-column prop="holderName" label="业主姓名" align='center'></el-table-column>
                <el-table-column prop="holderPhone" label="业主联系方式" align='center'></el-table-column>
                <el-table-column prop="numberStatus" label="状态" align='center'>
                      <template slot-scope="scope">
                       <template v-if="scope.row. numberStatus=='1'">异常</template>
                       <template v-if="scope.row. numberStatus=='0'">正常</template>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" align='center' width="250">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="seeDetailsBtn(scope.row)">查看详情</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row,1)" v-if="scope.row. numberStatus=='0'">标示异常</el-button>
                    <el-button type="primary" size="mini" @click="editRow(scope.row,0)" v-if="scope.row. numberStatus=='1'">标示正常</el-button>

                  </template>
                </el-table-column>
              </el-table>
              <div class="pageBox">
                <el-pagination   @current-change="pageChange" background layout="prev, pager, next, total" :total='total' :page-size='filter.rows' :current-page='filter.page'></el-pagination>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="population-dialog"  :close-on-click-modal="false" title="房屋居住人口限制人数设置" :visible.sync="transfiniteSetShow"  :modal-append-to-body='false' width="400px">
    <el-form>
         <el-form-item label='限制人数：'>
              <el-input autocomplete="off" v-model="number" maxLength="32"></el-input>
        </el-form-item>
    </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="transfiniteSetShow = false">取 消</el-button>
            <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog class="population-dialog"  :close-on-click-modal="false" title="房屋居住人口超限房屋详情" :visible.sync="transfiniteContentShow"  :modal-append-to-body='false' width="50%">
    <div class="transfiniteContentBox" style="height: 500px;overflow-y: auto">
        <div class="transfiniteContentTitle">
            <p>{{transfiniteContentTitle.houseAddress}}</p>
            <p>居住人数 : {{totalNumber}}</p>
            <p>业主 : {{transfiniteContentTitle.holderName}}</p>
            <p>联系方式 : {{transfiniteContentTitle.holderPhone}}</p>
        </div>

        <div class="transfiniteBox">
            <el-row>
            <el-col :span="12" v-for="item in list">
                <div class="transfiniteShowBox">
                    <div class="transfiniteImg">
                        <img :src="item.photoPath" alt="">
                    </div>
                    <div class="transfiniteText">
                        <p>姓名 : {{item.personName}}</p>
                        <p>性别 : {{item.sex==1?'女':'男'}}</p>
                        <p>住户类型 : {{item.liveType==2?'租客':'住户'}}</p>
                        <p>电话号码 : {{item.tel}}</p>
                        <p>身份证号 : {{item.identityNumber}}</p>
                    </div>
                </div>
            </el-col>

            </el-row>

        </div>
    </div>

    </el-dialog>
  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys } from "lodash";
import { validateIdCard, validatePhone } from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
export default {
  name: "openDoorRecord",
  components: { OrganTree },
  data() {
    return {
      btnVisible:JSON.parse(sessionStorage.getItem("user")).organType==2?true:false,
      loading: false,
      transfiniteSetShow:false,
      transfiniteContentShow:false,
      tabHeight: "0",
      tableData: [],
      transfiniteContentTitle:{},
      number: 15,
      list:{},
      total: 0,
      checked: false,
      totalNumber:'',
      AuditStatus:[
        {id: 0, label: '正常'},
        {id: 1, label: '异常'},
      ],
      filter: {
        page: 1,
        rows: 10,
        organId: 1,
      }
    };
  },
  mounted() {
    //table高度
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 56;
      window.onresize = () => {
        this.tabHeight = this.$refs.content.offsetHeight - 56;
      };
    });
    this.filter.organId = JSON.parse(sessionStorage.getItem("user")).organId;
    this._fetchData();
  },
  methods: {
    async submit(){
      const data = await Api.limitHouseNumConfig.put({},{
          pathParams:{
            organId:this.filter.organId,
            number:this.number
          }
        }
      ).then(()=>{
          this.$message({ message: '设置成功', type: 'success' })
          this.transfiniteSetShow=false
          this._fetchData()
      })
      },
    async setBtn(){
        this.transfiniteSetShow=true
        const data = await Api.getlimitHouseNumConfig.get({
          organId:this.filter.organId
        }).then(res => {
          this.number=res.data.result
        });
    },
    async seeDetailsBtn(row){
        this.transfiniteContentTitle=row
        this.transfiniteContentShow=true
        const data = await Api.houseDetails.get({}, {
            pathParams: {
              houseId: row.id
            }
        }).then(data => data.data)
        data.rows.forEach(v=>{
          if(v.effectiveTime){
            v.effectiveTime=`截止授权日期:${moment(v.effectiveTime).format('YYYY-MM-DD')}`
          }
          var ss=v.identityNumber
          var str1=ss.replace(/(\d{3})(\d+)(\d{3})/,function(x,y,z,p){
            var i="";
            while(i.length<z.length){i+="*"}
            return y+i+p

        })
        v.identityNumber=str1
          if(v.photoPath==null){
            v.photoPath=require('../../assets/images/mr.png')
          }
        })
        this.totalNumber=data.total
        this.list=data.rows
      },
    async editRow(row,num){
      const data = await Api.limitNumMark.put({},{
        pathParams:{
          id:row.id,
          status:num
        }
      }).then(()=>{
        this.$message({ message: '设置成功', type: 'success' })
        this._fetchData()
     })
    },
    _fetchData: debounce(async function() {
      const data = await Api.limitNumlist
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);

      this.tableData = data.result.records;
      this.total = data.result.total;
    }, 100),

    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    orgNodeClick([item = {}]) {
      this.btnVisible=item.organType==2?true:false
      console.log(item.organType)
      this.filter.organId = item.id || "";
      this._fetchData();
    }
  }
};
</script>
<style lang="less">
.transfiniteContentBox{
  margin-top: 10px;
  margin-bottom: 10px;
    .transfiniteContentTitle{
        display: flex;
        p{
          margin-right: 30px;
        }
    }
    .transfiniteBox{
        .transfiniteShowBox{
            width: 310px;
            display: flex;
            border: 1px solid #CCC;
            justify-content: space-around;
            padding: 10px 0px;
            margin-top: 12px;
            .transfiniteImg{
                img{
                    height: 116px;
                    width: 80px;
                }
            }
            .transfiniteText{
                p{
                    margin-top: 5px;
                }
            }
        }
    }
}
</style>
