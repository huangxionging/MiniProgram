// pages/my/mockData/mockData.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
import { HomeAdapter } from "../../../adapter/homeAdapter.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  dateDidSelected: function (e) {
    let that = this
    let date = e.detail.value
    that.setData({
      date: date
    })
  },
  uploadDataClick: function (e) {
    baseTool.print(e)
    let that = this
    let index = parseInt(e.currentTarget.dataset.index) - 1000
    let homeAdapter = new HomeAdapter()
    let date = that.data.date
    let today = baseTool.getCurrentDateWithoutTime()
    let offset = baseTool.getOffsetDays(today, date)
    let data = {}
    let urlApi = ""
    let description = ""
    switch (index) {
      case 0: {
        data = homeAdapter.getStepDataByDay(offset)
        urlApi = "step_save"
        description = "上传计步数据"
        break
      }
      case 1: {
        data = homeAdapter.getSleepDataByDay(offset)
        urlApi = "sleep_save"
        description = "上传睡眠数据"
        break
      }
      case 2: {
        data = homeAdapter.getHeartDataByDay(offset)
        urlApi = "heart_rate_save"
        description = "上传心率数据"
        break
      }
      case 3: {
        data = homeAdapter.getBloodDataByDay(offset)
        urlApi = "blood_pressure_save"
        description = "上传血压数据"
        break
      }
    }
    that.uploadData(urlApi, data, description)
  },
  uploadData: function (urlApi = "", data = {}, description = "") {
    wx.showLoading({
      title: '正在上传' + description,
      mask: true
    })
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    baseNetLinkTool.getRemoteDataFromServer(urlApi, description, {
      data: [data],
      id: deviceInfo.macAddress
    }).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseTool.showToast(description + "成功")
      baseMessageHandler.sendMessage("refresh", "刷新")
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})