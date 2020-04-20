// pages/moment/momentIndex/momentIndex.js
const baseTool = require('../../../utils/baseTool.js')

const baseWeChat = require("../../../utils/baseWeChat.js")
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    sectionDataArray: [],
    showFamily: false,
    selectIndex: 0,
    familyName: "",
    showList: false,
    markers: [],
    familyPoints: [],
    polylines: [],
    scale: 16,
    showFamilyMember: false,
    familyMemberName: "",
    lastUpdateTime: "",
    memberStep: 0,
    memberHeartRate: 0
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
    that.startLocation()
    let token = baseNetLinkTool.getToken()
    if (token) {
      that.uploadUserLocation()
      that.loadData()
    }
    that.registerCallBack()
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
  uploadUserLocation: function() {
    let that = this
    baseTool.clearSingleTimer()
    baseTool.startTimer(res => {
      baseTool.print(res)
      baseWeChat.startLocationFlow().then(res => {
        wx.getLocation({
          type: "gcj02",
          altitude: true,
          success: function(res) {
            baseTool.print(res)
            let location = {
              longitude: res.longitude,
              latitude: res.latitude
            }
            that.uploadLocation(location)
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }).catch(res => {

      })
    }, 10000, 99999999999)
  },
  startLocation: function() {
    let that = this
    baseWeChat.startLocationFlow().then(res => {
      wx.getLocation({
        type: "gcj02",
        altitude: true,
        success: function(res) {
          // baseTool.print(res)
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }).catch(res => {

    })

    wx.onLocationChange(res => {
      // baseTool.print(res)
    })
  },
  getCurrentLocationClick: function() {
    let that = this
    wx.getLocation({
      type: "gcj02",
      altitude: true,
      success: function(res) {
        baseTool.print(res)
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  uploadLocation: function(e) {
    let that = this
    let uid = baseNetLinkTool.getUserId()
    baseNetLinkTool.getRemoteDataFromServer("group_location", "上报位置信息", {
      uid: uid,
      location: e
    }).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  loadData: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("group_get_list", "获得家庭圈").then(res => {
      baseTool.print(res)
      let list = res.list
      let sectionDataArray = that.data.sectionDataArray
      sectionDataArray.length = 0;
      let showFamily = false
      for (let index = 0; index < list.length; ++index) {
        showFamily = true
        sectionDataArray.push({
          familyName: list[index].name,
          familyId: list[index].id
        })
      }
      let familyName = sectionDataArray[that.data.selectIndex].familyName
      that.setData({
        showFamily: showFamily,
        sectionDataArray: sectionDataArray,
        familyName: familyName
      })

      that.loadFamilyMember()
    }).catch(res => {
      baseTool.print(res)
    })
  },
  showFamilyListClick: function() {
    let that = this
    that.setData({
      showList: true
    })
  },
  selectFamilyClick: function(e) {
    baseTool.print(e)
    let that = this
    that.data.selectIndex = e.currentTarget.dataset.section
    that.loadFamilyMember()
  },
  closeFamilyListClick: function(e) {
    let that = this
    that.setData({
      showList: false
    })
  },
  loadFamilyMember: function() {
    let that = this
    let selectIndex = that.data.selectIndex;
    let familyId = that.data.sectionDataArray[selectIndex].familyId
    baseNetLinkTool.getRemoteDataFromServer("group_get_member", "家庭圈详情", {
      id: familyId
    }).then(res => {
      baseTool.print(res)
      let familyName = res.name
      let managerName = res.creator_name
      let rowDataArray = res.list
      let showManager = false
      let markers = []
      let familyPoints = []
      let polylines = [{
        points: [],
        width: 2,
        color: "#6B92FB",
        borderColor: "#999"
      }]
      let scale = baseTool.toPixel(1)
      for (let index = 0; index < rowDataArray.length; ++index) {
        let location = rowDataArray[index].location
        let item = rowDataArray[index]
        let name = item.name, step = item.step
        if (location) {
          let object = {
            id: index,
            latitude: rowDataArray[index].location.latitude,
            longitude: rowDataArray[index].location.longitude,
            iconPath: "/resource/distance.png",
            title: rowDataArray[index].name,
            width: 50 * scale,
            height: 50 * scale,
            callout: {
              content: rowDataArray[index].name,
              color: "#333",
              fontSize: 14,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: "#999",
              display: "ALWAYS",
              padding: 5,
              bgColor: "#fff"
            }
          }
          markers.push(object)
          familyPoints.push({
            latitude: rowDataArray[index].location.latitude,
            longitude: rowDataArray[index].location.longitude,
          })
          polylines[0].points.push({
            latitude: rowDataArray[index].location.latitude,
            longitude: rowDataArray[index].location.longitude,
          })
        }
      }
      that.setData({
        familyName: familyName,
        markers: markers,
        showList: false,
        familyPoints: familyPoints,
        polylines: polylines
      })
      that.data.rowDataArray = rowDataArray
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  refreshFamilyClick: function() {
    let that = this
    // 先放到最大
    that.setData({
      scale: 20
    })
    that.loadFamilyMember()
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.data.selectIndex = 0
      that.loadData()
    }).then(res => {
      baseTool.print(res)
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  markerTapClick: function(e) {
    baseTool.print(e)
  },
  calloutTapClick: function(e) {
    baseTool.print(e)
    let that = this
    let rowDataArray = that.data.rowDataArray
    let markerId = e.markerId
    let object = rowDataArray[markerId]
    that.setData({
      showFamilyMember: true,
      familyMemberName: object.name,
      lastUpdateTime: object.date,
      memberStep: object.step,
      memberHeartRate: object.heart_rate
    })
  },
  memberCloseClick: function() {
    let that = this
    that.setData({
      showFamilyMember: false
    })
  }
})