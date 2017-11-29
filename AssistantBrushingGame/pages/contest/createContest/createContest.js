// pages/createContest/createContest.js
const app = getApp()
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    gameId: '',
    total: '比赛设备0支',
    dataList: [],
    serviceUUIDs: [],
    tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 notify
    tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 write
    tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
    bindedDevices = {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    baseTool.print(options)
    var that = this
    that.setData({
      gameId: options.gameId,
      name: options.name
    })
    bluetoothManager.checkBluetoothState().then(res => {
      baseTool.print('checkBluetoothState: success')
      that.foundDevices()
    }).catch(res => {
      baseTool.print('checkBluetoothState: fail')
      wx.showModal({
        title: '提示',
        content: '蓝牙打开失败, 请检查蓝牙状态后再使用',
        mask: true,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {
          wx.navigateBack()
        },
        fail: function(res) {baseTool.print(res)},
        complete: function(res) {},
      })
    })

    baseMessageHandler.addMessageHandler('deleteDevice', that, res => {
      var that = this
      // 搜索 macAddress
      var dataList = that.data.dataList.filter((value, index, arry) => {
        return value.macAddress != res.toUpperCase()
      })
      baseTool.print(dataList)
      that.setData({
        dataList: dataList
      })
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
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
    var that = this
    // 发送通知
    baseMessageHandler.sendMessage('deleteContest', {
      gameId: that.data.gameId,
      name: that.data.name,
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })

    baseMessageHandler.removeSpecificInstanceMessageHandler('deleteDevice', this).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })

    app.bleCallback = undefined

    bluetoothManager.stopSearchDevice().then(res => {
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
  foundDevices: function () {
    var that = this
    bluetoothManager.foundDevice(res => {
      // console.log('new device list has founded');
      // console.log(res);
      if (res.name.indexOf('game') == -1) {
        return
      }

      var dataList = that.data.dataList
      var index = dataList.length
      var macAddress = res.name.split('-')[1]
      baseTool.print(['发现新设备', macAddress, res])
      // 广播数据先不弄
      dataList.push({
        name: res.name,
        macAddress: macAddress.toUpperCase(),
        deviceId: res.deviceId,
      })
      that.setData({
        dataList: dataList,
        total: '比赛设备' + (index + 1) + '支',
      })
    })
  },
  getInputName: function(e) {
    baseTool.print(e)
    this.setData({
      name: e.detail.value
    })
    contestManager.addContest(this.data.gameId, this.data.name).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  },
  contestDeviceClick: function(e) {
    var that = this
    var deviceId = e.currentTarget.dataset.deviceid
    wx.hideLoading()
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
    baseTool.print(e)
  }
})