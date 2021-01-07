import request from '@/utils/request'

const imgApi = {
  UploadImg: 'article/img'
}

export function uploadImg (parameter) {
  return request({
    url: imgApi.UploadImg,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
