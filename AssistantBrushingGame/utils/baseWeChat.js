

module.exports = {
  /**
   * @param {String} type 类型
   */
  login: () => {
    return new Promise((success, fail) => {
      wx.login({
        success: success,
        fail: fail,
        complete: function(res) {},
      })
    })
  }
}