// pages/showScreen/signUp/signUp
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.linkUrl) {
      // 需要两次解码
      let linkUrl = decodeURIComponent(options.linkUrl)
      that.setData({
        linkUrl: baseTool.urlToHttps(decodeURIComponent(linkUrl))
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.registerCallBack()
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
    let that = this
    that.removeCallBack()
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
    // 需要两次编码
    let linkUrl = that.data.linkUrl
    let url = encodeURIComponent(linkUrl)
    return {
      path: "pages/showScreen/signUp/signUp?linkUrl=" + encodeURIComponent(url),
      title: "菌斑评测报告",
    }
  },
  registerCallBack: function () {
    let that = this
    
    baseMessageHandler.getMessage("previewReport", res => {
      baseTool.print(res)
      let linkUrl = res.url + "name=" + res.name + "&clicin=" + baseNetLinkTool.getClinicName() + '&recordId=' + res.recordId
      baseTool.print(linkUrl)
      
      that.setData({
        linkUrl: baseTool.urlToHttps(linkUrl)
      })
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeMessage("previewReport")
  }
})