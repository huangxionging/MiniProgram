// pages/my/myClinic/myClinic.js
const app = getApp()
const baseTool = require('../../../utils/baseTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    loadDone: false,
    hasImageUrl: false,
    imageUrl: '',
    intro: '',
    clinicId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    that.getClinicInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  inputName: function(e) {
    baseTool.print(e)
    let that = this
    let name = e.detail.value
    baseTool.print(name)
    let isTrue = name.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    if (isTrue == null && name != '' && name != undefined) {
      wx.showModal({
        title: '提示',
        content: '单位名称暂不支持表情哦~',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
      })
      that.setData({
        name: that.data.name
      })
      return
    }
    that.setData({
      name: name
    })
  },
  clinicInfoSave: function(e) {
    baseTool.print(e)
    let that = this
    if (that.data.name == '') {
      baseTool.showInfo("单位名称未填写")
      return
    }

    if (that.data.intro == '') {
      baseTool.showInfo("单位简介未填写")
      return
    }

    // if (that.data.fileName == '') {
    //   baseTool.showInfo("请上传单位照片")
    //   return
    // }
 
    // let intro = that.data.intro
    // let name = that.data.name
    // let isTrue = intro.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    // let isNameTrue = name.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    // if (isTrue == null && intro != '' && intro != undefined) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '单位简介暂不支持特殊字符哦~',
    //     showCancel: false,
    //     confirmText: '确定',
    //     confirmColor: '#00a0e9',
    //   })
    //   return
    // }
    wx.showLoading({
      title: '保存中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("updateClinicInfo", "更新诊所信息", {
      clinicId: that.data.clinicId,
      name: that.data.name,
      intro: that.data.intro
    }).then(res => {
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
      baseTool.showToast("保存测评单位信息成功~")
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  getClinicInfo: function() {
    let that = this
    let clinicId = baseTool.valueForKey('clinicId')
    baseTool.print([clinicId, '滴答滴'])
    if (clinicId == '') {
      that.setData({
        loadDone: true
      })
      return
    }

    baseNetLinkTool.getRemoteDataFromServer("getClinicInfo", "获得诊所信息", {
      clinicId: baseNetLinkTool.getClinicId()
    }).then(res => {
      baseTool.print(res)

      that.setData({
        loadDone: true
      })

      if (res.pic) {
        baseTool.setValueForKey(res.pic, 'clinicPic')
        that.setData({
          hasImageUrl: true,
          imageUrl: res.pic,
          fileName: res.pic
        })
      }

      if (res.name) {
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
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  getIntro: function(e) {
    baseTool.print(e)

    let that = this
    let intro = e.detail.value
    that.setData({
      intro: intro
    })
  },
  imageClick: function(e) {
    baseTool.print(e)
    let that = this
    let items = e.currentTarget.dataset.items
    let itemList = items.split(':')

    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#000',
      success: function(res) {
        switch (res.tapIndex) {
          case 0:
          case 1:
            {
              baseNetLinkTool.uploadImageToRemoteServer(res.tapIndex).then(res => {
                baseTool.print(res)
                that.setData({
                  hasImageUrl: true,
                  imageUrl: res.imageUrl,
                  fileName: res.fileName
                })
              }).catch(res => {
                baseNetLinkTool.showNetWorkingError(res)
              })
              break
            }
          case 2:
            {
              wx.previewImage({
                current: 'that.data.imageUrl',
                urls: [that.data.imageUrl],
              })
              break
            }
        }
      }
    })
  }
})