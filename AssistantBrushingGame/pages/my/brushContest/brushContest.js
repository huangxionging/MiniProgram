// pages/my/brushContest/brushContest.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')

var data = {
  pageNo: 1,
  isSelect: true,
  loadingDone: false,
  dataList: []
}
Page({

  /**
   * 页面的初始数据
   */
  data: data,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    data.pageNo = 1
    this.loadData()
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
    var that = this
    data.pageNo = 1
    data.loadingDone = false
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    data.pageNo++
    this.loadData()
  },
  loadData() {
    wx.showNavigationBarLoading()
    var that = this
    myManager.pageQueryContest(data.pageNo).then(res => {
      baseTool.print(res)
      data.loadingDone = true
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      if (res.dataList && res.dataList.length > 0) {
        if (data.pageNo == 1) {
          data.dataList.splice(0, data.dataList.length)
        }
        var section = 0, row = 0
        // 解析数据
        for (var index = 0; index < res.dataList.length; ++index) {
          // 如果是第一个
          var dict = res.dataList[index]
          if (!data.dataList[section]) {
            data.dataList.push({
              id: (section + 1),
              isSelect: false,
              date: dict.date,
              contestList: [
                {
                  tag: row + 1,
                  name: dict.name,
                  time: dict.time,
                  gameId: dict.gameId,
                  createTime: dict.createTime,
                  date: dict.date,
                  isSelect: false,
                  section: section,
                  row: row
                }
              ]
            })
          } else {
            // 判断日期是否相同
            section = data.dataList.length - 1, row = data.dataList[section].contestList.length
            var item = data.dataList[section]
            baseTool.print([section, row])
            if (item.date === dict.date) {
              item.contestList.push({
                tag: row + 1,
                name: dict.name,
                time: dict.time,
                gameId: dict.gameId,
                createTime: dict.createTime,
                date: dict.date,
                isSelect: false,
                section: section,
                row: row
              })
            } else {
              ++section, row = 0
              data.dataList.push({
                id: section + 1,
                isSelect: false,
                date: dict.date,
                contestList: [
                  {
                    tag: row + 1,
                    name: dict.name,
                    time: dict.time,
                    gameId: dict.gameId,
                    createTime: dict.createTime,
                    date: dict.date,
                    isSelect: false,
                    section: section,
                    row: row
                  }
                ]
              })
            }
          }
          
        }
        that.setData(data)
        baseTool.print(data)
      } else{

      }
    }).catch(res => {
      baseTool.print(res)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }, 
  selectClick: function (e) {
    baseTool.print(e)
    var that = this
    var dict = e.currentTarget.dataset
    var id = dict.id, section = dict.section, row = dict.row
    baseTool.print([id, section, row])
    if (id == -100 && section == -100 && row == -100) {
      data.isSelect = !data.isSelect
      that.changeDataListAllSelectState(data.isSelect)
    } else if (id != -100 && section == -100 && row == -100) {
      
      data.dataList[id - 1].select = !data.dataList[id - 1].select
      that.changeDataListSectionSelectState(id - 1, data.dataList[id - 1].select)
    }
    that.setData(data)
  },
  /**
   * 将 data.dataList.contestList 某个元素的 isSelect 变成 true
   */
  changeContestListSelectState: function(section, row, select = false) {
    data.dataList[section].contestList[row].isSelect = select
  },
  changeDataListSectionSelectState: function (section, select = false) {
    data.dataList[section].isSelect = select
    for (var index = 0; index < data.dataList[section].contestList.length; ++index) {
      data.dataList[section].contestList[index].isSelect = select
    }
  },
  changeDataListAllSelectState: function (select) {
    var that = this
    for (var index = 0; index < data.dataList.length; ++index) {
      that.changeDataListSectionSelectState(index, select)
    }
  }
})