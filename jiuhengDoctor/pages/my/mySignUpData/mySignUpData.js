// pages/my/mySignUpData/mySignUpData.js
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const myAdapter = require('../../../adapter/myAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    signUpDataArray: [],
    signUpSectionDataArray: [],
    signType: 0,
    pageNo: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options) {
      if (options.row) {
        that.setData({
          signType: options.row
        })
        wx.setNavigationBarTitle({
          title: (options.row == 0 ? '挑战赛' : '训练营') + '报名数据',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.setSignUpMenu()
    that.loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    that.data.pageNo = 1
    that.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    that.data.pageNo++
    that.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  setSignUpMenu: function() {
    let that = this
    that.setData({
      signUpDataArray: myAdapter.mySignUpDataSectionDataArray(that.data.signType)
    })
  },
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("applyUserList", "报名数据", {
      pageNo: that.data.pageNo,
      type: that.data.signType
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let signUpSectionDataArray = myAdapter.signUpSectionDataArray(res)
      that.setData({
        signUpSectionDataArray: signUpSectionDataArray
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})