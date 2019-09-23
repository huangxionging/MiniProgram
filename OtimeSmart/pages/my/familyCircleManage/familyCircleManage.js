// pages/my/familyCircleManage/familyCircleManage.js
const baseTool = require('../../../utils/baseTool.js')
const myAdapter = require('../../../adapter/myAdapter.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCreate: false,
    familyName: "",
    sectionDataArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.registerCallBack()
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
    let that = this
    that.removeCallBack()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  actionClick: function(e) {
    baseTool.print(e)
  },
  createFamilyClick: function() {
    baseTool.print(1)
    let that = this
    that.setData({
      showCreate: true
    })
    
  },
  cancleClick:function() {
    let that = this
    that.setData({
      showCreate:false,
      familyName: ""
    })
  },
  confirmClick: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("group_new", "新建家庭圈", {
      name: that.data.familyName
    }).then(res => {
      baseTool.print(res)
      that.setData({
        showCreate: false,
        familyName: ""
      })
      that.loadData()
    }).catch(res => {
      baseTool.print(res)
    })
  },
  inputContent: function(e) {
    baseTool.print(e)
    let that = this
    let value = e.detail.value
    that.setData({
      familyName: value
    })
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.loadData()
    }).then(res => {
      baseTool.print(res)
      that.loadData()
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  loadData: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("group_get_list", "获得家庭圈").then(res => {
      baseTool.print(res)
      let list = res.list
      let sectionDataArray = that.data.sectionDataArray
      sectionDataArray.length = 0;
      for (let index = 0; index < list.length; ++index) {
        sectionDataArray.push({
          familyName: list[index].name,
          familyId: list[index].id
        })
      }
      that.setData({
        sectionDataArray: sectionDataArray
      })
    }).catch(res => {
      baseTool.print(res)
    })
  },
  editFamilyClick:function(e) {
    baseTool.print(e)
    let familyId = e.currentTarget.dataset.familyid
    baseTool.print(familyId)
    wx.navigateTo({
      url: '/pages/my/familyCircleDetail/familyCircleDetail?familyId=' + familyId,
    })
  }
})