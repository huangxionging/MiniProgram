// pages/my/myClinic/myClinic.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    loadingDone: false,
    hasImageUrl: false,
    imageUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getClinicInfo()
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
  inputName: function(e) {
    baseTool.print(e)
    var that = this
    var name = e.detail.value
    that.setData({
      name: name
    })
  },
  clinicInfoSave: function(e) {
    baseTool.print(e)
    var that = this
    wx.showLoading({
      title: '保存中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.showNavigationBarLoading()
    myManager.updateClinicInfo(that.data.name, '').then(res => {
      baseTool.print(res)
      baseTool.setValueForKey(that.data.name, 'clinicName')
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.navigateBack({
        delta: 1,
      })
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  },
  getClinicInfo: function() {
    var that = this
    myManager.getClinicInfo().then(res => {
      baseTool.print(res)

      that.setData({
        loadingDone: true
      })

      if (res.clinicPic) {
        that.setData({
          hasImageUrl: true,
          imageUrl: 'https://www.baidu.com/img/bd_logo1.png'
        })
      }

      if (res.clinicName){
        baseTool.setValueForKey(res.clinicName, 'clinicName')
        that.setData({
          name: res.clinicName
        })
      }
    }).catch(res => {
      baseTool.print(res)
    })
  },
  previeClick: function(e) {
    baseTool.print(e)
    wx.previewImage({
      current: 'https://www.baidu.com/img/bd_logo1.png',
      urls: ['https://www.baidu.com/img/bd_logo1.png'],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  imageClick: function(e) {
    baseTool.print(e)
    wx.showActionSheet({
      itemList: ['选择照片'],
      itemColor: '#black',
      success: function(res) {
        if(res.tapIndex == 0) {
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function(res) {
              baseTool.print(res)

              wx.uploadFile({
                url: 'https://os.32teeth.cn/qn_upload',
                filePath: res.tempFilePaths[0],
                name: 'name',
                success: function(res) {
                  baseTool.print(res)
                },
                fail: function(res) {},
                complete: function(res) {},
              })
              // // 获得 token
              // myManager.getUploadToken(res.tempFilePaths[0]).then(res => {
              //   baseTool.print(res)
              //   var url = 'https://up-z2.qbox.me'
              //   var uploadTask = wx.uploadFile({
              //     url: '',
              //     filePath: '',
              //     name: '',
              //     header: {},
              //     formData: {},
              //     success: function (res) { },
              //     fail: function (res) { },
              //     complete: function (res) { },
              //   })
              // }).catch(res => {

              // })
              
            },
            fail: function(res) {
              baseTool.print(res)
            },
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})