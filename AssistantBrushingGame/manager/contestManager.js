const baseWechat = require('../utils/baseWeChat.js')
const baseURL = require('../utils/baseURL.js')
const baseTool = require('../utils/baseTool.js')
const baseApiList = require('../utils/baseApiList.js')
const loginManager = require('./loginManager.js')
function getHomePage() {
  return new Promise((resolve, reject) => {

    wx.getStorage({
      key: 'gameObject',
      success: function(res) {
        baseTool.print([res, '读取成功'])
        var gameObject = res.data
        var gameList = gameObject.gameList
        var gameItem = gameList[gameList.length - 1]
        resolve(gameItem)
      },
      fail: function(res) {
        baseTool.print([res, '读取失败'])
        var url = baseURL.baseDomain + baseURL.basePath + baseApiList.homePage
        var data = {
          memberId: loginManager.getMemberId()
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
                  // 记录数据
                  gameList: [],
                  // 去重名使用
                  gameNameObject: {},
                  // 主键当做 id 使用
                  primaryKey: 0
                })
                // 再次读取
                var gameObject = wx.getStorageSync('gameObject')
                // 设置 id
                var gameId = gameObject.primaryKey++
                // 设置名字
                var name = gameInfo.name
                // 添加比赛
                gameObject.gameNameObject[name] = gameId
                // 缓存比赛
                var deviceList = []
                var deviceUserBindObject = {}
                for (var index = 0; index < playersList.length; ++index) {
                  var macAddress =playersList[index].macAddress.toUpperCase()
                  // 待同步的列表项
                  baseTool.print(playersList[index])
                  var item = {
                    gameId: gameId,
                    player: playersList[index].name,
                    playerId: playersList[index].playerId,
                    macAddress: macAddress,
                    score: (playersList[index].score != undefined ? playersList[index].score : -1),
                    recordId: (playersList[index].recordId ? playersList[index].recordId : ''),
                    tail: '(game-' + playersList[index].macAddress.toLowerCase() + ')',
                    brushingMethodId: 'a002c7680a5f4f8ea0b1b47fa3f2b947',
                    isBound: true            
                  }
                  deviceList.push(item)
                  deviceUserBindObject[playersList[index].name] = index
                  
                }
                var gameItem = {
                  gameId: gameId,
                  name: name,
                  deviceUserBindObject: deviceUserBindObject,
                  deviceList: deviceList,
                  createTime: gameInfo.createTime,
                  isSyn: true, // 是否已经同步服务器
                  isSave: true
                }
                gameObject.gameList.push(gameItem)
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
      complete: function(res) {},
    })
    
  })
}

/**
 * 添加参赛者
 */
function addContestUser(name = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContestUser
    // var data = {
    //   name: name,
    //   brushingMethodId: brushingMethodId,
    //   memberId: loginManager.getMemberId()
    // }
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })

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
        brushingMethodId: brushingMethodId,
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
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.getContestUserList
    // var data = {
    //   memberId: loginManager.getMemberId()
    // }
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })
    wx.getStorage({
      key: 'contestUserObject',
      success: function(res) {
        baseTool.print(res.data.contestUserList)
        resolve(res.data.contestUserList)
      },
      fail: function(res) {
        baseTool.print(res)
        resolve(res)
      },
      complete: function(res) {},
    })
  })
}

/**
 * 获得参赛名单
 */
