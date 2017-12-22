// pages/my/brushScoreReport/brushScoreReport.js

const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    recordId: '',
    loadDone: false,
    url: '',
    clinicName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在生成报告',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that = this
    var clinicName = baseTool.valueForKey('clinicName')
    baseTool.print(options)
    that.setData({
      name: options.name,
      recordId: options.recordId,
      clinicName: clinicName
    })

    that.loadData()
    
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
    var that = this
    var data = that.data
    return {
      title: data.name + '的刷牙报告',
      path: '/pages/my/brushScoreReport/brushScoreReport?name=' + data.name + '&recordId=' + data.recordId,
      imageUrl: data.url,
      success: function(res) {
        baseTool.print(res)
      },
      fail: function(res) {
        baseTool.print(res)
      }
    }
  },
  loadData: function () {
    var that = this
    var data = that.data
    
    myManager.brushScoreReport(data.recordId, data.name, data.clinicName).then(res => {
      baseTool.print(res)
      that.setData({
        loadDone: true,
        url: res
      })
    }).catch(res => {
      baseTool.print(res)
    })
  },
  imageLoadDone: function(e) {
    baseTool.print(e)
    wx.hideLoading()
    wx.hideNavigationBarLoading()
  },
  imageLoadError: function(e) {
    baseTool.print([e, 'dsdcdscs'])
    wx.hideLoading()
    wx.hideNavigationBarLoading()
  },
  previewImage: function(e) {
    var that = this
    var data = that.data
    wx.previewImage({
      current: data.url,
      urls: [data.url],
      success: function(res) {
        baseTool.print(res)
      },
      fail: function(res) {
        baseTool.print(res)
      },
      complete: function(res) {},
    })
  },
  imageLongTapClick: function(e) {
    var that = this
    wx.showActionSheet({
      itemList: ['保存图片'],
      itemColor: 'black',
      success: function(res) {
        if(res.tapIndex == 0) {
          that.downloadImage()
        } else if(res.tapIndex == 1) {
          that.onShareAppMessage()
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  downloadImage: function() {
    var that = this
    var data = that.data
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在保存图片...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    
    wx.getImageInfo({
      src: data.url,
      success: function(res) {
        baseTool.print(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: function (res) {
            wx.hideNavigationBarLoading()
            wx.hideLoading()
          },
          fail: function (res) {
            baseTool.print(res)
            wx.hideNavigationBarLoading()
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '图片保存失败',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#00a0e9',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        baseTool.print(res)
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '图片保存失败',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#00a0e9',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })},
      complete: function(res) {},
    })
  }
})