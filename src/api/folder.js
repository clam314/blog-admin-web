import request from '@/utils/request'

const folderApi = {
  GetFolders: '/folder/list',
  AddFolder: '/folder/add',
  UpdateFolder: '/folder/update',
  DeleteFolder: '/folder/delete'
}

/**
 * 获取文件夹列表
 */
export function getFolders () {
  return request({
    url: folderApi.GetFolders,
    method: 'get'
  })
}

export function addFolder (parameter) {
  return request({
    url: folderApi.AddFolder,
    method: 'post',
    data: parameter
  })
}

export function updateFolder (parameter) {
  return request({
    url: folderApi.UpdateFolder,
    method: 'post',
    data: parameter
  })
}

export function deleteFolder (parameter) {
  return request({
    url: folderApi.DeleteFolder,
    method: 'post',
    data: parameter
  })
}
