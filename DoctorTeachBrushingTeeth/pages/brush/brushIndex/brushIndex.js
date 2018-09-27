// pages/brush/brushIndex.js
const baseTool = require('../../../utils/baseTool.js')
const brushManager = require('../../../manager/brushManager.js')
const brushAdapter = require('../../../adapter/brushAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone:false,
    brushDataList: [],
    isTel: false,
    doctors: '',
    users: '',
    userName: '',
    day: '',
    signDisabled: 0,
    itemList: [],
    stopTimer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let getJoinTrainingCamp = brushManager.getJoinTrainingCamp()
    
    baseTool.print(getJoinTrainingCamp)
    if (getJoinTrainingCamp == 1) {
      that.setData({
        loadDone: false,
        isTel: true,
        stopTimer: true
      })
      that.loadData()
      wx.startPullDownRefresh()
    } else {
      
      that.setData({
        loadDone: false,
        isTel: false
      })
      that.getPeopleCounting()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", that, res => {
      that.setData({
        loadDone: false,
        isTel: true
      })
      that.loadData()
      wx.startPullDownRefresh()
    })
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
    if (that.data.isTel) {
      that.loadData()
    } else {
      wx.stopPullDownRefresh()
    }
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
    return {
      title: '训练营',
      imageUrl: 'http://qnimage.hydrodent.cn/dtb_love_teeth_share.png'
    }
  },
  getPeopleCounting: function() {
    let that = this
    wx.showNavigationBarLoading()
    brushManager.getPeopleCounting().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = brushAdapter.brushZeroCampAdapter(res)
      that.setData(data)
      that.startRefreshPeopleState()
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    let getDynamicPromise = brushManager.trainingCampHomeForMember().then(res => {
      let data = brushAdapter.userInfoAdapter(res)
      baseTool.print(data)
      that.setData(data)
      return brushManager.getTrainingCampDynamic()
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
      return baseTool.defaultPromise()
    })
    getDynamicPromise.then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      // baseMessageHandler.getMessage("doctorBrushScore", resScore => {
      //   baseTool.print(resScore)
        
      // })
      let brushDataList = brushAdapter.brushDynamicAdapter(res)
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#3ebaff',
      })
      that.setData({
        brushDataList: brushDataList
      })
      
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  reportTapClick: function (e) {
    baseTool.print(e)
    let recordId = e.detail.data.recordId
    wx.navigateTo({
      url: '/pages/home/brushReportDetail/brushReportDetail?recordId=' + recordId,
    })
  },
  confirmClick: function(e) {
    wx.navigateTo({
      url: '/pages/brush/applyZeroTeeth/applyZeroTeeth?from',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  signClick: function(e){
    wx.navigateTo({
      url: '/pages/brush/followBrush/followBrush',
    })
  },
  selectDeviceClick: function(e) {
    wx.navigateTo({
      url: '/pages/home/deviceBanner/deviceBanner',
    })
  },
  startRefreshPeopleState: function() {
    let that = this
    baseTool.startTimer(function(total) {
      if (that.data.stopTimer) {
        return true
      }
      let itemList = that.data.itemList
      let item = itemList[0]
      itemList.splice(0, 1)
      itemList.push(item)
      that.setData({
        itemList: itemList
      })
    }, 2000, 1000)
  }
})