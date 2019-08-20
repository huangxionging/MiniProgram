// pages/patientManage/patientManage/patientManage.js
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    sectionDataArray: [
      {
        rowDataArray: []
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
    let that = this
    that.data.pageNo = 1
    that.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    that.data.pageNo++
    that.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadData: function() {
    let that = this
    let pageNo = that.data.pageNo

    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("playerList", "获得医生列表", {
      clinicId: baseNetLinkTool.getClinicId(),
      pageNo: pageNo
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let sectionDataArray = that.data.sectionDataArray
      let rowDataArray = that.data.sectionDataArray[0].rowDataArray
      if (res) {
        if (that.data.pageNo == 1) {
          rowDataArray.length = 0
        }
        for (let rowIndex = 0; rowIndex < res.length; ++rowIndex) {
          let rowObject = res[rowIndex]
          let patientObject = {
            id: rowObject.playerId ? rowObject.playerId.substr(rowObject.playerId.length - 6, 6) : "",
            name: rowObject.name ? rowObject.name : "",
            isBindDevice: rowObject.bindingMacAddress ? "有" : "无"
          }
          rowDataArray.push(patientObject)
        }
        that.setData({
          sectionDataArray: sectionDataArray
        })
      }
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    }) 
  }
})