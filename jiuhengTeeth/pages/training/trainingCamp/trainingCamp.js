// pages/training/trainingCamp/trainingCamp.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    traingSelected: true,
    segmentObject: {
      itemPercent: '50%',
      items: [
        {
          title: "训练营",
          selected: true
        },
        {
          title: "爱牙斯坦",
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
    surfaceInfoModel: {}
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
    that.getAgeList()
    that.getBigToothSurfaceInfo()
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
  segmentItemClick: function(e) {
    // baseTool.print(e)
    let that = this
    let segmentObject = that.data.segmentObject
    let traingSelected = true
    if (e.detail.indexPath == 1) {
      traingSelected = false
    }

    let items = segmentObject.items
    if (items[e.detail.indexPath].selected == true) {
      return
    }
    for (let index = 0; index < items.length; ++index) {
      items[index].selected = false
    }
    items[e.detail.indexPath].selected = true
    that.setData({
      traingSelected: traingSelected,
      segmentObject: segmentObject
    })
    baseTool.print(segmentObject)

    if (e.detail.indexPath == 1) {
      that.setVideoBigToothSurfaceInfo()
    }
  },
  inputName: function (e) {
    baseTool.print(e)
    let that = this
    that.setData({
      name: e.detail.value
    })
    that.refreshState()
  },
  inputCellPhone: function (e) {
    baseTool.print(e)
    let that = this
    that.setData({
      tel: e.detail.value
    })
    that.refreshState()
  },
  getAgeList: function () {
    let that = this
    let ageList = []
    for (let index = 0; index < 100; ++index) {
      ageList.push(index + ' 岁')
    }
    that.setData({
      ageList: ageList
    })
  },
  selectAgeClick: function (e) {
    baseTool.print(e)
    let that = this
    that.setData({
      age: e.detail.value
    })
    that.refreshState()
  },
  refreshState: function () {
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
  sinUpClick: function () {
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
  selectGenderClick: function (e) {
    baseTool.print(e)
    let that = this
    that.setData({
      gender: (parseInt(e.detail.value) + 1)
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
  setVideoBigToothSurfaceInfo: function () {
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
    baseTool.startTimer(function (total, timer) {
      if (total == 0 ) {
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
  }
})