// pages/deviceData/sleepDetail/sleepDetail.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalTime: "00",
    shallowTime: "00",
    deepTime: "00",
    soberTime: "00",
    hasData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.date) {
      that.data.date = options.date
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.getSleepData()
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
  getSleepData: function () {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let date = that.data.date
    baseNetLinkTool.getRemoteDataFromServer("sleep_get", "获得睡眠详细数据", {
      date: [date],
      id: deviceInfo.macAddress
    }).then(res => {
      if (res.data.length == 0) {
        baseTool.showToast("该日期暂无睡眠数据")
        return
      }
      let dataObject = res.data[0]
      let hasData = true
      let actionDataArray = []
      let totalTime = dataObject.total
      let shallowTime = dataObject.shallow
      let deepTime = dataObject.deep
      let soberTime = dataObject.sober
      let startTime = "", middleTime = "", endTime = ""
      let totalWidth = 0
      let detailDataArray = dataObject.data
      let lastObect = Object.assign({}, detailDataArray[0])
      lastObect.minute = 0
      for(let index = 0; index < detailDataArray.length; ++index) {
        let itemObject = detailDataArray[index]
        // baseTool.print(itemObject)
        let subDay = itemObject.day - lastObect.day
        let subHour = itemObject.hour - lastObect.hour
        let subMinute = itemObject.minute - lastObect.minute
        let minute = 0
        if (subDay !== 0) {
          minute = (subHour + 24) * 60 + subMinute
        } else {
          minute = subHour * 60 + subMinute
        }
        let width = minute / parseInt(totalTime) * 600
        totalWidth += width
        // 第一个数据
        if (index === 0) {
          startTime = baseTool.zeroFormat(itemObject.hour + "") + ":" + baseTool.zeroFormat(itemObject.minute + "")
          let middleHour = itemObject.hour +  parseInt((itemObject.minute + totalTime / 2) / 60)
          let middleMinute = (itemObject.minute + parseInt(totalTime / 2)) % 60
          middleTime = baseTool.zeroFormat(middleHour + "") + ":" + baseTool.zeroFormat(middleMinute + "")
        } 
        if (index === detailDataArray.length - 1) {
          width += 3
          endTime = baseTool.zeroFormat(itemObject.hour + "") + ":" + baseTool.zeroFormat(itemObject.minute + "")
        }
        let quality = lastObect.quality
        let color = "#ffffff"
        if (quality === "shallow") {
          color = "#CFA2F6"
        } else if (quality === "deep") {
          color = "#9013FE"
        } else if (quality === "sober") {
          color = "#FFC201"
        }
        let sleepObject = {
          color: color,
          time: minute,
          width: width,
          quality: quality
        }
        actionDataArray.push(sleepObject)
        lastObect = itemObject
        baseTool.print(itemObject)
      }
      that.setData({
        hasData: hasData,
        totalTime: totalTime,
        shallowTime: shallowTime,
        deepTime: deepTime,
        soberTime: soberTime,
        startTime: startTime,
        middleTime: middleTime,
        endTime: endTime,
        actionDataArray: actionDataArray
      })
    }).catch(res => {

    })
  }
})