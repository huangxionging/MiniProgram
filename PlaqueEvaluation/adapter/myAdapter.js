const baseTool = require('../utils/baseTool.js')

function myIndexSectionDataArray() {
  return [
    {
      headerHeight: 0,
      rowDataArray: [
        {
          id: 0,
          section: 0,
          icon: 'my_history_contest.png',
          title: '历史测评数据',
          url: '../brushContestList/brushContestList',
        },
        {
          id: 1,
          section: 0,
          icon: 'my_device_manage.png',
          title: '设备管理',
          url: '../deviceManage/deviceManage',
        },
        {
          id: 2,
          section: 0,
          icon: 'my_device_check.png',
          title: '设备检测',
          url: '../deviceCheck/deviceCheck',
        },
        {
          id: 3,
          section: 0,
          icon: 'my_clinic_Info.png',
          title: '测评单位信息',
          url: '../myClinic/myClinic',
        },
        {
          id: 0,
          section: 0,
          icon: 'my_doctor_manage.png',
          title: '医护人员管理',
          url: '../doctorManage/doctorManage',
        },
        {
          id: 0,
          section: 0,
          icon: 'my_customer_service.png',
          title: '联系客服',
          detail: '400-1618-023',
          styleCalss: 'my-detail',
          url: '../brushContest/brushContest',
        }
      ]
    }
  ]
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray
}