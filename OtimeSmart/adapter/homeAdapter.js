const baseTool = require('../utils/baseTool.js')
const baseNetLinkTool = require('../utils/baseNetLinkTool.js')
class HomeAdapter {
  getActionItems() {
    return [{
      iconName: "step_icon",
      titleName: "00000",
      detailName: "总步数",
      unitName: "步",
      titleColor: "#08A5F6",
    }, {
      iconName: "cal_icon",
      titleName: "0000",
      detailName: "总能量",
      unitName: "千卡",
      titleColor: "#FF2828",
    }, {
      iconName: "distance_icon",
      titleName: "0.00",
      detailName: "距离",
      unitName: "千米",
      titleColor: "#14D2B8",
    }, 
    {
      iconName: "sleep_icon",
      titleName: "0.00",
      detailName: "睡眠(今日)",
      unitName: "分钟",
      titleColor: "#9013FE",
    }, 
    {
      iconName: "heart_icon",
      titleName: "0",
      detailName: "心率",
      unitName: "bmp",
      titleColor: "#FF2828",
    }, 
    {
      iconName: "blood_icon",
      titleName: "000/00",
      detailName: "血压",
      unitName: "",
      titleColor: "#FD3FB2",
    }
    ]
  }

  getStepDataByDay(dayNumber = 0) {
    let date = baseTool.getCurrentOffsetDateWithoutTime(dayNumber)
    let userInfo = baseNetLinkTool.getUserInfo()
    let currentSex = (userInfo.sex == 2) ? 0 : 1
    let currentAge = userInfo.birthday
    let currentHeight = userInfo.height
    let currentWeight = userInfo.weight
    let data = new Array(24)
    for (let index = 0; index < data.length; ++index) {
      data[index] = {
        step: 0
      }
    }

    let startHour = parseInt(Math.random() * 24)
    let endHour = parseInt(Math.random() * (24 - startHour)) + startHour
    let time = baseTool.zeroFormat(startHour + "") + ":00:00"
    let total = 0
    let duration = 0
    for (let index = startHour; index <= endHour; ++index) {
      let step = parseInt(Math.random() * 3000)
      let minute = parseInt(Math.random() * 60)
      data[index].step = step
      total += step
      if (step > 0) {
        duration += minute
      }
    }
    let calorie = baseTool.getCalorieWithSteps(total, currentWeight, currentHeight)
    calorie = (calorie / 1000).toFixed(1)
    let distance = baseTool.getDistanceWithStep(total, currentHeight)
    let dateObject = {
      date: date,
      time: time,
      target: 10000,
      calorie: calorie,
      distance: distance,
      duration: duration,
      total: total,
      data: data
    }
    return dateObject
  }

  getBloodDataByDay(dayNumber = 0){
    let date = baseTool.getCurrentOffsetDateWithoutTime(dayNumber)
    let data = []
    for (let index = 0; index < 24; ++index) {
      let hour = parseInt(index / 1)
      let minute = parseInt(Math.random() * 10 + (index % 6 ) * 10)
      let second = parseInt(Math.random() * 60)
      let time = baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "") + ":" + baseTool.zeroFormat(second + "")
      let object = {
        time: time,
        shrink: parseInt(Math.random() * 50 + 90),
        diastole: parseInt(Math.random() * 30 + 60),
      }
      data.push(object)
    }
    let dateObject = {
      date: date,
      data: data
    }
    return dateObject
  }
  getHeartDataByDay(dayNumber = 0) {
    let date = baseTool.getCurrentOffsetDateWithoutTime(dayNumber)
    let data = []
    for (let index = 1; index <= 144; ++ index) {
      let hour = parseInt(index / 6)
      let minute = parseInt(Math.random() * 10 + (index % 6 ) * 10)
      let second = parseInt(Math.random() * 60)
      let time = baseTool.zeroFormat(hour + "") + ":" + baseTool.zeroFormat(minute + "") + ":" + baseTool.zeroFormat(second + "")
      let object = {
        time: time,
        bmp: parseInt(Math.random() * 100 + 100),
      }
      data.push(object)
    }
    let dateObject = {
      date: date,
      data: data
    }
    return dateObject
  }

  getSleepDataByDay(dayNumber = 0) {
    let date = baseTool.getCurrentOffsetDateWithoutTime(dayNumber)
    let yesterday = baseTool.getCurrentOffsetDateWithoutTime(dayNumber - 1)
    let dateComponent = baseTool.getObjectForDate(date)
    let yesterdayComponent = baseTool.getObjectForDate(yesterday)
    let data = new Array()
    let startIndex = 20 + parseInt(Math.random() * 8)
    let startHour = startIndex % 24
    let startMinute = 0
    let endIndex = 5 + parseInt(Math.random() * 5)
    let total = 0
    let totalDeep = 0
    let totalShallow = 0
    let totalSober = 0
    let lastSober = 0
    for (let index = startIndex; index < startIndex + endIndex; ++index) {
      let hour = index % 24
      let year = dateComponent.year
      let month = dateComponent.month
      let day = dateComponent.day
      baseTool.print("index: " + index)
      if (index < 24) {
        year = yesterdayComponent.year
        month = yesterdayComponent.month
        day = yesterdayComponent.day
      }
      let deep = parseInt(Math.random() * 20) + 10
      let shallow = parseInt(Math.random() * (30 - deep)) + deep + 10
      let sober = parseInt(Math.random() * (40 - shallow)) + shallow + 10

      if (index == startHour) {
        startMinute = deep
      }
      // let 
      data.push({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: deep,
        quality: "deep"
      })
      data.push({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: shallow,
        quality: "shallow"
      })
      data.push({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: sober,
        quality: "sober"
      })
      totalShallow += shallow - deep
      totalSober += sober - shallow
      baseTool.print([index, startIndex, startIndex + endIndex])
      if ((index > startIndex) && (index < startIndex + endIndex)) {
        totalDeep += 60 - lastSober + deep 
        baseTool.print([totalSober, lastSober, deep])
      } 
      lastSober = sober
    }
    // baseTool.print(data)
    total = totalDeep + totalShallow
    let dateObject = {
      date: date,
      time: baseTool.zeroFormat(startHour + "") + ":"+ baseTool.zeroFormat(startMinute + ""),
      total: total,
      deep: totalDeep,
      shallow: totalShallow,
      sober: totalSober,
      data: data
    }
    baseTool.print([dateObject, totalSober])
    return dateObject
  }
}

export {
  HomeAdapter
}