import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserIdKey = 'User-Id'
const UserNameKey = 'User-Name'

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

// 存储用户姓名
export function getUserName() {
  return Cookies.get(UserNameKey)
}

export function setUserName(name) {
  return Cookies.set(UserNameKey, name)
}

export function removeUserName() {
  return Cookies.remove(UserNameKey)
}
