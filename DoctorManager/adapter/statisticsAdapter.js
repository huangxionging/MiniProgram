const baseTool = require('../utils/baseTool.js')

function getTodayDynamicAdapter(res) {
  let data = {
    loadDone: true,
    brushingCount: 'brushingCount',
    trainingCount: 'trainingCount',
    sellCount: 'sellCount',
    dataList: [],
    isBW: 'isBW',
    awardMoney: 'awardEarnings',
    totalMoney: 'totalEarnings',
    yesterdayMoney: 'yesterdayEarnings',
    weekMoney: 'latestWeekEarnings',
    monthMoney: 'latestMonthEarnings'
  }
  baseTool.modelAdapter(data, res)

  if (data.isBW == 1) {
    data.withdrawTitle = '提现'
  } else {
    data.withdrawTitle = '开发中'
    data.awardMoney = '*****'
    data.totalMoney = '*****'
    data.weekMoney = '*****'
    data.yesterdayMoney = '*****'
    data.monthMoney = '*****'
  }
  if (baseTool.isExist(res.daynamicList)) {
    let array = res.daynamicList
    for (let index = 0; index < array.length; ++index) {
      let item = {
        title: 'dynamicText',
        time: 'dynamicTime',
        // money: '+0.60',
        id: index
      }
      baseTool.modelAdapter(item, array[index])
      data.dataList.push(item)
    }
  }
  return data;
}


/**
 * 获取提现信息
 */
function getWithdrawMoneyInfoAdapter(res) {
  let data = {
    loadDone: true,
    segmentIndex: 1,
    totalMoney: 'canWithdrawMoney',
    remaingMoney: 'canWithdrawMoney',
    money: '',
    status: 'status'
  }
  baseTool.modelAdapter(data, res)
  // 审核中, 只能看到这个
  // data.status = 1
  data.totalMoney = parseFloat(data.totalMoney).toFixed(2)
  data.remaingMoney = data.totalMoney
  if (data.status == 1) {
    data.segmentIndex = -1
  }
  return data
}

function getWithdrawMoneyListAdapter(res) {
  let recordList = []

  if (baseTool.isExist(res)) {
    for (let index = 0; index < res.length; ++index) {
      let recordItem = {
        time: 'createTime',
        money: 'earnings',
        types: 'type',
        status: 'status',
        recordId: 'logId'
      }
      baseTool.modelAdapter(recordItem, res[index])
      recordList.push(recordItem)
    }
  }

  return recordList
}

module.exports = {
  getTodayDynamicAdapter: getTodayDynamicAdapter,
  getWithdrawMoneyInfoAdapter: getWithdrawMoneyInfoAdapter,
  getWithdrawMoneyListAdapter: getWithdrawMoneyListAdapter
}