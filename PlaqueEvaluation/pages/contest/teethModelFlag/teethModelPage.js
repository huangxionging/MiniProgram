const baseTool = require('../../../utils/baseTool.js')
const baseMessageHandler = require('../../../utils/baseMessageHandler.js')
const baseNetLinkTool = require('../../../utils/baseNetLinkTool.js')
const app = getApp()

Page({
  temporaryData: {
    playerId: '',
    teethAreaArray: ['leftUp', 'rightUp', 'leftDown', 'rightDown'], // 区域,
    doctorId: ''
  },
  data: {
    loadDone: false,
    askList:[
      {
        title:'牙结石',
        data: {
          rightUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          rightDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          leftUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          leftDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        }
      },
      {
        title: '牙龈出血',
        data: {
          rightUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          rightDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          leftUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          leftDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        }
      },
      {
        title: '牙周袋',
        data: {
          rightUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          rightDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          leftUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
          leftDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        }
      },
    ],
    nowIndex: 0,
    nowData: {
      rightUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      rightDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      leftUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      leftDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    },
    dockerMark: false,
    dockerData: ["张三",'李四','王二'],
    dockerIndex: 0,
    doctorValues: [0],
    doctorIsSelectEnd: true
  },
  yamoTap(e){
    let that = this
    let dataset = e.detail
    let nowData = that.data.nowData
    let askList = that.data.askList
    let teethAreaArray = that.temporaryData.teethAreaArray 
    let teethArea = teethAreaArray.indexOf(dataset.area) + 1
    let type = that.data.nowIndex + 1
    let teethPosition = dataset.index + 1
    let side =  (dataset.type == 0) ? 1 : 0
    let parameter = {
      playerId: that.temporaryData.playerId,
      teethArea: teethArea,
      type: type,
      teethPosition: teethPosition,
      side: side
    }
    let idValue = nowData[dataset.area][dataset.index][dataset.type]
    if (idValue != 0) {
      parameter.id = idValue
    }
    baseTool.getRemoteDataFromServer("markingTeeth", "修改标注", parameter).then(res => {
      baseTool.print(res)
      // this.setData({ nowData: checked })
      // 表示删除
      if (res == undefined && idValue != 0) {
        nowData[dataset.area][dataset.index][dataset.type] = 0
        askList[type - 1].data[dataset.area][dataset.index][dataset.type] = 0
      } else {
        nowData[dataset.area][dataset.index][dataset.type] = res
        askList[type - 1].data[dataset.area][dataset.index][dataset.type] = res
      }
      that.setData({
        nowData: nowData,
        askList: askList
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  next(){
    let index = this.data.nowIndex
    this.data.askList[index].data = this.data.nowData
    index++
    if(index>2) return false
    this.setData({
      nowIndex: index,
      nowData: this.data.askList[index].data
    })
  },
  pre() {
    let that = this
    let index = this.data.nowIndex
    this.data.askList[index].data = this.data.nowData
    index--
    if (index < 0) return false
    this.setData({
      nowIndex: index,
      nowData: this.data.askList[index].data
    })
  },
  checkDocker(){
    this.setData({dockerMark:true})
  },
  dockerChange(e){
    let that = this
    that.data.dockerIndex = e.detail.value[0]
    baseTool.print([e, that.data.dockerIndex])
  },
  tData(e){
    let that = this
    console.log('选择的医生', this.data.dockerData[this.data.dockerIndex])
    console.log('标注的数据', this.data.askList)
    let dockerData = that.data.dockerData
    let doctorId = dockerData[that.data.dockerIndex].doctorId;
    baseNetLinkTool.getRemoteDataFromServer("bindingDoctor", "绑定医生", {
      playerId: that.temporaryData.playerId,
      doctorId: doctorId
    }).then(res => {
      baseTool.print(res)
      let doctorValues = that.data.doctorValues
      doctorValues[0] = that.data.dockerIndex
      that.setData({
        dockerMark: false,
        doctorValues: doctorValues
      })
      baseTool.showToast("标记成功")
      let timer = setTimeout((res) => {
        clearTimeout(timer)
        wx.navigateBack()
      }, 2000)
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
      that.setData({
        dockerMark: false
      })
    })
  },
  onReady: function() {
    let that = this
    that.getTeethMarks()
    that.getBindDoctor()
  },
  onLoad: function(options) {
    let that = this
    if (options.playerId) {
      that.temporaryData.playerId = options.playerId
    }
  },
  getTeethMarks: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("getTeethMarks", "获取标记信息", {
      playerId: that.temporaryData.playerId
    }).then(res => {
      baseTool.print(res)
      let nowData = that.data.nowData
      let askList = that.data.askList
      let objectList = res.annotationList
      if (objectList != undefined) {
        for (let index = 0; index < objectList.length; ++index) {
          let object = objectList[index]
          let teethArea = object.teethArea - 1
          let area = that.temporaryData.teethAreaArray[teethArea]
          let teethPosition = object.teethPosition - 1
          let type = (object.side == 0 ? 1: 0)
          let currentTeethIndex = object.type - 1
          askList[currentTeethIndex].data[area][teethPosition][type] = object.id ? object.id : 0
        }
        let nowIndex = that.data.nowIndex
        nowData = askList[nowIndex].data
      }
      baseTool.print(nowData)
      that.setData({
        loadDone: true,
        nowData: nowData,
        askList: askList
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  getBindDoctor: function() {
    let that = this
    baseNetLinkTool.getRemoteDataFromServer("getBindingDoctor", "获取医生", {
      playerId: that.temporaryData.playerId,
      clinicId: baseNetLinkTool.getClinicId()
    }).then(res => {
      baseTool.print(res)
      let doctorList = res.doctorList
      let doctorId = res.doctorId
      let dockerData = that.data.dockerData
      let doctorValues = that.data.doctorValues
      if (doctorList != undefined) {
        dockerData = doctorList
        if (doctorId != undefined) {
          for (let index = 0; index < doctorList.length; ++index){
            let object = doctorList[index]
            if (object.doctorId == doctorId) {
              doctorValues[0] = index
              break
            }
          }
        }
        
      }
      that.setData({
        dockerData: dockerData,
        doctorValues: doctorValues
      })
    }).catch(res => {
      baseNetLinkTool.showNetWorkingError(res)
    })
  },
  doctorSelectStart: function() {
    let that = this
    that.setData({
      doctorIsSelectEnd: false
    })
  },
  doctorSelectEnd: function(e) {
    let that = this
    that.setData({
      doctorIsSelectEnd: true
    })
    baseTool.print(e)
  }
})
