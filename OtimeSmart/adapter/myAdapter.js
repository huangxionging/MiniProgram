const baseTool = require('../utils/baseTool.js')

function myIndexSectionDataArray() {
  return [{
      headerHeight: 20,
      rowDataArray: [{
        id: 0,
        section: 0,
        icon: 'my_device.png',
        title: '请绑定设备',
        url: '/pages/my/deviceManage/deviceManage',
      }]
    },
    {
      headerHeight: 20,
      rowDataArray: [{
        id: 0,
        section: 0,
        icon: 'my_moment.png',
        title: '家庭圈管理',
        url: '/pages/my/familyCircleManage/familyCircleManage',
      }]
    },
    {
      headerHeight: 20,
      rowDataArray: [
        // {
      //     id: 0,
      //     section: 0,
      //     icon: 'my_sedentary_reminder.png',
      //     title: '久坐提醒',
      //     detail: '3小时',
      //     url: '../brushContestList/brushContestList',
      //   },
      //   {
      //     id: 1,
      //     section: 0,
      //     icon: 'my_heart_blood.png',
      //     title: '心率与血压设置',
      //     detail: '120次/分',
      //     url: '../brushContestList/brushContestList',
      //   },
        {
          id: 2,
          section: 0,
          icon: 'my_find_device.png',
          title: '查找设备',
          action: "CB0429",
          url: '../brushContestList/brushContestList',
        }
      ]
    },
    // {
    //   headerHeight: 20,
    //   rowDataArray: [{
    //       id: 0,
    //       section: 0,
    //       icon: 'my_message.png',
    //       title: '信息',
    //       url: '../brushContestList/brushContestList',
    //     },
    //     {
    //       id: 1,
    //       section: 0,
    //       icon: 'my_unit.png',
    //       title: '计量单位',
    //       detail: '英寸',
    //       url: '../brushContestList/brushContestList',
    //     },
    //     {
    //       id: 2,
    //       section: 0,
    //       icon: 'my_about.png',
    //       title: '关于',
    //       url: '../brushContestList/brushContestList',
    //     }
    //   ]
    // }
  ]
}

function deviceManageItemList() {
  return [{
      title: "型号",
      detail: ""
    }, {
      title: "Mac地址",
      detail: ""
    }, {
      title: "固件版本",
      detail: "",
      redPoints: true
    }
  ]
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray,
  deviceManageItemList: deviceManageItemList
}