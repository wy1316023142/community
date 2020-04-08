import {
  get,
  keys,
  isNil,
  every
} from 'lodash'

import { isIdcard, strTrim, isIp} from './util.js'

//验证字符串是否为空串，去掉前后有空格
export function validateBlackSpace(rule, value, cb) {
  if(value && value.length !== undefined){
    if (value.length !== 0  && value.replace(/(^\s*)|(\s*$)/g, '').length === 0) {
      cb(new Error(rule.message || `请确定${rule.filedName}不为空`))
    } else {
      if(strTrim(value).length != value.length){
        cb(new Error(rule.message || `请确定${rule.filedName}不为空`))
      }else{
        cb()
      }
    }
  }else {
    cb()
  }
}

//验证字符串中是否有空格
export function validateCenterBS(rule, value, cb) {
  var centerStr = value.replace(/\s/g, '') //去掉中间空格
  var leftStr = value.replace(/^\s*/g, '') //去掉左边空格
  var rightStr = value.replace(/\s*$/g, '') //去掉右边空格
  if (value.length > centerStr.length || value.length > leftStr.length || value.length > rightStr.length) {
    cb(new Error(rule.message || `请确定${rule.filedName}中没有空格`))
  } else {
    cb()
  }
}

// 简单校验数组是否为空
export function validateArray(rule, value, cb) {
  if (!value || !value.length) {
    cb(new Error(rule.message || `请选择${rule.fieldName}`))
  } else {
    cb()
  }
}

// 校验数组的每一个对象
export function validateArrayDeep(rule, value, cb) {
  if (!value || !value.length) {
    cb(new Error(rule.message || `${rule.fieldName}不能为空`))
  } else {
    const valid = every(value, item => {
      return every(keys(item), k => {
        if (rule.arrayKeys[k] && rule.arrayKeys[k].required && !item[k]) {
          item.hasError = true
          cb(new Error(`${rule.arrayKeys[k].message}`))
          return false
        }
        item.hasError = false
        return true
      })
    })

    if (valid) {
      cb()
    }
  }
}

// 校验对象中的每一个值
export function validateObject(rule, value, cb) {
  if (!value) cb(new Error(rule.message || `${rule.fieldName}不能为空`))
  const valid = every(keys(value), k => {
    const item = rule.validateKeys[k]
    if (item && item.required && isNil(value[k])) {
      cb(new Error(`${item.message}`))
      return false
    }
    return true
  })

  if (valid) {
    cb()
  }
}

export function validateEqual(rule, value, cb) {
  if (value !== get(this, rule.compare)) {
    cb(new Error(`请输入相同的${rule.compareName}`))
  } else {
    cb()
  }
}

export function validateIdCard(rule, value, cb) {
  if (!value || !isIdcard(value)) {
    cb(new Error('请输入正确的身份证号码'))
  } else {
    cb()
  }
}
export function validateNoChinese(rule, value, cb) {
  if (!value || !(/^[^\u4e00-\u9fa5]{0,}$/.test(value))) {
    cb(new Error('请勿输入汉字'))
  } else {
    cb()
  }
}

export function validatePhone(rule, value, cb) {
  if (!value || !(/^1[3456789]\d{9}$/.test(value))) {
    cb(new Error('请输入正确的手机号码'))
  } else {
    cb()
  }
}
export function betterFifteen(rule, value, cb) {
  if (value < 0) {
    cb(new Error('请输入大于0的数字'))
  } else {
    cb()
  }
}
export function validateNumber(rule, value, cb) {
  if (rule.min > value || rule.max < value) {
    cb(new Error(rule.message))
  } else {
    cb()
  }
}

export function validateIp(rule, value, cb) {
  if (isIp(value)) {
    cb()
  } else {
    cb(new Error(rule.message))
  }
}

export function validatePositiveInteger(rule, value, cb) {
  let re = /^[0-9]+$/ ;
  if (re.test(value)) {
    cb()
  } else {
    cb(new Error(rule.message))
  }
}
