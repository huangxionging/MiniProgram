const baseTool = require('../utils/baseTool.js')
const baseHexConvertTool = require('../utils/baseHexConvertTool.js')

function findDeviceCommand() {
  var header = 'f50cf4'
  var headHabit = '00'
  var brushMethod = '01'
  // 获得格式化时间数组
  var systemTimeArray = getFormatDateArray()
  // 转换成16进制字符串
  var systemTimeHex = baseHexConvertTool.arrayToHexString(systemTimeArray)
  // 生成完整的命令字符串
  var commandHexString = header + brushMethod + headHabit + systemTimeHex
  baseTool.print([systemTimeHex, '时间'])
  // 生成命令数组
  var buffer = baseHexConvertTool.hexStringToArrayBuffer(commandHexString)
  return buffer
}

function connectReplyDeviceCommand(brushMethod = '01') {
  var header = 'f10ef2'
  var headHabit = '00'
  // 获得格式化时间数组
  var systemTimeArray = getFormatDateArray()
  // 转换成16进制字符串
  var systemTimeHex = baseHexConvertTool.arrayToHexString(systemTimeArray)
  // 生成完整的命令字符串
  var commandHexString = header + systemTimeHex + headHabit + brushMethod + '00'
  baseTool.print([systemTimeHex, '时间'])
  // 生成命令数组
  var buffer = baseHexConvertTool.hexStringToArrayBuffer(commandHexString)
  return buffer
}

function onceDataEndReplyDeviceCommand() {
  var header = 'f103f8'
  // 生成命令数组
  var buffer = baseHexConvertTool.hexStringToArrayBuffer(header)
  return buffer
}

function closeLightCommand() {
  var header = 'f503f5'
  // 生成命令数组
  var headHabit = '00'
  var brushMethod = '01'
  // 获得格式化时间数组
  var systemTimeArray = getFormatDateArray()
  // 转换成16进制字符串
  var systemTimeHex = baseHexConvertTool.arrayToHexString(systemTimeArray)
  // 生成完整的命令字符串
  var commandHexString = header + brushMethod + headHabit + systemTimeHex
  baseTool.print([systemTimeHex, '时间'])
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
  // baseTool.print([yearHead, yearEnd, month, day, hour, minute, second])
  return [yearHead, yearEnd, month, day, hour, minute, second]
}

