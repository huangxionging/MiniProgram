const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

function getHomePage() {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    let memberId = loginManager.getMemberId()

    if (openid && memberId) {
      // 统一处理
      let data = {
        memberId: loginManager.getMemberId(),
        openid: openid
      }
      baseTool.getRemoteDataFromServer("homePage", "比赛信息", data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}

function finishedGame(gameId = '') {
  return new Promise((resolve, reject) => {
    let openid = loginManager.getOpenId()
    let memberId = loginManager.getMemberId()

    if (openid && memberId) {
      // 统一处理
      let data = {
        memberId: loginManager.getMemberId(),
        openid: openid,
        gameId: gameId,
      }
      baseTool.getRemoteDataFromServer("finishedGame", "结束比赛", data).then(resolve, reject)
    } else {
      loginManager.startAuthorization()
    }
  })
}




module.exports = {
  getHomePage: getHomePage,
  finishedGame: finishedGame
}