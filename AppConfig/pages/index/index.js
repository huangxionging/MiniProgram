//index.js
//获取应用实例
function getRandomColor() {
  let rgbValue = ''
  for (let i = 0; i < 3; ++i) {
    // 增加颜色值
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgbValue += color
  }
  return '#' + rgbValue
}
const app = getApp()

Page({
  data: {
    components: ['swiper', 'text', 'icon', 'progress', 'button', 'form', 'input', 'checkbox', 'radio', 'picker', 'slider', 'switch', 'label', 'camera', 'audio'],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    color: function(){
      console.log('sddsfsdfsd')
      return getRandomColor()
    },
    colors: 'dd'
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../scrollView/scrollView'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tap: function(e){
    var str = e['currentTarget']['id']
    /**
     * 学习 switch 语句
     */
    switch (str) {
      case 'swiper': {
        wx.navigateTo({
          url: '../swiper/swiper'
        })
        break
      }
      case 'text': {
        wx.navigateTo({
          url: '../text/text'
        })
        break
      }
      case 'icon': {
        wx.navigateTo({
          url: '../icon/icon'
        })
        break
      }
      case 'progress': {
        wx.navigateTo({
          url: '../progress/progress',
        })
        break;
      }
      case 'camera': {
        wx.navigateTo({
          url: '../camera/camera',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      case 'audio': {
        wx.navigateTo({
          url: '../audio/audio',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
    }
  }
})
