// pages/contest/selectContestUser/selectContestUser.js
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

var data = {
  loadingDone: false,
  hasData: false,
  gameId: '',
  dataList: [
    {
      name: '滴滴',
      item: {
        isSelect: false,
        id: 1
      }
    },
    {
      id: 2,
      name: '滴滴',
      item: {
        isSelect: false,
        id: 2
      }
    },
    {
      name: '滴滴',
      item: {
        isSelect: false,
        id: 3
      }
    },
    {
      id: 4,
      name: '滴滴',
      item: {
        isSelect: false,
        id: 4
      }
    },
    {
      id: 5,
      name: '滴滴',
      item: {
        isSelect: false,
        id: 5
      }
    },
    {
      name: '滴滴',
      item: {
        isSelect: false,
        id: 6
      }
    },
    {
      name: '滴滴',
      item: {
        isSelect: false,
        id: 7
      }
    },
    {
      name: '滴滴',
      item: {
        isSelect: false,
        id: 8
      }
    }, {
      name: '滴滴',
      item: {
        isSelect: false,
        id: 9,
      }
    }
  ]
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
    baseTool.print(options)
    data.gameId = options.gameId
    that.setData(data)
    that.loadData()
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
  addContestUser: () => {
    wx.navigateTo({
      url: '../addContestUser/addContestUser',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  selectClick: function(e) {
    baseTool.print(e)
    var that = this
    var index = e.currentTarget.id - 1
    data.dataList[index].item.isSelect = !data.dataList[index].item.isSelect
    that.setData(data)
  },
  loadData: function() {
    // contestManager.
  }
})