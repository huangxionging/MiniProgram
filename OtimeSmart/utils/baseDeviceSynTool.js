const baseTool = require('./baseTool.js')
const baseMessageHandler = require('./baseMessageHandler.js')
const baseHexConvertTool = require('./baseHexConvertTool.js')
const bleCommandManager = require('../manager/bleCommandManager.js')


/**
 * 服务 UUID
 */
let serviceUUID = "000018D0-0000-1000-8000-00805F9B34FB"
/**
 * 特征值通知
 */
let characteristicIdNotify = "00002D00-0000-1000-8000-00805F9B34FB"
/**
 * 特征值写
 */
let characteristicIdWrite = "00002D01-0000-1000-8000-00805F9B34FB"

let DeviceConnectedState = {
  DeviceNoDevice: {
    code: 1001,
    name: "DeviceNoDevice",
    text: "无设备"
  },
  DeviceConnected: {
    code: 1002,
    name: "DeviceConnected",
    text: "设备已连接"
  },
  DeviceDisconnected: {
    code: 1003,
    name: "DeviceDisconnected",
    text: "断开连接"
  },
  DeviceConnecting: {
    code: 1004,
    name: "DeviceConnecting",
    text: "设备正在连接"
  },
  DeviceDisconnecting: {
    code: 1005,
    name: "DeviceDisconnecting",
    text: "正在断开连接"
  },
  DeviceNeverConnected: {
    code: 1006,
    name: "DeviceNeverConnected",
    text: "设备未连接"
  }
}

/**
 * Mac 地址
 */
let deviceObject = {
  macAddress: '',
  deviceId: '',
  deviceName: '',
  deviceAlias: '',
  connectedState: DeviceConnectedState.DeviceNoDevice
}

let callBackObject = {}

/**
 * 消息类型
 */
let deviceSynMessageType = {
  DeviceSynTypeSynSuccess: {
    code: 1000,
    name: "DeviceSynTypeSynSuccess",
    text: "同步成功"
  }, // 同步成功
  DeviceSynTypeReLaunchBluetoothSuccess: {
    code: 1001,
    name: "DeviceSynTypeReLaunchBluetoothSuccess",
    text: "重启蓝牙成功"
  }, // 重启蓝牙成功
  DeviceSynTypeCloseAdapterSuccess: {
    code: 1002,
    name: "DeviceSynTypeCloseAdapterSuccess",
    text: "关闭适配器成功"
  }, // 关闭适配器成功
  DeviceSynTypeOpenAdapterSuccess: {
    code: 1003,
    name: "DeviceSynTypeOpenAdapterSuccess",
    text: "打开适配器成功"
  }, // 打开适配器成功
  DeviceSynTypeConnectedSuccess: {
    code: 1004,
    name: "DeviceSynTypeConnectedSuccess",
    text: "蓝牙连接成功"
  }, // 蓝牙连接成功
  DeviceSynTypeSearchSuccess: {
    code: 1005,
    name: "DeviceSynTypeSearchSuccess",
    text: "搜索成功"
  }, // 搜索成功
  DeviceSynTypeGetBLEDeviceServicesSuccess: {
    code: 1006,
    name: "DeviceSynTypeGetBLEDeviceServicesSuccess",
    text: "获得设备服务成功"
  }, // 获得设备服务成功
  DeviceSynTypeStartDiscoverySuccess: {
    code: 1007,
    name: "DeviceSynTypeStartDiscoverySuccess",
    text: "打开发现服务成功"
  }, // 发现成功
  DeviceSynTypeGetBLEDeviceCharacteristicsSuccess: {
    code: 1008,
    name: "DeviceSynTypeGetBLEDeviceCharacteristicsSuccess",
    text: "获得特征值成功"
  }, // 获得特征值成功
  DeviceSynTypeNotifySuccess: {
    code: 1009,
    name: "DeviceSynTypeNotifySuccess",
    text: "预定特征值成功"
  },
  DeviceSynTypeWriteSuccess: {
    code: 1010,
    name: "DeviceSynTypeWriteSuccess",
    text: "写成功"
  },
  DeviceSynTypeFoundDeviceSuccess: {
    code: 1011,
    name: "DeviceSynTypeFoundDeviceSuccess",
    text: "发现设备"
  },
  DeviceSynTypeSynFail: {
    code: 2000,
    name: "DeviceSynTypeSynFail",
    text: "同步失败"
  }, // 同步失败
  DeviceSynTypeReLaunchBluetoothFail: {
    code: 2001,
    name: "DeviceSynTypeReLaunchBluetoothFail",
    text: "重启蓝牙失败"
  }, // 重启蓝牙失败
  DeviceSynTypeCloseAdapterFail: {
    code: 2002,
    name: "DeviceSynTypeCloseAdapterFail",
    text: "关闭适配器失败"
  },
  DeviceSynTypeOpenAdapterFail: {
    code: 2003,
    name: "DeviceSynTypeOpenAdapterFail",
    text: "打开适配器失败"
  }, // 打开适配器失败
  DeviceSynTypeConnectedFail: {
    code: 2004,
    name: "DeviceSynTypeConnectedFail",
    text: "蓝牙连接失败"
  }, // 蓝牙连接失败
  DeviceSynTypeSyning: {
    code: 2005,
    name: "DeviceSynTypeSyning",
    text: "同步中"
  }, // 同步中
  DeviceSynTypeSearchTimeOut: {
    code: 2006,
    name: "DeviceSynTypeSearchTimeOut",
    text: "绑定超时"
  }, // 搜索超时
  DeviceSynTypeGetBLEDeviceServicesFail: {
    code: 2007,
    name: "DeviceSynTypeGetBLEDeviceServicesFail",
    text: "获得设备服务失败"
  }, // 获得设备服务失败
  DeviceSynTypeStartDiscoveryFail: {
    code: 2008,
    name: "DeviceSynTypeStartDiscoveryFail",
    text: "打开发现服务失败"
  }, // 发现失败
  DeviceSynTypeGetBLEDeviceCharacteristicsFail: {
    code: 2009,
    name: "DeviceSynTypeGetBLEDeviceCharacteristicsFail",
    text: "获得特征值失败"
  }, // 获得特征值失败
  DeviceSynTypeNotifyFail: {
    code: 2010,
    name: "DeviceSynTypeNotifyFail",
    text: "预定特征值失败"
  },
  DeviceSynTypeWriteFail: {
    code: 2011,
    name: "DeviceSynTypeWriteFail",
    text: "写失败"
  },
  DeviceSynTypeMacAddressError: {
    code: 2012,
    name: "DeviceSynTypeMacAddressError",
    text: "mac 地址错误"
  },
}

