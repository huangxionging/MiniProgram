const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

/**
 * 获取 openId
 */
function getOpenId() {
  return baseTool.valueForKey('openid')
}

function getMemberId() {
  return baseTool.valueForKey('memberId')
}


function reLauch() {
  baseTool.print('重启页面')
  wx.reLaunch({
    url: '/pages/homeIndex/homeIndex'
  })
}

function startAuthorization(){
  wx.reLaunch({
    url: '/pages/authorization/authorization',
  })
}

/**
 * 登录账号和密码
 */
function loginAccountPassword(account = '',  password = '') {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    if (openid) {
      let data = {
        openid: openid,
        account: account,
        password: password
      }
      // 统一处理
      baseTool.getRemoteDataFromServer("login", "登录", data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}

function getRemoteDataFromServer(urlApi = '', description = '', parameter = {}) {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    let memberId = getMemberId()

    if (openid && memberId) {
      // 统一处理
      let data = {
        memberId: memberId,
        openid: openid,
      }
      data  = Object.assign(data, parameter)
      baseTool.print(data)
      baseTool.getRemoteDataFromServer(urlApi, description, data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}
 

module.exports = {
  getOpenId: getOpenId,
  getMemberId: getMemberId,
  reLauch: reLauch,
  startAuthorization: startAuthorization,
  getRemoteDataFromServer: getRemoteDataFromServer
}