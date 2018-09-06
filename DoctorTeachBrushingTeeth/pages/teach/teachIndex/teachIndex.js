// pages/teach/teachIndex.js
const baseTool = require('../../../utils/baseTool.js')
const teachManager = require('../../../manager/teachManager.js')
const teachAdapter = require('../../../adapter/teachAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    videPicUrl: '',
    teachVideoUrl: '',
    showPoster: true,
    doctorName: '',
    autoplay: false,
    selectIndex: 0,
    videoList: [],
    tagVideoList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.loadData()
    baseTool.print(baseTool.systemInfo)
    baseTool.print(baseTool.toRpx(baseTool.systemInfo.windowHeight))
    let height = baseTool.toRpx(baseTool.systemInfo.windowHeight)
    that.setData({
      tableHeight: height - 530
    })
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
      let data = teachAdapter.videoAdapter(res)
      baseTool.print(data)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.showInfo(res)
    })
  },
  lookVideoPlay: function(e) {
    baseTool.print([e, '2'])
    let that = this
    that.setData({
      showPoster: false
    })
    // that.lookVideoContext.play()
  },
  videoPlayClick: function(e) {
    baseTool.print([e, '3'])
    let that = this
    that.setData({
      showPoster: false
    })
    that.lookVideoContext.play()
  },
  videoPause: function(e) {
    let that = this
    baseTool.print([e, '0'])
    that.setData({
      showPoster: true
    })
  },
  videoItemClick: function(e) {
    let that = this
    baseTool.print([e, '1'])
    that.setData({
      videoUrl: e.detail.data.videoUrl,
      showPoster: false,
      autoplay: true,
    })
    that.lookVideoContext.play()
  },
  bindwaiting: function(e) {
    baseTool.print([e, '4'])
    let that = this
    // that.lookVideoContext.play()
  },
  segmentClick: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      selectIndex: index,
      tagVideoList: that.data.videoList[index].tagVideoList
    })
    baseTool.print(e)
  }
})