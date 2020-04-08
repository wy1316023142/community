import SockJS from 'sockjs-client'
import store from '@/vuex/store.js'
import Stomp from 'stompjs'
// import { scoketBus } from '@/common/bus.js'

// import { Notification } from 'element-ui'

const sockets = require.context('../views', true, /socket\.js$/)
const socketMap = {}
const socketPaths = []
const OUTGOING = 20000
const INCOMING = 20000

let client = null
let socket = null
let reTryTime = 0 // 重连次数
let reTryMaxTime = 20
let clientHandle = null

const heartCheck = {
  // timeout: 60000, //60秒
  timeoutObj: null,
  serverTimeoutObj: null,
  reset() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  },

  start() {
    this.timeoutObj = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      client.send('/app/heartbeat', 'heartbeat')
      this.serverTimeoutObj = setTimeout(() => { //如果超过一定时间还没重置，说明后端主动断开了
        socket.close() //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, OUTGOING)
    }, OUTGOING)
  }
}

function startHeartBeat() {
  if (client) {
    console.log('heartbeat start')
    client.subscribe('/topic/heartbeat', function(greeting) {
      console.log('user queue msg: ' + greeting.body)
      heartCheck.reset().start()
    })
  }
}

const clientReconnect = function() {
  client && client.disconnect()
  socket && socket.close()
  if ((!client || !client.connected)) {
    if (reTryTime > reTryMaxTime) {
      client = null
      return
    }

    reTryTime++

    // 重新添加新socket
    socket = new SockJS(process.env.VUE_APP_WEBSOCKET_HOST, null, {
      transports: ['websocket']
    })

    socket.onclose = (err) => {
      console.log('sockjs closed', err)
      client && client.disconnect()
      clientReconnect()
    }

    socket.onerror = function(msg) {
      console.log('sockjs error', msg)
      // client && client.disconnect()
      // clientReconnect()
    }

    client = Stomp.over(socket)
    client.heartbeat.outgoing = OUTGOING // 客户端每20000ms发送一次心跳检测
    client.heartbeat.incoming = INCOMING // 0 代表client不接收server端的心跳检测

    return client.connect({}, frame => {
      console.log(' socket client reconnect success: ', frame)
      // Notification({
      //   message: 'socket 重连成功！',
      //   type: 'success'
      // })
      reTryTime = 0
      startHeartBeat()
    }, frame => {
      console.log('stomp init reconnect failed: ', frame)
      // Notification({
      //   message: 'stomp 重连失败',
      //   type: 'error'
      // })

      clearTimeout(clientHandle)
      clientHandle = setTimeout(() => {
        clientReconnect()
      }, 2000)
    })
  } else {
    console.warn('there is no client')
  }
}

sockets.keys().forEach(socketUrl => {
  sockets(socketUrl).default.forEach(v => {
    if (socketMap[v.name]) throw new Error(`${v.name}的socket名称重复`)
    if (socketPaths.find(v => v === v.url)) throw new Error(`${v.url}socket路径重复`)
    socketPaths.push(v.url)
    socketMap[v.name] = {
      name: v.name,
      url: v.url,
      client: client,

      subscribe(resCallback, errCallback) {
        return client.subscribe(this.url, frame => {
          console.log(`[${this.name}] ${name} => success: ${frame}`)
          resCallback && resCallback(frame)
        }, frame => {
          console.log(`[${this.name}] ${name} => failed: ${frame}`)
          errCallback && errCallback(frame)
        })
      },

      connect(headers = {}, connectCallBack = () => {}, errCallBack = () => {}) {
        if (!client) {
          socket = new SockJS(process.env.VUE_APP_WEBSOCKET_HOST, null, {
            transports: ['websocket']
          })

          client = Stomp.over(socket)
          socket.onclose = (err) => {
            console.log('sockjs closed', err)
            clientReconnect()
          }

          socket.onopen = function(msg) {
            console.log('sockjs open', msg)
          }

          socket.onerror = function(msg) {
            console.log('sockjs error', msg)
            // client && client.disconnect()
            // clientReconnect()
          }

          client.heartbeat.outgoing = OUTGOING // 客户端每20000ms发送一次心跳检测
          client.heartbeat.incoming = INCOMING // client不接收serever端的心跳检测
          // console.log(socket, client)
        }

        if (client.connected) {
          connectCallBack && connectCallBack({
            body: '',
            command: 'CONNECTED REUSE',
            headers: {
              'heart-beat': '0,0',
              'user-name': 'guest',
              version: '1.1'
            }
          })
          return client
        }

        return client.connect({
          ...headers
        }, frame => {
          console.log('socket client connection success: ', frame)
          startHeartBeat()
          connectCallBack && connectCallBack(frame)
        }, frame => {
          console.log('socket client init connection failed: ', frame)
          errCallBack && errCallBack(frame)
          clientReconnect()
        })
      },

      disconnect(callback) {
        return client.disconnect(() => {
          console.log(this.name, ' disconnect success')
          callback && callback()
        })
      }
    }
  })
})

export { client, socket }
export default socketMap
