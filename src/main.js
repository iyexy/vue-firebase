import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import {router} from './router'
import fastclick from 'fastclick'
import locale from 'timeago.js/locales/zh_CN.js'
import timeago from 'timeago.js/dist/timeago.min.js'

/* eslint-disable no-new */
Vue.use(VueResource)
router.start(App, 'body')
fastclick.attach(document.body)

// filters
Vue.filter('timeago', function (time) {
  timeago().register('zh_CN', locale)
  const t = timeago().format(time, 'zh_CN')
  return t
})
Vue.filter('trim', function (str) {
  str = str.replace('<br>', '\n')
  str = str.replace('&nbsp;', ' ')
  return str
})
