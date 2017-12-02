// pages/contest/contest.js
const app = getApp()
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const bluetoothManager = require('../../../manager/bluetoothManager.js')

var data = {
  /**
    * 是否加载完成
    */
  loadingDone: false,
  hasData: false,
  gameId: '',
  contestTitle: '刷牙比赛1',
  contestDate: '2017-10-25',
  /**
   * 是否已经同步过
   */
  isSyn: false,
  /**
   * 是否同步中
   */
  isSynNow: false,
  dataList: [],
  dataObjectList: [],
  deviceDataList: [],
  serviceUUIDs: [],
  tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
  //尾巴读取数据的特征值 notify
  tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
  //尾巴读取数据的特征值 write
  tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
  // 同步指令计数
  synCommandCount: 0,
  deviceInfo: null,
  synSuccessCount: 0,
  synFailCount: 0,
  synNoDataCount: 0,
  deviceAllObject: {}
  synchronizeObject: {}
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
    that.getHomePage()
    baseMessageHandler.addMessageHandler('deleteContest', this, that.deleteContest).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
    app.userInfoReadyCallback = res => {
      that.getHomePage()
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
    that.getHomePage()
    wx.closeBluetoothAdapter({
      success: function(res) {
        baseTool.print([res, '成功释放资源'])
      },
      fail: function(res) {
        baseTool.print([res, '呵呵'])
      },
      complete: function(res) {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  getHomePage: function() {
    var that = this
    wx.showNavigationBarLoading()
    var getHomePagePromise = contestManager.getHomePage()
    var del = getHomePagePromise.then(res => {
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(res)
      if (typeof(res) != 'undefined' && res.playersList) {
        that.parseData(res)
      } else if (typeof (res) != 'undefined' && res.gameInfo) {
        that.deleteContest(res.gameInfo)
      } else if (typeof(res) == 'undefined'){
        data.loadingDone = true
        data.hasData = false
        that.setData(data)
        var first = baseTool.valueForKey('firstContestUser')
        if (!first) {
          wx.redirectTo({
            url: '/pages/mask/contestMask/contestMask?imageName=contest-user_mask&isResync=false',
          })
        }
      } 
    }).catch(res => {
      wx.hideNavigationBarLoading()
      baseTool.print(res)
    })
  },
  createContest: () => {
    contestManager.addContest().then(res => {
      if (typeof (res) != 'undefined') {
        var gameId = res.game.gameId
        var name = res.game.name

        wx.navigateTo({
          url: '../createContest/createContest?' + 'gameId=' + gameId + '&' + 'name=' + name,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      
    }).catch(res => {
      baseTool.print(res)
    })
    
  },
  contestReSyn: function (e) {
    baseTool.print(e)
    var that = this
    that.setData({
      isSynNow: true
    })
    wx.hideLoading()
    wx.showLoading({
      title: '同步数据中',
      mask: false,
      success: function(res) {
        // 每次从第 0个设备开始
        data.synCommandCount = 0
        data.synFailCount = 0
        data.synSuccessCount = 0
        data.synNoDataCount = 0
        data.dataObjectList.splice(0, data.dataObjectList.length)
        data.deviceDataList.splice(0, data.deviceDataList.length)
        that.synDevice()
      },
      fail: function(res) {},
      complete: function(res) {},
    })

    contestManager.tagSynGame(data.gameId).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
  },
  synDevice: function () {
    var that = this
    if (data.synCommandCount == data.dataList.length) {
      // 同步结束
      var content = '同步成功:' + data.synSuccessCount + '个; ' + '同步无数据:' + data.synNoDataCount + '个; ' + '未连接:' + data.synFailCount + '个'
      wx.hideLoading()
      wx.showModal({
        title: '同步结果',
        content: content,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {
          that.getHomePage()
          that.setData({
            isSynNow: false
          })

          wx.closeBluetoothAdapter({
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    wx.hideLoading()
    wx.showLoading({
      title: '同步第' + (data.synCommandCount + 1) + '个尾巴',
      mask: false,
      success: function(res) {

        setTimeout(function () {
          wx.closeBluetoothAdapter({
            success: function (res) {
              that.openBle()
            },
            fail: function (res) {
              that.openBle()
            },
            complete: function (res) { },
          })
        }, 3000)
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },
  openBle: function () {
    var that = this
    // 打开蓝牙
    wx.openBluetoothAdapter({
      success: function (res) {
        baseTool.print("openBluetoothAdapter: success");
        baseTool.print(res);
        //start discovery devices
        wx.startBluetoothDevicesDiscovery({
          services: [],
          success: function (res) {
            baseTool.print("startBluetoothDevicesDiscovery: success");
            baseTool.print(res);
            //Listen to find new equipment
            that.foundDevices()
          },
        })
      },
      fail: function (res) {
        baseTool.print("openBluetoothAdapter: fail");
        baseTool.print(res);
        wx.showModal({
          title: '提示',
          content: '蓝牙不可用, 请检查蓝牙和GPS状态后再使用',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#00a0e9',
          success: function (res) {
            wx.hideLoading()
            that.setData({
              isSynNow: false
            })
          },
          fail: function (res) { baseTool.print(res) },
          complete: function (res) { },
        })
      },
    })
  },
  foundDevices: function () {
    var that = this
    // 设备信息
    var stopTimer = true
    function findDeviceTimeOut(timeCount) {
      timeCount--
      if (timeCount == 0) {
        baseTool.print('定时器走完, 搜索失败')
        // 搜索失败
        wx.hideLoading()
        // 搜索不到, 失败
        data.synFailCount++
        // 同步下一个设备
        data.synCommandCount++
        data.dataObjectList.splice(0, data.dataObjectList.length)
        data.deviceDataList.splice(0, data.deviceDataList.length)
        that.synDevice()
        return
      }
      if (stopTimer == true) {
        // 成功找到尾巴
        baseTool.print('搜索成功')
        // wx.hideLoading()
        return
      }
      setTimeout(() => {
        findDeviceTimeOut(timeCount)
      }, 100)
    }
    // 开启搜索定时器
    stopTimer = false
    findDeviceTimeOut(20)

    wx.onBluetoothDeviceFound(function(res){
      var device = res.devices[0]
      // baseTool.print(device)
      if (device.name.indexOf('game') == -1) {
        return
      }
      var dataList = that.data.dataList
      var index = dataList.length
      var macAddress = device.name.split('-')[1].toUpperCase()
      baseTool.print([macAddress, data.synCommandCount])

      // 找到设备
      if (macAddress === deviceInfo.macAddress) {
        // 停止搜索设备
        // 记住当前设备信息
        data.deviceInfo = device
        // 停止搜索
        stopTimer = true
        wx.stopBluetoothDevicesDiscovery({
          success: function(res) {
            // 成功开始连接设备
            that.connectDevice()
          },
          fail: function(res) {
            baseTool.print('stopBluetoothDevicesDiscovery: fail')
          },
          complete: function(res) {},
        })
      }
    })
  },
  contestUserClick: () => {
    wx.navigateTo({
      url: '../contestUser/contestUser',
    })
  },
  /**
   * 解析数据
   */
  parseData: function(res) {
    baseTool.print(res)
    var that = this
    data.contestTitle = res.gameInfo.name
    data.contestDate = res.gameInfo.createTime
    data.gameId = res.gameInfo.gameId
    data.loadingDone = true
    data.hasData = true
    data.synchronizeObject = {}
    // 清空数组
    data.isSyn = res.gameInfo.isSyn
    data.dataList.length = 0
    for (var index = 0; index < res.playersList.length; ++index) {
      var macAddress = res.playersList[index].macAddress.toUpperCase()
      var device = {
        name: res.playersList[index].name,
        tail: '(game-' + res.playersList[index].macAddress.toLowerCase() + ')',
        playerId: res.playersList[index].playerId,
        macAddress: macAddress,
        score: res.playersList[index].score ? res.playersList[index].score : -100
      }
      data.dataList.push(device)
      data.synchronizeObject[macAddress] =  device
    }
    wx.hideNavigationBarLoading({})
    // 按分数从大到小排序
    data.dataList.sort((a, b) => {
      return b.score - a.score
    })
    // 然后再改变值
    if (data.dataList.length > 0) {
      data.dataList[0].color = '#ffb9e0'
    }

    if (data.dataList.length > 1) {
      data.dataList[1].color = '#fe6941'
    }

    if (data.dataList.length > 2) {
      data.dataList[2].color = '#2cabee'
    }
    that.setData(data)
    baseTool.print(data.isSyn)
    if (!data.isSyn) {
      var first = baseTool.valueForKey('firstContest')
      if (!first) {
        wx.redirectTo({
          url: '/pages/mask/contestMask/contestMask?imageName=contest-mask&isResync=true',
        })
      }
    } 
  },
  deleteContest: function(res) {
    var that = this
    contestManager.deleteContest(res.gameId).then(res => {
      that.getHomePage()
    }).catch(res => {
      baseTool.print(res)
    })
  },
  connectDevice: function () {
    var that = this
    // 找服务, 找特征
    baseTool.print('正在连接设备...')
    wx.hideLoading()
    wx.showLoading({
      title: '正在连接设备...',
      mask: false,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 创建连接
    wx.createBLEConnection({
      deviceId: data.deviceInfo.deviceId,
      success: function(res) {
        // 获得服务
        wx.getBLEDeviceServices({
          deviceId: data.deviceInfo.deviceId,
          success: function(res) {
            wx.getBLEDeviceCharacteristics({
              deviceId: data.deviceInfo.deviceId,
              serviceId: data.tailServiceUUID,
              success: function(res) {
                wx.notifyBLECharacteristicValueChange({
                  deviceId: data.deviceInfo.deviceId,
                  serviceId: data.tailServiceUUID,
                  characteristicId: data.tailCharacteristicIdNotify,
                  state: true,
                  success: function(res) {
                    baseTool.print([res, '预订通知成功成功'])
                    that.deviceCharacteristicValueChange(data.deviceInfo.deviceId)
                  },
                  fail: function(res) {},
                  complete: function(res) {},
                })
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  deviceConnectionStateChange: function () {
    wx.onBLEConnectionStateChange(function(res){
      baseTool.print([res, '蓝牙状态改变'])
    })
  },
  deviceCharacteristicValueChange: function (deviceId = '') {
    var that = this

    wx.onBLECharacteristicValueChange(function(res){
      var values = new Uint8Array(res.value)
      var hex = baseHexConvertTool.arrayBufferToHexString(res.value).toLowerCase()
      baseTool.print([hex, '通知信息'])
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 再次回复设备
        that.connectReplyDevice(deviceId)
      } else if (hex.indexOf('f30cf5') == 0) {
        baseTool.print([res, '设备常亮'])
        wx.hideLoading()
      } else if (hex.indexOf('f802') == 0) {
        // 一次数据交互结束
        that.onceDataEndReplyDevice(deviceId)
      } else if (hex.indexOf('f4') == 0 || hex.indexOf('f6') == 0) {
        that.processOnceData(hex, values, deviceId)
      } else if (hex.indexOf('f7') == 0 || hex.indexOf('f9') == 0) {
        that.newProcessOnceData(hex, values, deviceId)
      }
    })
  },
  connectReplyDevice: function (deviceId = '') {
    // 查找设备命令
    var that = this
    var buffer = bleCommandManager.connectReplyDeviceCommand()
    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: data.tailServiceUUID,
      characteristicId: that.data.tailCharacteristicIdWrite,
      value: buffer,
      success: function(res) {
        baseTool.print([res, '查找设备命令发送成功'])
      },
      fail: function(res) {
        baseTool.print([res, '设备常亮失败'])
      },
      complete: function(res) {},
    })
  },
  onceDataEndReplyDevice: function (deviceId = '') {
    var that = this
    var buffer = bleCommandManager.onceDataEndReplyDeviceCommand()

    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: data.tailServiceUUID,
      characteristicId: that.data.tailCharacteristicIdWrite,
      value: buffer,
      success: function (res) {
        baseTool.print([res, '一次交互结束'])
        wx.closeBLEConnection({
          deviceId: deviceId,
          success: function(res) {
            baseTool.print([res, '一次交互结束'])
            baseTool.print([res, '成功断开设备'])

            if (data.dataObjectList.length == 0) {
              // 无数据
              data.synNoDataCount++
              data.synCommandCount++
              data.dataObjectList = []
              data.deviceDataList = []
              that.synDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              console.log('wx sava data', data.dataObjectList)
              wx.setStorage({
                key: "dataObjectList",
                data: data.dataObjectList
              })
              that.upStorageDataToService(true);
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function (res) {
        baseTool.print([res, '设备常亮失败'])
       
      },
      complete: function (res) { },
    })
  }, 
  processOnceData: function (hex, values, deviceId = '') {
    // 刷牙数据
    var that = this
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
      var oneCompleteData = data.data01 + data.data02 + data.data03;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      var typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      var deviceInfo = data.dataList[data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, deviceInfo.macAddress);

      baseTool.print(["dataObject", dataObject])

      //放入数据集合
      data.dataObjectList.push(dataObject);
      data.deviceDataList.push(oneCompleteData);
      baseTool.print(['dataList:', data.dataList])
      //一条完整数据回复
      var oneDataWrite = "f103" + data.dataHead;
      var typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
      baseTool.print(['reply', typedArray])
      var oneDataWriteBuffer = typedArray.buffer

      wx.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: data.tailServiceUUID,
        characteristicId: that.data.tailCharacteristicIdWrite,
        value: oneDataWriteBuffer,
        success: function (res) {
          baseTool.print([res, 'writeBLECharacteristicValue success 一次数据读取完毕!'])
        },
        fail: function (res) {
          baseTool.print([res, '设备常亮失败'])
        },
        complete: function (res) { },
      })
    }
  },
  newProcessOnceData: function (hex, values, deviceId = '') {
    //初始化头部信息 回复要带
    var that = this
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
      var oneCompleteData = data.data01 + data.data02 + data.data03 + data.data04;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      var typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      var deviceInfo = data.dataList[data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, deviceInfo.macAddress);
      console.log("dataObject", dataObject)

      //放入数据集合
      data.dataObjectList.push(dataObject);
      data.deviceDataList.push(oneCompleteData);
      baseTool.print(['dataList:', data.dataList])
      //一条完整数据回复
      var oneDataWrite = "f103" + data.dataHead;
      var typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
      baseTool.print(['reply', typedArray])
      var oneDataWriteBuffer = typedArray.buffer

      wx.writeBLECharacteristicValue({
        deviceId: deviceId,
        serviceId: data.tailServiceUUID,
        characteristicId: that.data.tailCharacteristicIdWrite,
        value: oneDataWriteBuffer,
        success: function (res) {
          baseTool.print([res, 'writeBLECharacteristicValue success 一次数据读取完毕!'])
        },
        fail: function (res) {
          baseTool.print([res, '设备常亮失败'])
        },
        complete: function (res) { },
      })
    }
  },
  upStorageDataToService: function () {
    var that = this
    contestManager.uploadBrushRecord().then(res => {
      // 设备数据上传成功
      baseTool.print([res, '数据上传成功'])
      data.synSuccessCount++
      data.synCommandCount++
      data.dataObjectList = []
      data.deviceDataList = []
      that.synDevice()
    }).catch(res => {
      baseTool.print([res, '错误信息'])
    })
  },
  addContestUser: function() {
    var gameId = data.gameId
    var name = data.contestTitle
    wx.navigateTo({
      url: '../createContest/createContest?' + 'gameId=' + gameId + '&' + 'name=' + name,
      success: function (res) {
        // 提交消息
        baseMessageHandler.postMessage('createContest', res => {
          res(data.deviceInfo)
          // baseMessageHandler.removeMessage('createContest')
        }).then(res => {
          baseTool.print(res)
        }).catch(res => {
          baseTool.print(res)
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})