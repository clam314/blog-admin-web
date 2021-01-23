import request from '@/utils/request'

const articleApi = {
  GetArticles: '/article/list',
  GetArticleBasicInfo: '/article/basic',
  GetArticleContent: 'article/getContent',
  AddArticle: '/article/add',
  SaveArticle: '/article/updateContent',
  UpdateTags: '/article/updateTags',
  UpdateInfo: '/article/updateInfo',
  DeleteArticle: '/article/delete',
  PublishArticle: '/article/publish',
  UpdateCover: '/article/updateCover'
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

// 获取文章的基本信息
export function getBasicInfo (parameter) {
  return request({
    url: articleApi.GetArticleBasicInfo,
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

// 发布文档
export function publishArticle (parameter) {
  return request({
    url: articleApi.PublishArticle,
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

// 上传文章封面
export function updateCover (parameter) {
  return request({
    url: articleApi.UpdateCover,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
