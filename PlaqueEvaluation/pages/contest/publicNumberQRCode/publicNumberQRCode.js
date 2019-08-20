// pages/contest/publicNumberQRCode/publicNumberQRCode.js
const baseTool = require('../../../utils/baseTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeURL: 'https://32teeth.oss-cn-beijing.aliyuncs.com/qrcode_for_gh_4569ce0a8cbd_1280%402x.png'
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
    let that = this
    let qrcodeURL = that.data.qrcodeURL
    return {
      path: "pages/contest/publicNumberQRCode/publicNumberQRCode",
      title: "查看公众号二维码",
      imageUrl: qrcodeURL
    }
  },
  previewClick: function() {
    let that = this
    let qrcodeURL = that.data.qrcodeURL
    wx.previewImage({
      current: qrcodeURL,
      urls: [qrcodeURL]
    })
  },
  saveImageClick: function() {
    let that = this
    let qrcodeURL = that.data.qrcodeURL
    baseTool.downloadImageTohotosAlbum(qrcodeURL)
  }
})