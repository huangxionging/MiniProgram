const baseTool = require('../utils/baseTool.js')

function homePageAdapter(res = {}) {
  let data = {
    loadDone: true,
    avatar: 'doctorHeadimgurl',
    doctorName: 'doctorName',
    department: 'offices',
    jobTitle: 'title',
    hospital: 'company',
    reportDataList: [],
    persons: 'trainingCampMemberCount'
  }
  // 模型适配器转换
  baseTool.modelAdapter(data, res.doctorInfo, res => {
    if (['loadDone', 'reportDataList'].indexOf(res) == -1) {
      data[res] = ''
    }
  })

  if (baseTool.isExist(res.trainingCampMemberCount)) {
    data.persons = res.trainingCampMemberCount
  }

  if (baseTool.isExist(res.doctorInfo)) {
    baseTool.setValueForKey(res.doctorInfo, 'doctorInfo')
  }

  if (baseTool.isExist(res.brushingRecord)) {
    for (let index = 0; index < res.brushingRecord.length; ++index) {
      let reportItem = {
        brushTime: 'brushTeethTime',
        totalTime: 'totalTimeStr',
        cleanIndex: 'overallScore',
        effectiveTime: 'timeStr',
        star: 'posturePoint',
        face: 'seriouslyPoint',
        recordId: 'recordId'
      }

      baseTool.modelAdapter(reportItem, res.brushingRecord[index])
      data.reportDataList.push(reportItem)
    }
  }
  return data
}

function doctorInfoDetailAdapter(doctorInfo = {}) {
  let data = {
    loadDone: true,
    avatar: 'doctorHeadimgurl',
    doctorName: 'doctorName',
    department: 'offices',
    jobTitle: 'title',
    hospital: 'company',
    goodat: 'goodat',
    experience: 'experience',
  }
  // 模型适配器转换
  baseTool.modelAdapter(data, doctorInfo)
  return data
}

/**
 * 构造活动列表适配器
 */
function doctorActivityListAdapter(doctorData) {
  let data = [{
    title: '干净的牙齿不会病，' + doctorData.persons + '人正跟着' + doctorData.doctorName + '医生一起用正确的方法及牙线把牙齿清洁干净吧!',
    picUrl: 'http://qnimage.hydrodent.cn/dtb_zero.png'
  }, {
      title: doctorData.doctorName + '医生今天的刷牙报告',
      picUrl: '',
      brushTime: doctorData.reportDataList[0].brushTime,
      totalTime: doctorData.reportDataList[0].totalTime,
      cleanIndex: doctorData.reportDataList[0].cleanIndex,
      effectiveTime: doctorData.reportDataList[0].effectiveTime,
      star: doctorData.reportDataList[0].star,
      face: doctorData.reportDataList[0].face,
      recordId: doctorData.reportDataList[0].recordId
  }]
  return data
}

module.exports = {
  homePageAdapter: homePageAdapter,
  doctorInfoDetailAdapter: doctorInfoDetailAdapter,
  doctorActivityListAdapter: doctorActivityListAdapter
}