export default [
  {
  name: 'getVideoRtmp', // 获取rtmp播放地址
  url: '/business/gbDevice/getUrlByNaming.do',
  methods: ['get']
  },{
    name: 'getEquipmentList', // 获取rtmp播放地址
    url: '/system/organ/getGBDeviceTreeByParentId',
    methods: ['get']
} ,{
    name: 'getAlarmPanelCamera', // 获取rtmp播放地址
    url: '/business/alarmPanel/getAlarmPanelCamera',
    methods: ['get']
}]
