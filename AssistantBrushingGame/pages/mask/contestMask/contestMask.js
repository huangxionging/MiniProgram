// pages/mask/contestMask/contestMask.js
const baseTool = require('../../../utils/baseTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    imageName: '',
    isResync: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    baseTool.print(options)
    this.setData({
      mask: true,
      imageName: options.imageName,
      isResync: options.isResync
    })
    baseTool.print(this.data)
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
  maskClick: function() {

    var that = this
    // baseTool.print([that.data.isResync, 'dddff'])
    if (that.data.isResync == 'true') {
      // baseTool.print('ddd')
      baseTool.setValueForKeyAsync(true, 'firstContest').then(res => {
        // 切换页面
        wx.switchTab({
          url: '../../contest/contest/contest',
          success: function () {
            // baseTool.print('dddf')
          }
        })
      }).catch(res => {

      })
    } else {
      // baseTool.print('ddd')
      baseTool.setValueForKeyAsync(true, 'firstContestUser').then(res => {
        // 切换页面
        wx.switchTab({
          url: '../../contest/contest/contest',
          success: function () {
            // baseTool.print('dddg')
          }
        })
      }).catch(res => {

      })
    }
    
    
  }
})