// pages/customerManger/classDetail/classDetail.js
const app = getApp()
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: 0,
    loadDone: false,
    selectItemIndex: 1,
    itemList: [
      {
        itemName: '个人星球',
        itemMenuId: 'detail-nomarl',
        select: false,
        id: 0
      },
      {
        itemName: '团体星球',
        itemMenuId: 'detail-select',
        select: true,
        id: 1
      },
      {
        itemName: '家庭星球',
        itemMenuId: 'detail-nomarl',
        select: false,
        id: 2
      }
    ],
    personalList: [
      {
        score: 98.00,
        name: 'Umiy',
        imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLard73s4fMYN22P07rbGOPnVSNcywficjBSJUsLqxLffMwEKlkjdKq3MAibUuicmwHF2E3pN9sPF2icg/0',
        userId: 1,
        color: '#ffb9e0'
      },
      {
        score: 97.0,
        name: 'Umidy',
        imageUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLard73s4fMYN22P07rbGOPnVSNcywficjBSJUsLqxLffMwEKlkjdKq3MAibUuicmwHF2E3pN9sPF2icg/0',
        userId: 2,
        color: '#fe6941'
      },
      {
        score: 96.0,
        name: 'Umidsy',
        imageUrl: 'https://www.baidu.com/img/bd_logo1.png',
        userId: 3,
        color: '#2cabee'
      },
      {
        score: 95.0,
        name: '黄雄',
        imageUrl: 'https://www.baidu.com/img/bd_logo1.png',
        userId: 4
      },
      {
        score: 92.0,
        name: '黄的雄',
        imageUrl: 'https://www.baidu.com/img/bd_logo1.png',
        userId: 5
      }
    ],
    groupList: [
      {
        blueName: '我爱你一生一世哦哦',
        blueUrl: 'https://www.baidu.com/img/bd_logo1.png',
        blueScore: 97.00,
        isBlueCaptain: true,
        redName: 'UimdssiY',
        redUrl: 'https://www.baidu.com/img/bd_logo1.png',
        redScore: 97.00,
        isRedCaptain: true
      },
      {
        blueName: 'UimiY',
        blueUrl: 'https://www.baidu.com/img/bd_logo1.png',
        blueScore: 97.00,
        isBlueCaptain: false,
        redName: 'UimiY',
        redUrl: 'https://www.baidu.com/img/bd_logo1.png',
        redScore: 97.00,
        isRedCaptain: false
      },
      {
        blueName: 'UimiY',
        blueUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLard73s4fMYN22P07rbGOPnVSNcywficjBSJUsLqxLffMwEKlkjdKq3MAibUuicmwHF2E3pN9sPF2icg/0',
        blueScore: 97.00,
        isBlueCaptain: false,
        redName: 'UimiY',
        redUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLard73s4fMYN22P07rbGOPnVSNcywficjBSJUsLqxLffMwEKlkjdKq3MAibUuicmwHF2E3pN9sPF2icg/0',
        redScore: 97.00,
        isRedCaptain: false
      },
      {
        blueName: 'UimiY',
        blueUrl: 'https://www.baidu.com/img/bd_logo1.png',
        blueScore: 97.00,
        isBlueCaptain: false,
        redName: 'UimiY',
        redUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLard73s4fMYN22P07rbGOPnVSNcywficjBSJUsLqxLffMwEKlkjdKq3MAibUuicmwHF2E3pN9sPF2icg/0',
        redScore: 97.00,
        isRedCaptain: false
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
  selectClick: function(data) {
    baseTool.print(data)
    var that = this
    var indicate = data.currentTarget.dataset.index
    var itemList = that.data.itemList
    for (var index = 0; index < itemList.length; ++index) {
      if (index == indicate) {
        itemList[index].itemMenuId = 'detail-select'
        itemList[index].select = true
      } else {
        itemList[index].itemMenuId = 'detail-normal'
        itemList[index].select = false
      }
    }
    that.setData({
      selectItemIndex: indicate,
      itemList: itemList
    })
  },
  personalClick: function(e){

  }

})