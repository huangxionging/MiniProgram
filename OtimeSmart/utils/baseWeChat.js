const baseTool = require('../utils/baseTool.js')


function startLocationFlow() {
  return new Promise((resolve, reject) => {
    wx.startLocationUpdate({
      success: function (res) {
        baseTool.print(res)
        resolve(res)
      },
      fail: function (res) {
        baseTool.print(res)
        reject(res)
      }
    })
  })
}

module.exports = {
  startLocationFlow: startLocationFlow
}