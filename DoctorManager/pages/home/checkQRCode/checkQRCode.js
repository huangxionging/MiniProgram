// pages/home/checkQRCode/checkQRCode.js
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

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
  readDoctorListClick: function(e) {
    wx.scanCode({
      scanType: ['qrcode'],
      success: function(res) {

        let parameter = baseTool.getParameterFromURL(res.result)
        baseTool.print(parameter)

        if (baseTool.isExist(parameter.doctorId)) {
          wx.navigateTo({
            url: '/pages/home/doctorIDList/doctorIDList?doctorId=' + parameter.doctorId,
          })
        } else {
          baseTool.showInfo(res.result)
        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  previewDoctorListClick: function(e) {
    wx.scanCode({
      scanType: ['qrcode'],
      success: function(res) {

        let parameter = baseTool.getParameterFromURL(res.result)
        baseTool.print(parameter)

        if (baseTool.isExist(parameter.doctorId)) {
          baseTool.print(parameter.doctorId)
          doctorInfoManager.getDoctorPosterQRCodeURL(parameter.doctorId).then(res => {
            baseTool.print(res)
            baseTool.previewSingleImage(res)
          }).catch(res => {
            baseTool.print(res)
          })
        } else {
          baseTool.showInfo(res.result)
        }

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})