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

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    reconnectCount: 0,
    reServiceCount: 0,
    reCharacteristic: 0,
    reNotify: 0,
    lightSuccess: false,
    failTips: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)

    that.setData({
      gameId: options.gameId,
      deviceId: options.deviceId,
      macAddress: options.macAddress.toUpperCase(),
      deviceName: options.name,
      reconnectCount: 0,
      reServiceCount: 0,
      reCharacteristic: 0,
      reNotify: 0,
      failTips: false,
      lightSuccess: false,
      brushMethod: (options.brushMethod == "0") ? "a002c7680a5f4f8ea0b1b47fa3f2b947" : "6827c45622b141ef869c955e0c51f9f8"
    })
    baseTool.print(that.data.deviceId)
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

    // 找服务, 找特征
    wx.showLoading({
      title: '正在连接设备...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    setTimeout(function () {
      that.connectDevice()
      that.deviceConnectionStateChange()
    }, 3000)

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
    wx.setKeepScreenOn({
      keepScreenOn: true,
      success: function (res) {
        baseTool.print([res, '保持屏幕常亮成功'])
      },
      fail: function (res) {
        baseTool.print([res, '保持屏幕常亮失败'])
      },
      complete: function (res) { },
    })
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
    var that = this
    // 删除通知
    baseMessageHandler.removeSpecificInstanceMessageHandler('selectRefresh', this).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
    baseTool.print(that.data.deviceId)

    if (that.data.failTips == false) {
      var buffer = bleCommandManager.closeLightCommand()
      wx.onBLEConnectionStateChange(res => {})
      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: that.data.tailServiceUUID,
        characteristicId: that.data.tailCharacteristicIdWrite,
        value: buffer,
        success: function (res) {
          baseTool.print([res, '成功关灯'])
          wx.closeBLEConnection({
            deviceId: that.data.deviceId,
            complete: function (res) {
              that.data = null
              that = null
             },
          })
        },
        fail: function (res) {
          that.data = null
          that = null
         },
        complete: function (res) { 
        },
      })
    } else {
      wx.closeBLEConnection({
        deviceId: that.data.deviceId,
        success: function (res) { 
        },
        fail: function (res) { 
        },
        complete: function (res) { 
          that.data = null
          that = null
        },
      })
    }

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
  showConnectFail: function() {
    var that = this
    var failTips = that.data.failTips
    baseTool.print(that)
    if (failTips == false && this && that.data.deviceId != '') {
      that.data.failTips = true
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
          baseTool.print(["连接失败", 205])
          wx.navigateBack()
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
  },
  getServices: function () {
    var that = this
    wx.getBLEDeviceServices({
      deviceId: that.data.deviceId,
      success: function (res) {
        baseTool.print(['获得服务成功', baseTool.getCurrentTime()])
        // 获得特征值
        that.data.reServiceCount = 4
        that.getCharacteristics()
      },
      fail: function (res) {
        baseTool.print(res)
        var reServiceCount = that.data.reServiceCount
        if (reServiceCount <= 3 && that != null) {
          // 500ms 以后重连
          that.data.reServiceCount++
          baseTool.print(["重新获得服务", reServiceCount, baseTool.getCurrentTime()])
          setTimeout(function () {
            that.getServices()
          }, 500)
        } else {
          that.showConnectFail()
        }
      },
      complete: function (res) { },
    })
  },
  getCharacteristics: function () {
    var that = this
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.tailServiceUUID,
      success: function (res) {
        baseTool.print(['获得特征值成功', baseTool.getCurrentTime()])
        that.data.reCharacteristic = 4
        that.deviceCharacteristicValueChange(that.data.deviceId)
        that.notifyCharacteristicValueChange()
      },
      fail: function (res) { 
        baseTool.print(res)
        var reCharacteristic = that.data.reCharacteristic
        if (reCharacteristic <= 3 && that != null) {
          // 500ms 以后重连
          that.data.reCharacteristic++
          baseTool.print(["重新获得服务", reCharacteristic, baseTool.getCurrentTime()])
          setTimeout(function () {
            that.getCharacteristics()
          }, 500)
        } else {
          that.showConnectFail()
        }
      },
      complete: function (res) { },
    })
  },
  notifyCharacteristicValueChange: function () {
    var that = this
    wx.notifyBLECharacteristicValueChange({
      deviceId: that.data.deviceId,
      serviceId: that.data.tailServiceUUID,
      characteristicId: that.data.tailCharacteristicIdNotify,
      state: true,
      success: function (res) {
        baseTool.print([res, '预订通知成功成功', baseTool.getCurrentTime()])
      },
      fail: function (res) {
        baseTool.print([res, '预订通知成功成功', baseTool.getCurrentTime()])
        reNotify
        baseTool.print(res)
        var reNotify = that.data.reNotify
        if (reNotify <= 3 && that != null) {
          // 500ms 以后重连
          that.data.reNotify++
          baseTool.print(["重新获得服务", reNotify, baseTool.getCurrentTime()])
          setTimeout(function () {
            that.notifyCharacteristicValueChange()
          }, 500)
        } else {
          that.showConnectFail()
        }
      },
      complete: function (res) { },
    })


  },
  connectDevice: function () {
    var that = this
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function (res) {
        baseTool.print(['连接成功', baseTool.getCurrentTime()])
        // 下一步获得服务
        that.data.reconnectCount = 4
        that.getServices()
      },
      fail: function (res) {
        if (res.errCode == -1) {
          return
        }
        var reconnectCount = that.data.reconnectCount
        baseTool.print([res, '连接失败', reconnectCount, baseTool.getCurrentTime()])
        if (reconnectCount <= 3 && that != null) {
          // 500ms 以后重连
          that.data.reconnectCount++
          baseTool.print(["发起重连", reconnectCount, baseTool.getCurrentTime()])
          setTimeout(function () {
            that.connectDevice()
          }, 500)
        } else {
          that.showConnectFail()
        }
      },
      complete: function (res) { },
    })
  },
  addContestUser: function () {
    var that = this
    wx.navigateTo({
      url: '../addOneContestUser/addOneContestUser?gameId=' + that.data.gameId + '&macAddress=' + that.data.macAddress + '&deviceId=' + that.data.deviceId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  selectClick: function (e) {
    baseTool.print(e)
    var that = this
    var index = e.currentTarget.dataset.id - 1
    var dataList = that.data.dataList
    var isSelect = dataList[index].isSelect
    if (isSelect) {
      return
    } else {
      dataList[index].isSelect = !dataList[index].isSelect
      that.setData({
        dataList: dataList
      })
      wx.showModal({
        title: '提示',
        content: dataList[index].name + ' 在本次比赛中将与设备 ' + that.data.deviceName + ' 绑定',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#999',
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
          baseTool.print(res)

          if (res.cancel) {
            dataList[index].isSelect = !dataList[index].isSelect
            that.setData({
              dataList: dataList
            })
          } else if (res.confirm) {
            that.bindDevice(that.data.dataList[index])
          } else if (!res.cancel && !res.confirm) {
            dataList[index].isSelect = !dataList[index].isSelect
            that.setData({
              dataList: dataList
            })
          }
          // 
        },
        fail: function (res) {
          baseTool.print(res)
        },
        complete: function (res) { baseTool.print(res) },
      })

    }


  },
  bindDevice: function (userInfo) {
    var that = this
    var name = userInfo.name
    var userId = userInfo.playerId
    // macAddress
    wx.showNavigationBarLoading()
    contestManager.bindContestUser(name, that.data.macAddress).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      // 删除这个 Mac 地址下的
      baseMessageHandler.sendMessage('deleteDevice', that.data.macAddress)
      var buffer = null
      if (that.data.brushMethod == 'a002c7680a5f4f8ea0b1b47fa3f2b947') {
        buffer = bleCommandManager.connectReplyDeviceCommand()
      } else {
        buffer = bleCommandManager.connectReplyDeviceCommand('00')
      }
      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: that.data.tailServiceUUID,
        characteristicId: that.data.tailCharacteristicIdWrite,
        value: buffer,
        success: function (res) {
          wx.navigateBack()
        },
        fail: function (res) {
          wx.navigateBack()
        },
        complete: function (res) { },
      })
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading() 
      wx.startPullDownRefresh({
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      wx.showModal({
        title: '提示',
        content: res,
        confirmText: '确定',
        confirmColor: '#00a0e9'
      })
    })
  },
  loadData: function () {
    var that = this
    wx.showNavigationBarLoading()
    contestManager.selectContestUser().then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(typeof (res))
      if (typeof (res) != 'undefined' && res.length > 0) {
        var data = that.data
        data.loadingDone = true
        data.hasData = true
        data.dataList.splice(0, data.dataList.length)

        for (var index = 0; index < res.length; ++index) {
          baseTool.print(["资源", res])
          data.dataList.push({
            name: res[index].name, // 名字
            playerId: res[index].playerId, // 参赛者的 id
            id: index + 1, // 主key
            isSelect: res[index].isBound
          })
        }

        that.setData(data)
      } else {
        var data = that.data
        data.loadingDone = true
        data.hasData = false
        data.dataList.splice(0, data.dataList.length)
        that.setData(data)
      }
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()

      wx.showModal({
        title: '提示',
        content: res,
        confirmText: '确定',
        confirmColor: '#00a0e9',
      })
    })
  },
  deviceConnectionStateChange: function () {
    var that = this
    wx.onBLEConnectionStateChange(function (res) {
      baseTool.print([res, '蓝牙状态改变'])
      if (res.connected == false && that.data.lightSuccess == false && res.deviceId == that.data.deviceId && that.data.reconnectCount >= 3) {
        that.showConnectFail()
      }
    })
  },
  deviceCharacteristicValueChange: function (deviceId = '') {
    var that = this

    wx.onBLECharacteristicValueChange(function (res) {
      var hex = baseHexConvertTool.arrayBufferToHexString(res.value)
      baseTool.print([hex, '通知信息'])
      // 兼容产品
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 查找设备命令
        var buffer = bleCommandManager.findDeviceCommand()
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: that.data.tailServiceUUID,
          characteristicId: that.data.tailCharacteristicIdWrite,
          value: buffer,
          success: function (res) {
            baseTool.print([res, '查找设备命令发送成功'])
          },
          fail: function (res) {
            baseTool.print([res, '设备常亮失败'])
          },
          complete: function (res) { },
        })
      } else if (hex.indexOf('f30c') == 0) {
        baseTool.print([res, '设备常亮'])
        that.data.lightSuccess = true
        wx.hideLoading()
        wx.showToast({
          title: '点亮设备',
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