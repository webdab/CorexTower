import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
  //当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
    hidden: true // (默认 false)

  //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    redirect: 'noRedirect'

  // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
    alwaysShow: true

    name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
    meta: {
      roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
      title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
      noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
      breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
      affix: true // 若果设置为true，它则会固定在tags-view中(默认 false)

      // 当路由设置了该属性，则会高亮相对应的侧边栏。
      // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
      // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
      activeMenu: '/article/list'
    }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'dashboard', affix: false }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/userlist',
    name: 'Setting',
    meta: {
      title: '系统设置',
      icon: 'user'
    },
    alwaysShow: true,
    children: [
      {
        path: 'userlist',
        component: () => import('@/views/setting/userlist/index'),
        name: 'Userlist',
        meta: { title: '用户列表' }
      },
      {
        path: 'projectlist',
        component: () => import('@/views/setting/projectlist/index'),
        name: 'Projectlist',
        meta: { title: '项目列表' }
      }
      // {
      //   path: 'role',
      //   component: () => import('@/views/setting/rolelist/index'),
      //   name: 'Role',
      //   meta: { title: '角色权限' }
      // }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
