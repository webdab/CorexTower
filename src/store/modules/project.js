import { fetchPanelList } from '@/api/project'
import { getProgectUserList } from '@/api/setting-user'

const state = {
  panelList: [],
  allUserList: [],
  isLoading: true
}
const mutations = {
  SET_PANEL_LIST: (state, panelList) => {
    state.panelList = panelList
  },
  SET_USER_LIST: (state, allUserList) => {
    state.allUserList = allUserList
  },
  SET_LOADING_STATUS: (state, isLoading) => {
    state.isLoading = isLoading
  }
}
const actions = {
  fetchPanelList({ commit }, data) {
    fetchPanelList(data).then(response => {
      if (response.success === true) {
        commit('SET_LOADING_STATUS', false)
        commit('SET_PANEL_LIST', response.data)
      }
    })
  },
  getProgectUserList({ commit }, pid) {
    getProgectUserList(pid).then(response => {
      commit('SET_USER_LIST', response.data)
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
