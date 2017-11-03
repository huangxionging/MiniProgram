// pages/binding/binding.js


const app = getApp()
const baseConfig = require('../../utils/baseURL.js')
// 手机号码
var telphoneNumber = ''
// 验证码
var verifyCode = ''
// 是否正在进行倒计时
var isTimeCountDown = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, 
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    verifyTitle: '获取验证码',
    verifyCodeDisabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取 url 信息


    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理

      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  /**
   * 获取验证码
   */
  getVerifyCode: function() {
    const that = this
    console.log(telphoneNumber)
    // 电话号码
    if (telphoneNumber.length == 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码给事不正确啊啊不正确手机号码给事不正确啊啊不正确',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return
    }

    

    // 获取验证码接口
    // mini / doctorOfflinegame /
    // wx.request({
    //   url: baseConfig.baseURL() + 'api/smscode/generate',
    //   data: {
    //     'openId': 'oyxMh0RfiPM8Jg2brZcnAOjQtHL0',
    //     'telephone': telphoneNumber,
    //   },
    //   success: res => {
    //     console.log(res)
    //     // 倒计时开始
    //     isTimeCountDown = true
    //     // 重新渲染按钮
    //     that.setData({
    //       verifyCodeDisabled: true
    //     })

    //     // 倒计时 60s
    //     that.timeCountDown(60)
    //   },
    //   fail: res => {
    //     console.log(res)
    //   }
    // })

    wx.request({
      url: baseConfig.baseURL() + 'mini/doctorOfflinegame/' + 'bindPhoneNumber',
      data: {
        'openId': 'oyxMh0RfiPM8Jg2brZcnAOjQtHL0',
        'phone': telphoneNumber,
        'validcode' : '3863' 
      },
      success: res => {
        console.log(res)
      }
    })
  },
  /**
   * 获得输入内容, 以改变
   */
  getInputContent: function(e) {
    console.log(e)
    // 获得输入框内容
    const that = this
    // 获得手机号
    telphoneNumber = e.detail.value
    // 检查是否是11位
    if (telphoneNumber.length == 11) {
      // 检查是否已经在倒计时
      if (!isTimeCountDown) {
        // 如果不是, 重新渲染按钮到可以点击状态
        that.setData({
          verifyCodeDisabled: false,
        });
      }
    } else {
      // 不是11位则渲染成初始状态
      that.setData({
        verifyCodeDisabled: true
      });
    }
  },
  /**
   * 倒计时定时器
   */
  timeCountDown: function (timeCount) {
    var that = this
    // 自减一
    timeCount--
    // 更新倒计时按钮文本内容
    this.setData({
      verifyTitle: '倒计时 ' + timeCount + ' 秒'
    })

    // 计数为 0
    if (timeCount == 0) {
      // 更新倒计时状态
      isTimeCountDown = false
      if (telphoneNumber.length == 11) {
        if (!isTimeCountDown) {
          that.setData({
            verifyCodeDisabled: false,
          });
        }
      }
      // 渲染标题
      this.setData({
        verifyTitle: '获取验证码'
      })

      return
    }
    // 继续执行定时器
    setTimeout(function (){that.timeCountDown(timeCount)}, 1000)
  },
  getUserInfo: function (e) {
    console.log(e)
    
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  nextStep:function () {
    wx.reLaunch({
      url: '../contest/contest',
    })
  }
})