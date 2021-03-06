/**
 * 用于消息传递使用
 */
let allMessageHandler = {
}

const baseTool = require('../utils/baseTool.js')
/**
 * 注册消息通知
 * 
 * @param name: 消息名字
 * @param instance: 注册消息的实体
 * @param messageHandler: 处理消息的事件
 */
function addMessageHandler(name, instance, messageHandler) {
  return new Promise((resolve, reject) => {
    if (typeof (allMessageHandler[name]) === 'undefined') {
      // 消息处理
      allMessageHandler[name] = []
      let messageHandlers = allMessageHandler[name]
      messageHandlers.push({
        instance: instance,
        messageHandler: messageHandler
      })
      resolve({
        code: true,
        name: name,
        msg: '添加成功'
      })
    } else {
      let messageHandlers = allMessageHandler[name]
      let isCorrect = true
      // 遍历查找 instance, 是否有重复
      for (let index = 0; index < messageHandlers.length; ++index) {
        let dict = messageHandlers[index]
        // === 三个等于号
        if (dict['instance'] === instance) {
          isCorrect = false
          break
        }
      }
      if (isCorrect === false) {
        reject({
          code: false,
          name: name,
          msg: '重复添加'
        })
      } else {
        messageHandlers.push({
          instance: instance,
          messageHandler: messageHandler
        })
        resolve({
          code: true,
          name: name,
          msg: '添加成功'
        })
      }
    }
  })
}

/**
 * 根据指定消息名字, 发送消息
 * 
 * @param name: 消息名字
 * @param message: 消息内容
 */
function sendMessage(name = '', message) {
  return new Promise((resolve, reject) => {
    if (typeof (allMessageHandler[name]) === 'undefined') {
      reject({
        code: false,
        name: name,
        msg: '该消息未注册'
      })
    } else {
      let messageHandlers = allMessageHandler[name]
      // 遍历发送消息
      for (let index = 0; index < messageHandlers.length; ++index) {
        let dict = messageHandlers[index]
        dict['messageHandler'](message)
      }
      resolve({
        code: true,
        name: name,
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
        name: name,
        msg: '该消息未注册'
      })
    } else {
      delete allMessageHandler[name]
      resolve({
        code: true,
        name: name,
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
        name: name,
        msg: '该消息未注册'
      })
    } else {
      let messageHandlers = allMessageHandler[name]
      let isCorrect = false
      // 遍历发送消息
      for (let index = 0; index < messageHandlers.length; ++index) {
        let dict = messageHandlers[index]
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
          name: name,
          msg: '删除成功'
        })
      } else {
        reject({
          code: false,
          name: name,
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

/**
 * 提交消息, 实际上是注册消息通知
 */
function postMessage(name = '',messageHandler = () => {}){
  return addMessageHandler(name, null, messageHandler)
}

/**
 * 获得消息, 实际上是讲获得消息的回调, 传送给指定名字的通知, 
 * 指定的消息通知, 收到该消息后, 双方正式建立起单边通信通道, 
 * 从提交消息的一方向获取消息的一方传送相关参数
 * 
 * @param name: 消息的名字
 * @param messageHandler: 建立消息通道的回调函数
 */
function getMessage(name = '', messageHandler = () => {}){
  return sendMessage(name, messageHandler)
}

/**
 * 根据名字删除消息
 */
function removeMessage(name = '') {
  return removeSpecificInstanceMessageHandler(name, null)
}



module.exports = {
  // 添加消息 适用于回传通知
  addMessageHandler: addMessageHandler,
  // 发送消息
  sendMessage: sendMessage,
  // 删除指定名字的消息
  removeAllMessageHandler: removeAllMessageHandler,
  // 删除指定名字和页面对象的消息
  removeSpecificInstanceMessageHandler: removeSpecificInstanceMessageHandler,
  // 重置消息处理
  resetMessageHandlers: resetMessageHandlers,
  // 适用于正向传输数据
  postMessage: postMessage,
  // 获取消息
  getMessage: getMessage,
  // 删除消息
  removeMessage: removeMessage,
}

