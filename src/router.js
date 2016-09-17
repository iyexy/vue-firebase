import Vue from 'vue'
import VueRouter from 'vue-router'
import setting from './components/setting'
import login from './components/login'
import star from './components/star'
import chat from './components/chat'
import post from './components/post'
import postitem from './components/postitem'
import addpost from './components/addpost'
import userpost from './components/userpost'

/* eslint-disable no-new */
Vue.use(VueRouter)
const router = new VueRouter()
router.map({
  '/userpost': {
    component: userpost
  },
  '/addpost': {
    component: addpost
  },
  '/chat': {
    component: chat
  },
  '/latest': {
    component: post
  },
  '/latest/:item': {
    name: 'postitem',
    component: postitem
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

