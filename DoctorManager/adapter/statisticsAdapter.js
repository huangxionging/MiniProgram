const baseTool = require('../utils/baseTool.js')

function getTodayDynamicAdapter(res) {
  let data = {
    loadDone: true,
    brushingCount: 'brushingCount',
    trainingCount: 'trainingCount',
    sellCount: 'sellCount',
    dataList: []
  }
  baseTool.modelAdapter(data, res)
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

module.exports = {
  getTodayDynamicAdapter: getTodayDynamicAdapter,
}