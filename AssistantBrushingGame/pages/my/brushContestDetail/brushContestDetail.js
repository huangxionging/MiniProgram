// pages/my/brushContestDetail/brushContestDetail.js
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
    gameId: '',
    /**
     * 是否正在同步
     */
    dataList: [
     
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)
    that.setData({
      gameId: options.gameId
    })
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: options.name,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // 加载数据
    that.loadData()

    app.userInfoReadyCallback = res => {
      that.loadData()
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
    myManager.getContestgMembers(that.data.gameId).then(res => {
      baseTool.print(res)
      var dataList = []
      dataList.splice(0, dataList.length)
      if (res && res.length > 0) {
        baseTool.print(dataList)
        for (var index = 0; index < res.length; ++index) {
          dataList.push({
            name: res[index].name,
            tail: '(game-' + res[index].macAddress.toLowerCase() + ')',
            playerId: res[index].playerId,
            score: res[index].score ? res[index].score : 0
          })
        }

        // 按分数从大到小排序
        dataList.sort((a, b) => {
          return b.score - a.score
        })
        // 然后再改变值
        if (dataList.length > 0) {
          dataList[0].color = '#ffb9e0'
        }

        if (dataList.length > 1) {
          dataList[1].color = '#fe6941'
        }

        if (dataList.length > 2) {
          dataList[2].color = '#2cabee'
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