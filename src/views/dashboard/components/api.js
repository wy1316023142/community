export default [
    {
        name: 'hiOpenDoorNumber', // 开门记录
        url: 'http://222.211.78.60:9103/bigscreen/statistics/openDoorNumber/:orgId',
        methods: ['get']
      },
      {
        name: 'hlVehicleNumber', // 过车感知
        url: 'http://222.211.78.60:9103/bigscreen/statistics/vehicleNumber/:orgId',
        methods: ['get']
      },
      {
        name: 'hlRfidRecordNum', // 非机动车
        url: 'http://222.211.78.60:9103/bigscreen/statistics/rfidRecordNum/:orgId',
        methods: ['get']
      },
      {
        name: 'hlThrough', // 出入口通行统计
        url: 'http://222.211.78.60:9103/bigscreen/statistics/through/:organId',
        methods: ['get']
      },
      {
        name: 'hlPropertyOrgan', // 物业负责人
        url: 'http://222.211.78.60:9103/bigscreen/statistics/getPropertyOrgan/:id',
        methods: ['get']
      },
      {
        name: 'hlPHONumber', // 一标三实
        url: 'http://222.211.78.60:9103/bigscreen/statistics/getPHONumber/:orgId',
        methods: ['get']
      },
      {
        name: 'hlFaceRecordNum', // 人脸识别
        url: 'http://222.211.78.60:9103/bigscreen/statistics/faceRecordNum/:orgId',
        methods: ['get']
      },
      {
        name: 'hlAlarmStatistics', // 报警统计
        url: 'http://222.211.78.60:9103/bigscreen/statistics/alarmStatistics/:orgId',
        methods: ['get']
      },
]