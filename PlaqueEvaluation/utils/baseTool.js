const baseURL = require('/baseURL.js')
const baseApiList = require('/baseApiList.js')

// 获得状态
let baseState = baseURL.baseState
// 系统信息
let systemInfo = wx.getSystemInfoSync()
// 品牌名称
let brand = String(systemInfo.brand).toLowerCase()
// 是否模拟器
let isSimulator = (brand == 'devtools')

// 定时器标记
let singleTimer = -1

/**
 * e 是要打印的参数
 */
function print(e) {
  // 测试环境下或者模拟器状态下, 才输入内容到控制台
  console.log(e, getCurrentTimeWithNoDate())
  if (baseState || isSimulator) {
    // 打印内容
    // console.log(e)
  }
}

/**
 * 通过指定的 key 获取 value
 */
function valueForKey(key = '') {
  return wx.getStorageSync(key)
}

/**
 * 设置键值对
 * value 是要设置的值
 * key 是存储在本地缓存里对应的键
 */
function setValueForKey(value, key = '') {
  wx.setStorageSync(key, value)
}

/**
 * 删除指定键值对
 */
function removeObjectForKey(key = '') {
  wx.removeStorageSync(key)
}

/**
 * 删除所有对象
 */
function removeAllObjects() {
  wx.clearStorageSync()
}

/**
 * 震动
 */
function vibrate() {
  let that = this
  wx.vibrateLong({
    success: function (res) {
      that.print(res)
    },
    fail: function (res) {
      that.print(res)
    }
  })
}

/**
 * 默认的 Promise, 不会 resolve 也不会 reject
 */
function defaultPromise() {
  return new Promise((resolve, reject) => { })
}

/**
 * 默认的 Then Promise, 会 resolve
 */
