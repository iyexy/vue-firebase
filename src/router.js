import Vue from 'vue'
import VueRouter from 'vue-router'
import location from './components/location'
import weather from './components/weather'
import setting from './components/setting'
import login from './components/login'
import itemview from './components/itemview'
import star from './components/star'

/* eslint-disable no-new */
Vue.use(VueRouter)
const router = new VueRouter()
router.map({
  '/location': {
    component: location
  },
  '/location/:id': {
    name: 'itemview',
    component: itemview
  },
  '/weather': {
    component: weather
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
  '/': '/location'
})
export {router}

