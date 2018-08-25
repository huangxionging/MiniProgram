// pages/teach/teachIndex.js
const baseTool = require('../../../utils/baseTool.js')
const teachManager = require('../../../manager/teachManager.js')
const teachAdapter = require('../../../adapter/teachAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isSelect: true,
    videoUrl: '',
    videPicUrl: '',
    teachVideoUrl: '',
    showModal: false,
    isTel: false,
    newsList: [],
    
    showPoster: true,
    doctorName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    
    that.loadData()
    wx.startPullDownRefresh()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.lookVideoContext = wx.createVideoContext('look-video', this)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    if (that.lookVideoContext) {
      that.lookVideoContext.pause()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function(e) {
    let that = this
    that.lookVideoContext.pause()

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    teachManager.getTeachVideoInfo().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = teachAdapter.videoAdapter(res)
      baseTool.print(data)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  hideModal: function(e) {

  },
  cancleClick: function(e) {
    let that = this
    that.setData({
      showModal: false,
      modalDialog: {
        showModal: false
      }
    })
  },

  lookVideoPlay: function(e) {
    baseTool.print(e)
    let that = this
    if (that.data.showPoster == true) {
      that.lookVideoContext.pause()
    }
  },
  videoPlayClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      showPoster: false
    })
    that.lookVideoContext.play()
  },
  videoPause: function(e) {
    let that = this
    that.setData({
      showPoster: true
    })
    baseTool.print(['e', 'dddd'])
  }
})