function defaultThenPromise() {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

/**
 * 将 thenPromise 绑定到主 Promise 的 then
 * @parma masterPromise 是父 Promise, 一般是函数调用产生的
 * @param thenPromise 是对应的 Promise 的名字, 不会发生提前调用, 注意传参
 */
function bindThenPromise(masterPromise = defaultThenPromise(), thenPromise = defaultThenPromise) {
  return masterPromise.then(res => {
    return thenPromise()
  }).catch(res => {
    return defaultPromise()
  })
}

/**
 * 将 catchPromise 绑定到主 Promise 的 catch
 * @parame catchPromise 是 catchPromise对应函数的名字, 不会发生提前调用
 */
function bindCatchPromise(masterPromise = defaultPromise(), catchPromise = defaultPromise) {
  return masterPromise.then(res => {
    return defaultPromise()
  }).catch(res => {
    return catchPromise()
  })
}

function setValueForKeyAsync(value, key) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: value,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function valueForKeyAsync(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 获取系统信息
 */
function getSystemInfo() {
  wx.getSystemInfoSync()
}

/**
 * 获取系统信息, 异步
 */
function getSystemInfoAsync() {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function startTimer(callback = (total) => { }, inteval = 1000, total = 0) {
  let that = this
  let stop = callback(total)
  if (stop == true) {
    return
  } else {
    // 自减1
    total--
    // 定时器
    singleTimer = setTimeout(function () {
      clearTimeout(singleTimer)
      startTimer(callback, inteval, total)
    }, inteval)
  }
}

/**
 * 清除定时器
 */
function clearSingleTimer() {
  clearTimeout(singleTimer)
}

function getCurrentTime() {
  let date = new Date()
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')
  let second = zeroFormat(date.getSeconds() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

function getCurrentTimeWithoutSecond() {
  let date = new Date()
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
}

function getNextMinuteTimeWithZeroSecond() {
  let currentDate = new Date()
  let date = new Date(currentDate.getTime() + 1000 * 60 * 1)
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')

  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":00"
}


function getNextMinuteTimeWithNoDateZeroSecond() {
  let currentDate = new Date()
  let date = new Date(currentDate.getTime() + 1000 * 60 * 1)
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')
  return hour + ':' + minute
}

function getCurrentDateWithoutTime() {
  let date = new Date()
  let year = date.getFullYear() + ''
  let month = zeroFormat(date.getMonth() + 1 + '')
  let day = zeroFormat(date.getDate() + '')
  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return year + '-' + month + '-' + day
}

/**
 * 时分秒
 */
function getCurrentTimeWithNoDate() {
  let date = new Date()
  let hour = zeroFormat(date.getHours() + '')
  let minute = zeroFormat(date.getMinutes() + '')
  let second = zeroFormat(date.getSeconds() + '')
  return hour + ':' + minute + ':' + second
}

/**
 * 加 0 格式化字符串
 */
function zeroFormat(oldString = '') {
  return oldString.length == 1 ? '0' + oldString : oldString
}

function values(obj) {
  let vals = []
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      vals.push(obj[key])
    }
  }
  return vals
}
/**
 * showInfo: 只用来展示信息
 */
function showInfo(info = '') {
  print(info)
  wx.showModal({
    title: '提示',
    content: info,
    showCancel: false,
    confirmText: '好的',
    confirmColor: '#00a0e9',
  })
}

function showInfoWithCallBack(info = '', func = Function) {
  wx.showModal({
    title: '提示',
    content: info,
    showCancel: false,
    confirmText: '好的',
    confirmColor: '#00a0e9',
    success: function (res) {
      if (res.confirm) {
        func({
          type: 1
        })
      }
    }
  })
}

function showAlertInfoWithCallBack(info = {}, func = Function) {
  wx.showModal({
    title: info.title ? info.title : "提示",
    content: info.content ? info.content : "",
    showCancel: info.showCancel ? info.showCancel : false,
    cancelText: info.cancelText ? info.cancelText : "取消",
    cancelColor: info.cancelColor ? info.cancelColor : "#999",
    confirmText: info.confirmText ? info.confirmText : "确定",
    confirmColor: info.confirmColor ? info.confirmColor : "#00a0e9",
    success: function (res) {
      if (res.confirm) {
        func({
          type: 1
        })
      } else {
        func({
          type: 0
        })
      }
    },
  })
}

/**
 * 模型转换适配器
 * model 待转换的模型, key 是我们需要的 key, value 是转换对应的 key
 * value 是转换之前的键值对
 */
function modelAdapter(model = {}, value = {}, func = Function) {

  // 遍历模型
  let keys = Object.keys(model)
  for (let index = 0; index < keys.length; ++index) {
    // 获得新 key
    let key = keys[index]
    let newkey = model[key]
    // 在值中查找新 key 对应的值
    if (isExist(value[newkey])) {
      // 获得新值
      model[key] = value[newkey]
    } else if (func) {
      func(key)
    }
  }
}

function getRemoteDataFromServer(urlApi = '', description = '', data = {}) {
  return new Promise((resolve, reject) => {

    let url = baseURL.baseDomain + baseURL.basePath + baseApiList[urlApi]
    // 打印参数信息
    print([description + "URL地址:" + url, data])
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        print(res)
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
      },
    })

  })
}

/**
 * 统一处理网络请求
 * url 请求地址
 * data 是请求参数
 */
function request(url = '', data = {}) {
  return new Promise((resolve, reject) => {
    print([url, data])
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        print(res)
        if (res.data.code == 'success') {
          resolve(res.data.data)
        } else if (res.data.msg) {
          reject(res.data.msg)
        } else {
          reject('网络有点点问题')
        }
      },
      fail: function (res) {
        reject('网络有点点问题')
      },
    })
  })
}

/**
 * 从 URL 中提取参数, url 是完成的 url 字符串
 */
function getParameterFromURL(url = '') {
  // 是否包含问号
  if (url.indexOf('?')) {
    // 切割 url 地址和参数
    let allComponents = url.split('?')
    if (allComponents.length == 2) {
      // 获得参数部分字符串
      let parameterString = allComponents[1]
      // 通过 & 字符串切割成键值字符串数组
      let allParameters = parameterString.split('&')
      let parameterData = {}
      // 遍历该数组
      for (let index = 0; index < allParameters.length; ++index) {
        let param = allParameters[index]
        if (param.indexOf('=')) {
          // 通过 = 字符串切割成 key 和 value
          let keyValues = param.split('=')
          if (keyValues.length == 2) {
            let key = keyValues[0]
            let value = keyValues[1]
            // 生成 key 对应的 value
            parameterData[key] = value
          }
        }
      }
      return parameterData
    }
  }
  return undefined
}

/**
 * 选择图片
 */
