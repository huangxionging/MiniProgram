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
    date: "2019-09-22",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    let scale = baseTool.toPixel(1)
    that.setData({
      deviceInfo: baseNetLinkTool.getDeviceInfo(),
      scale: scale
    })
    // wx.startPullDownRefresh()
    that.registerCallBack()
    that.redrawCircle(0.50)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.registerDeviceSynMessageBlock()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let that = this
    that.removeCallBack()
  },
  onPageScroll: function(e) {
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    that.setData({
      isConnectNow: true
    })
    //{"_id":"90b4093b5d6542070b2bcbf507b1a132","androidDeviceId":"31:31:39:80:62:08","date":"2019-08-27T16:15:37.001Z","deviceName":"Lefun","iosDeviceId":"E77D440A-44E6-243B-2C7E-AA4BB4896269","localName":"Lefun","macAddress":"31:31:39:80:62:08","openid":"oM8UK45eeDVw9mVtUCNSA2OiccDY"}
   

    baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
      // 开始
      let systemInfo = wx.getSystemInfoSync()
      let deviceId = ""
      if (systemInfo.brand == "iPhone") {
        deviceId = that.data.deviceInfo.iosDeviceId
      } else {
        deviceId = that.data.deviceInfo.androidDeviceId
      }
      baseDeviceSynTool.connectDeviceFlow(deviceId)
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '扫描设备',
      })
      // clearTimeout(searchTimer)
      baseMessageHandler.sendMessage('deviceSynMessage', baseDeviceSynTool.deviceSynMessageType.DeviceSynTypeReLaunchBluetoothFail)
    })
    
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
  registerDeviceSynMessageBlock: function() {
    let that = this
    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {
      let section = parseInt(res.code / 1000)
      let row = parseInt(res.code - section * 1000)
      baseTool.print([section, row])
      baseTool.showToast(res.text)
      let deviceObject = that.data.deviceInfo
      deviceObject.stateText = res.text
      that.setData({
        isConnectNow: true,
        deviceInfo: deviceObject
      })
      switch (section) {
        case 1:
          {
            that.processDeviceSynSuccessMessage(res)
            break;
          }
        case 2:
          {
            that.processDeviceSynFailMessage(res)
            break;
          }
      }
    })
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.getHomePage()
    }).then(res => {
      that.getHomePage()
    })
    baseMessageHandler.addMessageHandler("deviceConnectedState", that, res => {
      
    }).then(res => {
      baseTool.print(res)
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler("deviceConnectedState", this)
  },
  getHomePage: function(){
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("getHomePage", "获取首页数据").then(res => {
    }).catch(res => {

    })
    baseNetLinkTool.getRemoteDataFromServer("getDeviceinfo", "获取首页数据").then(res => {
      baseTool.print(res)
      if (res.deviceInfo) {
        // baseTool.setValueForKey(res.deviceInfo, "deviceInfo")
      }
    }).catch(res => {

    })
  },
  processDeviceSynSuccessMessage: function (res) {
    let that = this
    let section = parseInt(res.code / 1000)
    let row = parseInt(res.code - section * 1000)
    switch (row) {
      case 9:
        {
          // 获得特征值成功
          // that.formBindDevice()
          // 开始
          let systemInfo = wx.getSystemInfoSync()
          let deviceId = ""
          if (systemInfo.brand == "iPhone") {
            deviceId = that.data.deviceInfo.iosDeviceId
          } else {
            deviceId = that.data.deviceInfo.androidDeviceId
          }
          let valueString = "0xCB0429"
          valueString += baseHexConvertTool.encodeCrc8("CB0429")
          let buffer = baseHexConvertTool.hexStringToArrayBuffer(valueString)
          baseTool.print(baseHexConvertTool.arrayBufferToHexString(buffer))

          baseDeviceSynTool.writeValue(deviceId, buffer)
          break;
        }
      case 11:
        {
          break
        }
    }
  },
  processDeviceSynFailMessage: function (res) {
    let that = this
    let section = parseInt(res.code / 1000)
    let row = parseInt(res.code - section * 1000)
    switch (row) {
      case 6:
        {
          // 超时
          let timer = setTimeout(() => {
            that.setData({
              isConnectNow: false,
              // deviceObject: {}
            })
          }, 2000)
          break
        }
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
    ctx.arc(width / 2, width / 2, width / 2 - 4, 1.5 * Math.PI, degree, true)
    ctx.setStrokeStyle('#6B92FB')
    ctx.stroke()
    ctx.closePath()
    ctx.beginPath()
    ctx.arc(width / 2, width / 2, width / 2 - 4, 1.5 * Math.PI, degree, false)
    ctx.setStrokeStyle('#D8E2FB')
    ctx.stroke()
    ctx.draw()
  },
  degreeForPercent: function(percent = 0) {
    return Math.PI * (1.5 - 2 * percent)
  }
})