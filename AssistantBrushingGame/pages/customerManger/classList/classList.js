// pages/customerManger/classList/classList.js
const app = getApp()
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const teamManager = require('../../../manager/teamManager.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    hasData: false,
    pageNo: 1,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.pageQueryClass(that.data.pageNo)
    baseMessageHandler.addMessageHandler('classListRefresh', this, that.onPullDownRefresh).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
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
    var that = this
    that.data.pageNo = 1
    that.setData({
      dataList: []
    })
    that.pageQueryClass(that.data.pageNo)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    that.data.pageNo++
    that.pageQueryClass(that.data.pageNo)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 创建按钮的点击事件
   */
  createButton: function (e) {
    baseTool.print(e)
    var that = this
    var clinicId = baseTool.valueForKey('clinicId')
    baseTool.print(clinicId)
    if (clinicId == undefined || clinicId == '') {
      wx.showModal({
        title: '完善单位信息',
        content: '完善单位信息后才能创建班级哦~',
        showCancel: true,
        cancelText: '暂时没空',
        cancelColor: '#000',
        confirmText: '完善信息',
        confirmColor: '#00a0e9',
        success: function (res) {
          if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/my/myClinic/myClinic',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      return
    }
    wx.navigateTo({
      url: '../createClass/createClass',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  pageQueryClass: function() {
    var that = this
    wx.showNavigationBarLoading()
    teamManager.pageQueryClass(that.data.pageNo).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      var hasData = that.data.hasData
      var loadDone = true
      var dataListResult = res.dataList
      var dataList = that.data.dataList
      if (dataListResult != undefined && dataListResult.length > 0) {
        hasData = true
        for (var index = 0; index < dataListResult.length; ++index) {
          var item = dataListResult[index]
          var date = item.activeTime
          dataList.push({
            name: item.title,
            date: date,
            teamId: item.id,
            total: item.count,
            activeState: item.activeState
          })
        }
      }
      that.setData({
        loadDone: true,
        hasData: hasData,
        dataList: dataList
      })
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      that.setData({
        loadDone: true,
        hasData: false,
        dataList: []
      })
    })
  }
})