function chooseImageFrom(sourceType = 'camera') {
  print(sourceType)
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
      }
    })
  })
}

/**
 * 展示普通的 actionSheet 风格
 * items 包含选项以冒号:区分, 例如 item1:item2:item3
 * color 是 item 颜色, 默认为黑色
 */
function showSheetInfo(items = '', color = '#000') {
  return new Promise((resolve, reject) => {
    let itemList = items.split(':')
    wx.showActionSheet({
      itemList: itemList,
      itemColor: color,
      success: function (res) {
        resolve(res.tapIndex)
      },
      fail: reject,
    })
  })
}



/**
 * 上传本地文件
 * url 是上传地址
 * filePath 是文件路径
 * tips 是上传进度提示
 */
function uploadLocalFile(url = '', filePath = '', tips = '上传进度:') {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: tips + '0%',
      mask: true
    })
    print([url, filePath, tips])
    let uploadTask = wx.uploadFile({
      url: url,
      filePath: filePath,
      name: 'json',
      success: function (res) {
        wx.hideLoading()
        print(res)
        if (res.statusCode == 200) {
          let data = JSON.parse(res.data)
          print(data)
          if (data != undefined && data.picNoList != undefined && data.picNoList.length > 0) {
            resolve({
              fileName: data.picNoList[0]
            })
          } else {
            reject({
              msg: '上传失败'
            })
          }
        } else {
          reject({
            msg: '上传失败'
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        reject(res)
      },
    })
    uploadTask.onProgressUpdate(function (res) {
      wx.showLoading({
        title: tips + res.progress + '%',
        mask: true
      })
    })
  })
}

/**
 * 预览单张图片
 * url 是图片地址
 */
function previewSingleImage(url) {
  wx.previewImage({
    current: url,
    urls: [url],
    success: function (res) { },
    fail: function (res) { },
  })
}

/**
 * 判断一个参数是否存在
 */
function isExist(e) {
  return (e != undefined)
}

/**
 * rpx 转成 px
 */
function toPixel(rpx = 0) {
  let scaleWidth = Math.min(systemInfo.screenHeight, systemInfo.screenWidth)
  return rpx * scaleWidth / 750
}

function toRpx(px = 0) {
  let scaleWidth = Math.min(systemInfo.screenHeight, systemInfo.screenWidth)
  return px * 750 / scaleWidth
}

/**
 * 改成 http 访问
 */
function urlToHttp(url = '') {
  let httpUrl = url
  if (url.indexOf('://')) {
    httpUrl = "http://" + url.split('://')[1]
  }
  return httpUrl
}

function urlToHttps(url = '') {
  let httpUrl = url
  if (url.indexOf('://')) {
    httpUrl = "https://" + url.split('://')[1]
  }
  return httpUrl
}

/**
 * 通过图片地址下载图片到相册
 * imageUrl 是图片的地址
 */
function downloadImageTohotosAlbum(imageUrl = '') {
  wx.showLoading({
    title: '正在保存...',
    mask: true,
  })
  // 获得图片信息
  wx.getImageInfo({
    src: imageUrl,
    success: function (res) {
      wx.hideLoading()
      // 保存到相册
      wx.saveImageToPhotosAlbum({
        filePath: res.path,
        success: function (res) {
          wx.hideLoading()
          showToast("已保存", "success")
        },
        fail: function (res) {
          wx.hideLoading()
          showToast("保存失败")
        }
      })
    },
    fail: function (res) {
      wx.hideLoading()
      showToast("保存失败")
    }
  })
}

/**
 * 简化版提示器, 基本使用默认信息就够用了
 * icon 是提示器图标, success, fail, 或者 none
 * message 是要提示的消息
 * mask 是遮罩
 * duration 是时长
 */
function showToast(message = '', icon = 'none', mask = true, duration = 2000) {
  wx.hideLoading()
  wx.showToast({
    title: message,
    icon: icon,
    duration: duration,
    mask: mask,
  })
}

/**
 * 是否合法
 */
function isValid(e) {
  if (isExist(e)) {
    if (e == '' || e == null) {
      return false
    } else {
      return true
    }
  } else {
    return false
  }
}

/**
 * 16进制表示的 ASCII 码转字符串, 去掉 0x
 */
