import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index/index'
import shopIndex from '@/pages/shop/index'
import shopItem from '@/pages/shop/item'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: index
    },
    {
      path: '/shop',
      component: shopIndex
    },
    {
      path: '/shop/item',
      component: shopItem
    }
  ]
})
