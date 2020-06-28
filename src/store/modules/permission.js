import router, { resetRouter, asyncRoutes, constantRoutes } from '@/router'
import { getProjectListByUserId } from '@/api/setting-project'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 把项目列表装成routes要求的格式
 * @param {*} routes
 */
export function getProjectRoutes(pObj) {
  const projectManageRouter = {
    path: '/projectmanage',
    component: Layout,
    // redirect: 'noRedirect',
    name: 'projectmanage',
    meta: {
      title: '项目管理',
      icon: 'list'
    },
    children: []
  }
  if (pObj && pObj.data.length > 0) {
    pObj.data.forEach((item, index) => {
      projectManageRouter.children.push({
        path: 'p' + item.projectId,
        projectId: item.projectId,
        component: () => import('@/views/projectmanage/index'),
        name: 'p' + item.projectId,
        meta: { title: item.projectName }
      })
    })
  }

  return [projectManageRouter]
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  isMountedRoutes: false // 动态路由加载状态
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_ROUTES_STATE: (state, flag) => {
    state.isMountedRoutes = flag
  }
}

const actions = {
  // 生成路由
  generateRoutes({ commit, rootState }, roles) {
    return new Promise(async resolve => {
      let accessedRoutes = []
      let pObj
      try {
        pObj = await getProjectListByUserId(rootState.user.userId) // 获取项目列表信息
      } catch (error) {
        pObj = null
      }
      const projectRoutes = getProjectRoutes(pObj) // 对路由格式进行处理

      if (roles.includes('admin')) {
        // 动态添加管理项目管理路由
        accessedRoutes = projectRoutes.concat(asyncRoutes)
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_ROUTES_STATE', true)
      resolve(accessedRoutes)
    })
  },

  // 改变路由
  changeRoutes({ commit, dispatch }, addRouteObj) {
    return new Promise(async resolve => {
      resetRouter()
      const pmRoute = state.routes.find(item => item.name == 'projectmanage')
      pmRoute.children.push({
        path: 'p' + addRouteObj.id,
        component: () => import('@/views/projectmanage/index'),
        name: addRouteObj.name,
        meta: { title: addRouteObj.name }
      })
      router.addRoutes([pmRoute])

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
