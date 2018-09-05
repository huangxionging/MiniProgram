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
    baseTool.modelAdapter(dynamicItem, dynamics[index].deviceMemberSimplenessRecordVo, res => {
      // dynamicItem[res] = ''
    })
    baseTool.modelAdapter(dynamicItem, dynamics[index], res => {
      // dynamicItem[res] = ''
    })
    dynamicItem.avatar = baseTool.urlToHttp(dynamicItem.avatar)
    if (dynamicItem.dynamicType == 3) {
      dynamicItem.showReport = true
    } else {
      dynamicItem.showReport = false
    }
    brushDataList.push(dynamicItem)
  }
  return brushDataList
}

function burshModelAdpter(videoInfo = {}) {
  let data = {
    loadDone: true,
    teachVideoUrl: 'videoUrl',
    currentIndex: 0,
    title: '请准备好你的牙刷',
    content: '实时跟刷就要开始啦',
    autoplay: false,
    averageTime: 0
  }
  baseTool.modelAdapter(data, videoInfo)
  data.brushModels = []
  let brushModels = videoInfo.toothSurfaceDetailsVoList
  let flagTime = 0.0
  for (let index = 0; index < brushModels.length; ++index) {
    let brushItem = {
      imageUrl: 'pic',
      name: 'name',
      videoPic: 'videoPic',
      duration: 'playDuration',
      startTime: 0
    }
    baseTool.modelAdapter(brushItem, brushModels[index])
    brushItem.startTime = flagTime
    
    flagTime += brushItem.duration
    data.brushModels.push(brushItem)
  }
  data.averageTime = flagTime / data.brushModels.length
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
    baseTool.setValueForKey(wxUser.memberId, 'memberId')
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