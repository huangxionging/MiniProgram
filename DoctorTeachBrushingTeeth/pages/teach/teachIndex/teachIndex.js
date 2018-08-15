// pages/teach/teachIndex.js
const baseTool = require('../../../utils/baseTool.js')
const teachManager = require('../../../manager/teachManager.js')
const teachAdapter = require('../../../adapter/teachAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyTitle: '获取验证码',
    isSelect: true,
    videoUrl: '',
    videPicUrl: '',
    teachVideoUrl: '',
    showModal: false,
    isTel: false,
    modalDialog: {
      showModal: false
    },
    newsList: [],
    brushModels: [],
    currentIndex: 0,
    telphoneNumber: '',
    verifyCode: '',
    isTimeCountDown: false,
    verifyCodeDisabled: true,
    avatar: '',
    bindDisabled: true,
    showCover: true,
    showAvatar: false,
    showContent: true,
    showPoster: true,
    showTeachPlay: true,
    doctorName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      avatar: teachManager.getDoctorAvatar(),
      doctorName: teachManager.getDoctorName()
    })
    that.loadData()
    wx.startPullDownRefresh()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.lookVideoContext = wx.createVideoContext('look-video', this)
    this.teachVideoContext = wx.createVideoContext('teach-video', this)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    if (that.data.isSelect && that.lookVideoContext) {
      that.lookVideoContext.pause()
    } else if (!that.data.isSelect && that.teachVideoContext){
      that.teachVideoContext.pause()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (e) {
  

    let that = this
    if (that.data.isSelect) {
      that.lookVideoContext.pause()
    } else {
      that.teachVideoContext.pause()
    }
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
  loadData: function () {
    let that = this
    wx.showNavigationBarLoading()
    teachManager.getTeachVideoInfo().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let data = teachAdapter.videoAdapter(res)
      baseTool.print(data)
      that.setData(data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  segmentClick: function (e) {
    let that = this
    baseTool.print(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index
    switch (index) {
      case '1': {
        that.setData({
          isSelect: true,
          showCover: false,
          showAvatar: false,
          showContent: false,
          showTeachPlay: true
        })
        break
      }
      case '2': {
        baseTool.print(e.currentTarget.dataset.index)
        let telphone = teachManager.getTelphone()
        that.setData({
          showPoster: true
        })
        baseTool.print(telphone)
        if (telphone) {
          that.setData({
            isSelect: false,
            isTel: true
          })
          if (that.data.brushModels.length == 0) {
            that.getBrushingVideoDetails()
          } else {
            let brushModels = that.data.brushModels
            that.setData({
              isSelect: false,
              showCover: true,
              showAvatar: false,
              showContent: true,
              currentIndex: 0,
              title: '请准备好你的牙刷',
              content: '实时跟刷就要开始啦',
              brushModels: brushModels,
              teachVideoUrl: brushModels[0].videoUrl
            })
          }
        } else {
          that.setData({
            isSelect: false,
            isTel: false,
          })
        }
        break
      }
    }
  },
  getBrushingVideoDetails: function () {
    let that = this
    wx.showNavigationBarLoading()
    teachManager.getBrushingVideoDetails().then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let brushModels = teachAdapter.burshModelAdpter(res)
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
  hideModal: function (e) {

  },
  cancleClick: function (e) {
    let that = this
    that.setData({
      showModal: false,
      modalDialog: {
        showModal: false
      }
    })
  },
  confirmClick: function (e) {
    baseTool.print(e)
    let that = this
    let telphoneNumber = that.data.telphoneNumber
    let verifyCode = that.data.verifyCode
    wx.showLoading({
      title: '处理中...',
      mask: true,
    })
    teachManager.bindingTelphone(telphoneNumber, verifyCode).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      teachAdapter.telphoneAdapter(res.wxUser)
      that.setData({
        isSelect: false,
        isTel: true,
      })
      if (that.data.brushModels.length == 0) {
        that.getBrushingVideoDetails()
      }
    }).catch(res => {
      wx.hideLoading()
      baseTool.showInfo(res)
    })
  },
  scrollChange: function (e) {
    baseTool.print(e)
    let index = e.detail.current
    let that = this
    let brushModel = that.data.brushModels[index]
    that.setData({
      currentIndex: index,
      teachVideoUrl: brushModel.videoUrl
    })
  },
  videoPlayEnd: function (e) {

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
      baseTool.startTimer(function (total) {
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
      let that = this
      let random = Math.round(Math.random() * 100) % 2 + 4
      that.setData({
        face: random,
        showModal: true,
        modalDialog: {
          showModal: true
        }
      })
    }
  },
  preventTouch: function (e) {
    baseTool.print(e)
  },
  getVerifyCodeClick: function (e) {
    let that = this
    let telphoneNumber = that.data.telphoneNumber
    // 电话号码
    if (telphoneNumber.length != 11) {
      baseTool.showInfo('请输入正确的手机号')
      return
    }

    // 获取验证码接口
    teachManager.getVerifyCode(telphoneNumber).then(res => {
      // 倒计时开始
      
      // 重新渲染按钮
      that.setData({
        verifyCodeDisabled: true,
        isTimeCountDown: true
      })

      // 倒计时 60s
      that.timeCountDown(60)
    }).catch(res => {
      baseTool.showInfo(res)
    })
  },
  /**
   * 获得输入内容, 以改变
   */
  getInputContent: function (e) {
  
    // 获得输入框内容
    let that = this
    // 获得手机号
    let telphoneNumber = e.detail.value
    let isTimeCountDown = that.data.isTimeCountDown
    baseTool.print(isTimeCountDown)
    // 检查是否是11位
    if (telphoneNumber.length == 11) {
      // 检查是否已经在倒计时
      let bindDisabled = (that.data.verifyCode.length == 4) ? false : true
      if (!isTimeCountDown) {
        // 如果不是, 重新渲染按钮到可以点击状态
        that.setData({
          verifyCodeDisabled: false,
          telphoneNumber: telphoneNumber,
          bindDisabled: bindDisabled
        });

      }
    } else {
      // 不是11位则渲染成初始状态
      that.setData({
        verifyCodeDisabled: true,
        bindDisabled: true,
        telphoneNumber: telphoneNumber
      });
    }
  },
  /**
   * 倒计时定时器
   */
  timeCountDown: function (timeCount) {
    let that = this
    let telphoneNumber = that.data.telphoneNumber
    // 自减一
    timeCount--
    // 更新倒计时按钮文本内容
    this.setData({
      verifyTitle: '倒计时' + timeCount + '秒'
    })

    // 计数为 0
    if (timeCount == 0) {
      // 更新倒计时状态
      if (telphoneNumber.length == 11) {
        
          that.setData({
            verifyCodeDisabled: false,
          });
      }
      // 渲染标题
      this.setData({
        isTimeCountDown: false,
        verifyTitle: '获取验证码',
      })
      return
    }
    // 继续执行定时器
    setTimeout(function () { that.timeCountDown(timeCount) }, 1000)
  },
  getInputVerifyCode: function (e) {
    // 获得输入框内容
    let that = this
    // 获得手机号
    let verifyCode = e.detail.value
    let bindDisabled = (that.data.telphoneNumber.length == 11 && verifyCode.length == 4) ? false : true
    that.setData({
      verifyCode: verifyCode,
      bindDisabled: bindDisabled
    })
  },
  lookVideoPlay: function(e) {
    baseTool.print(e)
    let that = this
    if (that.data.showPoster == true) {
      that.lookVideoContext.pause()
    }
  },
  videoPlayClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      showPoster: false
    })
    that.lookVideoContext.play()
    // let random = Math.round(Math.random() * 100) % 2 + 4
    // that.setData({
    //   face: random,
    //   showModal: true,
    //   modalDialog: {
    //     showModal: true
    //   }
    // })
  },
  videoPause: function(e) {
    let that = this
    that.setData({
      showPoster: true
    })
      baseTool.print(['e', 'dddd'])
  },
  teachVideoPlay: function(e) {
    let that = this
    that.setData({
      showTeachPlay: false
    })
    
    baseTool.startTimer(function (total) {
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
  }
})