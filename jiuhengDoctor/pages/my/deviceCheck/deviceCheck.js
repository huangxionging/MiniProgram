// pages/my/deviceCheck/deviceCheck.js
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    checkState: false,
    windowHeight: 0,
    isLight: false,
    sectionDataArray: [{
        deviceCount: 0,
        rowDataArray: []
      },
      {
        deviceCount: 0,
        rowDataArray: []
      }
    ],
    deviceArray: [],
    deviceObjects: {},
    checkedObjects: {},
    lightItemObject: {},
    chekRefresh: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this
    let windowHeight = wx.getSystemInfoSync().windowHeight
    baseTool.print(windowHeight)
    that.setData({
      loadDone: true,
      windowHeight: windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.loadData()
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
      success: function (res) {
        baseTool.print("stopBluetoothDevicesDiscovery: success");
        //close bt. adapter
        wx.closeBluetoothAdapter()
      },
      fail: function (res) {
        wx.closeBluetoothAdapter()
      }
    })
    that.removeCallBack()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    
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
  deviceCheckClick: function() {
    let that = this
    that.setData({
      checkState: true
    })
    bluetoothManager.searchDeviceFlow()
  },
  loadData: function() {
    let that = this
    // 完善诊所信息
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("deviceList", "查询设备列表", {
      clinicId: baseNetLinkTool.getClinicId()
    }).then(res => {
      wx.hideNavigationBarLoading()
      let deviceList = res.deviceList
      if (deviceList == undefined || deviceList.length == 0) {
        let windowHeight = wx.getSystemInfoSync().windowHeight
        that.setData({
          loadDone: true,
          windowHeight: windowHeight
        })
        return
      }
      let hasData = true
      let deviceObjects = that.data.deviceObjects
      let sectionDataArray = that.data.sectionDataArray
      sectionDataArray[0].rowDataArray.length = 0
      let rowDataArray = sectionDataArray[1].rowDataArray
      deviceObjects = {}
      rowDataArray.length = 0
      for (let index = 0; index < deviceList.length; ++index) {
        let itemObject = deviceList[index]
        let brushingMethodId = itemObject.brushingMethodId
        let brushingMethod = 0
        if (brushingMethodId == 'a002c7680a5f4f8ea0b1b47fa3f2b947') {
          brushingMethod = 1
        }
        rowDataArray.push({
          id: index + 1,
          macAddress: itemObject.macAddress,
          deviceName: itemObject.name,
          power: 0,
          imageUrl: "power25",
          deviceNote: itemObject.name ? itemObject.name : '',
          section: 0,
          time: '--',
          brushMethod: brushingMethod
        })
        deviceObjects[deviceList[index].macAddress] = deviceList[index]
      }

      if (deviceList.length > 0) {
        baseNetLinkTool.setIsHaveDevice(true)
      } else {
        baseNetLinkTool.setIsHaveDevice(false)
      }
      sectionDataArray[1].deviceCount = deviceList.length
      that.setData({
        loadDone: true,
        sectionDataArray: sectionDataArray,
        deviceCount: deviceList.length,
        deviceObjects: deviceObjects,
        checkedObjects: {},
        deviceArray: [],
        lightItemObject: {}
      })

      if (that.data.chekRefresh == true){
        that.deviceCheckClick()
        that.data.chekRefresh = false
      }
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  registerCallBack: function() {
    let that = this
    baseMessageHandler.addMessageHandler('bluetoothMessage', that, res => {
      // 连接成功
      switch (res.type) {
        case 0:
          {
            return
            break
          }
        case 1:
          {
            baseTool.print("连接成功")
            // 开始点亮设备 // 发送设备点亮指令
            baseTool.print("连接成功")
            // 开始点亮设备 // 发送设备点亮指令
            that.deviceCharacteristicValueChange(res.deviceId)
            break
          }
        case 2:
          {
            baseTool.print("设备写成功")
            break
          }
        case 3:
          {
            break
          }
        case 4:
          {
            that.foundDevices()
            // that.deviceCharacteristicValueChange()
            break
          }
      }
    })
  },
  removeCallBack: function() {
    // 删除消息
    baseMessageHandler.removeSpecificInstanceMessageHandler('bluetoothMessage', this)
  },
  foundDevices: function() {
    let that = this
    wx.hideLoading()
    wx.hideNavigationBarLoading()
    wx.onBluetoothDeviceFound(function(res) {
      let device = res.devices[0]

      // 不是这个名字的, 丢弃
      if (device.name.indexOf('game') == -1 && device.name.indexOf('32th-dd5414') == -1) {
        return
      }
      // 要符合第11位大于等于2 , 其中符合要求的
      if (device.name.indexOf('32th-dd5414') != -1) {
        let level = parseInt(device.name.substr(11, 1))
        if (level < 2) {
          return
        }
      }
      // 不在名单保存设备列表中了也要丢弃
      let macAddress = device.name.split('-')[1].toUpperCase()
      let deviceObjects = that.data.deviceObjects
      let checkedObjects = that.data.checkedObjects
      if (!deviceObjects[macAddress] || checkedObjects[macAddress]) {
        return
      }
      baseTool.print(deviceObjects)
      let hexArray = new Uint8Array(device.advertisData)
      let power = hexArray[hexArray.byteLength - 1]
      let sectionDataArray = that.data.sectionDataArray
      let rowDataArray = sectionDataArray[0].rowDataArray
      let row = rowDataArray.length
      let deviceItemObject = deviceObjects[macAddress]
      baseTool.print(['发现新设备:', device.name, macAddress, device.RSSI, deviceItemObject])
      let imageUrl = ''
      if (power <= 25) {
        imageUrl = 'power25'
      } else if (power <= 50) {
        imageUrl = 'power50'
      } else if (power <= 75) {
        imageUrl = 'power75'
      } else if (power <= 100) {
        imageUrl = 'power100'
      }
      let currentTime = baseTool.getCurrentTime()
      let brushingMethodId = deviceItemObject.brushingMethodId
      baseTool.print(brushingMethodId)
      let brushingMethod = 0
      if (brushingMethodId == 'a002c7680a5f4f8ea0b1b47fa3f2b947') {
        brushingMethod = 1
      }
      rowDataArray.push({
        id: row + 1,
        time: currentTime,
        macAddress: macAddress,
        power: power,
        deviceId: device.deviceId,
        imageUrl: imageUrl,
        deviceNote: deviceItemObject.name ? deviceItemObject.name : '',
        brushMethod: brushingMethod
      })

      checkedObjects[macAddress] = macAddress
      that.data.checkedObjects = checkedObjects
      sectionDataArray[0].deviceCount = rowDataArray.length;
      let deviceCount = rowDataArray.length

      rowDataArray = sectionDataArray[1].rowDataArray
      for (let rowIndex = rowDataArray.length - 1; rowIndex >= 0; --rowIndex) {
        if (rowDataArray[rowIndex].macAddress == macAddress) {
          rowDataArray.splice(rowIndex, 1)
        }
      }
      sectionDataArray[1].deviceCount = rowDataArray.length
      that.setData({
        sectionDataArray: sectionDataArray,
        hasData: true,
      })
    })
  },
  lightClick: function(e) {
    let that = this
    baseTool.print(e.detail)
    let deviceId = e.detail.deviceId
    let sectionDataArray = that.data.sectionDataArray
    let rowDataArray = sectionDataArray[e.detail.section].rowDataArray
    let rowObject = rowDataArray[e.detail.row]
    that.data.lightItemObject = rowObject
    if (that.data.isLight) {
      return
    }
    that.connectDeviceFlow(deviceId)
  },
  connectDeviceFlow: function(deviceId) {
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
        wx.hideLoading()
        baseTool.showToast("点亮设备")
        // 发起绑定
        that.data.isLight = true
        // that.bindDevice(deviceId)
        let rowObject = that.data.lightItemObject
        baseTool.showAlertInfoWithCallBack({
          showCancel: false,
          content: rowObject.deviceNote + "设备已经点亮",
          confirmText: "好的",
        }, res => {
          bluetoothManager.writeValue(rowObject.deviceId, bleCommandManager.closeLightCommand())
        })
      } else if (hex.indexOf('f303f5') == 0) {
        baseTool.print("关闭设备")
        that.data.isLight = false
        wx.closeBLEConnection({
          deviceId: res.deviceId,
          success: function(res) {},
        })
      }
    })
  },
  chekRefreshClick: function(){
    let that = this
    that.data.chekRefresh = true
    that.setData({
      loadDone: false
    })
    that.loadData()
    wx.closeBluetoothAdapter({
      success: function (res) { },
    }) 
  }
})