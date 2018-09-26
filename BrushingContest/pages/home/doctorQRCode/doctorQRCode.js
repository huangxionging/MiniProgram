// pages/home/doctorQRCode/doctorQRCode.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const doctorInfoManager = require("../../../manager/doctorInfoManager.js")
const doctorInfoAdapter = require('../../../adapter/doctorInfoAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    avatar: '',
    doctorName: '',
    department: '',
    jobTitle: '',
    hospital: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    wx.showNavigationBarLoading()
    baseMessageHandler.getMessage('doctorInfo', res => {
      baseTool.print(['doctorInfo', res])


      that.setData(res)
      wx.hideNavigationBarLoading()
    })
    that.setData({
      imgData: doctorInfoManager.getDoctorQRCodeURL(loginManager.getMemberId())
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
    baseMessageHandler.removeMessage("doctorInfo")
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
  saveImageClick: function(e) {
    let that = this
    
    doctorInfoManager.getDoctorPosterQRCodeURL(loginManager.getMemberId()).then(res => {
      baseTool.print(res)
      baseTool.downloadImageTohotosAlbum(res)
    }).catch(res => {
      baseTool.print(res)
    })
    
  },
  checkQRCodeClick: function (e) {
    wx.navigateTo({
      url: '/pages/home/checkQRCode/checkQRCode',
    })
   
  },
  previewQRCodeClick: function(e) {
    let that = this
    baseTool.previewSingleImage(that.data.imgData)
  }
})