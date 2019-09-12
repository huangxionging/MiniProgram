const baseURL = require('/baseURL.js')
const baseTool = require('/baseTool.js')
const baseApiList = require('/baseApiList.js')

/**
 * 获取 openId
 */
function getToken() {
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

function gotoAuthorization(){
  wx.navigateTo({
    url: '/pages/authorization/authorization',
  })
}

/**
 * @brief 从服务器接口获得数据
 * @param urlApi 接口对应的 URL API
 * @param description 该接口的描述信息
 * @param parameter 该接口需要的额外的参数
 */
function getRemoteDataFromServer(urlApi = '', description = '', parameter = {})  {
  return new Promise((resolve, reject) => {
    let token = getToken()
    if (token) {
      // 统一处理, 拼接额外数据
      let data = Object.assign({
        token: token,
      }, parameter)
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList[urlApi] + '.php'
      baseTool.print(["接口名:" + description + "/URL 地址:" + url, "参数:", data])
      wx.request({
        url: url,
        data: data,
        success: function (res) {
          baseTool.print(res)
          if (res.statusCode == 200) {
            let data = res.data
            if (data.error == "Success.") {
              resolve(data)
            } else {
              reject(data)
            }
          }
        },
        fail: function (res) {
          reject(res)
        },
      })
    } else {
      // startAuthorization()
    }
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

function uploadImageToRemoteServer(tapIndex = 0) {
  baseTool.print(tapIndex)
  return new Promise((resolve, reject) => {
    let chooseItem = ['camera', 'album']
    baseTool.chooseImageFrom(chooseItem[tapIndex]).then(res => {
     
      let url = baseURL.baseDomain + baseApiList.uploadImageURL
      let imageUrl = res
      baseTool.print(url)
      baseTool.uploadLocalFile(url, res).then(res => {
        baseTool.print(res)
        resolve({
          imageUrl: imageUrl,
          fileName: res.fileName
        })
      }).catch(reject)
    }).catch(reject)
  })
}

/**
 * 采用 post 提交刷牙数据
 */
function postRemoteBrushTeethRecord(parameter = {}) {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    let memberId = getMemberId()
    let url = baseURL.baseDomain + "mini/challengeGame/" + "gameUploadBrushTeethRecord"
    baseTool.print(["URL 地址:" + url, "参数:", parameter])
    if (openid && memberId) {
      // 统一处理, 拼接额外数据
      let data = Object.assign({
        memberId: memberId,
        openid: openid,
        sign: '123456',
        timestamp: Date.parse(new Date()),
      }, parameter)
      wx.request({
        //上传数据接口
        url: url,
        //如果设为json，会尝试对返回的数据做一次 JSON.parse
        dataType: 'json',
        data: data,
        header: {
          "sourceType": "wx",
          'content-type': 'application/x-www-form-urlencoded', // 默认值
        },
        method: 'POST',
        success: function (res) {
          baseTool.print(res)
          if (res.data.code == 'success') {
            resolve(res.data.data)
          } else if (res.data.msg) {
            reject({
              type: 1,
              msg: res.data.msg
            })
          } else {
            reject({
              type: 1,
              msg: res.data.msg
            })
          }
        },
        fail: function (res) {
          reject({
            type: 0,
            msg: "网络不给力"
          })
        }
      })
    } else {
      startAuthorization()
    }
  })
}

/**
 * 获得 socket URL 前缀
 */
function getSocketURLPrefix() {
  return baseURL.socketDomain + baseURL.socketPath
}


function getWebDomain () {
  return baseURL.baseDomain
}

function loginAuthorization(urlApi = '', description = '', parameter = {}) {
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList[urlApi] + '.php'
    baseTool.print(["接口名:" + description + "/URL 地址:" + url, "参数:", parameter])
    wx.request({
      url: url,
      data: parameter,
      dataType: 'json',
      header: {
        "sourceType": "wx",
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      method: 'GET',
      success: function(res) {
        baseTool.print(res)
        if (res.statusCode == 200) {
          let data = res.data
          if (data.error == "Success.") {
            resolve(data)
          } else {
            reject(data)
          }
        }
      },
      fail: function(res) {
        reject(res)
      },
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
  getToken: getToken,
  reLauch: reLauch,
  startAuthorization: startAuthorization,
  getRemoteDataFromServer: getRemoteDataFromServer,
  showNetWorkingError: showNetWorkingError,
  uploadImageToRemoteServer: uploadImageToRemoteServer,
  postRemoteBrushTeethRecord: postRemoteBrushTeethRecord,
  getSocketURLPrefix: getSocketURLPrefix,
  getWebDomain: getWebDomain,
  loginAuthorization: loginAuthorization,
  getImagePath: getImagePath,
  getUserInfo: getUserInfo,
  getDeviceInfo: getDeviceInfo,
  gotoAuthorization: gotoAuthorization
}