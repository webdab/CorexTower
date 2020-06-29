import { login, logout } from '@/api/user'
import { getToken, getUserName, setUserName, removeUserName, getUserId, setUserId, removeUserId } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: getUserName(), // 用户姓名
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
          commit('SET_NAME', data.userName)
          setUserId(data.userId)
          setUserName(data.userName)
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
      commit('SET_NAME', '')
      commit('SET_USERID', '')
      removeUserId()
      removeUserName()
      dispatch('tagsView/delAllViews', null, { root: true })
      commit('permission/SET_ROUTES_STATE', false, { root: true })
      resolve()
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_NAME', '')
      commit('SET_USERID', '')
      commit('permission/SET_ROUTES_STATE', false, { root: true })
      removeUserId()
      removeUserName()
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
