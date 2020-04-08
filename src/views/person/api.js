export default [
  {
    name: 'getPopulationPageLst', // 获取人口分页信息
    url: '/business/population',
    methods: ['get']
  },{
    name: 'openDoorRecord', // 获取开门记录
    url: '/business/openDoorRecord',
    methods: ['get']
  },
  {
    name: 'personMonitor', // 布控管理
    url: '/business/personMonitor',
    methods: ['get', 'post', 'put']
  },{
    name: 'updatePersonMonitor', // 修改布控
    url: '/business/personMonitor/:id',
    methods: ['put']
  },{
    name: 'getPersonMonitor', // 修改布控
    url: '/business/personMonitor/:id',
    methods: ['get']
  },
  {
    name: 'personMonitorById', // 删除或获取布控任务
    url: '/business/personMonitor/:id',
    methods: ['get', 'delete']
  },
  {
    name: 'personMonitorStartOrStop', // 开启或停止布控任务
    url: '/business/personMonitor/:id/:status',
    methods: ['put']
  },
  {
    name: 'personMonitorDevices', // 根据机构待布控设备
    url: '/business/personMonitor/monitorDevices/:orgId',
    methods: ['get']
  },
  {
    name: 'personMonitorPerson', // 根据机构待布控人员
    url: '/business/personMonitor/monitorPerson/:orgId',
    methods: ['get']
  },{
    name: 'getCertificationLst', // 获取认证人员列表
    url: '/business/certification',
    methods: ['get']
  },{
    name: 'getPopulationAlarmLst', // 获取人员告警列表
    url: '/business/palarm',
    methods: ['get']
  },{
    name: 'handleAlarm', // 处理告警
    url: '/business/palarm/alarm//:alarmId/:state',
    methods: ['put']
  },
  {
    name: 'getTargetPerson', //获取待布控人员信息
    url: '/business/personMonitor/monitorPerson/:orgId',
    methods: ['get']
  },
  {
    name: 'getTargetArea', //获取待布控设备信息
    url: '/business/personMonitor/monitorDevices/:orgId',
    methods: ['get']
  }, {
    name: 'addPopulation', //新增人员
    url: '/business/population',
    methods: ['post']
  }, {
    name: 'editPopulation', //编辑人员
    url: '/business/population/:personId',
    methods: ['put']
  }, {
    name: 'getPopulationById', //获取人员信息
    url: '/business/population/:orgId/:id',
    methods: ['get']
  },{
    name: 'deletePopulationById', //删除小区人员信息
    url: '/business/population/:organId/:id',
    methods: ['delete']
  }, {
    name: 'editPersonPic', //修改头像
    url: '/business/population/picture/:personId',
    methods: ['put']
  },{
    name: 'editEnclosure', //修改附件
    url: '/business/population/updateImg/:personId',
    methods: ['put']
  },{
    name: 'importPopulation', //导入人员
    url: '/business/population/import/:organId',
    methods: ['post']
  }, {
    name: 'downTemplate', //下载人员导入模板
    url: '/business/population/template',
    methods: ['get']
  }, {
    name: 'reHandleEntranceGuard', //重新下发门禁信息
    url: '/business/population/entranceGuard/:personId',
    methods: ['put']
  }, {
    name: 'getHandleEntranceGuard', //查询人口门禁下发记录
    url: '/business/population/entranceGuard/:orgId/:personId',
    methods: ['get']
  }, {
    name: 'getVistorList', //访客列表
    url: '/business/population/vistor/pageList',
    methods: ['get']
  }, {
    name: 'getAttentionPerson', //关注人员列表
    url: '/business/library/personLst',
    methods: ['get']
  }, {
    name: 'addAttentionPerson', //新增关注人员
    url: '/business/library/person',
    methods: ['post']
  }, {
    name: 'delAttentionPerson', //移除关注人员
    url: '/business/library/person/:libraryId/:personId',
    methods: ['delete']
  }, {
    name: 'getPersonFollow', //获取尾随告警列表
    url: '/business/personFollow/alarms',
    methods: ['get']
  }, {
    name: 'dealPersonFollow', //处理尾随告警详情
    url: '/business/personFollow/alarm/:eventId/:state',
    methods: ['put']
  },
  {
    name: 'oneThreeList', //一标三实列表
    url: '/business/openDoorRecord/list',
    methods: ['get']
  },
  {
    name: 'oneThreeXls', //一标三实导出
    url: '/business/openDoorRecord/exportXls',
    methods: ['get'],
    responseType: ['blob']
  }, {
    name: 'populationHouseList', //访客列表
    url: '/business/populationHouse/list',
    methods: ['get']
  }, {
    name: 'populationHouseApproval', //访客列表
    url: '/business/populationHouse/approval',
    methods: ['post']
  },{
    name: 'removeWechatEr', //访客列表
    url: '/business/certification/removeWechatEr/:id',
    methods: ['put']
  }
]
