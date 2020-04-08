import { cloneDeep, isNull, every, each, isPlainObject } from 'lodash'
import moment from 'moment'
import { Message  } from 'element-ui'
import CryptoJS from 'crypto-js/crypto-js'
import md5 from 'js-md5';

/**
 * AES加密
 */
export function encrypt(word) {
  let str=md5('TIEVD')
  let key  = CryptoJS.enc.Utf8.parse(str);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode:CryptoJS.mode.ECB,/** iv: 偏移量, mode等于ECB 时, 不需要 iv */
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString()
}


export function urlMatcher(url, params = {}) {
  return url.replace(/\/:([^/]+)/g, (match, g1) => {
    if(params[g1]===0) params[g1]="0"
    return params[g1] ? '/' + params[g1]+'' :  ''
  })
}

// 清理无用参数
export function pruneParams(params, visible) {
  var newParams = cloneDeep(params)
  each(newParams, (v, i) => {
    if (newParams[i] === '' || isNull(newParams[i]) || newParams[i] === '_all_' || (isPlainObject(visible) && visible[i] === false)) {
      delete newParams[i]
    }
  })
  return newParams
}

// 随机数
export function randomCode() {
  return (+new Date()).toString(32) + '-' + Math.random().toString(32).slice(2)
}

// 压缩图片并转为jpeg
export function convert2JPEG(img, isCompress = false) {
  // 图片质量 待确认? 120x120
  const canvas = document.createElement('canvas')
  if (isCompress) {
    canvas.width = 200
    canvas.height = 200 * (img.height / img.width)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  } else {
    canvas.width = Math.min(img.width, 2500)
    canvas.height = canvas.width * img.height / img.width
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
  return canvas.toDataURL('image/jpeg', 0.9)
}

// 获取图片base64
export function getBase64(fileBlob, isCompress = false) {

  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.addEventListener('load', () => {
      // resolve(fr.result)
      const img = new Image()
      img.onload = () => {
        resolve(convert2JPEG(img, isCompress))
      }
      img.onerror = (err) => {
        Message({
          message: '请上传图片',
          type: 'error'
        })
        reject(err)
      }
      img.src = fr.result
    })

    fr.addEventListener('error', () => {
      reject(fr.error)
    })

    fr.readAsDataURL(fileBlob)
  })
}

export function padDataTo(data = [], number = 0) {
  if (!data.length) return data

  every(Array(number).fill(0), v => {
    if (data.length % number === 0) {
      return false
    }
    data.push({ _placeholder: true })
    return true
  })
  return data
}

export function ceilDate(date) {
  return date ? +moment(moment(date).format('YYYY-MM-DD')).toDate() + 86400000 - 1000 : ''
}

export function floorDate(date) {
  return date ? +moment(moment(date).format('YYYY-MM-DD')).toDate() : ''
}

//取得字符串真实长度
export function getStringTrueLength(str) {
  return String(str).replace(/[^\x00-\xff]/g, 'xx').length // eslint-disable-line
}

export function strTrim(param) {
  let vRet=param;
  if (vRet == '') { return vRet; }
  while (true) {
      if (vRet.indexOf (' ') == 0) {
          vRet = vRet.substring(1, parseInt(vRet.length));
      } else if ((parseInt(vRet.length) != 0) && (vRet.lastIndexOf (' ') == parseInt(vRet.length) - 1)) {
          vRet = vRet.substring(0, parseInt(vRet.length) - 1);
      } else {
          return vRet;
      }
  }
}

//验证字符串是否是二代18位身份证
export function   isIdcard(value) {
  if (value === null || value === '') {
    return false
  }
  if (getStringTrueLength(value) !== 18) {
    return false
  }

  const jqyz = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const vcode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

  let jssum = 0
  for (let i = 0; i < getStringTrueLength(value) - 1; i++) {
    jssum += Number(value[i]) * jqyz[i]
  }

  return (value[17]) === (vcode[jssum % 11])
}

export function preloadImages(images = []) {
  return Promise.all(images.map(v => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ ok: true, img: img, ...v })
      }

      img.onerror = () => {
        resolve({ ok: false, img: img, ...v })
      }
      img.src = v.url
    })
  }))
}

//验证IP地址
export function isIp(value) {
  if (value === null || value === '') {
    return false
  }
  var reg =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(value);
}

//隐藏处理
/*
* str：字符串，frontLen：前面保留位数，endLen：后面保留位数。
* */
export function plusXing (str,frontLen,endLen) {
  var len = str.length-frontLen-endLen;
  var xing = '';
  for (var i=0;i<len;i++) {
    xing+='*';
  }
  return str.substring(0,frontLen)+xing+str.substring(str.length-endLen);

}


