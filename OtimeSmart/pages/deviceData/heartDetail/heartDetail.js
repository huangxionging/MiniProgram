// pages/deviceData/heartDetail/heartDetail.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastHeartRate: "0",
    showHearRate: true,
    heartRateTip: "上次测量结果",
    sectionDataArray: [{
      rowDataArray: []
    }]
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
    that.loadData()
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
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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
  loadData: function() {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
    if (!deviceInfo.macAddress && token) {
      return
    }
    let date = baseTool.getCurrentDateWithoutTime()
    baseNetLinkTool.getRemoteDataFromServer("heart_rate_get", "获取心率数据", {
      date: [date],
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      let dataArray = res.data
      let sectionDataArray = that.data.sectionDataArray
      let rowDataArray = sectionDataArray[0].rowDataArray
      rowDataArray.length = 0;
      let lastHeartRate = that.data.lastHeartRate
      let lastTime = "00:00:00"
      if (dataArray.length > 0) {
        let dataObject = dataArray[0]
        let dataList = dataObject.data
        // baseTool.print(dataList)
        for (let index = 0; index < dataList.length; ++index) {
          let heartObject = dataList[index]
          baseTool.print(heartObject.time)
          rowDataArray.push(heartObject)
          if (heartObject.time > lastTime) {
            lastHeartRate = heartObject.bmp
          }
        }
      }
      that.setData({
        lastHeartRate: lastHeartRate,
        sectionDataArray: sectionDataArray
      })
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  heartRateCheckClick: function() {
    let that = this
    let connectedDeviceState = baseDeviceSynTool.getDeviceConnectedState()
    if (connectedDeviceState.code != 1002) {
      baseTool.showToast("设备未连接, 无法测心率")
      return
    }
    that.setData({
      showHearRate: false
    })
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
      that.setData({
        showHearRate: true,
        lastHeartRate: bmp
      })
      wx.hideLoading()
    }, key)

  }
})