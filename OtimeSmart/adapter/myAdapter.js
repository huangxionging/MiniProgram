const baseTool = require('../utils/baseTool.js')

function myIndexSectionDataArray() {
  let timeItemList = []
  for (let timeIndex = 0; timeIndex <= 120; ++timeIndex) {
    timeItemList.push(timeIndex + " 分钟")
  }
  return [{
      headerHeight: 20,
      rowDataArray: [{
        id: 0,
        section: 0,
        icon: 'my_device.png',
        title: '请绑定设备',
        url: '/pages/my/deviceManage/deviceManage',
        showPiker: false
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
        showPiker: false
      }]
    },
    {
      headerHeight: 20,
      rowDataArray: [
        {
          id: 0,
          section: 0,
          icon: 'my_sedentary_reminder.png',
          title: '久坐提醒',
          detail: '未设置',
          url: '../brushContestList/brushContestList',
          type: "selector",
          showPiker: true,
          itemList: timeItemList
        },
        // {
        //   id: 1,
        //   section: 0,
        //   icon: 'my_heart_blood.png',
        //   title: '心率与血压设置',
        //  detail: '未设置',
        //   url: '../brushContestList/brushContestList',
        //   showPiker: false
        // },
        {
          id: 2,
          section: 0,
          icon: 'my_find_device.png',
          title: '查找设备',
          showPiker: false
        }
      ]
    },
    { 
      headerHeight: 20,
      rowDataArray: [
        // {
        //   // id: 0,
        //   // section: 0,
        //   // icon: 'my_message.png',
        //   // title: '信息',
        //   // url: '../brushContestList/brushContestList',
        //   // showPiker: false
        // },
        {
          id: 1,
          section: 0,
          icon: 'my_unit.png',
          title: '计量单位',
          detail: '未设置',
          url: '../brushContestList/brushContestList',
          showPiker: true,
          type: "selector",
          itemList: ["公制", "英制"]
        },
        {
          id: 2,
          section: 0,
          icon: 'my_about.png',
          title: '模拟数据',
          url: '/pages/my/mockData/mockData',
          showPiker: false
        }
      ]
    }
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
  let ageList = new Array(200)
  for (let index = 0; index < 300; ++index) {
    heightList[index] = index + " cm"
    if (index <= 200) {
      weightList[index] = index + " kg"
      ageList[index] = index + "岁"
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
      title: "年龄",
      detail: userInfo.birthday + "岁",
      type: "selector",
      value: userInfo.birthday,
      itemList: ageList,
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

function detailStepOrginData() {
  let dataObjectArray = new Array(24)
  for (let index = 0; index < dataObjectArray.length; ++index) {
    dataObjectArray[index] = {
      step: 0,
      height: 0
    }
  }
  return dataObjectArray
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray,
  deviceManageItemList: deviceManageItemList,
  editIndexSectionArray: editIndexSectionArray,
  detailStepOrginData: detailStepOrginData
}