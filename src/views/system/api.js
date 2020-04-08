export default [{
    name: 'addOrganType', // 新增机构类型
    url: '/system/organType',
    methods: ['post']
},{
  name: 'modfiyOrganType', // 修改机构类型
  url: '/system/organType/:id',
  methods: ['put']
},{
    name: 'organTypeList', // 机构类型列表
    url: '/system/organType/pageList',
    methods: ['get']
},{
    name: 'deleteOrganType', // 删除机构类型
    url: '/system/organType/:id',
    methods: ['delete']
},{
  name: 'getOrganTypeList', // 获取机构类型
  url: '/system/organType',
  methods: ['get']
},{
  name: 'addOrgan', // 新增机构类型
  url: '/system/organ',
  methods: ['post', 'put']
},{
  name: 'modifyOrgan', // 修改机构类型
  url: '/system/organ/:id',
  methods: ['put']
},{
  name: 'organList', // 机构类型列表
  url: '/system/organ/pageList',
  methods: ['get']
},{
  name: 'deleteOrgan', // 删除机构类型
  url: '/system/organ/:id',
  methods: ['delete']
},{
  name: 'addRole', // 新增角色
  url: '/system/role',
  methods: ['post', 'put']
},{
  name: 'modifyRole', // 修改角色
  url: '/system/role/:id',
  methods: ['put']
},{
  name: 'roleList', // 角色列表
  url: '/system/role/pageList',
  methods: ['get']
},{
  name: 'deleteRole', // 删除角色
  url: '/system/role/:id',
  methods: ['delete']
},{
  name: 'addUser', // 新增用户
  url: '/system/user',
  methods: ['post', 'put']
},{
  name: 'modifyUser', // 修改用户
  url: '/system/user/:id',
  methods: ['put']
},{
  name: 'userList', // 用户列表
  url: '/system/user/pageList',
  methods: ['get']
},{
  name: 'deleteUser', // 删除用户
  url: '/system/user/:id',
  methods: ['delete']
},{
  name: 'getRolePermissionsTree', //
  url: '/system/resource/treeList',
  methods: ['get']
},{
  name: 'rolePermissions', // 角色授权
  url: '/system/role/grant/:id',
  methods: ['put']
},{
  name: 'getUserPermissionsTree', //
  url: '/system/role',
  methods: ['get']
},{
  name: 'userPermissions', // 用户授权
  url: '/system/user/grant/:id',
  methods: ['put']
},{
  name: 'getRolePermissions', // 获取角色权限
  url: '/system/role/resources/:id',
  methods: ['get']
},{
  name: 'getUserPermissions', // 获取用户权限
  url: '/system/user/role/:id',
  methods: ['get']
},{
  name: 'logList', // 获取用户权限
  url: '/system/log',
  methods: ['get']
},{
  name: 'resetPwd', // 重置密码
  url: '/system/user/resetPwd/:userId',
  methods: ['put']
},{
  name: 'storageConfigSave', // 存储周期配置
  url: '/business/storageConfig/save',
  methods: ['post']
}
,{
  name: 'storageConfigDetails', // 存储周期配置
  url: '/business//storageConfig/list/:organId',
  methods: ['get']
}
]
