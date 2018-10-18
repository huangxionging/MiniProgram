const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getTodayDynamic(memberId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getTodayDynamic
      let data = {
        memberId: memberId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  });
}

/**
 * 获得提现信息
 */
function getWithdrawMoneyInfo(memberId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getWithdrawMoneyInfo
      let data = {
        memberId: memberId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  });
}

/**
 * 获得提现记录列表
 */
function getWithdrawMoneyList(memberId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.getWithdrawMoneyList
      let data = {
        memberId: memberId
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  });
}

/**
 * 提现申请
 */
function withdrawMoney(memberId = '', money = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    if (openid && memberId) {

      let url = baseURL.baseDomain + baseURL.basePath + baseApiList.withdrawMoney
      let data = {
        memberId: memberId,
        sum: money
      }
      // 统一处理
      baseTool.request(url, data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  });
}

module.exports = {
  getTodayDynamic: getTodayDynamic,
  getWithdrawMoneyInfo: getWithdrawMoneyInfo,
  getWithdrawMoneyList: getWithdrawMoneyList,
  withdrawMoney: withdrawMoney
}