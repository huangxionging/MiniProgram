// pages/authorization/authorization/authorization.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const loginAdapter = require('../../../adapter/loginAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const doctorInfoManager = require("../../../manager/doctorInfoManager.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    isAuthorization: 0,
    verifyTitle: '获取验证码',
    telphoneNumber: '',
    verifyCode: '',
    isTimeCountDown: false,
    verifyCodeDisabled: true,
    avatar: '',
    bindDisabled: true,
    showSad: 0,
    doctorId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.setData({
      loadDone: true,
      isAuthorization: 0
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  getUserInfo: function(e) {
    baseTool.print(e)
    let that = this
    if (e.detail.errMsg == "getUserInfo:ok") {
      that.loginFlow(e.detail)
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
  loginFlow: function(e) {
    let that = this
    wx.showLoading({
      title: '处理中',
    })
    wx.login({
      success: function(res) {
        baseTool.print(res)
        if (res.code) {
          loginManager.loginWithUserInfo(res.code, e).then(res => {
            baseTool.print(res)
            wx.hideLoading()
            if (res && res.wxUser && res.wxUser.openid) {
              baseTool.setValueForKey(res.wxUser.openid, 'openid')
              that.setData({
                avatar: res.wxUser.headimgurl,
                nickname: res.wxUser.nickname
              })
              if (res.wxUser.memberId) {
                if (res.wxUser.telephone) {
                  baseTool.setValueForKey(res.wxUser.telephone, 'telephone')
                }
                baseTool.setValueForKey(res.wxUser.memberId, 'memberId')
                loginManager.reLauch()
              } else {
                let doctorId = loginManager.getDoctorId()
                if (baseTool.isValid(doctorId)) {
                  // 改导航栏标题
                  wx.setNavigationBarTitle({
                    title: '信息核实',
                  })
                  // 改导航栏颜色
                  wx.setNavigationBarColor({
                    frontColor: '#ffffff',
                    backgroundColor: '#34b6ff',
                  })
                  that.setData({
                    doctorId: doctorId,
                    loadDone: true,
                    isAuthorization: 2
                  })
                  that.getDoctorInfo()
                } else {
                  wx.setNavigationBarTitle({
                    title: '绑定手机号',
                  })
                  that.setData({
                    isAuthorization: 1
                  })
                }

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
      fail: function(res) {
        wx.hideLoading()
        baseTool.showInfo('您的网络不太好')
      },
      complete: function(res) {},
    })
  },
  /**
   * 获得输入内容, 以改变
   */
  getInputContent: function(e) {

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
  timeCountDown: function(timeCount) {
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
    setTimeout(function() {
      that.timeCountDown(timeCount)
    }, 1000)
  },
  getInputVerifyCode: function(e) {
    // 获得输入框内容
    let that = this
    // 获得手机号
    let verifyCode = e.detail.value
    that.setData({
      verifyCode: verifyCode
    })
    that.refreshState()
  },
  getVerifyCodeClick: function(e) {
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
  confirmClick: function(e) {
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
          doctorName: res.wxUser.nickname + '医生',
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
  refreshState: function() {
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
  confirmDoctorClick: function(e) {
    let that = this
    loginManager.bindingQrcode(that.data.doctorId).then(res => {
      baseTool.print(res)
      baseTool.setValueForKey(that.data.doctorId, 'memberId')
      loginManager.reLauch()
    }).catch(res => {
      baseTool.print(res)
    })
  },
  callServiceClick: function(e) {
    wx.makePhoneCall({
      phoneNumber: '4009003032',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  getDoctorInfo: function() {
    let that = this
    wx.showNavigationBarLoading()
    loginManager.getDoctorInfo(that.data.doctorId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      that.setData({
        showStatusTitle: '请确认以下信息',
        avatarUrl: res.doctorInfo.doctorHeadimgurl ? res.doctorInfo.doctorHeadimgurl : that.data.avatar,
        doctorName: (res.doctorInfo.doctorName ? res.doctorInfo.doctorName : that.data.nickname) + '医生' ,
        showSad: 0,
        loadDone: true,
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      that.setData({
        showStatusTitle: res,
        avatarUrl: 'http://qnimage.hydrodent.cn/dm_sad.png',
        doctorName: '请联系客服处理',
        showSad: 1,
        loadDone: true,
      })
    })
  },
  reScanClick: function(e) {
    let that = this
    wx.scanCode({
      scanType: ['qrcode'],
      success: function(res) {
        let parameter = baseTool.getParameterFromURL(res.result)
        baseTool.print(parameter)
        if (baseTool.isValid(parameter.doctorId)) {
          that.setData({
            doctorId: parameter.doctorId,
            loadDone: true,
            isAuthorization: 2
          })
          that.getDoctorInfo()
        } else {
          baseTool.showInfo(res.result)
        }
      }
    })
  }
})