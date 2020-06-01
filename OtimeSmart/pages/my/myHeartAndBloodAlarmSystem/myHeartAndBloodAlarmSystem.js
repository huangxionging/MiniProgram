// pages/my/myHeartAndBloodAlarmSystem/myHeartAndBloodAlarmSystem.js
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heartIntervalTime: 0,
    timeItemList: [],
    heartRateAlarmItemList: [],
    bloodAlarmItemList: [],
    heartRateCheckSwitch: false,
    bloodCheckSwitch: false,
    shrinkAlarmValue: 0,
    diastoleAlarmValue: 0,
    heartRateAlarmValue: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let token = baseTool.valueForKey("token")
    let heartIntervalTime = baseTool.valueForKey("heartIntervalTime" + token)
    baseTool.print(heartIntervalTime)
    if (baseTool.isValid(heartIntervalTime) == false) {
      heartIntervalTime = 0
    }

    let heartRateCheckSwitchKey = "heartRateCheckSwitch" + token
    let heartRateCheckSwitch = baseTool.valueForKey(heartRateCheckSwitchKey)
    if (baseTool.isValid(heartRateCheckSwitch) == false) {
      heartRateCheckSwitch = false
    }

    let heartRateAlarmValueKey = "heartRateAlarmValue" + token
    let heartRateAlarmValue = baseTool.valueForKey(heartRateAlarmValueKey)
    if (baseTool.isValid(heartRateAlarmValue) == false) {
      heartRateAlarmValue = 0
    }
    
    let bloodCheckSwitchKey = "bloodCheckSwitch" + token
    let bloodCheckSwitch = baseTool.valueForKey(bloodCheckSwitchKey)
    if (baseTool.isValid(bloodCheckSwitch) == false) {
      bloodCheckSwitch = false
    }

    let shrinkAlarmValueKey = "shrinkAlarmValue" + token
    let shrinkAlarmValue = baseTool.valueForKey(shrinkAlarmValueKey)
    if (baseTool.isValid(shrinkAlarmValue) == false) {
      shrinkAlarmValue = 0
    }

    let diastoleAlarmValueKey = "diastoleAlarmValue" + token
    let diastoleAlarmValue = baseTool.valueForKey(diastoleAlarmValueKey)
    if (baseTool.isValid(diastoleAlarmValue) == false) {
      diastoleAlarmValue = 0
    }

    that.setData({
      heartIntervalTime: heartIntervalTime,
      bloodCheckSwitch: bloodCheckSwitch,
      heartRateCheckSwitch: heartRateCheckSwitch,
      heartRateAlarmValue: heartRateAlarmValue,
      shrinkAlarmValue: shrinkAlarmValue,
      diastoleAlarmValue: diastoleAlarmValue
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    let timeItemList = [], heartRateAlarmItemList = [],bloodAlarmItemList = [[], ["/"],[]]
    for (let timeIndex = 0; timeIndex <= 120; ++timeIndex) {
      timeItemList.push(timeIndex + " 分钟")
    }

    for (let alarmIndex = 80; alarmIndex <= 160; ++alarmIndex) {
      heartRateAlarmItemList.push(alarmIndex + " 次/分")
    }

    for (let alarmIndex = 120; alarmIndex <= 160; ++alarmIndex) {
      bloodAlarmItemList[0].push(alarmIndex)
    }

    for (let alarmIndex = 80; alarmIndex <= 100; ++alarmIndex) {
      bloodAlarmItemList[2].push(alarmIndex)
    }
    
    that.setData({
      timeItemList: timeItemList,
      heartRateAlarmItemList: heartRateAlarmItemList,
      bloodAlarmItemList: bloodAlarmItemList
    })
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
  selectSelectClick: function (e) {
    baseTool.print(e)
    let that = this
    let token = baseTool.valueForKey("token")
    let heartIntervalTimeKey = "heartIntervalTime" + token
    let heartIntervalTime = e.detail.value
    baseTool.setValueForKey(heartIntervalTime, heartIntervalTimeKey)
    if (baseTool.isValid(heartIntervalTime) === true) {
      // 发送时间间隔消息
      baseMessageHandler.sendMessage("heartRateCheckIntervalMessage", {
        time: heartIntervalTime
      })
      // 发送刷新消息
      baseMessageHandler.sendMessage("refresh")
    }
    that.setData({
      heartIntervalTime: heartIntervalTime
    })
  },
  heartRateCheckSwitchClick: function(e) {
    baseTool.print(e)
    let that = this
    let heartRateCheckSwitch = e.detail.value
    let token = baseTool.valueForKey("token")
    let heartRateCheckSwitchKey = "heartRateCheckSwitch" + token
    baseTool.setValueForKey(heartRateCheckSwitch, heartRateCheckSwitchKey)
    that.setData({
      heartRateCheckSwitch: heartRateCheckSwitch
    })
  },
  bloodCheckSwitchClick: function(e) {
    baseTool.print(e)
    let that = this
    let bloodCheckSwitch = e.detail.value
    let token = baseTool.valueForKey("token")
    let bloodCheckSwitchKey = "bloodCheckSwitch" + token
    baseTool.setValueForKey(bloodCheckSwitch, bloodCheckSwitchKey)
    that.setData({
      bloodCheckSwitch: bloodCheckSwitch
    })
  },
  heartRateSelectSelectClick: function(e) {
    let that = this
    let token = baseTool.valueForKey("token")
    let heartRateAlarmValueKey = "heartRateAlarmValue" + token
    let heartRateAlarmValue = parseInt(e.detail.value) + 80
    baseTool.setValueForKey(heartRateAlarmValue, heartRateAlarmValueKey)
    that.setData({
      heartRateAlarmValue: heartRateAlarmValue
    })
  },
  bloodSelectSelectClick: function(e) {
    let that = this
    let valueArray = e.detail.value
    let token = baseTool.valueForKey("token")
    let shrinkAlarmValueKey = "shrinkAlarmValue" + token
    let diastoleAlarmValueKey = "diastoleAlarmValue" + token
    let shrinkAlarmValue = that.data.bloodAlarmItemList[0][valueArray[0]]
    let diastoleAlarmValue = that.data.bloodAlarmItemList[2][valueArray[2]]
    baseTool.print(e)
    baseTool.setValueForKey(shrinkAlarmValue, shrinkAlarmValueKey)
    baseTool.setValueForKey(diastoleAlarmValue, diastoleAlarmValueKey)
    that.setData({
      shrinkAlarmValue: shrinkAlarmValue,
      diastoleAlarmValue: diastoleAlarmValue
    })
  }
})