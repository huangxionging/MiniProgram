const baseWechat = require('../utils/baseWeChat.js')
const baseTool = require('../utils/baseTool.js')

function searchBluetoothDevice() {
  // 打开蓝牙适配器 Promise
  var openBluetoothAdapterPromise = baseWechat.openBluetoothAdapter()
  openBluetoothAdapterPromise.then(res => {
    baseTool.print(res)
  }).catch(res => {
    baseTool.print(res)
  })

  var getBluetoothAdapterStatePromise = baseTool.bindThenPromise(openBluetoothAdapterPromise, baseWechat.getBluetoothAdapterState)
  getBluetoothAdapterStatePromise.then(res => {
    baseTool.print(res)
  }).catch(res => {
    baseTool.print(res)
  })

  var startBluetoothDevicesDiscoveryPromise = baseTool.bindThenPromise(getBluetoothAdapterStatePromise, baseWechat.startBluetoothDevicesDiscovery)
  
  startBluetoothDevicesDiscoveryPromise.then(res => {
    baseTool.print(res)
    baseWechat.onBluetoothDeviceFound()
  }).catch(res => {
    baseTool.print(res)
  })

  // var onBluetoothDeviceFoundPromise = baseTool.bindThenPromise(startBluetoothDevicesDiscoveryPromise, baseWechat.onBluetoothDeviceFound)
  // onBluetoothDeviceFoundPromise.then(res => {
  //   baseTool.print(res)
  // }).catch(res => {
  //   baseTool.print(res)
  // })
}

module.exports = {
  searchBluetoothDevice: searchBluetoothDevice
}


