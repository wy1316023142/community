export default [{
  name: 'rfidRecordList', // 非机动车进出记录
  url: '/business/rfidrecord',
  methods: ['post']
},{
  name: 'getRfidrecord', // 非机动车进出记录
  url: '/business/rfidrecord/:id',
  methods: ['get']
}, {
  name: 'dealRfidrecord', // 处理记录接口
  url: '/business/rfidrecord',
  methods: ['put']
},{
  name: 'rfidList', // 非机动车列表
  url: '/business/rfid/pageList',
  methods: ['post']
}, {
  name: 'addRFID', // 新增非机动车
  url: '/business/rfid',
  methods: ['post', 'put']
}, {
  name: 'deleteRFID', // 删除非机动车
  url: '/business/rfid/:id',
  methods: ['delete']
}, {
  name: 'getRFIDById',//查看详情
  url: '/business/rfid/:id',
  methods: ['get']
}]
