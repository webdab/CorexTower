import request from '@/utils/request'

export function getList() {
  return request({
    url: '/getList',
    method: 'get'
  })
}
