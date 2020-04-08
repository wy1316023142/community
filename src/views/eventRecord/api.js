export default [{
  name: 'getEventList', // 登录
  url: '/business/event/list',
  methods: ['get']
},{
  name: 'handleEvent', // 登录
  url: '/business/event/:id',
  methods: ['put']
},{
  name: 'getEvent', // 登录
  url: '/business/event/:id',
  methods: ['get']
},
{
  name: 'smsList', // 短信列表
  url: '/business/sms/ruleList',
  methods: ['get']
},
{
  name: 'smsExportXls', // 导出
  url: '/business/sms/exportXls',
  methods: ['get']
},
{
  name: 'smsInsert', // 新增短信列表
  url: '/business/sms/ruleInsert',
  methods: ['post']
},
{
  name: 'smsUpdate', // 修改短信列表
  url: '/business/sms/ruleUpdate',
  methods: ['put']
},
{
  name: 'delPeople', // 删除短信列表
  url: '/business/sms/delPeople/:id',
  methods: ['delete']
},
{
  name: 'delRule', // 删除短信列表
  url: '/business/sms/delRule/:id',
  methods: ['delete']
},
{
  name: 'smsAddPeople', // 添加短信列表
  url: '/business/sms/addPeople',
  methods: ['post']
},
{
  name: 'peopleList', // 关注人列表
  url: '/business/sms/peopleList',
  methods: ['get']
},
{
  name: 'peopleListRecep', // 接收人列表
  url: '/business/sms/peopleListRecep',
  methods: ['get']
},
{
  name: 'orgPeopleList', // 添加关注人列表
  url: '/business/sms/orgPeopleList',
  methods: ['get']
},
{
  name: 'orgUserList', // 添加接收人列表
  url: '/business/sms/orgUserList',
  methods: ['get']
},
{
  name: 'addPeople', // 添加关注接收人列表
  url: '/business/sms/addPeople',
  methods: ['post']
},
{
  name: 'sendHistoryList', // 短信明细
  url: '/business/sms/sendHistoryList',
  methods: ['get']
},
]
