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
    title: '马上加入"零蛀牙训练营"👇',
    picUrl: 'http://qnimage.hydrodent.cn/dtb_zero0.png'
  },{
      title: '黑科技告诉你, 刷牙干净了没, 不干净? 还会手把手教你怎么刷👇',
      picUrl: 'http://qnimage.hydrodent.cn/dtb_device_banner.png'
  },{
      title: doctorData.doctorName + '医生今天的刷牙报告, 是不是很赞👍',
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

/**
 * 设备广告页数据
 */
function deviceBannerAdapter() {
  let data = {
    loadDone: true,
    videoUrl: 'http://qnimage.32teeth.cn/main200860S.mp4',
    content: {
      title: '32teeth智能牙刷-爱牙兔系列',
      content: '专为6-12岁换牙期宝贝设计, 正确的刷牙方法, 让孩子少受罪, 父母少花钱, 智能主机与牙刷可拆离, 操作简单, 使用方便',
      picUrl: 'http://qnimage.hydrodent.cn/dtb_device_intro.png',
      color: '#999'
    }
  }
  return data
}

module.exports = {
  homePageAdapter: homePageAdapter,
  doctorInfoDetailAdapter: doctorInfoDetailAdapter,
  doctorActivityListAdapter: doctorActivityListAdapter,
  deviceBannerAdapter: deviceBannerAdapter
}