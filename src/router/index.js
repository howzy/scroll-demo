import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const List = () => import('@/pages/list')
const ListDetail = () => import('@/pages/list-detail')
const Home = () => import('@/pages/home')
const HomeDetail = () => import('@/pages/home-detail')

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: ':id',
          name: 'homeDetail',
          component: HomeDetail
        }
      ]
    },
    {
      path: '/list',
      name: 'list',
      component: List,
      meta: { keepAlive: true }
    },
    {
      path: '/detail/:id',
      name: 'detail',
      component: ListDetail
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
