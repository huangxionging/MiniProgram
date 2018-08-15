const baseTool = require('../utils/baseTool.js')

function homePageAdapter(res = {}) {
  let data = {
    loadDone: true,
    avatar: 'doctorHeadimgurl',
    doctorName: 'doctorName',
    department: 'offices',
    jobTitle: 'title',
    hospital: 'company',
    reportDataList: []
  }
  // 模型适配器转换
  baseTool.modelAdapter(data, res.doctorInfo)

  if (res.doctorInfo) {
    baseTool.setValueForKey(res.doctorInfo, 'doctorInfo')
  }

  if (res.brushingRecord) {
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

function getdoctorInfoAdapter(doctorInfo = {}) {
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
  baseTool.print(doctorInfo)
  baseTool.modelAdapter(data, doctorInfo, res => {
    if (res != 'loadDone') {
      data[res] = '未填写'
    }
  })
  return data;
}

module.exports = {
  homePageAdapter: homePageAdapter,
  getdoctorInfoAdapter: getdoctorInfoAdapter,
}