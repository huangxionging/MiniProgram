const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')

// 0 表示巴氏, 1 表示圆弧
let brushMethods = ["a002c7680a5f4f8ea0b1b47fa3f2b947", "6827c45622b141ef869c955e0c51f9f8"]

function getHomePage() {
  return new Promise((resolve, reject) => {

    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        baseTool.print([res, '读取成功'])
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem
        var gameItem = gameObject.gameItem
        // 有绑定设备
        var deviceList = null
        if (gameNewItem && gameNewItem.deviceListObject) {
          deviceList = baseTool.values(gameNewItem.deviceListObject)
        }
        if (deviceList && deviceList.length > 0) {
          resolve(gameNewItem)
        } else {
          resolve(gameItem)
        }
      },
      fail: function (res) {
        baseTool.print([res, '读取失败'])
        var url = baseURL.baseDomain + baseURL.basePath + baseApiList.homePage
        var openid = baseTool.valueForKey('openid')
        var data = {
          memberId: loginManager.getMemberId(),
          openid: openid
        }
        baseTool.print(url)
        wx.request({
          url: url,
          data: data,
          success: function (res) {
            baseTool.print([res])
            if (res.data.code == 'success') {
              var result = res.data.data
              if (result == undefined) {
                resolve(result)
                return
              }
              var gameInfo = result.gameInfo
              var playersList = result.playersList
              // 有结果

              if (typeof (result) != 'undefined' && playersList != undefined) {
                baseTool.print([result, playersList])
                // 先设置数据
                wx.setStorageSync('gameObject', {
                  // 记录数据, 现有比赛数据
                  gameItem: {},
                  // 新建比赛使用
                  gameNewItem: {},
                  // 主键当做 id 使用
                  primaryKey: 0
                })
                // 再次读取
                var gameObject = wx.getStorageSync('gameObject')

                // 设置名字
                var name = gameInfo.name

                // 缓存比赛
                var deviceListObject = {}
                var deviceUserBindObject = {}
                for (var index = 0; index < playersList.length; ++index) {
                  var macAddress = playersList[index].macAddress.toUpperCase()
                  // 待同步的列表项
                  baseTool.print(playersList[index])
                  var item = {
                    playerId: playersList[index].playerId,
                    name: playersList[index].name,
                    macAddress: macAddress,
                    score: (playersList[index].score != undefined ? playersList[index].score : -1),
                    recordId: (playersList[index].recordId ? playersList[index].recordId : ''),
                    tail: '(game-' + playersList[index].macAddress.toLowerCase() + ')',
                    isBound: true,
                    accuracy: playersList[index].accuracy,
                    isSyn: true,
                    dataObjectList: []
                  }
                  deviceListObject[macAddress] = item
                  deviceUserBindObject[playersList[index].name] = macAddress
                }

                var gameItem = {
                  gameId: gameInfo.gameId,
                  name: name,
                  deviceUserBindObject: deviceUserBindObject,
                  deviceListObject: deviceListObject,
                  startTime: gameInfo.startTime,
                  isSyn: true, // 是否已经同步服务器
                  isSave: true,
                  brushingMethodId: gameInfo.brushingMethodId ? gameInfo.brushingMethodId : brushMethods[0],
                  isSynDeviceList: true
                }
                gameObject.gameItem = gameItem
                gameObject.gameNewItem = gameItem
                wx.setStorage({
                  key: 'gameObject',
                  data: gameObject,
                  success: function (res) {
                    resolve(gameItem)
                  },
                  fail: function (res) {
                    reject(res)
                  },
                  complete: function (res) { },
                })
              } else {
                resolve(result)
              }

            } else {
              if (res.data.msg != 'memberId不能为空') {
                reject(res.data.msg)
              }
            }
          },
          fail: function () {
            reject(baseTool.errorMsg)
          },
          complete: function (res) { },
        })
      },
      complete: function (res) { },
    })

  })
}

/**
 * 添加参赛者
 */
function addContestUser(name = '') {
  return new Promise((resolve, reject) => {

    var contestUserObject = wx.getStorageSync('contestUserObject')
    if (!contestUserObject) {
      wx.setStorageSync('contestUserObject', {
        // 记录数据
        contestUserList: [],
        // 去重名使用
        contestUserNameObject: {},
        // 更新数据时使用
        // 主键当做 id 使用
        primaryKey: 0
      })
      contestUserObject = baseTool.valueForKey('contestUserObject')
    }

    if (contestUserObject.contestUserNameObject[name] != undefined) {
      reject('名字重复')
    } else {
      var playerId = contestUserObject.primaryKey++
      contestUserObject.contestUserNameObject[name] = playerId
      var item = {
        name: name,
        playerId: playerId
      }
      contestUserObject.contestUserList.push(item)

      wx.setStorage({
        key: 'contestUserObject',
        data: contestUserObject,
        success: function (res) {
          resolve(item)
        },
        fail: function (res) {
          reject(res)
        },
        complete: function (res) { },
      })
    }
  })
}

