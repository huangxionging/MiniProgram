const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getMyGameCount(clinicId = '') {
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getMyGameCount
    let data = {
      memberId: loginManager.getMemberId(),
      clinicId: clinicId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function pageQueryContest(pageNo = 1, clinicId = '') {
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.pageQueryContest
    let data = {
      memberId: loginManager.getMemberId(),
      pageNo: pageNo,
      clinicId: clinicId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function getContestgMembers(gameId ='') {
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getContestgMembers
    let data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          baseTool.print(res)
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function mergeData(gameIds) {

  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.mergeData
    let data = {
      memberId: loginManager.getMemberId(),
      gameIds: gameIds
    }
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
  
}

function brushScoreReport(recordId='', name = '', clinicName = '', logo = '') {
  return new Promise((resolve, reject) => {
    let url = 'https://32teeth.cn/tem_img/html2png.php'
    let data = {
      recordId: recordId,
      name: name,
      zs_name: clinicName
    }
    if (logo != '') {
      data.logo = logo
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function(res){
        resolve(res.data)
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

function updateClinicInfo(clinicId = '', name = '', imagUrl = '', intro = ''){
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.updateClinicInfo
    let data = {
      pic: imagUrl,
      name: name,
      openId: baseTool.valueForKey('openid'),
      memberId: loginManager.getMemberId(),
      clinicId: clinicId,
      intro: intro
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data != undefined && res.data.code != undefined && res.data.code == 'success') {
          resolve(res.data.data)
        } else {
          reject(baseTool.errorMsg)
        }
        
      },
      fail: function(res) {
        reject(baseTool.errorMsg)
      }, 
      complete: function (res) { },
    })
  })
}

function getClinicInfo(clinicId = ''){
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getClinicInfo
    let data = {
      openId: baseTool.valueForKey('openid'),
      clinicId: clinicId
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

function getUploadToken(filePath = '') {
  baseTool.print(filePath)
  return new Promise((resolve, reject) => {
    let fileName = filePath.split('//')[1];
    let url = 'http://doctor.32teeth.cn/sys/api/getUploadToken/imageName/' + fileName 
    baseTool.print(url)
    wx.request({
      url: url,
      success: function (res) {
        resolve(res);
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}

function getContestUserCount() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {

        let contestUserObject = res.data
        let contestUserList = contestUserObject.contestUserList
        if (contestUserObject != undefined && contestUserList != undefined) {
          resolve(contestUserList.length)
        } else {
          reject('数据错误')
        }
        
      },
      fail: function (res) {
        baseTool.print(res)
        resolve(res)
      },
      complete: function (res) { },
    })
  })
}

function chooseImageFrom(sourceType = 'camera') {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [sourceType],
      success: function (res) {
        resolve(res.tempFilePaths[0])
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })
  })
}

function uploadHistoryBrushRecord() {
  return new Promise((resolve, reject) => {
    baseTool.print('从本地数据库上传数据！')
    let historyGameObject = wx.getStorageSync("historyGameObject")
    if (historyGameObject && historyGameObject.deviceListObject) {
      let deviceObject = historyGameObject.deviceListObject
      let deviceDataObjectList = []
      for (let key in deviceObject) {
        deviceDataObjectList = deviceDataObjectList.concat(deviceObject[key].dataObjectList)
      }
      let memberId = loginManager.getMemberId()

      let jsonData = JSON.stringify(deviceDataObjectList)
      baseTool.print(['send:', jsonData])
      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.gameUploadBrushTeethRecord
      baseTool.print(url)
      wx.request({
        //上传数据接口
        url: url,
        //如果设为json，会尝试对返回的数据做一次 JSON.parse
        dataType: 'json',
        data: {
          sign: '123456',
          timestamp: Date.parse(new Date()),
          memberId: loginManager.getMemberId(),
          gameName: historyGameObject.name,
          gameId: historyGameObject.gameId,
          data: jsonData,
        },
        header: {
          "sourceType": "wx",
          'content-type': 'application/x-www-form-urlencoded', // 默认值
        },
        method: 'POST',
        success: function (res) {
          let gameObject = wx.getStorageSync("gameObject")
          let gameNewItem = gameObject.gameNewItem
          // 如果是同一场测评
          if (historyGameObject.gameId == gameNewItem.gameId) {
            wx.removeStorageSync("gameObject")
          }
          // 删除历史数据
          wx.removeStorageSync("historyGameObject")
          resolve(res)
        },
        fail: function (res) {
          reject(baseTool.errorMsg)
        }
      })
    } else {
      reject("数据不存在")
    }
    
  })
}

/**
 * 创建历史测评缓存对象
 */
function createHistoryGameObject(gameId = '', gameName = '', deviceList = []) {
  return new Promise((resolve, reject) => {
    let gameOject = wx.getStorageSync("historyGameObject")
    if (gameOject && gameOject.gameId == gameId) {
      resolve(gameOject)
    } else {
      if (deviceList.length == 0) {
        reject("设备列表为空")
      } else {
        let historyGameObject = {
          gameId: gameId,
          name: gameName,
          deviceUserBindObject: {},
          deviceListObject: {},
          isSyn: false
        }
        for (let index = 0; index < deviceList.length; ++index) {
          let deviceItem = deviceList[index]
          let macAddress = deviceItem.macAddress
          let name = deviceItem.name
          historyGameObject.deviceUserBindObject[name] = macAddress
          historyGameObject.deviceListObject[macAddress] = {
            macAddress: macAddress,
            name: name,
            dataObjectList: []
          }
        }
        wx.setStorage({
          key: 'historyGameObject',
          data: historyGameObject,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          }
        })
      }
    }
    
  })
}

function checkNeedSyn() {
  let historyGameObject = wx.getStorageSync("historyGameObject")
  if (historyGameObject && historyGameObject.deviceListObject) {
    let deviceObject = historyGameObject.deviceListObject
    let deviceDataObjectList = []
    for (let key in deviceObject) {
      deviceDataObjectList = deviceDataObjectList.concat(deviceObject[key].dataObjectList)
    }
    if (deviceDataObjectList.length > 0) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

function addDeviceDataObject(dataObject = {}) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'historyGameObject',
      success: function(res) {
        let historyGameObject = res.data
        let macAddress = dataObject.macAddress
        let deviceListItem = historyGameObject.deviceListObject[macAddress]
        deviceListItem.dataObjectList.push(dataObject)
        historyGameObject.deviceListObject[macAddress] = deviceListItem
        // 添加一条数据
        baseTool.print(historyGameObject)
        wx.setStorage({
          key: 'historyGameObject',
          data: historyGameObject,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          },
          complete: function (res) { },
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  })
}

function removeHistoryGameObject() {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key: 'historyGameObject',
      success: function(res) {
        resolve(res)
      },
      fail: function(res) {
        reject(res)
      }
    })
  })
}

function getGameQrcode(gameId = ''){
  return new Promise((resolve, reject) => {
    let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getGameQrcode
    baseTool.print(url)
    wx.request({
      url: url,
      data: {
        gameId: gameId
      },
      success: function (res) {
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
            reject("获取失败")
        }
      },
      fail: reject,
      complete: function (res) { },
    })
  })
}
module.exports = {
  pageQueryContest: pageQueryContest,
  getMyGameCount: getMyGameCount,
  getContestgMembers: getContestgMembers,
  mergeData: mergeData,
  brushScoreReport: brushScoreReport,
  updateClinicInfo: updateClinicInfo,
  getClinicInfo: getClinicInfo,
  getUploadToken: getUploadToken,
  chooseImageFrom: chooseImageFrom,
  uploadHistoryBrushRecord: uploadHistoryBrushRecord,
  createHistoryGameObject: createHistoryGameObject,
  checkNeedSyn: checkNeedSyn,
  addDeviceDataObject: addDeviceDataObject,
  removeHistoryGameObject: removeHistoryGameObject,
  getGameQrcode: getGameQrcode 
}