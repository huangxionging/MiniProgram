// pages/createContest/createContest.js
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    gameId: '',
    total: '比赛设备0支',
    dataList: []
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
    var searchBluetoothDevicePromise = bluetoothManager.searchBluetoothDevice()
    searchBluetoothDevicePromise.then(res => {
      console.log(res);
      that.foundDevices()
    })

    baseMessageHandler.addMessageHandler('deleteDevice', that, res => {
      var that = this
      var dataList = that.data.dataList.filter((value, index, arry) => {
        return value.deviceId != res
      })

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
    // 发送通知
    baseMessageHandler.sendMessage('deleteContest', {
      gameId: data.gameId,
      name: data.name,
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
      if (res.name.indexOf('game') == -1) {
        return
      }
      baseTool.print(res)
      var dataList = that.data.dataList
      var index = dataList.length
      res.imageUrl = '../../../resource/power25.png'
      res.navigateUrl = '../selectContestUser/selectContestUser'
      let hex = Array.prototype.map.call(new Uint8Array(res.advertisData), x => ('00' + x.toString(16)).slice(-2)).join('');
      console.log([hex, 'dddd'])
      dataList.push({
        name: res.name,
        deviceId: res.deviceId
      })
      that.setData({
        dataList: dataList,
        tototal: '比赛设备 ' + (index + 1) + '支'
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
    baseTool.print(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  }
})