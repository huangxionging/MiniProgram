// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../utils/baseDeviceSynTool.js')
const baseURL = require('../../utils/baseURL.js')
const baseHexConvertTool = require('../../utils/baseHexConvertTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    deviceInfo: {},
    isConnectNow: false,
    currentDate: "",
    currentTime: "00:00",
    currentStep: 0,
    currentDistance: 0,
    showDeviceToolBar: false,
    deviceConnectObject: {
      stateText: "暂无设备",
      bindTitle: "绑定设备",
      stateColor: "red",
      action: 0
    }
  },
  temporaryData: {
    pullDown: false,
    isSynDataNow: false,
    synActionIndicator: 0, // 同步操作指令
    needSynDayIndicator: 7 // 需要同步的历史数据天数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    // 当前日期
    let currentDate = baseTool.getCurrentDateWithoutTime()
    // 设备信息
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    // 设备连接状态
    let deviceConnectObject = that.data.deviceConnectObject
    that.registerCallBack()
    if (deviceInfo == "") {
      deviceConnectObject.stateText = "暂无设备"
      deviceConnectObject.stateColor = "red"
      deviceConnectObject.bindTitle = "绑定设备"
      that.setData({
        currentDate: currentDate,
        showDeviceToolBar: true,
        deviceConnectObject: deviceConnectObject
      })
    } else {
      that.setData({
        deviceInfo: deviceInfo,
        currentDate: currentDate
      })
      that.connectDevice()
    }


    let percent = that.data.currentStep / 10000
    that.redrawCircle(percent)
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
  onPageScroll: function(e) {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    if (that.temporaryData.isSynDataNow == true) {
      wx.stopPullDownRefresh()
      baseTool.showToast("设备正在同步中...")
      return
    }
    that.temporaryData.pullDown = true
    let connectedState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedState.code != 1002) {
      that.connectDevice()
    } else {
      that.temporaryData.isSynDataNow = true
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
      that.getHomePage()
    }).then(res => {
      that.getHomePage()
    })
    baseMessageHandler.addMessageHandler("deviceConnectedState", that, that.showDeviceConnectState).then(res => {
      baseTool.print(res)
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("deviceConnectedState", this)
  },
  getHomePage: function() {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
    if (deviceInfo == "" && token != "") {
      return
    } else {
      let last6Date = baseTool.getCurrentOffsetDateWithoutTime(-6)
      let last5Date = baseTool.getCurrentOffsetDateWithoutTime(-5)
      let last4Date = baseTool.getCurrentOffsetDateWithoutTime(-4)
      let last3Date = baseTool.getCurrentOffsetDateWithoutTime(-3)
      let last2Date = baseTool.getCurrentOffsetDateWithoutTime(-2)
      let last1Date = baseTool.getCurrentOffsetDateWithoutTime(-1)
      let last0Date = baseTool.getCurrentOffsetDateWithoutTime(0)
      baseTool.print(baseTool.getOffsetDays(last0Date, last4Date))
      baseNetLinkTool.getRemoteDataFromServer("step_get", "获取计步数据", {
        date: [last0Date, last1Date, last2Date, last3Date, last4Date, last5Date,last6Date],
        id: deviceInfo.macAddress
      }).then(res => {
        baseTool.print(res)
        let dataArray = res.data
        let maxDate = last6Date
        let currentDateIndex = -1
        for (let index = 0; index < dataArray.length; ++index){
          let dataObject = dataArray[index]
          // 如果日期大于 maxDate
          if (dataObject.date > maxDate) {
            maxDate = dataObject.date
          }

          if (dataObject.date == last0Date) {
            currentDateIndex = index
          }
        }

        // 表示今天上传过数据
        if (currentDateIndex != -1) {
          that.temporaryData.needSynDayIndicator = 0
        } else {
          baseTool.print(baseTool.getOffsetDays(last0Date, maxDate))
          that.temporaryData.needSynDayIndicator = 0
        }

      }).catch(res => {

      })
    }

  },
  redrawCircle: function(percent = 0) {
    let that = this
    let degree = that.degreeForPercent(percent)
    let width = baseTool.toPixel(160)
    let ctx = wx.createCanvasContext("circle-percent", that)
    baseTool.print(ctx)
    ctx.beginPath()
    ctx.setLineWidth(8)
    ctx.arc(width / 2, width / 2, width / 2 - 4, -0.5 * Math.PI, degree, true)
    ctx.setStrokeStyle('#6B92FB')
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(width / 2, width / 2, width / 2 - 4, -0.5 * Math.PI, degree, false)
    ctx.setStrokeStyle('#D8E2FB')
    ctx.stroke()
    ctx.draw()
  },
  degreeForPercent: function(percent = 0) {
    return Math.PI * (1.5 - 2 * percent)
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
    baseTool.print(res)
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
      case 0: {
        that.synDeviceStep()
        break
      }
    }
  },
  synDeviceStep: function() {
    let lastUploadDate = baseTool.valueForKey("lastUploadDate")
    // if (lastUploadDate == "")
    let key = baseDeviceSynTool.commandSynDeviceDetailStepData()
    baseDeviceSynTool.registerCallBackForKey(res => {
      baseTool.print(res)
    }, key)
  }
})