function hexAsciiToString(hexStr = '') {
  let hexLength = hexStr.length
  // 16 进制字符串都是偶数个
  if (hexLength % 2 != 0) {
    return undefined
  }

  let desStr = ''
  for (let index = 0; index < hexLength; index += 2) {
    // 获取16进制数
    let hex = hexStr.substr(index, 2)
    // 获得 ASCII 码
    let hexInt = parseInt(hex, 16)
    // 拼接 ASCII 码字符
    desStr += String.fromCharCode(hexInt)
  }
  return desStr
}

/**
 * 设备命名规则
 */
function getDeviceName(macAddress = '') {
  print(macAddress)
  let lowerCaseMacAddress = macAddress.toLowerCase()
  // 设备命名规则, dd54142开头的命名为 32th, 其他的为 game
  if (lowerCaseMacAddress.indexOf('dd5414') != -1 && lowerCaseMacAddress.substr(0, 7) >= 'dd54142') {
    return '(32th-' + lowerCaseMacAddress + ')'
  } else {
    return '(game-' + lowerCaseMacAddress + ')'
  }
}

// 添加接口
module.exports = {
  // 打印
  print: print,
  // 模拟器
  isSimulator: isSimulator,
  // 系统信息
  systemInfo: systemInfo,
  // 获取键值对
  valueForKey: valueForKey,
  valueForKeyAsync: valueForKeyAsync,
  // 设置键值对
  setValueForKey: setValueForKey,
  setValueForKeyAsync: setValueForKeyAsync,
  // 删除指定键值对
  removeObjectForKey: removeObjectForKey,
  // 清空缓存
  removeAllObjects: removeAllObjects,
  // 获取系统信息
  getSystemInfo: getSystemInfo,
  // 异步获取系统信息
  getSystemInfoAsync: getSystemInfoAsync,
  // 震动
  vibrate: vibrate,
  getNet: function () {
    let that = this
    wx.onNetworkStatusChange(function (res) {
      that.print(res)
      wx.showModal({
        title: '网络改变',
        content: res.networkType,
      })
    })
  },
  // 默认 Promise
  defaultPromise: defaultPromise,
  // 默认 then Promise
  defaultThenPromise: defaultThenPromise,
  // 绑定 then Promise 到 master Promise
  bindThenPromise: bindThenPromise,
  // 绑定 catch Promise 到 master Promise
  bindCatchPromise: bindCatchPromise,
  // 网络失败提示
  errorMsg: '网络错误',
  // 启动定时器功能
  startTimer: startTimer,
  // 清除定时器
  clearSingleTimer: clearSingleTimer,
  // 获取当前时间
  getCurrentTime: getCurrentTime,
  // 获取当前时间, 时分, 无秒
  getCurrentTimeWithoutSecond: getCurrentTimeWithoutSecond,
  // 获取从下一分钟从0秒钟开始的时间
  getNextMinuteTimeWithZeroSecond: getNextMinuteTimeWithZeroSecond,
  getCurrentDateWithoutTime: getCurrentDateWithoutTime,
  getNextMinuteTimeWithNoDateZeroSecond: getNextMinuteTimeWithNoDateZeroSecond,
  getCurrentTimeWithNoDate: getCurrentTimeWithNoDate,
  // 仿写 Object.values, 兼容
  values: values,
  showInfo: showInfo,
  // 展示带回调的提示框
  showInfoWithCallBack: showInfoWithCallBack,
  // 展示带选项的提示框
  showAlertInfoWithCallBack: showAlertInfoWithCallBack,
  modelAdapter: modelAdapter,
  // 获得远程数据, 前提是遵循 域名+路径+API+参数
  getRemoteDataFromServer: getRemoteDataFromServer,
  request: request,
  getParameterFromURL: getParameterFromURL,
  chooseImageFrom: chooseImageFrom,
  showSheetInfo: showSheetInfo,
  uploadLocalFile: uploadLocalFile,
  previewSingleImage: previewSingleImage,
  isExist: isExist,
  isValid: isValid,
  urlToHttp: urlToHttp,
  urlToHttps: urlToHttps,
  toPixel: toPixel,
  toRpx: toRpx,
  showToast: showToast,
  downloadImageTohotosAlbum: downloadImageTohotosAlbum,
  hexAsciiToString: hexAsciiToString,
  getDeviceName: getDeviceName,
}