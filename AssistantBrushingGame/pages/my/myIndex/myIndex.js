// pages/my/myIndex/myIndex.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loadingDone: false,
    dataList:[
      {
        id: 1,
        icon: 'icon_contest.png',
        title: '刷牙比赛',
        quantity: 10,
        url: '../brushContest/brushContest'
      },
      {
        id: 2,
        icon: 'icon_user.png',
        title: '参赛者',
        quantity: 50,
        url: '../../contest/contestUser/contestUser'
      },
      {
        id: 3,
        icon: 'icon_user.png',
        title: '我的诊所',
        // quantity: 50,
        url: '../myClinic/myClinic'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      loginManager.getUserInfo().then(res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: app.globalData.userInfo
        })
      })
    }

    that.loadData()
    app.userInfoReadyCallback = res => {
      that.loadData()
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo
        })
      } else {
        loginManager.getUserInfo().then(res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: app.globalData.userInfo
          })
        })
      }
    }
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
    this.loadData()
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
  loadData: function () {
    var that = this
    wx.showNavigationBarLoading()
    myManager.getMyGameCount().then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()

      if (res) {
        that.data.loadingDone= true
        var dataList = that.data.dataList
        baseTool.print(dataList)
        dataList[0].quantity = res.games
        dataList[1].quantity = res.players
        that.setData({
          loadingDone: true,
          dataList: dataList,
        })
      }
              
    }).catch(res => {
      baseTool.print(res)
    })
  }
})