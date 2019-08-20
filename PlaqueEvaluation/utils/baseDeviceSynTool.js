const baseTool = require('./baseTool.js')
const baseMessageHandler = require('./baseMessageHandler.js')
const baseHexConvertTool = require('./baseHexConvertTool.js')
const bleCommandManager = require('../manager/bleCommandManager.js')
/**
 * Mac 地址
 */
let desDeviceObject = {}

/**
 * 存储一条数据部分
 */
let dataObject = {}

/**
 * 数据集合列表
 */
let dataItemtList = []

/**
 * 服务 UUID
 */
let serviceUUID = '0000FFA0-0000-1000-8000-00805F9B34FB'
/**
 * 特征值通知
 */
let characteristicIdNotify = '0000FFA2-0000-1000-8000-00805F9B34FB'
/**
 * 特征值写
 */
let characteristicIdWrite = '0000FFA1-0000-1000-8000-00805F9B34FB'

/**
 * 数据定时器
 */
let dataTimer = -1

/**
 * 结束定时器
 */
let endSynTimer = -2

/**
 * 结束标志
 */
let endSynFlag = false


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
    text: "未搜索到该设备"
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
  BleTypeReceiveSuccess: 3,
}


function clearDeviceObject() {
  desDeviceObject = {}
  dataObject = {}
  endSynFlag = false
}

function clearDeviceSyn() {
  clearDeviceObject()
  // 停止发现设备, 然后关闭适配器
  wx.stopBluetoothDevicesDiscovery({
    success: function(res) {
      wx.closeBluetoothAdapter()
    },
    fail: function(res) {
      wx.closeBluetoothAdapter()
    }
  })
}

function clearDeviceData() {
  dataItemtList = []
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
              baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeOpenAdapterSuccess)
              resolve(res)
            },
            fail: function(res) {
              // clearDeviceObject()
              // baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeOpenAdapterFail)
              reject(res)
            }
          })
        }, 500)
      },
      fail: function(res) {
        // baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeCloseAdapterFail)
        reject(res)
      }
    })
  })
}

// function open

function synDeviceWithDeviceObject(deviceObject = {}) {
  if (desDeviceObject && desDeviceObject.macAddress != undefined) {
    baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSyning)
  } else {
    // mac 地址不能为空
    if (!baseTool.isValid(deviceObject.macAddress)) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeMacAddressError)
      return
    }
    desDeviceObject = deviceObject
    reLaunchBluetoothFlow().then(res => {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeReLaunchBluetoothSuccess)
      wx.startBluetoothDevicesDiscovery({
        services: [],
        allowDuplicatesKey: false,
        success: function(res) {
          baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeStartDiscoverySuccess)
          foundDevice()
          deviceCharacteristicValueChange()
        },
        fail: function(res) {
          clearDeviceObject()
          baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeStartDiscoveryFail)
        },
      })
    }).catch(res => {
      clearDeviceObject()
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeReLaunchBluetoothFail)
    })
  }
}

/**
 * 发现设备
 */
function foundDevice() {
  let stopTimer = false
  let timer = setTimeout(function () {
    // 如果 5s 没搜索到, 则超时
    clearTimeout(timer)
    if (stopTimer == true) {
      return
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchTimeOut)
      },
      fail: function(res) {
        baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchTimeOut)
      }
    })
  }, 5000)
  wx.onBluetoothDeviceFound(function(res) {
    let device = res.devices[0]
    if (device.name.indexOf('game') == -1 && device.name.indexOf('32th') == -1) {
      return
    }
    // 要符合第11位大于等于2
    if (device.name.indexOf('32th-dd5414') != -1) {
      let level = parseInt(device.name.substr(11, 1), 16)
      if (level < 2) {
        return
      }
    }
    // 获得 MAC 地址
    let macAddress = device.name.split('-')[1].toUpperCase()
    let desMacAddress = desDeviceObject.macAddress.toUpperCase()
    baseTool.print([macAddress, desMacAddress])
    // 搜索到目标 Mac 地址
    if (macAddress === desMacAddress) {
      // 清除定时器
      stopTimer = true
      clearTimeout(timer)
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSearchSuccess)
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          connectDeviceFlow(device.deviceId)
        },
        fail: function(res) {
          connectDeviceFlow(device.deviceId)
        },
      })
    }
  })
}


/**
 * 连接流程
 */
function connectDeviceFlow(deviceId = '') {
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function(res) {
      // 连接成功
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeConnectedSuccess)
      // 获得服务
      getBLEDeviceServices(deviceId)
    },
    fail: function(res) {
      // 连接失败
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeConnectedFail)
    }
  })
}

function getBLEDeviceServices(deviceId = '') {
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function(res) {
      // 获得设备服务成功
      // res.services
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceServicesSuccess)
      // 获得特征
      getBLEDeviceCharacteristics(deviceId)
    },
    fail: function(res) {
      // 获得设备服务失败
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceServicesFail)
    }
  })
}

function getBLEDeviceCharacteristics(deviceId = '') {
  wx.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: serviceUUID,
    success: function(res) {
      // 获得特征值成功
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceCharacteristicsSuccess)
      // 一个设备的数据集合清空
      // 预定特征峰
      notifyBLECharacteristicValueChange(deviceId)
    },
    fail: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeGetBLEDeviceCharacteristicsFail)
    }
  })
}

