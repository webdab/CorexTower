import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/project/query',
    method: 'post',
    data
  })
}

export function addProject(data) {
  return request({
    url: '/project/add',
    method: 'post',
    data
  })
}
