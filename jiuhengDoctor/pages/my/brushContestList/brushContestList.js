// pages/my/brushContestList/brushContestList.js
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
    pageNo: 1,
    sectionDataArray: []
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    that.data.pageNo = 1
    that.setData({
      isSelect: false
    })
    that.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this
    that.data.pageNo++
      that.loadData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  registerCallBack: function() {

  },
  loadData: function() {
    let that = this
    let pageNo = that.data.pageNo
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("pageQueryGames", "查询历史比赛", {
      clinicId: baseNetLinkTool.getClinicId(),
      pageNo: pageNo
    }).then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let dataList = res
      baseTool.print(res)
      if (dataList == undefined) {
        baseTool.showToast("暂无比赛记录～")
        return
      }

      let sectionDataArray = that.data.sectionDataArray
      let isSelect = false
      if (that.data.pageNo == 1) {
        sectionDataArray.length = 0
      }
      let section = 0,
        row = 0
      // 解析数据
      for (let index = 0; index < dataList.length; ++index) {
        // 如果是第一个
        let itemObject = dataList[index]
        if (!sectionDataArray[section]) {
          let headerHeight = 0
          if (section != 0) {
            headerHeight = 10
          }
          sectionDataArray.push({
            headerHeight: headerHeight,
            id: (section + 1),
            isSelect: that.data.isSelect,
            date: itemObject.date,
            rowDataArray: [{
              name: itemObject.name,
              time: itemObject.time,
              gameId: itemObject.gameId,
              startTime: itemObject.startTime,
              date: itemObject.date,
              isSelect: that.data.isSelect,
            }]
          })
        } else {
          // 判断日期是否相同
          section = sectionDataArray.length - 1, row = sectionDataArray[section].rowDataArray.length
          let rowObjectItem = sectionDataArray[section]
          baseTool.print([section, row])
          if (rowObjectItem.date === itemObject.date) {
            rowObjectItem.rowDataArray.push({
              name: itemObject.name,
              time: itemObject.time,
              gameId: itemObject.gameId,
              startTime: itemObject.startTime,
              date: itemObject.date,
              isSelect: rowObjectItem.isSelect,
            })
          } else {
            ++section, row = 0
            sectionDataArray.push({
              headerHeight: 10,
              id: section + 1,
              isSelect: false,
              date: itemObject.date,
              rowDataArray: [{
                name: itemObject.name,
                time: itemObject.time,
                gameId: itemObject.gameId,
                startTime: itemObject.startTime,
                date: itemObject.date,
                isSelect: false,
              }]
            })
          }
        }

      }
      that.setData({
        loadDone: true,
        sectionDataArray: sectionDataArray,
        isSelect: isSelect
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  selectClick: function(e) {
    baseTool.print(e)
    let that = this
    let sectionDataArray = that.data.sectionDataArray
    let section = e.currentTarget.dataset.section
    let sectionObject = sectionDataArray[section]
    sectionObject.isSelect = !sectionObject.isSelect
    baseTool.print(sectionObject)
    for (let index = 0; index < sectionObject.rowDataArray.length; ++index) {
      sectionObject.rowDataArray[index].isSelect = sectionObject.isSelect
    }
    that.setData({
      sectionDataArray: sectionDataArray
    })

  },
  didSelect: function(e) {
    baseTool.print(e.detail)
    let that = this
    let indexPath = e.detail
    let sectionDataArray = that.data.sectionDataArray
    let sectionObject = sectionDataArray[indexPath.section]
    let rowObject = sectionObject.rowDataArray[indexPath.row]
    rowObject.isSelect = !rowObject.isSelect

    if (!rowObject.isSelect) {
      sectionObject.isSelect = false
    } else {
      let rowSelectArray = sectionObject.rowDataArray.filter(function(value, index, array) {
        return value.isSelect == true
      })

      if (rowSelectArray.length == sectionObject.rowDataArray.length) {
        sectionObject.isSelect = true
      }
    }
    that.setData({
      sectionDataArray: sectionDataArray
    })
  },
  allSelectClick: function() {
    let that = this
    let isSelect = that.data.isSelect
    let sectionDataArray = that.data.sectionDataArray
    isSelect = !isSelect
    for (let sectionIndex = 0; sectionIndex < sectionDataArray.length; ++sectionIndex) {
      let sectionObject = sectionDataArray[sectionIndex]
      sectionObject.isSelect = isSelect
      let rowDataArray = sectionObject.rowDataArray
      for (let rowIndex = 0; rowIndex < rowDataArray.length; ++rowIndex) {
        let rowObject = rowDataArray[rowIndex]
        rowObject.isSelect = isSelect
      }
    }
    that.setData({
      isSelect: isSelect,
      sectionDataArray: sectionDataArray
    })
  },
  delClick: function () {
    let that = this
    let gameIds = that.getSelectGameIds()
    if (gameIds == undefined) {
      baseTool.showToast("您未选中任何比赛!")
      return
    }
    baseTool.showAlertInfoWithCallBack({
      content: '请确认是否要删除刷牙数据?',
      showCancel: true
    }, res => {
      if (res.type == 1) {
        that.delGames()
      }
    })
    return
    
  },
  delGames: function() {
    let that = this
    let gameIds = that.getSelectGameIds()
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: '删除中...',
      mask: true
    })
    baseNetLinkTool.getRemoteDataFromServer("delGames", "删除比赛", {
      gameIds: gameIds
    }).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      that.deleteSelectItems()
    }).catch(res => {
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      baseNetLinkTool.showNetWorkingError(res)
    }) 
  },
  mergeClick: function() {
    let that = this
    let gameIds = that.getSelectGameIds()
    if (gameIds == undefined) {
      baseTool.showToast("您未选中任何比赛!")
      return
    }
    // 提交设备编号跟已保存数据
    baseMessageHandler.postMessage('brushContestDetail', res => {
      res({
        gameIds: gameIds
      })
    }).then(res => {
      wx.navigateTo({
        url: '/pages/my/brushContestDetail/brushContestDetail',
      })
    })
  },
  getSelectGameIds: function() {
    let that = this
    let selectArray = []
    let sectionDataArray = that.data.sectionDataArray
    for (let sectionIndex = 0; sectionIndex < sectionDataArray.length; ++sectionIndex) {
      let sectionObject = sectionDataArray[sectionIndex]
      let rowDataArray = sectionObject.rowDataArray
      for (let rowIndex = 0; rowIndex < rowDataArray.length; ++rowIndex) {
        let rowObject = rowDataArray[rowIndex]
        if (rowObject.isSelect) {
          selectArray.push(rowObject.gameId)
        }
      }
    }
    if (selectArray.length == 0) {
      return undefined
    } else {
      return selectArray.join(',')
    }
  },
  deleteSelectItems: function () {
    let that = this
    let sectionDataArray = that.data.sectionDataArray
    for (let sectionIndex = sectionDataArray.length - 1; sectionIndex >= 0; --sectionIndex) {
      let sectionObject = sectionDataArray[sectionIndex]
      let rowDataArray = sectionObject.rowDataArray
      for (let rowIndex = rowDataArray.length - 1; rowIndex >= 0; --rowIndex) {
        let rowObject = rowDataArray[rowIndex]
        if (rowObject.isSelect) {
          rowDataArray.splice(rowIndex, 1)
        }
      }
      if (rowDataArray.length == 0) {
        sectionDataArray.splice(sectionIndex, 1)
      }
    }
    that.setData({
      sectionDataArray: sectionDataArray
    })
  }
})