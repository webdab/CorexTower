import { fetchPanelList } from '@/api/project'
import { getProgectUserList } from '@/api/setting-user'
// import { localeData } from 'moment'

const state = {
  panelList: [],
  allUserList: [],
  // 任务查询条件
  taskQuery: {
    projectId: '',
    taskName: '',
    taskTime: [],
    principalId: '',
    taskStatus: ''
  },
  isLoading: true,
  taskId: '',
  showDialogPage: false
}
const mutations = {
  SET_TASK_ID: (state, taskId) => {
    state.taskId = taskId
  },
  SET_DIALOG_PAGE: (state, showDialogPage) => {
    state.showDialogPage = showDialogPage
  },
  SET_PANEL_LIST: (state, panelList) => {
    state.panelList = panelList
  },
  SET_USER_LIST: (state, allUserList) => {
    state.allUserList = allUserList
  },
  SET_LOADING_STATUS: (state, isLoading) => {
    state.isLoading = isLoading
  },
  SET_TASK_QUERY: (state, obj) => {
    state.taskQuery = Object.assign(state.taskQuery, obj)
  },
  RESET_TASK_QUERY: state => {
    state.taskQuery = {
      projectId: '',
      taskName: '',
      taskTime: [],
      principalId: '',
      taskStatus: ''
    }
  }
}
const actions = {
  fetchPanelList({ state, commit }) {
    fetchPanelList({
      projectId: state.taskQuery.projectId,
      taskName: state.taskQuery.taskName,
      startDate: (state.taskQuery.taskTime && state.taskQuery.taskTime[0]) || '',
      endDate: (state.taskQuery.taskTime && state.taskQuery.taskTime[1]) || '',
      principalId: state.taskQuery.principalId,
      taskStatus: state.taskQuery.taskStatus
    }).then(response => {
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
