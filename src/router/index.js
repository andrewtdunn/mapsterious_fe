import Vue from 'vue'
import Router from 'vue-router'
import Mapsterious from '@/components/Mapsterious'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Mapsterious
    }
  ]
})
