const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

/**
 * 获取 openId
 */
function getOpenId() {
  return baseTool.valueForKey('openid')
}



/**
 * code: 登陆后获取的 code
 * userInfo: 用户授权的用户信息
 * doctorId: 医生 id
 */
function loginWithUserInfo(code, userInfo, doctorId) {
  return new Promise((resolve, reject) => {
    baseTool.print(code)
    baseTool.print(userInfo)
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.login
    let data = { 
      'code': code,
      'doctorId': doctorId
    }

    // 头像
    if (userInfo.avatarUrl) {
      data.headimgurl = userInfo.avatarUrl
    }
    // 昵称
    if (userInfo.nickName) {
      data.nickname = userInfo.nickName
    }
    // 性别
    if (userInfo.gender) {
      data.sex = userInfo.gender
    }
    // 语言
    if (userInfo.language) {
      data.language = userInfo.language
    }
    // 国家
    if (userInfo.country) {
      data.country = userInfo.country
    }
    // 省份
    if (userInfo.province) {
      data.province = userInfo.province
    }
    // 城市
    if (userInfo.city) {
      data.city = userInfo.city
    }
    // 参数
    baseTool.print(data)
    // url
    baseTool.print(url)
    wx.request({
      url: url,
      data: data,
      success: res => {
        baseTool.print(res)
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          reject(res.data.msg)
        }
      },
      fail: function (res) {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function reLauch() {
  baseTool.print('重启页面')
  wx.reLaunch({
    url: '/pages/home/homeIndex/homeIndex'
  })
}

function startAuthorization(){
  wx.reLaunch({
    url: '/pages/authorization/authorization/authorization',
  })
}

module.exports = {
  getOpenId: getOpenId,
  reLauch: reLauch,
  startAuthorization: startAuthorization,
  loginWithUserInfo: loginWithUserInfo,
}