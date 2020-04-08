export default [
  {
    name: 'addWellCover', // 新增智能井盖
    url: '/business/manholecover',
    methods: ['post']
  },
  {
    name: 'editWellCover', // 编辑智能井盖
    url: '/business/manholecover',
    methods: ['put']
  },
  {
    name: 'deleteWellCover', // 删除智能井盖
    url: '/business/manholecover/:id',
    methods: ['delete']
  },
  {
    name: 'pagingWellCover', // 获取井盖分页
    url: '/business/manholecover/pageList',
    methods: ['get']
  },
  {
    name: 'addAlarmPanel', // 新增智能报警盘
    url: '/business/alarmPanel',
    methods: ['post']
  },
  {
    name: 'editAlarmPanel', // 编辑智能报警盘
    url: '/business/alarmPanel/:id',
    methods: ['put']
  },
  {
    name: 'deleteAlarmPanel', // 删除智能报警盘
    url: '/business/alarmPanel/:id',
    methods: ['delete']
  },
  {
    name: 'pagingAlarmPanel', // 获取报警盘分页
    url: '/business/alarmPanel',
    methods: ['get']
  },
  {
    name: 'gbDeviceList', // 获取报警盘分页
    url: '/business/gbDevice/getDevicesByOrganId',
    methods: ['post']
  },
  {
    name: 'addDeviceFire', // 新增智能消防栓
    url: '/business/iotDeviceFire',
    methods: ['post']
  },
  {
    name: 'editDeviceFire', // 编辑智能消防栓
    url: '/business/iotDeviceFire/:id',
    methods: ['put']
  },
  {
    name: 'deleteDeviceFire', // 删除智能消防栓
    url: '/business/iotDeviceFire/:id',
    methods: ['delete']
  },
  {
    name: 'pagingDeviceFire', // 获取消防栓分页
    url: '/business/iotDeviceFire/pageList',
    methods: ['get']
  },
  {
    name: 'alarmPage', // 设备告警分页查询
    url: '/business/deviceAlarm',
    methods: ['get']
  },
  {
    name: 'deviceAlarm', // 处理告警
    url: '/business/deviceAlarm/:id/:alarmState',
    methods: ['put']
  },
  {
    name: 'getCommonType', // 获取设备厂家列表
    url: '/system/commonType',
    methods: ['get']
  },
  {
    name: 'addDeviceSmoke', // 新增烟感
    url: '/business/iotDeviceSmoke',
    methods: ['post']
  },
  {
    name: 'editDeviceSmoke', // 编辑烟感
    url: '/business/iotDeviceSmoke/:id',
    methods: ['put']
  },
  {
    name: 'deleteDeviceSmoke', // 删除烟感
    url: '/business/iotDeviceSmoke/:id',
    methods: ['delete']
  },
  {
    name: 'pagingDeviceSmoke', // 获取烟感分页
    url: '/business/iotDeviceSmoke/pageList',
    methods: ['get']
  },
  {
    name: 'addSipServer', // 新增sip服务
    url: '/business/sip',
    methods: ['post']
  },
  {
    name: 'editSipServer', // 修改sip服务
    url: '/business/sip',
    methods: ['put']
  },
  {
    name: 'deleteSipServer', // 删除sip服务
    url: '/business/sip/:id',
    methods: ['delete']
  },
  {
    name: 'pageSipServer', // 获取sip分页
    url: '/business/sip/page',
    methods: ['get']
  },
  {
    name: 'getSipUserList', // 获取sip分页
    url: '/system/sipUser/:organId',
    methods: ['get']
  },
  {
    name: 'getAlarmPanelList', // 获取报警盘分页
    url: '/business/alarmPanel/:organId',
    methods: ['get']
  },
]
