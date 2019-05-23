// pages/training/trainingCamp/trainingCamp.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const app = getApp()
const myAdapter = require('../../../adapter/myAdapter.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const myManager = require('../../../manager/myManager.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedIndex: 0,
    segmentObject: {
      itemPercent: '33.333%',
      items: [{
          title: "挑战赛",
          selected: true
        },
        {
          title: "管理",
          selected: false
        },
        {
          title: "刷牙教学",
          selected: false
        }
      ]
    },
    unSignUp: true,
    name: '',
    tel: '',
    age: '',
    gender: '',
    ageList: [],
    genderList: ['男', '女'],
    canSignUp: false,
    teachVideoUrl: '',
    videoPlayIndex: 0,
    brushVideoInfoSurfaces: [],
    showCover: true,
    title: '',
    secondTime: 3,
    keyPoint: '',
    surfaceInfoModel: {},
    hasData: false,
    gameName: '',
    gameId: '',
    showIntroPage: false,
    videoURL: 'http://qnimage.hydrodent.cn/match1.mp4',
    userInfo: {},
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
    that.getHomePage()
    that.getBigToothSurfaceInfo()
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
  segmentItemClick: function(e) {
    baseTool.print(e)
    let that = this
    let segmentObject = that.data.segmentObject
    let items = segmentObject.items
    if (items[e.detail.indexPath].selected == true) {
      return
    }
    for (let index = 0; index < items.length; ++index) {
      items[index].selected = false
    }
    items[e.detail.indexPath].selected = true
    that.setData({
      selectedIndex: e.detail.indexPath,
      segmentObject: segmentObject
    })
    baseTool.print(segmentObject)

    if (e.detail.indexPath == 2) {
      that.setVideoBigToothSurfaceInfo()
    } else if (e.detail.indexPath == 1) {
      that.getUserInfo()
    }
  },
  inputName: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      name: e.detail.value
    })
    that.refreshState()
  },
  inputCellPhone: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      tel: e.detail.value
    })
    that.refreshState()
  },
  getAgeList: function() {
    let that = this
    let ageList = []
    for (let index = 0; index < 100; ++index) {
      ageList.push(index + ' 岁')
    }
    that.setData({
      ageList: ageList
    })
  },
  selectAgeClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      age: e.detail.value
    })
    that.refreshState()
  },
  refreshState: function() {
    let that = this
    let name = that.data.name
    let tel = that.data.tel
    let age = that.data.age
    let gender = that.data.gender
    let canSignUp = false
    // 手机号长度要为 11
    if (name && tel.length == 11 && gender && age) {
      canSignUp = true
    }
    that.setData({
      canSignUp: canSignUp
    })
  },
  sinUpClick: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("apply", "报名训练营", {
      name: that.data.name,
      sex: that.data.gender,
      age: that.data.age,
      telephone: that.data.tel,
      type: '1'
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      that.setData({
        unSignUp: false,
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  selectGenderClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      gender: e.detail.value + 1
    })
    that.refreshState()
  },
  getBigToothSurfaceInfo: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("getBigToothSurfaceInfo", "获得刷牙视频信息").then(res => {
      baseTool.print(res)
      that.data.brushVideoInfoSurfaces = res
      that.data.videoPlayIndex = 0
      that.setVideoBigToothSurfaceInfo()

    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  setVideoBigToothSurfaceInfo: function() {
    let that = this
    let videoPlayIndex = that.data.videoPlayIndex
    let bigToothSurfaceInfo = that.data.brushVideoInfoSurfaces[videoPlayIndex]
    let surfaceInfoModel = {
      name: bigToothSurfaceInfo.name,
      imageUrl: bigToothSurfaceInfo.pic
    }
    that.setData({
      teachVideoUrl: bigToothSurfaceInfo.videoUrl,
      title: bigToothSurfaceInfo.title + '?',
      keyPoint: bigToothSurfaceInfo.keyPoints,
      surfaceInfoModel: surfaceInfoModel,
      secondTime: 3,
      totalTime: bigToothSurfaceInfo.duration,
      showCover: true
    })
    let teachVideoContext = wx.createVideoContext('teach-video', that)
    baseTool.clearSingleTimer()
    baseTool.startTimer(function(total, timer) {
      if (total == 0) {
        baseTool.clearSingleTimer()
        that.setData({
          showCover: false
        })
        teachVideoContext.play()
        return true
      }
      that.setData({
        secondTime: total
      })
    }, 1000, 3)
  },
  videoPlayEnd: function() {
    let that = this
    let videoPlayIndex = that.data.videoPlayIndex
    if (videoPlayIndex > 2) {
      return
    }
    that.data.videoPlayIndex++
      that.setVideoBigToothSurfaceInfo()
  },
  previewClick: function(e) {
    baseTool.previewSingleImage(e.currentTarget.dataset.url)
  },
  getHomePage: function() {
    let that = this
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("challengeGameHomePage", "获取首页比赛信息").then(res => {
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

      } else {
        hasData = true
        gameId = res.gameId
        gameName = res.name
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
          that.getHomePage()
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
    let that = this
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
        that.getHomePage()
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
  },
  getUserInfo: function() {
    let that = this
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      baseWechat.getUserInfo().then(res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: app.globalData.userInfo
        })
      })
    }

    that.loadData()
    app.userInfoReadyCallback = res => {
      that.loadData()
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo
        })
      } else {
        baseWechat.getUserInfo().then(res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: app.globalData.userInfo
          })
        })
      }
    }
  },
  didSelectRow: function(e) {

    let that = this
    let row = e.detail.row
    let section = e.detail.section
    let url = that.data.sectionDataArray[section].rowDataArray[row].url
    let tip = that.data.sectionDataArray[section].rowDataArray[row].title
    if (section == 0 || (section == 1 && row != 2)) {
      wx.navigateTo({
        url: url + '?section=' + section + '&row=' + row,
      })
    } else if (section == 1) {
      switch (row) {
        case 2:
          {
            wx.makePhoneCall({
              phoneNumber: '4009003032',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            break
          }
      }
    }
  },
  loadData: function() {
    baseTool.print(myAdapter.myIndexSectionDataArray())
    let that = this
    that.setData({
      sectionDataArray: myAdapter.myIndexSectionDataArray()
    })
  },
})