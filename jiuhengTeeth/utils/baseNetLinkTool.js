const baseURL = require('/baseURL.js')
const baseTool = require('/baseTool.js')
const baseApiList = require('/baseApiList.js')

/**
 * 获取 openId
 */
function getOpenId() {
  return baseTool.valueForKey('openid')
}
/**
 * 获取 memberID
 */
function getMemberId() {
  return baseTool.valueForKey('memberId')
}

/**
 * 获得诊所 id
 */
function getClinicId() {
  return baseTool.valueForKey('clinicId')
}

function getIsHaveDevice() {
  return baseTool.valueForKey('isHaveDevice')
}

/**
 * 是否点过赞
 */
function getIsLike() {
  return baseTool.valueForKey('isLike')
}

/**
 * 获得诊所名字
 */
function getClinicName() {
  return baseTool.valueForKey('clinicName')
}

/**
 * 是否有设备
 */
function setIsHaveDevice(isHaveDevice) {
  if (isHaveDevice != undefined) {
    baseTool.setValueForKey(isHaveDevice, 'isHaveDevice')
  }
}

/**
 * 是否有版本号
 */
function getNeedLogin() {
  return baseTool.valueForKey('needLogin')
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

/**
 * @brief 从服务器接口获得数据
 * @param urlApi 接口对应的 URL API
 * @param description 该接口的描述信息
 * @param parameter 该接口需要的额外的参数
 */
function getRemoteDataFromServer(urlApi = '', description = '', parameter = {}) {
  return new Promise((resolve, reject) => {
    let openid = getOpenId()
    if (openid) {
      // 统一处理, 拼接额外数据
      let data = Object.assign({
        openid: openid,
        clinicId: baseURL.clinicId,
        appletCode: baseURL.appletCode,
      }, parameter)
      baseTool.print(data)
      baseTool.getRemoteDataFromServer(urlApi, description, data).then(resolve, reject)
    } else {
      startAuthorization()
    }
  })
}

function showNetWorkingError(res) {
  let type = res
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
module.exports = {
  getOpenId: getOpenId,
  getMemberId: getMemberId,
  getClinicId: getClinicId,
  getIsHaveDevice: getIsHaveDevice,
  setIsHaveDevice: setIsHaveDevice,
  reLauch: reLauch,
  getClinicName: getClinicName,
  startAuthorization: startAuthorization,
  getRemoteDataFromServer: getRemoteDataFromServer,
  showNetWorkingError: showNetWorkingError,
  uploadImageToRemoteServer: uploadImageToRemoteServer,
  postRemoteBrushTeethRecord: postRemoteBrushTeethRecord,
  getSocketURLPrefix: getSocketURLPrefix,
  getIsLike: getIsLike
}