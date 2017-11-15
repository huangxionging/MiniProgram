// pages/createContest/createContest.js
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
var data = {
  name: '',
  gameId: '',
  total: '比赛设备15支',
  dataList: [
    {
      id: 1,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      gameId: '',
    },
    {
      id: 2,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      gameId: '',
    },
    {
      id: 3,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      gameId: '',
    },
    {
      id: 4,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      gameId: '',
    },
    {
      id: 5,
      deviceId: 'ddd',
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      gameId: '',
    }
  ]
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
    baseTool.print(options)
    var that = this
    data.gameId = options.gameId
    data.name = options.name
    for (var index = 0; index < data.dataList.length; ++index) {
      data.dataList[index].gameId = options.gameId
    }
    baseTool.print(data)
    that.setData(data)
    var searchBluetoothDevicePromise = bluetoothManager.searchBluetoothDevice()
    searchBluetoothDevicePromise.then(res => {
      that.foundDevices()
    })

    // baseMessageHandler.addMessageHandler('message', this, function (res) {
    //   baseTool.print(res)
    // })
    // baseMessageHandler.sendMessage('deleteContest', options).then(res => {
    //   baseTool.print(res)
    // }).catch(res => {
    //   baseTool.print(res)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    baseTool.print('页面准备好')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (res) {
    baseTool.print('页面显示')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function (res) {
    baseTool.print('页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    baseTool.print('页面卸载')
    // 发送通知
    baseMessageHandler.sendMessage('deleteContest', {
      gameId: data.gameId,
      name: data.name,
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (res) {
    baseTool.print(res)
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
  foundDevices: function () {
    var that = this
    bluetoothManager.foundDevice(res => {
      var dataList = data.dataList
      var index = dataList.length
      res.id = index + 1
      res.imageUrl = '../../../resource/power25.png'
      res.navigateUrl = '../selectContestUser/selectContestUser'
      dataList.push(res)
      data.total = '比赛设备 ' + (index + 1) + '支'
      that.setData(data)
    })
  },
  getInputName: function(e) {
    baseTool.print(e)
    data.name = e.detail.value

    contestManager.addContest(data.gameId, data.name).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  }
})