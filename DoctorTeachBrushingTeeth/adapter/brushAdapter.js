const baseTool = require('../utils/baseTool.js')

/**
 * 训练营动态
 */
function brushDynamicAdapter(dynamics = []) {
  let brushDataList= []
  for (let index = 0; index < dynamics.length; ++index) {
    let dynamicItem = {
      avatar: 'headimgurl',
      name: 'name',
      score: 'overallScore',
      brushTime: 'brushTeethTime',
      totalTime: 'totalTimeStr',
      cleanIndex: 'overallScore',
      effectiveTime: 'timeStr',
      star: 'posturePoint',
      face: 'seriouslyPoint',
      recordId: 'recordId',
      memberId: 'memberId',
      dynamicType: 'type',
      showReport: true,
      time: 'dynamicTime',
      content: 'dynamicText'
    }
    baseTool.modelAdapter(dynamicItem, dynamics[index], res => {
      dynamicItem[res] = 'dd'
    })
    if (dynamicItem.dynamicType == 3) {
      dynamicItem.showReport = true
    } else {
      dynamicItem.showReport = false
      dynamicItem.showReport = true
    }
    brushDataList.push(dynamicItem)
  }
  return brushDataList
}

function burshModelAdpter(brushModels = []) {
  let data = []

  for (let index = 0; index < brushModels.length; ++index) {
    let brushItem = {
      imageUrl: 'pic',
      name: 'name',
      videoPic: 'videoPic',
      videoUrl: 'videoUrl'
    }
    baseTool.modelAdapter(brushItem, brushModels[index])
    data.push(brushItem)
  }
  return data
}

/**
 * 绑定手机号
 */
function telphoneAdapter(wxUser = {}) {
  if (wxUser.telephone) {
    baseTool.setValueForKey(wxUser.telephone, 'telephone')
  }

  if (wxUser.memberId) {
    baseTool.setValueForKey(wxUser.telephone, 'memberId')
  }
  return {
    telephone: wxUser.telephone
  }
}

/**
 * 用户信息适配
 */
function userInfoAdapter(userInfo = {}) {
  let data = {
    loadDone: true,
    avatar: 'headimgurl',
    userName: 'name',
    signText: 'signText',
    signDisabled: 'isSign'
  }
  baseTool.modelAdapter(data, userInfo)
  return data
}

module.exports = {
  brushDynamicAdapter: brushDynamicAdapter,
  burshModelAdpter: burshModelAdpter,
  telphoneAdapter: telphoneAdapter,
  userInfoAdapter: userInfoAdapter
}