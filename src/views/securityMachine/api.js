export default [
    {
        name: 'securityPageList', // 查询
        url: '/business/safeMachine/pageList',
        methods: ['get']
      },
      {
        name: 'DelesecurityPageList', // 删除
        url: '/business/safeMachine/:id',
        methods: ['delete']
      },
      {
        name: 'addSecurity', // 新增
        url: '/business/safeMachine',
        methods: ['post']
      },
      {
        name: 'editSecurity', // 修改
        url: '/business/safeMachine',
        methods: ['put']
      },
      {
        name: 'securityOne', // 模糊查询
        url: '/business/safeMachine/:name/:safeMachineOrganId',
        methods: ['get']
      },
      
]