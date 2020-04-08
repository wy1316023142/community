export default [{
  name: 'addVideoDevice', // 新增视频设备
  url: '/business/gbDevice/save',
  methods: ['put']
}, {
  name: 'videoDeviceList', // 视频设备列表
  url: '/business/gbDevice/getDevicesByOrganId',
  methods: ['post']
}, {
  name: 'deleteVideoDevice', // 删除视频设备
  url: '/business/gbDevice/delAssign/:organId/:id',
  methods: ['delete']
}, {
  name: 'videoDeviceTable', // 未分配视频设备列表
  url: '/business/gbDevice/tables',
  methods: ['post']
}, {
  name: 'batchAssignVideoDevice', // 分配视频设备
  url: '/business/gbDevice/batchAssign',
  methods: ['post']
}, {
  name: 'addAccessControl', // 新增门禁设备
  url: '/business/accessControl',
  methods: ['post']
}, {
  name: 'modifyAccessControl', // 新增门禁设备
  url: '/business/accessControl/:id',
  methods: ['put']
}, {
  name: 'accessControlList', // 门禁设备列表
  url: '/business/accessControl/pageList',
  methods: ['get']
}, {
  name: 'deleteAccessControl', // 删除门禁设备
  url: '/business/accessControl/:id',
  methods: ['delete']
}, {
  name: 'addVehicleSnap', // 新增车辆抓拍机设备
  url: '/business/vehicleSnap',
  methods: ['post']
}, {
  name: 'modifyVehicleSnap', // 新增车辆抓拍机设备
  url: '/business/vehicleSnap/:id',
  methods: ['put']
}, {
  name: 'vehicleSnapList', // 车辆抓拍机设备列表
  url: '/business/vehicleSnap/pageList',
  methods: ['get']
}, {
  name: 'deleteVehicleSnap', // 删除车辆抓拍机
  url: '/business/vehicleSnap/:id',
  methods: ['delete']
}, {
  name: 'DeviceGroups', // 获取天网分组列表
  url: '/business/gbDeviceGroup/getSetDeviceGroupsByOrganId',
  methods: ['post']
}, {
  name: 'addDeviceGroup', // 新增天网分组
  url: '/business/gbDeviceGroup/save',
  methods: ['put']
}, {
  name: 'deleteGroup', // 删除天网分组
  url: '/business/gbDeviceGroup/:id',
  methods: ['delete']
},{
  name: 'deleteGroupDevice', // 删除天网分组设备
  url: '/business/gbDeviceGroup/assignGroupUpdate',
  methods: ['post']
}, {
  name: 'groupTables', // 获取分组设备列表
  url: '/business/gbDeviceGroup/groupDeviceTables',
  methods: ['post']
}, {
  name: 'batchAssignGroupUpdate', // 获取天网分组列表
  url: '/business/gbDeviceGroup/batchAssignGroupUpdate',
  methods: ['post']
}, {
  name: 'addMapCustomResource', // 新增自定义资源分组
  url: '/business/mapCustomResource',
  methods: ['post']
}, {
  name: 'modifyMapCustomResource', // 修改自定义资源分组
  url: '/business/mapCustomResource/:id',
  methods: ['put']
}, {
  name: 'deleteMapCustomResource', // 删除自定义资源分组
  url: '/business/mapCustomResource/:id',
  methods: ['delete']
}, {
  name: 'mapCustomResourceList', // 自定义资源分组列表
  url: '/business/mapCustomResource',
  methods: ['get']
}, {
  name: 'addMapLayerResourceType', // 新增资源图层
  url: '/business/mapLayerResourceType',
  methods: ['post']
}, {
  name: 'modifyMapLayerResourceType', // 修改资源图层
  url: '/business/mapLayerResourceType/:id',
  methods: ['put']
}, {
  name: 'deleteMapLayerResourceType', // 删除资源图层
  url: '/business/mapLayerResourceType/:id',
  methods: ['delete']
}, {
  name: 'mapLayerResourceTypePageList', // 资源图层列表
  url: '/business/mapLayerResourceType/pageList',
  methods: ['get']
}, {
  name: 'mapLayerResourceTypeList', // 资源图层列表
  url: '/business/mapLayerResourceType',
  methods: ['get']
}, {
  name: 'getMapResource', // 编辑资源
  url: '/business/mapResource/:id',
  methods: ['get']
}, {
  name: 'addMapResource', // 新增资源
  url: '/business/mapResource',
  methods: ['post']
}, {
  name: 'modifyMapResource', // 修改资源
  url: '/business/mapResource/:id',
  methods: ['put']
}, {
  name: 'deleteMapResource', // 删除资源
  url: '/business/mapResource/:id',
  methods: ['delete']
}, {
  name: 'mapResourceList', // 资源列表
  url: '/business/mapResource/pageList',
  methods: ['get']
}, {
    name: 'addMapResourceImg', // 新增资源图片
  url: '/business/mapResource/img',
  methods: ['post']
}, {
  name: 'deleteMapResourceImg', // 删除资源图片
  url: '/business/mapResource/img/:id',
  methods: ['delete']
},{
  name: 'getGbDevice', // 获取天网设备
  url: '/business/gbDevice/getDevicesByOrganId',
  methods: ['post']
}, {
  name: 'addOrganGBUser', // 新增天网账号
  url: '/business/organGBUser',
  methods: ['post']
}, {
  name: 'modifyOrganGBUser', // 修改天网账号
  url: '/business/organGBUser/:id',
  methods: ['put']
}, {
  name: 'deleteOrganGBUser', // 删除天网账号
  url: '/business/organGBUser/:id',
  methods: ['delete']
}, {
  name: 'organGBUserList', // 天网账号列表
  url: '/business/organGBUser/pageList',
  methods: ['get']
}, {
  name: 'syncOrganGBUser', // 同步
  url: '/business/organGBUser/sync/:id',
  methods: ['get']
}, {
  name: 'personSnapList', // 人脸抓拍机管理查询抓拍机列表
  url: '/business/faceSnap/pageList',
  methods: ['get']
}, {
  name: 'delPersonSnap', // 删除人脸抓拍机
  url: '/business/faceSnap/:id',
  methods: ['delete']
}, {
  name: 'addPersonSnap', // 增加人脸抓拍机
  url: '/business/faceSnap',
  methods: ['post']
}, {
  name: 'editPersonSnap', // 增加人脸抓拍机
  url: '/business/faceSnap/:id',
  methods: ['put']
},{
  name: 'addSipGreoup', // 新增呼叫组
  url: '/business/sip/group',
  methods: ['post']
},{
  name: 'editSipGreoup', // 修改呼叫组
  url: '/business/sip/group/:id',
  methods: ['put']
},{
  name: 'deleteSipGreoup', // 删除呼叫组
  url: '/business/sip/group/:id',
  methods: ['delete']
},{
  name: 'sipGreoupList', // 获取呼叫组列表
  url: '/business/sip/group/pageList',
  methods: ['get']
},{
  name: 'sipGroupUserList', // 获取用戶列表
  url: '/sytem/user',
  methods: ['get']
},{
    name: 'alarmPenalList', // 获取设备列表
    url: '/business/alarmPanel',
    methods: ['get']
  },{
    name: 'addGuard', // 新增门卫机版本
    url: '/business/device/ver',
    methods: ['post']
  },{
    name: 'getGuardList', //分页查询门卫机版本
    url: '/business/device/ver/pageList',
    methods: ['get']
  },{
    name: 'editGuard', //修改门卫机版本
    url: '/business/device/ver/:id',
    methods: ['put']
  },{
    name: 'deleteGuard', //删除门卫机版本
    url: '/business/device/ver/:id',
    methods: ['delete']
  },{
    name: 'getDeviceType', //获取设备类型
    url: '/business/device/type',
    methods: ['get']
  },{
    name: 'getDeviceFactory', //获取设备厂家
    url: '/system/commonType',
    methods: ['get']
  }, {
    name: 'batchHandle', // 新增天网分组
    url: '/business/deviceAlarm/batchHandle',
    methods: ['post']
  },
  {
    name: 'offlineList', // 编辑分析模型
    url: '/business/deviceAlarm/offline',
    methods: ['get']
  },

]
