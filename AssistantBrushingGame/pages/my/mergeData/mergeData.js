// pages/my/mergeData/mergeData.js
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
    /**
       * 是否加载完成
       */
    loadingDone: false,
    hasData: false,
    gameIds: '',
    /**
     * 是否正在同步
     */
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)
    that.setData({
      gameIds: options.gameIds
    })
    // 加载数据
    that.loadData()
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
    // 加载数据
    var that = this
    that.loadData()
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
  loadData() {
    var that = this
    wx.showNavigationBarLoading()
    myManager.mergeData(that.data.gameIds).then(res => {
      baseTool.print(res)
      var dataList = []
      dataList.splice(0, dataList.length)
      if (res && res.length > 0) {
        baseTool.print(dataList)
        for (var index = 0; index < res.length; ++index) {
          dataList.push({
            rank: index + 1,
            name: res[index].name,
            tail: '(tail-' + res[index].macAddress.toLowerCase() + ')',
            playerId: res[index].playerId,
            score: res[index].score ? res[index].score : '未同步'
          })
          if (index == 0) {
            dataList[index].color = '#ffb9e0'
          } else if (index == 1) {
            dataList[index].color = '#fe6941'
          } else if (index == 2) {
            dataList[index].color = '#2cabee'
          }
        }
        that.setData({
          loadingDone: true,
          hasData: true,
          dataList: dataList,
        })
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }).catch(res => {
      baseTool.print(res)
    })
  }
})