function clearDeviceObject() {
  wx.closeBLEConnection({
    deviceId: deviceObject.deviceId,
  })
  deviceObject = {
    macAddress: '',
    deviceId: '',
    deviceName: '',
    connectedState: DeviceConnectedState.DeviceNoDevice
  }
  baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
}

/**
 * 重启蓝牙流程
 */
function reLaunchBluetoothFlow() {
  return new Promise((resolve, reject) => {
    wx.closeBluetoothAdapter({
      success: function(res) {
        baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeCloseAdapterSuccess)
        let timer = setTimeout(() => {
          clearTimeout(timer)
          wx.openBluetoothAdapter({
            success: function(res) {
              resolve(res)
            },
            fail: function(res) {
              reject(res)
            }
          })
        }, 500)
      },
      fail: function(res) {
        reject(res)
      }
    })
  })
}

/**
 * 开始发现设备
 */
function openBluetoothFlow() {
  let serviceUUIDs = ["00001812-0000-1000-8000-00805F9B34FB"]
  wx.startBluetoothDevicesDiscovery({
    services: serviceUUIDs,
    allowDuplicatesKey: false,
    success: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeStartDiscoverySuccess)
      wx.onBluetoothDeviceFound(function(res) {
        let device = res.devices[0]
        baseTool.print(res)
        let advertisData = baseHexConvertTool.arrayBufferToHexString(device.advertisData).toUpperCase()
        if (advertisData.length < 10) {
          return;
        }
        let macAddress = advertisData.substr(0, 2) + ':' + advertisData.substr(2, 2) + ':' + advertisData.substr(4, 2) + ':' + advertisData.substr(6, 2) + ':' + advertisData.substr(8, 2) + ':' + advertisData.substr(10, 2)
        let object = Object.assign({
          deviceName: device.name,
          rssi: device.RSSI,
          deviceId: device.deviceId,
          localName: device.localName,
          advertisData: advertisData,
          advertisServiceUUIDs: device.advertisServiceUUIDs,
          serviceData: device.serviceData,
          macAddress: macAddress.toUpperCase(),
          code: deviceSynMessageType.DeviceSynTypeFoundDeviceSuccess.code,
          text: deviceSynMessageType.DeviceSynTypeFoundDeviceSuccess.text,
          name: deviceSynMessageType.DeviceSynTypeFoundDeviceSuccess.name
        })
        baseTool.print(object)
        baseMessageHandler.sendMessage('deviceSynMessage', object)
      })
    },
    fail: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeStartDiscoveryFail)
    },
  })
}

