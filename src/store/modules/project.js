import { fetchPanelList } from '@/api/project'
import { getProgectUserList } from '@/api/setting-user'

const state = {
  panelList: [],
  allUserList: []
}
const mutations = {
  SET_PANEL_LIST: (state, panelList) => {
    state.panelList = panelList
  },
  SET_USER_LIST: (state, allUserList) => {
    state.allUserList = allUserList
  }
}
const actions = {
  fetchPanelList({ commit }, data) {
    fetchPanelList(data).then(response => {
      if (response.success === true) {
        commit('SET_PANEL_LIST', response.data)
      }
    })
  },
  getProgectUserList({ commit }, data) {
    getProgectUserList(data).then(response => {
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
