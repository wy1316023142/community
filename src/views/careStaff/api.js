export default [
    {
    name: 'getAddPageList', // 新增查询
    url: '/business/personnelConcerns/queryNotConcernsPopulationPage',
    methods: ['get']
  },
  {
    name: 'getPageList', // 查询 
    url: '/business/personnelConcerns/queryPageList',
    methods: ['get']
  },
  {
    name: 'addList', // 新增
    url: '/business/personnelConcerns/add',
    methods: ['post']
  },
  {
    name: 'editList', // 修改
    url: '/business/personnelConcerns/edit',
    methods: ['put']
  },
  {
    name: 'getPersonType', // 取消关注
    url: '/business/personnelConcerns/getPersonType',
    methods: ['get']
  },
  {
    name: 'unfollow', // 取消关注
    url: '/business/personnelConcerns/unfollow',
    methods: ['put']
  },
  {
    name: 'gooutRecords', // 进出记录
    url: '/business/personnelConcerns/peopleInOrOutRecordByPage',
    methods: ['get']
  },
  {
    name: 'careRecords', // 关怀记录
    url: '/business/personnelConcerns/concernsRecordByPopulationId',
    methods: ['get']
  },
  {
    name: 'taskNoAppear', // 长时间未出入查询
    url: '/business/taskNoAppear/queryPageList',
    methods: ['get']
  },
  {
    name: 'addTaskNoAppear', // 长时间未出入新增
    url: '/business/taskNoAppear/add',
    methods: ['post']
  },
  {
    name: 'editTaskNoAppear', // 长时间未出入修改，删除，停止，开始
    url: '/business/taskNoAppear/edit',
    methods: ['put']
  },
  {
    name: 'getTaskNoAppear', // 长时未出入>关怀人员查询
    url: '/business/taskNoAppear/concernsPeopleByTask',
    methods: ['get']
  },
  {
    name: 'getAddTaskNoAppear', // 长时未出入>关怀人员新增查询
    url: '/business/taskNoAppear/queryConcernsByNotRelevance',
    methods: ['get']
  },
  {
    name: 'choose', // 长时未出入>关怀人员选择
    url: '/business/taskNoAppear/taskNoAppearRelevanceInsert',
    methods: ['put']
  },
  {
    name: 'remove', // 长时未出入>关怀人员选择
    url: '/business/taskNoAppear/taskNoAppearRelevanceDelete',
    methods: ['put']
  },
  {
    name: 'noAppearAlarmByPage', //异常告警
    url: '/business/taskNoAppear/noAppearAlarmByPage',
    methods: ['get']
  },
  {
    name: 'outAlarmState', //解除异常
    url: '/business/taskNoAppear/outAlarmState',
    methods: ['put']
  },
  {
    name: 'goCareSeach', //上门关怀查询
    url: '/business/taskConcerns/pageList',
    methods: ['get']
  },
  {
    name: 'addCareTask', //上门关怀新增
    url: '/business/taskConcerns',
    methods: ['post']
  },
  {
    name: 'editCareTask', //上门关怀新增
    url: '/business/taskConcerns/:id',
    methods: ['put']
  },
  {
    name: 'delCareTask', //上门关怀删除
    url: '/business/taskConcerns/:id',
    methods: ['delete']
  },
  {
    name: 'stopCareTask', //上门关怀停止任务
    url: '/business/taskConcerns/:id/:taskFlag',
    methods: ['put']
  },
  {
    name: 'records', //上门关怀查看详情查询
    url: '/business/taskConcerns/records',
    methods: ['get']
  },
  {
    name: 'toDeails', //上门关点击怀查看详情
    url: '/business/taskConcerns/records/details',
    methods: ['get']
  },
  {
    name: 'concernsPersonnel', //上门关怀 关怀人员
    url: '/business/taskConcerns/concernsPersonnel',
    methods: ['get']
  },
  { 
    name: 'waitConcernsPersonnel', //上门关怀 关怀人员 新增
    url: '/business/taskConcerns/waitConcernsPersonnel',
    methods: ['get']
  },
  { 
    name: 'chooseCare', //上门关怀 关怀人员 新增 选择
    url: '/business/taskConcerns/concernsPersonnel/:taskId/:populationId',
    methods: ['put']
  },
  { 
    name: 'delChooseCare', //上门关怀 关怀人员 新增 取消
    url: '/business/taskConcerns/concernsPersonnel/:taskId/:populationId',
    methods: ['delete']
  },
]