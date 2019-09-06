// pages/my/myIndex/myIndex.js
const app = getApp()
const baseTool = require('../../../utils/baseTool.js')
const myAdapter = require('../../../adapter/myAdapter.js')
const baseDeviceSynTool = require('../../../utils/baseDeviceSynTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
// const baseNetLinkTool = require('../../../utils/baseCloundNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loadDone: true,
  },
  currentAction: -1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    baseTool.print(that.data)
    that.setData({
      userInfo: baseNetLinkTool.getUserInfo()
    })
    that.registerCallBack()
    that.connectDevice()
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
    let that = this
    that.removeCallBack()
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
  editUserInfoClick: function() {
    wx.navigateTo({
      url: '/pages/my/editMyInfo/editMyInfo'
    })
  },
  loadData: function () {
    let that = this
    let deviceInfo = baseNetLinkTool.getDeviceInfo()
    let sectionDataArray = myAdapter.myIndexSectionDataArray()
    baseTool.print(deviceInfo)
    if (deviceInfo.deviceName != undefined) {
      sectionDataArray[0].rowDataArray[0].title = deviceInfo.deviceName
    }
    that.setData({
      sectionDataArray: sectionDataArray
    })
    
  },
  didSelectRow: function (e) {
    let that = this
    let row = e.detail.row
    let section = e.detail.section
    let url = that.data.sectionDataArray[section].rowDataArray[row].url
    let tip = that.data.sectionDataArray[section].rowDataArray[row].title
    switch (section) {
      case 0:
      case 2: {
        wx.navigateTo({
          url: url
        })
        break
      }
      case 1: {
        switch (row) {
          case 0: {
            wx.showLoading({
              title: "查找设备中...",
              mask: true
            })
            let state = baseDeviceSynTool.getDeviceConnectedState()
            if(state.code != 1002) {
              baseTool.showToast("蓝牙打开失败")
            } else {
              let key = baseDeviceSynTool.commandDindDevice()
              baseDeviceSynTool.registerCallBackForKey((res => {
                baseTool.print(["通知信息", res])
                if (res.length < 10) {
                  baseTool.showToast("查找失败")
                  return
                }
                let result = parseInt(res.substr(6, 2))
                baseTool.print(result)
                if (result == 1) {
                  baseTool.showToast("查找成功")
                } else {
                  baseTool.showToast("查找失败")
                }
                
              }), key)
            }
            break
          }
          case 1: {
            baseDeviceSynTool.commandSettingTime()
            break
          }
          case 2: {
            break
          }
        } 
      }
      case 3: {
        switch (row) {
          case 0: {
            break
          }
          case 1: {
            break
          }
          case 2: {
            
            break
          }
        } 
      }
    }
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.loadData()
    }).then(res => {
      baseTool.print(res)
      that.loadData()
    })
    baseMessageHandler.addMessageHandler("deviceConnectedState", that, res => {
      baseTool.print(res)
    }).then(res => {
      baseTool.print(res)
    })

  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  connectDevice: function() {
    let state = baseDeviceSynTool.getDeviceConnectedState()
    // 未连接
    if (state.code != 1002) {
      baseDeviceSynTool.reLaunchBluetoothFlow().then(res => {
        let deviceInfo = baseNetLinkTool.getDeviceInfo()
        if (deviceInfo.macAddress) {
          baseDeviceSynTool.connectDeviceFlow(deviceInfo)
        }
      }).catch(res => {
        baseTool.print(res)
        baseTool.showToast("蓝牙打开失败")
      })
    }
  }
})