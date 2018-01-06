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
  contestTitle: '',
  contestDate: '',
  createTime: '',
  /**
   * 是否已经同步过
   */
  isSyn: false,
  isSave: false,
  /**
   * 是否同步中
   */
  isSynNow: false,
  // 数据列表
  dataList: [],
  // 搜索的设备名列表
  deviceNameList: [],
  // 数据集合
  dataObjectList: [],
  // 设备数据集合
  deviceDataList: [],
  serviceUUIDs: [],
  tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
  //尾巴读取数据的特征值 notify
  tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
  //尾巴读取数据的特征值 write
  tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
  // 同步指令计数
  synCommandCount: 0,
  synSuccessCount: 0,
  synFailCount: 0,
  synNoDataCount: 0,
  // 所有搜索到的设备
  deviceAllObject: {},
  // 待同步的设备对象
  synchronizeObject: {},
  // 
  synNodataTimeOut: true,
  // 重连次数
  synReconnectCount: 0,
  // 执行行数
  synExeLine: 54,
  createButtonDisable: false,
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

    // baseTool.startTimer(function (total) {
    //   if (total <= 0) {
    //     return true
    //   }
    //   return false
    // }, 10, 1000)
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
    var that = this
    that.setData({
      createButtonDisable: false
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
      if (typeof (res) != 'undefined' && res.deviceList && res.deviceList.length > 0) {
        that.parseData(res)
      } else if (typeof (res) != 'undefined') {
        that.deleteContest(res)
        data.loadingDone = true
        data.hasData = false
        that.setData(data)
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
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  },
  createContest: function(){
    var that = this
    var clinicId = baseTool.valueForKey('clinicId')
    if (clinicId == undefined || clinicId == '') {
      wx.showModal({
        title: '完善单位信息',
        content: '完善单位信息后才能创建比赛哦~',
        showCancel: true,
        cancelText: '暂时没空',
        cancelColor: '#000',
        confirmText: '完善信息',
        confirmColor: '#00a0e9',
        success: function(res) {
          if (res.confirm == true) {
            wx.navigateTo({
              url: '/pages/my/myClinic/myClinic',
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    that.setData({
      createButtonDisable: true
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    contestManager.addContest().then(res => {
      
      if (typeof (res) != 'undefined') {
        var gameId = res.game.gameId
        var name = res.game.name
        wx.navigateTo({
          url: '../createContest/createContest?' + 'gameId=' + gameId + '&name=' + name + '&add=no',
          success: function(res) {
            // wx.hideLoading()
          },
          fail: function(res) {
            // wx.hideLoading()
            that.setData({
              createButtonDisable: false
            })
          },
          complete: function(res) {},
        })
      }
      
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      that.setData({
        createButtonDisable: false
      })
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    
  },
  contestReSyn: function (e) {
    var that = this
    that.setData({
      isSynNow: true
    })
    wx.hideLoading()
    wx.showLoading({
      title: '同步数据...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

    // 开启定时器, 3秒后
    setTimeout(function () {
      wx.closeBluetoothAdapter({
        success: function (res) {
          that.openBle()
          that.deviceConnectionStateChange()
        },
        fail: function (res) {
          that.openBle()
          that.deviceConnectionStateChange()
        },
        complete: function (res) { },
      })
    }, 3000)
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
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '蓝牙不可用, 请检查蓝牙和GPS状态后再使用',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#00a0e9',
          success: function (res) {
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
    // 重置信息
    data.synCommandCount = 0
    data.synFailCount = 0
    data.synSuccessCount = 0
    data.synNoDataCount = 0
    data.deviceAllObject = null
    data.deviceAllObject = {}
    data.deviceNameList.splice(0, data.deviceNameList.length)
    data.synReconnectCount = 0
    wx.hideLoading()
    wx.showLoading({
      title: '搜索设备...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 设备信息 20s 后停止
    var stopTimer = false
    setTimeout(function () {
      // 如果 20s 内搜索到全部设备, 则不走下面代码
      if (stopTimer == true) {
        return
      }
      wx.stopBluetoothDevicesDiscovery({
        success: function(res) {
          // 停止搜索以后, 开始同步
          data.synExeLine = 284
          that.dispatchConnect()
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }, 25000)

    wx.onBluetoothDeviceFound(function(res){
      var device = res.devices[0]
      // baseTool.print(device)
      if (device.name.indexOf('game') == -1) {
        return
      }
      // 获得 MAC地址
      var macAddress = device.name.split('-')[1].toUpperCase()
      // 在同步列表里面
      if (data.synchronizeObject[macAddress]) {
        baseTool.print([macAddress])
        // 加入设备列表
        data.deviceAllObject[macAddress] = device
        // 将 mac 地址加入搜索列表
        data.deviceNameList.push(macAddress)
        // 如果两者长度相等, 就不用等待 20s 了
        if (data.deviceNameList.length == data.dataList.length) {
          // 停止搜索设备
          stopTimer = true
          wx.stopBluetoothDevicesDiscovery({
            success: function(res) {
              // 开始连接设备
              data.synExeLine = 313
              that.dispatchConnect()
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })
  },
  contestUserClick: () => {
    var that = this
    that.setData({
      createButtonDisable: true
    })
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
    data.contestTitle = res.name
    data.contestDate = res.createTime
    data.gameId = res.gameId
    data.createTime = res.createTime
    data.loadingDone = true
    data.hasData = true
    data.synchronizeObject = null
    data.synchronizeObject = {}
    // 清空数组
    data.isSyn = res.isSyn
    data.isSave = res.isSave
    data.dataList.length = 0
    for (var index = 0; index < res.deviceList.length; ++index) {
      var macAddress = res.deviceList[index].macAddress
      // 待同步的列表项
      var item = {
        name: res.deviceList[index].player,
        tail: res.deviceList[index].tail,
        playerId: res.deviceList[index].playerId,
        macAddress: macAddress,
        score: res.deviceList[index].score,
        brushingMethodId: res.deviceList[index].brushingMethodId
      }

      if (res.deviceList[index].recordId != '') {
        baseTool.print(res.deviceList[index])
        item.recordId = res.deviceList[index].recordId
      }

      if (data.isSave == false && item.score == -1) {
        // 未同步
        item.score = -100
      }
      // 添加数据集合
      data.dataList.push(item)
      // 待同步设备 mac 地址
      data.synchronizeObject[macAddress] =  macAddress
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
    if (!data.isSave) {
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
  dispatchConnect: function () {
    var that = this
    // 结束条件
    baseTool.print('synExeLine行数:' + data.synExeLine)
    baseTool.print('synCommandCount:' + data.synCommandCount)
    baseTool.print('synSuccessCount:' + data.synSuccessCount)
    baseTool.print('synFailCount:' + data.synFailCount)
    baseTool.print('synNoDataCount:' + data.synNoDataCount)
    if (data.synCommandCount == data.dataList.length) {
      // 同步结束
      wx.hideLoading()
      var content = '本地同步成功:' + data.synSuccessCount + '个; ' + '本地同步未达标' + data.synNoDataCount + '个; ' + '未连接:' + data.synFailCount + '个'
      wx.showModal({
        title: '同步结果',
        content: content,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
          if (data.isSave == false ) {
            contestManager.saveBrushRecord(data.gameId)
            data.isSave = true
          }
          
          if (data.isSyn == false || data.synSuccessCount > 0) {
            wx.showModal({
              title: '小提示',
              content: '如需查看分数, 请点击"确定"',
              showCancel: true,
              cancelText: '取消',
              cancelColor: '#ff0000',
              confirmText: '确定',
              confirmColor: '#00a0e9',
              success: function (res) {
                if (res.confirm == true) {
                  that.upStorageDataToService()
                } else {
                  that.getHomePage()
                }
              },
              fail: function (res) {

              },
              complete: function (res) { },
            })
          }
          
          that.setData({
            isSynNow: false
          })
          wx.closeBluetoothAdapter({
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      return
    } else if (data.synCommandCount > data.dataList.length) {
      wx.hideLoading()
      return
    } else {
      baseTool.print('同步第' + (data.synCommandCount + 1) + '个设备')
      wx.hideLoading()
      wx.showLoading({
        title: '同步第' + (data.synCommandCount + 1) + '个设备',
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      // 读取设备列表
      var item = data.dataList[data.synCommandCount]
      // 设备 mac 地址
      var deviceName = item.macAddress
      // 获得设备信息
      var device = data.deviceAllObject[deviceName]
      // 如果不存在, 则跳过
      if (!device) {
        data.synExeLine = 452
        that.synNextDevice()
      } else {
        // 设备存在
        // 500 ms 以后执行连接调度
        // baseTool.print(device)
        setTimeout(function () {
          baseTool.print(device)
          // 设备重连次数重置
          data.synReconnectCount = 0
          that.connectDevice(device)
        }, 500)
        // 清空数据
        data.dataObjectList.splice(0, data.dataObjectList.length)
        data.deviceDataList.splice(0, data.deviceDataList.length)
      }
    }
  },
  connectDevice: function (device) {
    var that = this
    // 找服务, 找特征
    baseTool.print('正在连接设备...')
    baseTool.print(device)
    wx.hideLoading()
    wx.showLoading({
      title: '正在连接设备...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    var connectTimeOut = false
    baseTool.startTimer(function(total) {
      if (connectTimeOut == true) {
        baseTool.print(['连接未超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
        return true
      }
      if (total == 0) {
        // 发起重连
        if (data.synReconnectCount < 3) {
          data.synReconnectCount++
          // 500ms 后发起重连
          setTimeout(function () {
            that.connectDevice(device)
          }, 500)
        } else {
          baseTool.print(['连接超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
          wx.closeBLEConnection({
            deviceId: device.deviceId,
            success: function (res) {
              // 无数据
              data.synExeLine = 495
              that.synNextDevice()
            },
            fail: function (res) {
              // 无数据
              data.synExeLine = 499
              that.synNextDevice()
            },
            complete: function (res) { },
          })
        }
        return true
      }
      return false
    }, 10, 500)
    // 创建连接
    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: function(res) {
        connectTimeOut = true
        // 50ms 以后执行下一步
        setTimeout(function() {
          // 获得服务
          var serviceTimeOut = false
          baseTool.startTimer(function (total) {
            if (serviceTimeOut == true) {
              baseTool.print(['获得服务未超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
              return true
            }
            if (total == 0) {
              baseTool.print(['获得服务超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
              wx.closeBLEConnection({
                deviceId: device.deviceId,
                success: function (res) {
                  // 无数据
                  data.synExeLine = 528
                  that.synNextDevice()
                },
                fail: function (res) {
                  // 无数据
                  data.synExeLine = 533
                  that.synNextDevice()
                },
                complete: function (res) { },
              })
              return true
            }
            return false
          }, 10, 500)
          wx.getBLEDeviceServices({
            deviceId: device.deviceId,
            success: function (res) {
              serviceTimeOut = true
              setTimeout(function (){
                // 获得服务
                var characteristicsTimeOut = false
                // 10秒未获得服务跳过
                baseTool.startTimer(function (total) {
                  if (characteristicsTimeOut == true) {
                    baseTool.print(['获得服特征值未超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
                    return true
                  }
                  if (total == 0) {
                    baseTool.print(['获得服特征值超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
                    wx.closeBLEConnection({
                      deviceId: device.deviceId,
                      success: function (res) {
                        // 无数据
                        data.synExeLine = 561
                        that.synNextDevice()
                      },
                      fail: function (res) {
                        // 无数据
                        data.synExeLine = 566
                        that.synNextDevice()
                      },
                      complete: function (res) { },
                    })
                    return true
                  }
                  return false
                }, 10, 500)
                wx.getBLEDeviceCharacteristics({
                  deviceId: device.deviceId,
                  serviceId: data.tailServiceUUID,
                  success: function (res) {
                    characteristicsTimeOut = true
                    setTimeout(function() {
                      // 获得服务
                      var notyfyCharacteristicsTimeOut = false
                      baseTool.startTimer(function (total) {
                        if (notyfyCharacteristicsTimeOut == true) {
                          baseTool.print(['预定通知未超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
                          return true
                        }
                        if (total == 0) {
                          baseTool.print(['预定通知超时, 停止定时器', device, data.synCommandCount, data.synFailCount, data.synNoDataCount, data.synSuccessCount])
                          wx.closeBLEConnection({
                            deviceId: device.deviceId,
                            success: function (res) {
                              // 无数据
                              data.synExeLine = 596
                              that.synNextDevice()
                            },
                            fail: function (res) {
                              // 无数据
                              data.synExeLine = 599
                              that.synNextDevice()
                            },
                            complete: function (res) { },
                          })
                          return true
                        }
                        return false
                      }, 10, 500)
                      // 接收特征值数据
                      wx.hideLoading()
                      wx.showLoading({
                        title: '读取设备数据...',
                        mask: true,
                        success: function(res) {},
                        fail: function(res) {},
                        complete: function(res) {},
                      })
                      that.deviceCharacteristicValueChange(device.deviceId)
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: device.deviceId,
                        serviceId: data.tailServiceUUID,
                        characteristicId: data.tailCharacteristicIdNotify,
                        state: true,
                        success: function (res) {
                          notyfyCharacteristicsTimeOut = true
                          baseTool.print([res, '预订通知成功成功'])
                          // 50 ms 以后执行下一步
                            // 定时器
                          data.synNodataTimeOut = false
                          // 20s 无法同步完, 算失败
                          baseTool.startTimer(function (total) {
                            if (data.synNodataTimeOut == true) {
                              return true
                            }
                            if (total == 0) {
                              wx.closeBLEConnection({
                                deviceId: device.deviceId,
                                success: function (res) {
                                  // 无数据
                                  data.synExeLine = 631
                                  that.synNextDevice()
                                },
                                fail: function (res) {
                                  // 无数据
                                  data.synExeLine = 636
                                  that.synNextDevice()
                                },
                                complete: function (res) { },
                              })
                              return true
                            }
                            return false
                          }, 10, 2000)
                            // 介绍设备数据
                        },
                        fail: function (res) {
                          notyfyCharacteristicsTimeOut = true
                          baseTool.print([res, '预订通知失败'])
                          // 关闭连接
                          wx.closeBLEConnection({
                            deviceId: device.deviceId,
                            success: function (res) {
                              // 无数据
                              data.synExeLine = 655
                              that.synNextDevice()
                            },
                            fail: function (res) {
                              // 无数据
                              data.synExeLine = 660
                              that.synNextDevice()
                            },
                            complete: function (res) { },
                          })
                        },
                        complete: function (res) { },
                      })
                    }, 50)
                    
                  },
                  fail: function (res) {
                    characteristicsTimeOut = true
                    // 关闭连接
                    wx.closeBLEConnection({
                      deviceId: device.deviceId,
                      success: function (res) {
                        // 无数据
                        data.synExeLine = 678
                        that.synNextDevice()
                      },
                      fail: function (res) {
                        // 无数据
                        data.synExeLine = 683
                        that.synNextDevice()
                      },
                      complete: function (res) { },
                    })
                  },
                  complete: function (res) { },
                })
              }, 50)
              
            },
            fail: function (res) {
              baseTool.print([res, '获得服务失败'])
              serviceTimeOut = true
              // 关闭连接
              wx.closeBLEConnection({
                deviceId: device.deviceId,
                success: function (res) {
                  // 无数据
                  data.synExeLine = 702
                  that.synNextDevice()
                },
                fail: function (res) {
                  // 无数据
                  data.synExeLine = 707
                  that.synNextDevice()
                },
                complete: function (res) { },
              })
            },
            complete: function (res) { },
          })
        }, 50)
        
      },
      fail: function(res) {
        baseTool.print([res, '蓝牙连接失败'])
        // 无数据
        // 没超时
        connectTimeOut = true
        if (data.synReconnectCount < 3) {
          data.synReconnectCount++
          // 500ms 后发起重连
          setTimeout(function() {
            that.connectDevice(device)
          }, 500)
        } else {
          data.synExeLine = 736
          that.synNextDevice()
        }
      },
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
    // 收到定时器
    wx.onBLECharacteristicValueChange(function(res){
      var values = new Uint8Array(res.value)
      var hex = baseHexConvertTool.arrayBufferToHexString(res.value).toLowerCase()
      baseTool.print([hex, '通知信息'])
      // 回复数据
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
        baseTool.print([res, '首次回复成功'])
      },
      fail: function(res) {
        baseTool.print([res, '首次回复失败'])
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
        baseTool.print([deviceId, '设备数据交互结束'])
        wx.closeBLEConnection({
          deviceId: deviceId,
          success: function(res) {
            baseTool.print([res, '成功断开设备'])

            if (data.dataObjectList.length == 0) {
              // 无数据
              data.synExeLine = 793
              data.synNodataTimeOut = true
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              data.synExeLine = 888
              that.synSuccessNextDevice()
              // console.log('wx sava data', data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: data.dataObjectList
              // })
              // that.upStorageDataToService();
            }
          },
          fail: function(res) {
            baseTool.print([res, '设备写入信息失败'])
            if (data.dataObjectList.length == 0) {
              // 无数据
              data.synNodataTimeOut = true
              data.synExeLine = 812
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              data.synExeLine = 912
              that.synSuccessNextDevice()
              // console.log('wx sava data', data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: data.dataObjectList
              // })
              // that.upStorageDataToService();
            }
          },
          complete: function(res) {},
        })
      },
      fail: function (res) {
        baseTool.print([res, '蓝牙写失败'])
        baseTool.print([deviceId, '设备数据交互结束'])
        wx.closeBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            baseTool.print([res, '成功断开设备'])

            if (data.dataObjectList.length == 0) {
              // 无数据
              data.synExeLine = 838
              data.synNodataTimeOut = true
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              data.synExeLine = 943
              that.synSuccessNextDevice()
              // console.log('wx sava data', data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: data.dataObjectList
              // })
              // that.upStorageDataToService();
            }
          },
          fail: function (res) {
            baseTool.print([res, '设备写入信息失败'])
            if (data.dataObjectList.length == 0) {
              // 无数据
              data.synNodataTimeOut = true
              data.synExeLine = 855
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              data.synExeLine = 952
              that.synSuccessNextDevice()
              // console.log('wx sava data', data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: data.dataObjectList
              // })

              // that.upStorageDataToService();
            }
          },
          complete: function (res) { },
        })
      },
      complete: function (res) { },
    })
  }, 
  processOnceData: function (hex, values, deviceId = '') {
    // 刷牙数据
    var that = this
    // 定时器
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
      var oneCompleteData = data.data01 + data.data02 + data.data03;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      var typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      var deviceInfo = data.dataList[data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId);

      baseTool.print(["dataObject", dataObject])

      //放入数据集合
      contestManager.addDeviceDataObject(dataObject, data.gameId, data.contestTitle).then(res => {
        baseTool.print(["dataObject", res])
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
      }).catch(res => {
        baseTool.print(["错误信息", res])
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
      baseTool.print([data.synCommandCount, deviceInfo, '设备信息'])
      var dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId);
      console.log("dataObject", dataObject)

      contestManager.addDeviceDataObject(dataObject, data.gameId, data.contestTitle).then(res => {
        baseTool.print(["dataObject", res])
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
      }).catch(res => {
        baseTool.print(["错误信息", res])
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
      })
      
    }
  },
  upStorageDataToService: function () {
    var that = this
    wx.hideLoading()
    wx.showLoading({
      title: '上传数据...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    contestManager.uploadBrushRecord(data.gameId, data.createTime).then(res => {
      // 设备数据上传成功
      wx.hideLoading()
      data.synNodataTimeOut = true
      baseTool.print([res, '数据上传成功'])
      that.getHomePage()
      that.setData({
        isSynNow: false
      })
    }).catch(res => {
      wx.hideLoading()
      baseTool.print([res, '错误信息'])
      wx.showModal({
        title: '提示',
        content: res + ', 请稍后重新进行同步操作',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      that.setData({
        isSynNow: false
      })
    })
  },
  addContestUser: function() {
    var gameId = data.gameId
    var name = data.contestTitle
    var that = this
    that.setData({
      createButtonDisable: true
    })
    // 提交消息
    baseMessageHandler.postMessage('createContest', res => {
      res(data.synchronizeObject)
      // 删除消息
      baseMessageHandler.removeMessage('createContest')
    }).then(res => {
      baseTool.print(res)
      // 成功了以后再跳转页面, 就不会出错了
      wx.navigateTo({
        url: '../createContest/createContest?' + 'gameId=' + gameId + '&name=' + name + '&add=yes',
        success: function (res) {

        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }).catch(res => {
      baseTool.print(res)
    })
    
  },
  timeOut: function (callback = (total) => {}, inteval = 1000, total = 0) {
    baseTool.print(total)
    var that = this
    var stop = callback(total)
    if (stop == true) {
      return
    } else {
      // 自减1
      total--
      // 定时器
      setTimeout(function () {
        that.timeOut(callback, inteval, total)
      }, inteval)
    }
  },
  synNextDevice: function () {
    var that = this
    if (data.synCommandCount < data.dataList.length && data.isSave == false) {
      var deviceInfo = data.dataList[data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand([], deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId)

      baseTool.print(["dataObject", dataObject])
      //放入数据集合
      contestManager.addDeviceDataObject(dataObject, data.gameId, data.contestTitle).then(res => {
        baseTool.print(["dataObject", res])
        setTimeout(function () {
          data.synFailCount++
          data.synCommandCount++
          that.dispatchConnect()
        }, 500)
      }).catch(res => {
        baseTool.print(["错误信息", res])
      })
    } else {
      setTimeout(function () {
        data.synFailCount++
        data.synCommandCount++
        that.dispatchConnect()
      }, 500)
    }
    
    
    
  },
  synNoDataNextDevice: function() {
    var that = this
    if (data.synCommandCount < data.dataList.length && data.isSave == false) {
      var deviceInfo = data.dataList[data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand([], deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId)

      baseTool.print(["dataObject", dataObject])
      //放入数据集合
      contestManager.addDeviceDataObject(dataObject, data.gameId, data.contestTitle).then(res => {
        baseTool.print(["dataObject", res])
        setTimeout(function () {
          data.synNoDataCount++
          data.synCommandCount++
          that.dispatchConnect()
        }, 500)
      }).catch(res => {
        baseTool.print(["错误信息", res])
      })
    } else {
      setTimeout(function () {
        data.synNoDataCount++
        data.synCommandCount++
        that.dispatchConnect()
      }, 500)
    }
  },
  synSuccessNextDevice: function() {
    var that = this
    setTimeout(function () {
      data.synSuccessCount++
      data.synCommandCount++
      that.dispatchConnect()
    }, 500)
  },
  scoreReportClick: function(e) {
    var that = this
   
    var index = e.currentTarget.dataset.index
    var item = data.dataList[index]
    if (item.recordId) {
      wx.navigateTo({
        url: '/pages/my/brushScoreReport/brushScoreReport?name=' + item.name + '&recordId=' + item.recordId,
        success: function(res) {},
        fail: function(res) {
          baseTool.print(res)
        },
        complete: function(res) {},
      })
    }
  }
})