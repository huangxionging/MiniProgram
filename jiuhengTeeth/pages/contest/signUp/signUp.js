// pages/contest/signUp/signUp.js
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    unSignUp: true,
    selectDate: '',
    startDate: '',
    name: '',
    tel: '',
    age: '',
    gender: '',
    ageList: [],
    genderList: ['男', '女'],
    canSignUp: false,
    timeQuantum: ''
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
    let that = this
    that.getStartDate()
    that.getAgeList()
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
  inputName: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      name: e.detail.value
    })
    that.refreshState()
  },
  inputCellPhone: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      tel: e.detail.value
    })
    that.refreshState()
  },
  selectDateClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      selectDate: e.detail.value
    })
    delete that.data["timeList"]
    that.refreshState()
    that.getTimeList(e.detail.value)
  },
  getStartDate: function() {
    let that = this
    let startDate = baseTool.getCurrentDateWithoutTime()
    that.setData({
      startDate: startDate
    })
  },
  getAgeList: function() {
    let that = this
    let ageList = []
    for (let index = 0; index < 100; ++index) {
      ageList.push(index + ' 岁')
    }
    that.setData({
      ageList: ageList
    })
  },
  selectAgeClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      age: e.detail.value
    })
    that.refreshState()
  },
  refreshState: function() {
    let that = this
    let name = that.data.name
    let tel = that.data.tel
    let age = that.data.age
    let gender = that.data.gender
    let selectDate = that.data.selectDate
    let timeQuantum = that.data.timeQuantum
    let canSignUp = false
    // 手机号长度要为 11
    if (name && tel.length == 11 && gender && age && selectDate && timeQuantum) {
      canSignUp = true
    }
    that.setData({
      canSignUp: canSignUp
    })
  },
  sinUpClick: function() {
    let that = this

    baseNetLinkTool.getRemoteDataFromServer("apply", "报名挑战赛", {
      name: that.data.name,
      sex: that.data.gender,
      age: that.data.age,
      telephone: that.data.tel,
      type: '0',
      planAttendanceTime: that.data.selectDate,
      timeQuantum: that.data.timeQuantum
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      that.setData({
        unSignUp: false,
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  selectGenderClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      gender: e.detail.value + 1
    })
    that.refreshState()
  },
  getTimeList: function(date = '') {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("appointmentTime", "获取可预约时间", {
      date: date
    }).then(res => {
      baseTool.print(res)
      let timeList = [
        '9:00~10:00',
        '10:00~11:00',
        '11:00~12:00',
        '14:00~15:00',
        '15:00~16:00',
        '16:00~17:00',
        '17:00~18:00',
      ]

      for (let index = timeList.length - 1; index >= 0; --index) {
        if (res[timeList[index]] != 0) {
          timeList.splice(index, 1)
        }
      }
      that.setData({
        timeList: timeList
      })
    }).catch(res => {

    })
    
  },
  selectTimeClick: function(e) {
    baseTool.print(e)
    let that = this
    that.setData({
      timeQuantum: that.data.timeList[e.detail.value]
    })
    that.refreshState()
  }
})