// pages/text/text.js
var texts =[
  '2011年1月, 微信1.0发布',
  '同年5月, 微信2.0语音对讲发布',
  '10月, 微信3.0新增摇一摇功能',
  '2013年3月, 微信用户突破1亿',
  '4月, 微信4.0发布朋友圈',
  '同年7月, 微信4.2发布公众号平台',
  '同年8月, 微信5.0发布微信支付',
  '2014年9月, 企业号发布',
  '同月, 发布微信卡包',
  '2015年1月, 微信第一条朋友圈广告发布',
  '2016年1月, 企业微信发布',
  '2017年1月, 小程序发布',
  '......'
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '',
    canAdd: true,
    canRemove: false
  },
  extraLine: [],
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

  /***
   * 添加一行
   */
  addLine: function(e) {
    var that = this
    this.extraLine.push(texts[this.extraLine.length % 12])
    this.setData({
      text: this.extraLine.join('\n'),
      canAdd: this.extraLine.length < 12,
      canRemove: this.extraLine.length > 0
    })
    setTimeout(function(){
      that.setData({
        scrollTop: 999999
      })
    }, 0)
  },

  /**
   * 删除一行
   */
  removeLine: function() {
    var that = this
    if (this.extraLine.length > 0) {
      this.extraLine.pop()
      this.setData({
        text: this.extraLine.join('\n'),
        canAdd: this.extraLine.length < 12,
        canRemove: this.extraLine.length > 0
      })
    }
    setTimeout(function () {
      that.setData({
        scrollTop: 999999
      })
    }, 0)
  }
})