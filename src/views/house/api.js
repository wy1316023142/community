export default [
  {
    name: 'getDistrictStatistics', // 获取辖区统计数据，type统计类别(1:小区；2:单元)
    url: '/business/village/districtStatistics/:id/:type',
    methods: ['get']
  },{
    name: 'getbuildingLst', // 获取机构下楼栋列表信息
    url: '/business/village/buildings/:organId',
    methods: ['get']
  },{
    name: 'getUnitTreesByOrganId', // 获取机构下小区单元树
    url: '/business/unit/unitTrees/:organId',
    methods: ['get']
  },{
    name: 'getUnitsByVillageId', // 获取小区下单元列表信息
    url: '/business/unit/units/:villageId',
    methods: ['get']
  },{
    name: 'getUnitById', // 获取单元详细信息
    url: '/business/unit/:id',
    methods: ['get']
  },{
    name: 'addUnit', // 新增单元信息
    url: '/business/unit',
    methods: ['post']
  },{
    name: 'updateUnit', // 修改单元信息
    url: '/business/unit/:id',
    methods: ['put']
  },{
    name: 'deleteUnit', // 删除单元信息
    url: '/business/unit/:id',
    methods: ['delete']
  },{
    name: 'getHousesByUnitId', // 获取单元下房屋列表
    url: '/business/house/houses/:unitId',
    methods: ['get']
  },{
    name: 'getHousesById', // 获取获取房屋详情
    url: '/business/house/:id',
    methods: ['get']
  },{
    name: 'addHouse', // 新增房屋
    url: '/business/house',
    methods: ['post']
  },{
    name: 'updateHouse', // 修改房屋
    url: '/business/house/:id',
    methods: ['put']
  },{
    name: 'deleteHouse', // 删除房屋
    url: '/business/house/:id',
    methods: ['delete']
  },{
    name: 'setHouseholder', // 设置业主
    url: '/business/house/person/householder/:houseId/:personId',
    methods: ['put']
  },{
    name: 'removePerson', // 移除人员
    url: '/business/house/person/:houseId/:personId',
    methods: ['delete']
  },{
    name: 'houseDetails', // 获取房屋人员详情
    url: '/business/house/person/:houseId',
    methods: ['get']
  },{
    name: 'selectPerson', //搜索
    url: '/business/house',
    methods: ['get']
  },{
    name: 'addHousePerson', //人员入住房屋
    url: '/business/house/addPerson',
    methods: ['post']
  },{
    name: 'editLiveType', //修改人员入住类型
    url: '/business/house/updatePerson',
    methods: ['post']
  },{
    name: 'getHouseByFloorNum', //获取单元下某一层房屋列表
    url: '/business/house/houses/:unitId/:inFloorNum',
    methods: ['get']
  },{
    name: 'getTenantHouseByUnitId', //获取单元下房屋列表
    url: '/business/tenantHouse/houses/:unitId',
    methods: ['get']
  },{
    name: 'getVillageCascadeList', //获取小区级联
    url: '/business/village/cascadeList',
    methods: ['get']
  },{
    name: 'getTenantPersonRegisterLst', //获取租客登记信息
    url: '/business/tenantHouse/register/:houseId',
    methods: ['get']
  },{
    name: 'getHouseTenantPersonDetails', // 获取房屋租客人员详情
    url: '/business/house/person/:houseId/2',
    methods: ['get']
  },{
    name: 'getTenantHouseStatistics', // 获取出租屋统计
    url: '/business/tenantHouse/statistics/:organId',
    methods: ['get']
  },{
    name: 'getTenantInOutStatistics', // 获取出租屋统计
    url: '/business/tenantHouse/tenantInOutStatistics/:organId/:type/:range',
    methods: ['get']
  },
  ,{
    name: 'rentingHouseManagerList', // 获取出租屋列表
    url: '/business/tenantHouse/pageList',
    methods: ['get']
  }
  ,{
    name: 'populationHouseTenantPageList', // 获取退房入住列表
    url: '/business/tenantHouse/populationHouseTenantPageList',
    methods: ['get']
  }
  ,{
    name: 'rentingList', // 获取租客列表
    url: '/business/population/tenant/pageList',
    methods: ['get']
  }
  ,{
    name: 'cancelhouseholder', // 获取租客列表
    url: '/business/house/person/cancelhouseholder/:houseId/:personId',
    methods: ['put']
  }
  ,{
    name: 'deleteTenant', // 移除人员
    url: '/business/population/tenant/:id',
    methods: ['delete']
  }
  ,{
    name: 'rentingGrant', // 获取租客列表
    url: '/business/population/tenant/grant',
    methods: ['post']
  },{
    name: 'limitNumlist', // 超限分页
    url: '/business/house/limitNumlist',
    methods: ['get']
  } ,{
    name: 'limitHouseNumConfig', // 限制人数设置
    url: '/business/house/limitHouseNumConfig/:organId/:number',
    methods: ['put']
  } ,{
    name: 'limitNumMark', // 表示房屋限制
    url: '/business/house/limitNumMark/:id/:status',
    methods: ['put']
  },{
    name: 'getlimitHouseNumConfig', // 表示房屋限制
    url: '/business/house/getlimitHouseNumConfig',
    methods: ['get']
  }
]
