// pages/blank/blank.js

const baseTool = require('../../utils/baseTool.js')

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
    baseTool.print('aaa')
    wx.showNavigationBarLoading()
    wx.checkSession({
      success: res => {
        baseTool.print(res)
        wx.hideNavigationBarLoading()
        // wx.redirectTo({
        //   url: '../binding/binding',
        // })
      },
      fail: res => {
        baseTool.print((res))
        wx.hideNavigationBarLoading()
        wx.login({
          
        })
      }
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
    baseTool.print('页面出现')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    baseTool.print('页面隐藏')
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
  showNavigationBarLoading() {
    wx.showNavigationBarLoading()
  }
})