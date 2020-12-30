import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
import { pubKey, appKey } from '@/config/request.config'

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
  return localStorage.setItem('uuid', uid)
}

/**
 * RSA加密数据
 */
export function getRsaCode (str) {
  const encryptStr = new JSEncrypt()
  encryptStr.setPublicKey(pubKey)
  return encryptStr.encrypt(str.toString())
}

/**
 * 生成请求Id
 * @returns {string}
 */
function createRequestId () {
  return randomString(8) + currentTimeString()
}

export function createPublicHeaders (token, appSecret) {
  const uuid = localStorage.getItem('uuid') || createUUID()
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
