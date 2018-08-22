const baseTool = require('../utils/baseTool.js')

/**
 * 刷牙记录适配
 */
function brushRecordAdapter(records = []) {
  let data = {
    loadDone: true,
    brushDataList: []
  }
  for (let index = 0; index < records.length; ++index) {
    let recordItem = {
      avatar: 'headPic',
      name: 'name',
      score: 'overallScore',
      brushTime: 'brushTeethTime',
      totalTime: 'totalTimeStr',
      cleanIndex: 'overallScore',
      effectiveTime: 'timeStr',
      star: 'posturePoint',
      face: 'seriouslyPoint',
      recordId: 'recordId'
    }
    
    baseTool.modelAdapter(recordItem, records[index])
    data.brushDataList.push(recordItem)
  }
  return data
}



module.exports = {
  brushRecordAdapter: brushRecordAdapter
}