// pages/brush/brushIndex.js
const baseTool = require('../../../utils/baseTool.js')
const brushManager = require('../../../manager/brushManager.js')
const brushAdapter = require('../../../adapter/brushAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone:false,
    brushDataList: [],
    isTel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let telphone = !brushManager.getTelphone()
    if (telphone) {
      that.setData({
        isTel: true
      })
      that.loadData()
      wx.startPullDownRefresh()
    } else {
      that.setData({
        loadDone: true,
        isTel: false
      })
    }
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
    that.loadData()
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
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    brushManager.getBrushRecord().then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = brushAdapter.brushRecordAdapter(res)
      baseTool.print(data)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  reportTapClick: function (e) {
    baseTool.print(e)
    let recordId = e.detail.data.recordId
    wx.navigateTo({
      url: '../../home/brushReportDetail/brushReportDetail?recordId=' + recordId,
    })
  },
})