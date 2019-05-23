// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    hasData: false,
    gameName: '',
    gameId: '',
    showIntroPage: false,
    videoURL: 'http://qnimage.hydrodent.cn/match1.mp4'
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
    wx.startPullDownRefresh()
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
    that.getHomePage()
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
  getHomePage: function() {
    let that = this
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("homePage", "获取首页比赛信息").then(res => {
      // 无比赛
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let hasData = false
      let windowHeight = 0
      let contentHeight = 0
      let gameId = ''
      let gameName = ''
      // 设计稿上需要 1038rpx 的内容高度, 转成像素点
      windowHeight = baseTool.toPixel(1038)
      // 实际除去导航栏和底部 tabBar 的高度
      contentHeight = wx.getSystemInfoSync().windowHeight
      // 如果 内容区高度比设计需要的大
      if (contentHeight > windowHeight) {
        windowHeight = contentHeight;
      }
      if (res == undefined) {
        wx.setNavigationBarTitle({
          title: "刷牙挑战",
        })
      } else {
        hasData = true
        gameId = res.gameId
        gameName = res.name
        
        wx.setNavigationBarTitle({
          title: gameName ? gameName : "刷牙挑战"
        })
        that.data.createTime = res.createTime
      }
      that.setData({
        loadDone: true,
        hasData: hasData,
        height: windowHeight,
      })
      that.data.gameId = gameId
      that.data.gameName = gameName
      
      that.showIntroPage()
      setTimeout(() => {
        that.setData({
          showShare: true
        })
      }, 1000)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  startClick: function(e) {
    let that = this
    wx.navigateTo({
      url: '/pages/contest/startContest/startContest?gameId=' + that.data.gameId + '&gameName=' + that.data.gameName
    })
  },
  endClick: function(e) {
    let that = this
    baseTool.showAlertInfoWithCallBack({
      title: "结束比赛将直接关闭比赛",
      content: "请确认是否关闭本次比赛",
      showCancel: true,
      cancelText: "确定",
      confirmText: "我再想想"
    }, (res) => {
      if (res.type == 0) {
        baseNetLinkTool.getRemoteDataFromServer("finishedGame", "结束比赛", {
          gameId: that.data.gameId
        }).then(res => {
          baseTool.print(res)
          wx.startPullDownRefresh()
        }).catch(res => {
          baseNetLinkTool.showNetWorkingError(res)
        })
      }
    })

  },
  shareClick: function(e) {
    let that = this
    wx.navigateTo({
      url: '/pages/showScreen/showContest/showContest?gameId=' + that.data.gameId + '&applyTime=' + that.data.createTime
    })
  },
  createContest: function() {
    // 完善诊所信息
    loginManager.completeClinicInfo("创建比赛").then(res => {

      let isHaveDevice = baseNetLinkTool.getIsHaveDevice()
      baseTool.print(isHaveDevice)
      if (isHaveDevice == '') {
        baseTool.showAlertInfoWithCallBack({
          title: '暂无智能设备哦~',
          content: '请进入添加设备页面',
          showCancel: true,
          cancelText: '暂时没空',
          confirmText: '添加设备',
        }, res => {
          baseTool.print(res)
          if (res.type) {
            wx.navigateTo({
              url: '/pages/my/deviceManage/deviceManage',
            })
          }
        })
        return
      }
      baseNetLinkTool.getRemoteDataFromServer("addGame", "创建比赛", {
        clinicId: baseNetLinkTool.getClinicId()
      }).then(res => {
        wx.startPullDownRefresh()
        baseTool.showAlertInfoWithCallBack({
          title: "比赛创建成功",
          content: "请按右上角“分享比赛”- 将分享页投至屏幕，参赛者即可扫码报名",
          confirmText: "我知道了"
        }, (res) => {})
      }).catch(res => {
        baseNetLinkTool.showNetWorkingError(res)
      })
    })
  },
  showIntroPage: function() {
    let that = this
    let clinicId = baseNetLinkTool.getClinicId()
    let firstLogin = baseTool.valueForKey("firstLoginHome")
    if (clinicId == '' && firstLogin == '') {
      that.setData({
        showIntroPage: true
      })
      baseTool.setValueForKey(true, "firstLoginHome")
    }
  },
  iknowClick: function() {
    let that = this
    that.setData({
      showIntroPage: false
    })
  },
  deviceManagerClick: function() {
    // 完善诊所信息
    loginManager.completeClinicInfo("查看设备管理哦~").then(res => {
      wx.navigateTo({
        url: '/pages/my/deviceManage/deviceManage',
      })
    })
  }
})