/**
 * 连接流程
 */
function connectDeviceFlow(deviceInfo = {}) {

  if (!deviceInfo.macAddress || !deviceInfo.deviceId)  {
    deviceObject.connectedState = DeviceConnectedState.DeviceNoDevice
    baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
    return
  }
  deviceObject.macAddress = deviceInfo.macAddress
  deviceObject.deviceAlias = deviceInfo.deviceAlias
  deviceObject.deviceId = deviceInfo.deviceId
  deviceObject.deviceName = deviceInfo.deviceName
  let deviceId = deviceObject.deviceId
  baseTool.print(["连接设备", deviceId])
  // 正在连接
  deviceObject.connectedState = DeviceConnectedState.DeviceConnecting
  let stopTimer = false
  let timer = setTimeout(function () {
    // 如果 5s 没搜索到, 则超时
    clearTimeout(timer)
    if (stopTimer == true) {
      return
    }
    deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
    baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
    baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchTimeOut)
  }, 5000)
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function(res) {
      // 连接成功
      baseTool.print("连接成功")
      baseTool.print(res)
      clearTimeout(timer)
      stopTimer = true
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeConnectedSuccess)
      // 获得服务
      getBLEDeviceServices(deviceId)
    },
    fail: function(res) {
      // 连接失败
      baseTool.print("连接失败")
      clearTimeout(timer)
      stopTimer = true
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeConnectedFail)
      deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
      baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
    }
  })
  deviceConnectionStateChange()
}

function getBLEDeviceServices(deviceId = '') {
  baseTool.print("获得服务")
  let stopTimer = false
  let timer = setTimeout(function () {
    // 如果 5s 没搜索到, 则超时
    clearTimeout(timer)
    if (stopTimer == true) {
      return
    }
    deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
    baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
    baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchTimeOut)
  }, 5000)
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function(res) {
      // 获得设备服务成功
      // res.services
      baseTool.print("获得服务成功")
      baseTool.print(res.services)
      clearTimeout(timer)
      stopTimer = true
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceServicesSuccess)
      // 获得特征
      getBLEDeviceCharacteristics(deviceId)
    },
    fail: function(res) {
      // 获得设备服务失败
      baseTool.print("获得服务失败")
      clearTimeout(timer)
      stopTimer = true
      deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
      baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceServicesFail)
    }
  })
}

function getBLEDeviceCharacteristics(deviceId = '') {
  baseTool.print("获取特征值")
  let stopTimer = false
  let timer = setTimeout(function () {
    // 如果 5s 没搜索到, 则超时
    clearTimeout(timer)
    if (stopTimer == true) {
      return
    }
    deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
    baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
    baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchTimeOut)
  }, 5000)
  wx.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: serviceUUID,
    success: function(res) {
      // 获得特征值成功
      baseTool.print("获取特征值成功")
      baseTool.print(res.characteristics)
      clearTimeout(timer)
      stopTimer = true
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceCharacteristicsSuccess)
      // 一个设备的数据集合清空
      // 预定特征峰
      notifyBLECharacteristicValueChange(deviceId)
    },
    fail: function(res) {
      baseTool.print("获取特征值失败")
      clearTimeout(timer)
      stopTimer = true
      deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
      baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceCharacteristicsFail)
    }
  })
}

function notifyBLECharacteristicValueChange(deviceId = '') {
  let stopTimer = false
  let timer = setTimeout(function () {
    // 如果 5s 没搜索到, 则超时
    clearTimeout(timer)
    if (stopTimer == true) {
      return
    }
    deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
    baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
    baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchTimeOut)
  }, 5000)
  wx.notifyBLECharacteristicValueChange({
    deviceId: deviceId,
    serviceId: serviceUUID,
    characteristicId: characteristicIdNotify,
    state: true,
    success: function(res) {
      clearTimeout(timer)
      stopTimer = true
      deviceCharacteristicValueChange()
      deviceObject.connectedState = DeviceConnectedState.DeviceConnected
      baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeNotifySuccess)
    },
    fail: function(res) {
      clearTimeout(timer)
      stopTimer = true
      deviceObject.connectedState = DeviceConnectedState.DeviceNeverConnected
      baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeNotifyFail)
    }
  })
}

