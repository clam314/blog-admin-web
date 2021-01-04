import request from '@/utils/request'

const articleApi = {
  GetArticles: '/article/list',
  AddArticle: '/article/add',
  MdArticleList: '/list/articles/md',
  GetMdArticle: '/article/markdown/',
  SaveMdArticle: '/article/markdown',
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

export function addArticle (parameter) {
  return request({
    url: articleApi.AddArticle,
    method: 'post',
    data: parameter
  })
}

export function getMarkdownArticles () {
  return request({
    url: articleApi.MdArticleList,
    method: 'post'
  })
}

export function getMarkdownArticle (documentId) {
  return request({
    url: articleApi.GetMdArticle + documentId,
    method: 'get'
  })
}

export function saveMarkdownArticle (parameter) {
  return request({
    url: articleApi.SaveMdArticle,
    method: 'post',
    data: parameter
  })
}

/**
 * 发布/取消发布
 * @param parameter
 */
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
