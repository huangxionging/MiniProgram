// pages/camera/camera.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 位置
    devicePosition: 'back',
    // 闪光灯
    flash: 'auto',
    // 位置数组
    devicePositions: [
      {
        name: '后置',
        value: 'back',
        checked: 'true'
      },
      {
        name: '前置',
        value: 'front',
      }
    ],
    // 闪光灯数组
    flashs: [
      {
        name: '自动',
        value: 'auto',
        checked: 'true'
      },
      {
        name: '打开',
        value: 'on',
      },
      {
        name: '关闭',
        value: 'off',
      }
    ],
    // 是否拍照
    isTakePhoto: true,
    // 录制状态
    recordState: 0,
    // 下边预览图数组
    dataList: [],
    // 滚动到的位置
    toView: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  deviceRadioChange: function(e) {
    console.log(e)
    var that = this
    // 获得摄像头位置
    var devicePosition = e.detail.value
    // 刷新页面, 切换摄像头
    that.setData({
      devicePosition: devicePosition
    })
  },
  flashRadioChange: function(e) {
    console.log(e)
    var that = this
    var flash = e.detail.value
    that.setData({
      flash: flash
    })
  },
  switchChange: function(e) {
    console.log(e)
    var that = this
    var change = e.detail.value
    that.setData({
      isTakePhoto: !change
    })
  },
  recordVideo: function(e) {
    var that = this
    // 获得相机 Context
    var ctx = wx.createCameraContext(this)
    // 刷新界面
    that.setData({
      recordState: 1
    })
    // 开始录制
    ctx.startRecord({
      success: function(res) { 
        console.log(res)
      },
      timeoutCallback: function(res){ // 30s 超时回调
        console.log(res)
        // 刷新界面
        that.setData({
          recordState: 2
        })
        // 创建预览 item
        var item = {
          type: 'video',
          thumbPath: res.tempThumbPath,
          src: res.tempVideoPath
        }
        var dataList = that.data.dataList
        dataList.push(item)
        that.setData({
          dataList: dataList,
        })
        // 保存相册
        // wx.saveVideoToPhotosAlbum({
        //   filePath: res.tempVideoPath,
        //   success: function(res) {},
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })
      }
    })
  },
  stopRecord: function(e) {
    var that = this
    var ctx = wx.createCameraContext(this)
    that.setData({
      recordState: 2
    })
    ctx.stopRecord({
      success: function(res) {
        console.log(res)
        var item = {
          type: 'video',
          thumbPath: res.tempThumbPath,
          src: res.tempVideoPath
        }
        var dataList = that.data.dataList
        dataList.push(item)
        that.setData({
          dataList: dataList,
        })
        // wx.saveVideoToPhotosAlbum({
        //   filePath: res.tempVideoPath,
        //   success: function(res) {},
        //   fail: function(res) {},
        //   complete: function(res) {},
        // })
      },
    })
  },
  /**
   * 拍照
   */
  takePhoto: function() {
    var that = this
    // 获得相机 Context
    var ctx = wx.createCameraContext(this)
    // 执行拍照
    ctx.takePhoto({
      quality: 'high', // 高质量/正常/低质量
      success: function(res) { // 成功回调
        console.log(res)
        // 创建预览 item
        var item = {
          type: 'image',
          thumbPath: res.tempImagePath,
          src: res.tempImagePath
        }
        var dataList = that.data.dataList
        // 滚动到最后一张图
        var toView = 'image' + (dataList.length-1)
        // 添加数据
        dataList.push(item)
        // 刷新页面数据
        that.setData({
          dataList: dataList,
          toView: toView
        })
        console.log(dataList, 'image' + (dataList.length - 1))
        // 保存相册
        // wx.saveImageToPhotosAlbum({
        //   filePath: res.tempImagePath,
        //   success: function(res) {
        //     console.log(res)
        //   },
        //   fail: function(res) {
        //     console.log(res)
        //   },
        //   complete: function(res) {},
        // })
      }
    })
  },
  /**
   * 预览
   */
  imageClick: function(e) {
    console.log(e)
    // 获得资源类型
    var resType = e.currentTarget.dataset.type
    // 获得资源的路径
    var src = e.currentTarget.dataset.src
    // 判断是否是图片还是视频
    if (resType == 'image') {
      // 预览图像
      wx.previewImage({
        current: src,
        urls: [src],
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (resType == 'video'){
      // 挑转视频页面加载视频
      wx.navigateTo({
        url: '../video/video?src=' + src,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  }
})