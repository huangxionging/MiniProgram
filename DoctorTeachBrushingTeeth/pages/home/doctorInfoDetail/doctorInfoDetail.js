// pages/home/doctorInfoDetail/doctorInfoDetail.js
const baseTool = require('../../../utils/baseTool.js')
const doctorInfoAdapter = require('../../../adapter/doctorInfoAdapter.js')
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
    experience: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getDoctorInfoDetail()
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
  getDoctorInfoDetail: function() {
    let that = this
    let doctorInfo = baseTool.valueForKey('doctorInfo')
    let data = doctorInfoAdapter.doctorInfoDetailAdapter(doctorInfo)
    that.setData(data)
  }
})