// pages/contest/addContestDevice/addContestDevice.js
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    arrowDirection: true,
    deviceCount: 0,
    hasData: false,
    existDeviceObject: {},
    currentDeviceObject: {},
    sectionDataArray: [{
      rowDataArray: []
    }],
    isStopDiscovery: false,
    currentDevice: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.registerCallBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        baseTool.print("stopBluetoothDevicesDiscovery: success");
        //close bt. adapter
        wx.closeBluetoothAdapter()
      },
      fail: function(res) {
        wx.closeBluetoothAdapter()
      }
    })
    that.removeCallBack()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    baseTool.print(that.data.existDeviceObject)
    let currentDeviceObject = Object.assign({}, that.data.existDeviceObject)
    baseTool.print([currentDeviceObject, that.data.existDeviceObject])
    that.setData({
      deviceCount: 0,
      hasData: false,
      sectionDataArray: [{
        rowDataArray: []
      }],
      currentDeviceObject: currentDeviceObject,
      currentDevice: {},
      isStopDiscovery: false
    })
    // 停止发现设备
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        baseTool.print("stopBluetoothDevicesDiscovery: success");
        //close bt. adapter
        wx.closeBluetoothAdapter({
          success: function(res) {
            baseTool.print("closeBluetoothAdapter: success");
            that.openBle()
          },
          fail: function(res) {
            that.openBle()
          }
        })
      },
      fail: function(res) {
        that.openBle()
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  registerCallBack: function() {
    let that = this
    baseMessageHandler.getMessage('addContestDevice', res => {
      baseTool.print(res)
      let currentDeviceObject = Object.assign({}, res.deviceObject)
      that.setData({
        existDeviceObject: res.deviceObject,
        currentDeviceObject: currentDeviceObject
      })
    })

    baseMessageHandler.addMessageHandler('bluetoothMessage', that, res => {
      // 连接成功

      switch(res.type) {
        case 0: {
          return
          break
        }
        case 1: {
          baseTool.print("连接成功")
          // 开始点亮设备 // 发送设备点亮指令
          that.deviceCharacteristicValueChange(res.deviceId)
          
          break
        }
        case 2: {
          baseTool.print("设备写成功")
          break
        }
      }
    })
  },
  removeCallBack: function() {
    // 删除消息
    baseMessageHandler.removeMessage('addContestDevice')
    baseMessageHandler.removeSpecificInstanceMessageHandler('bluetoothMessage', this)
  },
  arrowClick: function() {
    let that = this;
    let arrowDirection = !that.data.arrowDirection
    that.setData({
      arrowDirection: arrowDirection
    })
  },
  openBle() {
    // 打开蓝牙
    let that = this
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在搜索设备',
      mask: true,
    })
    // 等待 3s
    let timer = setTimeout(function() {
      // 打开蓝牙
      clearTimeout(timer)
      wx.openBluetoothAdapter({
        success: function(res) {
          baseTool.print("openBluetoothAdapter: success");
          baseTool.print(res);
          // 发现设备
          //start discovery devices
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          wx.startBluetoothDevicesDiscovery({
            services: [],
            success: function(res) {
              baseTool.print("startBluetoothDevicesDiscovery: success");
              baseTool.print(res);

              //Listen to find new equipment
              that.onBluetoothDeviceFound()

            },
            fail: function(res) {
              baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
            }
          })
        },
        fail: function(res) {
          baseTool.print("openBluetoothAdapter: fail");
          wx.hideLoading()
          wx.hideNavigationBarLoading()
          wx.stopPullDownRefresh()
          baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
        },
      })
    }, 3000)
  },
  onBluetoothDeviceFound: function() {
    let that = this
    wx.onBluetoothDeviceFound(function(res) {
      let device = res.devices[0]

      // 不是这个名字的, 丢弃
      if (device.name.indexOf('game') == -1 && device.name.indexOf('32th') == -1  && !that.data.isStopDiscovery) {
        return
      }
      // 要符合第11位大于等于2 , 其中符合要求的
      if (device.name.indexOf('32th-dd5414') != -1) {
        let level = parseInt(device.name.substr(11, 1))
        if (level < 2) {
          return
        }
      }
      // 在已保存设备列表中了也要丢弃
      let macAddress = device.name.split('-')[1].toUpperCase()
      let currentDeviceObject = that.data.currentDeviceObject
      if (currentDeviceObject[macAddress]) {
        return
      }
      currentDeviceObject[macAddress] = macAddress

      baseTool.print(['发现新设备', device.name, device, device.RSSI])
      let sectionDataArray = that.data.sectionDataArray
      baseTool.print(sectionDataArray)
      let rowDataArray = sectionDataArray[0].rowDataArray
      let row = rowDataArray.length

      rowDataArray.push({
        detail: "点亮设备",
        id: row + 1,
        macAddress: macAddress,
        deviceName: device.name,
        deviceId: device.deviceId,
        rssi: device.RSSI,
        section: 0,
      })
      rowDataArray.sort((a, b) => {
        return b.rssi - a.rssi
      })

      let deviceCount = rowDataArray.length
      that.setData({
        sectionDataArray: sectionDataArray,
        hasData: true,
        currentDeviceObject: currentDeviceObject,
        deviceCount: deviceCount
      })
    })
  },
  lightDeviceClick: function(e) {
    let that = this
    let currentDevice = that.data.sectionDataArray[e.detail.section].rowDataArray[e.detail.row]
    that.setData({
      currentDevice: currentDevice
    })
    if (that.data.isStopDiscovery == false) {
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          baseTool.print("stopBluetoothDevicesDiscovery: success");
          that.connectDeviceFlow(e.detail.deviceId)
          that.setData({
            isStopDiscovery: true,
          })
        },
        fail: function(res) {
          that.connectDeviceFlow(e.detail.deviceId)
        }
      })
    } else {
      that.connectDeviceFlow(e.detail.deviceId)
    }
  },
  connectDeviceFlow: function(deviceId) {
    wx.showLoading({
      title: '点亮设备中...',
    })
    bluetoothManager.connectDeviceFlow(deviceId)
  },
  deviceCharacteristicValueChange: function(deviceId = '') {
    let that = this

    wx.onBLECharacteristicValueChange(function(res) {
      let hex = baseHexConvertTool.arrayBufferToHexString(res.value)
      baseTool.print([hex, '通知信息'])
      // 兼容产品
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 查找设备命令
        // 获得版本号
        let version = baseTool.hexAsciiToString(hex.substr(10, 16))
        // 判断是不是比赛尾巴
        baseTool.print([version, '版本号', hex.substr(10, 16)]);
      
        if (version >= 'V122.2.7') {
          bluetoothManager.writeValue(deviceId, bleCommandManager.findDeviceCommand())
        } else {
          that.data.needUpdateFirmware = true
          // 断开连接
          wx.closeBLEConnection({
            deviceId: deviceId,
            success: function(res) {},
          })
          wx.hideLoading()
          baseTool.showInfo("请更新设备固件")
        }
      } else if (hex.indexOf('f30c') == 0) {
        baseTool.print([res, '设备常亮'])
        that.data.lightSuccess = true
        wx.hideLoading()
        baseTool.showToast("点亮设备")
        // 发起绑定
        // that.bindDevice(deviceId)
        baseTool.showAlertInfoWithCallBack({
          showCancel: true,
          content: "设备("+ that.data.currentDevice.deviceName + ")已经点亮, 是否需要绑定设备?",
          confirmText: "绑定",
          cancelText: "取消"
        }, res => {
          if (res.type) {
            that.bindDevice()
          } else {
            // 关闭点亮的设备
            bluetoothManager.writeValue(that.data.currentDevice.deviceId, bleCommandManager.closeLightCommand())
          }
        })
      } else if (hex.indexOf('f303f5') == 0) {
        baseTool.print("关闭设备")
      }
    })
  },
  bindDevice: function() {
    let that = this
    let macAddress = that.data.currentDevice.macAddress
    let deviceName = that.data.currentDevice.deviceName
    let clinicId = baseNetLinkTool.getClinicId()
    let brushingMethodId = "a002c7680a5f4f8ea0b1b47fa3f2b947"
    if (macAddress.indexOf("DD5415") == 0) {
      brushingMethodId = "6827c45622b141ef869c955e0c51f9f8"
    }
    wx.showLoading({
      title: '绑定设备中...',
      mask: true
    })
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("addDevice", "绑定设备", {
      macAddress: macAddress,
      deviceName: deviceName,
      clinicId: clinicId,
      brushingMethodId: brushingMethodId
    }).then(res => {
      baseTool.print(["绑定设备:", res])
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      bluetoothManager.writeValue(that.data.currentDevice.deviceId, bleCommandManager.closeLightCommand())

      baseTool.showInfo("请给\"" + that.data.currentDevice.deviceName + "\"标记为" + res.name + "设备")
      baseMessageHandler.sendMessage("refresh", "刷新")
      let sectionDataArray = that.data.sectionDataArray
      let rowDataArray = sectionDataArray[0].rowDataArray
      let currentDevice = that.data.currentDevice
      let existDeviceObject = that.data.existDeviceObject
      let currentDeviceObject = that.data.currentDeviceObject

      currentDeviceObject[currentDevice.macAddress] = currentDevice.macAddress
      existDeviceObject[currentDevice.macAddress] = currentDevice.macAddress
      rowDataArray.splice(currentDevice.row, 1)
      currentDevice = {}

      let deviceCount = rowDataArray.length
      let hasData = true
      if (deviceCount.length == 0) {
        hasData = false
      }
      that.setData({
        sectionDataArray: sectionDataArray,
        hasData: hasData,
        currentDeviceObject: currentDeviceObject,
        existDeviceObject: existDeviceObject,
        deviceCount: deviceCount,
        currentDevice: currentDevice
      })

    }).catch(res => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      bluetoothManager.writeValue(that.data.currentDevice.deviceId, bleCommandManager.closeLightCommand())
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})