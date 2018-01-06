// pages/binding/binding.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
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
    var that = this
    app.userInfoReadyCallback = res => {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo
        })
      } else {
        loginManager.getUserInfo().then(res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: app.globalData.userInfo
          })
        })
      }
    }
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      loginManager.getUserInfo().then(res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: app.globalData.userInfo
        })
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
   * 获取验证码
   */
  getVerifyCode: function() {
    const that = this
    console.log(telphoneNumber)
    // 电话号码
    if (telphoneNumber.length != 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
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
    var getVerifyCodeAction = loginManager.getVerifyCode(telphoneNumber)
    getVerifyCodeAction.then(res => {
      console.log(res)
      // 倒计时开始
      isTimeCountDown = true
      // 重新渲染按钮
      that.setData({
        verifyCodeDisabled: true
      })

      // 倒计时 60s
      that.timeCountDown(60)
    }).catch(res => {
      baseTool.print([res, '失败数据'])
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
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
  getInputVerifyCode: function(e) {
    console.log(e)
    // 获得输入框内容
    const that = this
    // 获得手机号
    verifyCode = e.detail.value
  },
  nextStep:function () {
    var bindingTelphoneAction = loginManager.bindingTelphone(telphoneNumber, verifyCode)
    bindingTelphoneAction.then(res => {
      baseTool.print([res, '完整的数据结构'])
      // 表示已经绑定
      var wxUser = res.wxUser
      baseTool.print([res, wxUser, wxUser.memberId, 'memberId'])
      if (wxUser.clinicId != undefined) {
        baseTool.setValueForKey(wxUser.clinicId, 'clinicId')
      }
      if (wxUser.memberId) {
        baseTool.setValueForKey(wxUser.memberId, 'memberId')
        console.log(res)
        wx.reLaunch({
          url: '/pages/contest/contest/contest',
        })
      } else if (wxUser.openid) {
        baseTool.setValueForKey(wxUser.openid, 'openid')
        wx.redirectTo({
          url: '/pages/login/binding/binding',
        })
      }
    }).catch(res => {
      baseTool.print([res, '失败数据'])
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  }
})