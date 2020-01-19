// pages/authorization/authorization/authorization.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const brushManager = require('../../../manager/brushManager.js')
const brushAdapter = require('../../../adapter/brushAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization: 0,
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getUserInfo: function(e) {
    baseTool.print(e)
    let that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.loginFlow(e.detail)
      
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'loading',
        image: null,
        duration: 2000,
        mask: true,
      })
    }
  },
  loginFlow: function(e) {
    let that = this
    wx.showLoading({
      title: '处理中',
    })
    wx.login({
      success: function(res) {
        baseTool.print(res)
        if (res.code) {
          let doctorId = baseTool.valueForKey('doctorId')

          loginManager.loginWithUserInfo(res.code, e, doctorId).then(res => {
            baseTool.print(res)
            wx.hideLoading()
            that.data.avatar = e.userInfo.avatarUrl
            that.data.nickName = e.userInfo.nickName
            if (res && res.wxUser && res.wxUser.openid) {
              baseTool.setValueForKey(res.wxUser.openid, 'openid')
              if (baseTool.isExist(res.wxUser.telephone)) {
                baseTool.setValueForKey(res.wxUser.telephone, 'telephone')
              }

              if (baseTool.isExist(res.wxUser.memberId)) {
                baseTool.setValueForKey(res.wxUser.memberId, 'memberId')
              }

              if (baseTool.isExist(res.wxUser.doctorId)) {
                baseTool.setValueForKey(res.wxUser.doctorId, 'doctorId')
              }

              if (baseTool.isExist(res.wxUser.isJoinTrainingCamp)) {
                baseTool.setValueForKey(res.wxUser.isJoinTrainingCamp, 'isJoinTrainingCamp')
                if (res.wxUser.isJoinTrainingCamp == 0) {
                  wx.navigateTo({
                    url: '/pages/brush/applyZeroTeeth/applyZeroTeeth?avatar=' + encodeURI(that.data.avatar) + '&nickName=' + that.data.nickName,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                } else {
                  loginManager.reLauch()
                }
              }
            } else {
              baseTool.showInfo('获取信息失败')
            }
          }).catch(res => {
            wx.hideLoading()
            baseTool.showInfo(res)
          })
        }
      },
      fail: function(res) {
        wx.hideLoading()
        baseTool.showInfo('您的网络不太好')
      },
      complete: function(res) {},
    })
  },
  getPeopleCounting: function() {
    let that = this
    wx.showNavigationBarLoading()
    brushManager.getPeopleCounting().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = brushAdapter.brushZeroCampAdapter(res)
      that.setData(data)
      that.startRefreshPeopleState()
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  startRefreshPeopleState: function() {
    let that = this
    baseTool.startTimer(function(total) {
      if (that.data.stopTimer) {
        return true
      }
      let itemList = that.data.itemList
      let item = itemList[0]
      itemList.splice(0, 1)
      itemList.push(item)
      that.setData({
        itemList: itemList
      })
    }, 2000, 1000)
  },
  confirmClick: function(e) {
    wx.navigateTo({
      url: '/pages/brush/applyZeroTeeth/applyZeroTeeth?channel=authorization',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})