/**
 * 获得参赛名单
 */
function getContestUserList() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {
        baseTool.print(res.data.contestUserList)
        resolve(res.data.contestUserList)
      },
      fail: function (res) {
        baseTool.print(res)
        resolve(res)
      },
      complete: function (res) { },
    })
  })
}

/**
 * 获得参赛名单
 */
function selectContestUser() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {
        var userList = []
        var userBindList = []
        var contestUserObject = res.data
        var contestUserList = contestUserObject.contestUserList
        var gameNewItem = wx.getStorageSync('gameObject').gameNewItem
        baseTool.print(["数据数据", gameNewItem.deviceUserBindObject])
        for (var index = 0; index < contestUserList.length; ++index) {
          var obj = {
            name: contestUserList[index].name,
            playerId: contestUserList[index].playerId,
            isBound: (gameNewItem.deviceUserBindObject[contestUserList[index].name] != undefined) ? true : false
          }

          if (obj.isBound == true) {
            userBindList.push(obj)
          } else {
            userList.push(obj)
          }

        }
        // 拼接数组
        var allUserList = userList.concat(userBindList)
        resolve(allUserList)
      },
      fail: function (res) {
        baseTool.print(res)
        resolve(res)
      },
      complete: function (res) { },
    })
  })
}



/**
 * @param type 表示修改(modify)或者创建(create), 默认是创建
 * 创建比赛
 */

function addContest(gameId = "", name = undefined, time = undefined, brushMethod = 0, type = "create") {
  return new Promise((resolve, reject) => {
    baseTool.print([gameId, name, time, brushMethod, type])
    if (type == "modify") {
      wx.getStorage({
        key: 'gameObject',
        success: function (res) {
          var gameObject = res.data
          var gameNewItem = gameObject.gameNewItem
          gameNewItem.gameId = gameId
          gameNewItem.name = name
          gameNewItem.startTime = time
          gameNewItem.brushingMethodId = brushMethods[brushMethod]

          wx.setStorage({
            key: 'gameObject',
            data: gameObject,
            success: function (res) {
              resolve(res)
            },
            fail: function (res) {
              reject(res)
            },
            complete: function (res) { },
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    } else {
      var gameObject = wx.getStorageSync('gameObject')
      if (!gameObject) {
        wx.setStorageSync('gameObject', {
          // 记录数据, 现有比赛数据
          gameItem: {},
          // 新建比赛使用
          gameNewItem: {},
          // 主键当做 id 使用
          primaryKey: 0
        })
        gameObject = baseTool.valueForKey('gameObject')
      }
      name = '刷牙比赛' + gameObject.primaryKey++
      var startTime = baseTool.getNextMinuteTimeWithZeroSecond()


      gameObject.gameNewItem = {
        gameId: "", // gameId
        name: name, // 名字
        deviceUserBindObject: {}, // 设备绑定关系
        deviceListObject: {}, // 设备绑定对象, 用 macAddress 作 key
        startTime: startTime, // 创建时间
        isSyn: false, // 是否已经同步服务器
        isSave: false, // 是否第一次同步
        isSynDeviceList: true, // 
        // 默认选巴氏刷牙法
        brushingMethodId: brushMethods[brushMethod] // 表示巴氏, "6827c45622b141ef869c955e0c51f9f8" 表示
      }

      wx.setStorage({
        key: 'gameObject',
        data: gameObject,
        success: function (res) {
          resolve(gameObject.gameNewItem)
        },
        fail: function (res) {
          reject(res)
        },
        complete: function (res) { },
      })
    }

  })
}

/**
 * 创建比赛
 */
function deleteContest(gameId = '') {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem
        var gameItem = gameObject.gameItem
        // 没有设备列表将被删除
        var deviceList = baseTool.values(gameNewItem.deviceListObject)
        var oldDeviceList = baseTool.values(gameItem.deviceListObject)
        
        if (deviceList.length == 0 && oldDeviceList.length > 0) {
          // 复原
          gameObject.gameNewItem = gameItem
          wx.setStorage({
            key: 'gameObject',
            data: gameObject,
            success: function (res) {
              resolve(res)
            },
            fail: function (res) {
              reject(res)
            },
            complete: function (res) { },
          })
        } else if (deviceList.length == 0 && oldDeviceList.length == 0){
          wx.removeStorage({
            key: 'gameObject',
            success: function(res) {
              resolve(res)
            },
            fail: function(res) {
              reject(res)
            },
            complete: function(res) {},
          })
        } else {
          resolve(res)
        }
        
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })

  })
}

function bindContestUser(name = '', macAddress = '') {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem

        var obj = {
          playerId: -1,
          name: name,
          macAddress: macAddress,
          score: -1,
          recordId: "",
          tail: '(game-' + macAddress.toLowerCase() + ')',
          isBound: true,
          accuracy: "",
          isSyn: false,
          dataObjectList: []
        }
        gameNewItem.deviceListObject[macAddress] = obj
        baseTool.print([name, macAddress, gameNewItem.deviceUserBindObject, "绑定"])
        // 记录绑定, 用于快速查询绑定数据
        gameNewItem.deviceUserBindObject[name] = macAddress
        gameNewItem.isSynDeviceList = false
        wx.setStorage({
          key: 'gameObject',
          data: gameObject,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })
  })
}

