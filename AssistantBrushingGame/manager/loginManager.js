const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')

module.exports = {
  checkState: () => {
    return new Promise((resolve, reject) => {

      var checkSession = baseWechat.checkSession()
      var login = baseWechat.login()
      checkSession.then((res) => {
        // 会话检查成功
        baseTool.print(res)

        // 
      }, (res) => {
        // 失败
        return login
      })
    })

    // login 回调
    login.then((res) => {
      // 会话检查成功
      baseTool.print(res)

      // 
    }, (res) => {
      // 失败
      baseTool.print(res)
    })
  }
}