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
        title: '历史刷牙比赛',
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
        title: '我的单位',
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
    var that = this
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  itemClick: function(e) {
    baseTool.print(e)
    var that = this
    var index = e.currentTarget.dataset.index
    switch(index) {
      case 0: {
        var clinicId = baseTool.valueForKey('clinicId')
        if (clinicId == undefined || clinicId == '') {
          wx.showModal({
            title: '完善单位信息',
            content: '完善单位信息后才能查看历史刷牙比赛哦~',
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
        } else {
          wx.navigateTo({
            url: that.data.dataList[index].url,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        break
      }
      case 1:
      case 2: {
        wx.navigateTo({
          url: that.data.dataList[index].url,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
        break
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  loadData: function () {
    var that = this
    var clinicId = baseTool.valueForKey('clinicId')
    wx.showNavigationBarLoading()
    myManager.getMyGameCount(clinicId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()

      if (res) {
        that.data.loadingDone= true
        var dataList = that.data.dataList
        baseTool.print(dataList)
        dataList[0].quantity = res.games
        var contestUserObject = wx.getStorageSync('contestUserObject')
        var contestUserList = contestUserObject.contestUserList
        
        if (contestUserObject != undefined && contestUserList != undefined) {
          dataList[1].quantity = contestUserList.length
        } else {
          dataList[1].quantity = 0
        }
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