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
    myManager.mergeData(that.data.gameIds).then(res => {
      baseTool.print(res)
      var dataList = []
      dataList.splice(0, dataList.length)
      if (res && res.length > 0) {
        baseTool.print(dataList)
        for (var index = 0; index < res.length; ++index) {
          var macAddress = res[index].macAddress.toUpperCase()
          // 待同步的列表项
         
          var item = {
            name: res[index].name,
            tail: baseTool.getDeviceName(macAddress),
            playerId: res[index].playerId,
            macAddress: macAddress,
            score: res[index].score ? res[index].score : 0,
            accuracy: res[index].accuracy
          }

          item.score = item.score + parseFloat("0." + item.accuracy)

          if (res[index].recordId) {
            item.recordId = res[index].recordId
          }

          // 添加数据集合
          dataList.push(item)
        }

        // 按分数从大到小排序
        dataList.sort((a, b) => {

          if (b.score == a.score) {
            baseTool.print('ddd')
            return b.accuracy - a.accuracy
          } else {
            return b.score - a.score
          }
          
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
  },
  scoreReportClick: function (e) {
    var that = this
    var data = that.data
    var index = e.currentTarget.dataset.index
    var item = data.dataList[index]
    if (item.recordId) {
      wx.navigateTo({
        url: '/pages/my/brushScoreReport/brushScoreReport?name=' + item.name + '&recordId=' + item.recordId,
        success: function (res) { },
        fail: function (res) {
          baseTool.print(res)
        },
        complete: function (res) { },
      })
    }
  }
})