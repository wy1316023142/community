<template>
  <div class="zhsq-innerBody" ref="innerBody">
    <div class="zhsq-innerTop flex">
      <span class="top-icon"></span>
      <span class="title">人口登记记录</span>

      <div class="text_r flexItem">
        <!--<el-checkbox v-model="checked" @change="handCkChange" title="包含机构下级">下级</el-checkbox>-->
        <el-input  placeholder="姓名"  v-model="filter.name" clearable></el-input>
        <el-input  placeholder="证件号"  v-model="filter.identityNumber" clearable ></el-input>
        <el-input  placeholder="电话号码"  v-model="filter.tel" clearable></el-input>
        <el-select v-model="filter.personType" placeholder="人员类型" clearable>
          <el-option v-for="item in personType"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
        <el-select v-model="filter.photoStatus" placeholder="下发状态" clearable>
          <el-option v-for="item in photoStatus"
                     :key="item.id"
                     :label="item.label"
                     :value="item.id"></el-option>
        </el-select>
          <!-- <el-select v-model="filter.internateType" placeholder="网络运营商" clearable>
            <el-option v-for="item in networkOperator"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
            </el-option>
          </el-select> -->
        <el-button type="primary" size="small" @click="_fetchData()">搜索</el-button>
        <el-button type="primary" size="small" @click="editRow()" title="点击新增人员" v-allow="300101">新增</el-button>
        <el-button type="primary" size="small" title="点击下载导入模板"><a href="/template/person.xlsx">下载模板</a></el-button>
        <el-button type="primary" size="small" title="点击导入信息" @click="importFormVisible = true" v-allow="300104">导入</el-button>
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
                <el-table-column prop="name" label="姓名" align='center'></el-table-column>
                <el-table-column prop="identityNumber" label="证件号" align='center'></el-table-column>
                <el-table-column prop="sexName" label="性别" align='center'></el-table-column>
                <el-table-column prop="tel" label="联系电话" align='center'></el-table-column>

                <el-table-column prop="photoStatusName" label="人脸下发" align='center' >
                  <template slot-scope="scope" >
                    <span style="cursor: pointer" @click="handlePhotoStatus(scope.row.id)">{{scope.row.photoStatusName}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align='center' width="240">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="editRow(scope.row)" v-allow="300102">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteRow(scope.row)" v-allow="300103">删除</el-button>
                    <el-button type="danger" size="mini" @click="reHandleEntranceGuard(scope.row)" v-allow="300105">重新下发</el-button>
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

    <el-dialog class="population-dialog"  :close-on-click-modal="false" :title="dialogFormTitle" :visible.sync="dialogFormVisible"  :modal-append-to-body='false' width="50%" top="5vh">
      <el-form ref="form" :model="model" :rules="rules" :show-message="false">
        <h3><span>人员信息</span></h3>
        <el-row>


           <el-col :span="12">
            <div class="photoDiv">
                  <!--新增头像-->
              <el-col v-if="!model.id">
                <!-- <el-form-item label="头像：" prop="imgStr"> -->
                  <div class='imgDiv' >
                    <span v-show='!!model.imgStr' @click='cancel()' class='el-icon-error'></span>
                    <span>
                      <img v-show='!!model.imgStr' :src="model.imgStr"/>
                    </span>
                    <div v-show='!model.imgStr'>
                      <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
                      <input ref='fileInput' type="file" accept="image/*" @change="handleUpload($event)"/>
                    </div>
                  </div>
                  <input type="hidden" v-if="false" v-model="model.imgStr"/>
                <!-- </el-form-item> -->
              </el-col>
              <!--编辑头像-->
              <el-col v-if="!!model.id" prop="imgStr">
                <el-form-item >
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
              <el-col  class="photoFont">
                    <el-button  type="primary" size="mini"  @click="onPickFile">选择文件</el-button>
                    <p>照片拍摄要求：<br/>
                    <span>请确保拍摄的人脸照片为清晰的正脸照（不要上传仰头、低头、侧脸照），不要戴帽子、墨镜类影响面部识别的物品</span></p>
                    <p>尺寸要求：<br/>
                    <span>建议长宽3:4，不小于100PX，JPG、PNG、GIF格式</span>
                    </p>
              </el-col>

             </div>


              <el-col v-if="chinaShow">
                  <el-form-item label="民族：" prop="nationName"  >
                    <el-select v-model="model.nationName" placeholder="请选择">
                      <el-option v-for="(item,i) in nationName" :key="i"
                                :label="item.label"
                                :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
              <el-col >
                  <el-form-item label="政治面貌：" >
                    <el-select v-model="model.political" placeholder="请选择">
                      <el-option v-for="item in political"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col>
                 <!-- <div v-if="otherShow">
                  <el-col >
                    <el-form-item label="证件照片: ">
                      <div class='passportImg'>
                      <el-upload
                        action="#"
                        :file-list="editFileList"
                        list-type="picture-card"
                        :auto-upload="false"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-change="onUploadChange"
                        :class="{hide:hideUpload}"
                        :limit='3'>
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      </div>
                    </el-form-item>
                  </el-col>
              </div> -->
              <el-col  >
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
             <el-form-item label="国籍：" prop="country">
              <el-select v-model="model.country" placeholder="请选择" style="width:100%" @change="nationalityChange">
                <el-option v-for="item in country"
                           :label="item.value"
                           :key="item.value"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
             <div v-if="chinaShow">
              <el-col >
                <el-form-item label="姓名：" prop="name">
                  <el-input  autocomplete="off" v-model="model.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="身份证号码：" prop="identityNumber">
                  <el-input  autocomplete="off" v-model="model.identityNumber" @blur="handleInputConfirm"></el-input>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="手机号码：" prop="tel">
                  <el-input  autocomplete="off" v-model="model.tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="性别：">
                  <el-input  autocomplete="off" v-model="sex" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="年龄：">
                  <el-input  autocomplete="off" v-model="age" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="学历水平：" >
                  <el-select v-model="model.education" placeholder="请选择">
                    <el-option v-for="item in education"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="籍贯：" prop="nativeCity" >
                  <el-cascader  :options="options" v-model="nativeCity" @change="handleArea"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="人员类型：">
                  <el-select v-model="model.personType" placeholder="请选择" multiple >
                    <el-option v-for="item in personType"
                              :key="item.id"
                              :label="item.label"
                              :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
            <div v-if="otherShow">
              <el-col>
                <el-form-item label="证件类型：">
                  <p>{{passportType}}</p>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="证件号码：">
                  <el-input  autocomplete="off" v-model="model.identityNumber" @blur="handleInputConfirm"></el-input>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="姓名：" prop="name">
                  <el-input  autocomplete="off" v-model="model.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="性别：">
                    <el-select v-model="sex" placeholder="请选择" @change="sexChange">
                        <el-option v-for="item in sexData"
                                  :key="item.id"
                                  :label="item.label"
                                  :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="手机号码：" prop="tel">
                  <el-input  autocomplete="off" v-model="model.tel"></el-input>
                </el-form-item>
              </el-col>
              <el-col >
                <el-form-item label="出生日期：">
                  <el-input  autocomplete="off" v-model="model.birthYearMonth"></el-input>
                </el-form-item>
              </el-col>
                 <!-- <el-col >
                  <el-form-item label="职务：">
                    <el-select v-model="model.post" placeholder="请选择">
                      <el-option v-for="item in post"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
              </el-col> -->

            </div>

           </el-col>
            <div v-if="otherShow">
              <el-col >
                <el-form-item label="证件照片: ">
                  <div class='passportImg'>
                  <el-upload
                    action="#"
                    :file-list="editFileList"
                    list-type="picture-card"
                    :auto-upload="false"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-change="onUploadChange"
                    :class="{hide:hideUpload}"
                    :limit='3'>
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  </div>
                </el-form-item>
              </el-col>
            </div>
        </el-row>
        <div class="dialog-form-error" v-if="firstErr">{{firstErr.message}}</div>
        <h3 class="flex">
          <span>居住信息</span>
          <span class="flexItem text_r" @click="addLive">+新增一个居住信息</span>
        </h3>
        <!-- <el-row class="population-dialog-box" v-for="(item,index) in populationHouses" :key="index">
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="所属小区：" >
              <el-input v-model="item.orgName" autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"  class="input">
            <span class="font">*</span>
            <el-form-item label="所属单元：">
              <el-input v-model="item.unitName"  autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"  class="input">
            <span class="font">*</span>
            <el-form-item label="所属楼层：" >
              <el-input v-model="item.inFloorNum"  autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"  class="input">
            <span class="font">*</span>
            <el-form-item label="门牌号：" >
              <el-input v-model="item.houseCode" autocomplete="off" placeholder="请选择小区" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"  class="input">
            <span class="font">*</span>
            <el-form-item label="人口类型："  >
              <el-select v-model="item.liveType" placeholder="请选择" disabled>
                <el-option v-for="item in liveType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"  class="input">
            <span class="font">*</span>
            <el-form-item label="住户类型：" >
              <el-select v-model="item.poType" placeholder="请选择" @change="poTypeChange(item)">
                <el-option v-for="item in poType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"  class="input changeDate">
            <span class="font">*</span>
            <el-form-item label="授权日期 : "  v-show="item.poType===2">
              <el-date-picker
              v-model="item.effectiveTime"
              :picker-options="expireTimeOption"
              type="date"
              @change="changeDate"
              placeholder="选择日期">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12"  class="input">
            <span class="font">*</span>
            <el-form-item label="是否业主：" >
              <el-select v-model="item.isHolder" placeholder="请选择" disabled>
                <el-option v-for="item in isHolderType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="接入网络 ：" >
              <el-select v-model="item.internateType" placeholder="请选择" >
                <el-option v-for="item in networkOperator"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row class="population-dialog-box" v-for="(item,index) in model.populationHouses" :key="index" v-show="item.show">
          <el-col :span="12" class="input">
            <span class="font">*</span>
            <el-form-item label="所属小区：" >
              <el-popover  width="300" trigger="click" v-model="item.visible">
                <div style="height: 300px;max-height: 300px;overflow: auto" class="popover">
                  <el-tree :data="treeList"
                           :props="defaultProps"
                           @node-click="selectOrgId"
                           highlight-current
                           :expand-on-click-node="false"
                           :default-checked-keys="[organId]"
                           node-key="id">
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                          <span v-if="data.organType==1">机构 : {{ data.name }}</span>
                          <span v-if="data.organType==2" style="color:#00C2FF">小区 : {{ data.name }}</span>
                     </span>
                  </el-tree>
                   <div class="center">
                        <el-button  type="primary" size="mini" @click="submitUnit(item,index)">确定</el-button>
                   </div>
                </div>
                <el-input v-model="item.orgName" slot="reference" autocomplete="off" placeholder="请选择小区" readonly></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="所属单元：" >
              <el-select  placeholder="请选择" v-model="item.unitId" @change="unitChange($event,index,1)">
                <el-option v-for="item in unitList[index]"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="所属楼层：" >
              <el-select placeholder="请选择" v-model="item.floorId" @change="floorChange($event,index)">
                <el-option v-for="item in floorList[index]"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font-houseId font">*</span>
            <el-form-item label="门牌号：" >
              <el-select  placeholder="请选择" v-model="item.houseId">
                <el-option v-for="item in houseList[index]"
                           :key="item.id"
                           :label="item.houseCode"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="人口类型：" >
              <el-select v-model="item.liveType" placeholder="请选择">
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
            <el-form-item label="是否业主：">
              <el-select v-model="item.isHolder" placeholder="请选择" @change="isHolderChange(item,index)">
                <el-option v-for="item in isHolderType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>


          </el-col>
          <el-col :span="12" class="input">
             <span class="font">*</span>
            <el-form-item label="住户类型：" >
              <el-select v-model="item.poType" placeholder="请选择" @change="poTypeChange(item,index)">
                <el-option v-for="item in poType"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="12">
            <el-form-item label="接入网络：" >
              <el-select v-model="item.internateType" placeholder="请选择" >
                <el-option v-for="item in networkOperator"
                           :key="item.id"
                           :label="item.label"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24"  class="input changeDate"  v-show="item.poType===2">
            <span class="font">*</span>
            <el-form-item label="授权日期：">
           <el-date-picker
              v-model="item.effectiveTime"
              type="date"
              @change="changeDate"
              :picker-options="expireTimeOption"
              placeholder="选择日期">
            </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col v-show="removeLiveShow">
            <div class="remove" @click="removeLive(index,item)"> 移除</div>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>

    <!--导入-->
    <el-dialog title="导入"  :close-on-click-modal="false"  :visible.sync="importFormVisible" :modal-append-to-body='false' width="350px">
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
    <el-dialog title="导入失败信息"  :close-on-click-modal="false"  :visible.sync="importVisible"   :modal-append-to-body='false' width="60%">
      <el-table :data="importData" style="width: 100%" stripe  :height='400' :max-height="400">
        <el-table-column label="序号" align='center'  type="index"></el-table-column>
        <el-table-column prop="SHEETNAME" label="sheet名" align='center'></el-table-column>
        <el-table-column prop="errRow" label="行数" align='center'></el-table-column>
        <el-table-column prop="errMsg" label="错误信息" align='center'  width="340"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportExcel" type="primary">导出</el-button>
        <el-button @click="importVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--查询人口门禁下发记录-->
    <el-dialog title="人口门禁下发记录" :visible.sync="photoStatusVisible"   :modal-append-to-body='false' width="60%">
      <el-table :data="photoStatusData" style="width: 100%" :height='400' :max-height="400" stripe >
        <el-table-column label="序号" align='center'  type="index"></el-table-column>
        <el-table-column prop="deviceName" label=" 设备名称" align='center'></el-table-column>
        <el-table-column prop="operTypeName" label=" 操作方式" align='center'></el-table-column>
        <el-table-column prop="statusName" label=" 下发状态" align='center'></el-table-column>
        <el-table-column prop="remarks" label="备注" align='center' width="250"></el-table-column>
        <el-table-column prop="updateTime" label="时间"  align='center'  width="200"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="photoStatusVisible = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Api from "../../commom/api.js";
import { debounce, keys, cloneDeep } from "lodash";
import { validateIdCard, validatePhone } from "../../commom/validator";
import OrganTree from "../../components/OrganTree.vue";
import moment from 'moment'
import {
  provinceAndCityData,
  CodeToText,
  TextToCode
} from "element-china-area-data";
import { getBase64, convert2JPEG } from "../../commom/util.js";
import { domHeightMixin } from "../../commom/mixins.js";
import { export_json_to_excel } from "../../commom/Export2Excel";
export default {
  name: "population",
  components: { OrganTree },
  data() {
    return {
      expireTimeOption: {
        disabledDate(date) {
      //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
        return date.getTime() < Date.now() - 8.64e7;
        }
      },
      removeLiveShow:true,
      effectiveTimeData:'',
      bigImgShow: "",
      edited: "",
      unitData:0,
      editFileList: [],
      array: [],
      hideUpload: false,
      passportType: "",
      eventImg: [],
      chinaShow: true,
      otherShow: false,
      photoStatusData: [],
      photoStatusVisible: false,
      importData: [],
      importVisible: false,
      fileList: [],
      action: "",
      fileHeader: {},
      importFormVisible: false,
      populationHouses: [],
      nativeCity: [],
      organId: "",
      organName: "",
      unitId: "",
      unitList: [],
      floorList: [],
      houseList: [],
      /*liveTypeList: [],
      poTypeList: [],*/
      options: provinceAndCityData,
      tabHeight: "0",
      dialogFormVisible: false,
      dialogFormTitle: "",
      tableData: [],
      effectiveTimeShow:false,
      model: {
        country: "中国"
      },
      total: 0,
      checked: false,
      filter: {
        orgId: 0,
        page: 1,
        rows: 10,
        name: "",
        identityNumber: "",
        tel: "",
        status: "",
        photoStatus: "",
        personType: "",
        xj: 1
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeList: [],
      isHolderType: [{ id: 0, label: "是" }, { id: 1, label: "否" }],
      sex: "",
      age: "",
      sexData: [{ id: 0, label: "男" }, { id: 1, label: "女" }],
      auditStatus: [{ id: 0, label: "审核通过" }, { id: 1, label: "待审核" }],
      photoStatus: [{ id: 0, label: "成功" }, { id: 1, label: "失败" }],
      tenantType:[
        { id: 1, label: "在租租客" },
        { id: 2, label: "过期租客" },
      ],
      personType: [
        { id: 1, label: "独居老人" },
        { id: 2, label: "上访人员" },
        { id: 3, label: "刑释人员" },
        { id: 4, label: "社区矫正" },
        { id: 5, label: "重点关注人员" }
      ],
      post: [
        { id: 0, label: "务农" },
        { id: 1, label: "公职" },
        { id: 2, label: "经商" },
        { id: 3, label: "务工" },
        { id: 4, label: "上学" },
        { id: 5, label: "退休" },
        { id: 6, label: "宗教教职" }
      ],
      education: [
        { id: 0, label: "高中" },
        { id: 1, label: "中专" },
        { id: 2, label: "大专" },
        { id: 3, label: "大学本科" },
        { id: 4, label: "研究生" },
        { id: 5, label: "初中以下" },
        { id: 6, label: "文盲或半文盲" }
      ],
      political: [
        { id: 0, label: "群众" },
        { id: 1, label: "团员" },
        { id: 2, label: "党员" }
      ],
      nationName: [
        { id: "汉族", label: "汉族" },
        { id: "维吾尔族", label: "维吾尔族" },
        { id: "回族", label: "回族" },
        { id: "哈萨克族", label: "哈萨克族" },
        { id: "蒙古族", label: "蒙古族" },
        { id: "柯尔克孜族", label: "柯尔克孜族" },
        { id: "乌孜别克族", label: "乌孜别克族" },
        { id: "俄罗斯族", label: "俄罗斯族" },
        { id: "锡伯族", label: "锡伯族" },
        { id: "藏族", label: "藏族" },
        { id: "苗族", label: "苗族" },
        { id: "彝族", label: "彝族" },
        { id: "壮族", label: "壮族" },
        { id: "布依族", label: "布依族" },
        { id: "朝鲜族", label: "朝鲜族" },
        { id: "满族", label: "满族" },
        { id: "侗族", label: "侗族" },
        { id: "瑶族", label: "瑶族" },
        { id: "白族", label: "白族" },
        { id: "土家族", label: "土家族" },
        { id: "哈尼族", label: "哈尼族" },
        { id: "傣族", label: "傣族" },
        { id: "黎族", label: "黎族" },
        { id: "傈僳族", label: "傈僳族" },
        { id: "佤族", label: "佤族" },
        { id: "畲族", label: "畲族" },
        { id: "高山族", label: "高山族" },
        { id: "拉祜族", label: "拉祜族" },
        { id: "水族", label: "水族" },
        { id: "东乡族", label: "东乡族" },
        { id: "纳西族", label: "纳西族" }
      ],
      country: [
        { value: "中国", label: "中国" },
        { value: "中国台湾", label: "中国台湾" },
        { value: "中国香港", label: "中国香港" },
        { value: "中国澳门", label: "中国澳门" },
        { value: "安哥拉", label: "安哥拉" },
        { value: "阿富汗", label: "阿富汗" },
        { value: "阿尔巴尼亚", label: "阿尔巴尼亚" },
        { value: "阿尔及利亚", label: "阿尔及利亚" },
        { value: "安道尔共和国", label: "安道尔共和国" },
        { value: "安圭拉岛", label: "安圭拉岛" },
        { value: "安提瓜和巴布达", label: "安提瓜和巴布达" },
        { value: "阿根廷", label: "阿根廷" },
        { value: "亚美尼亚", label: "亚美尼亚" },
        { value: "阿森松", label: "阿森松" },
        { value: "澳大利亚", label: "澳大利亚" },
        { value: "奥地利", label: "奥地利" },
        { value: "阿塞拜疆", label: "阿塞拜疆" },
        { value: "巴哈马", label: "巴哈马" },
        { value: "巴林", label: "巴林" },
        { value: "孟加拉国", label: "孟加拉国" },
        { value: "巴巴多斯", label: "巴巴多斯" },
        { value: "白俄罗斯", label: "白俄罗斯" },
        { value: "比利时", label: "比利时" },
        { value: "伯利兹", label: "伯利兹" },
        { value: "贝宁", label: "贝宁" },
        { value: "百慕大群岛", label: "百慕大群岛" },
        { value: "玻利维亚", label: "玻利维亚" },
        { value: "博茨瓦纳", label: "博茨瓦纳" },
        { value: "巴西", label: "巴西" },
        { value: "文莱", label: "文莱" },
        { value: "保加利亚", label: "保加利亚" },
        { value: "布基纳法索", label: "布基纳法索" },
        { value: "缅甸", label: "缅甸" },
        { value: "布隆迪", label: "布隆迪" },
        { value: "喀麦隆", label: "喀麦隆" },
        { value: "加拿大", label: "加拿大" },
        { value: "开曼群岛", label: "开曼群岛" },
        { value: "中非共和国c", label: "中非共和国" },
        { value: "乍得", label: "乍得" },
        { value: "智利", label: "智利" },
        { value: "哥伦比亚", label: "哥伦比亚" },
        { value: "刚果", label: "刚果" },
        { value: "库克群岛", label: "库克群岛" },
        { value: "哥斯达黎加", label: "哥斯达黎加" },
        { value: "古巴", label: "古巴" },
        { value: "塞浦路斯", label: "塞浦路斯" },
        { value: "捷克", label: "捷克" },
        { value: "丹麦", label: "丹麦" },
        { value: "吉布提", label: "吉布提" },
        { value: "多米尼加共和国", label: "多米尼加共和国" },
        { value: "厄瓜多尔", label: "厄瓜多尔" },
        { value: "埃及", label: "埃及" },
        { value: "萨尔瓦多", label: "萨尔瓦多" },
        { value: "爱沙尼亚", label: "爱沙尼亚" },
        { value: "埃塞俄比亚", label: "埃塞俄比亚" },
        { value: "斐济", label: "斐济" },
        { value: "芬兰", label: "芬兰" },
        { value: "法国", label: "法国" },
        { value: "法属圭亚那", label: "法属圭亚那" },
        { value: "法属玻利尼西亚", label: "法属玻利尼西亚" },
        { value: "加蓬", label: "加蓬" },
        { value: "冈比亚", label: "冈比亚" },
        { value: "格鲁吉亚", label: "格鲁吉亚" },
        { value: "德国", label: "德国" },
        { value: "加纳", label: "加纳" },
        { value: "直布罗陀", label: "直布罗陀" },
        { value: "希腊", label: "希腊" },
        { value: "格林纳达", label: "格林纳达" },
        { value: "关岛", label: "关岛" },
        { value: "危地马拉", label: "危地马拉" },
        { value: "几内亚", label: "几内亚" },
        { value: "圭亚那", label: "圭亚那" },
        { value: "海地", label: "海地" },
        { value: "洪都拉斯", label: "洪都拉斯" },
        { value: "匈牙利", label: "匈牙利" },
        { value: "冰岛", label: "冰岛" },
        { value: "印度", label: "印度" },
        { value: "印度尼西亚", label: "印度尼西亚" },
        { value: "伊朗", label: "伊朗" },
        { value: "伊拉克", label: "伊拉克" },
        { value: "爱尔兰", label: "爱尔兰" },
        { value: "以色列", label: "以色列" },
        { value: "意大利", label: "意大利" },
        { value: "科特迪瓦", label: "科特迪瓦" },
        { value: "牙买加", label: "牙买加" },
        { value: "日本", label: "日本" },
        { value: "约旦", label: "约旦" },
        { value: "柬埔寨", label: "柬埔寨" },
        { value: "哈萨克斯坦", label: "哈萨克斯坦" },
        { value: "肯尼亚", label: "肯尼亚" },
        { value: "韩国", label: "韩国" },
        { value: "科威特", label: "科威特" },
        { value: "吉尔吉斯坦", label: "吉尔吉斯坦" },
        { value: "老挝", label: "老挝" },
        { value: "拉脱维亚", label: "拉脱维亚" },
        { value: "黎巴嫩", label: "黎巴嫩" },
        { value: "莱索托", label: "莱索托" },
        { value: "利比里亚", label: "利比里亚" },
        { value: "利比亚", label: "利比亚" },
        { value: "列支敦士登", label: "列支敦士登" },
        { value: "立陶宛", label: "立陶宛" },
        { value: "卢森堡", label: "卢森堡" },
        { value: "马达加斯加", label: "马达加斯加" },
        { value: "马拉维", label: "马拉维" },
        { value: "马来西亚", label: "马来西亚" },
        { value: "马尔代夫", label: "马尔代夫" },
        { value: "马里", label: "马里" },
        { value: "马耳他", label: "马耳他" },
        { value: "马里亚那群岛", label: "马里亚那群岛" },
        { value: "马提尼克", label: "马提尼克" },
        { value: "毛里求斯", label: "毛里求斯" },
        { value: "墨西哥", label: "墨西哥" },
        { value: "摩尔多瓦", label: "摩尔多瓦" },
        { value: "摩纳哥", label: "摩纳哥" },
        { value: "蒙古", label: "蒙古" },
        { value: "蒙特塞拉特岛", label: "蒙特塞拉特岛" },
        { value: "摩洛哥", label: "摩洛哥" },
        { value: "莫桑比克", label: "莫桑比克" },
        { value: "纳米比亚", label: "纳米比亚" },
        { value: "瑙鲁", label: "瑙鲁" },
        { value: "尼泊尔", label: "尼泊尔" },
        { value: "荷属安的列斯", label: "荷属安的列斯" },
        { value: "荷兰", label: "荷兰" },
        { value: "新西兰", label: "新西兰" },
        { value: "尼加拉瓜", label: "尼加拉瓜" },
        { value: "尼日尔", label: "尼日尔" },
        { value: "尼日利亚", label: "尼日利亚" },
        { value: "朝鲜", label: "朝鲜" },
        { value: "挪威", label: "挪威" },
        { value: "阿曼", label: "阿曼" },
        { value: "巴基斯坦", label: "巴基斯坦" },
        { value: "巴拿马", label: "巴拿马" },
        { value: "巴布亚新几内亚", label: "巴布亚新几内亚" },
        { value: "巴拉圭", label: "巴拉圭" },
        { value: "秘鲁", label: "秘鲁" },
        { value: "菲律宾", label: "菲律宾" },
        { value: "波兰", label: "波兰" },
        { value: "葡萄牙", label: "葡萄牙" },
        { value: "波多黎各", label: "波多黎各" },
        { value: "卡塔尔", label: "卡塔尔" },
        { value: "留尼旺", label: "留尼旺" },
        { value: "罗马尼亚", label: "罗马尼亚" },
        { value: "俄罗斯", label: "俄罗斯" },
        { value: "圣卢西亚", label: "圣卢西亚" },
        { value: "圣文森特岛", label: "圣文森特岛" },
        { value: "东萨摩亚(美)", label: "东萨摩亚(美)" },
        { value: "西萨摩亚", label: "西萨摩亚" },
        { value: "圣马力诺", label: "圣马力诺" },
        { value: "圣多美和普林西比", label: "圣多美和普林西比" },
        { value: "沙特阿拉伯", label: "沙特阿拉伯" },
        { value: "塞内加尔", label: "塞内加尔" },
        { value: "塞舌尔", label: "塞舌尔" },
        { value: "塞拉利昂", label: "塞拉利昂" },
        { value: "新加坡", label: "新加坡" },
        { value: "斯洛伐克", label: "斯洛伐克" },
        { value: "斯洛文尼亚", label: "斯洛文尼亚" },
        { value: "所罗门群岛", label: "所罗门群岛" },
        { value: "索马里", label: "索马里" },
        { value: "南非", label: "南非" },
        { value: "西班牙", label: "西班牙" },
        { value: "斯里兰卡", label: "斯里兰卡" },

        { value: "圣文森特", label: "圣文森特" },
        { value: "苏丹", label: "苏丹" },
        { value: "苏里南", label: "苏里南" },
        { value: "斯威士兰", label: "斯威士兰" },
        { value: "瑞典", label: "瑞典" },
        { value: "瑞士", label: "瑞士" },
        { value: "叙利亚", label: "叙利亚" },
        { value: "塔吉克斯坦", label: "塔吉克斯坦" },
        { value: "坦桑尼亚", label: "坦桑尼亚" },
        { value: "泰国", label: "泰国" },
        { value: "多哥", label: "多哥" },
        { value: "汤加", label: "汤加" },
        { value: "特立尼达和多巴哥", label: "特立尼达和多巴哥" },
        { value: "突尼斯", label: "突尼斯" },
        { value: "土耳其", label: "土耳其" },
        { value: "土库曼斯坦", label: "土库曼斯坦" },
        { value: "乌干达", label: "乌干达" },
        { value: "乌克兰", label: "乌克兰" },
        { value: "阿拉伯联合酋长国", label: "阿拉伯联合酋长国" },
        { value: "英国", label: "英国" },
        { value: "美国", label: "美国" },
        { value: "乌拉圭", label: "乌拉圭" },
        { value: "乌兹别克斯坦", label: "乌兹别克斯坦" },
        { value: "委内瑞拉", label: "委内瑞拉" },
        { value: "越南", label: "越南" },
        { value: "也门", label: "也门" },
        { value: "南斯拉夫", label: "南斯拉夫" },
        { value: "津巴布韦", label: "津巴布韦" },
        { value: "扎伊尔", label: "扎伊尔" },
        { value: "赞比亚", label: "赞比亚" }
      ],
      networkOperator:[
        { id: 1, label: "电信"},
        { id: 3, label: "移动"},
        { id: 2, label: "联通"},
        { id: 4, label: "广电"},
        { id: 9, label: "其他"},
      ],
      liveType: [
        { id: 1, label: "户籍人口" },
        { id: 2, label: "常住人口" },
        { id: 3, label: "流动人口" }
      ],
      delData:[],
      poType: [{ id: 1, label: "住户" }, { id: 2, label: "租客" }],
      firstErr: null,
      loading: false,
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
      }
    };
  },
  mounted() {
    this.fileHeader = {
      Authorization: "Bearer " + sessionStorage.getItem("token")
    };
    this.$nextTick(() => {
      this.tabHeight = this.$refs.content.offsetHeight - 56;
      window.onresize = () => {
        this.tabHeight = this.$refs.content.offsetHeight - 56;
      };
    });
    this.filter.orgId = JSON.parse(sessionStorage.getItem("user")).organId;
    this.action =
      myConfig.baseUrl + "/business/population/import/" + this.filter.orgId;
    this._fetchData();
    this._fetchOrganData();
    this.nationalityChange();
  },
  methods: {
    poTypeChange(item,index){
      if(item.poType==2){
        this.model.populationHouses[index].isHolder=1
        this.effectiveTimeShow=true
      }else{
        this.effectiveTimeShow=false
        item.effectiveTime=''
      }
    },
    isHolderChange(item,index){
     if(item.isHolder==0){
        this.model.populationHouses[index].poType=1
     }
    },
    sexChange() {
      this.model.sex = this.sex;
    },
    changeDate(val){
    },
    _fetchData: debounce(async function() {
       this.tableData=[]
      const data = await Api.getPopulationPageLst
        .get(this.filter, {
          loadingMaskTarget: ".tableShow"
        })
        .then(res => res.data);
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          if (data.rows[i].tel) {
            var ss1 = data.rows[i].tel;
            var str2 = ss1.replace(/(\d{3})(\d+)(\d{3})/, function(x, y, z, p) {
              var i = "";
              while (i.length < z.length) {
                i += "*";
              }
              return y + i + p;
            });
            data.rows[i].tel = str2;

          }
          if(data.rows[i].identityNumber){
            var ss = data.rows[i].identityNumber;
            var str1 = ss.replace(/(\d{3})(\d+)(\d{3})/, function(x, y, z, p) {
              var i = "";
              while (i.length < z.length) {
                i += "*";
              }
              return y + i + p;
            });
            data.rows[i].identityNumber = str1;

          }
        }
      }

      this.tableData = data.rows;
      this.total = data.total;
    }, 100),
    //机构树
    _fetchOrganData: debounce(async function() {
      const data = await Api.organTree.get({}).then(data => data.data.result);
      this.treeList = [data] || [];
    }, 100),
    //单元列表
    async _fetchUnitList(index) {
      const data = await Api.getUnitsByVillageId
        .get(
          {},
          {
            pathParams: {
              villageId: this.organId
            }
          }
        )
        .then(data => data.data.rows);
      this.$set(this.unitList, index, data);
      if(this.unitData==1){
        this.unitChange(this.model.populationHouses[index].unitId,index)
      }
      //this.unitList[index]=data;
    },
    //房屋列表
    async _fetchHouseList(inFloorNum, index) {
      const data = await Api.getHouseByFloorNum
        .get(
          {},
          {
            pathParams: {
              unitId: this.unitId,
              inFloorNum: inFloorNum
            }
          }
        )
        .then(data => data.data.rows);
      //this.houseList[index]=data
      this.$set(this.houseList, index, data);
    },
    //查询人口门禁下发记录
    _fetchEntranceGuard: debounce(async function(personId) {
      const data = await Api.getHandleEntranceGuard
        .get(
          {},
          {
            pathParams: {
              orgId: this.filter.orgId,
              personId: personId
            }
          }
        )
        .then(data => data.data.rows);
      this.photoStatusData = data;
    }, 100),
    //查询人口门禁下发记录
    handlePhotoStatus(personId) {
      this.photoStatusVisible = true;
      this._fetchEntranceGuard(personId);
    },
    //分页
    pageChange(val) {
      this.filter.page = val;
      this._fetchData();
    },
    handCkChange(val) {
      this.filter.xj = val ? 0 : 1;
      this._fetchData();
    },
    //左侧机构数点击
    orgNodeClick([item = {}]) {
      this.filter.orgId = item.id || "";
      this.action =
        myConfig.baseUrl + "/business/population/import/" + this.filter.orgId;
      this._fetchData();
    },
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
    // 国籍选择
    nationalityChange() {
      if (this.model.country == "中国") {
        this.chinaShow = true;
        this.otherShow = false;
      } else {
        this.chinaShow = false;
        this.otherShow = true;
      }
      if (this.model.country == "中国台湾") {
        this.passportType = "台湾居民来往大陆通行证";
      } else if (this.model.country == "中国香港") {
        this.passportType = "香港居民来往大陆通行证";
      } else if (this.model.country == "中国澳门") {
        this.passportType = "澳门居民来往大陆通行证";
      } else {
        this.passportType = "外籍人员护照";
      }
    },
    //证件照片
    handleRemove(file, fileList) {
      if (this.edited == 1) {
        Api.editEnclosure
          .put(
            {},
            {
              pathParams: {
                personId: file.name
              }
            }
          )
          .then(res => res.data);
      }
      this.model.picImages = [];
      this.array = [];
      var object = {};
      for (let i = 0; i < fileList.length; i++) {
        object.imgType = fileList[i].name;
        object.imgStr = fileList[i].status;
        this.array.push(object);
        this.model.picImages = this.array;
      }
    },
    onUploadChange(file, fileList) {
      if (this.edited == 1) {
        this.model.picImages = [];
      }
      var reader = new FileReader();
      var object = {};
      reader.readAsDataURL(file.raw);
      reader.onload = e => {
        var imgcode = e.target.result;
        var pos = imgcode.indexOf(",", 0);
        var substr2 = imgcode.substr(pos + 1);
        object.imgType = file.name;
        object.imgStr = substr2;
        this.array.push(object);
        this.model.picImages = this.array;
        file.status = substr2;
      };
    },
    handlePictureCardPreview(file) {},
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
        isHolder: 1,
        effectiveTime:'',
        delstatus:0,
        show:true
      });
        this.removeLiveShow=true
    },
    //移除居住信息
    removeLive(index,item) {
      if(this.model.populationHouses.length<=1){
        this.$message({ message: "只有一套房屋信息，不能做移除操作", type: "error" });
        return false
      }

      if(item.phId){
        var arr={}
        arr.delstatus=1
        arr.phId=item.phId
        arr.show=false
        this.delData.push(arr)
      }

      this.model.populationHouses.splice(index, 1);
      this.houseList.splice(index, 1);
      this.unitList.splice(index, 1);
      this.floorList.splice(index, 1);
      // this.liveTypeList.split(index, 1);
      /*this.poTypeList.split(index, 1);*/
    },
    // 编辑新增
    editRow(
      row = {
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
        populationHouses: []
      }
    ) {
      if (row.id) {
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

            if (res.data.result.country == null) {
              res.data.result.country = "中国";
            }
            this.editFileList = [];
            this.dialogFormTitle = "编辑";
            this.dialogFormVisible = true;
            res.data.result.populationHouses.map(item=>{
              item.show=true
              item.delstatus=0
            })
            // this.populationHouses = res.data.result.populationHouses;
              this.model = res.data.result;
              var houseDL= res.data.result.populationHouses
              if(houseDL.length>0){
                this.removeLiveShow=true
              }else{
                this.removeLiveShow=false
              }
              for (let i = 0; i < houseDL.length; i++) {
                this.floorList[i] = [];
                this.houseList[i] = [];
                this.unitId=houseDL[i].unitId
                this.model.populationHouses[i].floorId=houseDL[i].inFloorNum
                this.organId=this.model.populationHouses[i].orgId
                this.unitData=1
                this._fetchUnitList(i);
                this._fetchHouseList(houseDL[i].inFloorNum,i);
              }

            this.nationalityChange();
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
      } else {
        this.edited = "0";
        this.editFileList = [];
        this.age = "";
        this.sex = "";
        this.dialogFormTitle = "新增";
        this.model = row;
        this.model.country = "中国";
        this.model.nationName = "汉族";
        // this.model.populationHouses = [
        //   {
        //     poType: 1,
        //     liveType: 1,
        //     unitId: "",
        //     floorId: "",
        //     houseId: "",
        //     isHolder: 1,
        //     effectiveTime:'',
        //     delstatus:0
        //   }
        // ];
        this.effectiveTimeShow=false
        this.populationHouses = [];
        this.nativeCity = ["510000", "510100"];
        this.model.nativeProvince = "四川省";
        this.model.nativeCity = "成都市";
        this.dialogFormVisible = true;
        this.model.orgId = this.filter.organId;
        this.nationalityChange();
      }
    },
    //提交
    async submit() {
      // if(this.populationHouses!=[]){
      //   this.model.populationHouses=this.populationHouses
      // }
      this.$refs.form.validate(async (valid, invalidFields) => {
        if (valid) {
          if (this.model.personType) {
            this.model.personType = this.model.personType.join(",");
          }
          this.firstErr = null;
          this.loading = true;
           this.model.populationHouses.map(item => {
             if(item.effectiveTime){
               item.effectiveTime=moment(item.effectiveTime).format('YYYY-MM-DD HH:MM:ss')
             }
            });
            this.delData.map(item=>{
              this.model.populationHouses.push(item)
            })
          if (this.model.id) {
            let model = cloneDeep(this.model);
            // for (let i = 0; i < this.populationHouses.length; i++) {
            //    model.populationHouses.push(this.populationHouses[i])
            // }
            model.populationHouses.map(item => {
             if(item.effectiveTime){
               item.effectiveTime=moment(item.effectiveTime).format('YYYY-MM-DD HH:MM:ss')
             }
            });
            delete model.imgStr;
            this.model.populationHouses.map(item => {

              if (item.houseId == "") {
                this.$message({ message: "请完善居住信息", type: "error" });
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
                this.$message({ message: "编辑成功", type: "success" });
                this.loading = false;
                this.dialogFormVisible = false;
                this.delData=[]
                this._fetchData();
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            let flag = false;
            let model = cloneDeep(this.model);
            model.imgStr = model.imgStr.substring(23);
            this.model.populationHouses.map(item => {
              if (item.houseId == "") {
                this.$message({ message: "请完善居住信息", type: "error" });
                flag = true;
                return false;
              }
            });
            if (flag) {
              this.loading = false;
              return false;
            }
            await Api.addPopulation
              .post(model)
              .then(() => {
                this.$message({ message: "新增成功", type: "success" });
                this.model.country = "中国";
                this.model.picImages = [];
                this.loading = false;
                this.dialogFormVisible = false;
                this._fetchData();
              })
              .catch(() => {
                this.loading = false;
              });
          }
        } else {
          const firstKey = keys(invalidFields)[0];
          this.firstErr = invalidFields[firstKey][0];
        }
      }
      );
    },
    async deleteRow(row) {
      this.$confirm(`确定删除吗？`, "提示", {
        type: "warning"
      })
        .then(async () => {
          const data = await Api.deletePopulationById
            .delete(
              {},
              {
                pathParams: {
                  organId: this.filter.orgId,
                  id: row.id
                }
              }
            )
            .then(res => {
              this.$message({ message: "删除成功", type: "success" });
              this._fetchData();
            })
            .catch(() => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async reHandleEntranceGuard(row) {
      this.$confirm(`确定重新下发门禁信息吗？`, "提示", {
        type: "warning"
      })
        .then(async () => {
          const data = await Api.reHandleEntranceGuard
            .put(
              {},
              {
                pathParams: {
                  personId: row.id
                }
              }
            )
            .then(res => {
              this.$message({ message: "操作成功", type: "success" });
              this._fetchData();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "操作失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下发"
          });
        });
    },
    //省，市选择
    handleArea(val) {
      this.model.nativeProvince = CodeToText[val[0]];
      this.model.nativeCity = CodeToText[val[1]];
    },
    //上传头像
    onPickFile() {
      this.$refs.fileInput.click();
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
    //取消头像
    cancel() {
      this.model.imgStr = "";
    },
    //选择小区
    selectOrgId(item) {
      this.organId = item.id;
      this.organName = item.name;
    },
    submitUnit(item, index) {
      this.model.populationHouses[index].orgId = this.organId;
      this.model.populationHouses[index].orgName = this.organName;
      this.model.populationHouses[index].visible = false;
      this.model.populationHouses[index].unitId = "";
      this.model.populationHouses[index].floorId = "";
      this.model.populationHouses[index].houseId = "";
      this.floorList[index] = [];
      this.houseList[index] = [];
      this._fetchUnitList(index);
    },
    //选择楼层
    unitChange(value, index,id) {
      if(id==1){
        this.houseList[index] = [];
        this.model.populationHouses[index].floorId = "";
        this.model.populationHouses[index].houseId = "";
      }
      this.unitId = value;
      let floor = this.unitList[index].find(item => item.id === value);
      for (let i = 0; i < floor.floorNum * 1; i++) {
        this.floorList[index][i] = { label: i + 1, id: i + 1 };
      }
    },
    //选择门牌号
    floorChange(val, index) {
      this.model.populationHouses[index].houseId = "";
      this._fetchHouseList(val, index);
    },
    //上传文件前判断
    beforeUpload(file) {
      const isType =
        file.name.indexOf(".xls") != -1 || file.name.indexOf(".xlsx") != -1;
      if (!isType) {
        this.$message.error("文件格式只能是 xls或xlsx 格式!");
      }
      const isLimit = file.size / 1024 / 1024 < 5;
      if (!isLimit) {
        this.$message.error("文件大小不能超过 5MB!");
      }
      return isType && isLimit;
    },
    //上传
    submitUpload() {
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
          "楼栋",
          "单元号",
          "楼层数",
          "所属楼层",
          "房间号",
          "姓名",
          "电话",
          "身份证",
          "民族",
          "政治面貌",
          "是否有犯罪史",
          "学历水平",
          "错误信息"
        ];
        // 上面设置Excel的表格第一行的标题
        const filterVal = [
          "buildingCode",
          "unitNum",
          "floorNum",
          "inFloorNum",
          "houseCode",
          "name",
          "tel",
          "identityNumber",
          "nationName",
          "political",
          "crimeHistory",
          "education",
          "errMsg"
        ];
        const list = this.importData; //把data里的tableData存到list
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导入人员错误信息列表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>
<style lang="less">
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

</style>
