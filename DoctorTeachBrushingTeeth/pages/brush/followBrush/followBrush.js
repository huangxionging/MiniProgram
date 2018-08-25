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
    persons: '557'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let time = baseTool.getCurrentTimeWithNoDate()
    let bgUrl = 'http://qnimage.hydrodent.cn/dtb_morning.png'
    baseTool.print(time)
    if (time > '18:00:00') {
      bgUrl = 'http://qnimage.hydrodent.cn/dtb_night.png'
    }
    that.setData({
      avatar: brushManager.getDoctorAvatar(),
      doctorName: brushManager.getDoctorName(),
      bgUrl: bgUrl
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
      let brushModels = brushAdapter.burshModelAdpter(res)
      that.setData({
        isSelect: false,
        currentIndex: 0,
        title: '请准备好你的牙刷',
        content: '实时跟刷就要开始啦',
        brushModels: brushModels,
        teachVideoUrl: brushModels[0].videoUrl
      })

      
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  scrollChange: function(e) {
    baseTool.print(e)
    let index = e.detail.current
    let that = this
    let brushModel = that.data.brushModels[index]
    that.setData({
      currentIndex: index,
      teachVideoUrl: brushModel.videoUrl
    })
  },
  videoPlayEnd: function(e) {

    let that = this
    // 比这个长度减 1
    let currentIndex = that.data.currentIndex
    baseTool.print(currentIndex)
    if (currentIndex < that.data.brushModels.length - 1) {
      let brushModel = that.data.brushModels[currentIndex + 1]


      let title = '即将开始播放第' + (currentIndex + 2) + '个牙面'
      that.setData({
        currentIndex: currentIndex + 1,
        teachVideoUrl: brushModel.videoUrl,
        title: title,
        showContent: false,
        showCover: true,
        showAvatar: false,
      })
      baseTool.startTimer(function(total) {
        baseTool.print(total)
        if (total == 0) {
          that.setData({
            showCover: false,
            showAvatar: true
          })
          that.teachVideoContext.play()
          return true
        } else if (total <= 5) {
          that.setData({
            secondTime: total
          })
          return false
        }
      }, 1000, 5)
    } else {
      that.setData({
        showModal: true,
        modalDialog: {
          showModal: true
        }
      })
      brushManager.signIn().then(res => {
        baseMessageHandler.sendMessage("refresh").then(res => {
          
        })
        
      }).catch(res => {
        baseTool.showInfo(res)
      })

    }
  },
  preventTouch: function(e) {
    baseTool.print(e)
  },
  teachVideoPlay: function(e) {
    let that = this
    that.setData({
      showTeachPlay: false
    })


    that.setData({
      showModal: true,
      modalDialog: {
        showModal: true
      }
    })
    baseTool.startTimer(function(total) {
      baseTool.print(total)
      if (that.data.isSelect == true) {
        return true
      }
      if (total == 0) {
        that.setData({
          showCover: false,
          showAvatar: true
        })
        that.teachVideoContext.play()
        return true
      } else if (total <= 5) {
        that.setData({
          title: '即将开始播放第1个牙面',
          showContent: false,
          secondTime: total
        })
        return false
      }
    }, 1000, 5)
  },
  hideModal: function() {
    let that = this
    that.setData({
      showModal: false,
      modalDialog: {
        showModal: false
      }
    })
  }
})