function dataBoxCommand(array, macAddress, playerName, brushingMethodId) { //构造函数模式
  var that = this;
  var array = array || [];

  var data = {};

  var month = array[5] + "";
  if (month.length == 1) {
    month = '0' + month
  }
  var day = array[6] + "";
  if (day.length == 1) {
    day = '0' + day
  }
  var brushTimeUnionHead = Number(array[3]) + "" + Number(array[4]) + '-' + month + '-' + day
  console.log(brushTimeUnionHead)
  var brushTimeUnion = [Number(array[7]), Number(array[8]), Number(array[9])].map(formatNumber).join(':')

  function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  data.brushTeethTime = brushTimeUnionHead + ' ' + brushTimeUnion;
  if (data.brushTeethTime.indexOf('undefined') != -1) {
    data.brushTeethTime = ''
  }


  //此两项数据通过接口获得
  data.macAddress = macAddress;
  data.brushingMethodId = brushingMethodId
  baseTool.print(brushingMethodId)
  data.playerName = playerName
  if (data.brushTeethTime == '') {
    data.isTrue = 1
    data.brushTeethTime = baseTool.getCurrentTime()
  } else {
    data.isTrue = 0
  }

  if (array.length > 70) {
    data.outLeftUpXBrushCount = array[10];
    data.outLeftUpYBrushCount = array[11];
    data.outLeftUp45DegreeCount = array[12];

    data.outLeftUpWhiskCount = array[13];

    data.outLeftUpBrushTime = array[14];

    data.outLeftDownXBrushCount = array[15];
    data.outLeftDownYBrushCount = array[16];
    data.outLeftDown45DegreeCount = array[17];

    data.outLeftDownWhiskCount = array[18];

    data.outLeftDownBrushTime = array[19];

    data.outCenterUpXBrushCount = array[23];
    data.outCenterUpYBrushCount = array[24];
    data.outCenterUp45DegreeBrushCount = array[25];

    data.outCenterUpWhiskCount = array[26];

    data.outCenterUpBrushTime = array[27];

    data.outCenterDownXBrushCount = array[28];
    data.outCenterDownYBrushCount = array[29];
    data.outCenterDown45DegreeBrushCount = array[30];

    data.outCenterDownWhiskCount = array[31];

    data.outCenterDownBrushTime = array[32];

    data.outRightUpXBrushCount = array[33];
    data.outRightUpYBrushCount = array[34];
    data.outRightUp45DegreeBrushCount = array[35];


    data.outRightUpWhiskCount = array[36];


    data.outRightUpBrushTime = array[37];

    data.outRightDownXBrushCount = array[38];
    data.outRightDownYBrushCount = array[39];
    data.outRightDown45DegreeBrushCount = array[43];

    data.outRightDownWhiskCount = array[44];

    data.outRightDownBrushTime = array[45];


    data.innerLeftUpBrushCount = array[46];
    data.innerLeftUpWhiskCount = array[47];
    data.innerLeftUpBrushTime = array[48];

    data.innerLeftDownBrushCount = array[49];
    data.innerLeftDownWhiskCount = array[50];
    data.innerLeftDownBrushTime = array[51];

    data.innerCenterUpBrushCount = array[52];
    data.innerCenterUpWhiskCount = array[53];
    data.innerCenterUpBrushTime = array[54];

    data.innerCenterDownBrushCount = array[55];
    data.innerCenterDownWhiskCount = array[56];
    data.innerCenterDownBrushTime = array[57];

    data.innerRightUpBrushCount = array[58];
    data.innerRightUpWhiskCount = array[59];
    data.innerRightUpBrushTime = array[63];

    data.innerRightDownBrushCount = array[64];
    data.innerRightDownWhiskCount = array[65];
    data.innerRightDownBrushTime = array[66];


    data.upLeftBrushCount = array[67];
    data.upLeftBrushTime = array[68];


    data.downLeftBrushCount = array[69];
    data.downLeftBrushTime = array[70];


    data.upRightBrushCount = array[71];
    data.upRightBrushTime = array[72];


    data.downRightBrushCount = array[73];
    data.downRightBrushTime = array[74];

    data.brushTeethDuration = Number(array[76]) * 100 + Number(array[75]);
    console.log("brushTeethDuration", data.brushTeethDuration);
  } else {
    data.outLeftUpXBrushCount = array[10];
    data.outLeftUpYBrushCount = array[11];
    data.outLeftUp45DegreeCount = array[12];
    data.outLeftUpBrushTime = array[13];

    data.outLeftDownXBrushCount = array[14];
    data.outLeftDownYBrushCount = array[15];
    data.outLeftDown45DegreeCount = array[16];
    data.outLeftDownBrushTime = array[17];

    data.outCenterUpXBrushCount = array[18];
    data.outCenterUpYBrushCount = array[19];
    data.outCenterUp45DegreeBrushCount = array[23];

    data.outCenterUpBrushTime = array[24];

    data.outCenterDownXBrushCount = array[25];
    data.outCenterDownYBrushCount = array[26];
    data.outCenterDown45DegreeBrushCount = array[27];
    data.outCenterDownBrushTime = array[28];

    data.outRightUpXBrushCount = array[29];
    data.outRightUpYBrushCount = array[30];
    data.outRightUp45DegreeBrushCount = array[31];
    data.outRightUpBrushTime = array[32];

    data.outRightDownXBrushCount = array[33];
    data.outRightDownYBrushCount = array[34];
    data.outRightDown45DegreeBrushCount = array[35];
    data.outRightDownBrushTime = array[36];

    data.upLeftBrushCount = array[37];
    data.upLeftBrushTime = array[38];

    data.downLeftBrushCount = array[39];
    data.downLeftBrushTime = array[43];

    data.upRightBrushCount = array[44];

    data.upRightBrushTime = array[45];

    data.downRightBrushCount = array[46];
    data.downRightBrushTime = array[47];

    data.innerLeftUpBrushCount = array[48];
    data.innerLeftUpBrushTime = array[49];

    data.innerLeftDownBrushCount = array[50];
    data.innerLeftDownBrushTime = array[51];

    data.innerCenterUpBrushCount = array[52];
    data.innerCenterUpBrushTime = array[53];

    data.innerCenterDownBrushCount = array[54];
    data.innerCenterDownBrushTime = array[55];

    data.innerRightUpBrushCount = array[56];
    data.innerRightUpBrushTime = array[57];

    data.innerRightDownBrushCount = array[58];
    data.innerRightDownBrushTime = array[59];
  }
  return data;
}

module.exports = {
  findDeviceCommand: findDeviceCommand,
  connectReplyDeviceCommand: connectReplyDeviceCommand,
  onceDataEndReplyDeviceCommand: onceDataEndReplyDeviceCommand,
  dataBoxCommand: dataBoxCommand,
  closeLightCommand: closeLightCommand,
}