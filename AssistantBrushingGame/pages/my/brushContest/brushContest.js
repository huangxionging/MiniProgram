// pages/my/brushContest/brushContest.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    isSelect: false,
    loadingDone: false,
    dataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
  
    that.loadData()
    app.userInfoReadyCallback = res => {
      that.loadData()
    }
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
    that.setData({
      pageNo: 1,
      isSelect: false
    })
    this.loadData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var pageNo = that.data.pageNo
    that.setData({
      pageNo: ++pageNo
    })
    this.loadData()
  },
  loadData() {
    wx.showNavigationBarLoading()
    var that = this
    var clinicId = baseTool.valueForKey('clinicId')
    myManager.pageQueryContest(that.data.pageNo, clinicId).then(res => {
      baseTool.print(res)
      that.setData({
        loadingDone: true
      })

      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      if (res.dataList && res.dataList.length > 0) {
        if (that.data.pageNo == 1) {
          that.setData({
            dataList: []
          })
        }
        var section = 0, row = 0
        // 解析数据
        var dataList = that.data.dataList
        for (var index = 0; index < res.dataList.length; ++index) {
          // 如果是第一个
          var dict = res.dataList[index]
          if (!dataList[section]) {
            dataList.push({
              id: (section + 1),
              isSelect: that.data.isSelect,
              date: dict.date,
              contestList: [
                {
                  name: dict.name,
                  time: dict.time,
                  gameId: dict.gameId,
                  createTime: dict.createTime,
                  date: dict.date,
                  isSelect: that.data.isSelect,
                  section: section,
                  row: row
                }
              ]
            })
          } else {
            // 判断日期是否相同
            section = that.data.dataList.length - 1, row = that.data.dataList[section].contestList.length
            var item = that.data.dataList[section]
            baseTool.print([section, row])
            if (item.date === dict.date) {
              item.contestList.push({
                name: dict.name,
                time: dict.time,
                gameId: dict.gameId,
                createTime: dict.createTime,
                date: dict.date,
                isSelect: item.isSelect,
                section: section,
                row: row
              })
            } else {
              ++section, row = 0
              that.setData({
                isSelect: false
              })
              dataList.push({
                id: section + 1,
                isSelect: false,
                date: dict.date,
                contestList: [
                  {
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
        that.setData({
          dataList: dataList
        })
        baseTool.print(that.data)
      } else{

      }
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }, 
  selectClick: function (e) {
    var that = this
    var dict = e.currentTarget.dataset
    var id = dict.id, section = dict.section, row = dict.row
    baseTool.print([id, section, row])
    var data = that.data
    if (id == -100 && section == -100 && row == -100) {
      // 全选中或者不选中
      data.isSelect = !data.isSelect
      // 设置所有的状态
      that.changeDataListAllSelectState(data.isSelect)
    } else if (id != -100 && section == -100 && row == -100) {
      // 按中的是 sectionHeader 上的按钮
      data.dataList[id - 1].isSelect = !data.dataList[id - 1].isSelect
      // 设置整个 section
      that.changeDataListSectionSelectState(id - 1, data.dataList[id - 1].isSelect)
      if (!data.dataList[id - 1].isSelect) {
        data.isSelect = false
      }

      // 检查选中的状态
      var dataSelects = data.dataList.filter(function (value, index, array) {
        baseTool.print(value)
        return value.isSelect == true
      })
      // 如果当前全部选中, 则全选按钮选中
      if (dataSelects.length === data.dataList.length) {
        data.isSelect = true
      }
    } else if (id == -100 && section != -100 && row != -100){
      // 按中的是 cell 上
      data.dataList[section].contestList[row].isSelect = !data.dataList[section].contestList[row].isSelect 
      if (!data.dataList[section].contestList[row].isSelect) {
        data.dataList[section].isSelect = false
        data.isSelect = false
      }

      // 检查 section 是否全选
      var selectSelections = data.dataList[section].contestList.filter(function (value, index, array) {
        return value.isSelect == true
      })

      if (selectSelections.length === data.dataList[section].contestList.length) {
        data.dataList[section].isSelect = true
      }

      // 检查所有 section 是否全选
      var dataSelects =  data.dataList.filter(function (value, index, array) {
        baseTool.print(value)
        return value.isSelect == true
      })

      if (dataSelects.length === data.dataList.length) {
        data.isSelect = true
      }

    }
    that.setData(data)
  },
  /**
   * 将 data.dataList.contestList 某个元素的 isSelect 变成 true
   */
  changeContestListSelectState: function(section, row, select = false) {
    var that = this
    var data = that.data
    data.dataList[section].contestList[row].isSelect = select
    that.setData(data)
  },
  changeDataListSectionSelectState: function (section, select = false) {
    var that = this
    var data = that.data
    data.dataList[section].isSelect = select
    for (var index = 0; index < data.dataList[section].contestList.length; ++index) {
      that.changeContestListSelectState(section, index, select)
    }
    that.setData(data)
  },
  changeDataListAllSelectState: function (select) {
    var that = this
    var data = that.data
    data.isSelect = select
    for (var index = 0; index < data.dataList.length; ++index) {
      that.changeDataListSectionSelectState(index, select)
    }
    that.setData(data)
  },
  mergeDataClick: function (e) {
    // baseTool.print(e)
    var that = this
    var data = that.data
    var mergeData = []
    for (var index1 = 0; index1 < data.dataList.length; ++index1) {
      for (var index2 = 0; index2 < data.dataList[index1].contestList.length; ++index2) {
        if (data.dataList[index1].contestList[index2].isSelect) {
          mergeData.push(data.dataList[index1].contestList[index2].gameId)
        }
      }
    }
    that.setData(data)
    baseTool.print(mergeData)
    if (mergeData.length == 0) {
      wx.showModal({
        title: '提示',
        content: '您未选中任何比赛',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    var gameIds = mergeData.join(',')
    wx.navigateTo({
      url: '../mergeData/mergeData?gameIds=' + gameIds,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

  }
})