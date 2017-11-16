// pages/my/brushContest/brushContest.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
var data = {
  dataList: [
    {
      item: {
        id: 1,
      },
      isSelect: false,
      date: '20141000',
      contestList: [
        {
          row: {
            id: 1 * 10000 + 1
          },
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 2,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 3,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 4,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 5,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 6,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 7,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 8,
          name: '刷牙比赛',
          time: '10:23'
        },
        {
          id: 9,
          name: '刷牙比赛',
          time: '10:23'
        },
      ]
    },
    {
      id: 2,
      isSelect: false,
      date: '20141000',
      contestList: []
    },
    {
      id: 3,
      isSelect: false,
      date: '20141000',
      contestList: []
    },
    {
      id: 4,
      isSelect: false,
      date: '20141000',
      contestList: []
    },
    {
      id: 5,
      isSelect: false,
      date: '20141000',
      contestList: []
    },
    {
      id: 6,
      isSelect: false,
      date: '20141000',
      contestList: []
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
  selectClick: function (e) {
    baseTool.print(e)
  }
})