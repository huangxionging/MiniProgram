
const baseURL = require('/baseURL.js')

// 获得状态
var baseState = baseURL.baseState

// 添加接口
module.exports = {
  print: function (e) {
     /**
      * 测试环境下, 才输入内容到控制台
      */
    if (baseState) {
       // 打印内容
      console.log(e)
    } 
  },
  ismodel: function() {
    wx.getSystemInfoSync()
  }
}