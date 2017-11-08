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
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
        name: '林🐔',
      },
      {
        id: 1,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})