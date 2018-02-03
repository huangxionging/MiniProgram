// pages/video/video.js
/**
 * 计算随机颜色
 */
function getRandomColor() {
  let rgbValue = ''
  for (let i = 0; i < 3; ++i) {
    // 增加颜色值
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgbValue += color
  }
  return '#' + rgbValue
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    posterImageUrl: '',
    src: '',
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }],
    inputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      // 设置视频地址, 或者网络请求
      src: options.src,
      // 视频封面的图片网络资源地址
      posterImageUrl: options.posterImageUrl,
      // 加载完成
      loadDone: true
    })
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
  videoPlay: function(e) {
    console.log(e)
  },
  videoUpdate: function(e) {
    // console.log(e)
  },
  videoPause: function(e) {
    console.log(e)
  },
  sendDanmuClick: function(e) {
    var that = this
    var ctx = wx.createVideoContext('video-player', that)
    ctx.sendDanmu({
      text: that.inputValue,
      color: getRandomColor()
    })
  },
  inputClick: function(e) {
    console.log(e.detail.value)
    this.inputValue = e.detail.value
  },
  playClick: function(){
    var that = this
    var ctx = wx.createVideoContext('video-player', that)
    ctx.play()
  },
  pauseClick: function() {
    var that = this
    var ctx = wx.createVideoContext('video-player', that)
    ctx.pause()
  },
  seekClick: function() {

  },
  fullScreenClick: function() {
    var that = this
    var ctx = wx.createVideoContext('video-player', that)
    ctx.requestFullScreen()
  }
})