function notifyBLECharacteristicValueChange(deviceId = '') {
  wx.notifyBLECharacteristicValueChange({
    deviceId: deviceId,
    serviceId: serviceUUID,
    characteristicId: characteristicIdNotify,
    state: true,
    success: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeNotifySuccess)
    },
    fail: function(res) {
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeNotifyFail)
    }
  })
}

function deviceCharacteristicValueChange () {
    let that = this
    wx.onBLECharacteristicValueChange(function(res) {
      let values = new Uint8Array(res.value)
      let hex = baseHexConvertTool.arrayBufferToHexString(res.value).toLowerCase()
      baseTool.print([hex, '通知信息'])
      // 回复数据
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 再次回复设备
        // 写数据
        writeValue(res.deviceId, bleCommandManager.connectReplyDeviceCommand())
      } else if (hex.indexOf('f30cf5') == 0) {
        baseTool.print([res, '设备常亮'])
      } else if (hex.indexOf('f802') == 0) {

        if (endSynFlag == true) {
          return
        }
        endSynFlag = true
        // 一次数据交互结束
        baseTool.print([res, '交互结束'])
        let buffer = bleCommandManager.onceDataEndReplyDeviceCommand()
        writeValue(res.deviceId, buffer)
        // 同步成功
        // 500 ms 后同步下一个
        clearTimeout(dataTimer)
        let endSynTimer = setTimeout(() => {
          clearTimeout(endSynTimer)
          baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSynSuccess)
        }, 500)
      } else if (hex.indexOf('f4') == 0 || hex.indexOf('f6') == 0) {
        clearTimeout(dataTimer)
        processOnceData(hex, values, res.deviceId)
      } else if (hex.indexOf('f7') == 0 || hex.indexOf('f9') == 0) {
        clearTimeout(dataTimer)
        newProcessOnceData(hex, values, res.deviceId)
      }
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

function processOnceData(hex, values, deviceId = '') {
  // 刷牙数据
  dataObject.dataHead = hex.substring(0, 2)
  //数据处理逻辑
  if (values[2] == 0) {
    dataObject.data01 = hex
    baseTool.print(['data01:', dataObject.data01])
  } else if (values[2] == 1) {
    dataObject.data02 = hex
    baseTool.print(['data02:', dataObject.data02])
  } else if (values[2] == 2) {
    dataObject.data03 = hex
    baseTool.print(['data03:', dataObject.data03])
    //一条完整数据拼接
    let oneCompleteData = dataObject.data01 + dataObject.data02 + dataObject.data03;
    baseTool.print(['oneCompleteData:', oneCompleteData])

    let typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
    baseTool.print([typedArrayOneDate, '一天的数据'])
    let dataItem = bleCommandManager.dataBoxCommand(typedArrayOneDate, desDeviceObject);
    //放入数据集合
    dataItemtList.push(dataItem);
    //一条完整数据回复
    let oneDataWrite = "f103" + dataObject.dataHead;
    let typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
    baseTool.print(['reply', typedArray])
    let oneDataWriteBuffer = typedArray.buffer
    writeValue(deviceId, oneDataWriteBuffer)
    dataObject = {}
  }
}

/**
 * 新处理办法
 */
function newProcessOnceData(hex, values, deviceId = '') {
  //初始化头部信息 回复要带
  dataObject.dataHead = hex.substring(0, 2)
  //数据处理逻辑
  if (values[2] == 0) {
    dataObject.data01 = hex
    baseTool.print(['data01:', dataObject.data01])
  } else if (values[2] == 1) {
    dataObject.data02 = hex
    baseTool.print(['data02:', dataObject.data02])

  } else if (values[2] == 2) {
    dataObject.data03 = hex
    baseTool.print(['data03:', dataObject.data03])

  } else if (values[2] == 3) {
    dataObject.data04 = hex
    baseTool.print(['data04:', dataObject.data04])
    //一条完整数据拼接
    let oneCompleteData = dataObject.data01 + dataObject.data02 + dataObject.data03 + dataObject.data04;
    baseTool.print(['oneCompleteData:', oneCompleteData])

    let typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
    baseTool.print([typedArrayOneDate, '一天的数据'])
    let dataItem = bleCommandManager.dataBoxCommand(typedArrayOneDate, desDeviceObject);
    //放入数据集合
    dataItemtList.push(dataItem);
    //一条完整数据回复
    let oneDataWrite = "f103" + dataObject.dataHead;
    // 回复数据
    let typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
    let oneDataWriteBuffer = typedArray.buffer
    writeValue(deviceId, oneDataWriteBuffer)
    // 清空 dataObject
    dataObject = {}

    dataTimer = setTimeout(() => {
      // 关闭两个定时器
      clearTimeout(dataTimer)
      clearTimeout(endSynTimer)
      baseMessageHandler.sendMessage('deviceSynMessage', deviceSynMessageType.DeviceSynTypeSynSuccess)
    }, 1000)
  }
}

function getDataItemList() {
  return dataItemtList
}

module.exports = {
  reLaunchBluetoothFlow: reLaunchBluetoothFlow,
  connectDeviceFlow: connectDeviceFlow,
  writeValue: writeValue,
  synDeviceWithDeviceObject: synDeviceWithDeviceObject,
  clearDeviceSyn: clearDeviceSyn,
  getDataItemList: getDataItemList,
  clearDeviceData: clearDeviceData,
}