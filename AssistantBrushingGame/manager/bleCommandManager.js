const baseTool = require('../utils/baseTool.js')
const baseHexConvertTool = require('../utils/baseHexConvertTool.js')

function findDevice() {
  
  var header = 'f50cf4'
  var headHabit = '00'
  var brushMethod = '01'
  // 获得格式化时间数组
  var systemTimeArray = getFormatDateArray()
  // 转换成16进制字符串
  var systemTimeHex = baseHexConvertTool.arrayToHexString(systemTimeArray)
  // 生成完整的命令字符串
  var commandHexString = header + systemTimeHex + headHabit + brushMethod
  baseTool.print(commandHexString)
  // 生成命令数组
  var buffer = baseHexConvertTool.hexStringToArrayBuffer(commandHexString)
  return buffer
}

function getFormatDateArray() {
  var date = new Date();
  const year = date.getFullYear() + ''
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const yearHead = year.substring(0, 2)
  const yearEnd = year.substring(2)
  return [yearHead, yearEnd, month, day, hour, minute, second]
}

module.exports = {
  findDevice: findDevice
}

