// pages/home/homeIndex.js
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const doctorInfoManager = require("../../../manager/doctorInfoManager.js")
const doctorInfoAdapter = require('../../../adapter/doctorInfoAdapter.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    avatar: '',
    doctorName: '',
    department: '',
    jobTitle: '',
    hospital: '',
    doctorActivityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // baseTool.print(["带过来的参数",options.q])
    if (options.q) {
      let url = decodeURIComponent(options.q)
     
      let parameter = baseTool.getParameterFromURL(url)
      baseTool.print(["带过来的参数", parameter])
      if (parameter.doctorId) {
        baseTool.setValueForKey(parameter.doctorId, "doctorId")
      } else {
        baseTool.setValueForKey('', "doctorId")
      }
    } else {
      if (options.doctorId) {
        baseTool.setValueForKey(options.doctorId, "doctorId")
      } else  {
        let doctorId = baseTool.valueForKey('doctorId')
        if (!doctorId) {
          baseTool.setValueForKey('', "doctorId")
        }
      }
    }
    that.getDoctorInfo()
    wx.startPullDownRefresh()
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
    let that = this
    that.getDoctorInfo()
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
    return {
      
    }
  },
  onDoctorInfoClick: function(e) {
    wx.navigateTo({
      url: '../doctorInfoDetail/doctorInfoDetail',
    })
  },
  getDoctorInfo: function() {
    let that = this
    wx.showNavigationBarLoading()
    doctorInfoManager.getDoctorInfo().then(res => {
     
      // 从适配器获得数据
      let data = doctorInfoAdapter.homePageAdapter(res)
      // 获得刷牙报告
      doctorInfoManager.brushScoreReport(data.reportDataList[0].recordId).then(res => {
        wx.stopPullDownRefresh()
        wx.hideNavigationBarLoading()
        baseTool.print(res)
        data.brushReportUrl = res
        data.persons = 83
        data.doctorActivityList = doctorInfoAdapter.doctorActivityListAdapter(data)
        baseTool.print(data)
        that.setData(data)
      }).catch(res => {
        wx.hideLoading()
        wx.hideNavigationBarLoading()
        baseTool.showInfo('报告加载失败')
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.showInfo(res)
    })
  },
  imageLoadDone: function (e) {
    wx.hideLoading()
    wx.hideNavigationBarLoading()
  },
  imageLoadError: function (e) {
    wx.hideLoading()
    wx.hideNavigationBarLoading()
  },
  previewImage: function (e) {
    let that = this
    let data = that.data
    wx.previewImage({
      current: data.brushReportUrl,
      urls: [data.brushReportUrl],
      success: function (res) {
        baseTool.print(res)
      },
      fail: function (res) {
        baseTool.print(res)
      },
      complete: function (res) { },
    })
  },
  imageLongTapClick: function (e) {
    let that = this
    wx.showActionSheet({
      itemList: ['保存图片'],
      itemColor: '#000',
      success: function (res) {
        if (res.tapIndex == 0) {
          that.downloadImage()
        } else if (res.tapIndex == 1) {
          that.onShareAppMessage()
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  downloadImage: function () {
    let that = this
    let data = that.data
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '正在保存图片...',
      mask: true,
    })
    wx.getImageInfo({
      src: data.brushReportUrl,
      success: function (res) {
        baseTool.print(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: function (res) {
            wx.hideNavigationBarLoading()
            wx.hideLoading()
          },
          fail: function (res) {
            wx.hideNavigationBarLoading()
            wx.hideLoading()
            if (res.errMsg && res.errMsg.indexOf("fail auth deny", 0)) {
              wx.showModal({
                title: '提示',
                content: '访问相册权限授权失败, 如需授权, 点击授权按钮进入设置页',
                showCancel: true,
                cancelText: "取消",
                confirmText: '授权',
                confirmColor: '#00a0e9',
                success: function (res) {
                  wx.openSetting({
                  })
                }
              })
            } else {
              baseTool.showInfo('图片保存失败')
            }
          }
        })
      },
      fail: function (res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        baseTool.showInfo('图片保存失败')
      }
    })
  }
})