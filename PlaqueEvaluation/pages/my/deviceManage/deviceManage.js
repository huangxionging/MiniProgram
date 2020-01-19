// pages/my/deviceManage/deviceManage.js
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    /**
     * 是否有数据
     */
    hasData: false,
    /**
     * 数据源
     */
    sectionDataArray: [],
    /**
     * 已保存设备对象
     */
    deviceObject: {},
    showIntroPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.registerCallBack()
    that.loadData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let that = this
    that.removeCallBack()
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.loadData()
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  loadData: function() {
    let that = this
    // 完善诊所信息
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("deviceList", "查询设备列表", {
      clinicId: baseNetLinkTool.getClinicId()
    }).then(res => {
      wx.hideNavigationBarLoading()
      let deviceList = res.deviceList
      if (deviceList == undefined || deviceList.length == 0) {
        let windowHeight = wx.getSystemInfoSync().windowHeight
        that.setData({
          loadDone: true,
          windowHeight: windowHeight
        })
        return
      }
      let hasData = true
  
      let sectionDataArray = that.data.sectionDataArray
      sectionDataArray.length = 0
      sectionDataArray.push({
        rowDataArray: []
      })
      let rowDataArray = sectionDataArray[0].rowDataArray
      let deviceObject = that.data.deviceObject
      for (let index = 0; index < deviceList.length; ++index) {
        rowDataArray.push(deviceList[index])
        deviceObject[deviceList[index].macAddress] = deviceList[index].macAddress
      }
      baseTool.print(sectionDataArray)

      if (rowDataArray.length > 0) {
        baseNetLinkTool.setIsHaveDevice(true)
      } else {
        baseNetLinkTool.setIsHaveDevice(false)
      }
      that.setData({
        loadDone: true,
        hasData: hasData,
        deviceCount: rowDataArray.length,
        sectionDataArray: sectionDataArray,
        deviceObject: deviceObject
      })
      that.showIntroPage()
    }).catch(res => {
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  addClick: function() {
    let that = this
    // 提交设备编号跟已保存数据
    baseMessageHandler.postMessage('addContestDevice', res => {
      let deviceObject = that.data.deviceObject
      res({
        deviceObject: deviceObject
      })
    }).then(res => {
      wx.navigateTo({
        url: '/pages/contest/addContestDevice/addContestDevice',
      })
    })
  },
  delClick: function(e) {
    baseTool.print(e)
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("delDevice", "删除绑定的设备", {
      id: e.detail.deviceId
    }).then(res => {
      let sectionDataArray = that.data.sectionDataArray
      let rowDataArray = sectionDataArray[0].rowDataArray
      rowDataArray.splice(e.detail.row, 1)
      let hasData = true
      let windowHeight = wx.getSystemInfoSync().windowHeight
      if (rowDataArray.length == 0) {
        hasData = false
      }
      let deviceCount = rowDataArray.length
      if (deviceCount > 0) {
        baseNetLinkTool.setIsHaveDevice(true)
      } else {
        baseNetLinkTool.setIsHaveDevice(false)
      }
      that.setData({
        sectionDataArray: sectionDataArray,
        hasData: hasData,
        deviceCount: deviceCount,
        windowHeight: windowHeight
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  showIntroPage: function () {
    let that = this
    let firstLoginDevice = baseTool.valueForKey("firstLoginDevice")
    if (firstLoginDevice == '') {
      that.setData({
        showIntroPage: true
      })
      baseTool.setValueForKey(true, "firstLoginDevice")
    }
  },
  iknowClick: function () {
    let that = this
    that.setData({
      showIntroPage: false
    })
  }
})