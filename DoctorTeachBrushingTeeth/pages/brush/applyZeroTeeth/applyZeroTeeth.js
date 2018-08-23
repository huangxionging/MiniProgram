// pages/brush/applyZeroTeeth/applyZeroTeeth.js
const baseTool = require('../../../utils/baseTool.js')
const brushManager = require('../../../manager/brushManager.js')
const brushAdapter = require('../../../adapter/brushAdapter.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyTitle: '获取验证码',
    telphoneNumber: '',
    verifyCode: '',
    isTimeCountDown: false,
    verifyCodeDisabled: true,
    bindDisabled: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  getVerifyCodeClick: function(e) {
    let that = this
    let telphoneNumber = that.data.telphoneNumber
    // 电话号码
    if (telphoneNumber.length != 11) {
      baseTool.showInfo('请输入正确的手机号')
      return
    }

    // 获取验证码接口
    brushManager.getVerifyCode(telphoneNumber).then(res => {
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
    setTimeout(function () { that.timeCountDown(timeCount) }, 1000)
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
  confirmClick: function (e) {
    baseTool.print(e)
    let that = this
    let telphoneNumber = that.data.telphoneNumber
    let verifyCode = that.data.verifyCode
    wx.showLoading({
      title: '处理中...',
      mask: true,
    })
    brushManager.bindingTelphone(telphoneNumber, verifyCode).then(res => {
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