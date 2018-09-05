const baseTool = require('../utils/baseTool.js')

/**
 * 刷牙记录适配
 */
function videoAdapter(videoInfo = {}) {
  let data = {
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


function getVideoListAdapter(e = []) {
  let videoList = []
  for (let index0 = 0; index0 < e.length; ++index0) {
    let burshVideoList = e[index0].brushVideoList
    for (let index1 = 0; index1 < burshVideoList.length; ++index1) {
      let videoItem = burshVideoList[index1]
      if (videoItem.videoUrl == 'http://qnimage.hydrodent.cn/shuipingzhendongfushua.mp4') {
        videoList.splice(0, 0, videoItem)
      } else {
        videoList.push(videoItem)
      }
      
    }
  }
  return videoList
}


module.exports = {
  videoAdapter: videoAdapter,
  getVideoListAdapter: getVideoListAdapter
}