// pages/home/deviceBanner/deviceBanner.js
const baseTool = require('../../../utils/baseTool.js')
const doctorInfoAdapter = require('../../../adapter/doctorInfoAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPoster: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let data = doctorInfoAdapter.deviceBannerAdapter()
    that.setData(data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.videoContext = wx.createVideoContext('device-video', this)
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
    return {
      title: '装备库',
      imageUrl: 'http://qnimage.hydrodent.cn/dtb_love_teeth_share.png'
    }
  },
  endPlay: function (e){
    baseTool.print(e)
    let that = this
    // that.videoContext.play()
  },
  welfareClick: function(e) {
    wx.navigateTo({
      url: '/pages/brush/buyWelfare/buyWelfare'
    })
  },
  videoPlayClick: function (e) {
    let that = this
    that.setData({
      showPoster: false
    })
    that.videoContext.play()
  },
  onPageScroll: function(e) {
    // let that = this    
    // let height = baseTool.toPx(430)
    // if (e.scrollTop > height && (that.data.videoChanged == false)) {
    //   baseTool.print('隐藏视频')
    //   that.setData({
    //     videoChanged: true,
    //     // videoState: 'video-container-state'
    //   })
    // } else if (e.scrollTop <= height && (that.data.videoChanged == true)) {
    //   that.setData({
    //     videoChanged: false,
    //     videoState: 'video-container'
    //   })
    // }
  }
})