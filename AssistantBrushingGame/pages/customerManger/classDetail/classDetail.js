// pages/customerManger/classDetail/classDetail.js
const app = getApp()
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const teamManager = require('../../../manager/teamManager.js')
const loginManager = require('../../../manager/loginManager.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: 0,
    classId: 0,
    loadDone: false,
    selectItemIndex: 0,
    teamName: '',
    needItemList: false,
    blueLikes: 0,
    redLikes: 0,
    blueAverageScore: 0,
    redAverageScore: 0,
    itemList: [
      {
        itemName: '个人星球',
        itemMenuId: 'detail-select',
        select: true,
        id: 0
      },
      {
        itemName: '团体星球',
        itemMenuId: 'detail-nomarl',
        select: false,
        id: 1
      },
      {
        itemName: '家庭星球',
        itemMenuId: 'detail-nomarl',
        select: false,
        id: 2
      }
    ],
    personalList: [],
    groupList: [],
    homeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)
    that.setData({
      classId: options.classId
    })
    that.getTeamDetails()

    baseMessageHandler.addMessageHandler('classListRefresh', this, that.onPullDownRefresh).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
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
    that.getTeamDetails()
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
    var that = this
    var selectItemIndex = that.data.selectItemIndex
    if (selectItemIndex == 0) {
      var userId = that.data.personalList[e.currentTarget.dataset.index].userId
      baseTool.print(userId)
      wx.navigateTo({
        url: '../brushInfo/brushInfo?userId=' + userId,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }
  },
  getTeamDetails: function(){
    var that = this
    wx.showNavigationBarLoading()
    //that.data.classId
    teamManager.getTeamDetails(that.data.classId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      var dataArray = res.data
      var personalList = [] 
      var groupList = []
      var homeList = []
      var itemList = that.data.itemList
      var blueLikes = 0
      var redLikes = 0
      var blueAverageScore = 0.00
      var redAverageScore = 0.00
      var needItemList = false
      if (dataArray != undefined) {
        if (dataArray[0].length == 0) {
          needItemList = false
        } else {
          var personal = dataArray[0]
          for (var index = 0; index < personal.length; ++index) {
            var item = {
              score: personal[index].score,
              name: personal[index].nickname,
              imageUrl: personal[index].avatarurl,
              userId: personal[index].uid,
            }
            if (index == 0) {
              item.color = '#ffb9e0'
            } else if (index == 1) {
              item.color = '#fe6941'
            } else if (index == 2) {
              item.color = '#2cabee'
            }
            personalList.push(item)
          }
        }
      }
      if (dataArray[1] == null) {
        if (itemList.length == 3) {
          itemList.splice(1, 2)
        }
      } else {
        blueLikes = dataArray[1].zan_blue
        redLikes = dataArray[1].zan_red
        blueAverageScore = dataArray[1].fs_blue
        redAverageScore = dataArray[1].fs_red
        var groupData = dataArray[1].list
        var blueList = []
        var redList = []
        for(var index = 0; index < groupData.length; ++index) {
          var item = groupData[index]
          if (item.group != undefined && item.group == '2') {
            blueList.push({
              blueName: item.nickname,
              blueUrl: item.avatarurl,
              blueScore: item.score
            })
          } else if (item.group != undefined && item.group == '1') {
            redList.push({
              redName: item.nickname,
              redUrl: item.avatarurl,
              redScore: item.score
            })
          }
        }

        var maxLength = blueList.length
        if (maxLength < redList.length){
          maxLength = redList.length
        }

        for (var index = 0; index < maxLength; ++index) {
          var item = {}
          if (index < blueList.length) {
            item.blueName = blueList[index].blueName
            item.blueUrl = blueList[index].blueUrl
            item.blueScore = blueList[index].blueScore
          } else {
            item.blueName = ''
            item.blueUrl = ''
            item.blueScore = ''
          }

          if (index < redList.length) {
            item.redName = redList[index].redName
            item.redUrl = redList[index].redUrl
            item.redScore = redList[index].redScore
          } else {
            item.redName = ''
            item.redUrl = ''
            item.redScore = ''
          }
          groupList.push(item)
        }
        
        if (dataArray[2] == null) {
          if (itemList.length == 3) {
            itemList.splice(2, 1)
          } 
        } else {
          var home = dataArray[2]
          baseTool.print(home)
          for (var index = 0; index < home.length; ++index) {
            var item = {
              score: home[index].fscore,
              name: home[index].nickname,
              imageUrl: home[index].avatarurl,
              userId: home[index].uid,
            }
            if (index == 0) {
              item.color = '#ffb9e0'
            } else if (index == 1) {
              item.color = '#fe6941'
            } else if (index == 2) {
              item.color = '#2cabee'
            }
            homeList.push(item)
          }
        }
      }

      if (personalList.length > 0) {
        needItemList = true
      }
      baseTool.print(needItemList)
      that.setData({
        teamName: res.room_name,
        loadDone: true,
        itemList: itemList,
        needItemList: needItemList,
        personalList: personalList,
        groupList: groupList,
        homeList: homeList,
        blueLikes: blueLikes,
        redLikes: redLikes,
        blueAverageScore: blueAverageScore,
        redAverageScore: redAverageScore,
        days: res.now_day
      })
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.print(res)
    })
  },
  shareClick: function() {
    var that = this
    wx.navigateToMiniProgram({
      appId: 'wx315eebaa0466635a',
      path: 'page/main/auto_code?room_id=' + that.data.classId + '&uid=' + loginManager.getMemberId(),
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  modifyClick: function() {
    var that = this
    wx.navigateTo({
      url: '../createClass/createClass?classId=' + that.data.classId + '&isCreate=1&teamName=' + that.data.teamName,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})