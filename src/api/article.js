import request from '@/utils/request'

const articleApi = {
  MdArticleList: '/list/articles/md',
  GetMdArticle: '/article/markdown/',
  SaveMdArticle: '/article/markdown',
  UpdateMdStatus: '/article/markdown/status',
  DelMdArticle: '/article/markdown/'
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
