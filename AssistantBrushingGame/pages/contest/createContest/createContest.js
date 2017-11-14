// pages/createContest/createContest.js
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')


var data = {
  total: '比赛设备15支',
  dataList: [
    {
      id: 1,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      navigateUrl: '../selectContestUser/selectContestUser'
    },
    {
      id: 2,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      navigateUrl: '../selectContestUser/selectContestUser'
    },
    {
      id: 3,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      navigateUrl: '../selectContestUser/selectContestUser'
    },
    {
      id: 4,
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      navigateUrl: '../selectContestUser/selectContestUser'
    },
    {
      id: 5,
      deviceId: 'ddd',
      name: 1234567,
      imageUrl: '../../../resource/power25.png',
      navigateUrl: '../selectContestUser/selectContestUser'
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
    var that = this
    var searchBluetoothDevicePromise = bluetoothManager.searchBluetoothDevice()
    searchBluetoothDevicePromise.then(res => {
      that.foundDevices()
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
  }
})