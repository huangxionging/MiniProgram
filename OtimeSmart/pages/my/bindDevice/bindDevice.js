// pages/my/bindDevice/bindDevice.js
const baseTool = require('../../../utils/baseTool.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../../utils/baseCloundNetLinkTool.js')
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
  isSearchNow: false,

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
    if (that.isSearchNow == false) {
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
    that.isSearchNow = true
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
      that.isSearchNow = false
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
      baseTool.print(res)
      // baseTool.showToast(res.text)
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
    baseDeviceSynTool.connectDeviceFlow({
      macAddress: deviceObject.macAddress,
      deviceId: deviceObject.deviceId,
      deviceName: deviceObject.deviceName,
      deviceAlias: deviceObject.deviceAlias ? deviceObject.deviceAlias : ""
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
          // 同步时间
          let key = baseDeviceSynTool.commandSettingTime()
          baseDeviceSynTool.registerCallBackForKey(res => {
            baseDeviceSynTool.removeCallBackForKey(key)
          }, key)
          that.formBindDevice()
          break;
        }
      case 11:
        {
          baseTool.print(res)
          baseTool.showToast(res.deviceName)
          baseTool.print(res.deviceName)
          let deviceInfo = baseNetLinkTool.getDeviceInfo()
          
          let sectionDataArray = that.data.sectionDataArray
          let rowDataArray = sectionDataArray[0].rowDataArray
          if (deviceInfo == "") {
            rowDataArray.push(res)
          } else {
            if (res.macAddress == deviceInfo.macAddress) {
              rowDataArray.push(res)
            }
          }
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
    baseTool.print(deviceObject)
    baseNetLinkTool.getRemoteDataFromServer("bind", "绑定设备", {
      device: deviceObject.deviceId,
      name: deviceObject.deviceName ? deviceObject.deviceName : "",
      id: deviceObject.macAddress,
      alias: deviceObject.deviceAlias ? deviceObject.deviceAlias : "",
    }).then(res => {
      baseTool.print(res)
      baseTool.setValueForKey({
        macAddress: deviceObject.macAddress,
        deviceId: deviceObject.deviceId,
        deviceName: deviceObject.deviceName ? deviceObject.deviceName : "",
        deviceAlias: deviceObject.deviceAlias ? deviceObject.deviceAlias : ""
      }, "deviceInfo")
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