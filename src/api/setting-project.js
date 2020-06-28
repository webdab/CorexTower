import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/project/page',
    method: 'post',
    data
  })
}
/**
 * 根据用户ID获取项目列表
 * @param {*} userId
 */
export function getProjectListByUserId(userId) {
  return request({
    url: '/project/listByUserId/' + userId,
    method: 'post'
  })
}

export function getDetails(id) {
  return request({
    url: '/project/get/' + id,
    method: 'get'
  })
}

export function addProject(data) {
  return request({
    url: '/project/add',
    method: 'post',
    data
  })
}

export function updateProject(data) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

export function deleteProject(id) {
  return request({
    url: '/project/delete/' + id,
    method: 'post'
  })
}
