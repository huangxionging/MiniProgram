const baseWechat = require('../utils/baseWeChat.js')
const baseTool = require('../utils/baseTool.js')

function  checkBluetoothState() {
  // 打开蓝牙适配器 Promise
  return new Promise((resolve, reject) => {

    // 获得适配器状态
    var openBluetoothAdapterPromise = baseWechat.openBluetoothAdapter()
    openBluetoothAdapterPromise.then(res => {
      baseTool.print('openBluetoothAdapterPromise: success')
    }).catch(res => {
      baseTool.print([res, '蓝牙状态失败'])
      reject(res)
    })

    // 发现设备
    var startBluetoothDevicesDiscoveryPromise = baseTool.bindThenPromise(openBluetoothAdapterPromise, baseWechat.startBluetoothDevicesDiscovery)
    startBluetoothDevicesDiscoveryPromise.then(res => {
      baseTool.print('startBluetoothDevicesDiscovery: success')
      resolve(res)
    }).catch(res => {
      baseTool.print([res, '蓝牙发现设备失败'])
      rejec(es)
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
    // 停止搜索
    var stopBluetoothDevicesDiscoveryPromise = stopBluetoothDevicesDiscovery()
    stopBluetoothDevicesDiscoveryPromise.then(res => {
      // 停止搜索成功
      baseTool.print('stopBluetoothDevicesDiscovery: success')
    }).catch(res => {
      reject(res)
    })

    // 关闭蓝牙适配器
    var closeBluetoothAdapterPromise = baseTool.bindThenPromise(stopBluetoothDevicesDiscoveryPromise, closeBluetoothAdapter)
    closeBluetoothAdapterPromise.then(res => {
      // 关闭蓝牙适配器成功
      baseTool.print('closeBluetoothAdapter: success')
      resolve(res)
    }).catch(res => {
      reject(res)
    })
  })
}

/**
 * 链接设备
 */
function connectDevice(deviceId = '') {
  return new Promise((resolve, reject) => {
    // 创建 ble 链接, 完成之后获得 ble 服务
    // 重新初始化
    var closeBluetoothAdapterPromise = closeBluetoothAdapter()
    var checkBluetoothStatePromise = closeBluetoothAdapterPromise.then(res => {
      return baseWechat.openBluetoothAdapter()
    }).catch(res => {
      reject(res)
    })
    
    // 然后链接
    var createBLEConnectionPromise = checkBluetoothStatePromise.then(res => {
      return baseWechat.createBLEConnection(deviceId)
    }).catch(res => {
      reject(res)
    })
    // 获得服务 Promise
    var getBLEDeviceServicesPromise = createBLEConnectionPromise.then(res => {
      return baseWechat.getBLEDeviceServices(deviceId)
    }).catch(res => {
      reject(res)
    })
    // 获取服务结果
    getBLEDeviceServicesPromise.then(res => {
      resolve(res)
    }).catch(res => {
      reject(res)
    })
  })
}

/**
 * 获得特征值
 */
function getDeviceCharacteristics(deviceId = '', serviceId = '') {
  return new Promise((resolve, reject) => {
    baseWechat.getBLEDeviceCharacteristics(deviceId, serviceId).then(res => {
      baseTool.print(res)
      resolve(res)
    }).catch(res => {
      baseTool.print(res)
    })
  })
}

/**
 * ble 连接状态改变
 */
function deviceConnectionStateChange(callbcak) {
  baseWechat.onBLEConnectionStateChange(callbcak)
}

/**
 * 设备特征值回调
 */
function deviceCharacteristicValueChange(callbcak){
  baseWechat.onBLECharacteristicValueChange(callbcak)
}

function readBLECharacteristicValue(deviceId = '', serviceId = '', characteristicId = '') {
  return baseWechat.readBLECharacteristicValue(deviceId, serviceId, characteristicId)
}

function notifyBLECharacteristicValueChange(deviceId = '', serviceId = '', characteristicId = '', state = true) {
  return baseWechat.notifyBLECharacteristicValueChange(deviceId, serviceId, characteristicId, state)
}

function writeBLECharacteristicValue(deviceId = '', serviceId = '', characteristicId = '', value = []){
  return baseWechat.writeBLECharacteristicValue(deviceId, serviceId, characteristicId, value)
}

function findDevice() {
  
}

function onBluetoothAdapterStateChange (callback){
  baseWechat.onBluetoothAdapterStateChange(callback)
}

function closeBLEConnection(deviceId) {
  return baseWechat.closeBLEConnection(deviceId)
}

function closeAllConnection(services = []) {
  baseWechat.getConnectedBluetoothDevices(services).then(res => {
    var devices = res.devices
    for (var index = 0; index < devices.length; ++index) {
      baseTool.print(devices[index].deviceId)
      closeBLEConnection(devices[index].deviceId).then(res => {
        baseTool.print(res)
      }).catch(res => {
        baseTool.print(res)
      })
    }
  })
}

module.exports = {
  // 检查蓝牙设备状态
  checkBluetoothState: checkBluetoothState,
  // 发现设备
  foundDevice: foundDevice,
  closeBluetoothAdapter: closeBluetoothAdapter,
  stopBluetoothDevicesDiscovery: stopBluetoothDevicesDiscovery,
  stopSearchDevice: stopSearchDevice,
  // 连接设备
  connectDevice: connectDevice,
  // 获得设备特征值
  getDeviceCharacteristics: getDeviceCharacteristics,
  // 连接状态回调
  deviceConnectionStateChange: deviceConnectionStateChange,
  // 特征值信息通知改变
  deviceCharacteristicValueChange: deviceCharacteristicValueChange,
  // 读特征
  readDeviceCharacteristicValue: readBLECharacteristicValue,
  // 通知特征值预订
  notifyDeviceCharacteristicValueChange: notifyBLECharacteristicValueChange,
  // 写特征值
  writeDeviceCharacteristicValue: writeBLECharacteristicValue,
  onBluetoothAdapterStateChange: onBluetoothAdapterStateChange,
  closeBLEConnection: closeBLEConnection,
  closeAllConnection: closeAllConnection,
}


