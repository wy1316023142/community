export default [
    {
        name: 'ResidentSearchPageList', //居民申报
        url: '/business/epidemicDeclarationResident/searchPageList',
        methods: ['get']
    },
   
    {
        name: 'WorkersSearchPageList', //单位职工申报
        url: '/business/epidemicDeclarationWorkers/searchPageList',
        methods: ['get']
    },
    {
        name: 'getIndustry', //获取行业
        url: '/system/sys/dictItem/queryByDictId?dictId=b9b4fa9acdacfaca690501eb5057a9a9',
        methods: ['get']
    },
    {
        name: 'epidemicEnterpriseDeclaration', //企业复工
        url: '/business/epidemicEnterpriseDeclaration/searchPageList',
        methods: ['get']
    },
    {
        name: 'enterpriseFiles', //附件下载
        url: '/business/epidemicEnterpriseDeclaration/enterpriseFiles',
        methods: ['get']
    },
   
]