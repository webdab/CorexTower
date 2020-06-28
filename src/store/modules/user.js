import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, getUserId, setUserId, removeUserId } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '', // 用户姓名
  roles: [],
  userId: getUserId() // 用户ID
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { loginName } = userInfo
    return new Promise((resolve, reject) => {
      login({ loginName: loginName.trim() })
        .then(response => {
          const { data } = response
          commit('SET_USERID', data.userId)
          setUserId(data.userId)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 退出
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_USERID', '')
      removeUserId()
      dispatch('tagsView/delAllViews', null, { root: true })
      commit('permission/SET_ROUTES_STATE', false, { root: true })
      resolve()
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_USERID', '')
      commit('permission/SET_ROUTES_STATE', false, { root: true })
      removeUserId()
      resolve()
    })
  },

  // 改变权限
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      resetRouter()

      // generate accessible routes map based on roles

      const accessRoutes = await dispatch('permission/generateRoutes', {}, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
