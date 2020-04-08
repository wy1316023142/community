export default [
    {
        name: 'realEntityList', // 实有单位列表
        url: '/business/company/pageList',
        methods: ['get']
    },
    {
        name: 'addRealEntity', // 新增实有单位
        url: '/business/company',
        methods: ['post']
    },
    {
        name: 'editRealEntity', // 编辑实有单位
        url: '/business/company/:id',
        methods: ['put']
    },
    {
        name: 'deleteRealEntity', // 删除实有单位
        url: '/business/company/:id',
        methods: ['delete']
    },
    {
        name: 'practitionersList', // 从业人员列表
        url: '/business/practitioners/page',
        methods: ['get']
    },
    {
        name: 'addPractitioners', // 新增从业人员
        url: '/business/practitioners',
        methods: ['post']
    },
    {
        name: 'editaddPractitioners', // 编辑从业人员
        url: '/business/practitioners',
        methods: ['put']
    },
    {
        name: 'deletePractitioners', // 删除从业人员
        url: '/business/practitioners/:id',
        methods: ['delete']
    },
    {
        name: 'getPractitioners', // 获取从业人员信息
        url: '/business/practitioners/:id',
        methods: ['get']
    },
    {
        name: 'companyClassify', // 辖区单位分类统计
        url: '/business/company/companyClassify',
        methods: ['get']
    },
    {
        name: 'companyDistribution', // 辖区单位分布情况
        url: '/business/company/companyDistribution',
        methods: ['get']
    },
    {
        name: 'companySurvey', // 辖区单位概况
        url: '/business/company/companySurvey',
        methods: ['get']
    },
    {
        name: 'editPersonPic1', //修改头像
        url: '/business/population/picture/:personId',
        methods: ['put']
      },
      {
        name: 'propertyPersonList', // 物业负责人列表
        url: '/business/propertyOrgan/list',
        methods: ['get']
    },
      {
        name: 'addPropertyPerson', // 新增物业负责人
        url: '/business/propertyOrgan/add',
        methods: ['post']
    },
    {
        name: 'editPropertyPerson', // 编辑物业负责人
        url: '/business/propertyOrgan/edit',
        methods: ['put']
    },
    {
        name: 'deletePropertyPerson', // 删除物业负责人
        url: '/business/propertyOrgan/delete',
        methods: ['delete']
    },
    {
        name: 'findPropertyPerson', // 查找
        url: '/business/propertyOrgan/queryById',
        methods: ['get']
    },
    {
        name: 'editPropertyPersonPic', // 修改头像
        url: '/business//propertyOrgan/upPic/:proId',
        methods: ['put']
    },
    {
        name: 'getSelectData', // 查询小区
        url: '/system/organ',
        methods: ['get']
    },
    {
        name: 'addVoting', // 新增投票
        url: '/business/activity',
        methods: ['post']
    },
    {
        name: 'getVotingList', // 投票分页列表
        url: '/business/activity/pageList',
        methods: ['get']
    },
    {
        name: 'seachVoting', // 获取一条投票查询
        url: '/business/activity/:id',
        methods: ['get']
    },
    {
        name: 'editVoting', // 修改投票查询
        url: '/business/activity/:id',
        methods: ['put']
    },
    {
        name: 'deleteVotingById', // 删除投票
        url: '/business/activity/:id',
        methods: ['delete']
    },
    {
        name: 'stopVotingById', // 结束投票
        url: '/business/activity/stop/:id',
        methods: ['put']
    },
    
    {
        name: 'votingDetaols', // 投票详情
        url: '/business/activity/details/:id',
        methods: ['get']
    },
    {
        name: 'votingManageList', // 投票管理人分页列表
        url: '/business/candidate/page',
        methods: ['get']
    },
    {
        name: 'votingManageAdd', // 投票管理人新增
        url: '/business/candidate',
        methods: ['post']
    },
    {
        name: 'votingManageEdit', // 投票管理人编辑
        url: '/business/candidate',
        methods: ['put']
    },
    {
        name: 'votingManageDelete', // 投票管理人删除
        url: '/business/candidate/:id',
        methods: ['delete']
    },
]