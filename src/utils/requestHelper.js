import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import { appKey, pubKey } from '@/config/request.config'

const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const randomString = (len = 32) => {
  let pwd = ''
  for (let i = 0; i < len; i++) {
    // 0~32的整数
    pwd += $chars.charAt(Math.floor(Math.random() * ($chars.length + 1)))
  }
  return pwd
}

const currentTimeString = () => {
  const date = new Date()
  const Y = date.getFullYear().toString()
  const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const ms = date.getTime()
  return Y + M + D + h + m + s + ms
}

/**
 * 获取uuid
 */
function createUUID () {
  const uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
  setCookie('uuid', uid, 60 * 60 * 24 * 30 * 12 * 10)
  return localStorage.setItem('uuid', uid)
}

/**
 * RSA加密数据
 */
export function getRsaCode (str) {
  const encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pubKey)
  const res = encryptStr.encrypt(str)
  return res
}

/**
 * 获取cookie值
 * @param name
 * @returns {string}
 */
export function getCookie (name) {
  const strCookie = document.cookie// 获取cookie字符串
  const arrCookie = strCookie.split('; ')// 分割
  // 遍历匹配
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split('=')
    if (arr[0] === name) {
      return arr[1]
    }
  }
  return ''
}

/**
 * 设置cookie
 * @param name
 * @param value
 * @param expiresTime
 */
export function setCookie (name, value, expiresTime = 0) {
  if (expiresTime) {
    document.cookie = `${name}=${value};expires=${expiresTime}`
  } else {
    document.cookie = `${name}=${value}`
  }
}

/**
 * 生成请求Id
 * @returns {string}
 */
function createRequestId () {
  return randomString(8) + currentTimeString()
}

export function createPublicHeaders (token, appSecret) {
  const uuid = getCookie('uuid') || localStorage.getItem('uuid') || createUUID()
  const header = {
    appKey: appKey,
    token,
    requestId: createRequestId(),
    uuid
  }
  // 组合成sign参数
  let md5string = ''
  Object.keys(header).forEach(function (key) {
    if (header[key] != null && typeof header[key] === 'object') {
      md5string = md5string + JSON.stringify(header[key])
    } else if (header[key] != null) {
      md5string = md5string + header[key]
    }
  })
  header.sign = md5(md5string + appSecret)
  return header
}
