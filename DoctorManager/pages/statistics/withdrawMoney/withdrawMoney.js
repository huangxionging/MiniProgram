// pages/statistics/withdrawMoney/withdrawMoney.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const statisticsManager = require("../../../manager/statisticsManager.js")
const statisticsAdapter = require('../../../adapter/statisticsAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    segmentIndex: 1,
    totalMoney: 6201.51,
    remaingMoney: 6201.51,
    money: ''
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
  segmentClick: function(e) {
    let that = this
    that.setData({
      segmentIndex: e.currentTarget.dataset.index
    })
  },
  deleteClick: function(e) {
    let that = this
    that.setData({
      money: ''
    })
  },
  getInputContent: function(e) {
    baseTool.print(e)
    let that = this
    let value = e.detail.value

    // let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)|(^$)/
    // 先考虑没有小数的情况, 然后考虑有小数的情况
    let reg = /(^[1-9][0-9]*|[0-9]\.[0-9]?[0-9]?$)|(^$)/
    if(reg.test(value)) {
      that.setData({
        money: value
      })
    } else {
        return that.data.money
    }
    
  }
})