// pages/customerManger/classList/classList.js
const app = getApp()
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    hasData: false,
    dataList: [
      {
        date: '2018-01-01',
        name: '小小牙医1班',
        total: 10,
        teamId: '',
        id: 1
      },
      {
        date: '2018-01-02',
        name: '小小牙医2班',
        teamId: '',
        total: 12,
        id: 2
      },
      {
        date: '2018-01-03',
        name: '小小牙医3班',
        teamId: '',
        total: 8,
        id: 3
      },
      {
        date: '2018-01-05',
        name: '小小牙医4班',
        teamId: '',
        total: 23,
        id: 4
      },
      {
        date: '2018-01-06',
        name: '小小牙医5班',
        teamId: '',
        total: 18,
        id: 5
      },
    ]
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
  }
})