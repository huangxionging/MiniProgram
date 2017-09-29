// pages/scrollView/scrollView.js
var orders = ['red', 'green', 'blue', 'white']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'green',
    scrollTop: 200
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
  upper: function(e){
    console.log(e)
  },
  scroll: function(e){
    // console.log(e)
    // console.log(123)
  },
  lower: function(e) {
    // console.log(e)
    // console.log(124)
  },
  tap: function() {
    console.log(this.data['scrollTop'])
    var index = orders[Math.floor(Math.random() * 5)]
    this.setData({
      toView: index
    })
  },
  tapMove: function (e) {
    console.log(this.data['scrollTop'])
    var current = this.data['scrollTop']
    if (current >= 300) {
      console.log(2222)
      current = 0
    } else {
      current += 10
    }
    this.setData({
      scrollTop: current
    })
  }
})