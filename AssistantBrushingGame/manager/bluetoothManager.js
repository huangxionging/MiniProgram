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
      var data = res.devices[0]
      var value = data.advertisData
      let hex = Array.prototype.map.call(new Uint8Array(value), x => ('00' + x.toString(16)).slice(-2)).join('');
      console.log(new Uint8Array(value))
      baseTool.print(data.name)
      callback({
        name: data.name,
        deviceId: data.deviceId,
        value: hex,
      })

      // baseTool.print(res.devices)
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
    stopBluetoothDevicesDiscovery.then(res => {
      closeBluetoothAdapter()
    }).catch(res => {

    })
    var closeBluetoothAdapterPromise = baseTool.bindThenPromise(stopBluetoothDevicesDiscovery, closeBluetoothAdapter)

    closeBluetoothAdapterPromise.then(res => {
      resolve
    }).catch(res => {
      reject
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


