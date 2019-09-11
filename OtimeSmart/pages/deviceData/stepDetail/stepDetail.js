// pages/deviceData/stepDetail/stepDetail.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const myAdapter = require('../../../adapter/myAdapter.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataObjectArray: [],
    totalStep: "无数据",
    sectionDataArray: [{
      rowDataArray: []
    }]
  },
  temporaryData: {
    weight: 0,
    height: 0,
    date: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    baseTool.print(options)
    if (options) {
      that.temporaryData.weight = parseFloat(options.weight)
      that.temporaryData.height = parseFloat(options.height)
      that.temporaryData.date = options.date
      wx.setNavigationBarTitle({
        title: that.temporaryData.date + "步数详情",
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    let dataObjectArray = myAdapter.detailStepOrginData()
    that.setData({
      dataObjectArray: dataObjectArray
    })
    that.loadData()
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
  loadData: function() {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let token = baseNetLinkTool.getToken()
    baseTool.print([deviceInfo, token])
    if (!deviceInfo.macAddress && token) {
      baseTool.showToast("暂无设备")
      return
    }
    baseNetLinkTool.getRemoteDataFromServer("step_get", "获取指定日期计步数据", {
      date: [that.temporaryData.date],
      id: deviceInfo.macAddress
    }).then(res => {
      if (res.data && res.data.length > 0) {
        let dataArray = res.data[0].data
        let dataObjectArray = that.data.dataObjectArray
        let totalStep = 0
        let maxStep = 0
        let sectionDataArray = that.data.sectionDataArray
        let rowDataArray = sectionDataArray[0].rowDataArray
        let sumDistance = 0
        let sumCalorie = 0
        let sumStep = 0
        for (let index = 0; index < dataArray.length; ++index) {
          let dataObject = dataArray[index]
          let step = dataObject.step
          if (step > maxStep) {
            maxStep = step
          }
          if (step > 0) {
            let time = baseTool.zeroFormat(index + "") + ":00 ~ " + baseTool.zeroFormat(index + "") + ":59"
            let distance = baseTool.getDistanceWithStep(step, that.temporaryData.height)
            let calorie = (baseTool.getCalorieWithSteps(step, that.temporaryData.weight, that.temporaryData.height) / 1000).toFixed(1)
            sumDistance += distance
            sumStep += step
            sumCalorie += parseFloat(calorie)
            rowDataArray.push({
              step: step,
              time: time,
              distance: distance,
              calorie: calorie
            })
          }
        }
        for (let index = 0; index < dataArray.length; ++index) {
          let dataObject = dataArray[index]
          let step = dataObject.step
          let height = step / maxStep * 266
          totalStep += step
          dataObjectArray[index].step = step
          dataObjectArray[index].height = height
        }
        that.setData({
          dataObjectArray: dataObjectArray,
          totalStep: totalStep,
          sectionDataArray: sectionDataArray
        })
        let text = "总步数:" + sumStep + " 总卡路里:" + sumCalorie + " 总距离:" + sumDistance
        baseTool.print(text)
      }
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})