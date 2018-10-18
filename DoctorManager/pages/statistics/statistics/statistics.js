// pages/statistics/statistics/statistics.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const statisticsManager = require("../../../manager/statisticsManager.js")
const statisticsAdapter = require('../../../adapter/statisticsAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    yesterdayMoney: '*****',
    totalMoney: '*****',
    weekMoney: '*****',
    monthMoney: ' ***** ',
    dataList: []
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
    wx.startPullDownRefresh()
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
    let that = this
    that.loadData()
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
  knowledgeMoneyRuleClick: function (e) {
    // wx.navigateTo({
    //   url: '../knowledgeMoneyRule/knowledgeMoneyRule',
    // })
    wx.showToast({
      title: '开发中, 敬请期待...',
      icon: 'none',
      duration: 2000,
      mask: true,
    })
  },
  withdrawClick: function (e) {
    let that = this
    if (that.data.isBW == 1) {
      wx.navigateTo({
        url: '../withdrawMoney/withdrawMoney',
      })
    } else {
      wx.showToast({
        title: '开发中, 敬请期待...',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }
  },
  yesterdayClick: function (e) {
    // wx.navigateTo({
    //   url: '../yesterdayMoney/yesterdayMoney',
    // })
    wx.showToast({
      title: '开发中, 敬请期待...',
      icon: 'none',
      duration: 2000,
      mask: true,
    })
  },
  loadData: function (e) {
    let memberId = loginManager.getMemberId()
    let that = this
    statisticsManager.getTodayDynamic(memberId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = statisticsAdapter.getTodayDynamicAdapter(res)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  }
})