// pages/brush/buyDevice/buyDevice.js
const baseTool = require('../../../utils/baseTool.js')
const brushManager = require('../../../manager/brushManager.js')
const brushAdapter = require('../../../adapter/brushAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    containerHeight: 0,
    buyDeviceList: [
      {
        imageUrl: 'http://qnimage.hydrodent.cn/dtb_device_huyazhe.png'
      },
      {
        imageUrl: 'http://qnimage.hydrodent.cn/dtb_device_love_rabbit.png'
      },
      {
        imageUrl: 'http://qnimage.hydrodent.cn/dtb_device_contest.png'
      },
      {
        imageUrl: 'http://qnimage.hydrodent.cn/dtb_device_brush_tail.png'
      }
    ]
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
  imageLoadDone: function(e) {
    this.setData({
      containerHeight: e.detail.height,
    }) 
  },
  buyWelfareClick: function(e) {
    wx.navigateTo({
      url: '/pages/brush/buyWelfare/buyWelfare'
    })
  },
  buyYouZanClick: function(e) {

  },
  itemClick: function(e) {
    baseTool.print(e)
    let index =  parseInt(e.currentTarget.id)
    baseTool.showInfo('您点击了第' + (index + 1) + '个装备')
    switch(index) {
      case 0: {
        
      }
    }
  }
})