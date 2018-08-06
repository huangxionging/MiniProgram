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

module.exports = {
  videoAdapter: videoAdapter
}