// pages/statistics/withdrawMoney/withdrawMoney.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const statisticsManager = require("../../../manager/statisticsManager.js")
const statisticsAdapter = require('../../../adapter/statisticsAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    segmentIndex: 1,
    totalMoney: '',
    remaingMoney: '',
    money: '',
    recordList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    baseTool.print(this.data.recordList)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.getWithdrawMoneyInfo()
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
   * 获得提现信息
   */
  getWithdrawMoneyInfo: function() {
    let memberId = loginManager.getMemberId()
    let that = this
    wx.showNavigationBarLoading()
    statisticsManager.getWithdrawMoneyInfo(memberId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      let data = statisticsAdapter.getWithdrawMoneyInfoAdapter(res)
      that.setData(data)
      if (data.status == 1) {
        wx.setNavigationBarTitle({
          title: '提现记录'
        })
      } 
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.showInfo(res)
    })
  },

  segmentClick: function(e) {
    let that = this
    that.setData({
      segmentIndex: e.currentTarget.dataset.index
    })

    if (that.data.segmentIndex == 2 && that.data.recordList.length == 0) {
      let memberId = loginManager.getMemberId()
      let that = this

      statisticsManager.getWithdrawMoneyList(memberId).then(res => {
        baseTool.print(res)
        let recordList = statisticsAdapter.getWithdrawMoneyListAdapter(res)
        that.setData({
          recordList: recordList
        })
      }).catch(res => {
        wx.hideNavigationBarLoading()
        baseTool.showInfo(res)
      })
    }
  },
  deleteClick: function(e) {
    let that = this
    that.setData({
      money: '',
      remaingMoney: parseFloat(that.data.totalMoney).toFixed(2)
    })
  },
  getInputContent: function(e) {
    baseTool.print(e)
    let that = this
    let value = e.detail.value

    // let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)|(^$)/
    // 先考虑没有小数的情况, 然后考虑有小数的情况
    let reg = /(^[0-9]+\.[0-9]?[0-9]?$)|(^[1-9][0-9]*$)|(^$)/
    // 检查是否符合正则表达式规则
    if(reg.test(value)) {
      // 不能让金额大于最大可提现金额
      let money = parseFloat(value==''?0:value).toFixed(2)
      // baseTool.print([money, that.data.totalMoney])
      if ((money - that.data.totalMoney) > 0) {
        return that.data.money
      } else {
        let enabled = true
        if (value < 20) {
          enabled = false
        }
        baseTool.print([money])
        that.setData({
          money: value,
          remaingMoney: (that.data.totalMoney - money).toFixed(2),
          enabled: enabled
        })
      }
    } else {
        return that.data.money
    }
  },
  confirmClick: function(e) {
    let that = this
    if (that.data.money < 20) {
      baseTool.showInfo("每次提现金额必须大于等于20元")
      return
    }
    let memberId = loginManager.getMemberId()
    let money = that.data.money
    wx.showNavigationBarLoading()
    statisticsManager.withdrawMoney(memberId, money).then(res => {
      that.setData({
        loadDone: false
      })
      wx.hideNavigationBarLoading()
      that.getWithdrawMoneyInfo()
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.showInfo(res)
    })
  },
  confirmDoneClick: function(e) {
    wx.navigateBack()
  }
})