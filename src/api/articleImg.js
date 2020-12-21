import request from '@/utils/request'

const imgApi = {
  UploadImg: 'article/img'
}

export function uploadImg (parameter) {
  return request({
    url: imgApi.UploadImg,
    method: 'put',
    data: parameter
  })
}