function updatePlayers(name = '', playerId = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {
        var contestUserObject = res.data
        var contestUserList = contestUserObject.contestUserList
        var oldPlayerId = contestUserObject.contestUserNameObject[name]
        // id 不同且名字一样 则判定重名
        if (oldPlayerId && oldPlayerId != playerId) {
          reject('重名了')
        } else {
          for (var index = 0; index < contestUserList.length; index++) {
            if (contestUserList[index].playerId == playerId) {

              // 删除旧数据
              delete contestUserObject.contestUserNameObject[contestUserList[index].name]
              // 添加新数据
              contestUserObject.contestUserNameObject[name] = playerId
              // 更改列表数据
              contestUserList[index].name = name
              contestUserList[index].brushingMethodId = brushingMethodId
              break
            }
          }

          wx.setStorage({
            key: 'contestUserObject',
            data: contestUserObject,
            success: function (res) {
              resolve(res)
            },
            fail: function (res) {
              reject(res)
            },
            complete: function (res) { },
          })
        }
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })
  })
}

function delPlayers(playerId = '') {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {
        var contestUserObject = res.data
        var contestUserList = contestUserObject.contestUserList
        var indicate = -100
        for (var index = 0; index < contestUserList.length; index++) {
          if (contestUserList[index].playerId == playerId) {
            indicate = index
            break
          }
        }

        if (indicate != -100) {
          delete contestUserObject.contestUserNameObject[contestUserList[indicate].name]
          contestUserList.splice(indicate, 1)
        }

        baseTool.print(contestUserList)
        wx.setStorage({
          key: 'contestUserObject',
          data: contestUserObject,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })
  })
}

function saveBrushRecord(gameId) {

  var gameObject = wx.getStorageSync('gameObject')
  var gameList = gameObject.gameList
  for (var index = 0; index < gameList.length; ++index) {
    var gameItem = gameList[index]
    if (gameItem.gameId == gameId) {
      // 修改数据
      // gameItem.isSyn = true
      gameItem.isSave = true
      break
    }
  }
  wx.setStorageSync('gameObject', gameObject)
}

