const baseTool = require('../utils/baseTool.js')
const baseMessageHandler = require('../utils/baseMessageHandler.js')
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

let bluetoothMessageType = {
  BleTypeFail: 0,
  BleTypeNotifySuccess: 1,
  BleTypeWriteSuccess: 2,
  BleTypeReceiveSuccess: 3,
  BleTypeStartDiscoverySuccess: 4
}

/**
 * 连接流程
 */
function connectDeviceFlow(deviceId = '') {
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function(res) {
      getBLEDeviceServices(deviceId)
    },
    fail: function(res) {
      baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeFail,
        deviceId: deviceId
      })
    }
  })
}

function getBLEDeviceServices(deviceId = '') {
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function(res) {
      getBLEDeviceCharacteristics(deviceId)
    },
    fail: function(res) {
      baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeFail,
        deviceId: deviceId
      })
    }
  })
}

function getBLEDeviceCharacteristics(deviceId = '') {
  wx.getBLEDeviceCharacteristics({
    deviceId: deviceId,
    serviceId: serviceUUID,
    success: function(res) {
      notifyBLECharacteristicValueChange(deviceId)
    },
    fail: function(res) {
      baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeFail,
        deviceId: deviceId
      })
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
      baseTool.print([res, '预订通知成功成功'])
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeNotifySuccess,
        deviceId: deviceId
      })
    },
    fail: function(res) {
      baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeFail,
        deviceId: deviceId
      })
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
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeWriteSuccess,
        value: res,
        deviceId: deviceId
      })
    },
    fail: function(res) {
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeFail,
        value: res,
        deviceId: deviceId
      })
    }
  })
}

/**
 * 搜索流程
 */
function searchDeviceFlow() {
  // 打开蓝牙
  let that = this
  wx.openBluetoothAdapter({
    success: function(res) {
      wx.startBluetoothDevicesDiscovery({
        services: [],
        success: function(res) {
          baseTool.print("startBluetoothDevicesDiscovery: success");
          baseTool.print(res);
          //Listen to find new equipment
          baseMessageHandler.sendMessage('bluetoothMessage', {
            type: bluetoothMessageType.BleTypeStartDiscoverySuccess,
          })

        },
        fail: function(res) {
          baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
          baseMessageHandler.sendMessage('bluetoothMessage', {
            type: bluetoothMessageType.BleTypeFail,
          })
        }
      })
    },
    fail: function(res) {
      baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
      baseMessageHandler.sendMessage('bluetoothMessage', {
        type: bluetoothMessageType.BleTypeFail,
      })
    },
  })
}

/**
 * 重启蓝牙流程
 */
function reLaunchBluetoothFlow() {
  return new Promise((resolve, reject) => {
    wx.closeBluetoothAdapter({
      success: function(res) {
        let timer = setTimeout(() => {
          clearTimeout(timer)
          wx.openBluetoothAdapter({
            success: function(res) {
              resolve(res)
            },
            fail: function(res) {
              baseTool.print(1)
              baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
              baseMessageHandler.sendMessage('bluetoothMessage', {
                type: bluetoothMessageType.BleTypeFail,
              })
            }
          })
        }, 500)
      },
      fail: function(res) {
        baseTool.print(2)
        baseTool.showToast("蓝牙连接失败，请确认手机蓝牙是否已启用!")
        baseMessageHandler.sendMessage('bluetoothMessage', {
          type: bluetoothMessageType.BleTypeFail,
        })
      }
    })
  })
}

module.exports = {
  reLaunchBluetoothFlow: reLaunchBluetoothFlow,
  connectDeviceFlow: connectDeviceFlow,
  searchDeviceFlow: searchDeviceFlow,
  writeValue: writeValue
}