const responseBody = {
  message: '',
  timestamp: 0,
  result: null,
  code: 0
}

export const getPublicHead = (requestId, message, code) => {
  return {
    requestId,
    respCode: code,
    respMsg: message,
    timestamp: new Date().getTime()
  }
}

export const builderV2 = (data, message = 'OK', code = 200, headers = {}, requestId) => {
  const resp = {
    data,
    head: getPublicHead(requestId, message, code)
  }
  if (code !== undefined && code !== 200) {
    resp._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    resp._headers = headers
  }
  return resp
}

export const builder = (data, message, code = 0, headers = {}) => {
  responseBody.result = data
  if (message !== undefined && message !== null) {
    responseBody.message = message
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
    responseBody._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  return responseBody
}

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}
