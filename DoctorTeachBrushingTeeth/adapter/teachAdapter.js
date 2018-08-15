const baseTool = require('../utils/baseTool.js')

/**
 * 刷牙记录适配
 */
function videoAdapter(videoInfo = {}) {
  let data = {
    loadDone: true,
    videoUrl: 'videoUrl',
    videPicUrl: 'videPicUrl',
    newsList: []
  }
  // 模型适配器转换
  baseTool.print(videoInfo)
  baseTool.modelAdapter(data, videoInfo)
  let newsItem1 = {
    title: 'title',
    content: 'intro',
    picUrl: 'picUrl'
  }
  baseTool.modelAdapter(newsItem1, videoInfo)
  if (newsItem1.title == 'title') {
    newsItem1.title = ''
    newsItem1.content = ''
  }
  data.newsList.push(newsItem1)
  let newsItem2 = {
    title: 'titleTwo',
    content: 'introTwo',
    picUrl: 'picUrlTwo'
  }
  baseTool.modelAdapter(newsItem2, videoInfo)
  if (newsItem2.title == 'titleTwo') {
    newsItem2.title = ''
    newsItem2.content = ''
  }
  data.newsList.push(newsItem2)
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