// pages/home/editDoctorInfo/editDoctorInfo.js
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
    experience: '',
    goodat: '',
    submitDisabled: false,
    fileName: ''
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
      that.showSubmit()
      wx.hideNavigationBarLoading()
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
  onShareAppMessage: function () {

  },
  getNameContent: function (e) {
    let that = this
    that.setData({
      name: e.detail
    })
    that.showSubmit()
  },
  getHospitalContent: function (e) {
    let that = this
    that.setData({
      hospital: e.detail
    })
    that.showSubmit()
  },
  getDepartmentContent: function (e) {
    let that = this
    that.setData({
      department: e.detail
    })
    that.showSubmit()
  },
  getJobContent: function (e) {
    let that = this
    that.setData({
      jobTitle: e.detail
    })
    that.showSubmit()
  },
  showSubmit: function () {
    let that = this
    let submitDisabled = !doctorInfoManager.doctorInfoComplete(that.data)
    baseTool.print(submitDisabled)
    that.setData({
      submitDisabled: submitDisabled
    })
  },
  confirmClick: function (e) {
    let that = this
    let doctorInfo = doctorInfoAdapter.encodeDoctorInfoAdapter(that.data)
    wx.showLoading({
      title: '处理中...',
      mask: true,
    })
    doctorInfoManager.updateDoctorInfo(doctorInfo).then(res => {
      wx.hideLoading()
      
      wx.showToast({
        title: '提交成功',
        icon: 'loading',
        duration: 2000,
        mask: true,
        success: function() {
          if (that.data.orinal == 'home') {
            wx.navigateBack()
            baseMessageHandler.sendMessage('refresh', that)
          } else {
            loginManager.reLauch()
          }
        }
      })
    }).catch(res => {
      wx.hideLoading()
      baseTool.showInfo(res)
    })
  },
  imageClick: function (e) {
    baseTool.print(e)
    let that = this
    let items = e.currentTarget.dataset.items

    doctorInfoManager.chooseDoctorAvatar(items, that.data.avatar).then(res => {
      baseTool.print(['打印结果:', res])
      if (res) {
        that.setData({
          avatar: res
        })
        that.showSubmit()
      }
    }).catch(res => {
      baseTool.showInfo(res)
    })
  },
  experienceConfirm: function(e){
    baseTool.print(['打印结束结果:', e])
    let that = this
    that.setData({
      experience: e.detail.value
    })
    that.showSubmit()
  },
  experienceInput: function (e) {
    baseTool.print(['打印输入结果:', e])
    let that = this
    that.setData({
      experience: e.detail.value
    })
    that.showSubmit()
  },
  goodatConfirm: function (e) {
    baseTool.print(['打印结束结果:', e])
    let that = this
    that.setData({
      goodat: e.detail.value
    })
    that.showSubmit()
  },
  goodatInput: function (e) {
    baseTool.print(['打印输入结果:', e])
    let that = this
    that.setData({
      goodat: e.detail.value
    })
    that.showSubmit()
  }
})