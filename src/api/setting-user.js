import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/user/page',
    method: 'post',
    data
  })
}
/**
 * 根据项目ID查询项目成员
 * @param {*} pid 
 */
export function getProgectUserList(pid) {
  return request({
    url: '/user/listUser/'+pid,
    method: 'post',
  })
}

export function getAllList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'post'
  })
}
/**
 * 验证用户是否存在
 * @param {*} loginName 
 */
export function checkUser(loginName) {
  return request({
    url: '/user/checkUser/' + loginName,
    method: 'get'
  })
}
