const baseTool = require('./baseTool.js')

function checkSession() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function getUserInfo() {
  
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

/**
 * 打开蓝牙适配器
 */
function openBluetoothAdapter() {
  return new Promise((resolve, reject) => {
    wx.openBluetoothAdapter({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 获取蓝牙状态
 */
function getBluetoothAdapterState() {
  return new Promise((resolve, reject) => {
    wx.getBluetoothAdapterState({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 开始发现蓝牙设备
 */
function startBluetoothDevicesDiscovery(services = [], allowDuplicatesKey = true, interval = 0) {
  baseTool.print([services, allowDuplicatesKey, interval])
  return new Promise((resolve, reject) => {
    wx.startBluetoothDevicesDiscovery({
      services: [],
      allowDuplicatesKey: false,
      interval: interval,
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

/**
 * 发现设备
 */
function onBluetoothDeviceFound(callback) {
  wx.onBluetoothDeviceFound(callback)
}

function closeBluetoothAdapter(){
  return new Promise((resolve, reject) => {
    wx.closeBluetoothAdapter({
      success: resolve,
      fail: reject,
      complete: function (res) {},
    })
  })
}

function onBluetoothAdapterStateChange(callback){
  wx.onBluetoothAdapterStateChange(callback)
}

/**
 * 停止发现设备
 */
function stopBluetoothDevicesDiscovery() {
  return new Promise((resolve, reject) => {
    wx.stopBluetoothDevicesDiscovery({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
  
}

/**
 * 创建 ble 连接
 */
function createBLEConnection(deviceId = '') {
  return new Promise((resolve, reject) => {
    wx.createBLEConnection({
      deviceId: deviceId,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 关闭 ble 连接
 */
function closeBLEConnection(deviceId = '') {
  return new Promise((resolve, reject) => {
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 获得 ble 服务
 */
function getBLEDeviceServices(deviceId = '') {
  return new Promise((resolve, reject) => {
    wx.getBLEDeviceServices({
      deviceId: deviceId,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

function getBLEDeviceCharacteristics(deviceId = '', serviceId = '') {
  return new Promise((resolve, reject) => {
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: serviceId,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
  
}

/**
 * 读特征
 */
function readBLECharacteristicValue(deviceId = '', serviceId = '', characteristicId = '') {
  return new Promise((resolve, reject) => {
    wx.readBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

/**
 * 通知特征值中的
 */
function notifyBLECharacteristicValueChange(deviceId = '', serviceId = '', characteristicId = '', state = true) {
  return new Promise((resolve, reject) => {
    wx.notifyBLECharacteristicValueChange({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      state: state,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 写特征值
 */
function writeBLECharacteristicValue(deviceId = '', serviceId = '', characteristicId = '', value = []) {
  return new Promise((resolve, reject) => {
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: value,
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

/**
 * 状态改变
 */
function onBLEConnectionStateChange(callBack){
  wx.onBLEConnectionStateChange(callBack)
}

/**
 * 蓝牙特征值改变
 */
function onBLECharacteristicValueChange(callBack) {
  wx.onBLECharacteristicValueChange(callBack)
}

function getConnectedBluetoothDevices(services = []) {
  return new Promise((resolve, reject) => {
    wx.getConnectedBluetoothDevices({
      services: services,
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

function getBluetoothDevices() {
  return new Promise((resolve, reject) => {
    wx.getBluetoothDevices({
      success: resolve,
      fail: reject,
      complete: function (res) { },
    })
  })
}

module.exports = {
  // 检查会话是否过期
  checkSession: checkSession,
  //登录
  login: login,
  //获得用户信息
  getUserInfo: getUserInfo,
  // 打开蓝牙适配器
  openBluetoothAdapter: openBluetoothAdapter,
  // 获得蓝牙适配器状态
  getBluetoothAdapterState: getBluetoothAdapterState,
  // 开始搜索
  startBluetoothDevicesDiscovery: startBluetoothDevicesDiscovery,
  // 发现设备
  onBluetoothDeviceFound: onBluetoothDeviceFound,
  // 停止发现设备
  stopBluetoothDevicesDiscovery, stopBluetoothDevicesDiscovery,
  // 关闭蓝牙适配器
  closeBluetoothAdapter, closeBluetoothAdapter,
  // 创建 ble 连接
  createBLEConnection: createBLEConnection,
  // 关闭 ble 连接
  closeBLEConnection: closeBLEConnection,
  // 获得 ble 服务
  getBLEDeviceServices: getBLEDeviceServices,
  // 读特征值
  readBLECharacteristicValue: readBLECharacteristicValue,
  // 通知特征值预订
  notifyBLECharacteristicValueChange: notifyBLECharacteristicValueChange,
  // 写特征值
  writeBLECharacteristicValue: writeBLECharacteristicValue,
  // ble 连接状态改变
  onBLEConnectionStateChange: onBLEConnectionStateChange,
  // 特征值改变了
  onBLECharacteristicValueChange: onBLECharacteristicValueChange,
  // 获得特征值
  getBLEDeviceCharacteristics: getBLEDeviceCharacteristics,
  onBluetoothAdapterStateChange: onBluetoothAdapterStateChange,
  getConnectedBluetoothDevices: getConnectedBluetoothDevices,
  getBluetoothDevices: getBluetoothDevices,
}