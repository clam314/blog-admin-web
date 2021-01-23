import request from '@/utils/request'

const articleApi = {
  GetArticles: '/article/list',
  GetArticleContent: 'article/getContent',
  AddArticle: '/article/add',
  SaveArticle: '/article/updateContent',
  UpdateTags: '/article/updateTags',
  UpdateInfo: '/article/updateInfo',
  DeleteArticle: '/article/delete'
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

// 获取文章内容
export function getArticleContent (parameter) {
  return request({
    url: articleApi.GetArticleContent,
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

// 修改文档标签
export function updateArticleTags (parameter) {
  return request({
    url: articleApi.UpdateTags,
    method: 'post',
    data: parameter
  })
}

// 更新文档信息或状态
export function updateArticleInfo (parameter) {
  return request({
    url: articleApi.UpdateInfo,
    method: 'post',
    data: parameter
  })
}

// 删除文章
export function deleteArticle (parameter) {
  return request({
    url: articleApi.DeleteArticle,
    method: 'post',
    data: parameter
  })
}
