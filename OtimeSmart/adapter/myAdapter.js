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
      },
      {
        id: 2,
        section: 0,
        icon: 'my_find_device.png',
        title: "同步时间",
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
  }]
}

function editIndexSectionArray(userInfo = {}) {
  let heightList = new Array(300)
  let weightList = new Array(200)
  for (let index = 0; index < 300; ++index) {
    heightList[index] = index + " cm"
    if (index <= 200) {
      weightList[index] = index + " kg"
    }
  }
  let sexText = (userInfo.sex == 0 ? "保密" : (userInfo.sex == 1 ? "男" : "女"))
  return [{
    headerHeight: 0,
    rowDataArray: [{
      id: 0,
      section: 0,
      title: "昵称",
      detail: userInfo.alias,
    }, {
      id: 0,
      section: 0,
      title: "性别",
      detail: sexText,
      type: "selector",
      itemList: ["保密", "男", "女"],
      value: userInfo.sex
    }, {
      id: 0,
      section: 0,
      title: "生日",
      detail: userInfo.birthday ? userInfo.birthday : "暂未设置",
      type: "date",
      value: userInfo.birthday,
      endDate: baseTool.getCurrentDateWithoutTime(),
      startDate: "1900-01-01"
    }]
  }, {
    headerHeight: 20,
    rowDataArray: [{
      id: 0,
      section: 0,
      title: "身高",
      type: "selector",
      detail: userInfo.height + " cm",
      itemList: heightList,
      value: userInfo.height
    }, {
      id: 0,
      section: 0,
      title: "体重",
      detail: userInfo.weight + " kg",
      type: "selector",
      itemList: weightList,
      value: userInfo.weight
    }]
  }]
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray,
  deviceManageItemList: deviceManageItemList,
  editIndexSectionArray: editIndexSectionArray
}