// pages/home/homeIndex/homeIndex.js
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
    goodat: '',
    experience: '',
    bindDisabled: true,
    orinal: 'home',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    baseTool.print(["带过来的参数", options.q])
    if (options.q) {
      let url = decodeURIComponent(options.q)
      let parameter = baseTool.getParameterFromURL(url)
      baseTool.print(["带过来的参数", parameter])
      if (parameter.doctorId) {
        baseTool.setValueForKey(parameter.doctorId, "doctorId")
      }
    } else {
      if (options.doctorId) {
        baseTool.setValueForKey(options.doctorId, "doctorId")
      } else {
        baseTool.removeObjectForKey("doctorId")
        
      }
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.getDoctorInfo()
    baseMessageHandler.addMessageHandler('refresh', that, res => {
      let that = this
      that.getDoctorInfo()
    })
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
  getDoctorInfo: function() {
    let that = this
    wx.showLoading({
      title: '请求中...',
      mask: true
    })
    wx.showNavigationBarLoading()
    doctorInfoManager.getDoctorInfo(loginManager.getMemberId()).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      let data = doctorInfoAdapter.getDoctorInfoAdapter(res)
      that.setData(data)
    }).catch(res => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      baseTool.showInfo(res)
    })
  },
  editDoctorInfoClick: function(e) {
    let that = this
    baseMessageHandler.postMessage('doctorInfo', callBack => {
      callBack(that.data)
    })
    wx.navigateTo({
      url: '../editDoctorInfo/editDoctorInfo',
    })
  },
  qrcodeDoctorInfoClick: function(e) {
    let that = this
    baseMessageHandler.postMessage('doctorInfo', callBack => {
      callBack(that.data)
    })
    wx.navigateTo({
      url: '../doctorQRCode/doctorQRCode',
    })
  }
})