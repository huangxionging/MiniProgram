// pages/my/myClinic/myClinic.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')
const baseApiList = require('../../../utils/baseApiList.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    loadingDone: false,
    hasImageUrl: false,
    imageUrl: '',
    fileName: '',
    intro: '',
    clinicId: ''
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
    baseTool.print(name)
    var isTrue = name.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    if (isTrue == null && name != '' && name != undefined) {
      wx.showModal({
        title: '提示',
        content: '单位名称暂不支持表情哦~',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      return
    }
    that.setData({
      name: name
    })
  },
  clinicInfoSave: function(e) {
    baseTool.print(e)
    var that = this
    if (that.data.name == '') {
      wx.showModal({
        title: '提示',
        content: '单位名称不能为空哦',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    wx.showLoading({
      title: '保存中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.showNavigationBarLoading()
    var fileName = that.data.fileName
    myManager.updateClinicInfo(that.data.clinicId, that.data.name, fileName, that.data.intro).then(res => {
      // baseTool.print(res.)
      baseTool.setValueForKey(res.name, 'clinicName')
      baseTool.setValueForKey(res.clinicId, 'clinicId')
      baseTool.setValueForKey(res.name.intro, 'clinicIntro')
      // baseTool.setValueForKey(that.data.intro, 'clinicIntro')
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
    var clinicId = baseTool.valueForKey('clinicId')
    baseTool.print([clinicId, '滴答滴'])
    if (clinicId == '') {
      that.setData({
        loadingDone: true
      })
      return
    }
    myManager.getClinicInfo(clinicId).then(res => {
      baseTool.print(res)

      that.setData({
        loadingDone: true
      })

      if (res.pic) {
        baseTool.setValueForKey(res.pic, 'clinicPic')
        that.setData({
          hasImageUrl: true,
          imageUrl: res.pic,
          fileName: res.pic
        })
      }

      if (res.name){
        baseTool.setValueForKey(res.name, 'clinicName')
        that.setData({
          name: res.name
        })
      }

      if (res.clinicId != undefined) {
        baseTool.setValueForKey(res.clinicId, 'clinicId')
        that.setData({
          clinicId: res.clinicId
        })
      }


      if (res.intro != undefined) {
        baseTool.setValueForKey(res.intro, 'clinicIntro')
        that.setData({
          intro: res.intro
        })
      }
    }).catch(res => {
      baseTool.print(res)
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
  getIntro: function(e) {
    baseTool.print(e)
    
    var that = this
    var intro = e.detail.value
    var isTrue = intro.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    if (isTrue == null && intro != '' && intro != undefined) {
      wx.showModal({
        title: '提示',
        content: '单位简介暂不支持表情哦~',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    that.setData({
      intro: intro
    })
  },
  imageClick: function(e) {
    baseTool.print(e)
    var that = this
    var items = e.currentTarget.dataset.items
    var itemList = items.split(':')
    var chooseItem = ['camera', 'album']
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#black',
      success: function(res) {
        switch (res.tapIndex) {
          case 0:
          case 1: {
            myManager.chooseImageFrom(chooseItem[res.tapIndex]).then(res => {
              baseTool.print(res)
              that.setData({
                hasImageUrl: true,
                imageUrl: res
              })
              var url = baseURL.baseDomain + baseApiList.uploadImageURL
              wx.showLoading({
                title: '上传进度:0%',
                mask: true,
                success: function(res) {
                 
                },
                fail: function(res) {
                  
                },
                complete: function(res) {},
              })
              var uploadTask = wx.uploadFile({
                url: url,
                filePath: res,
                name: 'json',
                success: function(res) {
                  wx.hideLoading()
                  wx.hideNavigationBarLoading()
                  baseTool.print(res)
                  if (res.statusCode == 200 ){
                    var data = JSON.parse(res.data)
                    baseTool.print(data)
                    if (data != undefined && data.picNoList != undefined && data.picNoList.length > 0) {
                      that.setData({
                        fileName: data.picNoList[0]
                      })
                    }
                  }
                },
                fail: function(res) {
                  wx.hideLoading()
                  wx.hideNavigationBarLoading()
                },
                complete: function(res) {},
              })

              uploadTask.onProgressUpdate(function(res) {
                baseTool.print(res)
                wx.showLoading({
                  title: '上传进度:' + res.progress + '%',
                  mask: true,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
                res.progress
              })
            }).catch(res => {
              baseTool.print(res)
            })
            break
          }
          case 2: {
            wx.previewImage({
              current: 'that.data.imageUrl',
              urls: [that.data.imageUrl],
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            break
          }
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})