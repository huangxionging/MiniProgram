// pages/my/brushContestShare/brushContestShare.js
const app = getApp()
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clinicUrl: "",
    clinicName: "",
    contestName: "",
    qrcodeUrl: "",
    gameId: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      gameId: options.gameId
    })

    that.getGameQrcode()
  },
  getGameQrcode: function() {
    var that = this
    myManager.getGameQrcode(that.data.gameId).then(res => {
      baseTool.print([res, "返回信息"])
      that.setData({
        clinicUrl: res.clinicPic,
        clinicName: res.clinicName,
        contestName: res.name,
        qrcodeUrl: res.qrcodeUrl,
      })
    }).catch(res => {
      baseTool.print(res)
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

  previewClick: function() {
    var that = this
    wx.previewImage({
      current: that.data.qrcodeUrl,
      urls: [that.data.qrcodeUrl],
    })
  },
  phoneCallClick: function() {
    wx.makePhoneCall({
      phoneNumber: '4009003032',
    })
  }
})