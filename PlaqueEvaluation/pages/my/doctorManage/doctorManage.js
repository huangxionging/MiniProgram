// pages/my/doctorManage/doctorManage.js
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseTool = require('../../../utils/baseTool.js')
const loginManager = require('../../../manager/loginManager.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addDoctorName: '',
    sectionDataArray: [
      {
        rowDataArray: []
      }
    ]
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
    let that = this
    that.loadData()
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
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("doctorList", "获得医生列表", {
      clinicId: baseNetLinkTool.getClinicId()
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      let sectionDataArray = that.data.sectionDataArray
      let rowDataArray = that.data.sectionDataArray[0].rowDataArray
      rowDataArray.length = 0
      if (res) {
        for (let rowIndex = 0; rowIndex < res.length; ++rowIndex) {
          let rowObject = res[rowIndex]
          rowDataArray.push(rowObject)
        }
      }
      that.setData({
        sectionDataArray: sectionDataArray
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseNetLinkTool.showNetWorkingError(res)
    }) 
  },
  addMemberClick: function() {
    let that = this
    let addDoctorName = that.data.addDoctorName
    if (!addDoctorName) {
      baseTool.showToast("医生姓名不能为空")
      return
    }

    let isTrue = addDoctorName.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/) 
    if (!isTrue) {
      baseTool.showToast("医生姓名不能含有特殊字符")
      return
    }

    if (addDoctorName.length > 6) {
      baseTool.showToast("医生姓名字数超限")
      return
    }
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("addDoctor", "获得医生列表", {
      clinicId: baseNetLinkTool.getClinicId(),
      name: addDoctorName
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      that.setData({
        addDoctorName: ''
      })
      baseTool.showToast("添加成功")
      that.loadData()
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseNetLinkTool.showNetWorkingError(res)
    }) 
  },
  getInputContent: function(e) {
    let that = this
    that.setData({
      addDoctorName: e.detail.value
    })
  },
  didDeleteRow: function (e) {
    let that = this
    baseTool.print(e)
    let indexPath = e.detail
    let itemObject = that.data.sectionDataArray[indexPath.section].rowDataArray[indexPath.row]
    let title = "确定删除“" + itemObject.name + "”医生"
    baseTool.showAlertInfoWithCallBack({
      title: title,
      showCancel: true,
      cancelText: "取消",
      cancelColor: '#333',
      confirmText: "确定删除",
      confirmColor: '#F03838',
    }, (res) => {
      if (res.type == 1) {
        wx.showNavigationBarLoading()
        baseNetLinkTool.getRemoteDataFromServer("delDoctor", "删除医生", {
          doctorId: itemObject.doctorId ? itemObject.doctorId : ''
        }).then(res => {
          wx.hideNavigationBarLoading()
          that.loadData()
        }).catch(res => {
          wx.hideNavigationBarLoading()
          baseNetLinkTool.showNetWorkingError(res)
        })
      }
    })

  },
})