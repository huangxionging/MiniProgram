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
    campTitle: '零蛀牙小分队 跟着张立群医生学刷牙',
    campNumber: '114人已参加 | 86人已跟刷',
    campJoinTip: 'P**R已加入训练营',
    campContent: '    带孩子到医院进行口腔治疗及预防的家长都很棒!除了治疗, 这次医院之行也是让孩子了解牙齿重要性和如何爱护牙齿的最佳时机\n\
    训练营通过游戏化的方式, 让宝贝完成一个转变: 从家长督促刷牙到自己主动刷牙. 这个转变意义重大, 父母用最少的时间, 花最少的钱, 为孩子漫长的人生储备一口健康的牙齿.\n\
    这个游戏化的方式需要借助一款智能硬件, 来专门解决孩子不爱刷牙, 不会刷牙的难题.\n\
    带孩子到医院进行口腔治疗及预防的家长都很棒!除了治疗, 这次医院之行也是让孩子了解牙齿重要性和如何爱护牙齿的最佳时机\n\
    训练营通过游戏化的方式, 让宝贝完成一个转变: 从家长督促刷牙到自己主动刷牙. 这个转变意义重大, 父母用最少的时间, 花最少的钱, 为孩子漫长的人生储备一口健康的牙齿.\n\
    这个游戏化的方式需要借助一款智能硬件, 来专门解决孩子不爱刷牙, 不会刷牙的难题来专门解决孩子不爱刷牙'
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
    that.loadData()
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
        isTel: true
      })
      that.loadData()
      wx.startPullDownRefresh()
    })
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
    if (that.data.isTel) {
      that.loadData()
    } else {
      wx.stopPullDownRefresh()
    }
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
    let getDynamicPromise = brushManager.trainingCampHomeForMember().then(res => {
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
      baseTool.print(res)
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
      let itemList = that.data.itemList
      let item = itemList[0]
      itemList.splice(0, 1)
      itemList.push(item)
      that.setData({
        itemList: itemList
      })
    }, 2000, 1000)
  },
  campIntroClick: function(e) {
    let that = this
    that.setData({
      campCollapse: !that.data.campCollapse
    })
  }
})