// pages/my/familyCircleManage/familyCircleManage.js
const baseTool = require('../../../utils/baseTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sectionDataArray: [{
      familyName: "家庭圈 1",
      manager: {
        name: "我 123123",
        id: "123"
      },
      headerHeight: 272,
      rowDataArray: [{
        name: "爸爸",
        id: ""
      }, {
        name: "妈妈",
        id: ""
      }, {
        name: "小侄子",
        id: ""
      }, {
        name: "奶奶",
        id: ""
      }]
    }, {
      familyName: "家庭圈 2",
      manager: {
        name: "爸爸",
        id: "123"
      },
      headerHeight: 272,
      rowDataArray: [{
        name: "爸爸",
        id: ""
      }, {
        name: "妈妈",
        id: ""
      }]
      }, {
        familyName: "家庭圈 2",
        manager: {
          name: "爸爸",
          id: "123"
        },
        headerHeight: 272,
        rowDataArray: [{
          name: "爸爸",
          id: ""
        }, {
          name: "妈妈",
          id: ""
        }]
      }]
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
  }
})