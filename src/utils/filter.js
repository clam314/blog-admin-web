import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

Vue.filter('dayjs', function (dataStr, pattern = 'YYYY-MM-DD') {
  return moment(dataStr).format(pattern)
})

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!dataStr) {
    return ''
  }
  return moment(dataStr).format(pattern)
})

Vue.filter('momentStr', function (dataStr, defaultStr = '', pattern = 'YYYY-MM-DD HH:mm:ss') {
  if (!dataStr) {
    return defaultStr
  }
  return moment(dataStr).format(pattern)
})
