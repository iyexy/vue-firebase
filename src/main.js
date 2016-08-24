import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import {router} from './router'

/* eslint-disable no-new */
Vue.use(VueResource)
router.start(App, 'body')
