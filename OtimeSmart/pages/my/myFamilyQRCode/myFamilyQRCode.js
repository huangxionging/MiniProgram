// pages/my/myFamilyQRCode/myFamilyQRCode.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const qrcodeTool = require('../../../utils/qrcode.js')
const md5Tool = require('../../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    let userInfo = baseNetLinkTool.getUserInfo()
    that.setData({
      userInfo: userInfo
    })
    let canvasId = "my-family-qrcode"
    let token = baseNetLinkTool.getToken()
    let qrcodeConetnt = "code1=" + token + "&code2=" + "1" //baseNetLinkTool.getUserId()
    let value = md5Tool(qrcodeConetnt)
    let qrcodeUrl = qrcodeConetnt + "&code3=" + value
    qrcodeUrl += "&code4=" + md5Tool(qrcodeUrl)
    qrcodeTool.api.draw(qrcodeUrl, canvasId, 300, 300, that)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

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
  previewClick: function() {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'my-family-qrcode',
      success: function(res) {
        baseTool.previewSingleImage(res.tempFilePath)
      }
    })
  },
  saveQRCodeClick: function() {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'my-family-qrcode',
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
              mask: true,
            })
          },
        })
      }
    })
  }
})