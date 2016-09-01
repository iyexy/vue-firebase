import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import {router} from './router'
import fastclick from 'fastclick'

/* eslint-disable no-new */
Vue.use(VueResource)
router.start(App, 'body')
fastclick.attach(document.body)
