// pages/my/bindDevice/bindDevice.js
const baseTool = require('../../../utils/baseTool.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bluetoothIconUrl: "/resource/my_about.png"
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
    that.foundDevice()
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
  foundDevice: function() {
    let that = this
    baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
      // 开始
      baseDeviceSynTool.openBluetoothFlow()
    }).catch(res => {
      baseMessageHandler.sendMessage('deviceSynMessage', baseDeviceSynTool.deviceSynMessageType.DeviceSynTypeReLaunchBluetoothFail)
    })
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      baseTool.print(res)
    }).then(res => {
      baseTool.print(res)
    })

    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {
      baseTool.print(res)
      let section = parseInt(res.code / 1000)
      let row = parseInt(res.code - section * 1000)
      baseTool.print(row)
      switch (section) {
        case 1: {
          if (res.code == 1011) {
            // 发现设备
            // baseTool.print(res)
            baseTool.showToast(res.devicName)

          }
          break;
        }
        case 2: {
          baseTool.showToast(res.text)
          break;
        }
      }
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },
})