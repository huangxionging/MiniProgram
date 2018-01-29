// pages/customerManger/createClass/createClass.js
const app = getApp()
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const teamManager = require('../../../manager/teamManager.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clinicName: '',
    teamName: '',
    teamTime: 14,
    teamId: '',
    isCreate: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)
    if (options.isCreate != undefined && options.isCreate == '1') {
      that.setData({
        isCreate: false,
        teamName: options.teamName,
        teamId: options.classId
      })
      wx.setNavigationBarTitle({
        title: '修改班级',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    var clinicName = baseTool.valueForKey('clinicName')
    baseTool.print(clinicName)
    that.setData({
      clinicName: clinicName
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
  // onShareAppMessage: function () {
  
  // },
  inputEnd: function(e){
    var that = this
    baseTool.print(e)
    var teamName = e.detail.value
    // 无需更改界面, 所以不用 setData
    var name = e.detail.value
    baseTool.print(name)
    var isTrue = name.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    if (isTrue == null && name != '' && name != undefined) {
      wx.showModal({
        title: '提示',
        content: '班级名称暂不支持表情哦~',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
          that.setData({
            teamName: that.data.teamName
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      return
    }
    that.data.teamName = teamName
  },
  generateTeam: function(e) {
    var that = this
    var teamName = that.data.teamName
    var teamTime = that.data.teamTime
    if (teamName == '') {
      wx.showModal({
        title: '提示',
        content: '班级名称不能为空哦',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    wx.showLoading({
      title: '正在生成',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    teamManager.addClass(teamName, teamTime).then(res => {
      baseTool.print(res)
      baseMessageHandler.sendMessage('classListRefresh', {
        code: true,
        msg: '添加成功需要刷新'
      }).then(res => {

      })
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
      })
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  },
  selectTimeClick: function(e) {
    var that = this
    wx.showActionSheet({
      itemList: ['7天', '14天', '21天'],
      itemColor: '#000',
      success: function(res) {
        var item = (res.tapIndex + 1) * 7
        that.setData({
          teamTime: item
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  saveTeam: function() {
    var that = this
    var teamName = that.data.teamName
    var classId = that.data.teamId
    if (teamName == '') {
      wx.showModal({
        title: '提示',
        content: '班级名称不能为空哦',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      return
    }
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在保存',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    teamManager.updateClassTitle(teamName, classId).then(res => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      
      baseMessageHandler.sendMessage('classListRefresh', {
        code: true,
        msg: '添加成功需要刷新'
      }).then(res => {
        wx.navigateBack({
          delta: 1,
        })
      })
    }).catch(res => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  }
})