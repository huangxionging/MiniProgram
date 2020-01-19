// pages/my/editMyInfo/editMyInfo.js
const baseTool = require('../../../utils/baseTool.js')
const myAdapter = require('../../../adapter/myAdapter.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    itemList: []
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
    let userInfo = baseNetLinkTool.getUserInfo()
    let sectionDataArray = myAdapter.editIndexSectionArray(userInfo)
    let rowDataArray0 = sectionDataArray[0].rowDataArray
    let rowDataArray1 = sectionDataArray[1].rowDataArray

    that.setData({
      userInfo: userInfo,
      sectionDataArray: sectionDataArray
    })
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
  didSelectRow: function(e) {
    let that = this
    let row = e.detail.row
    let section = e.detail.section
    let tip = that.data.sectionDataArray[section].rowDataArray[row].title
    let sectionDataArray = that.data.sectionDataArray
    let rowDataArray0 = sectionDataArray[0].rowDataArray
    let rowDataArray1 = sectionDataArray[1].rowDataArray
    switch (section) {
      case 0:
        {
          switch (row) {
            case 0:
              {
                break;
              }
            case 1:
              {
                let itemList = that.data.itemList
                itemList = ["男", "女"]
                that.setData({
                  itemList: itemList
                })
                break;
              }
            case 2:
              {
                break;
              }
          }
          break;
        }
      case 1:
        {
          switch (row) {
            case 0:
              {
                break;
              }
            case 1:
              {
                break;
              }
          }
          break
        }
    }
  },
  saveUseInfoClick: function() {
    wx.showLoading({
      title: '',
      mask: true,
    })
    let that = this
    let userInfo = that.data.userInfo
    let sectionDataArray = that.data.sectionDataArray
    let rowDataArray0 = sectionDataArray[0].rowDataArray
    let rowDataArray1 = sectionDataArray[1].rowDataArray
    baseNetLinkTool.getRemoteDataFromServer("info", "用户信息", {
      avatar: userInfo.avatar,
      alias: userInfo.alias,
      sex: rowDataArray0[1].value,
      birthday: rowDataArray0[2].value,
      height: rowDataArray1[0].value,
      weight: rowDataArray1[1].value
    }).then(res => {
      baseTool.print(res)
      baseTool.setValueForKey({
        avatar: res.avatar ? res.avatar : "",
        alias: res.alias ? res.alias : "",
        birthday: res.birthday ? res.birthday : "",
        height: res.height ? res.height : "170",
        weight: res.weight ? res.weight : "60",
        sex: res.sex,
        phone: res.phone ? res.phone : ""
      }, "userInfo")
      wx.hideLoading()
      wx.navigateBack()
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  editSelectClick: function(e) {
    baseTool.print(e)
    let that = this
    let section = e.currentTarget.dataset.section
    let row = e.currentTarget.dataset.row
    let sectionDataArray = that.data.sectionDataArray
    let rowDataArray0 = sectionDataArray[0].rowDataArray
    let rowDataArray1 = sectionDataArray[1].rowDataArray
    let value = e.detail.value
    switch (section) {
      case 0:
        {
          switch (row) {
            case 0:
              {
                break;
              }
            case 1:
              {
                let sexText = (value == 0 ? "保密" : (value == 1 ? "男" : "女"))
                rowDataArray0[row].detail = sexText
                rowDataArray0[row].value = value
                break;
              }
            case 2:
              {
                rowDataArray0[row].detail = value + "岁"
                rowDataArray0[row].value = value
                break;
              }
          }
          break;
        }
      case 1:
        {
          switch (row) {
            case 0:
              {
                rowDataArray1[row].detail = value + " cm"
                rowDataArray1[row].value = value
                break;
              }
            case 1:
              {
                rowDataArray1[row].detail = value + " kg"
                rowDataArray1[row].value = value
                break;
              }
          }
          break
        }
    }
    that.setData({
      sectionDataArray: sectionDataArray
    })
  }
})