// pages/teach/teachIndex.js
const baseTool = require('../../../utils/baseTool.js')
const teachManager = require('../../../manager/teachManager.js')
const teachAdapter = require('../../../adapter/teachAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: true,
    videoUrl: '',
    showModal: false,
    modalDialog: {
      showModal: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.loadData()
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
    teachManager.getTeachVideoInfo().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = teachAdapter.videoAdapter(res)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  segmentClick: function(e) {
    let that = this
    baseTool.print(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    switch (index) {
      case '1': {
        that.setData({
          isSelect: true
        })
        break
      }
      case '2': {
        baseTool.print(e.currentTarget.dataset.index)
        that.setData({
          isSelect: false,
          showModal: true,
          modalDialog: {
            showModal: true
          }
        })
        break
      }
    }
  }
})