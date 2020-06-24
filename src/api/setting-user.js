import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/user/query',
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
