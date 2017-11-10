// pages/contest/addContestUser/addContestUser.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const contestManager = require('../../../manager/contestManager.js')

var select = true
var contestUserName = ''
var item = {
  isNext: false, 
  selects: [
    {
      selectButton: 'userInfo-brush-select-item',
      title: '标准巴氏刷牙法 (6岁以上)',
      id: 1,
      select: true
    },
    {
      selectButton: 'userInfo-brush-select-item',
      title: '圆弧刷牙法 (6岁以下)',
      id: 2,
      select: false
    }
  ]
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    item: item
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
  selectClick: function(e) {
    var that = this
    // baseTool.print(e)
    select = 2 - e.target.id
    baseTool.print(select)
    baseTool.print(item)
    item.selects[0].select = select
    item.selects[1].select = !select
    baseTool.print(item)
    // 终于渲染成功了
    that.setData({
      item: item
    })
  },
  userInfoSave: function() {
    var that = this
    baseTool.print(contestUserName)
    if (contestUserName == '') {
      wx.showModal({
        title: '提示',
        content: '未输入参赛者名字',
        showCancel: false,
        confirmText: '确定',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }

    item.isNext = true
    // 终于渲染成功了
    that.setData({
      item: item
    })

    var brushMethod = 'a002c7680a5f4f8ea0b1b47fa3f2b947'
    if(!select) {
      brushMethod = '6827c45622b141ef869c955e0c51f9f8'
    }

    contestManager.addContestUser(contestUserName, brushMethod).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  },
  getInputUserName: function (e){
    baseTool.print(e)
    contestUserName = e.detail.value
  }
})