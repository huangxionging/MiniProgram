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
   * 是否正在同步
   */
  isSyn: false,
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
  deviceInfo: null
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

    // baseMessageHandler.addMessageHandler('message', this, function (res) {
    //   baseTool.print(res)
    // }).then(res => {
    //   baseTool.print(res)
    // }).catch(res => {
    //   baseTool.print(res)
    // })
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
      isSyn: true
    })
    wx.showLoading({
      title: '同步数据中',
      mask: false,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    // 每次从第 0个设备开始
    data.synCommandCount = 0
    data.dataObjectList = []
    data.deviceDataList = []
    that.synDevice()
  },
  synDevice: function () {
    var that = this
    if (data.synCommandCount == data.dataList.length) {
      // 同步结束
      wx.hideLoading()
      that.getHomePage()
      wx.showToast({
        title: '同步结束',
        icon: '',
        image: '',
        duration: 3000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    wx.showLoading({
      title: '同步第' + (data.synCommandCount + 1) + '个尾巴',
      mask: true,
      success: function(res) {
        that.openBle()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },
  openBle: function () {
    // 打开蓝牙
    var that = this
    bluetoothManager.checkBluetoothState().then(res => {
      baseTool.print('checkBluetoothState: success')
      that.foundDevices()
    }).catch(res => {
      baseTool.print('checkBluetoothState: fail')
    })
  },
  foundDevices: function () {
    var that = this
    // 设备信息
    var deviceInfo = data.dataList[data.synCommandCount]
    bluetoothManager.foundDevice(res => {
      // console.log('new device list has founded');
      // console.log(res);
      if (res.name.indexOf('game') == -1) {
        return
      }

      var dataList = that.data.dataList
      var index = dataList.length
      var macAddress = res.name.split('-')[1].toUpperCase()
      baseTool.print([macAddress, data.synCommandCount])

      // 找到设备
      if (macAddress === deviceInfo.macAddress) {
        // 停止搜索设备
        // 记住当前设备信息
        data.deviceInfo = res
        bluetoothManager.stopBluetoothDevicesDiscovery().then(res => {
          // 成功开始连接设备
          that.connectDevice()
        }).catch(res => {
          baseTool.print('stopBluetoothDevicesDiscovery: fail')
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
    // 清空数组
    data.dataList.length = 0
    for (var index = 0; index < res.playersList.length; ++index) {
      data.dataList.push({
        rank: index + 1,
        name: res.playersList[index].name,
        tail: '(game-' + res.playersList[index].macAddress.toLowerCase() + ')',
        playerId: res.playersList[index].playerId,
        macAddress: res.playersList[index].macAddress.toUpperCase(),
        score: res.playersList[index].score ? res.playersList[index].score : '未同步'
      })
      if (index == 0) {
        data.dataList[index].color = '#ffb9e0'
      } else if (index == 1) {
        data.dataList[index].color = '#fe6941'
      } else if (index == 2) {
        data.dataList[index].color = '#2cabee'
      }
    }
    wx.hideNavigationBarLoading()
    that.setData(data)
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
    wx.showLoading({
      title: '正在连接设备...',
      mask: false,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var getCharacteristicsPromise = bluetoothManager.connectDevice(data.deviceInfo.deviceId).then(res => {
      baseTool.print([res, '服务 UUID', data.deviceInfo.deviceId, data.tailServiceUUID])
      return bluetoothManager.getDeviceCharacteristics(data.deviceInfo.deviceId, data.tailServiceUUID)
      // 获得服务特征
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
      })
    })

    // 预订通知
    var notifyPromise = getCharacteristicsPromise.then(res => {
      baseTool.print([res, '获得特征值'])
      return bluetoothManager.notifyDeviceCharacteristicValueChange(data.deviceInfo.deviceId, data.tailServiceUUID, data.tailCharacteristicIdNotify)
    }).catch(res => {
      baseTool.print(res)
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
      })
    })

    notifyPromise.then(res => {
      baseTool.print([res, '预订通知成功成功'])
      that.deviceCharacteristicValueChange(data.deviceInfo.deviceId)
    }).catch(res => {
      baseTool.print([res, '预订通知失败'])
      wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '蓝牙连接失败',
      })
    })
  },
  deviceConnectionStateChange: function () {
    bluetoothManager.deviceConnectionStateChange(res => {
      baseTool.print([res, '蓝牙状态改变'])
    })
  },
  deviceConnectionStateChange: function () {
    bluetoothManager.deviceConnectionStateChange(res => {
      baseTool.print([res, '蓝牙状态改变'])
    })
  },
  deviceCharacteristicValueChange: function (deviceId = '') {
    var that = this
    bluetoothManager.deviceCharacteristicValueChange(res => {
      var values = new Uint8Array(res.value)
      var hex = baseHexConvertTool.arrayBufferToHexString(res.value).toLowerCase()
      baseTool.print([hex, '通知信息'])
      if ((hex.indexOf('f20d') == 0) || (hex.indexOf('f30d'))  == 0) {
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
  findDevice: function (deviceId = '') {
    // 查找设备命令
    var that = this
    var buffer = bleCommandManager.findDeviceCommand()
    bluetoothManager.writeDeviceCharacteristicValue(deviceId, data.tailServiceUUID, that.data.tailCharacteristicIdWrite, buffer).then(res => {
      baseTool.print([res, '查找设备命令发送成功'])
    }).catch(res => {
      baseTool.print([res, '设备常亮失败'])
    })
  },
  connectReplyDevice: function (deviceId = '') {
    // 查找设备命令
    var that = this
    var buffer = bleCommandManager.connectReplyDeviceCommand()
    bluetoothManager.writeDeviceCharacteristicValue(deviceId, data.tailServiceUUID, that.data.tailCharacteristicIdWrite, buffer).then(res => {
      baseTool.print([res, '查找设备命令发送成功'])
    }).catch(res => {
      baseTool.print([res, '设备常亮失败'])
    })
  },
  onceDataEndReplyDevice: function (deviceId = '') {
    var that = this
    var buffer = bleCommandManager.onceDataEndReplyDeviceCommand()
    bluetoothManager.writeDeviceCharacteristicValue(deviceId, data.tailServiceUUID, that.data.tailCharacteristicIdWrite, buffer).then(res => {
      baseTool.print([res, '一次交互结束'])
      bluetoothManager.closeBLEConnection(deviceId).then(res => {
        baseTool.print([res, '成功断开设备'])

        if (data.dataObjectList.length == 0) {
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
        
      }).catch(res => {
        baseTool.print([res, '断开设备失败'])
      })
    }).catch(res => {
      baseTool.print([res, '设备常亮失败'])
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
      bluetoothManager.writeDeviceCharacteristicValue(deviceId, data.tailServiceUUID, data.tailCharacteristicIdWrite, oneDataWriteBuffer).then(res => {
        baseTool.print([res, 'writeBLECharacteristicValue success 一次数据读取完毕!'])
      }).catch(res => {
        baseTool.print([res, '设备常亮失败'])
      })
    }
  },
  newProcessOnceData: function (hex, values, deviceId = '') {
    //初始化头部信息 回复要带
    var that = this
    data.dataHead = hex.substring(0, 2)

    //数据处理逻辑
    if (typedArrayRead[2] == 0) {
      data.data01 = hex
      baseTool.print(['data01:', data.data01])
    } else if (typedArrayRead[2] == 1) {
      data.data02 = hex
      baseTool.print(['data02:', data.data02])

    } else if (typedArrayRead[2] == 2) {
      data.data03 = hex
      baseTool.print(['data03:', data.data03])

    } else if (typedArrayRead[2] == 3) {
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
      that.data.dataObjectList.push(dataObject);
      that.data.dList.push(oneCompleteData);
      console.log('dataList:', that.data.dataList)
      baseTool.print(['dataList:', data.dataList])
      //一条完整数据回复
      var oneDataWrite = "f103" + data.dataHead;
      var typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
      baseTool.print(['reply', typedArray])
      var oneDataWriteBuffer = typedArray.buffer
      bluetoothManager.writeDeviceCharacteristicValue(deviceId, data.tailServiceUUID, data.tailCharacteristicIdWrite, oneDataWriteBuffer).then(res => {
        baseTool.print([res, 'writeBLECharacteristicValue success 一次数据读取完毕!'])
      }).catch(res => {
        baseTool.print([res, '设备常亮失败'])
      })
    }
  },
  upStorageDataToService: function () {
    var that = this
    contestManager.uploadBrushRecord().then(res => {
      // 设备数据上传成功
      baseTool.print([res, '数据上传成功'])
      data.synCommandCount++
      data.dataObjectList = []
      data.deviceDataList = []
      that.synDevice()
    }).catch(res => {
      baseTool.print([res, '错误信息'])
    })
  }
})