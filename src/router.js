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

const routes = [{
  path: '/usertopic',
  component: usertopic
},
  {
    path: '/createtopic',
    component: createtopic
  },
  {
    path: '/chat',
    component: chat
  },
  {
    path: '/latest',
    component: latest
  },
  {
    path: '/latest/:item',
    name: 'latestitem',
    component: latestitem
  },
  {
    path: '/setting',
    component: setting
  },
  {
    path: '/login',
    name: 'loginurl',
    component: login
  },
  {
    path: '/star',
    component: star
  },
  {
    path: '/',
    component: latest
  }
]
const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
