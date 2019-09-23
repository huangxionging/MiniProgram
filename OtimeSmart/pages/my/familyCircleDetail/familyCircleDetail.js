// pages/my/familyCircleDetail/familyCircleDetail.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    baseTool.print(options)
    if(options.familyId) {
      that.data.familyId = options.familyId
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.loadData()
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
  loadData:function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("group_get_member", "新建家庭圈", {
      id: that.data.familyId
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  }
})