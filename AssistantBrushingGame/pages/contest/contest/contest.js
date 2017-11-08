// pages/contest/contest.js
const app = getApp()
const loginManager = require('../../../manager/loginManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 是否加载完成
     */
    loadingDone: true,
    hasData: false,
    contestTitle: '刷牙比赛1',
    contestDate: '2017-10-25',
    /**
     * 是否正在同步
     */
    isSyn: false,
    dataList: [
      {
        rank: 1,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98',
        color: '#ffb9e0',
      }, 
      {
        rank: 2,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98',
        color: '#fe6941',
      },
      {
        rank: 3,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98',
        color: '#2cabee',
      },
      {
        rank: 4,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98'
      },
      {
        rank: 5,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98'
      },
      {
        rank: 6,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98'
      },
      {
        rank: 7,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98'
      },
      {
        rank: 8,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98'
      },
      {
        rank: 9,
        name: '林基金',
        tail: '(tail-1233334444)',
        score: '98'
      },
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
  createContest: () => {
    wx.navigateTo({
      url: '../createContest/createContest',
    })
  },
  contestReSyn: () => {

  },
  contestUserClick: () => {
    wx.navigateTo({
      url: '../contestUser/contestUser',
    })
  }

})