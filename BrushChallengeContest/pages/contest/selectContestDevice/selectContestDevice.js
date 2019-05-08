// pages/contest/selectContestDevice/selectContestDevice.js
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    name: '',
    playerId: '',
    gameId: '',
    gameName: '',
    brushingMethodId: '',
    sectionDataArray: [],
    selectIndexPath: {
      section: -1,
      item: -1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    baseTool.print(options)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    that.registerCallBack()
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
  registerCallBack: function() {
    let that = this
    baseMessageHandler.getMessage("selectContestDevice", res => {
      baseTool.print(res)
      // that.data.name = res.name
      that.data.gameId = res.gameId
      // that.data.gameName = res.gameName
      that.data.playerId = res.playerId
      that.data.brushingMethodId = res.brushingMethodId
      that.setData({
        gameName: res.gameName,
        name: res.name
      })
      that.loadData()
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeMessage("selectContestDevice")
  },
  loadData: function () {
    let that = this
    // 0 表示巴氏, 1 表示圆弧
    // let brushMethods = ["a002c7680a5f4f8ea0b1b47fa3f2b947", "6827c45622b141ef869c955e0c51f9f8"]
    baseNetLinkTool.getRemoteDataFromServer("chooseDevices", "选择设备", {
      gameId: that.data.gameId,
      clinicId: baseNetLinkTool.getClinicId(),
      brushingMethodId: that.data.brushingMethodId
    }).then(res => {
      baseTool.print(res)
      let sectionDataArray = that.data.sectionDataArray
      sectionDataArray.length = 0

      if (res != undefined) {
        for (let index = res.length - 1; index >= 0; --index) {
          // 取整
          let section = parseInt((res.length - 1 - index) / 5)
          let row = index % 5
          baseTool.print([section, sectionDataArray.length - 1])
          if (section > sectionDataArray.length - 1) {
            sectionDataArray.push({
              rowDataArray: []
            })
          }
          let rowDataArray = sectionDataArray[section].rowDataArray
          rowDataArray.push(
            res[index])
        }
      }
      that.setData({
        loadDone: true,
        sectionDataArray: sectionDataArray
      })
      baseTool.print(that.data)
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  selectClick: function(e) {
    let that = this
    let newIndexPath = e.detail
    let selectIndexPath = that.data.selectIndexPath
    let sectionDataArray = that.data.sectionDataArray
    
    // 相同
    baseTool.print([selectIndexPath, newIndexPath])
    if (selectIndexPath.section == newIndexPath.section && selectIndexPath.item == newIndexPath.item) {
      let rowDataArray = sectionDataArray[selectIndexPath.section].rowDataArray
      baseTool.print([selectIndexPath, newIndexPath])
      let itemObject = rowDataArray[selectIndexPath.item]
      itemObject.isChoose = 1
      selectIndexPath.section = -1
      selectIndexPath.item = -1
    } else {
      
      if (selectIndexPath.section != -1) {
        let rowDataArray = sectionDataArray[selectIndexPath.section].rowDataArray
        let itemObject = rowDataArray[selectIndexPath.item]
        itemObject.isChoose = 1
      }
      selectIndexPath.section = newIndexPath.section
      selectIndexPath.item = newIndexPath.item
      let rowDataArray = sectionDataArray[selectIndexPath.section].rowDataArray
      let itemObject = rowDataArray[selectIndexPath.item]
      itemObject.isChoose = -1
    }

    that.setData({
      sectionDataArray: sectionDataArray,
      selectIndexPath: selectIndexPath
    })
  },
  confirmClick: function() {
    let that = this
    let selectIndexPath = that.data.selectIndexPath

    if (selectIndexPath.section == -1) {
      baseTool.showToast("您未选择参赛设备")
      return
    }
    let sectionDataArray = that.data.sectionDataArray
    let rowDataArray = sectionDataArray[selectIndexPath.section].rowDataArray
    let itemObject = rowDataArray[selectIndexPath.item]
    baseNetLinkTool.getRemoteDataFromServer("bindDevices", "绑定设备", {
      playerId: that.data.playerId,
      macAddress: itemObject.macAddress,
      deviceNote: itemObject.name
    }).then(res => {
      baseMessageHandler.sendMessage("refresh", "刷新")
      wx.navigateBack()
    }).catch(res => {
      baseTool.print(res)
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})