function uploadBrushRecord(gameId, startTime) {
  return new Promise((resolve, reject) => {
    baseTool.print('从本地数据库上传数据！')

    var memberId = loginManager.getMemberId()
    baseTool.print("时间:" + startTime + ":" + memberId)
    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem
        var deviceList = baseTool.values(gameNewItem.deviceListObject)
        var deviceDataObjectList = []
        for (var key in gameNewItem.deviceListObject) {
          baseTool.print([key, gameNewItem.deviceListObject[key]])
          deviceDataObjectList = deviceDataObjectList.concat(gameNewItem.deviceListObject[key].dataObjectList)
        }

        console.log('wx getStorage', deviceDataObjectList)
        if (deviceDataObjectList != null && deviceDataObjectList.length >= 1) {
          var jsonData = JSON.stringify(deviceDataObjectList)
          console.log('send:', jsonData);
          var url = baseURL.baseDomain + baseURL.basePath + baseApiList.gameUploadBrushTeethRecord
          baseTool.print(url)
          wx.request({
            //上传数据接口
            url: url,
            //如果设为json，会尝试对返回的数据做一次 JSON.parse
            dataType: 'json',
            data: {
              sign: '123456',
              timestamp: Date.parse(new Date()),
              memberId: loginManager.getMemberId(),
              gameName: gameNewItem.name,
              gameId: gameId.length > 0 ? gameId : '',
              startTime: startTime,
              data: jsonData,
            },
            header: {
              "sourceType": "wx",
              'content-type': 'application/x-www-form-urlencoded', // 默认值
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              //上传数据返回成功之后刷新主页分数
              baseTool.print(res)
              if (res.data.code == 'success') {
                // resolve(res.data.data);
                wx.removeStorageSync("gameObject")
                resolve(res)
                // var gameObjectItem = res.data.data
                // if (gameObjectItem != undefined && gameObjectItem.scoreList != undefined && gameObjectItem.scoreList.length > 0) {
                //   gameNewItem.isSyn = true
                //   for (var index = 0; index < gameObjectItem.scoreList.length; ++index) {
                //     var item = gameObjectItem.scoreList[index]
                //     var macAddress = item.macAddress
                //     var deviceObject = gameNewItem.deviceListObject[macAddress]
                //     baseTool.print([item, deviceObject])
                //     deviceObject.recordId = item.recordId
                //     // 分数
                //     if (item.overallScore >= deviceObject.score) {
                //       deviceObject.score = item.overallScore

                //       // 小数

                //       if (deviceObject.accuracy == "" || parseFloat(item.accuracy) > parseFloat(deviceObject.accuracy)) {
                //         deviceObject.accuracy = item.accuracy
                //       }
                //     }


                //     deviceObject.isSyn = true
                //     // 清空上传数据
                //     deviceObject.dataObjectList.splice(0, deviceObject.dataObjectList.length)
                //   }
                //   baseTool.print(["所有数据", gameObject])
                //   gameObject.gameItem = gameNewItem
                //   wx.setStorage({
                //     key: 'gameObject',
                //     data: gameObject,
                //     success: function (res) {
                //       baseTool.print(res)
                //       resolve(res)
                //     },
                //     fail: function (res) {
                //       resolve(res)
                //     },
                //     complete: function (res) { },
                //   })
                // } else {
                //   resolve(gameObjectItem)
                // }
              } else {
                if (res.data.msg != 'memberId不能为空') {
                  reject(res.data.msg)
                }
              }
            },
            fail: function (res) {
              reject(baseTool.errorMsg)
            }
          })
        } else {
          reject('全部无数据')
        }
      }
    })
  })
}




function tagSynGame(gameId = '') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.tagSyn
    var data = {
      memberId: loginManager.getMemberId(),
      gameId: gameId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        baseTool.print(res)
        if (res.data.code == 'success') {
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function addDeviceDataObject(deviceDataOject, gameId, gameName) {
  return new Promise((resolve, reject) => {

    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        baseTool.print([res, "设备数据:", deviceDataOject, "设备地址: ", deviceDataOject.macAddress])
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem
        var macAddress = deviceDataOject.macAddress
        var deviceItem = gameNewItem.deviceListObject[macAddress]
        deviceItem.dataObjectList.push(deviceDataOject)
        // 添加一条数据
        wx.setStorage({
          key: 'gameObject',
          data: gameObject,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          },
          complete: function (res) { },
        })
      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })
  })
}


function submitUserDeviceBindingRelationship() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem

        // 没有设备列表
        if (Object.keys(gameNewItem.deviceListObject).length == 0) {
          reject({
            state: "fail",
            msg: "您还未绑定比赛设备哦"
          })
        } else {
          var url = baseURL.baseDomain + baseURL.basePath + baseApiList.createParticipantsList
          var clinicId = baseTool.valueForKey('clinicId')
          var openid = baseTool.valueForKey('openid')
          var deviceList = baseTool.values(gameNewItem.deviceListObject).map(function (value, index, array) {
            return {
              name: value.name,
              macAddress: value.macAddress
            }
          })
          var data = {
            memberId: loginManager.getMemberId(),
            gameId: gameNewItem.gameId,
            gameName: gameNewItem.name,
            clinicId: clinicId,
            openid: openid,
            data: deviceList,
            startTime: gameNewItem.startTime,
            brushingMethodId: gameNewItem.brushingMethodId
          }
          baseTool.print([url, data])
          wx.request({
            url: url,
            data: data,
            success: function (res) {
              baseTool.print(res)
              if (res && res.data.code == "success") {
                var gameInfo = res.data.data.gameInfo
                var gameId = gameInfo.gameId
                gameNewItem.gameId = gameId
                gameNewItem.isSynDeviceList = true
                // 

                var playerList = res.data.data.playerList
                baseTool.print(playerList)
                if (playerList && playerList.length) {
                  for (var index = 0; index < playerList.length; ++index) {
                    var item = playerList[index]
                    var deviceItem = gameNewItem.deviceListObject[item.macAddress]
                    deviceItem.playerId = item.playerId
                    deviceItem.isSyn = true
                  }
                }
                wx.setStorage({
                  key: 'gameObject',
                  data: gameObject,
                  success: function (res1) {
                    resolve(res)
                  },
                  fail: function (res) {
                    reject(res)
                  },
                  complete: function (res) { },
                })
              } else {
                reject({
                  msg: "网络错误, 稍后重试"
                })
              }
            },
            fail: function (res) {
              reject({
                msg: "网络错误, 稍后重试"
              })
            },
            complete: function (res) { },
          })
        }
      },
      fail: function (res) { reject(res) },
      complete: function (res) { },
    })

  })
}

