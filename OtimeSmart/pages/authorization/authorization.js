// pages/authorization/authorization/authorization.js
const baseTool = require('../../utils/baseTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../utils/baseCloundNetLinkTool.js')

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
    launchImageUrl: "https://shouhuan.taoyt.cn/static/images/launch.png"
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
    baseTool.print([e, "登录信息"])
    let that = this
    wx.showLoading({
      title: '处理中',
    })
    wx.login({
      success: function(res) {
        if (res.code) {
          let parameter = Object.assign({
            code: res.code
          })
          baseNetLinkTool.loginAuthorization("login", "登录", parameter).then(res => {
            baseTool.print(res)
            if (res.token != null) {
              baseTool.setValueForKey(res.token, "token")
            }

            if (res.id != null) {
              baseTool.setValueForKey(res.id, "id")
            }

            if (res.active_device != null) {
              baseTool.setValueForKey({
                macAddress: res.active_id,
                deviceId: res.active_device,
                deviceName: res.active_name ? res.active_name : "",
                deviceAlias: res.active_alias ? res.active_alias : ""
              }, "deviceInfo")
            }

            if (res.avatar != null || res.alias != null) {
              baseTool.setValueForKey({
                avatar: res.avatar ? res.avatar : "",
                alias: res.alias ? res.alias : "",
                birthday: res.birthday ? res.birthday : "25",
                height: res.height ? res.height : "175",
                weight: res.weight ? res.weight : "65",
                sex: res.sex,
                phone: res.phone ? res.phone : ""
              }, "userInfo")
              wx.hideLoading()
              baseNetLinkTool.reLauch()
            } else {
              baseNetLinkTool.getRemoteDataFromServer("info", "用户信息", {
                avatar: e.userInfo.avatarUrl,
                alias: e.userInfo.nickName,
                sex: e.userInfo.gender
              }).then(res => {
                baseTool.print(res)
                baseTool.setValueForKey({
                  avatar: res.avatar ? res.avatar : "",
                  alias: res.alias ? res.alias : "",
                  birthday: res.birthday ? res.birthday : "",
                  height: res.height ? res.height : "170",
                  weight: res.weight ? res.weight : "60",
                  sex: res.sex,
                  phone: res.phone ? res.phone : ""
                }, "userInfo")
                wx.hideLoading()
                baseNetLinkTool.reLauch()
              }).catch(res => {
                wx.hideLoading()
                baseTool.print(res)
                baseNetLinkTool.showNetWorkingError(res)
              })
            }
          }).catch(res => {
            wx.hideLoading()
            baseTool.print(res)
            baseNetLinkTool.showNetWorkingError(res)
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