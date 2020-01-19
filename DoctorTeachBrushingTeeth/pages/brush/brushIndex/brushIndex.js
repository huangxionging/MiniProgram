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
    loadDone: false,
    brushDataList: [],
    signDisabled: 0,
    campCollapse: true,
    campTitle: '',
    campNumber: '114人已参加 | 86人已跟刷',
    campJoinTip: '',
    memberList: [],
    currentIndex: 0,
    bannerList: [],
    startRefreshPeopleState: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      loadDone: false,
      isTel: true,
    })
    wx.startPullDownRefresh()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", that, res => {
      that.setData({
        loadDone: false,
      })
      that.loadData()
    })
    wx.startPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    if (that.data.stopTimer == true) {
      that.data.stopTimer = false
      if (that.data.startRefreshPeopleState == false) {
        that.data.startRefreshPeopleState = true
        that.startRefreshPeopleState()
        that.animation()
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this
    that.data.stopTimer = true
    that.data.startRefreshPeopleState = false
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
    that.loadData()
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
    return {
      title: '训练营',
      imageUrl: 'http://qnimage.hydrodent.cn/dtb_love_teeth_share.png'
    }
  },
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    let getDoctorTrainingCampHomePromise = brushManager.joinDoctorTrainingCamp().then(res => {
      return brushManager.getDoctorTrainingCampHome()
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
      return baseTool.defaultPromise()
    })
    let getDynamicPromise = getDoctorTrainingCampHomePromise.then(res => {
      let data = brushAdapter.userInfoAdapter(res)
      data.avatar = baseTool.valueForKey('doctorInfo').doctorHeadimgurl
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
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      // baseMessageHandler.getMessage("doctorBrushScore", resScore => {
      //   baseTool.print(resScore)
      // })
      let brushDataList = brushAdapter.brushDynamicAdapter(res)
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#20afff',
      })
      
      that.setData({
        brushDataList: brushDataList
      })

      if (that.data.startRefreshPeopleState == false) {
        that.data.startRefreshPeopleState = true
        that.startRefreshPeopleState()
        that.animation()
      }
      

    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  reportTapClick: function(e) {
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
  signClick: function(e) {
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
      let campJoinTip = ''
      if (that.data.currentIndex < that.data.memberList.length) {
        campJoinTip = that.data.memberList[that.data.currentIndex++]
      } else {
        that.data.currentIndex = 0
        campJoinTip = that.data.memberList[that.data.currentIndex++]
      }
      baseTool.print(campJoinTip)
      that.setData({
        campJoinTip: campJoinTip
      })
    }, 3000, 100000000)
  },
  campIntroClick: function(e) {
    let that = this
    that.setData({
      campCollapse: !that.data.campCollapse
    })
  },
  showDoctoInfoClick: function(e) {
    wx.navigateTo({
      url: '/pages/home/doctorInfoDetail/doctorInfoDetail',
    })
  },
  animation: function () {
    let that = this
    baseTool.startTimer(function (total) {
      baseTool.print([total, that.animation])
      if (that.data.stopTimer) {
        return true
      }
      var animation = wx.createAnimation({
        duration: 2000,
        timingFunction: "linear",
        delay: 0,
        transformOrigin: "50% 50% 0",
      })

      if (total % 2 == 0) {
        animation.translateY(0).step()
      } else {
        animation.translateY(baseTool.toPixel(134)).step()
      }

      that.setData({
        animationData: animation.export()
      })

    }, 2000, 6000000000)
  }
})