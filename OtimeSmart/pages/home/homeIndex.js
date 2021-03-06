// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../utils/baseDeviceSynTool.js')
const baseURL = require('../../utils/baseURL.js')
const baseHexConvertTool = require('../../utils/baseHexConvertTool.js')

import {
  HomeAdapter
} from "../../adapter/homeAdapter.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    deviceInfo: {},
    isSynNow: false,
    currentDate: "",
    currentStep: "00000",
    currentCal: 0,
    currentDistance: 0,
    currentPower: "0%",
    showDeviceToolBar: false,
    deviceConnectObject: {
      stateText: "暂无设备",
      bindTitle: "绑定设备",
      stateColor: "red",
      action: 0
    },
    showSelectDate: false,
    averageHeartRate: 0,
    maxHeartRate: 0,
    minHeartRate: 0,
    actionDataArray: []
  },
  temporaryData: {
    pullDown: false,
    synActionIndicator: 0, // 同步操作指令
    needSynDayIndicator: 7, // 需要同步的历史数据天数,
    dataDateObjectList: [],
    detailStepData: [],
    heartRateObjectList: [],
    bloodObjectList: [],
    selectDateIndicator: 0,
    currentAge: 0, // 当前年龄
    currentSex: -1,
    currentHeight: 0,
    currentWeight: 0,
    homeAdapter: new HomeAdapter(),
    lastSynDeviceDataDate: "",
    toDayTotalStep: "",
    toDayTotalSleep: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.temporaryData.bloodObjectList.length = 0
    that.registerDeviceSynMessageBlock()
    that.registerHeartRateCheckMessageBlock()
    // that.showAlarm()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    // 当前日期
    let token = baseNetLinkTool.getToken()
    let currentDate = baseTool.getCurrentDateWithoutTime()
    // 设备信息
    let actionDataArray = that.temporaryData.homeAdapter.getActionItems()
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    // 设备连接状态
    let deviceConnectObject = that.data.deviceConnectObject
    that.registerCallBack()
    let userInfo = baseNetLinkTool.getUserInfo()
    that.temporaryData.currentSex = (userInfo.sex == 2) ? 0 : 1
    that.temporaryData.currentAge = userInfo.birthday
    that.temporaryData.currentHeight = userInfo.height
    that.temporaryData.currentWeight = userInfo.weight
    /**
     * 设置最后同步日期
     */
    let lastSynDeviceDataDate = baseTool.valueForKey("lastSynDeviceDataDate")
    if (baseTool.isValid(lastSynDeviceDataDate) == false) {
      lastSynDeviceDataDate = baseTool.getCurrentOffsetDateWithoutTime(-6)
      baseTool.setValueForKey(lastSynDeviceDataDate, "lastSynDeviceDataDate")
    } else {
      let offsetDay = baseTool.getOffsetDays(lastSynDeviceDataDate, currentDate)
      if (offsetDay > 6) {
        lastSynDeviceDataDate = baseTool.getCurrentOffsetDateWithoutTime(-6)
        baseTool.setValueForKey(lastSynDeviceDataDate, "lastSynDeviceDataDate")
      }
    }
    that.temporaryData.lastSynDeviceDataDate = lastSynDeviceDataDate
    if (deviceInfo == "") {
      deviceConnectObject.stateText = "暂无设备"
      deviceConnectObject.stateColor = "red"
      deviceConnectObject.bindTitle = "绑定设备"
      that.setData({
        currentDate: currentDate,
        showDeviceToolBar: true,
        deviceConnectObject: deviceConnectObject,
        actionDataArray: actionDataArray
      })
    } else {
      that.setData({
        deviceInfo: deviceInfo,
        currentDate: currentDate,
        actionDataArray: actionDataArray
      })
      that.connectDevice()
    }
    that.drawStep(0)
    that.drawDistance(0)
    that.drawCal(0)
    if (!token) {
      that.setData()
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let state = baseDeviceSynTool.getDeviceConnectedState()
    // 未连接
    if (state.code != 1002) {
      baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
        let deviceInfo = baseNetLinkTool.getDeviceInfo()
        if (deviceInfo.macAddress) {
          baseDeviceSynTool.connectDeviceFlow(deviceInfo)
        }
      }).catch(res => {
        baseTool.print(res)
        baseTool.showToast("蓝牙打开失败")
      })
    } else {
      that.onPullDownRefresh()
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    that.removeCallBack()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    wx.stopPullDownRefresh()
    if (that.data.isSynNow == true) {
      baseTool.print("正在同步0")
      baseTool.showToast("设备正在同步中...")
      return
    }
    that.temporaryData.pullDown = true
    that.temporaryData.synActionIndicator = 0
    let connectedState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedState.code != 1002) {
      that.connectDevice()
    } else {
      baseTool.print("正在同步1")
      that.startSynData()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  registerDeviceSynMessageBlock: function () {
    let that = this
    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {

    }).then(res => {
      baseTool.print(res)
    })
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      let currentDate = baseTool.getCurrentOffsetDateWithoutTime(0)
      that.getHomePage(currentDate)
    }).then(res => {
      let currentDate = baseTool.getCurrentOffsetDateWithoutTime(0)
      that.getHomePage(currentDate)
    })
    baseMessageHandler.addMessageHandler("deviceConnectedState", that, that.showDeviceConnectState).then(res => {
      baseTool.print(res)
    })
  },
  registerHeartRateCheckMessageBlock: function () {
    let that = this
    let timer = undefined
    baseMessageHandler.addMessageHandler("heartRateCheckIntervalMessage", that, res => {
      baseTool.print("收到消息")
      if (timer != undefined) {
        clearInterval(timer)
      }
      let time = res.time
      if (time == 0) {
        return
      }
      timer = setInterval(() => {
        that.checkHeartRate()
      }, time * 60 * 1000);
    }).then(res => {
      baseTool.print(res)
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("deviceSynMessage", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("deviceConnectedState", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("heartRateCheckIntervalMessage", this)
  },
  checkHeartRate: function () {
    let that = this
    let connectedDeviceState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedDeviceState.code != 1002) {
      baseTool.showToast("设备未连接, 无法测心率")
      return
    }

    wx.showLoading({
      title: "心率检测中",
      // mask: true,
    })
    let key = baseDeviceSynTool.commandSynDeviceRealHeartRate()
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        // baseTool.showToast("未获取到心率数据")
        baseTool.showToast("检测失败")
        wx.hideLoading()
        return
      }
      baseDeviceSynTool.removeCallBackForKey(key)
      let result = baseHexConvertTool.hexStringToValue(res.substr(6, 2))
      baseTool.print(result)
      if (result == 1) {
        that.answerRealHeartRateData()
      } else {
        baseTool.showToast("检测失败")
        wx.hideLoading()
      }
    }, key)
    that.answerRealHeartRateData()
  },
  answerRealHeartRateData: function () {
    let that = this
    let key = baseDeviceSynTool.answerRealHeartRateKey()
    // 等待回调
    baseDeviceSynTool.wattingCallBackForKey(res => {
      baseDeviceSynTool.removeCallBackForKey(key)
      baseDeviceSynTool.answerRealHeartRate()
      baseTool.print(res)
      let bmp = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
      baseTool.print(bmp)
      wx.hideLoading()
      baseTool.showToast('本次测量心率:' + bmp + "bmp")

      let token = baseTool.valueForKey("token")
      let heartRateAlarmValueKey = "heartRateAlarmValue" + token
      let heartRateAlarmValue = baseTool.valueForKey(heartRateAlarmValueKey)
      if (!heartRateAlarmValue) {
        heartRateAlarmValue = 0
      }

      let heartRateCheckSwitchKey = "heartRateCheckSwitch" + token
      let heartRateCheckSwitch = baseTool.valueForKey(heartRateCheckSwitchKey)
      if (!heartRateCheckSwitch) {
        heartRateCheckSwitch = false
      }

      if (heartRateCheckSwitch == true && heartRateAlarmValue > 0 && bmp >= heartRateAlarmValue) {
        that.showAlarm()
      }
    }, key)

  },
  showAlarm: function () {
    let that = this
    that.setData({
      showModal: true,
      showModalData: {
        confirmText: "知道了",
        title: "血压超高！",
        backgroundColor: "#171719",
        success: (result) => {
          that.setData({
            showModal: false
          })
        }
      }
    })
  },
  getHomePage: function (currentDate = 0) {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
    let userInfo = baseNetLinkTool.getUserInfo()
    let currentSex = (userInfo.sex == 2) ? 0 : 1
    let currentAge = userInfo.birthday
    let currentHeight = userInfo.height
    let currentWeight = userInfo.weight
    baseTool.print([deviceInfo, token])
    if (!deviceInfo.macAddress || !token) {
      that.setData({
        deviceInfo: deviceInfo,
        loadDone: true
      })
      return
    } else {
      that.setData({
        currentDate: currentDate
      })
      baseNetLinkTool.getRemoteDataFromServer("get_historical", "获取历史", {
        date: currentDate,
        id: deviceInfo.macAddress
      }).then(res => {
        baseTool.print([res, "历史数据"])
        let stepArray = res.step
        let sportArray = res.sport
        let sleepArray = res.sleep
        let heart_rateArray = res.heart_rate
        let blood_pressureArray = res.blood_pressure

        let currentStep = "00000"
        let targetStep = 0
        let percentStep = 0
        let currentCal = "0"
        let targetCal = 0
        let percentCal = 0
        let currentTime = 0
        let currentDistance = 0
        let targetDistance = 0
        let percentDistance = 0

        let actionDataArray = that.data.actionDataArray
        if (stepArray.length > 0) {
          let stepObject = stepArray[0]
          currentStep = baseTool.isValid(stepObject.step_all) ? stepObject.step_all : "00000"
          // 当天
          targetStep = stepObject.target
          currentCal = baseTool.isValid(stepObject.calorie) ? stepObject.calorie : "0"
          targetCal = stepObject.tar_cal
          currentDistance = (stepObject.distance / 1000).toFixed(2)
          targetDistance = stepObject.tar_dis
          if (currentDate === baseTool.getCurrentDateWithoutTime() && that.temporaryData.toDayTotalStep > 0) {
            currentStep = that.temporaryData.toDayTotalStep
            currentCal = (baseTool.getCalorieWithSteps(currentStep, currentWeight, currentHeight) / 1000).toFixed(1)
            currentDistance = (baseTool.getDistanceWithStep(currentStep, currentHeight) / 1000).toFixed(2)
          }

          if (baseTool.isValid(targetStep)) {
            percentStep = currentStep / targetStep
          }

          if (baseTool.isValid(targetCal)) {
            percentCal = currentCal / targetCal
          }

          if (baseTool.isValid(targetDistance)) {
            percentDistance = currentDistance / targetDistance
          }
          actionDataArray[0].titleName = currentStep
          actionDataArray[1].titleName = currentCal
          actionDataArray[2].titleName = currentDistance
        }

        if (sleepArray.length > 0) {
          let sleepObject = sleepArray[0]
          let total = baseTool.isValid(sleepObject.total) ? sleepObject.total : "0.00"

          if (currentDate === baseTool.getCurrentDateWithoutTime() && that.temporaryData.toDayTotalSleep > 0) {
            total = that.temporaryData.toDayTotalSleep
          }
          actionDataArray[3].titleName = total
        }

        if (heart_rateArray.length > 0) {
          let heart_rateObject = heart_rateArray[0]
          let bmp = baseTool.isValid(heart_rateObject.bmp) ? heart_rateObject.bmp : "0"
          actionDataArray[4].titleName = bmp
        }

        if (blood_pressureArray.length > 0) {
          let blood_object = blood_pressureArray[0]
          let shrink = blood_object.shrink
          let diastole = blood_object.diastole
          actionDataArray[5].titleName = shrink + "/" + diastole
        }

        // if (blood_pressureArray.length > 0) {
        //   let blood_pressureObject = blood_pressureArray[0]
        //   let shrink = baseTool.isValid(blood_pressureObject.shrink) ? blood_pressureObject.shrink : "000"
        //   let diastole = baseTool.isValid(blood_pressureObject.diastole) ? blood_pressureObject.diastole : "00"
        //   actionDataArray[5].titleName = shrink + "/" + diastole
        // }
        that.temporaryData.targetCal = targetCal
        that.temporaryData.targetDistance = targetDistance
        that.temporaryData.targetStep = targetStep
        that.setData({
          currentStep: currentStep,
          currentCal: currentCal,
          currentTime: currentTime,
          currentDistance: currentDistance,
          actionDataArray: actionDataArray
        })
        that.drawStep(percentStep)
        that.drawDistance(percentDistance)
        that.drawCal(percentCal)
      }).catch(res => {
        baseTool.print([res, "历史数据"])
        baseNetLinkTool.showNetWorkingError(res)
        that.setData({
          isSynNow: false,
          loadDone: true
        })
      })
    }

  },
  redrawCircle: function (percent = 0, canvasId = "", strokeBgColor = "", strokeFgColor = "", width = 0) {
    let that = this
    let degree = that.degreeForPercent(percent)
    let widthPx = baseTool.toPixel(width)
    let ctx = wx.createCanvasContext(canvasId, that)
    ctx.beginPath()
    ctx.setLineWidth(8)
    ctx.arc(widthPx / 2, widthPx / 2, widthPx / 2 - 4, 1.5 * Math.PI, degree, true)
    ctx.setStrokeStyle(strokeBgColor)
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(widthPx / 2, widthPx / 2, widthPx / 2 - 4, -0.5 * Math.PI, degree, false)
    ctx.setStrokeStyle(strokeFgColor)
    ctx.stroke()
    ctx.draw()
    // baseTool.print(["颜色", percent, strokeBgColor, strokeFgColor])
  },
  degreeForPercent: function (percent = 0) {
    return Math.PI * (2 * percent - 0.5)
  },
  drawDistance: function (percent = 0) {
    let that = this
    that.redrawCircle(percent, "circle-distance-percent", "#7b7d81", "#14D2B8", 160)
  },
  drawStep: function (percent = 0) {
    baseTool.print([percent, 11])
    let that = this
    that.redrawCircle(percent, "circle-step-percent", "#7b7d81", "#08A5F6", 280)
  },
  drawCal: function (percent = 0) {
    let that = this
    that.redrawCircle(percent, "circle-cal-percent", "#7b7d81", "#FF2828", 160)
  },
  connectDevice: function () {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()

    baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
      baseDeviceSynTool.connectDeviceFlow(deviceInfo)
    }).catch(res => {
      baseTool.print(that.temporaryData.pullDown)
      if (that.temporaryData.pullDown == true) {
        wx.stopPullDownRefresh()
        that.temporaryData.pullDown = false
      }
      let deviceConnectObject = that.data.deviceConnectObject
      deviceConnectObject.stateText = "蓝牙不可用"
      deviceConnectObject.stateColor = "red"
      deviceConnectObject.bindTitle = "重新连接"
      deviceConnectObject.action = 1
      that.setData({
        showDeviceToolBar: true,
        deviceConnectObject: deviceConnectObject
      })
    })
  },
  actionClick: function (e) {
    let that = this
    let token = baseNetLinkTool.getToken()
    if (!token) {
      baseTool.showToast("该功能需要登录之后才能连接设备")
      setTimeout(() => {
        baseNetLinkTool.gotoAuthorization()
      }, 2000)
      return
    }
    let action = parseInt(e.detail.action)
    baseTool.print(action)
    switch (action) {
      case 0: {
        wx.navigateTo({
          url: '/pages/my/bindDevice/bindDevice'
        })
        break
      }
      case 1: {
        that.connectDevice()
        break
      }
      case 2: {
        if (that.data.isSynNow == true) {
          return
        }
        if (that.data.isSynNow == true) {
          baseTool.print("正在同步-1")
          return
        }
        baseTool.print("正在同步2")
        that.startSynData()
        break
      }
    }
  },
  closeToolBarClick: function () {
    let that = this
    that.setData({
      showDeviceToolBar: false
    })
  },
  showDeviceConnectState: function (res) {
    let that = this
    let deviceConnectObject = that.data.deviceConnectObject
    let showDeviceToolBar = true
    baseTool.print(["设备状态:", res])
    let code = parseInt(res.connectedState.code)
    switch (code) {
      case 1001: {
        deviceConnectObject.stateText = "暂无设备"
        deviceConnectObject.stateColor = "red"
        deviceConnectObject.bindTitle = "绑定设备"
        deviceConnectObject.action = 0
        // 此时必须关闭
        that.setData({
          isSynNow: false
        })
        // 关闭所有的指令回调
        baseDeviceSynTool.removeAllCallBack()
        break;
      }
      case 1002: {
        deviceConnectObject.stateText = "设备已连接"
        deviceConnectObject.stateColor = "green"
        deviceConnectObject.bindTitle = "同步数据"
        deviceConnectObject.action = 2
        let key = baseDeviceSynTool.commandDevicePower()
        baseDeviceSynTool.registerCallBackForKey(res => {
          baseTool.print(res)
          if (res == "fail") {
            // 此时必须关闭
            baseDeviceSynTool.removeCallBackForKey(key)
            that.setData({
              showDeviceToolBar: false,
              isSynNow: false
            })
            baseTool.showToast("电池信息获取超时")
            return
          }
          baseDeviceSynTool.removeCallBackForKey(key)
          let power = baseHexConvertTool.hexStringToValue(res.substr(6, 2)) + "%"
          that.setData({
            currentPower: power
          })
        }, key)
        setTimeout(() => {
          let UserInfokey = baseDeviceSynTool.commandUserInfo()
          baseDeviceSynTool.registerCallBackForKey(res => {
            baseTool.print(res)
            if (res == "fail") {
              // 此时必须关闭
              baseDeviceSynTool.removeCallBackForKey(key)
              that.setData({
                showDeviceToolBar: false,
                isSynNow: false
              })
              baseTool.showToast("用户信息获取超时")
              return
            }
            baseDeviceSynTool.removeCallBackForKey(UserInfokey)
            let sex = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
            let height = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
            let weight = baseHexConvertTool.hexStringToValue(res.substr(12, 2))
            let age = baseHexConvertTool.hexStringToValue(res.substr(14, 2))
            that.temporaryData.currentSex = sex
            that.temporaryData.currentHeight = height
            that.temporaryData.currentWeight = weight
            that.temporaryData.currentAge = age
          }, UserInfokey)
          if (that.temporaryData.pullDown == true) {
            if (that.data.isSynNow == true) {
              baseTool.print("正在同步-2")
              return
            }
            that.temporaryData.synActionIndicator = 0
            baseTool.print("正在同步3")
            that.startSynData()
          } else {
            that.synSettingTime()
          }

        }, 250);
        let token = baseTool.valueForKey("token")
        let heartIntervalTime = baseTool.valueForKey("heartIntervalTime" + token)
        if (baseTool.isValid(heartIntervalTime)) {
          baseMessageHandler.sendMessage("heartRateCheckIntervalMessage", {
            time: heartIntervalTime
          })
        }
        break;
      }
      case 1003: {
        deviceConnectObject.stateText = "设备断开连接"
        deviceConnectObject.stateColor = "red"
        deviceConnectObject.bindTitle = "重新连接"
        deviceConnectObject.action = 1
        // 此时必须关闭
        that.setData({
          isSynNow: false
        })
        // 关闭所有的指令回调
        baseDeviceSynTool.removeAllCallBack()
        break;
      }
      case 1004: {
        break;
      }
      case 1005: {
        break;
      }
      case 1006: {
        deviceConnectObject.stateText = "设备连接失败"
        deviceConnectObject.stateColor = "red"
        deviceConnectObject.bindTitle = "重新连接"
        deviceConnectObject.action = 1
        // 此时必须关闭
        that.setData({
          isSynNow: false
        })
        // 关闭所有的指令回调
        baseDeviceSynTool.removeAllCallBack()
        break
      }
    }

    if (that.temporaryData.pullDown == true) {
      wx.stopPullDownRefresh()
      that.temporaryData.pullDown = false
    }
    that.setData({
      showDeviceToolBar: showDeviceToolBar,
      deviceConnectObject: deviceConnectObject
    })
  },
  synSettingTime: function () {
    let that = this
    let key = baseDeviceSynTool.commandSettingTime()
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(["同步时间成功", res])
      baseDeviceSynTool.removeCallBackForKey(key)
      if (res === "fail") {
        baseTool.showToast("同步时间失败")
      } else {
        // 同步时间成功之后刷新
        that.onPullDownRefresh()
      }
    }, key)
  },
  startSynData: function () {
    let that = this
    that.setData({
      isSynNow: true
    })
    switch (that.temporaryData.synActionIndicator) {
      // 同步设备计步
      case 0: {
        that.synDeviceStep()
        break
      }
      // 同步睡眠数据
      case 1: {
        that.synDeviceSleep()
        break
      }
      case 2: {
        // 同步心率数据
        that.synHeartRate()
        break
      }
      case 3: {
        that.synDeviceBlood()
        break
      }
      default: {
        that.setData({
          isSynNow: false
        })
      }
    }
  },
  synDeviceStep: function (date = "") {
    let that = this
    let currentDate = baseTool.getCurrentDateWithoutTime()
    let lastSynDeviceDataDate = that.temporaryData.lastSynDeviceDataDate
    if (baseTool.isValid(lastSynDeviceDataDate) == false) {
      lastSynDeviceDataDate = baseTool.valueForKey("lastSynDeviceDataDate")
      if (baseTool.isValid(lastSynDeviceDataDate) == false) {
        lastSynDeviceDataDate = baseTool.getCurrentOffsetDateWithoutTime(-6)
        baseTool.setValueForKey(lastSynDeviceDataDate, "lastSynDeviceDataDate")
      } else {
        let offsetDay = baseTool.getOffsetDays(lastSynDeviceDataDate, currentDate)
        if (offsetDay > 6) {
          lastSynDeviceDataDate = baseTool.getCurrentOffsetDateWithoutTime(-6)
          baseTool.setValueForKey(lastSynDeviceDataDate, "lastSynDeviceDataDate")
        }
      }
      that.temporaryData.lastSynDeviceDataDate = lastSynDeviceDataDate
    }
    let offsetDays = baseTool.getOffsetDays(lastSynDeviceDataDate, currentDate)
    if (offsetDays > 6) {
      offsetDays = 6
      lastSynDeviceDataDate = baseTool.getCurrentOffsetDateWithoutTime(-6)
      baseTool.setValueForKey(lastSynDeviceDataDate, "lastSynDeviceDataDate")
    }
    that.temporaryData.needSynDayIndicator = offsetDays
    that.temporaryData.dataDateObjectList.length = 0
    setTimeout(() => {
      that.synDeviceTotalStep()
    }, 250);
  },
  synDeviceTotalStep() {
    let that = this
    if (that.temporaryData.needSynDayIndicator <= -1) {
      that.uploadStepData()
      return
    }
    let key = baseDeviceSynTool.wattingRealTimeStepKey()
    baseDeviceSynTool.removeCallBackForKey(key)
    key = baseDeviceSynTool.commandSynDeviceTotalStepData(that.temporaryData.needSynDayIndicator)
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "同步 " + date + " 的计步数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      baseDeviceSynTool.removeCallBackForKey(key)
      if (res == "fail") {
        // 此时必须关闭
        // baseTool.showToast("步数获取超时")
        // 
        setTimeout(() => {
          that.temporaryData.needSynDayIndicator--
          that.synDeviceTotalStep()
        }, 250);
        return
      }
      let stepString = res.substr(14, 8)
      let step = baseHexConvertTool.hexStringToValue(stepString)
      let year = baseHexConvertTool.hexStringToValue(res.substr(8, 2)) + 2000
      let month = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      let day = baseHexConvertTool.hexStringToValue(res.substr(12, 2))
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      // 改天无数据
      if (step == 0) {
        setTimeout(() => {
          that.temporaryData.needSynDayIndicator--
          that.synDeviceTotalStep()
        }, 250);
      } else if (step > 0) {
        let distanceString = res.substr(22, 8)
        let calorieString = res.substr(30, 8)
        let distance = baseHexConvertTool.hexStringToValue(distanceString)
        let calorie = baseHexConvertTool.hexStringToValue(calorieString)
        let dataDateObject = {}
        that.temporaryData.dataDateObjectList.push(dataDateObject)
        dataDateObject.date = date
        dataDateObject.target = 10000
        dataDateObject.distance = distance
        dataDateObject.calorie = (calorie / 1000).toFixed(1)
        dataDateObject.total = step
        baseTool.print(["本次数据", dataDateObject])
        if (that.temporaryData.needSynDayIndicator == 0) {
          that.temporaryData.toDayTotalStep = step
          that.redrawHomepage(step)
          that.acceptRealTimeSetep()
        }
        setTimeout(() => {
          that.synDeviceDetailStep()
        }, 250);
      }
    }, key)
  },
  acceptRealTimeSetep: function () {
    baseTool.print("实时数据")
    let key = baseDeviceSynTool.wattingRealTimeStepKey()
    let that = this
    baseDeviceSynTool.wattingCallBackForKey(res => {

      let stepString = res.substr(14, 8)
      let step = baseHexConvertTool.hexStringToValue(stepString)
      let year = baseHexConvertTool.hexStringToValue(res.substr(8, 2)) + 2000
      let month = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      let day = baseHexConvertTool.hexStringToValue(res.substr(12, 2))
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      // 改天无数据

      if (date === baseTool.getCurrentDateWithoutTime()) {
        that.redrawHomepage(step)
      }
    }, key)
  },
  redrawHomepage: function (step = 0) {
    let that = this
    let date = baseTool.getCurrentDateWithoutTime()
    let userInfo = baseNetLinkTool.getUserInfo()
    let currentSex = (userInfo.sex == 2) ? 0 : 1
    let currentAge = userInfo.birthday
    let currentHeight = userInfo.height
    let currentWeight = userInfo.weight
    that.temporaryData.toDayTotalStep = step
    let currentStep = that.temporaryData.toDayTotalStep
    let currentCal = (baseTool.getCalorieWithSteps(currentStep, currentWeight, currentHeight) / 1000).toFixed(1)
    let currentDistance = (baseTool.getDistanceWithStep(currentStep, currentHeight) / 1000).toFixed(2)
    let targetCal = that.temporaryData.targetCal
    let targetDistance = that.temporaryData.targetDistance
    let targetStep = that.temporaryData.targetStep
    let percentStep = 0
    let percentCal = 0
    let percentDistance = 0
    if (baseTool.isValid(targetStep)) {
      percentStep = currentStep / targetStep
    }

    if (baseTool.isValid(targetCal)) {
      percentCal = currentCal / targetCal
    }

    if (baseTool.isValid(targetDistance)) {
      percentDistance = currentDistance / targetDistance
    }
    let actionDataArray = that.data.actionDataArray
    actionDataArray[0].titleName = currentStep
    actionDataArray[1].titleName = currentCal
    actionDataArray[2].titleName = currentDistance
    that.setData({
      currentStep: currentStep,
      currentCal: currentCal,
      currentTime: date,
      currentDistance: currentDistance,
      actionDataArray: actionDataArray
    })
    that.drawStep(percentStep)
    that.drawDistance(percentDistance)
    that.drawCal(percentCal)
  },
  synDeviceDetailStep: function () {
    let that = this
    let key = baseDeviceSynTool.commandSynDeviceDetailStepData(that.temporaryData.needSynDayIndicator)
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    that.temporaryData.detailStepData = new Array(24)
    for (let index = 0; index < 24; ++index) {
      that.temporaryData.detailStepData[index] = {
        step: 0
      }
    }
    baseDeviceSynTool.registerCallBackForKey(res => {
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        // baseTool.showToast("步数获取超时")
        setTimeout(() => {
          that.temporaryData.needSynDayIndicator--
          that.synDeviceTotalStep()
        }, 250);
        return
      }
      // 总条数
      let totlalNumber = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
      // 序号
      let serialNumber = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      // 年
      let year = baseHexConvertTool.hexStringToValue(res.substr(12, 2)) + 2000
      // 月
      let month = baseHexConvertTool.hexStringToValue(res.substr(14, 2))
      // 日
      let day = baseHexConvertTool.hexStringToValue(res.substr(16, 2))
      // 时
      let hour = baseHexConvertTool.hexStringToValue(res.substr(18, 2))
      // 分
      let minute = baseHexConvertTool.hexStringToValue(res.substr(20, 2))

      // 完整的时间
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "") + " " + baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "")
      let step = baseHexConvertTool.hexStringToValue(res.substr(22, 4))
      let distance = baseHexConvertTool.hexStringToValue(res.substr(26, 4))
      let calorie = baseHexConvertTool.hexStringToValue(res.substr(30, 4))
      let text = "总数:" + totlalNumber + " 序号:" + serialNumber + " 时间:" + date + " 步数:" + step + " 距离:" + distance + " 卡路里:" + calorie
      baseTool.print(["一条完整的数据1", text])
      if (hour >= that.temporaryData.detailStepData.length) {
        hour = 0
      }
      baseTool.print([that.temporaryData.detailStepData, hour])
      let dataObject = that.temporaryData.detailStepData[hour]
      dataObject.step += step

      if (totlalNumber > 0) {
        if (serialNumber == 0) {
          // 开始标志
          let length = that.temporaryData.dataDateObjectList.length
          let dataDateObject = that.temporaryData.dataDateObjectList[length - 1]
          dataDateObject.time = baseTool.zeroFormat(hour + "") + ":00:00"
        }
        baseTool.print(["一条完整的数据2", text])
        if (serialNumber == totlalNumber - 1) {
          // 结束标志
          // 删除 key
          let length = that.temporaryData.dataDateObjectList.length
          let dataDateObject = that.temporaryData.dataDateObjectList[length - 1]
          // 当天数据
          dataDateObject.data = that.temporaryData.detailStepData
          let timeArray = that.temporaryData.detailStepData.filter((value, index, array) => {
            return value.step > 0
          })
          dataDateObject.duration = timeArray.length * 60
          baseDeviceSynTool.removeCallBackForKey(key)
          // 继续同步下一个日期
          setTimeout(() => {
            that.temporaryData.needSynDayIndicator--
            that.synDeviceTotalStep()
          }, 250);
        }
      } else {
        // 继续同步下一个日期
        setTimeout(() => {
          that.temporaryData.needSynDayIndicator--
          that.synDeviceTotalStep()
        }, 250);
      }
    }, key)
  },
  uploadStepData: function () {
    let that = this
    if (that.temporaryData.dataDateObjectList.length == 0) {
      baseTool.showToast("本次同步, 无计步数据")
      setTimeout(() => {
        that.temporaryData.synActionIndicator = 1
        baseTool.print("正在同步4")
        that.startSynData()
      }, 250);
      return
    }
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "上传计步数据..."
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseNetLinkTool.getRemoteDataFromServer("step_save", "保存计步数据", {
      data: that.temporaryData.dataDateObjectList,
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      deviceInfo.stateText = "上传计步数据成功"
      that.setData({
        deviceInfo: deviceInfo
      })
      setTimeout(() => {
        that.temporaryData.synActionIndicator = 1
        baseTool.print("正在同步5")
        that.startSynData()
        // that.getHomePage(baseTool.getCurrentDateWithoutTime())
      }, 250);

    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
      setTimeout(() => {
        that.temporaryData.synActionIndicator = 1
        baseTool.print("正在同步6")
        that.startSynData()
      }, 250);
    })
  },
  selecDateClick: function (e) {
    baseTool.print(e)
    let that = this
    let type = e.currentTarget.dataset.type
    if (type == "0") {
      that.temporaryData.selectDateIndicator--
    } else {
      that.temporaryData.selectDateIndicator++
    }

    let currentDate = baseTool.getCurrentOffsetDateWithoutTime(that.temporaryData.selectDateIndicator)
    let showSelectDate = true
    if (that.temporaryData.selectDateIndicator == 0) {
      showSelectDate = false
    }
    that.setData({
      currentDate: currentDate,
      showSelectDate: showSelectDate
    })

    that.getHomePage(currentDate)
    // that.getHeartRate(currentDate)
  },
  stepDetailClick: function () {
    let that = this
    let token = baseNetLinkTool.getToken()
    if (!token) {
      baseTool.showToast("该功能需要登录才能查看详细步数!")
      setTimeout(() => {
        baseNetLinkTool.gotoAuthorization()
      }, 2000)
      return
    }
    let date = that.data.currentDate
    let height = that.temporaryData.currentHeight
    let weight = that.temporaryData.currentWeight
    wx.navigateTo({
      url: "/pages/deviceData/stepDetail/stepDetail?date=" + date + "&height=" + height + "&weight=" + weight,
    })
  },
  heartDetailClick: function () {
    let token = baseNetLinkTool.getToken()
    if (!token) {
      baseTool.showToast("该功能需要登录才能使用心率检测功能!")
      setTimeout(() => {
        baseNetLinkTool.gotoAuthorization()
      }, 2000)
      return
    }
    wx.navigateTo({
      url: "/pages/deviceData/heartDetail/heartDetail"
    })
  },
  synHeartRate: function () {
    let that = this
    that.temporaryData.heartRateObjectList.length = 0
    let key = baseDeviceSynTool.commandSynDeviceHeartRate()
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "同步心率数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    let heartRateObjectContainer = {}
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      // 总条数
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        // baseTool.showToast("未获取到心率数据")
        that.temporaryData.synActionIndicator = 3
        setTimeout(() => {
          baseTool.print("正在同步7")
          that.startSynData()
        }, 250);

        return
      }
      let totlalNumber = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
      // 序号
      let serialNumber = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      // 年
      let year = baseHexConvertTool.hexStringToValue(res.substr(12, 2)) + 2000
      // 月
      let month = baseHexConvertTool.hexStringToValue(res.substr(14, 2))
      // 日
      let day = baseHexConvertTool.hexStringToValue(res.substr(16, 2))
      // 时
      let hour = baseHexConvertTool.hexStringToValue(res.substr(18, 2))
      // 分
      let minute = baseHexConvertTool.hexStringToValue(res.substr(20, 2))

      let second = baseHexConvertTool.hexStringToValue(res.substr(22, 2))
      // 完整的时间
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      let time = baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "") + ":" + baseTool.zeroFormat(second + "")
      let bmp = baseHexConvertTool.hexStringToValue(res.substr(24, 2))
      let heartObject = heartRateObjectContainer[date]
      if (typeof (heartObject) != "object") {
        heartRateObjectContainer[date] = {
          date: date,
          data: [{
            time: time,
            bmp: bmp
          }]
        }
      } else {
        heartObject.data.push({
          time: time,
          bmp: bmp
        })
      }
      // 结束
      baseTool.print(["心率", serialNumber, totlalNumber])
      if (serialNumber == totlalNumber) {
        baseDeviceSynTool.removeCallBackForKey(key)
        that.temporaryData.heartRateObjectList = baseTool.values(heartRateObjectContainer)
        that.uploadHeartRateData()
      }
    }, key)
  },
  uploadHeartRateData: function () {
    let that = this
    if (that.temporaryData.heartRateObjectList.length == 0) {
      baseTool.showToast("本次同步, 无心率数据")
      that.temporaryData.synActionIndicator = 3
      baseTool.print("正在同步8")
      that.startSynData()
      return
    }
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "上传心率数据..."
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseNetLinkTool.getRemoteDataFromServer("heart_rate_save", "保存心率数据", {
      data: that.temporaryData.heartRateObjectList,
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      deviceInfo.stateText = "上传心率数据成功"
      that.setData({
        deviceInfo: deviceInfo
      })
      // that.getHomePage(baseTool.getCurrentDateWithoutTime())
      baseTool.print("正在同步9")
      that.temporaryData.synActionIndicator = 3
      that.startSynData()
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
      that.temporaryData.synActionIndicator = 3
      baseTool.print("正在同步10")
      that.startSynData()
    })
  },
  didSelectRowAtIndexPath: function (e) {
    let indexPath = e.detail
    baseTool.print(indexPath)
    let row = indexPath.row
    let that = this
    switch (row) {
      case 0:
      case 1:
      case 2: {
        that.stepDetailClick()
        break
      }
      case 3: {
        that.sleepDetailClick()
        break;
      }
      case 4: {
        that.heartDetailClick()
        break;
      }
      case 5: {
        that.bloodDetailClick()
        break
      }
    }
  },
  synDeviceSleep: function () {
    let that = this
    let lastSynDeviceDataDate = that.temporaryData.lastSynDeviceDataDate
    let currentDate = baseTool.getCurrentDateWithoutTime()
    baseTool.print([lastSynDeviceDataDate, currentDate])
    let offsetDays = baseTool.getOffsetDays(lastSynDeviceDataDate, currentDate) + 1
    that.temporaryData.needSynDayIndicator = offsetDays
    that.temporaryData.dataDateObjectList.length = 0
    setTimeout(() => {
      that.synDeviceDetailSleep()
    }, 250);
  },
  synDeviceTotalSleep: function () {
    let that = this
    if (that.temporaryData.needSynDayIndicator <= 0) {
      that.uploadSleepData()
      return
    }
    let key = baseDeviceSynTool.commandSynDeviceSleepTotalData(that.temporaryData.needSynDayIndicator)
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "同步 " + date + " 的睡眠数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        // baseTool.showToast("睡眠获取超时")
        that.temporaryData.needSynDayIndicator--
        setTimeout(() => {
          that.synDeviceTotalSleep()
        }, 250);
        return
      }
      baseDeviceSynTool.removeCallBackForKey(key)
      let sleepString = res.substr(14, 4)
      let sleep = baseHexConvertTool.hexStringToValue(sleepString)
      let year = baseHexConvertTool.hexStringToValue(res.substr(8, 2)) + 2000
      let month = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      let day = baseHexConvertTool.hexStringToValue(res.substr(12, 2))
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      let otherDate = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
      // 如果日期一样
      if (date === otherDate) {
        // 往后推一天算数据
        date = baseTool.getDateOffsetDate(date, 1)
      }

      // 改天无数据
      if (sleep == 0) {
        that.temporaryData.needSynDayIndicator--
        setTimeout(() => {
          that.synDeviceTotalSleep()
        }, 250);
      } else if (sleep > 0) {
        let dataDateObject = {}
        that.temporaryData.dataDateObjectList.push(dataDateObject)
        dataDateObject.date = date
        dataDateObject.total = sleep
        baseTool.print(["本次睡眠数据", dataDateObject])
        if (that.temporaryData.needSynDayIndicator == 1) {
          that.temporaryData.toDayTotalSleep = sleep
          let actionDataArray = that.data.actionDataArray
          actionDataArray[3].titleName = sleep
          that.setData({
            actionDataArray: actionDataArray
          })
        }
        setTimeout(() => {
          that.synDeviceDetailSleep()
        }, 250);
      }
    }, key)
  },
  synDeviceDetailSleep: function () {
    let that = this
    if (that.temporaryData.needSynDayIndicator <= 0) {
      that.uploadSleepData()
      return
    }
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    that.temporaryData.detailSleepData = new Array()
    deviceInfo.stateText = "同步 " + date + " 的睡眠数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    let key = baseDeviceSynTool.commandSynDeviceSleepDetailData(that.temporaryData.needSynDayIndicator)
    baseDeviceSynTool.registerCallBackForKey(res => {
      // 总条数 站两个字节
      baseTool.print(res)
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        baseTool.showToast("睡眠获取超时")
        that.temporaryData.needSynDayIndicator--
        setTimeout(() => {
          that.synDeviceTotalSleep()
        }, 250);
        return
      }
      let totlalNumber = baseHexConvertTool.hexStringToValue(res.substr(8, 4))
      // 序号
      let serialNumber = baseHexConvertTool.hexStringToValue(res.substr(12, 4))
      // 年
      let year = baseHexConvertTool.hexStringToValue(res.substr(16, 2)) + 2000
      // 月
      let month = baseHexConvertTool.hexStringToValue(res.substr(18, 2))
      // 日
      let day = baseHexConvertTool.hexStringToValue(res.substr(20, 2))
      // 时
      let hour = baseHexConvertTool.hexStringToValue(res.substr(22, 2))
      // 分
      let minute = baseHexConvertTool.hexStringToValue(res.substr(24, 2))

      // 完整的时间
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "") + " " + baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "")
      let sleepSate = baseHexConvertTool.hexStringToValue(res.substr(26, 2))
      let sleepSateText = (sleepSate == 1) ? "清醒" : (sleepSate == 2 ? "浅睡" : "深睡")
      let text = "总数:" + totlalNumber + " 序号:" + serialNumber + " 时间:" + date + " 睡眠状态:" + sleepSateText + "(\"sleep\")"
      baseTool.print(["一条完整的数据1", text])
      let time = baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "") + ":00"
      baseTool.print([serialNumber, typeof (serialNumber)])

      date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      let otherDate = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
      // 如果日期一样
      if (date === otherDate) {
        // 往后推一天算数据
        date = baseTool.getDateOffsetDate(date, 1)
      }
      if (totlalNumber > 0) {
        if (serialNumber == 0) {
          // 开始标志

          let dataDateObject = {}
          dataDateObject.date = date
          dataDateObject.time = time
          dataDateObject.deep = 0
          dataDateObject.shallow = 0
          dataDateObject.sober = 0
          that.temporaryData.dataDateObjectList.push(dataDateObject)
          let dataObject = {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            quality: that.getSleepStateKeyByValue(sleepSate)
          }
          that.temporaryData.detailSleepData.push(dataObject)

        } else {
          let dataObject = {
            year: year,
            month: month,
            day: day,
            hour: hour,
            minute: minute,
            quality: that.getSleepStateKeyByValue(sleepSate)
          }
          let length = that.temporaryData.detailSleepData.length
          let preObject = that.temporaryData.detailSleepData[length - 1]
          // 总时长
          baseTool.print([preObject, dataObject, length, that.temporaryData.detailSleepData])
          let stateMinute = ((dataObject.day - preObject.day) * 24 + dataObject.hour - preObject.hour) * 60 + (dataObject.minute - preObject.minute)

          let dateLength = that.temporaryData.dataDateObjectList.length
          let dataDateObject = that.temporaryData.dataDateObjectList[dateLength - 1]
          dataDateObject[dataObject.quality] += stateMinute

          that.temporaryData.detailSleepData.push(dataObject)
        }

        if (serialNumber == totlalNumber - 1) {
          // 结束标志
          // 删除 key
          // 最后一个数据要减去一分钟
          let length = that.temporaryData.dataDateObjectList.length
          let dataDateObject = that.temporaryData.dataDateObjectList[length - 1]
          // 当天数据
          dataDateObject.data = that.temporaryData.detailSleepData
          dataDateObject.total = dataDateObject.deep + dataDateObject.shallow
          baseDeviceSynTool.removeCallBackForKey(key)
          // 继续同步下一个日期
          that.temporaryData.needSynDayIndicator--
          setTimeout(() => {
            that.synDeviceDetailSleep()
          }, 250);
        }
      } else {
        that.temporaryData.needSynDayIndicator--
        setTimeout(() => {
          that.synDeviceDetailSleep()
        }, 250);
      }
    }, key)
  },
  getSleepStateKeyByValue: function (sleepState = 1) {
    switch (sleepState) {
      case 1: {
        return "sober"
      }
      case 2: {
        return "shallow"
      }
      case 3: {
        return "deep"
      }
    }
  },
  uploadSleepData: function () {
    let that = this
    // 同步日期改为当天
    let lastSynDeviceDataDate = baseTool.getCurrentDateWithoutTime()
    baseTool.setValueForKey(lastSynDeviceDataDate, "lastSynDeviceDataDate")
    that.temporaryData.lastSynDeviceDataDate = lastSynDeviceDataDate
    if (that.temporaryData.dataDateObjectList.length == 0) {
      baseTool.showToast("本次同步, 无数睡眠据")
      setTimeout(() => {
        that.temporaryData.synActionIndicator = 2
        baseTool.print("正在同步11")
        that.startSynData()
      }, 250);
      return
    }
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "上传睡眠数据..."
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseNetLinkTool.getRemoteDataFromServer("sleep_save", "保存睡眠数据", {
      data: that.temporaryData.dataDateObjectList,
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      deviceInfo.stateText = "上传睡眠数据成功"
      that.setData({
        deviceInfo: deviceInfo
      })
      setTimeout(() => {
        that.temporaryData.synActionIndicator = 2
        baseTool.print("正在同步12")
        that.startSynData()
        // that.getHomePage(baseTool.getCurrentDateWithoutTime())
      }, 250);
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
      setTimeout(() => {
        that.temporaryData.synActionIndicator = 2
        baseTool.print("正在同步13")
        that.startSynData()
      }, 250);
    })
  },
  synDeviceBlood: function () {
    let that = this
    that.temporaryData.bloodObjectList.length = 0
    let key = baseDeviceSynTool.commandSynDeviceBlood()
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "同步血压数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    let bloodObjectContainer = {}
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      // 总条数
      if (res == "fail") {
        // 此时必须关闭
        baseDeviceSynTool.removeCallBackForKey(key)
        // baseTool.showToast("血压数据获取超时")
        that.setData({
          isSynNow: false
        })
        that.getHomePage(baseTool.getCurrentDateWithoutTime())
        return
      }
      let totlalNumber = baseHexConvertTool.hexStringToValue(res.substr(8, 2))
      // 序号
      let serialNumber = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      // 年
      let year = baseHexConvertTool.hexStringToValue(res.substr(12, 2)) + 2000
      // 月
      let month = baseHexConvertTool.hexStringToValue(res.substr(14, 2))
      // 日
      let day = baseHexConvertTool.hexStringToValue(res.substr(16, 2))
      // 时
      let hour = baseHexConvertTool.hexStringToValue(res.substr(18, 2))
      // 分
      let minute = baseHexConvertTool.hexStringToValue(res.substr(20, 2))

      let second = baseHexConvertTool.hexStringToValue(res.substr(22, 2))
      // 完整的时间
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      let time = baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "") + ":" + baseTool.zeroFormat(second + "")
      // 舒张压
      let shrink  = baseHexConvertTool.hexStringToValue(res.substr(24, 2))
      let diastole = baseHexConvertTool.hexStringToValue(res.substr(26, 2))
      let bloodObject = bloodObjectContainer[date]
      if (typeof (bloodObject) != "object") {
        bloodObjectContainer[date] = {
          date: date,
          data: [{
            time: time,
            shrink: shrink,
            diastole: diastole
          }]
        }
      } else {
        bloodObject.data.push({
          time: time,
          shrink: shrink,
          diastole: diastole
        })
      }
      // 结束
      if (serialNumber == totlalNumber) {
        baseDeviceSynTool.removeCallBackForKey(key)
        that.temporaryData.bloodObjectList = baseTool.values(bloodObjectContainer)
        that.uploadBloodData()
      }
    }, key)
  },
  uploadBloodData: function () {
    let that = this
    that.temporaryData.selectDateIndicator = 0
    let currentDate = baseTool.getCurrentOffsetDateWithoutTime(that.temporaryData.selectDateIndicator)
    let showSelectDate = true
    if (that.temporaryData.selectDateIndicator == 0) {
      showSelectDate = false
    }
    that.setData({
      currentDate: currentDate,
      showSelectDate: showSelectDate
    })
    that.getHomePage(currentDate)
    if (that.temporaryData.bloodObjectList.length == 0) {
      that.setData({
        isSynNow: false,
      })
      baseTool.showToast("本次同步, 无血压数据")
      return
    }
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "上传血压数据..."
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    that.temporaryData.synActionIndicator = 0
    baseNetLinkTool.getRemoteDataFromServer("blood_pressure_save", "保存血压数据", {
      data: that.temporaryData.bloodObjectList,
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      deviceInfo.stateText = "上传血压数据成功"
      that.setData({
        deviceInfo: deviceInfo
      })
      that.getHomePage(baseTool.getCurrentDateWithoutTime())
      setTimeout(() => {
        that.setData({
          isSynNow: false
        })
      }, 2000)
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
      that.setData({
        isSynNow: false
      })
    })
  },
  sleepDetailClick: function () {
    let that = this
    let date = that.data.currentDate
    wx.navigateTo({
      url: "/pages/deviceData/sleepDetail/sleepDetail?date=" + date
    })
  },
  bloodDetailClick: function () {
    let that = this
    let date = that.data.currentDate
    wx.navigateTo({
      url: "/pages/deviceData/bloodDetail/bloodDetail?date=" + date
    })
  }
})