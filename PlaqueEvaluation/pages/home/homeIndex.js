// pages/home/homeIndex.js
const baseTool = require('../../utils/baseTool.js')
const baseNetLinkTool = require('../../utils/baseNetLinkTool.js')
const loginManager = require('../../manager/loginManager.js')
const baseMessageHandler = require('../../utils/baseMessageHandler.js')
const baseDeviceSynTool = require('../../utils/baseDeviceSynTool.js')
const baseURL = require('../../utils/baseURL.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: false,
    hasData: false,
    gameName: '',
    gameId: '',
    showMenu: false,
    isHaveDevice: false,
    isSyncNow: false,
    videoURL: 'http://qnimage.hydrodent.cn/junbancepingyanshi.mp4',
    papSectionDataArray: [{
      rowDataArray: []
    }],
    playerCount: 0,
    bindingCount: 0,
    brushCount: 0,
    noBindingCount: 0,
    currentDeviceObject: {} // 当前设备信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.startPullDownRefresh()
    let that = this
    that.registerCallBack()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.setData({
      isHaveDevice: baseNetLinkTool.getIsHaveDevice()
    })
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
    baseDeviceSynTool.clearDeviceSyn()
  },
  onPageScroll: function(e) {
    baseTool.print(e)
    let that = this

    if (that.data.showMenu == true) {
      that.setData({
        showMenu: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    that.getHomePage()
    if (that.data.showMenu == true) {
      that.setData({
        showMenu: false
      })
    }
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
  getHomePage: function () {
    let that = this
    // 正在同步中, 刷新无需
    if (that.data.isSyncNow) {
      baseTool.showToast("设备正在同步中")
      wx.stopPullDownRefresh()
      return
    }
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("homePage", "获取首页测评信息").then(res => {
      // 无测评
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let hasData = false
      let loadDone = true
      let windowHeight = 0
      let contentHeight = 0
      let gameId = ''
      let gameName = ''
      // 设计稿上需要 1038rpx 的内容高度, 转成像素点
      windowHeight = baseTool.toPixel(1038)
      // 实际除去导航栏和底部 tabBar 的高度
      contentHeight = wx.getSystemInfoSync().windowHeight
      // 如果 内容区高度比设计需要的大
      if (contentHeight > windowHeight) {
        windowHeight = contentHeight;
      }
      if (res == undefined) {
        wx.setNavigationBarTitle({
          title: "菌斑测评",
        })
        that.setData({
          loadDone: loadDone,
          hasData: false,
          height: windowHeight,
        })
      } else {
        gameId = res.gameId
        gameName = res.name
        wx.setNavigationBarTitle({
          title: gameName ? gameName : "菌斑测评"
        })
        that.data.createTime = res.createTime
        that.data.gameId = gameId
        that.data.gameName = gameName
        loadDone = false
        if (that.data.papSectionDataArray[0].rowDataArray.length > 0) {
          loadDone = true
        }
        that.setData({
          loadDone: loadDone,
          height: windowHeight,
        })
        that.getPlayers()
      }
      // setTimeout(() => {
      //   that.setData({
      //     showShare: true
      //   })
      // }, 1000)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  startClick: function (e) {
    let that = this
    wx.navigateTo({
      url: '/pages/contest/startContest/startContest?gameId=' + that.data.gameId + '&gameName=' + that.data.gameName
    })
  },
  endClick: function (e) {
    let that = this
    baseTool.showAlertInfoWithCallBack({
      title: "结束测评将直接关闭测评",
      content: "请确认是否关闭本次测评",
      showCancel: true,
      cancelText: "确定",
      confirmText: "我再想想"
    }, (res) => {
      if (res.type == 0) {
        baseNetLinkTool.getRemoteDataFromServer("finishedGame", "结束测评", {
          gameId: that.data.gameId
        }).then(res => {
          baseTool.print(res)
          wx.startPullDownRefresh()
        }).catch(res => {
          baseNetLinkTool.showNetWorkingError(res)
        })
      }
    })

  },
  shareClick: function (e) {
    let that = this
    wx.navigateTo({
      url: '/pages/showScreen/showContest/showContest?gameId=' + that.data.gameId + '&applyTime=' + that.data.createTime
    })
  },
  createContest: function () {
    // 完善诊所信息
    let that = this
    loginManager.completeClinicInfo("创建测评").then(res => {
      let isHaveDevice = that.data.isHaveDevice
      baseTool.print(isHaveDevice)
      if (isHaveDevice == '') {
        baseTool.showAlertInfoWithCallBack({
          title: '暂无智能设备哦~',
          content: '请进入添加设备页面',
          showCancel: true,
          cancelText: '暂时没空',
          confirmText: '添加设备',
        }, res => {
          baseTool.print(res)
          if (res.type) {
            wx.navigateTo({
              url: '/pages/my/deviceManage/deviceManage',
            })
          }
        })
        return
      }
      baseNetLinkTool.getRemoteDataFromServer("addGame", "创建测评", {
        clinicId: baseNetLinkTool.getClinicId()
      }).then(res => {
        wx.startPullDownRefresh()
        // baseTool.showAlertInfoWithCallBack({
        //   title: "测评创建成功",
        //   content: "请按右上角“实时投屏”- 将分享页投至屏幕，测评者即可扫码报名",
        //   confirmText: "我知道了"
        // }, (res) => {})
      }).catch(res => {
        baseNetLinkTool.showNetWorkingError(res)
      })
    })
  },
  showIntroPage: function () {
    let that = this
    let clinicId = baseNetLinkTool.getClinicId()
    let firstLogin = baseTool.valueForKey("firstLoginHome")
    if (clinicId == '' && firstLogin == '') {
      that.setData({
        showIntroPage: true
      })
      baseTool.setValueForKey(true, "firstLoginHome")
    }
  },
  menuListClick: function (res) {
    baseTool.print(1)
    let that = this
    let item = parseInt(res.currentTarget.dataset.item)
    switch (item) {
      case 0:
        {
          // 提交设备编号跟已保存数据
          baseMessageHandler.postMessage('brushContestDetail', res => {
            res({
              gameIds: that.data.gameId
            })
          }).then(res => {
            wx.navigateTo({
              url: '/pages/my/brushContestDetail/brushContestDetail',
            })
          })
          break;
        }
      case 1:
        {
          that.shareClick()
          break;
        }
      case 2:
        {
          that.setData({
            showMenu: true
          })
          break;
        }
    }

  },
  menuListRowClick: function (res) {
    let that = this
    let row = parseInt(res.currentTarget.dataset.row)
    baseTool.print(row)
    switch (row) {
      case 0:
        {
          wx.navigateTo({
            url: '/pages/contest/contestVideoPlay/contestVideoPlay',
          })
          break;
        }
      case 1:
        {
          wx.navigateTo({
            url: '/pages/my/brushContestList/brushContestList'
          })
          break;
        }
      case 2:
        {
          that.endClick()
          break;
        }
      case 3:
        {
          wx.navigateTo({
            url: '/pages/contest/publicNumberQRCode/publicNumberQRCode',
          })
        }
    }
    that.setData({
      showMenu: false
    })
  },
  deviceManagerClick: function () {
    // 完善诊所信息
    loginManager.completeClinicInfo("查看设备管理哦~").then(res => {
      wx.navigateTo({
        url: '/pages/my/deviceManage/deviceManage',
      })
    })
  },
  getPlayers: function () {
    let that = this
    // 正在同步中, 刷新无需
    if (that.data.isSyncNow) {
      baseTool.showToast("设备正在同步中")
      return
    }
    let stateArray = ["等待中", "测评中", "完成"]
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("getPlayers", "绑定设备", {
      gameId: that.data.gameId
    }).then(res => {
      // 隐藏 
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      // 初始化
      let papPlayerList = res.papPlayerList
      let papSectionDataArray = that.data.papSectionDataArray
      papSectionDataArray[0].rowDataArray.length = 0
      let hasData = true
      let loadDone = true
      that.synDeviceArray.length = 0
      let playerCount = res.playerCount
      let brushCount = res.brushCount
      let bindingCount = res.bindingCount
      let noBindingCount = res.noBindingCount
      if (papPlayerList) {
        let rowDataArray = papSectionDataArray[0].rowDataArray
        rowDataArray.length = 0;
        for (let index = 0; index < papPlayerList.length; ++index) {
          let itemObject = papPlayerList[index]
          rowDataArray.push({
            state: itemObject.status,
            stateText: stateArray[itemObject.status],
            deviceName: itemObject.deviceNote ? itemObject.deviceNote : '--',
            plaqueLevel: itemObject.plaqueLevel != undefined ? itemObject.plaqueLevel : '--',
            // accuracy: itemObject.accuracy ? itemObject.accuracy : '--',
            name: itemObject.name ? itemObject.name : '--',
            macAddress: itemObject.macAddress ? itemObject.macAddress : '',
            gameName: that.data.gameName ? that.data.gameName : '',
            playerId: itemObject.playerId ? itemObject.playerId : '',
            gameId: that.data.gameId ? that.data.gameId : '',
            brushingMethodId: 'a002c7680a5f4f8ea0b1b47fa3f2b947',
            recordId: itemObject.recordId ? itemObject.recordId : '',
            telephone: itemObject.telephone ? itemObject.telephone : '',
            gumCleaningValue: itemObject.gumCleaningValue != undefined ? itemObject.gumCleaningValue : '--',
            overallScore: itemObject.overallScore != undefined ? itemObject.overallScore : '--',
            evaluationTime: itemObject.evaluationTime ? itemObject.evaluationTime.substring(0, itemObject.evaluationTime.length - 3) : '--',
            id: itemObject.playerId ? itemObject.playerId.substr(itemObject.playerId.length - 6, 6) : '',
            subscribe: itemObject.subscribe ? itemObject.subscribe : '',
            isMark: itemObject.isMark ? itemObject.isMark : ''
          })

          if (itemObject.macAddress && itemObject.status == 1) {
            itemObject.stateText = "搜索中..."
            itemObject.brushingMethodId = 'a002c7680a5f4f8ea0b1b47fa3f2b947'
            that.synDeviceArray.push(itemObject)
            baseTool.print(that.synDeviceArray)
          }
        }

        // rowDataArray.sort((a, b) => {
        //   if (a.overallScore == '--' && b.overallScore != '--') {
        //     return 1
        //   } else if (b.overallScore == '--' && a.overallScore != '--') {
        //     return -1
        //   } else if (a.overallScore == '--' && b.overallScore == '--') {
        //     return 0
        //   } else {
        //     return b.overallScore - a.overallScore
        //   }
        // })
      }

      that.setData({
        hasData: hasData,
        loadDone: loadDone,
        playerCount: playerCount,
        brushCount: brushCount,
        bindingCount: bindingCount,
        papSectionDataArray: papSectionDataArray,
        noBindingCount: noBindingCount
      })

      baseTool.print(that.synDeviceArray)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  getInputContent: function (e) {
    baseTool.print(e)
    let that = this
    let isTrue = e.detail.value.match(/^[a-zA-Z0-9\u4e00-\u9fa5]+$/)
    if (isTrue || e.detail.value == '') {
      that.setData({
        addPlayerName: e.detail.value
      })
    } else {
      that.setData({
        addPlayerName: that.data.addPlayerName
      })
      baseTool.showToast("参赛者名称不能含有特殊字符!")
    }
  },
  addMemberClick: function () {
    let that = this
    if (that.data.isSyncNow) {
      baseTool.showToast("设备正在同步中")
      return
    }
    if (!that.data.addPlayerName) {
      baseTool.showToast("参赛者名称不能为空")
      return
    }
    let brushingMethodId = "a002c7680a5f4f8ea0b1b47fa3f2b947"

    if (that.data.isArcBrushingMethod == 1) {
      brushingMethodId = "6827c45622b141ef869c955e0c51f9f8"
    }
    baseNetLinkTool.getRemoteDataFromServer("addPlayer", "添加参赛者名称", {
      name: that.data.addPlayerName,
      brushingMethodId: brushingMethodId,
      gameId: that.data.gameId,
      clinicId: baseNetLinkTool.getClinicId()
    }).then(res => {
      baseTool.print(res)
      that.getPlayers()
      that.setData({
        addPlayerName: ''
      })
      // wx.sendSocketMessage({
      //   data: that.data.gameId
      // })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  registerCallBack: function () {
    let that = this
    baseMessageHandler.addMessageHandler("refresh", this, res => {
      that.getHomePage()
    }).then(res => {
      that.getHomePage()
    })

    baseMessageHandler.addMessageHandler("deviceSynMessage", that, res => {

      if (res.code < 2000) {
        baseTool.print(res.text)
        let codeArray = [1000, 1004]
        let index = codeArray.indexOf(res.code)
        if (index == -1) {
          return
        }
        // baseURL.baseState == false
        let currentDeviceObject = that.data.currentDeviceObject
        currentDeviceObject.stateText = res.text
        that.setData({
          currentDeviceObject: currentDeviceObject
        })
        if (res.code == 1000) {
          baseDeviceSynTool.clearDeviceSyn()
          let timer = setTimeout(function () {
            // 如果 5s 没搜索到, 则超时
            clearTimeout(timer)
            that.temporaryData.synDeviceIndex++
            that.synDeviceObject()
          }, 1000)
        }
      } else {
        baseTool.showToast(res.text)
        let currentDeviceObject = that.data.currentDeviceObject
        currentDeviceObject.stateText = res.text
        that.setData({
          currentDeviceObject: currentDeviceObject
        })
        baseDeviceSynTool.clearDeviceSyn()
        let timer = setTimeout(function () {
          // 如果 5s 没搜索到, 则超时
          clearTimeout(timer)
          that.temporaryData.synDeviceIndex++
          that.synDeviceObject()
        }, 1000)
      }
    })
  },
  removeCallBack: function () {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler('deviceSynMessage', this)
  },
  synDeviceClick: function () {
    let that = this
    that.temporaryData.synDeviceIndex = 0
    that.temporaryData.deviceArray = that.synDeviceArray
    that.synDeviceObject()
    // 清理数据
    baseDeviceSynTool.clearDeviceData()
  },
  synDeviceObject: function () {
    let that = this
    if (that.temporaryData.synDeviceIndex > that.temporaryData.deviceArray.length - 1) {
      // 清理设备同步信息
      baseDeviceSynTool.clearDeviceSyn()
      let timer = setTimeout(function () {
        // 如果 5s 没搜索到, 则超时
        clearTimeout(timer)
        that.setData({
          currentDeviceObject: {},
          isSyncNow: false
        })
        that.uploadDeviceData()
      }, 2000)
      return
    }
    let deviceObject = that.temporaryData.deviceArray[that.temporaryData.synDeviceIndex]
    baseTool.print(that.temporaryData.synDeviceIndex)
    baseDeviceSynTool.synDeviceWithDeviceObject(deviceObject)
    deviceObject.stateText = "搜索中..."
    that.setData({
      isSyncNow: true,
      currentDeviceObject: deviceObject
    })
  },
  synDeviceArray: [],
  temporaryData: {
    deviceArray: [],
    synDeviceIndex: 0
  },
  uploadDeviceData: function () {
    // return
    let that = this
    baseTool.print("开始上传")
    let dataItemList = baseDeviceSynTool.getDataItemList()
    if (dataItemList.length == 0) {
      wx.hideLoading()
      that.setData({
        isSyncNow: false
      })
      baseTool.showToast("本次同步无数据");
      return
    }
    let jsonData = JSON.stringify(dataItemList)
    baseTool.print(jsonData)
    baseNetLinkTool.postRemoteBrushTeethRecord({
      gameName: that.data.gameName,
      gameId: that.data.gameId,
      data: jsonData
    }).then(res => {
      baseTool.print(res)
      wx.hideLoading()

      that.setData({
        isSyncNow: false
      })
      baseTool.showToast("同步完成")
      that.getPlayers()
    }).catch(res => {
      wx.hideLoading()
      that.setData({
        isSyncNow: false
      })
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  synSingleDeviceClick: function (e) {

    let that = this
    that.temporaryData.synDeviceIndex = 0
    that.temporaryData.deviceArray = [e.detail.dataObject]
    that.synDeviceObject()
    // 清理数据
    baseDeviceSynTool.clearDeviceData()
  },
  previewReportClick: function (e) {
    baseTool.print(e)
    let that = this
    let indexPath = e.detail.indexPath
    let currentItem = that.data.papSectionDataArray[indexPath.section].rowDataArray[indexPath.row]
    baseMessageHandler.postMessage("previewReport", res => {
      res({
        url: baseNetLinkTool.getWebDomain() + 'web/plaqueEvaluating/report/index.html?',
        name: currentItem.name,
        recordId: currentItem.recordId,
        playerId: currentItem.playerId
      })
    }).then(res => {
      wx.navigateTo({
        url: '/pages/showScreen/signUp/signUp?',
      })
    }).catch(res => {
      baseTool.print(res)
    })
  },
  sendDeviceReportClick: function (e) {
    let dataObject = e.detail.dataObject

    if (dataObject.subscribe == 0) {
      baseTool.showAlertInfoWithCallBack({
        title: "提示:",
        content: "患者未关注公众号, 无法发送报告, 是否查看公众号二维码?",
        showCancel: true,
        cancelText: "取消",
        cancelColor: '#333',
        confirmText: "立即查看",
        confirmColor: '#00a0e9',
      }, (res) => {
        if (res.type == 1) {
          wx.navigateTo({
            url: '/pages/contest/publicNumberQRCode/publicNumberQRCode',
          })
        }
      })
      return
    }
    baseNetLinkTool.getRemoteDataFromServer("sendTemplateMsg", "发送报告", {
      playerId: dataObject.playerId,
      recordId: dataObject.recordId
    }).then(res => {
      baseTool.showToast("发送成功!")
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  deleteRowClick: function (e) {
    let that = this
    if (that.data.isSyncNow) {
      baseTool.showToast("设备正在同步中")
      return
    }
    baseTool.print(e.detail)
    let deleteIndexPath = e.detail.indexPath
    let playerId = e.detail.playerId
    // 巴氏刷牙
    baseTool.getRemoteDataFromServer("delPlayer", "删除用户", {
      playerId: playerId
    }).then(res => {
      let papSectionDataArray = that.data.papSectionDataArray
      let rowDataArray = papSectionDataArray[deleteIndexPath.section].rowDataArray
      rowDataArray.splice(deleteIndexPath.row, 1)
      that.setData({
        papSectionDataArray: papSectionDataArray
      })

      // wx.sendSocketMessage({
      //   data: that.data.gameId,
      // })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  }
})