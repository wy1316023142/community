import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue'
import {find, intersection, flattenDeep} from 'lodash'
import {MessageBox} from 'element-ui'

Vue.use(Router);
const router = new Router({
  base: __dirname,
  routes: [
    {
      path: '/dashboard1',
      name: 'dashboard1',
      component: () => import('@/views/dashboard/dashboard1.vue'),
      meta: {skipAuth: true}
    },
    {
      path: '/',
      name: 'root',
      redirect: {name: 'login'},
      component: () => import('@/views/Layout.vue'),
      children: [{
        path: 'indexWork',
        name: 'indexWork',
        component: () => import('@/views/index/indexWork.vue'),
        authorities: ['1001']
      }, {
        path: 'indexWel',
        name: 'indexWel',
        component: () => import('@/views/index/indexWel.vue'),
      }, {
        path: 'seachIndex',
        name: 'seachIndex',
        component: () => import('@/views/index/seachIndex.vue'),
        authorities: ['1003']
      }, {
        path: 'indexAlarm',
        name: 'indexAlarm',
        component: () => import('@/views/index/indexAlarm.vue')
      }, {
        path: 'person',
        name: 'person',
        redirect: {name: 'population'},
        component: () => import('@/views/SubLayout.vue'),
        children: [
          {
            path: 'population',
            name: 'population',
            component: () => import('@/views/person/population.vue'),
            authorities: ['3001']
          },
          {
            path: 'certification',
            name: 'certification',
            component: () => import('@/views/person/certification.vue'),
            authorities: ['3004']
          },
          {
            path: 'personMonitor',
            name: 'personMonitor',
            component: () => import('@/views/person/personMonitor.vue'),
            authorities: ['3003']
          },
          {
            path: 'openDoorRecord',
            name: 'openDoorRecord',
            component: () => import('@/views/person/openDoorRecord.vue'),
            authorities: ['3002']
          },
          {
            path: 'populationAlarm',
            name: 'populationAlarm',
            component: () => import('@/views/person/populationAlarm.vue'),
            authorities: ['3003003']
          },
          {
            path: 'visitor',
            name: 'visitor',
            component: () => import('@/views/person/visitor.vue'),
            authorities: ['3005']
          },
          {
            path: 'attentionPerson',
            name: 'attentionPerson',
            component: () => import('@/views/person/attentionPerson.vue'),
            authorities: ['3008']
          },
          {
            path: 'oneThree',
            name: 'oneThree',
            component: () => import('@/views/person/oneThree.vue'),
            authorities: ['3009']
          },
          {
            path: 'personFollowAlarm',
            name: 'personFollowAlarm',
            component: () => import('@/views/person/personFollowAlarm.vue'),
            authorities: ['3006']
          },
          {
            path: 'attentionOpenDoorRecord',
            name: 'attentionOpenDoorRecord',
            component: () => import('@/views/person/attentionOpenDoorRecord.vue')
          },
          {
            path: 'checkExamine',
            name: 'checkExamine',
            component: () => import('@/views/person/checkExamine.vue')
          },
        ]
      }, {
        path: 'system',
        name: 'system',
        redirect: {name: 'organization'},
        component: () => import('@/views/SubLayout.vue'),
        children: [
          {
            path: 'organization',
            name: 'organization',
            component: () => import('@/views/system/organization.vue'),
            authorities: ['10003']
          },
          {
            path: 'role',
            name: 'role',
            component: () => import('@/views/system/role.vue'),
            authorities: ['10001']
          },
          {
            path: 'user',
            name: 'user',
            component: () => import('@/views/system/user.vue'),
            authorities: ['10002']
          },
          {
            path: 'organizationType',
            name: 'organizationType',
            component: () => import('@/views/system/organizationType.vue'),
          },
          {
            path: 'operationLog',
            name: 'operationLog',
            component: () => import('@/views/system/operationLog.vue')
          }
        ]
      }, {
        path: 'vehicle',
        name: 'vehicle',
        redirect: {name: 'vehicleList'},
        component: () => import('@/views/SubLayout.vue'),
        children: [
          {
            path: 'vehicleList',
            name: 'vehicleList',
            component: () => import('@/views/vehicle/vehicle.vue'),
            authorities: ['6001001']
          },
          {
            path: 'record',
            name: 'record',
            component: () => import('@/views/vehicle/record.vue'),
            authorities: ['6001002']
          },
          {
            path: 'alarm',
            name: 'alarm',
            component: () => import('@/views/vehicle/alarm.vue'),
            authorities: ['6001004']
          },
          {
            path: 'monitor',
            name: 'monitor',
            component: () => import('@/views/vehicle/monitor.vue'),
            authorities: ['6001003']
          }
        ]
      }, {
        path: 'nonMotorized',
        name: 'nonMotorized',
        redirect: {name: 'nonMotorizedList'},
        component: () => import('@/views/SubLayout.vue'),
        children: [
          {
            path: 'nonMotorizedList',
            name: 'nonMotorizedList',
            component: () => import('@/views/nonMotorized/nonMotorizedList.vue'),
            authorities: ['6002001']
          },
          {
            path: 'nonMotorizedRecord',
            name: 'nonMotorizedRecord',
            component: () => import('@/views/nonMotorized/nonMotorizedRecord.vue'),
            authorities: ['6002002']
          }
        ]
      },
        {
          path: 'house',
          name: 'house',
          redirect: {name: 'houseList'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'transfiniteAlarm',
              name: 'transfiniteAlarm',
              component: () => import('@/views/house/transfiniteAlarm.vue'),
            },
            {
              path: 'houseList',
              name: 'houseList',
              component: () => import('@/views/house/houseList.vue'),
              authorities: ['4001']
            },
            {
              path: 'houseTenantList',
              name: 'houseTenantList',
              component: () => import('@/views/house/houseTenantList.vue'),
              authorities: ['4002']
            },
            {
              path: 'rentingHouseManager',
              name: 'rentingHouseManager',
              component: () => import('@/views/house/rentingHouseManager.vue'),
            },
            {
              path: 'houseTenantDetails',
              name: 'houseTenantDetails',
              component: () => import('@/views/house/houseTenantDetails.vue'),
            },
            {
              path: 'checkOutRecurd',
              name: 'checkOutRecurd',
              component: () => import('@/views/house/checkOutRecurd.vue'),
            },
            {
              path: 'unitList',
              name: 'unitList',
              component: () => import('@/views/house/unitList.vue'),
            },
            {
              path: 'tenantManager',
              name: 'tenantManager',
              component: () => import('@/views/house/tenantManager.vue'),
              authorities: ['3011']
            },
            {
              path: 'houseDetails',
              name: 'houseDetails',
              component: () => import('@/views/house/houseDetails.vue'),
            }
          ]
        },
        {
          path: 'resumptionWork',
          name: 'resumptionWork',
          redirect: {name: 'staffInfo'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'staffInfo',//单位职工申报信息
              name: 'staffInfo',
              component: () => import('@/views/resumptionWork/staffInfo.vue'),
            },
            {
              path: 'residentInfo',//居民申报信息
              name: 'residentInfo',
              component: () => import('@/views/resumptionWork/residentInfo.vue'),
            },
            {
              path: 'enterpriseInfo',//企业复工登记
              name: 'enterpriseInfo',
              component: () => import('@/views/resumptionWork/enterpriseInfo.vue'),
            },
            {
              path: 'enclosureUpdown',//附件下载
              name: 'enclosureUpdown',
              component: () => import('@/views/resumptionWork/enclosureUpdown.vue'),
            },
          ]
        },
        {
          path: 'gridOperator',
          name: 'gridOperator',
          redirect: {name: 'gridManager'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'gridManager',//网格员管理
              name: 'gridManager',
              component: () => import('@/views/gridOperator/gridManager.vue'),
            },
            {
              path: 'gridSituation',//网格执行情况
              name: 'gridSituation',
              component: () => import('@/views/gridOperator/gridSituation.vue'),
            },
            {
              path: 'grisldAbnormalalarm',//异常告警
              name: 'grisldAbnormalalarm',
              component: () => import('@/views/gridOperator/grisldAbnormalalarm.vue'),
            },
            {
              path: 'grisldTask',//网格关怀任务
              name: 'grisldTask',
              component: () => import('@/views/gridOperator/grisldTask.vue'),
            },
            {
              path: 'houseCollection',//网格房屋采集
              name: 'houseCollection',
              component: () => import('@/views/gridOperator/houseCollection.vue'),
            },
          ]
        },
        {
          path: 'careStaff',
          name: 'careStaff',
          redirect: {name: 'careManager'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'careManager',//关怀人员管理
              name: 'careManager',
              component: () => import('@/views/careStaff/careManager.vue'),
            },
            {
              path: 'gocareTask',//上门关怀任务
              name: 'gocareTask',
              component: () => import('@/views/careStaff/gocareTask.vue'),
            },
            {
              path: 'gocareTaskDetails',//上门关怀任务详情
              name: 'gocareTaskDetails',
              component: () => import('@/views/careStaff/gocareTaskDetails.vue'),
            },
            {
              path: 'gocareTaskPeople',//上门关怀任务人员
              name: 'gocareTaskPeople',
              component: () => import('@/views/careStaff/gocareTaskPeople.vue'),
            },
            {
              path: 'inoutPeople',//长时未出入人员
              name: 'inoutPeople',
              component: () => import('@/views/careStaff/inoutPeople.vue'),
            },
            {
              path: 'inoutCarePeople',//长时未出入关怀人员
              name: 'inoutCarePeople',
              component: () => import('@/views/careStaff/inoutCarePeople.vue'),
            },
            {
              path: 'abnormalRecord',//异常记录
              name: 'abnormalRecord',
              component: () => import('@/views/careStaff/abnormalRecord.vue'),
            },
          ]
        },
        {
          path: 'securityMachine',
          name: 'securityMachine',
          redirect: {name: 'securityMachineManager'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'securityMachineManager',//保安机管理
              name: 'securityMachineManager',
              component: () => import('@/views/securityMachine/securityMachineManager.vue'),
            },
          ]
        },
         {
          path: 'propertyManager',
          name: 'propertyManager',
          redirect: {name: 'realEntity'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'realEntity',
              name: 'realEntity',
              component: () => import('@/views/propertyManager/realEntity.vue'),
              authorities: ['5003']
            },
            {
              path: 'practitioners',
              name: 'practitioners',
              component: () => import('@/views/propertyManager/practitioners.vue'),
            },
            {
              path: 'unitSurvey',
              name: 'unitSurvey',
              component: () => import('@/views/propertyManager/unitSurvey.vue'),
            },
            {
              path: 'propertyPerson',
              name: 'propertyPerson',
              component: () => import('@/views/propertyManager/propertyPerson.vue'),
              authorities: ['8002']
            },
            {
              path: 'voting',//投票管理
              name: 'voting',
              component: () => import('@/views/propertyManager/voting.vue'),
              authorities: ['8003']
            },
            {
              path: 'votingAdd',//投票管理
              name: 'votingAdd',
              component: () => import('@/views/propertyManager/votingAdd.vue'),
            },
            {
              path: 'votingDetails',//投票详情
              name: 'votingDetails',
              component: () => import('@/views/propertyManager/votingDetails.vue'),
            },
            {
              path: 'votingManage',//候选管理
              name: 'votingManage',
              component: () => import('@/views/propertyManager/votingManage.vue'),
            },
            {
              path: 'staffInfo',//单位职工申报信息
              name: 'staffInfo',
              component: () => import('@/views/resumptionWork/staffInfo.vue'),
            },
          ]
        },
        {
          path: 'IntelligenceInstrumentation',
          name: 'IntelligenceInstrumentation',
          redirect: {name: 'alarmPanel'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'alarmPanel',
              name: 'alarmPanel',
              component: () => import('@/views/IntelligenceInstrumentation/alarmPanel.vue'),
              authorities: ['7001001']
            },
            {
              path: 'callGroupManagement',
              name: 'callGroupManagement',
              component: () => import('@/views/IntelligenceInstrumentation/callGroupManagement.vue'),
              authorities: ['7001004']
            },
            {
              path: 'sipManagement',
              name: 'sipManagement',
              component: () => import('@/views/IntelligenceInstrumentation/sipManagement.vue'),
              authorities: ['7001003']
            },
            {
              path: 'alarmRecord',
              name: 'alarmRecord',
              component: () => import('@/views/IntelligenceInstrumentation/alarmRecord.vue'),
              authorities: ['7001002']
            },
            {
              path: 'alarmDetails',
              name: 'alarmDetails',
              component: () => import('@/views/IntelligenceInstrumentation/alarmDetails.vue'),
            },
            {
              path: 'callGroup',
              name: 'callGroup',
              component: () => import('@/views/IntelligenceInstrumentation/callGroup.vue')
            },
            {
              path: 'fireHydrantAlarm',
              name: 'fireHydrantAlarm',
              component: () => import('@/views/IntelligenceInstrumentation/fireHydrantAlarm.vue'),
              authorities: ['7003002']
            },
            {
              path: 'fireHydrantAlarmDetails',
              name: 'fireHydrantAlarmDetails',
              component: () => import('@/views/IntelligenceInstrumentation/fireHydrantAlarmDetails.vue'),
            },
            {
              path: 'fireHydrantStuffyCover',
              name: 'fireHydrantStuffyCover',
              component: () => import('@/views/IntelligenceInstrumentation/fireHydrantStuffyCover.vue'),
              authorities: ['7003001']
            },
            {
              path: 'smokeAlarmDetails',
              name: 'smokeAlarmDetails',
              component: () => import('@/views/IntelligenceInstrumentation/smokeAlarmDetails.vue'),
            },
            {
              path: 'smokeMonitor',
              name: 'smokeMonitor',
              component: () => import('@/views/IntelligenceInstrumentation/smokeMonitor.vue'),
              authorities: ['7003003']
            },
            {
              path: 'wellCoverAlarm',
              name: 'wellCoverAlarm',
              component: () => import('@/views/IntelligenceInstrumentation/wellCoverAlarm.vue'),
              authorities: ['7002002']
            },
            {
              path: 'smokeAlarm',
              name: 'smokeAlarm',
              component: () => import('@/views/IntelligenceInstrumentation/smokeAlarm.vue'),
              authorities: ['7003004']
            },
            {
              path: 'wellCoverAlarmDetails',
              name: 'wellCoverAlarmDetails',
              component: () => import('@/views/IntelligenceInstrumentation/wellCoverAlarmDetails.vue'),
            },
            {
              path: 'wellCoverMonitor',
              name: 'wellCoverMonitor',
              component: () => import('@/views/IntelligenceInstrumentation/wellCoverMonitor.vue'),
              authorities: ['7002001']
            }, {
              path: 'callGroupManagement',
              name: 'callGroupManagement',
              component: () => import('@/views/IntelligenceInstrumentation/callGroupManagement.vue'),
              authorities: ['7001004']
            },
          ]
        },
        {
          path: 'video',
          name: 'video',
          redirect: {name: 'video'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'video',
              name: 'video',
              component: () => import('@/views/video/video.vue'),
              meta:{
                authorities: [2]
              }
            }
          ]
        },
        {
          path: 'eventRecord',
          name: 'eventRecord',
          redirect: {name: 'eventRecord'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'eventRecord',
              name: 'eventRecord',
              component: () => import('@/views/eventRecord/eventRecord.vue'),
              authorities: ['8001']
            },
            {
              path: 'smsNotification',
              name: 'smsNotification',
              component: () => import('@/views/eventRecord/smsNotification.vue'),
              authorities: ['8004']
            },
            {
              path: 'concernPerson',
              name: 'concernPerson',
              component: () => import('@/views/eventRecord/concernPerson.vue'),
            },
            {
              path: 'receiver',
              name: 'receiver',
              component: () => import('@/views/eventRecord/receiver.vue'),
            },
            {
              path: 'eventHandle',
              name: 'eventHandle',
              component: () => import('@/views/eventRecord/eventHandle.vue'),
            },
            {
              path: 'eventFeedback',
              name: 'eventFeedback',
              component: () => import('@/views/eventRecord/eventFeedback.vue'),
            }
          ]
        },
        {
          path: 'resources',
          name: 'resources',
          redirect: {name: 'videoDeviceList'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'offlineRecordDetails',
              name: 'offlineRecordDetails',
              component: () => import('@/views/resources/offlineRecordDetails.vue'),
            },
            {
              path: 'offlineAlarmRecord',
              name: 'offlineAlarmRecord',
              component: () => import('@/views/resources/offlineAlarmRecord.vue'),
            },
            {
              path: 'gatekeeperEdition',
              name: 'gatekeeperEdition',
              component: () => import('@/views/resources/gatekeeperEdition.vue'),
            },
            {
              path: 'videoDeviceList',
              name: 'videoDeviceList',
              component: () => import('@/views/resources/videoDeviceList.vue'),
              authorities: ['9002']

            },
            {
              path: 'vehicleSnapList',
              name: 'vehicleSnapList',
              component: () => import('@/views/resources/vehicleSnapList.vue'),
              authorities: ['9006']
            },
            {
              path: 'personSnapList',
              name: 'personSnapList',
              component: () => import('@/views/resources/personSnapList.vue'),
              authorities: ['9007']
            },
            {
              path: 'accessControlList',
              name: 'accessControlList',
              component: () => import('@/views/resources/accessControlList.vue'),
              authorities: ['9003']
            },
            {
              path: 'gbGrouping',
              name: 'gbGrouping',
              component: () => import('@/views/resources/gbGrouping.vue')
            },
            {
              path: 'resourceTypeList',
              name: 'resourceTypeList',
              component: () => import('@/views/resources/resourceTypeList.vue'),
              authorities: ['9005']
            },
            {
              path: 'organGBUserList',
              name: 'organGBUserList',
              component: () => import('@/views/resources/organGBUserList.vue'),
              authorities: ['9001']
            },
            {
              path: 'resourceManagerList',
              name: 'resourceManagerList',
              component: () => import('@/views/resources/resourceManagerList.vue'),
              authorities: ['9004']
            }
          ]
        },
        {
          path: 'personnelAudit',
          name: 'personnelAudit',
          redirect: {name: 'personnelAudit'},
          component: () => import('@/views/SubLayout.vue'),
          children: [
            {
              path: 'personnelAudit',
              name: 'personnelAudit',
              component: () => import('@/views/personnelAudit/personnelAudit.vue'),
              authorities: ['3010']
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {skipAuth: true}
    },
    {
      path: '/workRegister',
      name: 'workRegister',
      component: () => import('@/views/workRegister.vue'),
      meta: {skipAuth: true}
    },
    {
      path: '*',
      redirect: {name: 'login'},
    }
  ],
});

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token') || ''
  let user = null;
  let authorities = [];
  if (sessionStorage.getItem('user') !== 'null' && sessionStorage.getItem('user') !== 'undefined' && sessionStorage.getItem('user')) {
    user = JSON.parse(sessionStorage.getItem('user'))
    try {
      authorities = user.purviews.split(",");
    }
    catch (err) {
      authorities = [];
    }
  }
  if (to.meta.skipAuth) {
    next()
  } else if (!to.meta.skipAuth && (!token)) {
    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
  } else if (!to.meta.skipAuth && !authorities.length) {
    MessageBox({
      message: '您没有任何权限！',
      title: '提示',
      type: 'error'
    })
    next({
      name: 'login',
      query: {
        redirect: to.name !== 'login' ? to.fullPath : ''
      }
    })
  } else {
    /*getPermitRoute(to)*/
    next();

  }
})

/**
 * 获取基于权限的路由地址
 * @param {Route} a route Object
 * @return {Promise} a Promise Object
 */
function getPermitRoute(to) {
  return new Promise((resolve) => {
    const authorities = JSON.parse(sessionStorage.getItem('authorities'))
    // const permitApis = map(filter(permissions, pp => pp.check && pp.apiName), p => p.apiName)
    if (to.name === 'login') resolve(null)
    const menuAuthorities = flattenDeep(to.matched.map(v => v.authorities || []))
    console.log(menuAuthorities)
    /*if (intersection(menuAuthorities, authorities).length) {
      resolve(null)
    } else {
      const mainRoutesParent = find(routes, r => r.name === 'root')
      const mainRoutes = mainRoutesParent.children
      // const flattenRoutes = flattenDeep(map(mainRoutes.children, child => child.children || child))
      const firstRoute = find(mainRoutes, r => intersection(r.meta.authorities, authorities).length)

      if (firstRoute) {
        resolve({
          name: firstRoute.name
        })
      } else {
        MessageBox({
          message: '您没有任何权限！',
          title: '提示',
          type: 'error'
        })
        resolve({
          name: 'login',
        })
      }
    }*/
  })
}

export default router
