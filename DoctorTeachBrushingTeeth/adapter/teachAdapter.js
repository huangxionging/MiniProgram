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
  baseTool.modelAdapter(newsItem1, videoInfo, res => {
    newsItem1[res] = ''
  })
  newsItem1.width = 760
  newsItem1.height = 2000
  data.newsList.push(newsItem1)
  let newsItem2 = {
    title: 'titleTwo',
    content: 'introTwo',
    picUrl: 'picUrlTwo'
  }
  baseTool.modelAdapter(newsItem2, videoInfo, res => {
    newsItem2[res] = ''
  })
  newsItem2.width = 711
  newsItem2.height = 2108
  data.newsList.push(newsItem2)
  return data
}





module.exports = {
  videoAdapter: videoAdapter,
}