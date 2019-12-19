// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../utils/baseDeviceSynTool.js')
const baseURL = require('../../utils/baseURL.js')
const baseHexConvertTool = require('../../utils/baseHexConvertTool.js')

import {HomeAdapter} from "../../adapter/homeAdapter.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    deviceInfo: {},
    isSynNow: false,
    currentDate: "",
    currentTime: "00:00",
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
    minHeartRate: 0
  },
  temporaryData: {
    pullDown: false,
    synActionIndicator: 0, // 同步操作指令
    needSynDayIndicator: 7, // 需要同步的历史数据天数,
    dataDateObjectList: [],
    detailStepData: [],
    heartRateObjectList: [],
    selectDateIndicator: 0,
    currentAge: 0, // 当前年龄
    currentSex: -1,
    currentHeight: 0,
    currentWeight: 0,
    homeAdapter: new HomeAdapter()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    // 当前日期
    let token = baseNetLinkTool.getToken()
    let currentDate = baseTool.getCurrentDateWithoutTime()
    // 设备信息
    let actionDataArray  = that.temporaryData.homeAdapter.getActionItems()
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    // 设备连接状态
    let deviceConnectObject = that.data.deviceConnectObject
    that.registerCallBack()
    let userInfo = baseNetLinkTool.getUserInfo()
    that.temporaryData.currentSex = (userInfo.sex == 2) ? 0 : 1
    that.temporaryData.currentAge = userInfo.birthday
    that.temporaryData.currentHeight = userInfo.height
    that.temporaryData.currentWeight = userInfo.weight
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
      let lastUploadStepDate = baseTool.valueForKey("lastUploadStepDate")
      if (!lastUploadStepDate) {
        lastUploadStepDate = baseTool.getCurrentOffsetDateWithoutTime(-6)
        baseTool.setValueForKey(lastUploadStepDate, "lastUploadStepDate")
      }
    }
    that.drawStep(0)
    that.drawDistance(0)
    that.drawCal(0)
    if (!token) {
      that.setData()
    }

    // HomeAdapter.getActionItems()
    baseTool.print()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // that.registerDeviceSynMessageBlock()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    that.removeCallBack()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    wx.stopPullDownRefresh()
    if (that.data.isSynNow == true) {
      baseTool.showToast("设备正在同步中...")
      return
    }
    that.temporaryData.pullDown = true
    that.temporaryData.synActionIndicator = 0
    let connectedState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedState.code != 1002) {
      that.connectDevice()
    } else {
      that.startSynData()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  registerDeviceSynMessageBlock: function() {
    let that = this
    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {

    }).then(res => {
      baseTool.print(res)
    })
  },
  registerCallBack: function() {
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
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("deviceConnectedState", this)
  },
  getHomePage: function (currentDate = 0) {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
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

        let currentStep = 0
        let target = 0
        let percent = 0
        let currentCal = 0
        let currentTime = 0
        let currentDistance = 0
        if (stepArray.length > 0) {
          let stepObject = stepArray[0]
          currentStep = stepObject.step_all
          target = stepObject.target
          currentCal = stepObject.calorie
          currentDistance = stepObject.distance / 1000

          if (target != null && target != undefined) {
            percent = currentStep / target
          }

          
        }

        

        that.setData({
          currentStep: currentStep,
          currentCal: currentCal,
          currentTime: currentTime,
          currentDistance: currentDistance,
        })
        baseTool.print(percent)
        that.drawStep(percent)
        that.drawDistance(0)
        that.drawCal(0)
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
  degreeForPercent: function(percent = 0) {
    return Math.PI * (2 * percent - 0.5)
  },
  drawDistance: function (percent = 0) {
    let that = this
    that.redrawCircle(percent, "circle-distance-percent", "#7b7d81", "#14D2B8", 160)
  },
  drawStep: function (percent = 0){
    baseTool.print([percent, 11])
    let that = this
    that.redrawCircle(percent, "circle-step-percent", "#7b7d81", "#08A5F6", 280)
  },
  drawCal: function(percent = 0) {
    let that = this
    that.redrawCircle(percent, "circle-cal-percent", "#7b7d81", "#FF2828", 160)
  },
  connectDevice: function() {
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
  actionClick: function(e) {
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
      case 0:
        {
          wx.navigateTo({
            url: '/pages/my/bindDevice/bindDevice'
          })
          break
        }
      case 1:
        {
          that.connectDevice()
          break
        }
      case 2:
        {
          that.startSynData()
          break
        }
    }
  },
  closeToolBarClick: function() {
    let that = this
    that.setData({
      showDeviceToolBar: false
    })
  },
  showDeviceConnectState: function(res) {
    let that = this
    let deviceConnectObject = that.data.deviceConnectObject
    let showDeviceToolBar = true
    baseTool.print(["设备状态:", res])
    let code = parseInt(res.connectedState.code)
    switch (code) {
      case 1001:
        {
          deviceConnectObject.stateText = "暂无设备"
          deviceConnectObject.stateColor = "red"
          deviceConnectObject.bindTitle = "绑定设备"
          deviceConnectObject.action = 0
          break;
        }
      case 1002:
        {
          deviceConnectObject.stateText = "设备已连接"
          deviceConnectObject.stateColor = "green"
          deviceConnectObject.bindTitle = "同步数据"
          deviceConnectObject.action = 2
          let key = baseDeviceSynTool.commandDevicePower()
          baseDeviceSynTool.registerCallBackForKey(res => {
            baseTool.print(res)
            baseDeviceSynTool.removeCallBackForKey(key)
            let power = baseHexConvertTool.hexStringToValue(res.substr(6, 2)) + "%"
            that.setData({
              currentPower: power
            })
          }, key)

          let UserInfokey = baseDeviceSynTool.commandUserInfo()
          baseDeviceSynTool.registerCallBackForKey(res => {
            baseTool.print(res)
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
            that.startSynData()
          }
          break;
        }
      case 1003:
        {
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
      case 1004:
        {
          break;
        }
      case 1005:
        {
          break;
        }
      case 1006:
        {
          deviceConnectObject.stateText = "设备连接失败"
          deviceConnectObject.stateColor = "red"
          deviceConnectObject.bindTitle = "重新绑定设备"
          deviceConnectObject.action = 0
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
  startSynData: function() {
    let that = this
    switch (that.temporaryData.synActionIndicator) {
      // 同步设备计步
      case 0:
        {
          that.synDeviceStep()
          that.setData({
            isSynNow: true
          })
          break
        }
      case 1:
        {
          // 同步心率数据
          that.synHeartRate()
          that.setData({
            isSynNow: true
          })
        }
    }
  },
  synDeviceStep: function() {
    let that = this
    let lastUploadStepDate = baseTool.valueForKey("lastUploadStepDate")
    let currentDate = baseTool.getCurrentDateWithoutTime()
    let offsetDays = baseTool.getOffsetDays(lastUploadStepDate, currentDate)
    that.temporaryData.needSynDayIndicator = offsetDays
    that.temporaryData.dataDateObjectList.length = 0
    that.synDeviceTotalStep()
  },
  synDeviceTotalStep() {
    let that = this
    if (that.temporaryData.needSynDayIndicator == -1) {
      that.uploadStepData()
      return
    }
    let key = baseDeviceSynTool.commandSynDeviceTotalStepData(that.temporaryData.needSynDayIndicator)
    let date = baseTool.getCurrentOffsetDateWithoutTime(-that.temporaryData.needSynDayIndicator)
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = date + "的计步数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
      baseDeviceSynTool.removeCallBackForKey(key)
      let stepString = res.substr(14, 8)
      let step = baseHexConvertTool.hexStringToValue(stepString)
      let year = baseHexConvertTool.hexStringToValue(res.substr(8, 2)) + 2000
      let month = baseHexConvertTool.hexStringToValue(res.substr(10, 2))
      let day = baseHexConvertTool.hexStringToValue(res.substr(12, 2))
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      // 改天无数据
      if (step == 0) {
        that.temporaryData.needSynDayIndicator--
          if (that.temporaryData.needSynDayIndicator > 0) {
            let lastUploadStepDate = baseTool.valueForKey("lastUploadStepDate")
            lastUploadStepDate = baseTool.getDateOffsetDate(lastUploadStepDate, 1)
            baseTool.setValueForKey(lastUploadStepDate, "lastUploadStepDate")
          }
        that.synDeviceTotalStep()
      } else if (step) {
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
        that.synDeviceDetailStep()
      }
    }, key)
  },
  synDeviceDetailStep: function() {
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
    // deviceInfo.stateText = date + "的详细数据"
    // that.setData({
    //   isSynNow: true,
    //   deviceInfo: deviceInfo
    // })
    baseDeviceSynTool.registerCallBackForKey(res => {
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
        that.temporaryData.needSynDayIndicator--
          that.synDeviceTotalStep()
      }
    }, key)
  },
  uploadStepData: function() {
    let that = this
    if (that.temporaryData.dataDateObjectList.length == 0) {
      that.setData({
        isSynNow: false,
      })
      baseTool.showToast("本次同步, 无数据")
      that.temporaryData.synActionIndicator++
        that.startSynData()
      return
    }
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "上传数据..."
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    baseNetLinkTool.getRemoteDataFromServer("step_save", "保存计步数据", {
      data: that.temporaryData.dataDateObjectList,
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      deviceInfo.stateText = "上传成功"
      that.setData({
        deviceInfo: deviceInfo
      })
      that.temporaryData.synActionIndicator++
        that.startSynData()
      that.getHomePage()
      // that.syn
      // setTimeout(() => {
      //   that.setData({
      //     isSynNow: false
      //   })
      // }, 2000)
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
      that.setData({
        isSynNow: false
      })
    })
  },
  selecDateClick: function(e) {
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
  getDateDetail: function(currentDate) {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    baseNetLinkTool.getRemoteDataFromServer("step_get", "获取指定日期计步数据", {
      date: [currentDate],
      id: deviceInfo.macAddress
    }).then(res => {
      let dataArray = res.data
      baseTool.print(dataArray)

      let dataObject = {
        target: "10000",
        duration: "00:00",
        calorie: 0,
        distance: 0,
        data: []
      }
      // 表示今天上传过数据/ 渲染当天数据
      if (dataArray.length > 0) {
        dataObject = dataArray[0]

      }
      let dataList = dataObject.data
      let totalStep = 0
      let target = parseFloat(dataObject.target)
      let duration = parseFloat(dataObject.duration)
      let currentCal = dataObject.calorie
      let currentTime = baseTool.zeroFormat(duration / 60 + "") + ":" + baseTool.zeroFormat(duration % 60 + "")
      let currentDistance = dataObject.distance
      for (let index = 0; index < dataList.length; ++index) {
        totalStep += dataList[index].step
      }
      // that.drawStep(totalStep / target)
      that.setData({
        currentStep: totalStep,
        currentCal: currentCal,
        currentTime: currentTime,
        currentDistance: currentDistance
      })
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  stepDetailClick: function() {
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
  heartDetailClick: function() {
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
  synHeartRate: function() {
    let that = this
    that.temporaryData.heartRateObjectList.length = 0
    let key = baseDeviceSynTool.commandSynDeviceHeartRate()
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    deviceInfo.stateText = "心率数据"
    that.setData({
      isSynNow: true,
      deviceInfo: deviceInfo
    })
    let heartRateObjectContainer = {}
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
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

      let second = baseHexConvertTool.hexStringToValue(res.substr(22, 2))
      // 完整的时间
      let date = baseTool.zeroFormat(year + "") + "-" + baseTool.zeroFormat(month + "") + "-" + baseTool.zeroFormat(day + "")
      let time = baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "") + ":" + baseTool.zeroFormat(second + "")
      let bmp = baseHexConvertTool.hexStringToValue(res.substr(24, 2))
      let heartObject = heartRateObjectContainer[date]
      if (heartObject == undefined) {
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
      if (serialNumber == totlalNumber) {
        that.temporaryData.heartRateObjectList = baseTool.values(heartRateObjectContainer)
        that.uploadHeartRateData()
      }
    }, key)
  },
  uploadHeartRateData: function() {
    let that = this
    if (that.temporaryData.heartRateObjectList.length == 0) {
      that.setData({
        isSynNow: false,
      })
      baseTool.showToast("本次同步, 无心率数据")
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
      deviceInfo.stateText = "上传成功"
      that.setData({
        deviceInfo: deviceInfo
      })
      that.getHeartRate()
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
  getHeartRate: function (currentDate) {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
    baseTool.print([deviceInfo, token])
    if (!deviceInfo.macAddress && token) {
      that.setData({
        deviceInfo: deviceInfo
      })
      return
    } else {
      let last0Date = baseTool.getCurrentOffsetDateWithoutTime(0)
      if (currentDate != undefined) {
        last0Date = currentDate
      }
      that.setData({
        currentDate: last0Date
      })
      baseNetLinkTool.getRemoteDataFromServer("heart_rate_get", "获取心率数据", {
        date: [last0Date],
        id: deviceInfo.macAddress
      }).then(res => {
        baseTool.print(res)
        // 表示今天上传过数据/ 渲染当天数据
        let dataArray = res.data
        let averageHeartRate = 0, maxHeartRate = 0, minHeartRate = 0 
        if (dataArray.length > 0) {
          let dataObject = dataArray[0]
          let dataList = dataObject.data
          let sumHeart = 0
          maxHeartRate = dataList[0].bmp, minHeartRate = dataList[0].bmp
          for (let index = 0; index < dataList.length; ++index) {
            let bmp = parseFloat(dataList[index].bmp)
            sumHeart += bmp
            if (bmp > maxHeartRate) {
              maxHeartRate = bmp
            }

            if (bmp < minHeartRate) {
              minHeartRate = bmp
            }
          }
          averageHeartRate = (sumHeart / dataList.length).toFixed(0)
          
        }
        that.setData({
          averageHeartRate: averageHeartRate,
          maxHeartRate: maxHeartRate,
          minHeartRate: minHeartRate
        })
      }).catch(res => {
        baseTool.print(res)
        baseNetLinkTool.showNetWorkingError(res)
        that.setData({
          isSynNow: false
        })
      })
    }

  }
})