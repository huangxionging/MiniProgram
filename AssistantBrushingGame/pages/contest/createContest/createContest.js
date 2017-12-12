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
    bindedDevices: {},
    systemInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)

    that.setData({
      gameId: options.gameId,
      name: options.name
    })
    
    if (options.add == 'yes') {
      baseMessageHandler.getMessage('createContest', res => {
        baseTool.print(['设备列表', res])
        // 获取到设备列表
        that.openBle()
        that.setData({
          bindedDevices: res
        })
      }).then(res => {
        baseTool.print(res)
      }).catch(res => {
        baseTool.print(res)
      })
    } else {
      that.openBle()
    }
    // 获取消息
    
    baseMessageHandler.addMessageHandler('deleteDevice', that, res => {
      var that = this
      // 搜索 macAddress
      var bindedDevices = that.data.bindedDevices
      
      var dataList = that.data.dataList.filter((value, index, arry) => {

        if (value.macAddress === res.toUpperCase()) {
          bindedDevices[res] = value
        }
        return value.macAddress != res.toUpperCase()
      })
      baseTool.print(dataList)
      var index = dataList.length
      that.setData({
        dataList: dataList,
        total: '比赛设备' + (index) + '支',
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

    // 停止搜索
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        baseTool.print("stopBluetoothDevicesDiscovery: success");
      },
    })

    // 关闭适配器释放资源
    wx.closeBluetoothAdapter({
      success: function (res) {
        baseTool.print("closeBluetoothAdapter: success");
      },
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function (res) {
    baseTool.print('下拉刷新')
    var that = this
    that.setData({
      dataList: [],
      total: '比赛设备' + (0) + '支',
    })

    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("stopBluetoothDevicesDiscovery: success");
        //close bt. adapter
        wx.closeBluetoothAdapter({
          success: function (res) {
            console.log("closeBluetoothAdapter: success");
            that.openBle()
          },
          fail: function (res) {
            that.openBle()
          }
        })
      },
      fail: function (res) {
        that.openBle()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
 
  getInputName: function(e) {
    baseTool.print(e)
    if (e.detail.value == '') {
      wx.showModal({
        title: '提示',
        content: '比赛名称不能为空哦!',
        showCancel: false,
        cancelColor: '确认',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
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
  },
  openBle: function () {
    var that = this
    // 打开蓝牙
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在搜索设备',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

    setTimeout(function() {
      wx.openBluetoothAdapter({
        success: function (res) {
          baseTool.print("openBluetoothAdapter: success");
          baseTool.print(res);
          //start discovery devices
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          wx.startBluetoothDevicesDiscovery({
            services: [],
            success: function (res) {
              baseTool.print("startBluetoothDevicesDiscovery: success");
              baseTool.print(res);
              //Listen to find new equipment
              var bindedDevices = that.data.bindedDevices
              wx.onBluetoothDeviceFound(function (res) {
                var device = res.devices[0]
                if (device.name.indexOf('game') == -1) {
                  return
                }
                var dataList = that.data.dataList
                var index = dataList.length
                var macAddress = device.name.split('-')[1].toUpperCase()
                

                // 已经绑定过, 需要过滤掉
                if (bindedDevices[macAddress]) {
                  return 
                }
                baseTool.print(['发现新设备', macAddress, device, device.RSSI])
                var hexArray = new Uint8Array(device.advertisData)
                var power = hexArray[hexArray.byteLength - 1]
                var imageUrl = ''
                if (power <= 25) {
                  imageUrl = 'power25'
                } else if (power <= 50) {
                  imageUrl = 'power50'
                } else if (power <= 75) {
                  imageUrl = 'power75'
                } else if (power <= 100) {
                  imageUrl = 'power100'
                }

                // 广播数据先不弄
                dataList.push({
                  id: dataList.length + 1,
                  name: device.name,
                  macAddress: macAddress,
                  deviceId: device.deviceId,
                  power: power,
                  imageUrl: imageUrl,
                  rssi: device.RSSI
                })
                dataList.sort((a, b) => {
                  return b.rssi - a.rssi
                })
                dataList.s
                that.setData({
                  dataList: dataList,
                  total: '比赛设备' + (index + 1) + '支',
                })
              })

            },
            fail: function(res) {
              baseTool.print([res, '开始发现失败'])
            }
          })
        },
        fail: function (res) {
          baseTool.print("openBluetoothAdapter: fail");
          baseTool.print(res);
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          wx.showModal({
            title: '提示',
            content: '蓝牙打开失败, 请检查蓝牙和GPS状态后再使用',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#00a0e9',
            success: function (res) {
              wx.navigateBack()
            },
            fail: function (res) { baseTool.print(res) },
            complete: function (res) { },
          })
        },
      })
    }, 3000)
  },
  foundDevices: function () {
    var that = this
    var bindedDevices = that.data.bindedDevices
    bluetoothManager.foundDevice(res => {
      // console.log('new device list has founded');
      // console.log(res);
      if (res.name.indexOf('game') == -1) {
        return
      }

      var dataList = that.data.dataList
      var index = dataList.length
      var macAddress = res.name.split('-')[1].toUpperCase()
      baseTool.print(['发现新设备', macAddress, res])

      // 已经绑定过, 需要过滤掉
      if (bindedDevices[macAddress]) {
        // return
      }
      // 广播数据先不弄
      dataList.push({
        id: dataList.length + 1,
        name: res.name,
        macAddress: macAddress,
        deviceId: res.deviceId,
      })
      that.setData({
        dataList: dataList,
        total: '比赛设备' + (index + 1) + '支',
      })
    })
  },
})