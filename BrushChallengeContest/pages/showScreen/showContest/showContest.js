// pages/showScreen/showContest/showContest.js
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const qrcodeTool = require('../../../utils/qrcode.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    status: 0,
    scale: 2,
    gameId: '',
    qrcodeUrl: '',
    playerList: [],
    sectionDataArray: [],
    selectIndex: 0,
    showJoinName: true,
    showMethod: 0,
    papSectionDataArray: [],
    arcSectionDataArray: [],
    text: '',
    marqueePace: 1, //滚动速度
    size: 14,
    interval: 20, // 时间间隔
    contestWidth: 0,
    textWidth: 0,
    screenWidth: 0,
    distance: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let windowInfo = wx.getSystemInfoSync()
    baseTool.toRpx(50)
    let scale = baseTool.toPixel(1)
    baseTool.print(scale)
    let that = this
    that.setData({
      screenWidth: windowInfo.screenWidth,
      scale: scale,
      distance: scale * 225
    })

    if (options.gameId) {
      that.data.gameId = options.gameId
    }
    if (options.applyTime) {
      that.data.applyTime = options.applyTime.split(' ')[0]
    }
    let clinicName = baseNetLinkTool.getClinicName()
    wx.setNavigationBarTitle({
      title: clinicName,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.loadData()
    // that.registerCallBack()
    that.openSocket()
    that.socketClose()
    that.onSocketMessage()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    baseTool.clearSingleTimer()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  loadData: function() {
    let that = this
    wx.showNavigationBarLoading()
    baseTool.clearSingleTimer()
    baseNetLinkTool.getRemoteDataFromServer("forScreenInformation", "投屏数据", {
      gameId: that.data.gameId
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      let loadDone = false
      if (res == undefined) {
        that.setData({
          loadDone: loadDone
        })
        return
      }
      loadDone = true
      let status = res.status
      let ticket = res.ticket
      let qrcodeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket
      let sectionDataArray = that.data.sectionDataArray
      let arcSectionDataArray = that.data.arcSectionDataArray
      let papSectionDataArray = that.data.papSectionDataArray
      let text = ''
      let contestWidth = 0
      let textWidth = 0
      let showText = false
      if (status == 1) {
        that.data.playerList = res.playerList
        sectionDataArray.length = 0
        let playerList = res.playerList
        let length = playerList.length > 10 ? 5 : parseInt((playerList.length + 1) / 2)
        for (let sectionIndex = 0; sectionIndex < length; ++sectionIndex) {
          let leftIndex = (sectionIndex * 2) % playerList.length
          let rightIndex = (leftIndex + 1) % playerList.length
          baseTool.print([leftIndex, rightIndex, sectionIndex, length])
          let leftName = that.getName(playerList[leftIndex].name) + '参加了比赛'
          let rightName = that.getName(playerList[rightIndex].name) + '参加了比赛'
          if (rightIndex == leftIndex || rightIndex == 0) {
            rightName = ''
          }
          sectionDataArray.push({
            leftName: leftName,
            rightName: rightName
          })
        }
      } else if (status == 2) {
        papSectionDataArray.length = 0
        arcSectionDataArray.length = 0
        let papPlayerList = res.papPlayerList
        let arcPlayerList = res.arcPlayerList
        papPlayerList.sort((a, b) => {
          if (b.score != a.score) {
            return b.score - a.score
          } else {
            return b.accuracy - a.accuracy

          }
        })

        let nameAray = res.playerList.map((value) => {
          return value.name + '参加了比赛'
        })

        text = nameAray.join('\xa0\xa0\xa0\xa0\xa0\xa0\xa0')
        let size = that.data.scale * 28
        contestWidth = size * text.length
        textWidth = that.data.screenWidth - that.data.distance
        baseTool.print([contestWidth, textWidth])
        if (contestWidth > textWidth) {
          // showText = true
        }

        arcPlayerList.sort((a, b) => {
          return b.score - a.score
        })
        let length = papPlayerList.length
        if (length > 6) {
          length = 6
        }

        for (let index = 0; index < length; ++index) {
          papSectionDataArray.push({
            id: index,
            score: papPlayerList[index].score,
            name: papPlayerList[index].name,
            accuracy: papPlayerList[index].accuracy
          })
        }

        length = arcPlayerList.length
        if (length > 5) {
          length = 5
        }
        for (let index = 0; index < length; ++index) {
          arcSectionDataArray.push({
            id: index,
            score: arcPlayerList[index].score,
            name: arcPlayerList[index].name
          })
        }
      }
      that.setData({
        qrcodeUrl: qrcodeUrl,
        status: status,
        loadDone: loadDone,
        papSectionDataArray: papSectionDataArray,
        sectionDataArray: sectionDataArray,
        arcSectionDataArray: arcSectionDataArray,
        text: text,
        textWidth: textWidth,
        marginDistance: 0,
        contestWidth: contestWidth,
        showText: showText
      })

      that.createQrcode()

      if (status == 1 && that.data.playerList.length > 10) {
        that.startScroll()
      } else if (status == 2) {
        // that.startChangeRank()
        that.scrolltxt()
      }
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseNetLinkTool.showNetWorkingError(res)
    })

  },
  startScroll: function() {
    let that = this
    baseTool.startTimer(function(total, timer) {

      let sectionDataArray = that.data.sectionDataArray
      let selectIndex = that.data.selectIndex
      let playerList = that.data.playerList
      if (selectIndex == 0) {
        selectIndex = sectionDataArray.length
      }
      sectionDataArray.splice(0, 1)
      let leftIndex = (selectIndex * 2) % playerList.length
      let rightIndex = (leftIndex + 1) % playerList.length
      let leftName = that.getName(playerList[leftIndex].name) + '参加了比赛'
      let rightName = that.getName(playerList[rightIndex].name) + '参加了比赛'
      if (rightIndex == leftIndex) {
        rightName = ''
      }
      sectionDataArray.push({
        leftName: leftName,
        rightName: rightName
      })
      that.data.selectIndex = selectIndex + 1
      baseTool.print(total)
      that.setData({
        sectionDataArray: sectionDataArray,
      })

    }, 3000, 3000000000000)
  },
  getName: function(res) {
    if (res.length > 3) {
      return res.substr(0, 1) + '**' + res.substr(res.length - 1, 1)
    } else {
      return res
    }
  },
  openSocket: function() {
    let that = this
    let memberId = baseNetLinkTool.getMemberId()
    let gameId = that.data.gameId
    let url = baseNetLinkTool.getSocketURLPrefix() + memberId + "/" + gameId + "_show/2"
    baseTool.print(url)
    wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail')
      }
    })

    wx.onSocketOpen(function(res) {
      console.info('websocket连接成功');
      baseTool.startTimer((res) => {
// wx.sendSocketMessage({
      //   data: ["ddd"],
      // })
      }, 30, 10000000)
    });
  },
  socketClose: function() {
    let that = this
    wx.onSocketClose(function(res) {
      console.log('WebSocket 已关闭！', res)
      that.openSocket()
    });
    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败，请检查！', res)
    });
  },
  onSocketMessage: function() {
    let that = this
    wx.onSocketMessage(function(res) {
      console.log('收到服务器内容：' + res.data)
      that.loadData()
    });
  },
  registerCallBack: function() {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.loadData()
    }).then(res => {
      that.loadData()
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
  },
  startChangeRank: function() {
    let that = this
    baseTool.startTimer(function(total, timer) {
      that.setData({
        showMethod: !that.data.showMethod
      })
    }, 5000, 3000000000000)
  },
  scrolltxt: function() {
    baseTool.print("eee")
    let that = this;
    let length = that.data.contestWidth;

    let interval = setInterval(function() {
      let marginDistance = that.data.marginDistance;
      if (marginDistance < length) { //判断是否滚动到最大宽度
        that.setData({
          marginDistance: marginDistance + that.data.marqueePace
        })
      } else {
        that.setData({
          marginDistance: -that.data.textWidth // 直接重新滚动
        });
        clearInterval(interval);
        that.scrolltxt();
      }
      // baseTool.print(that.data.marginDistance)
    }, that.data.interval);
  },
  createQrcode: function() {
    let that = this
    let clinicId = baseNetLinkTool.getClinicId()
    let clinicName = baseNetLinkTool.getClinicName()
    let applyTime = that.data.applyTime
    let scale = that.data.scale
    let width = scale * (that.data.status ? 185 : 325)
    let canvasId = 'my-scan' + that.data.status + '-qrcode'
    let qrcodeUrl = 'http://challenge.32teeth.cn/index.html?gameId=' + that.data.gameId + '&clinicId=' + clinicId + '&clinicName=' + clinicName + '&applyTime=' + applyTime
    qrcodeTool.api.draw(qrcodeUrl, canvasId, width, width, that)
    baseTool.print(qrcodeUrl)
    let timer = setTimeout(function(){
      
       wx.canvasToTempFilePath({
        canvasId: 'my-scan-qrcode',
        success: function(res) {
          that.data.qrcodeUrl = res.tempFilePath
          baseTool.print(that.data.qrcodeUrl)
        }
      }, that)
      
      clearTimeout(timer)

    }, 1000)
  },
  previewClick: function() {
    let that = this
    
    baseTool.previewSingleImage(that.data.qrcodeUrl)
  }
})