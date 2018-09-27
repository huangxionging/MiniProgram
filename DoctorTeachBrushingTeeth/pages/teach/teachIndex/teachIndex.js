// pages/teach/teachIndex.js
const baseTool = require('../../../utils/baseTool.js')
const teachManager = require('../../../manager/teachManager.js')
const teachAdapter = require('../../../adapter/teachAdapter.js')
const doctorInfoManager = require("../../../manager/doctorInfoManager.js")
const doctorInfoAdapter = require('../../../adapter/doctorInfoAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    videPicUrl: '',
    teachVideoUrl: '',
    showPoster: true,
    doctorName: '',
    autoplay: false,
    selectIndex: 0,
    videoList: [],
    tagVideoList: [],
    avatar: '',
    doctorName: '',
    department: '',
    jobTitle: '',
    hospital: '',
    doctorInfo: '',
    animationData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    // baseTool.print(["带过来的参数",options.q])
    if (options.q) {
      let url = decodeURIComponent(options.q)

      let parameter = baseTool.getParameterFromURL(url)
      baseTool.print(["带过来的参数", parameter])
      if (parameter.doctorId) {
        baseTool.setValueForKey(parameter.doctorId, "doctorId")
      } else {
        baseTool.setValueForKey('', "doctorId")
      }
    } else {
      if (options.doctorId) {
        baseTool.setValueForKey(options.doctorId, "doctorId")
      } else {
        let doctorId = baseTool.valueForKey('doctorId')
        if (!doctorId) {
          baseTool.setValueForKey('', "doctorId")
        }
      }
    }
    that.getDoctorInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.lookVideoContext = wx.createVideoContext('look-video', this)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    if (that.lookVideoContext) {
      that.lookVideoContext.pause()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function(e) {
    let that = this
    that.lookVideoContext.pause()
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
  // onShareAppMessage: function() {

  // },
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    teachManager.getTeachVideoInfo().then(res => {
      wx.hideNavigationBarLoading()
      let data = teachAdapter.videoAdapter(res)
      baseTool.print(data)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.showInfo(res)
    })
  },
  lookVideoPlay: function(e) {
    baseTool.print([e, '2'])
    let that = this
    that.setData({
      showPoster: false
    })
    // that.lookVideoContext.play()
  },
  videoPlayClick: function(e) {
    baseTool.print([e, '3'])
    let that = this
    that.setData({
      showPoster: false
    })
    that.lookVideoContext.play()
  },
  videoPause: function(e) {},
  videoItemClick: function(e) {
    let that = this
    baseTool.print([e.detail.videoUrl, '1'])
    that.setData({
      videoUrl: e.detail.videoUrl,
      showPoster: false,
      autoplay: true,
    })
    that.lookVideoContext.play()
  },
  bindwaiting: function(e) {
    baseTool.print([e, '4'])
    let that = this
    // that.lookVideoContext.play()
  },
  segmentClick: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      selectIndex: index,
      tagVideoList: that.data.videoList[index].tagVideoList
    })
    baseTool.print(e)
  },
  getDoctorInfo: function() {
    let that = this
    wx.showNavigationBarLoading()
    doctorInfoManager.getDoctorInfo().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      // 从适配器获得数据
      let data = doctorInfoAdapter.homePageAdapter(res)
      that.setData(data)
      that.setAnimation()
      // 加载视频数据
      that.loadData()
      // baseMessageHandler.postMessage("doctorBrushScore", res => {
      //   res(that.data.reportDataList[0])
      // })
      // 开启动画
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  doctorInfoClick: function(e) {
    wx.navigateTo({
      url: '/pages/home/doctorInfoDetail/doctorInfoDetail',
    })
  },
  cancleClick: function(e) {
    let that = this
    that.setData({
      showModal: false
    })
    baseTool.setValueForKey(false, 'showModal')
  },
  scrollRange:function(e) {
    let that = this
    baseTool.print(e)
    if (e.detail.scrollTop > 100 && that.data.showDoctor == true) {
      that.setData({
        showDoctor: false,
        brushComplete: 1
      })
    } else if (e.detail.scrollTop < 100 && that.data.showDoctor == false) {
      that.setData({
        showDoctor: true,
        brushComplete: 0
      })
      that.setAnimation()
    }
  },
  setAnimation: function(e) {
    let that = this
    baseTool.startTimer(function (total) {
      baseTool.print([total, that.animation])
      if (that.data.brushComplete > 0) {
        return true
      }
      let width = baseTool.systemInfo.windowWidth - baseTool.toPx(110)
      var animation = wx.createAnimation({
        duration: 10000,
        timingFunction: "linear",
        delay: 0,
        transformOrigin: "50% 50% 0",
      })

      that.animation = animation
      if (total % 10 != 0) {
        animation.translateX(-width).step()
      } else {

        animation = wx.createAnimation({
          duration: 0,
          timingFunction: "linear",
          delay: 0,
          transformOrigin: "50% 50% 0",
        })
        animation.translateX(width).step()
      }

      that.setData({
        animationData: animation.export()
      })

    }, 1000, 6000000000)
  }
})