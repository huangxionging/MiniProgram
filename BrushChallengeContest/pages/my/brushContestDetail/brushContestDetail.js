// pages/my/brushContestDetail/brushContestDetail.js
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
    hasData: false,
    gameIds: '',
    papSectionDataArray: [{
      rowDataArray: []
    }],
    arcSectionDataArray: [{
      rowDataArray: []
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    baseTool.print(options)
    if (options.gameId) {
      that.data.gameIds = options.gameId
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    if (!that.data.gameIds) {
      that.registerCallBack()
    } else {
      that.loadData()
    }
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
    let that = this
    let gameId = that.data.gameIds
    return {
      path: "/pages/my/brushContestDetail/brushContestDetail?gameId="+gameId
    }
  },
  registerCallBack: function() {
    let that = this
    baseMessageHandler.getMessage('brushContestDetail', res => {
      baseTool.print(res)
      if (res.gameIds){
        that.data.gameIds = res.gameIds
        that.loadData()
      }
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeMessage("brushContestDetail").catch(res => {
      // baseTool.print(res)
    })
  },
  loadData: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("combinedData", "合并或者查看数据", {
      gameIds: that.data.gameIds
    }).then(res => {
      baseTool.print(res)
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      let papPlayerList = res.papPlayerList
      let papSectionDataArray = that.data.papSectionDataArray
      if (papPlayerList) {
        let rowDataArray = papSectionDataArray[0].rowDataArray
        rowDataArray.length = 0;
        for (let index = 0; index < papPlayerList.length; ++index) {
          let itemObject = papPlayerList[index]
          rowDataArray.push({
            score: itemObject.score ? itemObject.score : '--',
            name: itemObject.name ? itemObject.name : '--',
            recordId: itemObject.recordId ? itemObject.recordId : "",
            accuracy: itemObject.accuracy ? itemObject.accuracy : '--'
          })
        }

        rowDataArray.sort((a, b) => {
          if (a.score == '--' && b != '--') {
            return -1
          } else if (a.score != '--' && b == '--') {
            return 1
          } else if (a == '--' && b == '--') {
            return 0
          } else if (b.score != a.score) {
            return b.score - a.score
          } else {
            return b.accuracy - a.accuracy
          }
        })
      }
      let arcPlayerList = res.arcPlayerList
      let arcSectionDataArray = that.data.arcSectionDataArray
      baseTool.print(arcPlayerList)
      if (arcPlayerList) {
        let rowDataArray = arcSectionDataArray[0].rowDataArray
        rowDataArray.length = 0;
        for (let index = 0; index < arcPlayerList.length; ++index) {
          let itemObject = papPlayerList[index]
          baseTool.print(scoreFloat)
          rowDataArray.push({
            score: itemObject.score ? itemObject.score : '--',
            name: itemObject.name ? itemObject.name : '--',
            recordId: itemObject.recordId ? itemObject.recordId : "",
            accuracy: itemObject.accuracy ? itemObject.accuracy : '--'
          })
        }
        rowDataArray.sort((a, b) => {
          return b.score - a.score
        })
      }
      baseTool.print(that.data)

      let playerCount = res.playerCount ? res.playerCount : 0
      that.setData({
        loadDone: true,
        hasData: true,
        playerCount: playerCount,
        papSectionDataArray: papSectionDataArray,
        arcSectionDataArray: arcSectionDataArray
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  segmentChange: function (e) {
    let that = this
    if (e.target.id == "pap" && that.data.isArcBrushingMethod != 0) {
      baseTool.print(e)
      that.setData({
        isArcBrushingMethod: 0
      })
    } else if (e.target.id == "arc" && that.data.isArcBrushingMethod != 1) {
      that.setData({
        isArcBrushingMethod: 1
      })
    }
  },
  shareClick: function() {
    baseTool.print(33)
    wx.showShareMenu({
      withShareTicket: false,
      success: function (res) { baseTool.print(res)},
      fail: function (res) { baseTool.print(res)},
      complete: function(res) {},
    })
  }
})