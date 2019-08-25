// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
// const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../utils/baseDeviceSynTool.js')
const baseURL = require('../../utils/baseURL.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
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
    wx.startPullDownRefresh()
    let that = this
    that.registerCallBack()
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
    baseDeviceSynTool.clearDeviceSyn()
  },
  onPageScroll: function(e) {
    
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
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.getHomePage()
    }).then(res => {
      that.getHomePage()
    })

    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {

      if (res.code < 2000) {
        baseTool.print(res.text)
        let codeArray = [1000, 1004]
        let index = codeArray.indexOf(res.code)
        if (index == -1) {
          return
        }
        // baseURL.baseState == false
        let currentDeviceObject = that.data.currentDeviceObject
        currentDeviceObject.stateText = res.text
        that.setData({
          currentDeviceObject: currentDeviceObject
        })
        if (res.code == 1000) {
          baseDeviceSynTool.clearDeviceSyn()
          let timer = setTimeout(function () {
            // 如果 5s 没搜索到, 则超时
            clearTimeout(timer)
            that.temporaryData.synDeviceIndex++
            that.synDeviceObject()
          }, 1000)
        }
      } else {
        baseTool.showToast(res.text)
        let currentDeviceObject = that.data.currentDeviceObject
        currentDeviceObject.stateText = res.text
        that.setData({
          currentDeviceObject: currentDeviceObject
        })
        baseDeviceSynTool.clearDeviceSyn()
        let timer = setTimeout(function () {
          // 如果 5s 没搜索到, 则超时
          clearTimeout(timer)
          that.temporaryData.synDeviceIndex++
          that.synDeviceObject()
        }, 1000)
      }
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },
  getHomePage: function(){
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("getHomePage", "获取首页数据").then(res => {
    }).catch(res => {

    })
  }
})