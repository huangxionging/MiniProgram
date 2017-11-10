const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')

function addContestUser(name = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContestUser
    var data = {
      name: name,
      brushingMethodId: brushingMethodId,
      memberId: baseTool.valueForKey('memberId')
    }
    wx.request({
      url: url,
      data: data,
      success: resolve,
      fail: reject,
      complete: function(res) {},
    })
  })
}

module.exports = {
  addContestUser: addContestUser
}