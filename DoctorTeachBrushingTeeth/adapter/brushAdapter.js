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
    signDisabled: 'isSign',
    campTitle: 'trainingCampName',
    campNumber: 'trainingCampMemberCount',
    memberList: 'joinCampMemberList',
    bannerList: 'carouselList'
  }
  baseTool.modelAdapter(data, userInfo.trainingCampInfo)
  baseTool.modelAdapter(data, userInfo)
  data.campTitle = userInfo.trainingCampInfo.trainingCampTitle
  data.campNumber = data.campNumber + '人已参加 | ' + userInfo.trainingCampInfo.followingBrushCount + '人已跟刷'
  for (let index = 0; index < data.memberList.length; ++index) {
    if (data.memberList[index].length > 2) {
      data.memberList[index] = data.memberList[index].substr(0, 1) + '**' + data.memberList[index].substr(data.memberList[index].length - 1, 1) + '已加入训练营'
    } else {
      data.memberList[index] += '已加入训练营'
    }
  }
  data.campJoinTip = data.memberList[0]
  // data.signDisabled = 0
  return data
}

/**
 * 训练营报名动态数据
 */
function brushZeroCampAdapter(campInfo = {}) {
  let data = {
    loadDone: true,
    doctors: 'doctorCount',
    users: 'trainingCampMemberCount',
    itemList: []
  }
  baseTool.modelAdapter(data, campInfo)
  if (baseTool.isExist(campInfo.nameList)) {
    for (let index = 0; index < campInfo.nameList.length; index += 2) {
      let item = {
        leftName: '',
        rightName: ''
      }
      let left = campInfo.nameList[index]
      if (left.length <= 1) {
        item.leftName = left
      } else {
        item.leftName = left.substr(0, 1) + '***' 
          // + left.substr(left.length - 1, 1)
      }

      if (index + 1 < campInfo.nameList.length) {
        let right = campInfo.nameList[index + 1]
        if (right.length <= 1) {
          item.rightName = right
        } else {
          item.rightName = right.substr(0, 1) + '***' 
            // + right.substr(right.length - 1, 1)
        }
      }
      data.itemList.push(item)
    }
  }
  return data
}

module.exports = {
  brushDynamicAdapter: brushDynamicAdapter,
  burshModelAdpter: burshModelAdpter,
  telphoneAdapter: telphoneAdapter,
  userInfoAdapter: userInfoAdapter,
  brushZeroCampAdapter: brushZeroCampAdapter
}