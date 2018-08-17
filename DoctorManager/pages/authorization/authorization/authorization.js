// pages/authorization/authorization/authorization.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const loginAdapter = require('../../../adapter/loginAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    isAuthorization: false,
    verifyTitle: '获取验证码',
    telphoneNumber: '',
    verifyCode: '',
    isTimeCountDown: false,
    verifyCodeDisabled: true,
    avatar: '',
    bindDisabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let openId = loginManager.getOpenId()
    let that = this
    let isAuthorization = false
    if (openId) {
      isAuthorization = true
      wx.getUserInfo({
        success: function(res) {
          // res.userInfo.
          baseTool.print(res.userInfo)
          that.setData({
            avatar: res.userInfo.avatarUrl
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    that.setData({
      loadDone: true,
      isAuthorization: isAuthorization
    })
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
  getUserInfo: function (e) {
    baseTool.print(e)
    let that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.loginFlow(e.detail.userInfo)
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'loading',
        image: null,
        duration: 2000,
        mask: true,
      })
    }
  },
  loginFlow: function (e) {
    let that = this
    wx.showLoading({
      title: '处理中',
    })
    wx.login({
      success: function (res) {
        baseTool.print(res)
        if (res.code) {
          loginManager.loginWithUserInfo(res.code, e).then(res => {
            baseTool.print(res)
            wx.hideLoading()
            if (res && res.wxUser && res.wxUser.openid) {
              baseTool.setValueForKey(res.wxUser.openid, 'openid')
              that.setData({
                avatar: res.wxUser.headimgurl
              })
              if (res.wxUser.telephone && res.wxUser.memberId) {
                baseTool.setValueForKey(res.wxUser.telephone, 'telephone')
                baseTool.setValueForKey(res.wxUser.memberId, 'memberId')
                loginManager.reLauch()
              } else {
                wx.setNavigationBarTitle({
                  title: '绑定手机号',
                })
                that.setData({
                  isAuthorization: true
                })
              }
            } else {
              baseTool.showInfo('获取信息失败')
            }
          }).catch(res => {
            wx.hideLoading()
            baseTool.showInfo(res)
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        baseTool.showInfo('您的网络不太好')
      },
      complete: function (res) { },
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

    that.setData({
      telphoneNumber: telphoneNumber,
    })
    that.refreshState()
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
    that.setData({
      verifyTitle: '倒计时' + timeCount + '秒'
    })

    // 计数为 0
    if (timeCount == 0) {
      // 渲染标题
      that.setData({
        isTimeCountDown: false,
        verifyTitle: '获取验证码',
      })
      that.refreshState()
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
    that.setData({
      verifyCode: verifyCode
    })
    that.refreshState()
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
    loginManager.getVerifyCode(telphoneNumber).then(res => {
      // 倒计时开始

      // 重新渲染按钮
      that.setData({
        verifyCodeDisabled: true,
        isTimeCountDown: true
      })

      // 倒计时 60s
      that.timeCountDown(60)
    }).catch(res => {
      baseTool.print(res)
      baseTool.showInfo(res)
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
    loginManager.bindingTelphone(telphoneNumber, verifyCode).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      loginAdapter.telphoneAdapter(res.wxUser)
      // loginManager.reLauch()
      baseMessageHandler.postMessage('doctorInfo', callBack => {
        callBack({
          loadDone: true,
          orinal: 'login', // 来源
          doctorName: res.wxUser.nickname,
          avatar: res.wxUser.headimgurl
        })
      })
      wx.reLaunch({
        url: '/pages/home/editDoctorInfo/editDoctorInfo',
      })
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseTool.showInfo(res)
    })
  },
  refreshState: function () {
    let that = this
    let telphoneNumber = that.data.telphoneNumber
    let verifyCode = that.data.verifyCode
    let isTimeCountDown = that.data.isTimeCountDown
    let verifyCodeDisabled = true
    let bindDisabled = true
    if (telphoneNumber.length == 11 && verifyCode.length == 4) {
      bindDisabled = false
    }
    if (isTimeCountDown == false) {
      if (telphoneNumber.length == 11) {
        verifyCodeDisabled = false
      }
    } 
    that.setData({
      verifyCodeDisabled: verifyCodeDisabled,
      bindDisabled: bindDisabled
    })
  },
})