function selectContestUser(gameId = '') {
  return new Promise((resolve, reject) => {
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.selectContestUser
    // var data = {
    //   memberId: loginManager.getMemberId(),
    //   gameId: gameId
    // }
    // baseTool.print(data)
    // baseTool.print(url)
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     baseTool.print(res)
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })

    wx.getStorage({
      key: 'contestUserObject',
      success: function (res) {
        var userList = []
        var contestUserObject = res.data
        var contestUserList = contestUserObject.contestUserList
        var gameList = wx.getStorageSync('gameObject').gameList
        var gameItem = gameList[gameList.length - 1]
        baseTool.print(gameItem.deviceUserBindObject)
        for (var index = 0; index < contestUserList.length; ++index) {
          var obj = {
            name: contestUserList[index].name,
            playerId: contestUserList[index].playerId,
            brushingMethodId: contestUserList[index].brushingMethodId,
            isBound: (gameItem.deviceUserBindObject[contestUserList[index].name] != undefined) ? true : false
          }
          userList.push(obj)
        }
        resolve(userList)
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
 * 创建比赛
 */
function addContest(gameId = undefined, name = undefined) {
  return new Promise((resolve, reject) => {
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.addContest
    // var data = {
    //   memberId: loginManager.getMemberId(),
    // }
    // if (gameId) {
    //   data.gameId = gameId
    // }

    // if (name) {
    //   data.name = name
    // }
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })

    // 非空修改比赛 id
    if (gameId != undefined) {

      wx.getStorage({
        key: 'gameObject',
        success: function(res) {
          var gameObject = res.data
          var gameNameObject = gameObject.gameNameObject
          var gameList = gameObject.gameList
          // 删除设备数为 0 的
          for (var index = gameList.length - 1; index >= 0; --index) {
            // 没有设备
            if (gameList[index].gameId == gameId) {
              delete gameNameObject[gameList[index].name]
              gameNameObject[name] = gameId
              gameList[index].name = name
              break
            }
          }
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
        fail: function(res) {},
        complete: function(res) {},
      })
      
    } else {
      var gameObject = wx.getStorageSync('gameObject')
      if (!gameObject) {
        wx.setStorageSync('gameObject', {
          // 记录数据
          gameList: [],
          // 去重名使用
          gameNameObject: {},
          // 主键当做 id 使用
          primaryKey: 0
        })
        gameObject = baseTool.valueForKey('gameObject')
      }

      var gameId = gameObject.primaryKey++
      var name = '刷牙比赛' + gameObject.gameList.length
      gameObject.gameList.push({
        gameId: gameId,
        name: name,
        deviceUserBindObject: {},
        deviceList: [],
        createTime: baseTool.getCurrentTime(),
        isSyn: false, // 是否已经同步服务器
        isSave: false, // 是否第一次同步
      })
      gameObject.gameNameObject[name] = gameId

      wx.setStorage({
        key: 'gameObject',
        data: gameObject,
        success: function (res) {
          resolve({
            game: {
              gameId: gameId,
              name: name
            }
          })
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
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.deleteContest
    // var data = {
    //   memberId: loginManager.getMemberId(),
    //   gameId: gameId,
    // }
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })

    wx.getStorage({
      key: 'gameObject', 
      success: function(res) {
        var gameObject = res.data
        var gameNameObject = gameObject.gameNameObject
        var gameList = gameObject.gameList
        // 删除设备数为 0 的
        for (var index = gameList.length - 1; index >= 0 ; --index) {
          // 没有设备
          if (gameList[index].deviceList.length == 0) {
            delete gameNameObject[gameList[index].name]
            gameList.splice(index, 1)
          } else {
            break
          }
        }
        wx.setStorage({
          key: 'gameObject',
          data: gameObject,
          success: function(res) {
            resolve(res)
          },
          fail: function(res) {
            reject(res)
          },
          complete: function(res) {},
        })
      },
      fail: function(res) {
        reject(res)
      },
      complete: function(res) {},
    })
    
  })
}

function bindContestUser(gameId = '', player = '', playerId = '', macAddress = '', brushingMethodId = '') {
  return new Promise((resolve, reject) => {
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.bindContestUser
    // var data = {
    //   memberId: loginManager.getMemberId(),
    //   gameId: gameId,
    //   player: player,
    //   playerId: playerId,
    //   macAddress: macAddress,
    //   brushingMethodId: brushingMethodId,
    // }
    // baseTool.print(data)
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     if (res.data.code == 'success') {
    //       resolve(res.data.msg);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })
    wx.getStorage({
      key: 'gameObject',
      success: function (res) {
        var gameObject = res.data
        var gameNameObject = gameObject.gameNameObject
        var gameList = gameObject.gameList
        // 删除设备数为 0 的
        var indicate = gameList.length - 1
        var gameItem = gameList[indicate]
        // 添加到这场比赛
        if (gameItem.gameId == gameId) {

          gameItem.deviceList.push({
            gameId: gameId,
            player: player,
            playerId: playerId,
            macAddress: macAddress,
            brushingMethodId: brushingMethodId,
            score: -1,
            recordId: '',
            tail: '(game-' + macAddress.toLowerCase() + ')',
            isBound: true
          })
          // 记录绑定, 用于快速查询绑定数据
          gameItem.deviceUserBindObject[player] = gameItem.deviceList.length - 1

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
        } else {
          reject('绑定失败')
        }
        
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
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.updatePlayers
    // var data = {
    //   memberId: loginManager.getMemberId(),
    //   name: name,
    //   playerId: playerId,
    //   brushingMethodId: brushingMethodId,
    // }
    // baseTool.print(data)
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     baseTool.print(res)
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })
    wx.getStorage({
      key: 'contestUserObject',
      success: function(res) {
        var contestUserObject = res.data
        var contestUserList = contestUserObject.contestUserList
        var oldPlayerId = contestUserObject.contestUserNameObject[name]
        // id 不同且名字一样 则判定重名
        if (oldPlayerId && oldPlayerId != playerId){
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
      fail: function(res) {
        reject(res)
      },
      complete: function(res) {},
    })
  })
}

function delPlayers(playerId = '') {
  return new Promise((resolve, reject) => {
    // var url = baseURL.baseDomain + baseURL.basePath + baseApiList.delPlayers
    // var data = {
    //   memberId: loginManager.getMemberId(),
    //   playerId: playerId,
    // }
    // baseTool.print(data)
    // wx.request({
    //   url: url,
    //   data: data,
    //   success: function (res) {
    //     baseTool.print(res)
    //     if (res.data.code == 'success') {
    //       resolve(res.data.data);
    //     } else {
    //       if (res.data.msg != 'memberId不能为空') {
    //         reject(res.data.msg)
    //       }
    //     }
    //   },
    //   fail: function () {
    //     reject(baseTool.errorMsg)
    //   },
    //   complete: function (res) { },
    // })

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

        if (indicate != -100){
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

function uploadBrushRecord(gameId) {
  return new Promise((resolve, reject) => {
    baseTool.print('从本地数据库上传数据！')
    wx.getStorage({
      key: 'deviceDataObject',
      success: function (res) {
        var deviceDataObject = res.data
        baseTool.print(deviceDataObject)
        var dataObjectList = deviceDataObject.dataObjectList
        var indicate = -100
        for (var index = dataObjectList.length - 1; index >= 0; --index) {
          if (dataObjectList[index].gameId == gameId) {
            indicate = index
            break
          }
        }
        if (indicate != -100) {
          var dataStorageAll = dataObjectList[indicate].deviceDataObjectList
          console.log('wx getStorage', dataStorageAll)
          if (dataStorageAll != null && dataStorageAll.length >= 1) {
            var jsonData = JSON.stringify(dataStorageAll)
            console.log('send:', jsonData);
            console.log('dataObjectList:', dataObjectList[indicate])
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
                gameName: dataObjectList[indicate].gameName,
                gameId: gameId.length > 0 ? gameId : '',
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
                  var gameObjectItem = res.data.data
                  if (gameObjectItem != undefined && gameObjectItem.scoreList != undefined && gameObjectItem.scoreList.length > 0) {
                    wx.getStorage({
                      key: 'gameObject',
                      success: function (res) {
                        var gameObject = res.data
                        var gameList = gameObject.gameList
                        baseTool.print(gameObject)
                        for (var index = 0; index < gameList.length; ++index) {
                          var gameItem = gameList[index]
                          baseTool.print(gameItem)
                          if (gameItem.gameId == gameId) {
                            baseTool.print(gameItem)
                            for (var index1 = 0; index1 < gameObjectItem.scoreList.length; ++index1) {
                              var item = gameObjectItem.scoreList[index1]
                              var player = item.playerName
                              baseTool.print(item)
                              if (player != undefined && gameItem.deviceUserBindObject[player] != undefined) {
                                var indicate = gameItem.deviceUserBindObject[player]
                                var deviceItem = gameItem.deviceList[indicate]
                                if (item.macAddress == deviceItem.macAddress) {
                                  baseTool.print(item)
                                  if (item.overallScore > deviceItem.score) {
                                    baseTool.print(item)
                                    deviceItem.score = item.overallScore
                                    deviceItem.recordId = item.recordId
                                    // 替换 gameId
                                    deviceItem.gameId = item.gameId
                                  }
                                }
                              }
                            }
                            // 替换 gameId
                            gameItem.gameId = gameObjectItem.gameId
                            gameItem.isSyn = true
                            gameObject.gameNameObject[gameObjectItem.name] = gameObjectItem.gameId
                          }
                        }

                        wx.setStorage({
                          key: 'gameObject',
                          data: gameObject,
                          success: function(res) {
                            baseTool.print(res)
                            deleteDeviceDataObject(gameId).then(res => {
                              baseTool.print(res)
                              resolve(res)
                            }).catch(res => {
                              baseTool.print(res)
                              resolve(res)
                            })
                          },
                          fail: function(res) {
                            resolve(res)
                          },
                          complete: function(res) {},
                        })
                      },
                      fail: function (res) {
                        reject(res)
                      },
                      complete: function (res) { },
                    })
                  } else {
                    resolve(gameObjectItem)
                  }
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
        } else {
          reject('gameId 不存在')
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
      key: 'deviceDataObject',
      success: function(res) {
        baseTool.print(res)
        var deviceDataObject = res.data
        var dataObjectList = deviceDataObject.dataObjectList
        if (dataObjectList.length == 0) {
          dataObjectList.push({
            gameId: gameId,
            gameName: gameName,
            deviceDataObjectList: []
          })
        }
        var dataObjectItem = dataObjectList[dataObjectList.length - 1]
        if (dataObjectItem != undefined && dataObjectItem.gameId != undefined && dataObjectItem.gameId != gameId) {
          dataObjectList.push({
            gameId: gameId,
            gameName: gameName,
            deviceDataObjectList: []
          })
          dataObjectItem = dataObjectList[dataObjectList.length - 1]
        }
        // 添加一条数据
        dataObjectItem.deviceDataObjectList.push(deviceDataOject)
        wx.setStorage({
          key: 'deviceDataObject',
          data: deviceDataObject,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          },
          complete: function (res) { },
        })
      },
      fail: function(res) {
        var deviceDataObject = {
          dataObjectList: [{
            gameId: gameId,
            gameName: gameName,
            deviceDataObjectList: [
              deviceDataOject
            ]
          }]
        }
        wx.setStorage({
          key: 'deviceDataObject',
          data: deviceDataObject,
          success: function(res) {
            resolve(res)
          },
          fail: function(res) {
            reject(res)
          },
          complete: function(res) {},
        })
      },
      complete: function(res) {},
    })
  })
}
/**
 * 删除设备数据
 */
function deleteDeviceDataObject(gameId) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'deviceDataObject',
      success: function (res) {
        var deviceDataObject = res.data
        var dataObjectList = deviceDataObject.dataObjectList
        for (var index = dataObjectList.length - 1; index >= 0; --index) {
          var dataObjectItem = dataObjectList[index]
          if (dataObjectItem.gameId == gameId) {
            // 删除数据
            dataObjectList.splice(index, 1)
            wx.setStorage({
              key: 'deviceDataObject',
              data: deviceDataObject,
              success: function (res) {
                resolve(res)
              },
              fail: function (res) {
                reject(res)
              },
              complete: function (res) { },
            })
            break
          }
        }

      },
      fail: function (res) {
        reject(res)
      },
      complete: function (res) { },
    })
  })
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
  // 删除已同步的数据
  deleteDeviceDataObject: deleteDeviceDataObject,
  // 保存结果
  saveBrushRecord: saveBrushRecord,
  
}