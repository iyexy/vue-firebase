import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import router from './router'
import fastclick from 'fastclick'
import locale from 'timeago.js/locales/zh_CN.js'
import timeago from 'timeago.js/dist/timeago.min.js'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

Vue.use(VueResource)

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
