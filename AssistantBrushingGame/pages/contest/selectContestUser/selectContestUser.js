// pages/contest/selectContestUser/selectContestUser.js
const app = getApp()
const contestManager = require('../../../manager/contestManager.js')
const baseWechat = require('../../../utils/baseWeChat.js')
const baseURL = require('../../../utils/baseURL.js')
const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const bleCommandManager = require('../../../manager/bleCommandManager.js')
const baseHexConvertTool = require('../../../utils/baseHexConvertTool.js')
const bluetoothManager = require('../../../manager/bluetoothManager.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingDone: false,
    hasData: false,
    gameId: '',
    deviceId: '',
    macAddress: '',
    deviceName: '',
    dataList: [],
    tailServiceUUID: '0000FFA0-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 notify
    tailCharacteristicIdNotify: '0000FFA2-0000-1000-8000-00805F9B34FB',
    //尾巴读取数据的特征值 write
    tailCharacteristicIdWrite: '0000FFA1-0000-1000-8000-00805F9B34FB',
    reconnectCount: 0,
    dataTimeOut: false,
    failTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    baseTool.print(options)

    that.setData({
      gameId: options.gameId,
      deviceId: options.deviceId,
      macAddress: options.macAddress.toUpperCase(),
      deviceName: options.name
    })

    baseTool.print(that.data.deviceId)
    that.loadData()
    app.userInfoReadyCallback = res => {
      that.loadData()
    }
    // 添加消息处理函数
    baseMessageHandler.addMessageHandler('selectRefresh', that, that.loadData).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })

    // 找服务, 找特征
    wx.showLoading({
      title: '正在连接设备...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    setTimeout(function () {
      that.connectDevice()
      that.deviceConnectionStateChange()
    }, 3000)

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
    wx.setKeepScreenOn({
      keepScreenOn: true,
      success: function (res) {
        baseTool.print([res, '保持屏幕常亮成功'])
      },
      fail: function (res) {
        baseTool.print([res, '保持屏幕常亮失败'])
      },
      complete: function (res) { },
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
    var that = this
    // 删除通知
    baseMessageHandler.removeSpecificInstanceMessageHandler('selectRefresh', this).then(res => {
      baseTool.print(res)
    }).catch(res => {
      baseTool.print(res)
    })
    baseTool.print(that.data.deviceId)
    var buffer = bleCommandManager.closeLightCommand()
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.tailServiceUUID,
      characteristicId: that.data.tailCharacteristicIdWrite,
      value: buffer,
      success: function (res) {
        baseTool.print([res, '成功关灯'])
        wx.closeBLEConnection({
          deviceId: that.data.deviceId,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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

  },
  connectDevice: function () {
    var that = this
    var connectTimeOut = false
    baseTool.startTimer(function (total) {
      if (connectTimeOut == true) {
        baseTool.print(['连接未超时, 停止定时器'])
        return true
      }
      if (total == 0) {
        // 发起重连
        baseTool.print('连接超时')
        var reconnectCount = that.data.reconnectCount
        if (reconnectCount >= 3 && reconnectCount < 100) {
          reconnectCount = 100
          that.setData({
            reconnectCount: reconnectCount
          })
          wx.hideLoading()
          if (that.data.failTips == false) {
            that.setData({
              failTips: true
            })
            wx.showModal({
              title: '提示',
              content: '蓝牙连接失败',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#00a0e9',
              success: function (res) {
                wx.navigateBack()
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }

        } else if (reconnectCount < 3) {
          baseTool.print('发起重连')
          reconnectCount++
          that.setData({
            reconnectCount: reconnectCount
          })
          // 500ms 以后重连
          setTimeout(function () {
            that.connectDevice()
          }, 500)
        }
        return true
      }
      return false
    }, 10, 500)
    baseTool.print(that.data.deviceId)
    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function (res) {
        connectTimeOut = true
        // 50ms 以后执行下一步
        setTimeout(function () {
          // 获得服务
          var serviceTimeOut = false
          // 获得服务
          baseTool.startTimer(function (total) {
            if (serviceTimeOut == true) {
              baseTool.print('获得服务未超时')
              return true
            }
            if (total == 0) {
              baseTool.print('获得服务超时')
              wx.closeBLEConnection({
                deviceId: that.data.deviceId,
                success: function (res) {
                },
                fail: function (res) {
                  // 无数据
                },
                complete: function (res) { },
              })
              wx.hideLoading()
              if (that.data.failTips == false) {
                that.setData({
                  failTips: true
                })
                wx.showModal({
                  title: '提示',
                  content: '蓝牙连接失败',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor: '#00a0e9',
                  success: function (res) {
                    wx.navigateBack()
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
              return true
            }
            return false
          }, 10, 500)
          wx.getBLEDeviceServices({
            deviceId: that.data.deviceId,
            success: function (res) {
              baseTool.print([res, '获得服务成功'])
              serviceTimeOut = true
              setTimeout(function () {
                // 获得服务
                var characteristicsTimeOut = false
                // 获得服务
                baseTool.startTimer(function (total) {
                  if (characteristicsTimeOut == true) {
                    baseTool.print('获得特征值未超时')
                    return true
                  }
                  if (total == 0) {
                    baseTool.print('获得特征值超时')
                    wx.closeBLEConnection({
                      deviceId: that.data.deviceId,
                      success: function (res) {
                      },
                      fail: function (res) {
                        // 无数据
                      },
                      complete: function (res) { },
                    })
                    wx.hideLoading()
                    if (that.data.failTips == false) {
                      that.setData({
                        failTips: true
                      })
                      wx.showModal({
                        title: '提示',
                        content: '蓝牙连接失败',
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#00a0e9',
                        success: function (res) {
                          wx.navigateBack()
                        },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                    }
                    return true
                  }
                  return false
                }, 10, 500)
                wx.getBLEDeviceCharacteristics({
                  deviceId: that.data.deviceId,
                  serviceId: that.data.tailServiceUUID,
                  success: function (res) {
                    characteristicsTimeOut = true
                    setTimeout(function () {
                      // 获得服务
                      var notyfyCharacteristicsTimeOut = false
                      baseTool.startTimer(function (total) {
                        if (notyfyCharacteristicsTimeOut == true) {
                          baseTool.print('预定通知未超时')
                          return true
                        }
                        if (total == 0) {
                          baseTool.print('预定通知超时')
                          wx.closeBLEConnection({
                            deviceId: that.data.deviceId,
                            success: function (res) {
                            },
                            fail: function (res) {
                              // 无数据
                            },
                            complete: function (res) { },
                          })
                          wx.hideLoading()
                          if (that.data.failTips == false) {
                            that.setData({
                              failTips: true
                            })
                            wx.showModal({
                              title: '提示',
                              content: '蓝牙连接失败',
                              showCancel: false,
                              confirmText: '确定',
                              confirmColor: '#00a0e9',
                              success: function (res) {
                                wx.navigateBack()
                              },
                              fail: function (res) { },
                              complete: function (res) { },
                            })
                          }
                          return true
                        }
                        return false
                      }, 10, 500)
                      baseTool.print([res, '获得特征值成功'])
                      // 预订通知
                      that.deviceCharacteristicValueChange(that.data.deviceId)
                      wx.notifyBLECharacteristicValueChange({
                        deviceId: that.data.deviceId,
                        serviceId: that.data.tailServiceUUID,
                        characteristicId: that.data.tailCharacteristicIdNotify,
                        state: true,
                        success: function (res) {
                          baseTool.print([res, '预订通知成功成功'])
                          notyfyCharacteristicsTimeOut = true

                          // 50 ms 以后执行下一步
                          // 定时器
                          that.setData({
                            dataTimeOut: false
                          })
                          // 20s 无法同步完, 算失败
                          baseTool.startTimer(function (total) {
                            if (that.data.dataTimeOut == true) {
                              return true
                            }
                            if (total == 0) {
                              wx.closeBLEConnection({
                                deviceId: that.data.deviceId,
                                success: function (res) {
                                },
                                fail: function (res) {
                                },
                                complete: function (res) { },
                              })
                              wx.hideLoading()
                              if (that.data.failTips == false) {
                                that.setData({
                                  failTips: true
                                })
                                wx.showModal({
                                  title: '提示',
                                  content: '数据传输超时',
                                  showCancel: false,
                                  confirmText: '确定',
                                  confirmColor: '#00a0e9',
                                  success: function (res) {
                                    wx.navigateBack()
                                  },
                                  fail: function (res) { },
                                  complete: function (res) { },
                                })
                              }
                              return true
                            }
                            return false
                          }, 10, 2000)
                          // 介绍设备数据
                        },
                        fail: function (res) {
                          notyfyCharacteristicsTimeOut = true
                          baseTool.print([res, '预订通知失败'])
                          wx.hideLoading()
                          if (that.data.failTips == false) {
                            that.setData({
                              failTips: true
                            })
                            wx.showModal({
                              title: '提示',
                              content: '蓝牙连接失败',
                              showCancel: false,
                              confirmText: '确定',
                              confirmColor: '#00a0e9',
                              success: function (res) {
                                wx.navigateBack()
                              },
                              fail: function (res) { },
                              complete: function (res) { },
                            })
                          }
                        },
                        complete: function (res) { },
                      })
                    }, 50)
                  },
                  fail: function (res) {
                    baseTool.print([res, '获得特征值失败'])
                    characteristicsTimeOut == true
                    wx.closeBLEConnection({
                      deviceId: that.data.deviceId,
                      success: function (res) {
                      },
                      fail: function (res) {
                        // 无数据
                      },
                      complete: function (res) { },
                    })
                    wx.hideLoading()
                    if (that.data.failTips == false) {
                      that.setData({
                        failTips: true
                      })
                      wx.showModal({
                        title: '提示',
                        content: '蓝牙连接失败',
                        showCancel: false,
                        confirmText: '确定',
                        confirmColor: '#00a0e9',
                        success: function (res) {
                          wx.navigateBack()
                        },
                        fail: function (res) { },
                        complete: function (res) { },
                      })
                    }
                  },
                  complete: function (res) { },
                })
              }, 50)
            },
            fail: function (res) {
              baseTool.print([res, '蓝牙获得服务失败'])
              serviceTimeOut = true
              wx.hideLoading()
              if (that.data.failTips == false) {
                that.setData({
                  failTips: true
                })
                wx.showModal({
                  title: '提示',
                  content: '蓝牙连接失败',
                  showCancel: false,
                  confirmText: '确定',
                  confirmColor: '#00a0e9',
                  success: function (res) {
                    wx.navigateBack()
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
            complete: function (res) { },
          })
        }, 50)
      },
      fail: function (res) {
        // baseTool.print([res, '蓝牙连接失败8'])
        // 重连
        connectTimeOut = true
        var reconnectCount = that.data.reconnectCount
        baseTool.print([res, '蓝牙连接失败', reconnectCount])
        if (reconnectCount >= 3 && reconnectCount < 100) {
          reconnectCount = 100
          that.setData({
            reconnectCount: reconnectCount
          })
          wx.hideLoading()
          if (that.data.failTips == false) {
            that.setData({
              failTips: true
            })
            wx.showModal({
              title: '提示',
              content: '蓝牙连接失败',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#00a0e9',
              success: function (res) {
                wx.navigateBack()
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        } else if (reconnectCount < 3) {
          reconnectCount++
          that.setData({
            reconnectCount: reconnectCount
          })
          // 500ms 以后重连
          setTimeout(function () {
            that.connectDevice()
          }, 500)

        }
      },
      complete: function (res) { },
    })
  }
  ,
  addContestUser: function () {
    var that = this
    wx.navigateTo({
      url: '../addOneContestUser/addOneContestUser?gameId=' + that.data.gameId + '&macAddress=' + that.data.macAddress + '&deviceId=' + that.data.deviceId,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  selectClick: function (e) {
    baseTool.print(e)
    var that = this
    var index = e.currentTarget.dataset.id - 1
    var dataList = that.data.dataList
    var isSelect = dataList[index].isSelect
    if (isSelect) {
      return
    } else {
      dataList[index].isSelect = !dataList[index].isSelect
      that.setData({
        dataList: dataList
      })
      wx.showModal({
        title: '提示',
        content: dataList[index].name + ' 在本次比赛中将与设备 ' + that.data.deviceName + ' 绑定',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#999',
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
          baseTool.print(res)

          if (res.cancel) {
            dataList[index].isSelect = !dataList[index].isSelect
            that.setData({
              dataList: dataList
            })
          } else if (res.confirm) {
            that.bindDevice(that.data.dataList[index])
          } else if (!res.cancel && !res.confirm) {
            dataList[index].isSelect = !dataList[index].isSelect
            that.setData({
              dataList: dataList
            })
          }
          // 
        },
        fail: function (res) {
          baseTool.print(res)
        },
        complete: function (res) { baseTool.print(res) },
      })

    }


  },
  bindDevice: function (userInfo) {
    var that = this
    var name = userInfo.name
    var userId = userInfo.playerId
    // macAddress
    wx.showNavigationBarLoading()
    contestManager.bindContestUser(that.data.gameId, name, userId, that.data.macAddress, userInfo.brushingMethodId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      // 删除这个 Mac 地址下的
      baseMessageHandler.sendMessage('deleteDevice', that.data.macAddress)
      var buffer = null
      if (userInfo.brushingMethodId == 'a002c7680a5f4f8ea0b1b47fa3f2b947') {
        buffer = bleCommandManager.connectReplyDeviceCommand()
      } else {
        buffer = bleCommandManager.connectReplyDeviceCommand('00')
      }
      wx.writeBLECharacteristicValue({
        deviceId: that.data.deviceId,
        serviceId: that.data.tailServiceUUID,
        characteristicId: that.data.tailCharacteristicIdWrite,
        value: buffer,
        success: function (res) {
          wx.navigateBack()
        },
        fail: function (res) {
          wx.navigateBack()
        },
        complete: function (res) { },
      })
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.startPullDownRefresh({
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      wx.showModal({
        title: '提示',
        content: res,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
  },
  loadData: function () {
    var that = this
    wx.showNavigationBarLoading()
    contestManager.selectContestUser(that.data.gameId).then(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
      baseTool.print(typeof (res))
      if (typeof (res) != 'undefined' && res.length > 0) {
        var data = that.data
        data.loadingDone = true
        data.hasData = true
        data.dataList.splice(0, data.dataList.length)
        for (var index = 0; index < res.length; ++index) {
          data.dataList.push({
            name: res[index].name, // 名字
            playerId: res[index].playerId, // 参赛者的 id
            brushingMethodId: res[index].brushingMethodId,
            id: index + 1, // 主key
            isSelect: res[index].isBound
          })
        }
        that.setData(data)
      } else {
        var data = that.data
        data.loadingDone = true
        data.hasData = false
        data.dataList.splice(0, data.dataList.length)
        that.setData(data)
      }
    }).catch(res => {
      baseTool.print(res)
      wx.hideNavigationBarLoading()
      wx.showModal({
        title: '提示',
        content: res,
        confirmText: '确定',
        confirmColor: '#00a0e9',
        success: function (res) {
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
  },
  deviceConnectionStateChange: function () {
    wx.onBLEConnectionStateChange(function (res) {
      baseTool.print([res, '蓝牙状态改变'])
      if (res.connected == false) {

      }
    })
  },
  deviceCharacteristicValueChange: function (deviceId = '') {
    var that = this

    wx.onBLECharacteristicValueChange(function (res) {
      var hex = baseHexConvertTool.arrayBufferToHexString(res.value)
      baseTool.print([hex, '通知信息'])
      // 兼容产品
      if (hex.indexOf('f20f') == 0 || hex.indexOf('f30f') == 0) {
        // 查找设备命令
        var buffer = bleCommandManager.findDeviceCommand()
        wx.writeBLECharacteristicValue({
          deviceId: deviceId,
          serviceId: that.data.tailServiceUUID,
          characteristicId: that.data.tailCharacteristicIdWrite,
          value: buffer,
          success: function (res) {
            baseTool.print([res, '查找设备命令发送成功'])
          },
          fail: function (res) {
            baseTool.print([res, '设备常亮失败'])
          },
          complete: function (res) { },
        })
      } else if (hex.indexOf('f30c') == 0) {
        baseTool.print([res, '设备常亮'])
        that.setData({
          dataTimeOut: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '点亮设备',
          icon: '',
          image: '',
          duration: 3000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  }
})