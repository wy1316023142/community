export default [{
  name: 'addVehicle', // 新增车辆
  url: '/business/cvehicle',
  methods: ['post', 'put']
},{
  name: 'vehicleList', // 车辆列表
  url: '/business/cvehicle/pageList',
  methods: ['post']
},{
  name: 'getVehicleMonitor', // 获取布控信息
  url: '/business/vMonitor/:id',
  methods: ['get']
},{
  name: 'deleteVehicle', // 删除车辆
  url: '/business/cvehicle/:id',
  methods: ['delete']
},{
  name: 'addVehicleMonitor', // 新增修改布控任务
  url: '/business/vMonitor',
  methods: ['post', 'put']
},{
  name: 'vehicleMonitorList', // 布控任务列表
  url: '/business/vMonitor/pageList',
  methods: ['post']
},{
  name: 'deleteVehicleMonitor', // 删除任务
  url: '/business/vMonitor/:id',
  methods: ['delete']
},{
  name: 'startOrStopTask', // 新增修改布控任务
  url: '/business/vMonitor/:id',
  methods: ['put']
},{
  name: 'alarmList', // 获取告警分页列表
  url: '/business/valarm',
  methods: ['post']
},{
  name: 'mark', // 标记告警信息,忽略或标记为嫌疑人
  url: '/business/valarm/mark',
  methods: ['put']
},{
  name: 'history', // 获取告警历史轨迹
  url: '/business/valarm/history/:licenseNumber',
  methods: ['get']
},{
  name: 'vehicleRecord', // 获取车辆进出记录
  url: '/business/cvehicle/vehicleRecord',
  methods: ['post']
},{
  name: 'getMonitorVehicle', // 获取布控目标
  url: '/business/vMonitor/monitorVehicle/:orgId',
  methods: ['get']
},{
  name: 'getMonitorArea', // 获取布控目标
  url: '/business/vMonitor/monitorDevices/:orgId',
  methods: ['get']
},
]
