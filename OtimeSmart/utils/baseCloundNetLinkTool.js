const baseURL = require('/baseURL.js')
const baseTool = require('/baseTool.js')
const baseApiList = require('/baseApiList.js')

/**
 * 获取 openId
 */
function getOpenId() {
  return baseTool.valueForKey('token')
}

/**
 * 获取用户信息
 */
function getUserInfo() {
  return baseTool.valueForKey("userInfo")
}

/**
 * 获得设备信息
 */
function getDeviceInfo() {
  return baseTool.valueForKey("deviceInfo")
}
function getRemoteDataFromServer(urlApi = '', description = '', parameter = {}) {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    if (openid) {
      // 统一处理, 拼接额外数据
      let data = Object.assign({
        openid: openid,
      }, parameter)
      baseTool.print({
        "云函数名": urlApi,
        "功能": description,
        "参数": data
      })
      wx.cloud.init({
        traceUser: true
      })
      wx.cloud.callFunction({
        name: urlApi,
        data: data
      }).then(res => {
        baseTool.print(res)
        let result = res.result
        if (result != undefined && result.code == "success" && result.data != undefined) {
          resolve(result.data)
        } else {
          reject({
            msg: "登录失败",
            type: 0
          })
        }
      }).catch(res => {
        baseTool.print(res)
        reject(res)
      })
    } else {
      startAuthorization()
    }
  })
}

/**
 * 重启页面
 */
function reLauch() {
  baseTool.print('重启页面')
  wx.reLaunch({
    url: '/pages/home/homeIndex'
  })
}

/**
 * 打开授权页
 */
function startAuthorization() {
  wx.reLaunch({
    url: '/pages/authorization/authorization',
  })
}

function showNetWorkingError(res) {
  let type = res.type
  baseTool.print(res)
  if (type && type == 1) {
    baseTool.showToast(res.msg)
  } else {
    baseTool.showToast("网络不给力!")
  }
}

function loginAuthorization(userInfo = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.init({
      traceUser: true
    })
    baseTool.print([userInfo, "数据内容"])
    wx.cloud.callFunction({
      name: "saveUserInfo",
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        city: userInfo.city,
        gender: userInfo.gender,
        province: userInfo.province
      }
    }).then(res => {
      let result = res.result
      if (result != undefined && result.code == "success" && result.data != undefined) {
        resolve(result.data)
      } else {
        reject({
          msg: "登录失败",
          type: 0
        })
      }
    }).catch(res => {
      baseTool.print(res)
      reject(res)
    })
  })
}

/**
 * 云文图片件路径
 */
function getImagePath(imageName = "") {
  return "cloud://otime-smart-y6yn7.6f74-otime-smart-y6yn7/" + imageName
}

module.exports = {
  getOpenId: getOpenId,
  getUserInfo: getUserInfo,
  reLauch: reLauch,
  startAuthorization: startAuthorization,
  getRemoteDataFromServer: getRemoteDataFromServer,
  showNetWorkingError: showNetWorkingError,
  loginAuthorization: loginAuthorization,
  getImagePath: getImagePath,
  getDeviceInfo: getDeviceInfo
}