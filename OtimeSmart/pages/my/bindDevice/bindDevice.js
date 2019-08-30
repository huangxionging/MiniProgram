// pages/my/bindDevice/bindDevice.js
const baseTool = require('../../../utils/baseTool.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
// const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
const baseNetLinkTool = require('../../../utils/baseCloundNetLinkTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bluetoothIconUrl: "/resource/my_about.png",
    sectionDataArray: [{
      rowDataArray: []
    }],
    isConnectNow: false,
    currentDeviceObject: {}
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
    that.registerCallBack()
    that.foundDevice()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
    if (that.data.isConnectNow == false) {
      that.foundDevice()
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
  foundDevice: function() {
    let that = this
    wx.showNavigationBarLoading()
    wx.setNavigationBarTitle({
      title: '搜索中...',
    })

    let sectionDataArray = that.data.sectionDataArray
    let rowDataArray = sectionDataArray[0].rowDataArray
    rowDataArray.length = 0
    that.setData({
      sectionDataArray: sectionDataArray
    })

    let searchTimer = setTimeout(res => {
      baseDeviceSynTool.stopBluetoothDiscoveryFlow()
      baseTool.showToast("停止搜索, 如没有扫描到请检查设备")
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '扫描设备',
      })
      that.setData({
        isConnectNow: false,
        currentDeviceObject: {}
      })
    }, 10000)
    baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
      // 开始
      baseDeviceSynTool.openBluetoothFlow()
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '扫描设备',
      })
      clearTimeout(searchTimer)
      baseMessageHandler.sendMessage('deviceSynMessage', baseDeviceSynTool.deviceSynMessageType.DeviceSynTypeReLaunchBluetoothFail)
    })

  },
  registerCallBack: function() {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      baseTool.print(res)
    }).then(res => {
      baseTool.print(res)
    })

    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {
      let section = parseInt(res.code / 1000)
      let row = parseInt(res.code - section * 1000)
      baseTool.print([section, row])
      baseTool.showToast(res.text)
      let deviceObject = that.data.currentDeviceObject
      deviceObject.stateText = res.text
      that.setData({
        isConnectNow: false,
        currentDeviceObject: deviceObject
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
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },
  bindDeviceClick: function(e) {
    baseTool.print(e)
    let that = this
    let deviceObject = e.detail.data
    deviceObject.stateText = "绑定中..."
    that.setData({
      isConnectNow: true,
      currentDeviceObject: deviceObject
    })
    baseDeviceSynTool.connectDeviceFlow(deviceObject.deviceId)
  },
  processDeviceSynSuccessMessage: function (res) {
    let that = this
    let section = parseInt(res.code / 1000)
    let row = parseInt(res.code - section * 1000)
    switch (row) {
      case 9:
        {
          // 获得特征值成功
          that.formBindDevice()
          break;
        }
      case 11:
        {
          baseTool.print(res)
          baseTool.showToast(res.deviceName)
          let sectionDataArray = that.data.sectionDataArray
          let rowDataArray = sectionDataArray[0].rowDataArray
          rowDataArray.push(res)
          that.setData({
            sectionDataArray: sectionDataArray
          })
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
              currentDeviceObject: {}
            })
          }, 2000)
          break
        }
    }
  },
  formBindDevice: function() {
    let that = this
    let deviceObject = that.data.currentDeviceObject
    let systemInfo = wx.getSystemInfoSync()
    // 苹果设备
    let iosDeviceId = ""
    let androidDeviceId = ""
    if (systemInfo.brand == "iPhone") {
      iosDeviceId = deviceObject.deviceId
      androidDeviceId = deviceObject.macAddress
    } else if (systemInfo.brand == "devtools") {
      // 模拟器
      return
    } else {
      androidDeviceId = deviceObject.deviceId
      // deviceObject.macAddress = deviceObject.deviceId
    }

    baseNetLinkTool.getRemoteDataFromServer("bindDevice", "绑定设备", {
      macAddress: deviceObject.macAddress ? deviceObject.macAddress : "",
      deviceName: deviceObject.deviceName ? deviceObject.deviceName : "",
      iosDeviceId: iosDeviceId,
      androidDeviceId: androidDeviceId,
      localName: deviceObject.localName ? deviceObject.localName : "",
      // openid: baseNetLinkTool.getOpenId()
    }).then(res => {
      baseTool.print(res)
      baseTool.setValueForKey(res.deviceInfo, "deviceInfo")
      baseMessageHandler.sendMessage("refresh", "刷新")
      let timer = setTimeout(() => {
        clearTimeout(timer)
        wx.navigateBack()
      }, 2000)
    }).catch(res => {
      // 超时
      baseTool.showToast("绑定失败")
      let that = this
      that.setData({
        isConnectNow: false,
        currentDeviceObject: {}
      })
    })
  }
})