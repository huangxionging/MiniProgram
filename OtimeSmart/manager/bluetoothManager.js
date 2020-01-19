const baseTool = require('../utils/baseTool.js')
const baseHexConvertTool = require('../utils/baseHexConvertTool.js')

let callBackObject = {}

function findDeviceAction (callBack = Function) {

  let value = ""
  baseHexConvertTool.e
}

function registerCallBackForKey(callBack = Function, key = '') {
  if (key == '') {
    return
  }
  callBackObject[key] = callBack
}

function removeCallBackForKey(key = '') {
  if (key == '') {
    return
  }
  delete callBackObject[key]
}

module.exports = {
  
}