import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getUserId } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasUserId = getUserId()

  if (to.path === '/login') {
    next()
    NProgress.done()
  } else {
    if (hasUserId) {
      // 是否加载完动态路由
      if (store.getters.isMountedRoutes) {
        next()
      } else {
        try {
          // 预留入口 之后添加角色权限使用
          const roles = ['admin']
          // 在这里获取异步路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 调用router.addRoutes方法,将异步路由添加进去
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
