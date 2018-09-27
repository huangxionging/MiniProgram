const baseTool = require('../utils/baseTool.js')

/**
 * 刷牙记录适配
 */
function videoAdapter(videoInfo = {}) {
  let data = {
    loadDone: true,
    videoUrl: 'videoUrl',
    videPicUrl: 'videPicUrl',
    name: 'title',
    picUrl: 'picUrl',
    intro: 'intro',
    duration: 'duration',
    videoList: [],
    tagVideoList: []
  }
  // 模型适配器转换.l

  if (baseTool.isExist(videoInfo.mainVideo)) {
    baseTool.modelAdapter(data, videoInfo.mainVideo, function(res) {
      if (res == 'intro') {
        data.intro = ''
      }
    })
  }

  if (baseTool.isExist(videoInfo.videoList)) {
    for (let indexSection = 0; indexSection < videoInfo.videoList.length; ++indexSection) {
      let sectionItem = videoInfo.videoList[indexSection]
      let item = {
        icon: sectionItem.icon,
        name: sectionItem.name,
        tagVideoList: []
      }

      if (indexSection == 0) {
        sectionItem.tagVideoList.splice(0, 0, {
          title: data.name,
          picUrl: data.picUrl,
          intro: data.intro,
          videoUrl: data.videoUrl,
          duration: data.duration
        })
      }
      for (let indexTag = 0; indexTag < Math.floor((sectionItem.tagVideoList.length + 1) / 2); ++indexTag) {
        let tagItem = {
          name: 'title',
          videoPicUrl: 'picUrl',
          videoIntro: 'intro',
          videoUrl: 'videoUrl',
          duration: 'duration'
        }

        let tagItem1 = {
          name1: 'title',
          videoPicUrl1: 'picUrl',
          videoIntro1: 'intro',
          videoUrl1: 'videoUrl',
          duration1: 'duration'
        }

        baseTool.modelAdapter(tagItem, sectionItem.tagVideoList[indexTag * 2], function(res) {
          tagItem[res] = ''
        })
        tagItem.videoUrl = encodeURI(tagItem.videoUrl)
        if (indexTag * 2 + 1 < sectionItem.tagVideoList.length) {
          baseTool.modelAdapter(tagItem1, sectionItem.tagVideoList[indexTag * 2 + 1], function(res) {
            tagItem1[res] = ''
          })
          tagItem1.videoUrl1 = encodeURI(tagItem1.videoUrl1)
          tagItem = Object.assign(tagItem, tagItem1)
        }
        item.tagVideoList.push(tagItem)
      }
      baseTool.print(item)
      data.videoList.push(item)
      data.tagVideoList = data.videoList[0].tagVideoList
    }
    
    return data
  }
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