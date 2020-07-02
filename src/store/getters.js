const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  isMountedRoutes: state => state.permission.isMountedRoutes,
  permission_routes: state => state.permission.routes,
  userId: state => state.user.userId,
  panelList: state => state.project.panelList,
  allUserList: state => state.project.allUserList,
  isLoading: state => state.project.isLoading,
  taskQuery: state => state.project.taskQuery
}
export default getters
