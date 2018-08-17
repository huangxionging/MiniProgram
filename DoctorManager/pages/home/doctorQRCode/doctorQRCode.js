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
      imgData: doctorInfoManager.getDoctorQRCodeURL()
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
  saveImageClick: function(e) {
    let that = this
    wx.showLoading({
      title: '正在保存...',
      mask: true,
    })
    wx.getImageInfo({
      src: that.data.imgData,
      success: function(res) {
        wx.hideLoading()
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: function(res) {
            wx.hideLoading()
            wx.showToast({
              title: '已保存相册',
              icon: 'success',
              duration: 2000,
              mask: true,
            })
          },
          fail: function(res) {
            wx.hideLoading()
            wx.showToast({
              title: '保存失败',
              icon: 'none',
              duration: 2000,
              mask: true,
            })
          }
        })
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  }
})