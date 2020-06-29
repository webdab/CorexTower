import { fetchPanelList } from '@/api/project'

const state = {
  panelList: []
}
const mutations = {
  SET_PANEL_LIST: (state, panelList) => {
    state.panelList = panelList
  }
}
const actions = {
  fetchPanelList({ commit }, data) {
    fetchPanelList(data).then(response => {
      if (response.success === true) {
        commit('SET_PANEL_LIST', response.data)
      }
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
