import request from '@/utils/request'

/* 获取面板表
{
  "projectId": 0,
  "userId": 0
} */
export function fetchPanelList(data) {
  var data = {
    projectId: 1,
    userId: 1
  }
  return request({
    url: '/panel/list',
    method: 'post',
    data
  })
}

// 根据主键id删除面板表
export function deletePanel(id) {
  return request({
    url: `/panel/delete/${id}`,
    method: 'post'
  })
}
/* 新增面板
{
  "panelTitle": "string",
  "projectId": 0,
  "userId": 0
} */
export function addPanel(data) {
  return request({
    url: '/panel/add',
    method: 'post',
    data
  })
}
/* 更新面板表
{
  "panelId": 0,
  "panelTitle": "string",
  "projectId": 0,
  "userId": 0
} */
export function updatePanel(data) {
  return request({
    url: '/panel/update',
    method: 'post',
    data
  })
}

/* 
添加任務
{
  "panelId": 0,
  "taskName": "string"
}
*/
export function addTask(data) {
  return request({
    url: '/task/add',
    method: 'post',
    data
  })
}
/* 
删除任务表
*/
export function deleteTask(id) {
  return request({
    url: `/task/delete/${id}`,
    method: 'post'
  })
}

/*
更新任务表
 */
export function updateTask(data) {
  console.log('task', data)
  return request({
    url: '/task/update',
    method: 'post',
    data
  })
}

/*
获取任务操作日志 
 */
export function getLog(data) {
  return request({
    url: '/task/opt/log/page',
    method: 'post',
    data
  })
}

/* 
获取评论列表
*/
export function getComments(data) {
  return request({
    url: '/comment/page',
    method: 'post',
    data
  })
}

/* 
新增评论
*/
export function addComment(comment) {
  return request({
    url: '/comment/add',
    method: 'post',
    data: comment
  })
}
