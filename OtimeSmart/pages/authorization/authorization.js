// pages/authorization/authorization/authorization.js
const baseTool = require('../../utils/baseTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    isAuthorization: 0,
    verifyTitle: '获取验证码',
    account: '',
    password: '',
    avatar: '',
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
            baseTool.print([res, "结果"])
            wx.hideLoading()
            var wxUser = res.wxUser
            if (res && wxUser && wxUser.openid) {

              baseTool.setValueForKey(wxUser.openid, 'openid')
              that.setData({
                avatar: wxUser.headimgurl,
                nickname: wxUser.nickname
              })

              
              if (wxUser.clinicId != undefined) {
                baseTool.setValueForKey(wxUser.clinicId, 'clinicId')
              }
              if (wxUser.clinicName != undefined) {
                baseTool.setValueForKey(wxUser.clinicName, 'clinicName')
              }
              if (wxUser.clinicPic != undefined) {
                baseTool.setValueForKey(wxUser.clinicPic, 'clinicPic')
              }
              if (wxUser.clinicIntro != undefined) {
                baseTool.setValueForKey(wxUser.clinicIntro, 'clinicIntro')
              }
              if (wxUser.isHaveDevice != undefined) {
                baseTool.setValueForKey(wxUser.isHaveDevice?true:false, 'isHaveDevice')
              }
              if (wxUser.memberId != undefined) {
                if (wxUser.telephone != undefined) {
                  baseTool.setValueForKey(wxUser.telephone, 'telephone')
                }
                baseTool.setValueForKey(wxUser.memberId, 'memberId')
                loginManager.reLauch()
              } else {
                wx.setNavigationBarTitle({
                  title: '',
                })
                wx.setNavigationBarColor({
                  frontColor: '#000000',
                  backgroundColor: '#00A0E8',
                })
                that.setData({
                  isAuthorization: 1
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
    let account = e.detail.value

    that.setData({
      account: account,
    })
    // that.refreshState()
  },
  getInputVerifyCode: function(e) {
    // 获得输入框内容
    let that = this
    // 获得手机号
    let password = e.detail.value
    that.setData({
      password: password
    })
    // that.refreshState()
  },
  confirmClick: function(e) {
    let that = this
    let account = that.data.account
    let password = that.data.password
    wx.showLoading({
      title: '处理中...',
      mask: true,
    })

    loginManager.loginAccountPassword(account, password).then(res => {
      wx.hideLoading()
      baseTool.print(res)
      let wxUser = res.wxUser
      if (wxUser.telephone) {
        baseTool.setValueForKey(wxUser.telephone, 'telephone')
      }

      if (wxUser.memberId) {
        baseTool.setValueForKey(wxUser.memberId, 'memberId')
      }

      if (wxUser.clinicId != undefined) {
        baseTool.setValueForKey(wxUser.clinicId, 'clinicId')
      }
      if (wxUser.clinicName != undefined) {
        baseTool.setValueForKey(wxUser.clinicName, 'clinicName')
      }
      if (wxUser.clinicPic != undefined) {
        baseTool.setValueForKey(wxUser.clinicPic, 'clinicPic')
      }
      if (wxUser.clinicIntro != undefined) {
        baseTool.setValueForKey(wxUser.clinicIntro, 'clinicIntro')
      }
      if (wxUser.isHaveDevice != undefined) {
        baseTool.setValueForKey(wxUser.isHaveDevice ? true : false, 'isHaveDevice')
      }
      baseNetLinkTool.reLauch()
    }).catch(res => {
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
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
  }
  
})