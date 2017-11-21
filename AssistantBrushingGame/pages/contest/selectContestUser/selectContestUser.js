// pages/contest/selectContestUser/selectContestUser.js
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

var data = {
  loadingDone: false,
  hasData: false,
  gameId: '',
  deviceId: '',
  macAddress: '',
  deviceName: '',
  dataList: []
}

Page({

  /**
   * 页面的初始数据
   */
  data: data,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)
    data.gameId = options.gameId
    var deviceId = options.deviceId
    var deviceIds = deviceId.split(':')
    data.deviceId = deviceIds.join('').toUpperCase()
    data.deviceName = options.name
    data.macAddress = options.deviceId
    baseTool.print(data.deviceId)
    that.setData(data)
    that.loadData()
    // 添加消息处理函数
    baseMessageHandler.addMessageHandler('selectRefresh', that, that.loadData).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
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
    // 删除通知
    baseMessageHandler.removeSpecificInstanceMessageHandler('selectRefresh', this).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this
    that.loadData()
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
  addContestUser: () => {
    wx.navigateTo({
      url: '../addContestUser/addContestUser',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  selectClick: function(e) {
    baseTool.print(e)
    var that = this
    var index = e.currentTarget.id - 1
    var isSelect = data.dataList[index].item.isSelect
    if (isSelect) {
      return
    } else {
      data.dataList[index].item.isSelect = !data.dataList[index].item.isSelect
      that.setData(data)
      wx.showModal({
        title: data.dataList[index].name + ' 在本次比赛中将与设备 ' + data.deviceName + ' 绑定',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#999',
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {
          baseTool.print(res)

          if (res.cancel) {
            data.dataList[index].item.isSelect = !data.dataList[index].item.isSelect
            that.setData(data)
          } else if(res.confirm) {
            that.bindDevice(data.dataList[index])
          }
          // 
        },
        fail: function(res) {
          baseTool.print(res)
        },
        complete: function (res) { baseTool.print(res)},
      })
      
    }
     
    
  },
  bindDevice: function (userInfo) {
    var name = userInfo.name
    var userId = userInfo.playerId
    contestManager.bindContestUser(data.gameId, name, userId, data.deviceId).then(res => {
      baseTool.print(res)
      wx.navigateBack()
      baseMessageHandler.sendMessage('deleteDevice', data.macAddress)
    }).catch(res => {
      baseTool.print(res)
    }) 
  },
  loadData: function() {
    var that = this
    wx.showNavigationBarLoading()
    contestManager.selectContestUser(data.gameId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(typeof (res))
      if (typeof (res) != 'undefined' && res.length > 0) {
        data.loadingDone = true
        data.hasData = true
        data.dataList.splice(0, data.dataList.length)
        for (var index = 0; index < res.length; ++index) {
          data.dataList.push({
            name: res[index].name, // 名字
            playerId: res[index].playerId, // 参赛者的 id
            brushingMethodId: res[index].brushingMethodId,
            item: {
              id: index + 1, // 主key
              isSelect: res[index].isBound
            }
          })
        }
        that.setData(data)
      } else {
        data.loadingDone = true
        data.hasData = false
        data.dataList.splice(0, data.dataList.length)
        that.setData(data)
      }
    }).catch(res => {
      baseTool.print(res)
    })
  }
})