export default [
    {
    name: 'auditList', // 获取审核列表
    url: '/business/stPopulation/list',
    methods: ['get']
    },
    {
        name: 'approval', // 获取审核列表
        url: '/business/stPopulation/approval/:id/:status',
        methods: ['put']
    },
]
  