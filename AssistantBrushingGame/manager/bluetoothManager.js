const baseWechat = require('../utils/baseWeChat.js')
const baseTool = require('../utils/baseTool.js')

function searchBluetoothDevice() {
  // 打开蓝牙适配器 Promise
  return new Promise((resolve, reject) => {
    var openBluetoothAdapterPromise = baseWechat.openBluetoothAdapter()
    openBluetoothAdapterPromise.then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
      reject(res)
    })

    var getBluetoothAdapterStatePromise = baseTool.bindThenPromise(openBluetoothAdapterPromise, baseWechat.getBluetoothAdapterState)
    getBluetoothAdapterStatePromise.then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
      reject(res)
    })

    var startBluetoothDevicesDiscoveryPromise = baseTool.bindThenPromise(getBluetoothAdapterStatePromise, baseWechat.startBluetoothDevicesDiscovery)
    startBluetoothDevicesDiscoveryPromise.then(res => {
      resolve(res)
    }).catch(res => {
      rejec(res)
    })

  })
  
}

function foundDevice(callback) {
  baseWechat.onBluetoothDeviceFound(res => {
    if (res.devices && res.devices.length > 0) {
      callback(res.devices[0])
    }
  })
}

function stopBluetoothDevicesDiscovery() {
  return baseWechat.stopBluetoothDevicesDiscovery()
}

function closeBluetoothAdapter() {
  return baseWechat.closeBluetoothAdapter()
}

function stopSearchDevice() {
  return new Promise((resolve, reject) => {
    stopBluetoothDevicesDiscovery().catch(res => {
      reject(res)
    })
    var closeBluetoothAdapterPromise = baseTool.bindThenPromise(stopBluetoothDevicesDiscovery(), closeBluetoothAdapter)
    closeBluetoothAdapterPromise.then(res => {
      resolve(res)
    }).catch(res => {
      reject(res)
    })
  })
}


module.exports = {
  // 查找设备
  searchBluetoothDevice: searchBluetoothDevice,
  // 发现设备
  foundDevice: foundDevice,
  closeBluetoothAdapter: closeBluetoothAdapter,
  stopBluetoothDevicesDiscovery: stopBluetoothDevicesDiscovery,
  stopSearchDevice: stopSearchDevice,
}


