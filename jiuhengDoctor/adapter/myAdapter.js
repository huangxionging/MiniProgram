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
          title: '历史比赛数据',
          url: '/pages/my/brushContestList/brushContestList',
        },
        {
          id: 1,
          section: 0,
          icon: 'my_device_manage.png',
          title: '设备管理',
          url: '/pages/my/deviceManage/deviceManage',
        },
        {
          id: 2,
          section: 0,
          icon: 'my_device_check.png',
          title: '设备检测',
          url: '/pages/my/deviceCheck/deviceCheck',
        }
      ]
    },
    {
      headerHeight: 20,
      rowDataArray: [
        {
          id: 0,
          section: 1,
          icon: 'challenge_data.png',
          title: '挑战赛报名数据',
          detail: '',
          url: '/pages/my/mySignUpData/mySignUpData',
        },
        {
          id: 1,
          section: 1,
          icon: 'training_data.png',
          title: '训练营报名数据',
          detail: '',
          url: '/pages/my/mySignUpData/mySignUpData',
        },
        {
          id: 2,
          section: 1,
          icon: 'my_customer_service.png',
          title: '联系客服',
          detail: '400-900-3032',
          styleCalss: 'my-detail',
          url: '',
        },
      ]
    }
  ]
}

function mySignUpDataSectionDataArray(index = 0) {
  baseTool.print(index)
  if (index == 0) {
    return [
      {
        id: 0,
        title: '姓名',
        width: 15
      },
      {
        id: 0,
        title: '年龄',
        width: 10
      },
      {
        id: 0,
        title: '联系电话',
        width: 25
      },
      {
        id: 0,
        title: '预约日期',
        width: 25
      },
      {
        id: 0,
        title: '预约时间',
        width: 25
      }
    ]
  } else {
    return [
      {
        id: 0,
        title: '姓名',
        width: 15
      },
      {
        id: 0,
        title: '年龄'
        ,
        width: 10
      },
      {
        id: 0,
        title: '性别',
        width: 12.5
      },
      {
        id: 0,
        title: '联系电话',
        width: 31.5
      },
      {
        id: 0,
        title: '报名时间',
        width: 31.5
      }
    ]
  }
}

function signUpSectionDataArray(res) {
  let signUpSectionDataArray = [
    {
      id: 0,
      section: 0,
      rowDataArray: []
    }
  ]
  if (res == undefined) {
    return []
  }
  for (let index = 0; index < res.length; ++index) {
    let applyTime = res[index].applyTime
    res[index].applyTime = applyTime.split(' ')[0]
    signUpSectionDataArray[0].rowDataArray.push(res[index])
  }
  return signUpSectionDataArray
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray,
  mySignUpDataSectionDataArray: mySignUpDataSectionDataArray,
  signUpSectionDataArray: signUpSectionDataArray
}