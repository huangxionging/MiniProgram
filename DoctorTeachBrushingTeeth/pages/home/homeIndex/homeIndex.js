// pages/home/homeIndex.js
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
    doctorActivityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // baseTool.print(["带过来的参数",options.q])
    if (options.q) {
      let url = decodeURIComponent(options.q)
     
      let parameter = baseTool.getParameterFromURL(url)
      baseTool.print(["带过来的参数", parameter])
      if (parameter.doctorId) {
        baseTool.setValueForKey(parameter.doctorId, "doctorId")
      } else {
        baseTool.setValueForKey('', "doctorId")
      }
    } else {
      if (options.doctorId) {
        baseTool.setValueForKey(options.doctorId, "doctorId")
      } else  {
        let doctorId = baseTool.valueForKey('doctorId')
        if (!doctorId) {
          baseTool.setValueForKey('', "doctorId")
        }
      }
    }
    that.getDoctorInfo()
    wx.startPullDownRefresh()
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
    let that = this
    that.getDoctorInfo()
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
    return {
      
    }
  },
  onDoctorInfoClick: function(e) {
    wx.navigateTo({
      url: '../doctorInfoDetail/doctorInfoDetail',
    })
  },
  getDoctorInfo: function() {
    let that = this
    wx.showNavigationBarLoading()
    doctorInfoManager.getDoctorInfo().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      // 从适配器获得数据
      let data = doctorInfoAdapter.homePageAdapter(res)
      data.persons = 83
      data.doctorActivityList = doctorInfoAdapter.doctorActivityListAdapter(data)
      
      that.setData(data)
  
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  activityDelegate: function(e) {
    baseTool.print(e)
    let info = e.detail
    switch (info.index) {
      case '0': {
        wx.switchTab({
          url: '/pages/brush/brushIndex/brushIndex',
        })
        break
      }
      case '1': {
        wx.navigateTo({
          url: '../brushReportDetail/brushReportDetail?recordId=' + e.detail.data.recordId,
        })
        break
      }
    }
  }
})