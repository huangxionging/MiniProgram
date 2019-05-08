// pages/contest/startContest/startContest.js
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const bluetoothManager = require('../../../manager/bluetoothManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadDone: true,
    isArcBrushingMethod: 0,
    isSyncNow: false,
    playerCount: 0,
    synTime: 60,
    papSectionDataArray: [{
      rowDataArray: []
    }],
    arcSectionDataArray: [{
      rowDataArray: []
    }],
    addPlayerName: "",
    synDeviceObject: {},
    // 产生的同步列表
    synDeviceArray: [],
    synDeviceIndex: 0,
    tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 notify
    tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 write
    tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
    /**
     * 设备回复的数据
     */
    deviceDataList: [],
    /**
     * 读取的设备数据
     */
    dataObjectList: [],
    showIntroPage: false,
    showIntroStep: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    baseTool.print(options)
    if (options.gameId) {
      that.data.gameId = options.gameId
    }
    if (options.gameName) {
      that.data.gameName = options.gameName
      wx.setNavigationBarTitle({
        title: that.data.gameName
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let that = this
    that.registerCallBack()
    
    that.openSocket()
    that.socketClose()
    
    that.onSocketMessage()
    
    // wx.closeSocket({
    //   code: 1000,
    //   reason: '',
    //   success: function(res) {},
    //   fail: function(res) {},
    //   complete: function(res) {},
    // })
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

    let that = this
    that.removeCallBack()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let that = this
    // that.loadData()
  },
  openSocket: function() {
    let that = this
    let memberId = baseNetLinkTool.getMemberId()
    let gameId = that.data.gameId
    let url = baseNetLinkTool.getSocketURLPrefix() + memberId + "/" + gameId + "_inThenGame/2"
    baseTool.print(url)
    wx.connectSocket({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success() {
        console.log('success');
        wx.onSocketOpen(function (res) {
          console.info('websocket连接成功');
          wx.sendSocketMessage({
            data: ["ddd"],
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        });
      },
      fail() {
        console.log('fail')
      }
    })
  },
  socketClose: function() {
    let that = this
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！', res)
      that.openSocket()
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！', res)
    });
  },
  onSocketMessage: function() {
    let that = this
    wx.onSocketMessage(function (res) {
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

    baseMessageHandler.addMessageHandler('bluetoothMessage', that, res => {
      // 连接成功
      baseTool.print(res)
      switch (res.type) {
        case 0: {
          wx.hideLoading()
          that.setData({
            isSyncNow: false
          })
          if (that.data.isConnectDevice) {
            that.data.synDeviceIndex++
            that.startSynDevice()
          }
          return
          break
        }
        case 1: {
          baseTool.print("连接成功")
          // 开始点亮设备 // 发送设备点亮指令
          break
        }
        case 2: {
          baseTool.print("设备写成功")
          break
        }
        case 3: {
          break
        }
        case 4: {
          that.foundDevices()
          that.deviceCharacteristicValueChange()
          break
        }
      }
    })
  },
  removeCallBack: function() {
    baseMessageHandler.removeSpecificInstanceMessageHandler("refresh", this)
    baseMessageHandler.removeSpecificInstanceMessageHandler('bluetoothMessage', this)
  },
  loadData: function() {
    let that = this
    // 正在同步中, 刷新无需
    if (that.data.isSyncNow) {
      baseTool.showToast("设备正在同步中")
      return
    }
    let stateArray = ["等待中", "比赛中", "完成"]
    wx.showNavigationBarLoading()
    baseNetLinkTool.getRemoteDataFromServer("getPlayers", "绑定设备", {
      gameId: that.data.gameId
    }).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      let papPlayerList = res.papPlayerList
      let papSectionDataArray = that.data.papSectionDataArray
      that.data.synDeviceArray.length = 0
      that.data.synDeviceObject = {}
      that.data.synDeviceIndex = 0
      let playerCount = 0
      if (papPlayerList) {
        let rowDataArray = papSectionDataArray[0].rowDataArray
        rowDataArray.length = 0;
        for (let index = 0; index < papPlayerList.length; ++index) {
          let itemObject = papPlayerList[index]
          if (itemObject.score == -1) {
            itemObject.score = '--';
          }
          rowDataArray.push({
            state: itemObject.status,
            stateText: stateArray[itemObject.status],
            deviceName: itemObject.deviceNote ? itemObject.deviceNote : '--',
            score: itemObject.score ? itemObject.score : '--',
            accuracy: itemObject.accuracy ? itemObject.accuracy : '--',
            name: itemObject.name ? itemObject.name : '--',
            macAddress: itemObject.macAddress ? itemObject.macAddress : '',
            gameName: that.data.gameName ? that.data.gameName : '',
            playerId: itemObject.playerId ? itemObject.playerId : '',
            gameId: that.data.gameId ? that.data.gameId : '',
            brushingMethodId: 'a002c7680a5f4f8ea0b1b47fa3f2b947'
          })

          if (itemObject.macAddress && itemObject.status == 1) {
            playerCount++
            that.data.synDeviceObject[itemObject.macAddress] = {
              macAddress: itemObject.macAddress,
              gameId: that.data.gameId,
              brushingMethodId: 'a002c7680a5f4f8ea0b1b47fa3f2b947',
              playerId: itemObject.playerId ? itemObject.playerId : '',
              deviceNote: itemObject.deviceNote ? itemObject.deviceNote : '--',
              accuracy: itemObject.accuracy ? itemObject.accuracy : '--',
              name: itemObject.name ? itemObject.name : '--',
            }
            // that.data.synDeviceArray.push(itemObject)
          }
        }
      }
      let arcPlayerList = res.arcPlayerList
      let arcSectionDataArray = that.data.arcSectionDataArray
      baseTool.print(arcPlayerList)
      if (arcPlayerList) {
        let rowDataArray = arcSectionDataArray[0].rowDataArray
        rowDataArray.length = 0;
        for (let index = 0; index < arcPlayerList.length; ++index) {
          let itemObject = arcPlayerList[index]
          baseTool.print(itemObject)
          rowDataArray.push({
            state: itemObject.status,
            stateText: stateArray[itemObject.status],
            deviceName: itemObject.deviceNote ? itemObject.deviceNote : '--',
            score: itemObject.score ? itemObject.score : '--',
            name: itemObject.name ? itemObject.name : '--',
            macAddress: itemObject.macAddress ? itemObject.macAddress : '',
            gameName: that.data.gameName ? that.data.gameName : '',
            playerId: itemObject.playerId ? itemObject.playerId : '',
            gameId: that.data.gameId ? that.data.gameId : '',
            accuracy: itemObject.accuracy ? itemObject.accuracy : '--',
            brushingMethodId: '6827c45622b141ef869c955e0c51f9f8'
          })

          if (itemObject.macAddress && itemObject.status == 1) {
            playerCount++
            that.data.synDeviceObject[itemObject.macAddress] = {
              macAddress: itemObject.macAddress,
              gameId: that.data.gameId,
              brushingMethodId: '6827c45622b141ef869c955e0c51f9f8',
              playerId: itemObject.playerId ? itemObject.playerId : '',
              deviceNote: itemObject.deviceNote ? itemObject.deviceNote : '--',
              name: itemObject.name ? itemObject.name : '--',
            }
            // that.data.synDeviceArray.push(itemObject)
          }
        }
      }
      baseTool.print(that.data)

      that.setData({
        playerCount: playerCount,
        papSectionDataArray: papSectionDataArray,
        arcSectionDataArray: arcSectionDataArray
      })
      that.showIntroPage()
      baseTool.print(that.data)
    }).catch(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  addMemberClick: function() {
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
      that.loadData()
      that.setData({
        addPlayerName: ''
      })
      wx.sendSocketMessage({
        data: that.data.gameId
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  segmentChange: function(e) {
    let that = this
    if (e.target.id == "pap" && that.data.isArcBrushingMethod != 0) {
      baseTool.print(e)
      that.setData({
        isArcBrushingMethod: 0
      })
    } else if (e.target.id == "arc" && that.data.isArcBrushingMethod != 1) {
      that.setData({
        isArcBrushingMethod: 1
      })
    }
  },
  delClick: function(e) {
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
      if (that.data.isArcBrushingMethod == 0) {
        let papSectionDataArray = that.data.papSectionDataArray
        let rowDataArray = papSectionDataArray[deleteIndexPath.section].rowDataArray
        rowDataArray.splice(deleteIndexPath.row, 1)
        that.setData({
          papSectionDataArray: papSectionDataArray
        })
      } else if (that.data.isArcBrushingMethod == 1) {
        let arcSectionDataArray = that.data.arcSectionDataArray
        let rowDataArray = arcSectionDataArray[deleteIndexPath.section].rowDataArray
        rowDataArray.splice(deleteIndexPath.row, 1)
        that.setData({
          arcSectionDataArray: arcSectionDataArray
        })
      }

      wx.sendSocketMessage({
        data: that.data.gameId,
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  getInputContent: function(e) {
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
  synClick: function() {
    baseTool.print('开始同步')
    let that = this
    that.setData({
      isSyncNow: true
    })
    that.data.synDeviceIndex = 0
    that.data.synDeviceArray.length = 0
    that.data.deviceDataList.length = 0
    wx.showLoading({
      title: '同步中...',
      mask: true
    })
    bluetoothManager.reLaunchBluetoothFlow().then(res => {
      bluetoothManager.searchDeviceFlow()
      wx.setKeepScreenOn({
        keepScreenOn: true,
      })
    })
  },
  startSynDevice: function () {
    let that = this
    let index = that.data.synDeviceIndex

    if (index == that.data.synDeviceArray.length) {
      that.uploadDeviceData()
      return
    }
    let itemObject = that.data.synDeviceArray[index].itemObject
    let deviceId = that.data.synDeviceArray[index].deviceId
    that.data.isConnectDevice = true
    bluetoothManager.connectDeviceFlow(deviceId)
  },
  foundDevices: function() {
    // 设备信息 20s 后停止
    let that = this
    let stopTimer = false
    let timer = setTimeout(function () {
      // 如果 20s 内搜索到全部设备, 则不走下面代码
      clearTimeout(timer)
      if (stopTimer == true) {
        return
      }
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          // 停止搜索以后, 开始同步
          wx.hideLoading()
          // baseTool.showToast("搜索设备超时, 开始同步")
          that.startSynDevice()
        },
      })
    }, 20000)
    wx.onBluetoothDeviceFound(function(res){
      let device = res.devices[0]
      // baseTool.print(device)
      if (device.name.indexOf('game') == -1 && device.name.indexOf('32th') == -1) {
        return
      }
      // 要符合第11位大于等于2
      if (device.name.indexOf('32th-dd5414') != -1) {
        let level = parseInt(device.name.substr(11, 1), 16)
        if (level < 2) {
          return
        }
      }
      // 获得 MAC 地址
      let macAddress = device.name.split('-')[1].toUpperCase()
      if (that.data.synDeviceObject[macAddress]) {
        that.data.synDeviceArray.push({
          macAddress: macAddress,
          deviceId: device.deviceId,
          device: device,
          itemObject: that.data.synDeviceObject[macAddress]
        })

        let keys = Object.keys(that.data.synDeviceObject)
        if (that.data.synDeviceArray.length == keys.length) {
          clearTimeout(timer)
          wx.stopBluetoothDevicesDiscovery({
            success: function(res) {
              // baseTool.showToast("设备已全部搜索到, 开始同步")
              that.startSynDevice()
            },
          })
        }
      }
    })
  },
  deviceCharacteristicValueChange: function () {
    let that = this
    wx.onBLECharacteristicValueChange(function (res) {
      let values = new Uint8Array(res.value)
      let hex = baseHexConvertTool.arrayBufferToHexString(res.value).toLowerCase()
      baseTool.print([hex, '通知信息'])
      // 回复数据
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 再次回复设备
        // 写数据
        let itemObject = that.data.synDeviceArray[that.data.synDeviceIndex].itemObject
        // wx.showLoading({
        //   title: '读取' + itemObject.deviceNote + '数据',
        //   mask: false,
        // })
        bluetoothManager.writeValue(res.deviceId, bleCommandManager.connectReplyDeviceCommand())
      } else if (hex.indexOf('f30cf5') == 0) {
        baseTool.print([res, '设备常亮'])
        wx.hideLoading()
      } else if (hex.indexOf('f802') == 0) {
        // 一次数据交互结束
        baseTool.print([res, '交互结束'])
        
        that.onceDataEndReplyDevice(res.deviceId)

      } else if (hex.indexOf('f4') == 0 || hex.indexOf('f6') == 0) {
        that.processOnceData(hex, values, res.deviceId)
      } else if (hex.indexOf('f7') == 0 || hex.indexOf('f9') == 0) {
        that.newProcessOnceData(hex, values, res.deviceId)
      }
    })
  },
  onceDataEndReplyDevice: function (deviceId = '') {
    let that = this
    let buffer = bleCommandManager.onceDataEndReplyDeviceCommand()
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: that.data.tailServiceUUID,
      characteristicId: that.data.tailCharacteristicIdWrite,
      value: buffer,
      success: function (res) {
        baseTool.print([deviceId, '设备数据交互结束'])
        wx.closeBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            baseTool.print([res, '成功断开设备'])
            wx.hideLoading()
            that.data.synDeviceIndex++
            that.startSynDevice()
          },
          fail: function (res) {
            wx.hideLoading()
            that.data.synDeviceIndex++
            that.startSynDevice()
          }
        })
      },
      fail: function (res) {
        wx.hideLoading()
        that.data.synDeviceIndex++
        that.startSynDevice()
      }
    })
  },
  processOnceData: function (hex, values, deviceId = '') {
    // 刷牙数据
    let that = this
    // 定时器
    let data = that.data
    data.synNodataTimeOut = false
    data.dataHead = hex.substring(0, 2)
    //数据处理逻辑
    if (values[2] == 0) {
      data.data01 = hex
      baseTool.print(['data01:', data.data01])
    } else if (values[2] == 1) {
      data.data02 = hex
      baseTool.print(['data02:', data.data02])
    } else if (values[2] == 2) {
      data.data03 = hex
      baseTool.print(['data03:', data.data03])
      //一条完整数据拼接
      let oneCompleteData = data.data01 + data.data02 + data.data03;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      let typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      let itemObject = data.synDeviceArray[data.synDeviceIndex].itemObject
      let dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, itemObject);

      baseTool.print(["dataObject", dataObject])
      data.dataObjectList.push(dataObject);
      data.deviceDataList.push(oneCompleteData);
      baseTool.print(['dataList:', data.dataList])
      //一条完整数据回复
      let oneDataWrite = "f103" + data.dataHead;
      let typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
      baseTool.print(['reply', typedArray])
      let oneDataWriteBuffer = typedArray.buffer
      bluetoothManager.writeValue(deviceId, oneDataWriteBuffer)
    }
  },
  newProcessOnceData: function (hex, values, deviceId = '') {
    //初始化头部信息 回复要带
    let that = this
    // 定时器
    let data = that.data
    data.dataHead = hex.substring(0, 2)

    //数据处理逻辑
    if (values[2] == 0) {
      data.data01 = hex
      baseTool.print(['data01:', data.data01])
    } else if (values[2] == 1) {
      data.data02 = hex
      baseTool.print(['data02:', data.data02])

    } else if (values[2] == 2) {
      data.data03 = hex
      baseTool.print(['data03:', data.data03])

    } else if (values[2] == 3) {
      data.data04 = hex
      baseTool.print(['data04:', data.data04])
      //一条完整数据拼接
      let oneCompleteData = data.data01 + data.data02 + data.data03 + data.data04;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      let typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      let itemObject = data.synDeviceArray[data.synDeviceIndex].itemObject
      let dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, itemObject);
      //放入数据集合
      data.dataObjectList.push(dataObject);
      data.deviceDataList.push(oneCompleteData);
      //一条完整数据回复
      let oneDataWrite = "f103" + data.dataHead;
      let typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
      let oneDataWriteBuffer = typedArray.buffer
      bluetoothManager.writeValue(deviceId, oneDataWriteBuffer)
    }
  },
  uploadDeviceData: function() {
    let that = this
    baseTool.print("开始上传")
    if (that.data.dataObjectList.length == 0) {
      wx.hideLoading()
      that.data.isConnectDevice = false
      that.setData({
        isSyncNow: false
      })
      baseTool.showToast("同步完成")
      return
    }
    let jsonData = JSON.stringify(that.data.dataObjectList)
    baseTool.print(jsonData)
    baseNetLinkTool.postRemoteBrushTeethRecord({
      gameName: that.data.gameName,
      gameId: that.data.gameId,
      data: jsonData
    }).then(res => {
      baseTool.print(res)
      wx.hideLoading()
      that.data.isConnectDevice = false
      that.setData({
        isSyncNow: false
      })
      baseTool.showToast("同步完成")
      that.loadData()
      wx.sendSocketMessage({
        data: that.data.gameId
      })
    }).catch(res => {
      wx.hideLoading()
      that.data.isConnectDevice = false
      that.setData({
        isSyncNow: false
      })
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  showIntroPage: function () {
    let that = this
    let firstLoginContest = baseTool.valueForKey("firstLoginContest")
    if (firstLoginContest == '') {
      that.setData({
        showIntroPage: true
      })
      baseTool.setValueForKey(true, "firstLoginContest")
    }
  },
  iknowClick: function () {
    let that = this
    baseTool.print(that.data.showIntroStep)
    that.data.showIntroStep++ 
    if (that.data.showIntroStep > 4) {
      that.setData({
        showIntroPage: false
      })
    } else {
      that.setData({
        showIntroStep: that.data.showIntroStep
      })
    }
    
  }
})