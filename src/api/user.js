import request from '@/utils/request'

const userApi = {
  UserInfo: '/user/info',
  UserInfoUpdate: '/user/update',
  UserTags: '/user/updateTags',
  UserAvatarUpdate: '/user/avatar',
  UserMenu: '/user/nav'
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function updateUserInfo (parameter) {
  return request({
    url: userApi.UserInfoUpdate,
    method: 'post',
    data: parameter
  })
}

export function updateUserTags (parameter) {
  return request({
    url: userApi.UserTags,
    method: 'post',
    data: parameter
  })
}

export function updateAvatar (parameter) {
  return request({
    url: userApi.UserAvatarUpdate,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}
