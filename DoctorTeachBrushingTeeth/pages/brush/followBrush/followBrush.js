// pages/brush/followBrush/followBrush.js
const baseTool = require('../../../utils/baseTool.js')
const brushManager = require('../../../manager/brushManager.js')
const brushAdapter = require('../../../adapter/brushAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brushModels: [],
    currentIndex: 0,
    teachVideoUrl: '',
    avatar: '',
    showCover: true,
    showAvatar: true,
    showContent: true,
    showTeachPlay: true,
    bgUrl: '',
    showModal: false,
    modalDialog: {
      showModal: false
    },
    persons: '',
    brushComplete: 0,
    animationData: {},
    showFinger: true,
    autoplay: false,
    averageTime: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let time = baseTool.getCurrentTimeWithNoDate()
    let bgUrl = 'http://qnimage.hydrodent.cn/dtb_morning.png'
    let blurUrl = 'http://qnimage.hydrodent.cn/dtb_alert_morning.png'
    baseTool.print(time)
    if (time > '18:00:00') {
      bgUrl = 'http://qnimage.hydrodent.cn/dtb_night.png'
      blurUrl = 'http://qnimage.hydrodent.cn/dtb_alert_night.png'
    }
    that.setData({
      avatar: brushManager.getDoctorAvatar(),
      doctorName: brushManager.getDoctorName(),
      bgUrl: bgUrl,
      blurUrl: blurUrl
    })
    that.getBrushingVideoDetails()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.teachVideoContext = wx.createVideoContext('teach-video', this)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    if (that.teachVideoContext) {
      that.teachVideoContext.pause()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this
    that.teachVideoContext.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    that.data.brushComplete = 1
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

  getBrushingVideoDetails: function() {
    let that = this
    wx.showNavigationBarLoading()
    brushManager.getBrushingVideoDetails().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = brushAdapter.burshModelAdpter(res)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  videoPlayEnd: function(e) {
    let that = this
    if (that.data.brushComplete == 0) {
      let sendPromise = brushManager.signIn().then(res => {
        baseTool.print(res)
        that.setData({
          persons: res,
          showModal: true,
          modalDialog: {
            showModal: true
          }
        })
        baseTool.startTimer(function (total) {
          baseTool.print([total, that.animation])
          if (that.data.brushComplete > 0) {
            return true
          }
          var animation = wx.createAnimation({
            duration: 500,
            timingFunction: "linear",
            delay: 0,
            transformOrigin: "50% 50% 0",
          })

          that.animation = animation
          if (total % 2 == 0) {
            animation.translateY(-10).step()
          } else {
            animation.translateY(10).step()
          }

          that.setData({
            animationData: animation.export()
          })

        }, 500, 6000000000)
        return baseMessageHandler.sendMessage("refresh")
      }).catch(res => {
        baseTool.showInfo(res)
        return baseTool.defaultPromise()
      })

      // 发送消息
      sendPromise.then(res => {
        baseTool.print(res)
      }).catch(res => {
        baseTool.print(res)
      })
    } else {
      let that = this
      that.setData({
        showCover: true,
        brushComplete: that.data.brushComplete + 1,
        title: '重新学习',
        showTeachPlay: true,
        currentIndex: 0,
        showContent: true,
        content: '',
        showModal: false,
        modalDialog: {
          showModal: false
        }
      })
    }
  },
  preventTouch: function(e) {
    baseTool.print(e)
  },
  teachVideoPlay: function(e) {
    let that = this
    that.setData({
      autoplay: true,
      showTeachPlay: false,
      showCover: false,
      showAvatar: true,
    })

    that.teachVideoContext.play()
  },
  hideModal: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      showCover: true,
      brushComplete: that.data.brushComplete + 1,
      title: '重新学习',
      showTeachPlay: true,
      currentIndex: 0,
      showContent: true,
      content: '',
      showModal: false,
      modalDialog: {
        showModal: false
      }
    })
  },
  selectDeviceClick: function (e) {
    wx.navigateTo({
      url: '/pages/home/deviceBanner/deviceBanner',
    })
  }, 
  updateTime: function(e) {
    baseTool.print(e)
    let that = this
    let currentIndex = that.data.currentIndex
    let startTime = that.data.brushModels[currentIndex].startTime
    let duration = that.data.brushModels[currentIndex].duration
    baseTool.print([e.detail.currentTime, startTime, duration])
    if (e.detail.currentTime > startTime + duration || e.detail.currentTime < startTime) {
      let index = that.indexForCurrentTime(e.detail.currentTime)
      baseTool.print(index)
      that.setData({
        currentIndex: index,
      })
    }
  },
  indexForCurrentTime(currentTime) {
    let that = this
    let brushModels = that.data.brushModels
    let length = brushModels.length
    let indexFrame = Math.floor(currentTime / that.data.averageTime)
    baseTool.print(['indexFrame', indexFrame])
    if (indexFrame < length - 1) {
      let startTime = brushModels[indexFrame].startTime
      let duration = brushModels[indexFrame].duration
      baseTool.print([startTime, currentTime])
      if (currentTime < startTime) {
        for (let index = indexFrame - 1; index >= 0; --index) {
          startTime = brushModels[index].startTime
          baseTool.print([startTime, currentTime])
          if (currentTime > startTime) {
            return index
          }
        }
      } else if (currentTime > startTime + duration) {
        for (let index = indexFrame + 1; index < length; ++index) {
          startTime = brushModels[index].startTime
          duration = brushModels[index].duration
          baseTool.print([startTime, duration])
          if (currentTime < startTime + duration) {
            return index
          }
        }
      } else {
        return indexFrame
      }
    } else {
      return indexFrame
    }
  }  
})