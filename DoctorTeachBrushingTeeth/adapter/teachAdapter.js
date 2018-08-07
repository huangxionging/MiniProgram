const baseTool = require('../utils/baseTool.js')

/**
 * 刷牙记录适配
 */
function videoAdapter(videoInfo = {}) {
  let data = {
    loadDone: true,
    videoUrl: 'videoUrl',
    title: 'tag',
    info: 'intro'
  }
  // 模型适配器转换
  baseTool.print(videoInfo)
  baseTool.modelAdapter(data, videoInfo)
  return data
}

function burshModelAdpter(brushModels = []){
  let data = []
  
  for (let index = 0; index < brushModels.length; ++index) {
    let brushItem = {
      imageUrl: 'pic',
      name: 'name',
      videoPic: 'videoPic',
      videoUrl: 'videoUrl'
    }
    baseTool.modelAdapter(brushItem, brushModels[index])
    data.push(brushItem)
  }
  return data
}

/**
 * 绑定手机号
 */
function telphoneAdapter(wxUser = {}) {
  if (wxUser.telephone) {
    baseTool.setValueForKey(wxUser.telephone, 'telephone')
  }

  if (wxUser.memberId) {
    baseTool.setValueForKey(wxUser.telephone, 'memberId')
  }
  return {
    telephone: wxUser.telephone
  }
}

module.exports = {
  videoAdapter: videoAdapter,
  burshModelAdpter: burshModelAdpter,
  telphoneAdapter: telphoneAdapter
}