function removeUnSavedDevice() {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        var gameObject = res.data
        var gameNewItem = gameObject.gameNewItem
        for (var key in gameNewItem.deviceListObject) {
          var obj = gameNewItem.deviceListObject[key]
          if (obj.isSyn == false) {
            delete gameNewItem.deviceListObject[key]
            delete gameNewItem.deviceUserBindObject[obj.name]
          }
        }
        gameNewItem.isSynDeviceList = true
        gameObject.gameNewItem = gameNewItem
        wx.setStorage({
          key: 'gameObject',
          data: gameObject,
          success: function (res1) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          },
          complete: function (res) { },
        })

      },
      fail: function (res) { reject(res) },
      complete: function (res) { },
    })

  })
}

function deleteBindUserDevice(playerId = '', macAddress = '', name ='') {
  return new Promise((resolve, reject) => {
    var url = baseURL.baseDomain + baseURL.basePath + baseApiList.delPlayers
    var data = {
      memberId: loginManager.getMemberId(),
      playerId: playerId,
    }
    baseTool.print(data)
    wx.request({
      url: url,
      data: data,
      success: function (res) {
        baseTool.print(res)
        if (res.data.code == 'success') {
          var gameObject = wx.getStorageSync("gameObject")
          var gameNewItem = gameObject.gameNewItem
          delete gameNewItem.deviceListObject[macAddress]
          delete gameNewItem.deviceUserBindObject[name]
          if(Object.keys(gameNewItem.deviceUserBindObject).length == 0) {
            wx.removeStorageSync("gameObject")
          } else {
            wx.setStorageSync("gameObject", gameObject)
          }
          
          resolve(res.data.data);
        } else {
          if (res.data.msg != 'memberId不能为空') {
            reject(res.data.msg)
          }
        }
      },
      fail: function () {
        reject(baseTool.errorMsg)
      },
      complete: function (res) { },
    })
  })
}

function getBindUserDevices() {

  var gameObject = wx.getStorageSync("gameObject")
  if (gameObject) {
    var gameNewItem = gameObject.gameNewItem
    if (gameNewItem && gameNewItem.deviceListObject) {
      var deviceListObject = gameNewItem.deviceListObject
      var deviceList = baseTool.values(deviceListObject)
      return deviceList
    } else {
      return null
    }
  } else {
    return null
  }
}

function getGameQrcode(gameId = '', memberId = '') {
  
}

module.exports = {
  // 首页接口
  getHomePage: getHomePage,
  // 添加比赛用户
  addContestUser: addContestUser,
  // 获得用户列表
  getContestUserList: getContestUserList,
  // 添加比赛
  addContest: addContest,
  // 选择参赛用户页面
  selectContestUser: selectContestUser,
  // 删除比赛
  deleteContest: deleteContest,
  // 绑定参赛者
  bindContestUser: bindContestUser,
  // 更新用户信息
  updatePlayers: updatePlayers,
  // 删除用户
  delPlayers: delPlayers,
  // 上传刷牙数据
  uploadBrushRecord: uploadBrushRecord,
  // 标识同步
  tagSynGame: tagSynGame,
  // 添加设备数据
  addDeviceDataObject: addDeviceDataObject,
  // 保存结果
  saveBrushRecord: saveBrushRecord,
  submitUserDeviceBindingRelationship: submitUserDeviceBindingRelationship,
  // 删除设备
  removeUnSavedDevice: removeUnSavedDevice,
  // 删除绑定设备
  deleteBindUserDevice: deleteBindUserDevice,
  // 获得绑定关系
  getBindUserDevices: getBindUserDevices,
  //
  getGameQrcode: getGameQrcode,
}