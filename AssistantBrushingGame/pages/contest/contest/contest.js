// pages/contest/contest.js
const app = getApp()
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

var data = {
  /**
    * 是否加载完成
    */
  loadingDone: false,
  hasData: false,
  gameId: '',
  contestTitle: '刷牙比赛1',
  contestDate: '2017-10-25',
  /**
   * 是否正在同步
   */
  isSyn: false,
  dataList: [
    {
      rank: 1,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98',
      color: '#ffb9e0',
    },
    {
      rank: 2,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98',
      color: '#fe6941',
    },
    {
      rank: 3,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98',
      color: '#2cabee',
    },
    {
      rank: 4,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98'
    },
    {
      rank: 5,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98'
    },
    {
      rank: 6,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98'
    },
    {
      rank: 7,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98'
    },
    {
      rank: 8,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98'
    },
    {
      rank: 9,
      name: '林基金',
      tail: '(tail-1233334444)',
      score: '98'
    },
  ]
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
    var that = this
    that.getHomePage()
    baseMessageHandler.addMessageHandler('deleteContest', this, that.deleteContest).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })

    // baseMessageHandler.addMessageHandler('message', this, function (res) {
    //   baseTool.print(res)
    // }).then(res => {
    //   baseTool.print(res)
    // }).catch(res => {
    //   baseTool.print(res)
    // })
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
    var that = this
    that.getHomePage()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  getHomePage: function() {
    var that = this
    wx.showNavigationBarLoading()
    var getHomePagePromise = contestManager.getHomePage()
    var del = getHomePagePromise.then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(res)
      if (typeof(res) != 'undefined' && res.playersList) {
        that.parseData(res)
      } else if (typeof (res) != 'undefined' && res.gameInfo) {
        that.deleteContest(res.gameInfo)
      } else if (typeof(res) == 'undefined'){
        data.loadingDone = true
        data.hasData = false
        that.setData(data)
      }
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.print(res)
    })
  },
  createContest: () => {
    contestManager.addContest().then(res => {
      if (typeof (res) != 'undefined') {
        var gameId = res.game.gameId
        var name = res.game.name
        wx.navigateTo({
          url: '../createContest/createContest?' + 'gameId=' + gameId + '&' + 'name=' + name,
        })
      }
      
    }).catch(res => {
      baseTool.print(res)
    })
    
  },
  contestReSyn: () => {

  },
  contestUserClick: () => {
    wx.navigateTo({
      url: '../contestUser/contestUser',
    })
  },
  /**
   * 解析数据
   */
  parseData: function(res) {
    baseTool.print(res)
    var that = this
    data.contestTitle = res.gameInfo.name
    data.contestDate = res.gameInfo.createTime
    data.gameId = res.gameInfo.gameId
    data.loadingDone = true
    data.hasData = true
    // 清空数组
    data.dataList.length = 0
    for (var index = 0; index < res.playersList.length; ++index) {
      data.dataList.push({
        rank: index + 1,
        name: res.playersList[index].name,
        tail: '(tail-' + res.playersList[index].macAddress.toLowerCase() + ')',
        playerId: res.playersList[index].playerId,
        score: res.playersList[index].score ? res.playersList[index].score : '未同步'
      })
      if (index == 0) {
        data.dataList[index].color = '#ffb9e0'
      } else if (index == 1) {
        data.dataList[index].color = '#fe6941'
      } else if (index == 2) {
        data.dataList[index].color = '#2cabee'
      }
    }
    wx.hideNavigationBarLoading()
    that.setData(data)
  },
  deleteContest: function(res) {
    var that = this
    contestManager.deleteContest(res.gameId).then(res => {
      that.getHomePage()
    }).catch(res => {
      baseTool.print(res)
    })
  }
})