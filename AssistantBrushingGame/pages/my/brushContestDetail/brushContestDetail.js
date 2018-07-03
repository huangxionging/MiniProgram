// pages/my/brushContestDetail/brushContestDetail.js
const app = getApp()
const baseTool = require('../../../utils/baseTool.js')
const myManager = require('../../../manager/myManager.js')
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
       * 是否加载完成
       */
    loadingDone: false,
    hasData: false,
    gameId: '',
    /**
     * 是否正在同步
     */
    dataList: [],

    title: '',
    synCommandCount: 0,
    synFailCount: 0,
    synSuccessCount: 0,
    synNoDataCount: 0,
    deviceObject: {},
    synDeviceNameObject: {},
    serviceUUIDs: [],
    tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 notify
    tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 write
    tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
    synData: false,
    qrcodeUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)
    that.setData({
      gameId: options.gameId,
      title: options.name
    })
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: options.name,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    // 加载数据
    that.loadData()

    app.userInfoReadyCallback = res => {
      that.loadData()
    }

    that.checkSyn()
  },

  checkSyn: function() {
    var that = this
    var needSyn = myManager.checkNeedSyn()
    if (needSyn == true) {
      wx.showModal({
        title: '提示',
        content: '您有之前的同步数据未上传, 请选择放弃或者上传',
        showCancel: true,
        cancelText: '放弃',
        cancelColor: '#ff0000',
        confirmText: '上传',
        confirmColor: '#00a0e9',
        success: function(res) {
          if (res.confirm == true) {
            that.upStorageDataToService()
          } else if(res.cancel == true) {
            wx.showLoading({
              title: '正在删除...',
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            myManager.removeHistoryGameObject().then(res => {
              wx.hideLoading()
            }).catch(res => {
            })
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
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
    wx.hideLoading()
    wx.hideNavigationBarLoading()
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        baseTool.print("stopBluetoothDevicesDiscovery: success");
        //close bt. adapter
        wx.closeBluetoothAdapter({
          success: function (res) {
            baseTool.print("closeBluetoothAdapter: success");
          },
          fail: function (res) {
          }
        })
      },
      fail: function (res) {
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 加载数据
    var that = this
    that.loadData()
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
    var that = this
    var path = "pages/my/brushContestShare/brushContestShare" + "?gameId=" + that.data.gameId
    return {
      title: "比赛详情",
      path: path,
      imageUrl: that.data.qrcodeUrl,
    }
  },
  loadData() {
    var that = this
    wx.showNavigationBarLoading()
    myManager.getContestgMembers(that.data.gameId).then(res => {
      baseTool.print(res)
      var dataList = []
      dataList.splice(0, dataList.length)
      if (res && res.gameInfo && res.gameInfo.qrcodeUrl) {
        that.setData({
          qrcodeUrl: res.gameInfo.qrcodeUrl
        })
      }
      if (res && res.playersList && res.playersList.length > 0) {
        baseTool.print(dataList)
        for (var index = 0; index < res.playersList.length; ++index) {
          var macAddress = res.playersList[index].macAddress.toUpperCase()
          // 待同步的列表项
          var item = {
            name: res.playersList[index].name,
            tail: '(game-' + res.playersList[index].macAddress.toLowerCase() + ')',
            playerId: res.playersList[index].playerId,
            macAddress: macAddress,
            score: res.playersList[index].score,
            accuracy: res.playersList[index].accuracy,
          }
          that.data.synDeviceNameObject[macAddress] = macAddress
          if (item.score > 0) {
            item.score = item.score + parseFloat("0." + item.accuracy)
          }

          if (res.playersList[index].recordId) {
            item.recordId = res.playersList[index].recordId
          }

          // 添加数据集合
          dataList.push(item)
        }

        // 按分数从大到小排序
        dataList.sort((a, b) => {

          if (b.score === a.score) {
            baseTool.print(b)
            return b.accuracy - a.accuracy
          } else {
            return b.score - a.score
          }
        })
        // 然后再改变值
        if (dataList.length > 0) {
          dataList[0].color = '#ffb9e0'
        }

        if (dataList.length > 1) {
          dataList[1].color = '#fe6941'
        }

        if (dataList.length > 2) {
          dataList[2].color = '#2cabee'
        }

        that.setData({
          loadingDone: true,
          hasData: true,
          dataList: dataList,
        })
      }
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }).catch(res => {
      baseTool.print(res)
    })
  },
  scoreReportClick: function (e) {
    var that = this
    var data = that.data
    var index = e.currentTarget.dataset.index
    var item = that.data.dataList[index]
    if (item.recordId) {
      wx.navigateTo({
        url: '/pages/my/brushScoreReport/brushScoreReport?name=' + item.name + '&recordId=' + item.recordId,
        success: function (res) { },
        fail: function (res) {
          baseTool.print(res)
        },
        complete: function (res) { },
      })
    }
  },
  synClick: function (e) {
    var that = this
    myManager.createHistoryGameObject(that.data.gameId, that.data.title, that.data.dataList).then(res => {
      that.synFlow()
    }).catch(res => {
      wx.showModal({
        title: '提示',
        content: '获取历史记录失败, 请稍后重试',
      })
    })

  },
  synFlow: function() {
    var that = this
    that.data.deviceObject = {}
    that.data.synData = false
    wx.hideLoading()
    wx.showLoading({
      title: '同步数据...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
    that.data.synCommandCount = 0
    that.data.synFailCount = 0
    that.data.synSuccessCount = 0
    that.data.synNoDataCount = 0
    that.data.synReconnectCount = 0
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
        success: function (res) {
          // 停止搜索以后, 开始同步
          that.data.synExeLine = 284

          for (var key in that.data.synDeviceNameObject) {
            if (!that.data.deviceObject[key]) {
              that.data.deviceObject[key] = {
                macAddress: key,
                dataObjectList: [],
              }
            }
          }
          that.dispatchConnect()
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }, 25000)

    wx.onBluetoothDeviceFound(function (res) {
      var device = res.devices[0]
      baseTool.print(["发现设备", device])
      if (device.name.indexOf('game') == -1) {
        return
      }
      // 获得 MAC地址
      var macAddress = device.name.split('-')[1].toUpperCase()
      // 在同步列表里面
      baseTool.print(["macAddress地址", macAddress, that.data.deviceObject])
      if (that.data.synDeviceNameObject[macAddress]) {
        baseTool.print([device])
        // 加入设备列表
        that.data.deviceObject[macAddress] = {}
        that.data.deviceObject[macAddress].device = device
        that.data.deviceObject[macAddress].macAddress = macAddress
        that.data.deviceObject[macAddress].dataObjectList = []
        // 将 mac 地址加入搜索列表

        // 如果两者长度相等, 就不用等待 20s 了
        if (Object.keys(that.data.deviceObject).length == that.data.dataList.length) {
          // 停止搜索设备
          stopTimer = true
          wx.stopBluetoothDevicesDiscovery({
            success: function (res) {
              // 开始连接设备
              that.data.synExeLine = 313
              that.dispatchConnect()
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },
  dispatchConnect: function () {
    var that = this
    // 结束条件
    baseTool.print('synExeLine行数:' + that.data.synExeLine)
    baseTool.print('synCommandCount:' + that.data.synCommandCount)
    baseTool.print('synSuccessCount:' + that.data.synSuccessCount)
    baseTool.print('synFailCount:' + that.data.synFailCount)
    baseTool.print('synNoDataCount:' + that.data.synNoDataCount)
    if (that.data.synCommandCount == that.data.dataList.length && that.data.synData == false) {
      // 同步结束
      wx.hideLoading()
      that.upStorageDataToService()
      return
    } else if (that.data.synCommandCount > that.data.dataList.length) {
      wx.hideLoading()
      return
    } else if (that.data.synCommandCount < that.data.dataList.length) {
      baseTool.print('同步第' + (that.data.synCommandCount + 1) + '个设备')
      wx.hideLoading()
      wx.showLoading({
        title: '同步第' + (that.data.synCommandCount + 1) + '个设备',
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      // 读取设备列表
      var item = that.data.dataList[that.data.synCommandCount]
      // 设备 mac 地址
      var deviceName = item.macAddress
      // 获得设备信息

      var device = that.data.deviceObject[deviceName].device
      // 如果不存在, 则跳过
      if (!device) {
        that.data.synExeLine = 452
        that.synNextDevice()
      } else {
        // 设备存在
        // 500 ms 以后执行连接调度
        // baseTool.print(device)
        setTimeout(function () {
          baseTool.print(device)
          // 设备重连次数重置
          that.data.synReconnectCount = 0
          that.connectDevice(device)
        }, 500)
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
    baseTool.startTimer(function (total) {
      if (connectTimeOut == true) {
        baseTool.print(['连接未超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
        return true
      }
      if (total == 0) {
        baseTool.print(['连接超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
        wx.closeBLEConnection({
          deviceId: device.deviceId,
          success: function (res) {
            // 无数据
            that.data.synExeLine = 495
            that.synNextDevice()
          },
          fail: function (res) {
            // 无数据
            that.data.synExeLine = 499
            that.synNextDevice()
          },
          complete: function (res) { },
        })
        return true
      }
      return false
    }, 10, 500)
    // 创建连接
    baseTool.print(device)
    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: function (res) {
        connectTimeOut = true
        // 50ms 以后执行下一步
        setTimeout(function () {
          // 获得服务
          var serviceTimeOut = false

          baseTool.startTimer(function (total) {
            if (serviceTimeOut == true) {
              baseTool.print(['获得服务未超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
              return true
            }
            if (total == 0) {
              baseTool.print(['获得服务超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
              wx.closeBLEConnection({
                deviceId: device.deviceId,
                success: function (res) {
                  // 无数据
                  that.data.synExeLine = 528
                  that.synNextDevice()
                },
                fail: function (res) {
                  // 无数据
                  that.data.synExeLine = 533
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
              setTimeout(function () {
                // 获得服务
                var characteristicsTimeOut = false
                // 10秒未获得服务跳过
                baseTool.startTimer(function (total) {
                  if (characteristicsTimeOut == true) {
                    baseTool.print(['获得服特征值未超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
                    return true
                  }
                  if (total == 0) {
                    baseTool.print(['获得服特征值超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
                    wx.closeBLEConnection({
                      deviceId: device.deviceId,
                      success: function (res) {
                        // 无数据
                        that.data.synExeLine = 561
                        that.synNextDevice()
                      },
                      fail: function (res) {
                        // 无数据
                        that.data.synExeLine = 566
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
                  serviceId: that.data.tailServiceUUID,
                  success: function (res) {
                    characteristicsTimeOut = true
                    setTimeout(function () {
                      // 获得服务
                      var notyfyCharacteristicsTimeOut = false
                      baseTool.startTimer(function (total) {
                        if (notyfyCharacteristicsTimeOut == true) {
                          baseTool.print(['预定通知未超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
                          return true
                        }
                        if (total == 0) {
                          baseTool.print(['预定通知超时, 停止定时器', device, that.data.synCommandCount, that.data.synFailCount, that.data.synNoDataCount, that.data.synSuccessCount])
                          wx.closeBLEConnection({
                            deviceId: device.deviceId,
                            success: function (res) {
                              // 无数据
                              that.data.synExeLine = 596
                              that.synNextDevice()
                            },
                            fail: function (res) {
                              // 无数据
                              that.data.synExeLine = 599
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
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                      var macAddress = device.name.split('-')[1].toUpperCase()
                      that.deviceCharacteristicValueChange(device.deviceId, macAddress)
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: device.deviceId,
                        serviceId: that.data.tailServiceUUID,
                        characteristicId: that.data.tailCharacteristicIdNotify,
                        state: true,
                        success: function (res) {
                          notyfyCharacteristicsTimeOut = true
                          baseTool.print([res, '预订通知成功成功'])
                          // 50 ms 以后执行下一步
                          // 定时器
                          that.data.synNodataTimeOut = false
                          // 20s 无法同步完, 算失败
                          baseTool.startTimer(function (total) {
                            if (that.data.synNodataTimeOut == true) {
                              return true
                            }
                            if (total == 0) {
                              wx.closeBLEConnection({
                                deviceId: device.deviceId,
                                success: function (res) {
                                  // 无数据
                                  that.data.synExeLine = 631
                                  that.synNextDevice()
                                },
                                fail: function (res) {
                                  // 无数据
                                  that.data.synExeLine = 636
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
                          // notyfyCharacteristicsTimeOut = true
                          // baseTool.print([res, '预订通知失败'])
                          // // 关闭连接
                          // wx.closeBLEConnection({
                          //   deviceId: device.deviceId,
                          //   success: function (res) {
                          //     // 无数据
                          //     that.data.synExeLine = 655
                          //     that.synNextDevice()
                          //   },
                          //   fail: function (res) {
                          //     // 无数据
                          //     that.data.synExeLine = 660
                          //     that.synNextDevice()
                          //   },
                          //   complete: function (res) { },
                          // })
                        },
                        complete: function (res) { },
                      })
                    }, 50)

                  },
                  fail: function (res) {
                    // characteristicsTimeOut = true
                    // // 关闭连接
                    // wx.closeBLEConnection({
                    //   deviceId: device.deviceId,
                    //   success: function (res) {
                    //     // 无数据
                    //     that.data.synExeLine = 678
                    //     that.synNextDevice()
                    //   },
                    //   fail: function (res) {
                    //     // 无数据
                    //     that.data.synExeLine = 683
                    //     that.synNextDevice()
                    //   },
                    //   complete: function (res) { },
                    // })
                  },
                  complete: function (res) { },
                })
              }, 50)

            },
            fail: function (res) {
              baseTool.print([res, '获得服务失败'])
              // serviceTimeOut = true
              // // 关闭连接
              // wx.closeBLEConnection({
              //   deviceId: device.deviceId,
              //   success: function (res) {
              //     // 无数据
              //     that.data.synExeLine = 702
              //     that.synNextDevice()
              //   },
              //   fail: function (res) {
              //     // 无数据
              //     that.data.synExeLine = 707
              //     that.synNextDevice()
              //   },
              //   complete: function (res) { },
              // })
            },
            complete: function (res) { },
          })
        }, 50)

      },
      fail: function (res) {
        baseTool.print([res, '蓝牙连接失败'])
        // 无数据
        // 没超时
        connectTimeOut = true
        that.data.synExeLine = 736
        that.synNextDevice()
      },
      complete: function (res) { },
    })
  },
  deviceConnectionStateChange: function () {
    wx.onBLEConnectionStateChange(function (res) {
      baseTool.print([res, '蓝牙状态改变'])
    })
  },
  deviceCharacteristicValueChange: function (deviceId = '', macAddress = '') {
    var that = this
    // 收到定时器
    wx.onBLECharacteristicValueChange(function (res) {
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
        that.onceDataEndReplyDevice(deviceId, macAddress)
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
      serviceId: that.data.tailServiceUUID,
      characteristicId: that.data.tailCharacteristicIdWrite,
      value: buffer,
      success: function (res) {
        baseTool.print([res, '首次回复成功'])
      },
      fail: function (res) {
        baseTool.print([res, '首次回复失败'])
      },
      complete: function (res) { },
    })
  },
  onceDataEndReplyDevice: function (deviceId = '', macAddress = '') {
    var that = this
    baseTool.print([{ "设备地址": deviceId, "mac 地址": macAddress, "设备列表": that.data.deviceObject }])
    var buffer = bleCommandManager.onceDataEndReplyDeviceCommand()
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

            if (that.data.deviceObject[macAddress].dataObjectList.length == 0) {
              // 无数据
              that.data.synExeLine = 793
              that.data.synNodataTimeOut = true
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              that.data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              that.data.synExeLine = 888
              that.synSuccessNextDevice()
              // console.log('wx sava data', that.data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: that.data.dataObjectList
              // })
              // that.upStorageDataToService();
            }
          },
          fail: function (res) {
            baseTool.print([res, '设备写入信息失败'])
            if (that.data.deviceObject[macAddress].dataObjectList.length == 0) {
              // 无数据
              that.data.synNodataTimeOut = true
              that.data.synExeLine = 812
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              that.data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              that.data.synExeLine = 912
              that.synSuccessNextDevice()
              // console.log('wx sava data', that.data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: that.data.dataObjectList
              // })
              // that.upStorageDataToService();
            }
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        baseTool.print([res, '蓝牙写失败'])
        baseTool.print([deviceId, '设备数据交互结束'])
        wx.closeBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            baseTool.print([res, '成功断开设备'])

            if (that.data.deviceObject[macAddress].dataObjectList.length == 0) {
              // 无数据
              that.data.synExeLine = 838
              that.data.synNodataTimeOut = true
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              that.data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              that.data.synExeLine = 943
              that.synSuccessNextDevice()
              // console.log('wx sava data', that.data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: that.data.dataObjectList
              // })
              // that.upStorageDataToService();
            }
          },
          fail: function (res) {
            baseTool.print([res, '设备写入信息失败'])
            if (that.data.deviceObject[macAddress].dataObjectList.length == 0) {
              // 无数据
              that.data.synNodataTimeOut = true
              that.data.synExeLine = 855
              that.synNoDataNextDevice()
            } else {
              //如果有数据 上传数据
              //先把数据保存到微信
              wx.hideLoading()
              that.data.synNodataTimeOut = true
              baseTool.print([res, '数据上传成功'])
              that.data.synExeLine = 952
              that.synSuccessNextDevice()
              // console.log('wx sava data', that.data.dataObjectList)
              // wx.setStorage({
              //   key: "dataObjectList",
              //   data: that.data.dataObjectList
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
  replyOnceComplete: function (deviceId = "") {
    //一条完整数据回复
    var that = this
    var oneDataWrite = "f103" + that.data.dataHead;
    var typedArray = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneDataWrite))
    baseTool.print(['reply', typedArray])
    var oneDataWriteBuffer = typedArray.buffer

    wx.writeBLECharacteristicValue({
      deviceId: deviceId,
      serviceId: that.data.tailServiceUUID,
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
  },
  processOnceData: function (hex, values, deviceId = '') {
    // 刷牙数据
    var that = this
    // 定时器
    that.data.synNodataTimeOut = false
    that.data.dataHead = hex.substring(0, 2)
    //数据处理逻辑
    if (values[2] == 0) {
      that.data.data01 = hex
      baseTool.print(['data01:', that.data.data01])
    } else if (values[2] == 1) {
      that.data.data02 = hex
      baseTool.print(['data02:', that.data.data02])
    } else if (values[2] == 2) {
      that.data.data03 = hex
      baseTool.print(['data03:', that.data.data03])
      //一条完整数据拼接
      var oneCompleteData = that.data.data01 + that.data.data02 + that.data.data03;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      var typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      var deviceInfo = that.data.dataList[that.data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId);

      baseTool.print(["dataObject", dataObject])
      myManager.addDeviceDataObject(dataObject).then(res => {
        that.replyOnceComplete(deviceId)
      }).catch(res => {
        that.replyOnceComplete(deviceId)
      })
      
    }
  },
  newProcessOnceData: function (hex, values, deviceId = '') {
    //初始化头部信息 回复要带
    var that = this
    that.data.dataHead = hex.substring(0, 2)

    //数据处理逻辑
    if (values[2] == 0) {
      that.data.data01 = hex
      baseTool.print(['data01:', that.data.data01])
    } else if (values[2] == 1) {
      that.data.data02 = hex
      baseTool.print(['data02:', that.data.data02])

    } else if (values[2] == 2) {
      that.data.data03 = hex
      baseTool.print(['data03:', that.data.data03])

    } else if (values[2] == 3) {
      that.data.data04 = hex
      baseTool.print(['data04:', that.data.data04])
      //一条完整数据拼接
      var oneCompleteData = that.data.data01 + that.data.data02 + that.data.data03 + that.data.data04;
      baseTool.print(['oneCompleteData:', oneCompleteData])

      var typedArrayOneDate = new Uint8Array(baseHexConvertTool.hexStringToArrayBuffer(oneCompleteData))
      baseTool.print([typedArrayOneDate, '一天的数据'])
      var deviceInfo = that.data.dataList[that.data.synCommandCount]
      baseTool.print([that.data.synCommandCount, deviceInfo, '设备信息'])
      var dataObject = bleCommandManager.dataBoxCommand(typedArrayOneDate, deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId);
      console.log("dataObject", dataObject)
      //放入数据集合
      baseTool.print(["dataObject", dataObject])
      myManager.addDeviceDataObject(dataObject).then(res => {
        that.replyOnceComplete(deviceId)
      }).catch(res => {
        that.replyOnceComplete(deviceId)
      })
    }
  },
  upStorageDataToService: function () {
    var that = this
    wx.hideLoading()
    wx.showLoading({
      title: '上传数据...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    myManager.uploadHistoryBrushRecord().then(res => {
      // 设备数据上传成功
      wx.hideLoading()
      that.data.synNodataTimeOut = true
      baseTool.print([res, '数据上传成功'])
      that.data.synData = true
      wx.startPullDownRefresh({
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })

      baseMessageHandler.sendMessage("refreshContest", res)

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
  timeOut: function (callback = (total) => { }, inteval = 1000, total = 0) {
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
    if (that.data.synCommandCount < that.data.dataList.length) {
      var deviceInfo = that.data.dataList[that.data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand([], deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId)

      baseTool.print(["dataObject", dataObject])
      myManager.addDeviceDataObject(dataObject).then(res => {
        setTimeout(function () {
          that.data.synFailCount++
          that.data.synCommandCount++
          that.dispatchConnect()
        }, 500)
      }).catch(res => {
        setTimeout(function () {
          that.data.synFailCount++
          that.data.synCommandCount++
          that.dispatchConnect()
        }, 500)
      })
      
    } else {
      setTimeout(function () {
        that.dispatchConnect()
      }, 500)
    }
  },
  synNoDataNextDevice: function () {
    var that = this
    if (that.data.synCommandCount < that.data.dataList.length) {
      var deviceInfo = that.data.dataList[that.data.synCommandCount]
      var dataObject = bleCommandManager.dataBoxCommand([], deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId)

      baseTool.print(["dataObject", dataObject])
      var dataObject = bleCommandManager.dataBoxCommand([], deviceInfo.macAddress, deviceInfo.name, deviceInfo.brushingMethodId)

      baseTool.print(["dataObject", dataObject])
      myManager.addDeviceDataObject(dataObject).then(res => {
        setTimeout(function () {
          that.data.synFailCount++
          that.data.synCommandCount++
          that.dispatchConnect()
        }, 500)
      }).catch(res => {
        setTimeout(function () {
          that.data.synFailCount++
          that.data.synCommandCount++
          that.dispatchConnect()
        }, 500)
      })
    } else {
      setTimeout(function () {
        that.dispatchConnect()
      }, 500)
    }
  },
  synSuccessNextDevice: function () {
    var that = this
    setTimeout(function () {
      that.data.synSuccessCount++
      that.data.synCommandCount++
      that.dispatchConnect()
    }, 500)
  }
})