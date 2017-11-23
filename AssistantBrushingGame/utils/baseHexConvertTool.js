const baseTool = require('../utils/baseTool.js')
/**
 * 16进制字符串转换成 16进制 ArrayBuffer
 */
function hexStringToArrayBuffer(hexString = '') {
  var hexArray = new Uint8Array(hexString.match(/[\da-f]{2}/gi).map(value => {
    return parseInt(value, 16)
  }))
  return hexArray.buffer
}

/**
 * 10 进制字符串转16进制字符串
 */
function valueToHexString(value = '') {
  return parseInt(value, 10).toString(16)
}

/**
 * 10进制字符串数组转16进制字符串
 */
function arrayToHexString(array = []) {
  var hexString = ''
  // 遍历数组
  array.forEach((value, index, array) => {
    // 解析成16进制
    var hex = valueToHexString(value)
    // 长度为 1, 在前面添加 0 
    if (hex.length == 1) {
      hex = '0' + hex
    }
    hexString +=  hex
  })
  return hexString
}

function arrayBufferToHexString(arrayBuffer = []) {
  var array = new Uint8Array(arrayBuffer)
  return arrayToHexString(array)
}

module.exports = {
  // 16进制字符串转 ArrayBuffer
  hexStringToArrayBuffer: hexStringToArrayBuffer,
  // 10进制字符转 16进制字符串
  valueToHexString: valueToHexString,
  // 10进制数组 转16 进制字符串
  arrayToHexString: arrayToHexString,
  // ArrayBuffer 转字符串
  arrayBufferToHexString: arrayBufferToHexString,
}