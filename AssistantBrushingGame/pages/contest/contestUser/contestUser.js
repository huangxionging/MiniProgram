// pages/contest/contestUser/contestUser.js
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingDone: true,
    hasData: true,
    dataList: [
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 2,
        name: '林🐔',
      },
      {
        id: 3,
        name: '林🐔',
      },
      {
        id: 4,
        name: '林🐔',
      },
      {
        id: 5,
        name: '林🐔',
      },
      {
        id: 6,
        name: '林🐔',
      },
      {
        id: 7,
        name: '林🐔',
      },
      {
        id: 8,
        name: '林🐔',
      },
      {
        id: 9,
        name: '林🐔',
      },
      {
        id: 10,
        name: '林🐔',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    baseTool.print(options)
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
  addContestUser: () => {
    wx.navigateTo({
      url: '../addContestUser/addContestUser',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})