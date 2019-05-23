// pages/homeIndex/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: {},
    open: false,
    isLiked: false
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
    that.getHomePage()
    // that.visitorClinic()
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
    that.setData({
      loadDone: false
    })
    that.getHomePage()
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
  getHomePage: function () {
    let that = this
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("homePage", "获取首页比赛信息").then(res => {
      // 无比赛
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      that.setData({
        loadDone: true,
        res: res,
      })
     
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  imageClick: function(e) {
    let that = this
    baseTool.print(e)
    if (!e.currentTarget.dataset.link) {
      return;
    }
    baseMessageHandler.postMessage("showBlogArticle", res => {
      res(e.currentTarget.dataset.link)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/dental/blog/blog',
      })
    }).catch(res => {
      baseTool.print(res)
    })
  },
  fullClick: function() {
    let that = this
    that.setData({
      open: !that.data.open
    })
  },
  phoneClick: function() {
    let that = this
    wx.makePhoneCall({
      phoneNumber: that.data.res.phone,
    })
  },
  visitorClinic: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("visitorClinic", "访客接口").then(res => {
      baseTool.print(res)
      let dataRes = that.data.res
      dataRes.visitorCount++
      that.setData({
        res: dataRes
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  likeClick: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("likeClinic", "点赞").then(res => {
      baseTool.print(res)
      let dataRes = that.data.res
      dataRes.likeCount++
      that.setData({
        res: dataRes,
        liked: true
      })
      baseTool.setValueForKey(true, 'isLike')
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  expertListClick: function(e) {
    let that = this
    baseTool.print(e)
    if (!e.detail.link) {
      return;
    }
    baseMessageHandler.postMessage("showBlogArticle", res => {
      res(e.detail.link)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/dental/blog/blog',
      })
    }).catch(res => {
      baseTool.print(res)
    })
  }
})