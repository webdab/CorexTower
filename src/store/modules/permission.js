import router, { resetRouter, asyncRoutes, constantRoutes } from '@/router'
import { projectmanage } from '@/router/modules/projectmanage'
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
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  //生成路由
  generateRoutes({ commit }, obj) {
    return new Promise(resolve => {
      let accessedRoutes = []
      if (obj.roles.includes('admin')) {
        // 动态添加管理项目管理路由
        accessedRoutes = projectmanage(obj.projectList).concat(asyncRoutes)
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)

      resolve(accessedRoutes)
    })
  },

  // 改变路由
  changeRoutes({ commit, dispatch }, addRouteObj) {
    return new Promise(async resolve => {
      resetRouter()

      let pmRoute = state.routes.find(item => item.name == 'projectmanage')
      console.log(pmRoute)
      pmRoute.children.push({
        path: 'p' + addRouteObj.id,
        component: () => import('@/views/projectmanage/index'),
        name: addRouteObj.name,
        meta: { title: addRouteObj.name }
      })

      console.log(11, state)
      console.log(22, router)

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
