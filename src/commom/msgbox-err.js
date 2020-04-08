import { Message  } from 'element-ui'
import { some } from 'lodash'
const msgQueue = []
let msgBoxLock = false

export default function msgboxErr(message, code = 'UNKNOWN') {

  Message({
    message: message,
    /*title: '提示',*/
    type: 'error'
  })

  /*return new Promise((resolve, reject) => {
    if (msgQueue.length > 2 || some(msgQueue, msg => msg.code === code)) return // 避免过多了错误提示和重复的msg弹出

    msgQueue.push({
      message,
      code,
      resolve,
      reject
    })

    if (!msgBoxLock) {
      showNextMsg()
    }
  })*/
}

const showNextMsg = function() {
  if (msgQueue.length > 0) {
    const currentMsg = msgQueue[0]
    try {
      msgBoxLock = true
      Message({
        message: currentMsg.message,
        /*title: '提示',*/
        type: 'error'
      }).then(() => {
        msgQueue.shift()
        msgBoxLock = false
        currentMsg.resolve(showNextMsg())
      }).catch(() => {
        msgQueue.shift()
        msgBoxLock = false
        currentMsg.resolve(showNextMsg())
      })
    } catch (e) {
      msgBoxLock = false
    }
  }
}
