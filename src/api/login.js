import request from '@/utils/request'

const accountApi = {
  Initial: '/login/initial',
  Login: '/login/login',
  Logout: '/login/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav'
}

/**
 * 初始化获取appSecret等初始化信息
 * @returns {AxiosPromise}
 */
export function initial (parameter) {
  return request({
    url: accountApi.Initial,
    method: 'post',
    data: parameter
  })
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: accountApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: accountApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function logout () {
  return request({
    url: accountApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: accountApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
