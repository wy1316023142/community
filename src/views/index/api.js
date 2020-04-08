export default [
  {
    name: 'indexStatistics', // 获取政府首页人员数统计
    url: '/business/governmentHome/personStatistics',
    methods: ['get']
  },
  {
    name: 'indexNewAlarm', // 获取政府首页最新一条告警信息
    url: '/business/governmentHome/newestAlarm',
    methods: ['get']
  },
  {
    name: 'analysisModel', // 获取政府首页建立的分析模型
    url: '/business/governmentHome/analysisModel',
    methods: ['get']
  },
  {
    name: 'addAnalysisModel', // 新增分析模型
    url: '/business/governmentHome/analysisModel',
    methods: ['post']
  },
  {
    name: 'editAnalysisModel', // 编辑分析模型
    url: '/business/governmentHome/analysisModel/:id',
    methods: ['put']
  },
  {
    name: 'indexAlarmList', // 编辑分析模型
    url: '/business/governmentHome/analysisModel/alarms/:id',
    methods: ['get']
  },
  {
    name: 'getEventsData', // 编辑分析模型
    url: '/business/event/list',
    methods: ['get']
  },
  {
    name: 'getAlarmData', // 编辑分析模型
    url: '/business/deviceAlarm',
    methods: ['get']
  },
  {
    name: 'getPopAlarmById', // 编辑分析模型
    url: '/business/palarm/popalarm/:id',
    methods: ['get']
  },
  {
    name: 'getVehicleAlarmById', // 编辑分析模型
    url: '/business/valarm/:id',
    methods: ['get']
  },
  {
    name: 'getAlarmCensus', // 编辑分析模型
    url: '/business/deviceAlarm/census',
    methods: ['get']
  },
  {
    name: 'getEventCensus', // 编辑分析模型
    url: '/business/event/census',
    methods: ['get']
  },
  {
    name: 'getEventStatistcs', // 编辑分析模型
    url: '/business/event/statistics',
    methods: ['get']
  },
  {
    name: 'getUserConfigVideoList', // 获取视频集
    url: 'business/device/getUserConfigVideoList/:userId',
    methods: ['get']
  },
  {
    name: 'setUserConfigVideoList', // 设置用户视频记录
    url: 'business/device/setUserConfigVideoList/:naming/:num/:userId',
    methods: ['put']
  },
  {
    name: 'wisdomSeachFeatures', // 获取人脸特征
    url: 'business/search/libary/startQuery',
    methods: ['post']
  },
  {
    name: 'wisdomSeachList', // 获取图片列表
    url: 'business/search/libary/query',
    methods: ['post']
  },
]
