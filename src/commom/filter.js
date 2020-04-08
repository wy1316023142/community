
import moment from 'moment'
import {nonMotorizedType} from '../constants'
import { keyBy } from 'lodash'


export default {
  install(Vue) {
    // 底库类型库格式化
    Vue.filter('libaryFormat', (value) => {
      const target = store.state.libaryMap[value]
      return target ? target.name : ''
    })

    Vue.filter('moment', (date, format = 'YYYY-MM-DD', inputFormat = '') => {
      if (inputFormat) {
        return date ? moment(date, inputFormat).format(format) : '-'
      }
      return date ? moment(date).format(format) : '-'
    })

    Vue.filter('daterful',function  (oldval,filerw ) {
      return moment(oldval).format( filerw || 'YYYY-MM-DD  HH:mm:ss' );
  })

    Vue.filter('analysisType', (value) => {
      if(value===1) return '独居老人告警'
      if(value===2) return '上访人员告警'
      if(value===3) return '假释人员告警'
      if(value===4) return '房屋居住人口超限告警'
    })

    Vue.filter('vehicleType', (value) => {
      let data=nonMotorizedType.find(v => v.id == value)
      return data?data.label:'-'
    })

    Vue.filter('vehicleStatus', (value) => {
      if(value===0) return '正常'
      if(value===1) return '异常'
      if(value===2) return '嫌疑车辆'
    })

    Vue.filter('personFollowStatus', (value) => {
      if(value===0) return '正常'
      if(value===1) return '尾随'
      if(value===2) return '嫌疑尾随'
    })

    Vue.filter('defaultNull', (value) => {
      if(value=='') return '-'
    })

    Vue.filter('PropertyPerson', (value) => {
      if(value===0) return '否'
      if(value===1) return '是'
    })

    Vue.filter('concernsFlag', (value) => {
      if(value==0) return '已关怀'
      if(value==1) return '未关怀'
    })

    Vue.filter('votingState', (value) => {
      if(value==0) return '未开始'
      if(value==1) return '进行中'
      if(value==2) return '已结束'
    })
    Vue.filter('votingStates', (value) => {
      if(value==1) return '未开始'
      if(value==2) return '进行中'
      if(value==3) return '已结束'
    })
    Vue.filter('activityType', (value) => {
      if(value==1201) return '选举投票'
      if(value==1202) return '表决投票'
    })
    Vue.filter('residentialCompanyType', (value) => {
      if(value==='1101') return '茶楼/棋牌'
      if(value==='1102') return '超市'
      if(value==='1103') return '菜市'
      if(value==='1104') return '快递'
      if(value==='1105') return '餐饮'
      if(value==='1106') return '幼儿园'
      if(value==='1107') return '水果店'
      if(value==='1108') return '中介'
      if(value==='1109') return '药店'
      if(value==='1110') return '服装店'
      if(value==='1111') return '洗衣店'
      if(value==='1112') return '理发店'
      if(value==='1113') return '彩票'
      if(value==='1114') return '其他'

    })
    Vue.filter('validState', (value) => {
      if(value==0) return '启用'
      if(value==1) return '停用'
    })
    Vue.filter('validStateBtn', (value) => {
      if(value==1) return '启用'
      if(value==0) return '停用'
    })
    Vue.filter('deviceType', (value) => {
      if(value=='IDT0') return '摄像头'
      if(value=='IDT1') return '车辆抓拍机'
       if(value=='IDT2') return '门禁设备'
       if(value=='IDT3') return '人脸抓拍机'
       if(value=='IDT4') return '报警盘'
       if(value=='IDT5') return '烟感设备'
       if(value=='IDT6') return '消防栓设备'
       if(value=='IDT7') return '井盖设备'
    })

    Vue.filter('liveType', (value) => {
      if(value=='1') return '自购'
      if(value=='2') return '租住'
       if(value=='3') return '借住'
       if(value=='4') return '网约'
       if(value=='5') return '民宿'
       if(value=='6') return '其他'
       
    })
    Vue.filter('companyNumber', (value) => {
      if(value==1) return '100人以上（含）'
      if(value==2) return '100人以下'
    })
    Vue.filter('personType', (value) => {
      if(value=='1') return '独居老人'
      if(value=='2') return '上访人员'
       if(value=='3') return '"刑释人员"'
       if(value=='4') return '社区矫正人员'
       if(value=='5') return '重点关注人员'
       if(value=='6') return '其他'
    })
    Vue.filter('trueType', (value) => {
      if(value==1) return '否'
      if(value==0) return '是'
    })
    Vue.filter('hubeiToChengdu', (value) => {
      if(value==1) return '否'
      if(value==0) return '是'
    })
    Vue.filter('inoutState', (value) => {
      if(value==1) return '关注中'
      if(value==2) return '已停止'
    })
    Vue.filter('GrieStates', (value) => {
      if(value==1) return '停用'
      if(value==0) return '启用'
    })
    Vue.filter('alarmState', (value) => {
      if(value=='101') return '人员脱控三天'
      if(value=='102') return '房屋居住人员超限'
      if(value=='103') return '人员连续三天未出现'
      if(value=='104') return '人员布控'
      if(value=='105') return '长时未出现人员'
      if(value=='106') return '关怀人员进出'
    })
    Vue.filter('handleState', (value) => {
      if(value==1) return '已处理'
      if(value==2) return '待处理'
      
    })
    Vue.filter('securityState', (value) => {
      if(value==0) return '正常'
      if(value==1) return '离线'
      
    })
  }
}
