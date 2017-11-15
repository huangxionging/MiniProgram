/**
 * 用于消息传递使用
 */
var allMessageHandler = {
}

const baseTool = require('../utils/baseTool.js')
/**
 * 添加消息处理器
 */
function addMessageHandler(name, instance, messageHandler) {
  return new Promise((resolve, reject) => {
    if (typeof (allMessageHandler[name]) === 'undefined') {
      // 消息处理
      allMessageHandler[name] = []
      var messageHandlers = allMessageHandler[name]
      messageHandlers.push({
        instance: instance,
        messageHandler: messageHandler
      })
      resolve({
        code: true,
        msg: '添加成功'
      })
    } else {
      var messageHandlers = allMessageHandler[name]
      var isCorrect = true
      // 遍历查找 instance, 是否有重复
      for (var index = 0; index < messageHandlers.length; ++index) {
        var dict = messageHandlers[index]
        // === 三个等于号
        if (dict['instance'] === instance) {
          isCorrect = false
          break
        }
      }
      if (isCorrect === false) {
        reject({
          code: false,
          msg: '重复添加'
        })
      } else {
        messageHandlers.push({
          instance: instance,
          messageHandler: messageHandler
        })
        resolve({
          code: true,
          msg: '添加成功'
        })
      }
    }
  })
}

function sendMessage(name = '', message) {
  return new Promise((resolve, reject) => {
    if (typeof (allMessageHandler[name]) === 'undefined') {
      reject({
        code: false,
        msg: '该消息未注册'
      })
    } else {
      var messageHandlers = allMessageHandler[name]
      // 遍历发送消息
      for (var index = 0; index < messageHandlers.length; ++index) {
        var dict = messageHandlers[index]
        dict['messageHandler'](message)
      }
      resolve({
        code: true,
        msg: '消息发送成功'
      })
    }
  })
}

/**
 * 删除消息
 */
function removeAllMessageHandler(name = '') {
  return new Promise((resolve, reject) => {
    if (typeof (allMessageHandler[name]) === 'undefined') {
      reject({
        code: false,
        msg: '该消息未注册'
      })
    } else {
      delete allMessageHandler[name]
      resolve({
        code: true,
        msg: '删除成功'
      })
    }
  })
}

/**
 * 删除指定页面的消息
 */
function removeSpecificInstanceMessageHandler(name = '', instance) {
  return new Promise((resolve, reject) => {
    if (typeof (allMessageHandler[name]) === 'undefined') {
      reject({
        code: false,
        msg: '该消息未注册'
      })
    } else {
      var messageHandlers = allMessageHandler[name]
      var isCorrect = false
      // 遍历发送消息
      for (var index = 0; index < messageHandlers.length; ++index) {
        var dict = messageHandlers[index]
        // === 三个等于号
        if (dict['instance'] === instance) {
          isCorrect = true
          // 删除元素
          messageHandlers.splice(index, 1)
          break
        }
      }
      // 判断是否已经找到
      if (isCorrect == true) {
        resolve({
          code: true,
          msg: '删除成功'
        })
      } else {
        reject({
          code: false,
          msg: '该消息未注册'
        })
      }
    }
  })
}

/**
 * 重置
 */
function resetMessageHandlers() {
  return new Promise((resolve, reject) => {
    allMessageHandler = null
    allMessageHandler = {}
    resolve({
      code: true,
      msg: '重置成功'
    })
  })
}

module.exports = {
  // 添加消息
  addMessageHandler: addMessageHandler,
  // 发送消息
  sendMessage: sendMessage,
  // 删除指定名字的消息
  removeAllMessageHandler: removeAllMessageHandler,
  // 删除指定名字和页面对象的消息
  removeSpecificInstanceMessageHandler: removeSpecificInstanceMessageHandler,
  // 重置消息处理
  resetMessageHandlers: resetMessageHandlers,
}

