// pages/authorization/authorization/authorization.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
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
  getUserInfo: function (e) {
    baseTool.print(e)
    let that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.loginFlow(e.detail.userInfo)
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
  loginFlow: function (e) {
    wx.showLoading({
      title: '处理中',
    })
    wx.login({
      success: function (res) {
        baseTool.print(res)
        if (res.code) {
          let doctorId = baseTool.valueForKey('doctorId')

          loginManager.loginWithUserInfo(res.code, e, doctorId).then(res => {
            baseTool.print(res)
            wx.hideLoading()
            if (res && res.wxUser && res.wxUser.openid) {
              baseTool.setValueForKey(res.wxUser.openid, 'openid')
              if (res.wxUser.telephone) {
                baseTool.setValueForKey(res.wxUser.telephone, 'telephone')
              }
              loginManager.reLauch()
            } else {
              baseTool.showInfo('获取信息失败')
            }
          }).catch(res => {
            wx.hideLoading()
            baseTool.showInfo(res)
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        baseTool.showInfo('您的网络不太好')
      },
      complete: function (res) { },
    })
  }
})