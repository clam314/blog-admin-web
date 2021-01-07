import request from '@/utils/request'

const articleApi = {
  GetArticles: '/article/list',
  AddArticle: '/article/add',
  SaveArticle: '/article/updateContent',
  UpdateMdStatus: '/article/markdown/status',
  DelMdArticle: '/article/markdown/'
}

/**
 * 获取文章列表
 *
 * parameter: {
 *   fid:'',
 *   pageNum: 4,
 *   pageCount: 20
 * }
 * @param parameter 可选，分页等信息
 * @returns {AxiosPromise}
 */
export function getArticles (parameter) {
  return request({
    url: articleApi.GetArticles,
    method: 'post',
    data: parameter
  })
}

// 创建文档
export function addArticle (parameter) {
  return request({
    url: articleApi.AddArticle,
    method: 'post',
    data: parameter
  })
}

// 保存文档
export function saveArticle (parameter) {
  return request({
    url: articleApi.SaveArticle,
    method: 'post',
    data: parameter
  })
}

export function updateStatus (parameter) {
  return request({
    url: articleApi.UpdateMdStatus,
    method: 'post',
    data: parameter
  })
}

/**
 * 删除
 * @param parameter
 */
export function del (parameter) {
  return request({
    url: articleApi.DelMdArticle,
    method: 'delete',
    data: parameter
  })
}
