// pages/contest/contestUser/contestUser.js
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

var data = {
  loadingDone: false,
  hasData: false,
  gameId: '',
  deviceId: '',
  deviceName: '',
  dataList: []
}

Page({

  /**
   * 页面的初始数据
   */
  data: data,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    baseTool.print(options)
    var that = this
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
  loadData: function() {
    var that = this
    wx.showNavigationBarLoading()
    contestManager.getContestUserList().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(typeof (res))
      if (typeof(res) != 'undefined' && res.length > 0) {
        var data = []
        for (var index = 0; index < res.length; ++index) {
          data.push({
            id: index + 1, // 主key
            name: res[index].name, // 名字
            playerId: res[index].playerId // 参赛者的 id
          })
        }
        that.setData({
          loadingDone: true,
          hasData: true,
          dataList: data,
        })
      } else {
        that.setData({
          loadingDone: true,
          hasData: false,
        })
      }
      
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.loadData()
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