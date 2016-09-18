import Vue from 'vue'
import VueRouter from 'vue-router'
import setting from './components/setting'
import login from './components/login'
import star from './components/star'
import chat from './components/chat'
import latest from './components/latest'
import latestitem from './components/latestitem'
import createtopic from './components/createtopic'
import usertopic from './components/usertopic'

/* eslint-disable no-new */
Vue.use(VueRouter)
const router = new VueRouter()
router.map({
  '/usertopic': {
    component: usertopic
  },
  '/createtopic': {
    component: createtopic
  },
  '/chat': {
    component: chat
  },
  '/latest': {
    component: latest
  },
  '/latest/:item': {
    name: 'latestitem',
    component: latestitem
  },
  '/setting': {
    component: setting
  },
  '/login': {
    name: 'loginurl',
    component: login
  },
  '/star': {
    component: star
  }
})
router.redirect({
  '/': '/latest'
})
export {router}

