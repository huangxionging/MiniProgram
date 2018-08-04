// pages/home/homeIndex.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const doctorInfoManager = require("../../../manager/doctorInfoManager.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    options.doctorId = "004867f5369ddee301c348cb18885fbd"
    if (options.doctorId) {
      baseTool.setValueForKey(options.doctorId, "doctorId")
    }
    that.getDoctorInfo();
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
  onDoctorInfoClick: function(e) {
    baseTool.print(e)
  },
  getDoctorInfo: function() {
    baseTool.print("ddd")
    let that = this
    doctorInfoManager.getDoctorInfo().then(res => {
      that.setData({
        loadDone: true
      })
    }).catch(res => {

    })
  }
})