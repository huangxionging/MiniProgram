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
function startBluetoothDevicesDiscovery(services = [], allowDuplicatesKey = false, interval = 100) {
  return new Promise((resolve, reject) => {
    wx.startBluetoothDevicesDiscovery({
      services: services,
      allowDuplicatesKey: allowDuplicatesKey,
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

module.exports = {
  /**
   * 检查会话是否过期
   */
  checkSession: checkSession,
  /**
   * 登录
   */
  login: login,

  /**
   * 获得用户信息
   */
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
  closeBluetoothAdapter, closeBluetoothAdapter,
}