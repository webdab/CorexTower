import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserIdKey = 'User-Id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 存储用户ID
export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(id) {
  return Cookies.set(UserIdKey, id)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
