// pages/moment/momentIndex/momentIndex.js
const baseTool = require('../../../utils/baseTool.js')

const baseWeChat = require("../../../utils/baseWeChat.js")
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.startLocation()
    let token = baseNetLinkTool.getToken() 

    if (token) {
      that.uploadUserLocation()
    }
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
  uploadUserLocation: function() {
    let that = this
    baseTool.clearSingleTimer()
    baseTool.startTimer(res => {
      baseTool.print(res)
      baseWeChat.startLocationFlow().then(res => {
        wx.getLocation({
          type: "gcj02",
          altitude: true,
          success: function (res) {
            baseTool.print(res)
            that.setData({
              longitude: res.longitude,
              latitude: res.latitude
            })
            let location = {
              longitude: res.longitude,
              latitude: res.latitude
            }
            that.uploadLocation(location)
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }).catch(res => {

      })
    }, 10000, 99999999999)
  },
  startLocation: function() {
    let that = this
    baseWeChat.startLocationFlow().then(res => {
      wx.getLocation({
        type: "gcj02",
        altitude: true,
        success: function(res) {
          baseTool.print(res)
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }).catch(res=> {

    })

    wx.onLocationChange(res => {
      baseTool.print(res)
    })
  },
  getCurrentLocationClick: function() {
    let that = this
    wx.getLocation({
      type: "gcj02",
      altitude: true,
      success: function (res) {
        baseTool.print(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  uploadLocation: function(e) {

    let uid = baseNetLinkTool.getUserId()
    baseNetLinkTool.getRemoteDataFromServer("group_location", "上报位置信息", {
      uid: uid,
      location: e
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})