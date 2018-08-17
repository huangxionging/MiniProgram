// pages/statistics/statistics/statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    yesterdayMoney: '0.50',
    totalMoney: '1024.51',
    weekMoney: '203.60',
    monthMoney: ' 421.11 ',
    dataList: [
      {
        title: '加入零蛀牙训练营',
        time: '2018-08-1 10:21:13',
        money: '+0.60',
        id: '0'
      },
      {
        title: '教学示范早上跟刷',
        time: '2018-08-10 08:21:13',
        money: '+0.60',
        id: '1'
      },
      {
        title: '教学示范晚上跟刷',
        time: '2018-08-10 20:21:13',
        money: '+0.60',
        id: '2'
      },
      {
        title: '今日案例分享',
        time: '2018-08-17 10:21:13',
        money: '+0.60',
        id: '3'
      },
    ]
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
  knowledgeMoneyRuleClick: function(e) {
    wx.navigateTo({
      url: '../knowledgeMoneyRule/knowledgeMoneyRule',
    })
  },
  withdrawClick: function(e) {
    wx.navigateTo({
      url: '../withdrawMoney/withdrawMoney',
    })
  },
  yesterdayClick: function(e) {
    wx.navigateTo({
      url: '../yesterdayMoney/yesterdayMoney',
    })
  }
})