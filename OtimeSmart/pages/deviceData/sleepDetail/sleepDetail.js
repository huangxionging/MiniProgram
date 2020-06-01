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
      let totalTime = parseInt(dataObject.total) + parseInt(dataObject.sober)
      let shallowTime = 0// = dataObject.shallow
      let deepTime = 0// = dataObject.deep
      let soberTime = 0// = dataObject.sober
      let startTime = "", middleTime = "", endTime = ""
      let totalWidth = 0
      let detailDataArray = dataObject.data
      let totalMinute = 0
      for(let index = 1; index < detailDataArray.length; ++index) {
        let itemObject = detailDataArray[index]
        let lastObect = detailDataArray[index - 1]
        let subDay = itemObject.day - lastObect.day
        let subHour = itemObject.hour - lastObect.hour
        let subMinute = itemObject.minute - lastObect.minute
        // baseTool.print([lastObect, itemObject, subDay, subHour, subMinute])
        let minute = 0
        if (subDay !== 0) {
          minute = (subHour + 24) * 60 + subMinute
        } else {
          minute = subHour * 60 + subMinute
        }
        
        let width =  minute * 600 / parseFloat(totalTime)
        totalWidth += width
        totalMinute += minute
        // baseTool.print(minute + "分钟 " + width + " " + totalWidth)
        // 第一个数据
        if (index === 1) {
          if (width < 3){
            width = 3
          }
          startTime = baseTool.zeroFormat(lastObect.hour + "") + ":" + baseTool.zeroFormat(lastObect.minute + "")
          let middleHour = (lastObect.hour +  parseInt((lastObect.minute + totalTime / 2) / 60)) % 24
          let middleMinute = (lastObect.minute + parseInt(totalTime / 2)) % 60
          middleTime = baseTool.zeroFormat(middleHour + "") + ":" + baseTool.zeroFormat(middleMinute + "")
        } 
        if (index === detailDataArray.length - 1) {
          // width += 30
          endTime = baseTool.zeroFormat(itemObject.hour + "") + ":" + baseTool.zeroFormat(itemObject.minute + "")
          // baseTool.print(["结束时间", endTime, totalTime])
        }
        let quality = itemObject.quality
        let color = "#ffffff"
        if (quality === "shallow") {
          color = "#CFA2F6"
          shallowTime += minute
          baseTool.print(["浅睡时间", shallowTime])
        } else if (quality === "deep") {
          color = "#9013FE"
          deepTime += minute
        } else if (quality === "sober") {
          soberTime += minute
          color = "#FFC201"
        }
        let pixWidth = baseTool.toPixel(width)
        let sleepObject = {
          color: color,
          time: minute,
          width: pixWidth,
          quality: quality
        }
        actionDataArray.push(sleepObject)
        lastObect = itemObject
      }
      // baseTool.print(["打印结果", shallowTime, deepTime, soberTime, totalWidth, totalMinute, actionDataArray])
      // let sumMinute = 0, sumWidth = 0
      // for (let index = 0; index < actionDataArray.length; ++index) {
      //   sumMinute += actionDataArray[index].time
      //   sumWidth += actionDataArray[index].width
      // }
      // baseTool.print([sumWidth, sumMinute])
      that.setData({
        hasData: hasData,
        totalTime: dataObject.total,
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