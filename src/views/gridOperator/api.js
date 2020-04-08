export default [
    {
    name: 'AreaPageList', // 新增自改
    url: '/system/user/area/pageList',
    methods: ['get']
  },
  {
    name: 'startStop', // 启动停用
    url: '/system/user/:userId/:flag',
    methods: ['put']
  },{
    name: 'getAreaUserPermissionsTree', //获取权限列表
    url: '/business/unit/units/:villageId',
    methods: ['get']
  },{
    name: 'getAreaUserPermission', //获取用户权限
    url: '/system/user/area/role/:userId',
    methods: ['get']
  },{
    name: 'userAreaPermissions', //用户权限
    url: '/system/user/area/grant/:userId',
    methods: ['put']
  },
  {
    name: 'getAreaPageList', //网格执行情况查询
    url: '/business/area/task/pageList',
    methods: ['get']
  },
  {
    name: 'implementation', //网格--上门关怀
    url: '/business/taskConcerns/implementation/pageList',
    methods: ['get']
  },
  {
    name: 'houseTree', //单元树
    url: '/business/area/units/:userId',
    methods: ['get']
  },
  {
    name: 'getHouseLiat', //房屋列表
    url: '/business/house/houses/:unitId',
    methods: ['get']
  },
  {
    name: 'editHouseLiat', //房屋编辑
    url: '/business/house/status/:houseId',
    methods: ['put']
  },
  {
    name: 'getHouseInfo', //获取房屋录入信息
    url: '/business/area/house/census/:userId',
    methods: ['get']
  },
  {
    name: 'getAbnormalaList', //网格告警
    url: '/business/area/error/alarm/pageList',
    methods: ['get']
  },
]