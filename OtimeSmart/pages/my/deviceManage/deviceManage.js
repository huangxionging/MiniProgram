// pages/my/deviceManage/deviceManage.js
const baseTool = require('../../../utils/baseTool.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../../utils/baseCloundNetLinkTool.js')
const myAdapter = require('../../../adapter/myAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasDevice: false,
    deviceInfo: {},
    launchImageUrl: baseNetLinkTool.getImagePath("launch.png"),
    itemList: []
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
    that.registerCallBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
  addDeviceClick: function() {
    wx.navigateTo({
      url: '/pages/my/bindDevice/bindDevice'
    })
  },
  unbindDeviceClick: function() {
    wx.showLoading({
      title: '设备解绑中...',
      mask: true,
    })
    let deviceInfo = baseTool.valueForKey("deviceInfo")
    baseNetLinkTool.getRemoteDataFromServer("unbind", "解绑设备", {
      device: deviceInfo.deviceId,
      name: deviceInfo.deviceName ? deviceInfo.deviceName : "",
      id: deviceInfo.macAddress,
      alias: deviceInfo.deviceAlias ? deviceInfo.deviceAlias : "",
    }).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseDeviceSynTool.clearDeviceObject()
      baseTool.removeObjectForKey("deviceInfo")
      baseMessageHandler.sendMessage("refresh", "刷新")
      wx.navigateBack()
    }).catch(res => {
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      baseTool.print(res)
      that.loadData()
    }).then(res => {
      baseTool.print(res)
      that.loadData()
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  loadData: function() {
    let that = this
    let deviceInfo = baseTool.valueForKey("deviceInfo")
    if (deviceInfo.macAddress != undefined) {
      baseTool.print(deviceInfo)
      let itemList = myAdapter.deviceManageItemList()
      baseTool.print(itemList)
      itemList[0].detail = deviceInfo.deviceName
      itemList[1].detail = deviceInfo.macAddress
      itemList[2].detail = 1.0
      that.setData({
        deviceInfo: deviceInfo,
        hasDevice: true,
        launchImageUrl: baseNetLinkTool.getImagePath("launch.png"),
        itemList: itemList
      })
    } else {
      that.setData({
        deviceInfo: deviceInfo,
        hasDevice: false
      })
    }
  }
})