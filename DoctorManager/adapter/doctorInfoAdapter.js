const baseTool = require('../utils/baseTool.js')

function getDoctorInfoAdapter(doctorInfo = {}) {
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

function encodeDoctorInfoAdapter(doctorInfo = {}) {
  let data = {
    doctorHeadimgurl: 'avatar',
    doctorName: 'doctorName',
    offices: 'department',
    title: 'jobTitle',
    company: 'hospital',
    goodat: 'goodat',
    experience: 'experience',
  }
  // 模型适配器转换
  baseTool.print(doctorInfo)
  baseTool.modelAdapter(data, doctorInfo)
  return data;
}



module.exports = {
  getDoctorInfoAdapter: getDoctorInfoAdapter,
  encodeDoctorInfoAdapter: encodeDoctorInfoAdapter,
}