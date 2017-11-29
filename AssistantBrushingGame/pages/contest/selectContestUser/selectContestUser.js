// pages/contest/selectContestUser/selectContestUser.js
const app = getApp()
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const bluetoothManager = require('../../../manager/bluetoothManager.js')

var data = {
  loadingDone: false,
  hasData: false,
  gameId: '',
  deviceId: '',
  macAddress: '',
  deviceName: '',
  dataList: [],
  tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
  //尾巴读取数据的特征值 notify
  tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
  //尾巴读取数据的特征值 write
  tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
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
    data.deviceId = options.deviceId
    data.deviceName = options.name
    data.macAddress = options.macAddress.toUpperCase()
    baseTool.print(data.deviceId)
    that.setData(data)
    that.loadData()

    app.userInfoReadyCallback = res => {
      that.loadData()
    }
    // 添加消息处理函数
    baseMessageHandler.addMessageHandler('selectRefresh', that, that.loadData).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
    that.connectDevice()
    that.deviceConnectionStateChange()

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

    bluetoothManager.closeBLEConnection(data.deviceId).then(res => {
      baseTool.print([res, '断开链接成功'])
    }).catch(res => {
      baseTool.print([res, '断开链接失败'])
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
  connectDevice: function () {
    var that = this
    // 找服务, 找特征
    wx.showLoading({
      title: '正在连接设备...',
      mask: false,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    var getCharacteristicsPromise = bluetoothManager.connectDevice(data.deviceId).then(res => {
      baseTool.print([res, '服务 UUID', data.macAddress, data.tailServiceUUID])
      return bluetoothManager.getDeviceCharacteristics(data.deviceId, data.tailServiceUUID)
      // 获得服务特征
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
      })
    })

    // 预订通知
    var notifyPromise = getCharacteristicsPromise.then(res => {
      baseTool.print([res, '获得特征值'])
      return bluetoothManager.notifyDeviceCharacteristicValueChange(data.deviceId, data.tailServiceUUID, data.tailCharacteristicIdNotify)
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
      })
    })

    notifyPromise.then(res => {
      baseTool.print([res, '预订通知成功成功'])
      that.deviceCharacteristicValueChange(data.deviceId)
    }).catch(res => {
      baseTool.print([res, '预订通知失败'])
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {
          wx.navigateBack()
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  }
  ,
  addContestUser: () => {
    wx.navigateTo({
      url: '../addOneContestUser/addOneContestUser?gameId=' + data.gameId + '&macAddress=' + data.macAddress,
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
        title: '提示',
        content: data.dataList[index].name + ' 在本次比赛中将与设备 ' + data.deviceName + ' 绑定',
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
          } else if (!res.cancel && !res.confirm) {
            data.dataList[index].item.isSelect = !data.dataList[index].item.isSelect
            that.setData(data)
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
    // macAddress
    contestManager.bindContestUser(data.gameId, name, userId, data.macAddress).then(res => {
      baseTool.print(res)
      wx.navigateBack()
      // 删除这个 Mac 地址下的
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
  },
  deviceConnectionStateChange: function () {
    bluetoothManager.deviceConnectionStateChange(res => {
      baseTool.print([res, '蓝牙状态改变'])
    })
  },
  deviceCharacteristicValueChange: function (deviceId = '') {
    var that = this
    bluetoothManager.deviceCharacteristicValueChange(res => {

      var hex = baseHexConvertTool.arrayBufferToHexString(res.value)
      baseTool.print([hex, '通知信息'])
      // 兼容产品
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 查找设备命令
        var buffer = bleCommandManager.findDeviceCommand()
        bluetoothManager.writeDeviceCharacteristicValue(deviceId, data.tailServiceUUID, that.data.tailCharacteristicIdWrite, buffer).then(res => {
          baseTool.print([res, '查找设备命令发送成功'])
        }).catch(res => {
          baseTool.print([res, '设备常亮失败'])
        })
      } else if (hex.indexOf('f30c') == 0) {
        baseTool.print([res, '设备常亮'])
        wx.hideLoading()
        wx.showToast({
          title: '尾巴保持常亮',
          icon: '',
          image: '',
          duration: 3000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  }
})