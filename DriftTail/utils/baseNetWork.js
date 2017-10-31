

module.export = {
  /**
   * 网络状态改变
   */
  networkStatusChange: function (success) {
    wx.onNetworkStatusChange(success)
  },
  /**
   * 获得当前的网络状态
   */
  getNetworkType: function() {
    wx.getNetworkType(data)
  }
}