export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

/**
 * 获取根据文件路径后缀获取a-icon的图标类型
 * @param filePath 文件后缀
 * @returns {string} a-icon的type
 */
export function getFileTypeForIcon (filePath) {
  let type = 'unknown'
  if (filePath === '') {
    return `file-${type}`
  }
  const fileType = filePath.split('.').pop().toLowerCase()
  if (fileType === 'md') {
    type = 'markdown'
  } else if (fileType === 'html') {
    type = 'html'
  } else if (fileType === 'docx' || fileType === 'doc') {
    type = 'word'
  } else if (fileType === 'xlsx') {
    type = 'excel'
  } else if (fileType === 'pptx' || fileType === 'ppt') {
    type = 'ppt'
  } else if (fileType === 'pdf') {
    type = 'pdf'
  } else if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
    type = 'image'
  } else if (fileType === 'zip' || fileType === '7z' || fileType === 'rar') {
    type = 'zip'
  }
  return `file-${type}`
}