function deviceCharacteristicValueChange() {
  let that = this
  wx.onBLECharacteristicValueChange(function(res) {
    let values = new Uint8Array(res.value)
    let hex = baseHexConvertTool.arrayBufferToHexString(res.value).toLowerCase()
    let key = hex.substr(4, 2)
    baseTool.print([hex, key, '通知信息'])
    let callBack = callBackObject[key]
    if (callBack != undefined) {
      callBack(hex)
    }
  })
  
}

function deviceConnectionStateChange (){
  wx.onBLEConnectionStateChange(function(res){
    if (res.connected == true) {
      deviceObject.connectedState = DeviceConnectedState.DeviceConnected
    } else {
      if (deviceObject.connectedState.code == DeviceConnectedState.DeviceNoDevice.code) {
        return
      } else {
        deviceObject.connectedState.code = DeviceConnectedState.DeviceDisconnected
      }
    }
    baseMessageHandler.sendMessage('deviceConnectedState', deviceObject)
  })
}

function bluetoothAdapterStateChange() {
  wx.onBluetoothAdapterStateChange(function (res) {

  })
}

/**
 * 写数据
 */
function writeValue(deviceId = '', value = []) {
  wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: serviceUUID,
    characteristicId: characteristicIdWrite,
    value: value,
    success: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeWriteSuccess)
    },
    fail: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeWriteFail)
    }
  })
}

function stopBluetoothDiscoveryFlow() {
  wx.stopBluetoothDevicesDiscovery({
    success: function(res) {},
    fail: function(res) {},
    complete: function(res) {},
  })
}

function getDeviceConnectedState() {
  return deviceObject.connectedState
}

function registerCallBackForKey(callBack = Function, key = '') {
  if (key == '' || callBackObject[key] != undefined) {
    return
  }
  callBackObject[key] = callBack
}

function removeCallBackForKey(key = '') {
  if (key == '') {
    return
  }
  delete callBackObject[key]
}

function removeAllCallBack() {
  let keys = Object.keys(callBackObject)
  for(let index = 0; index < keys.length; ++index) {
    delete callBackObject[keys[index]]
  }
}

/**
 * 查找设备
 */
function commandDindDevice() {
  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer("0xCB0429")
  writeValue(deviceObject.deviceId, commandBuffer)
  return "29"
}

/**
 * 同步时间
 */
function commandSettingTime() {
  let date = new Date()
  const year = date.getFullYear() - 2000
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  let hex = "0xCB0B2401" + baseHexConvertTool.arrayToHexString([year, month, day, hour, minute, second])

  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer(hex)
  writeValue(deviceObject.deviceId, commandBuffer)
  baseTool.print(hex)
  return "24"
}

/**
 * 设备电量
 */
function commandDevicePower() {
  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer("0xCB0423")
  writeValue(deviceObject.deviceId, commandBuffer)
  return "23"
}

/**
 * 获得个人信息
 */
function commandUserInfo() {
  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer("0xCB052600")
  writeValue(deviceObject.deviceId, commandBuffer)
  return "26"
}

function commandSettingUserInfo(userInfo) {
  let sex = userInfo.sex
  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer("0xCB092601" + hexString)
}


/**
 * 同步总步数
 */
function commandSynDeviceTotalStepData(dayNumber = 0) {
  let hexString = "0xCB05320" + dayNumber
  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer(hexString)
  writeValue(deviceObject.deviceId, commandBuffer)
  return "32"
}

function commandSynDeviceDetailStepData(dayNumber = 0){
  let hexString = "0xCB05330" + dayNumber
  let commandBuffer = baseHexConvertTool.hexStringToCommandBuffer(hexString)
  writeValue(deviceObject.deviceId, commandBuffer)
  return "33"
}



module.exports = {
  deviceSynMessageType: deviceSynMessageType,
  reLaunchBluetoothFlow: reLaunchBluetoothFlow,
  openBluetoothFlow: openBluetoothFlow,
  connectDeviceFlow: connectDeviceFlow,
  writeValue: writeValue,
  stopBluetoothDiscoveryFlow: stopBluetoothDiscoveryFlow,
  getDeviceConnectedState: getDeviceConnectedState,
  registerCallBackForKey: registerCallBackForKey,
  removeCallBackForKey: removeCallBackForKey,
  commandDevicePower: commandDevicePower,
  commandDindDevice: commandDindDevice,
  commandSettingTime: commandSettingTime,
  commandSynDeviceTotalStepData: commandSynDeviceTotalStepData,
  commandSynDeviceDetailStepData: commandSynDeviceDetailStepData,
  commandUserInfo: commandUserInfo,
  removeAllCallBack: removeAllCallBack,
  clearDeviceObject: clearDeviceObject
}