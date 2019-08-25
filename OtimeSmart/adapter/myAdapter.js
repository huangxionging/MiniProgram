const baseTool = require('../utils/baseTool.js')

function myIndexSectionDataArray() {
  return [
    {
      headerHeight: 20,
      rowDataArray: [
        {
          id: 0,
          section: 0,
          icon: 'my_device.png',
          title: '请绑定设备',
          url: '/pages/my/deviceManage/deviceManage',
        }
      ]
    },
    {
      headerHeight: 20,
      rowDataArray: [
        {
          id: 0,
          section: 0,
          icon: 'my_moment.png',
          title: '家庭圈管理',
          url: '../brushContestList/brushContestList',
        }
      ]
    },
    {
      headerHeight: 20,
      rowDataArray: [
        {
          id: 0,
          section: 0,
          icon: 'my_sedentary_reminder.png',
          title: '久坐提醒',
          detail: '3小时',
          url: '../brushContestList/brushContestList',
        },
        {
          id: 1,
          section: 0,
          icon: 'my_heart_blood.png',
          title: '心率与血压设置',
          detail: '120次/分',
          url: '../brushContestList/brushContestList',
        },
        {
          id: 2,
          section: 0,
          icon: 'my_find_device.png',
          title: '查找设备',
          url: '../brushContestList/brushContestList',
        }
      ]
    },
    {
      headerHeight: 20,
      rowDataArray: [
        {
          id: 0,
          section: 0,
          icon: 'my_message.png',
          title: '信息',
          url: '../brushContestList/brushContestList',
        },
        {
          id: 1,
          section: 0,
          icon: 'my_unit.png',
          title: '计量单位',
          detail: '英寸',
          url: '../brushContestList/brushContestList',
        },
        {
          id: 2,
          section: 0,
          icon: 'my_about.png',
          title: '关于',
          url: '../brushContestList/brushContestList',
        }
      ]
    }
  ]
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray
}