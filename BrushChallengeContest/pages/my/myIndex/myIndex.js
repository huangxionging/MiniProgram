// pages/my/myIndex/myIndex.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const myAdapter = require('../../../adapter/myAdapter.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loadDone: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    let isLogin = baseNetLinkTool.isLogin()
    that.setData({
      isLogin: isLogin
    })
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      baseWechat.getUserInfo().then(res => {
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
        baseWechat.getUserInfo().then(res => {
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
    // wx.startPullDownRefresh({
    //   success: function (res) { },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
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
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  didSelectRow: function(e) {
    let isLogin = baseNetLinkTool.isLogin()
    if (isLogin == false) {
      baseTool.showToast("该功能需要登录之后才能使用哦!")
      setTimeout(() => {
        baseNetLinkTool.goAuthorization()
      }, 2000)
      return
    }
    let that = this
    let row = e.detail.row
    let section = e.detail.section
    let url = that.data.sectionDataArray[section].rowDataArray[row].url
    let tip = that.data.sectionDataArray[section].rowDataArray[row].title
    if (section == 0) {
      if (row == 3) {
        wx.navigateTo({
          url: url,
        })
        return
      }
      loginManager.completeClinicInfo("查看" + tip).then(res => {
        wx.navigateTo({
          url: url,
        })
      })
    } else if (section == 1) {
      switch (row) {
        case 0:{
          wx.makePhoneCall({
            phoneNumber: '4001618023',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          break
        }
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  loadData: function () {
    let that = this
    that.setData({
      sectionDataArray: myAdapter.myIndexSectionDataArray()
    })
  },
  loginClick: function() {
    baseNetLinkTool.goAuthorization()
  }
})