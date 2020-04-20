const baseTool = require('../utils/baseTool')

class ChartOption {
  getBloodShrinkOption() {
    let option = {
      animation: false,
      title: {
        text: '血压收缩',
        left: 27,
        top: 15,
        textStyle: {
          color: "#ffffff",
          fontSize: 15
        }
      },
      grid: {
        left: 5,
        bottom: 10,
        top: 45,
        right: 20,
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: function (params) {
          params = params[0]
          let object = baseTool.getObjectForDate(params.name)
          let time = baseTool.zeroFormat(object.month + "") + "-" + baseTool.zeroFormat(object.day + "") + " " + baseTool.zeroFormat(object.hour + "") + ":" + baseTool.zeroFormat(object.minute + "")
          return time + " 的收缩压: " + params.value[1]
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted'
          }
        },
        axisLine: {
          lineStyle: {
            color: "#999",
            type: "dotted"
          }
        },
        axisTick: {
          lineStyle: {
            type: "dotted",
            color: "#999"
          }
        },
        axisLabel: {
          formatter: function (value) {
            // baseTool.print(value)
            let date = new Date()
            date.setTime(value)
            let object = baseTool.getObjectForDate(date)
            let time = baseTool.zeroFormat(object.hour + "") + ":" + baseTool.zeroFormat(object.minute + "")
            return time
          }
        },
        interval: 3600 * 4 * 1000, // 强制每隔 4 小时设分割一次
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted'
          }
        },
        // show: false
        axisLine: {
          lineStyle: {
            color: "#999",
            type: "dotted"
          }
        },
        interval: 20
      },
      series: [{
        name: '血压收缩',
        type: 'line',
        smooth: true,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          color: "#e22222"
        },
        areaStyle: {},
        data: [],
        itemStyle: {
          color: "#e22222"
        }
      }, {
        name: '.anchor',
        type: 'line',
        showSymbol: false,
        data: [],
        itemStyle: { normal: { opacity: 0 } },
        lineStyle: { normal: { opacity: 0 } }
      }]
    }
    return option
  }
  getStepOption(type = 1) {
    let option = {
      animation: false,
      grid: {
        left: 10,
        right: 15,
        top: 10,
        bottom: 10,
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          animation: false
        },
        /**
         * 计算 tooltip 的微信
         * @param {*} point 鼠标位置
         * @param {*} params 参数
         * @param {*} dom 
         * @param {*} rect 
         * @param {*} size 尺寸信息
         */
        position: function (point, params, dom, rect, size) {
          // 获得坐标位置
          let x = point[0], y = point[1]
          // 获得尺寸宽高
          let width = size.contentSize[0], height = size.contentSize[1]
          // 获得 Chart canvas 的宽高
          let maxWidth = size.viewSize[0], maxHeight = size.viewSize[1]
          if (y + height >= maxHeight ) {
            y = maxHeight - height
          }
          if (x - width / 2 > 0 && x + width / 2 < maxWidth) {
            x = x - width / 2
          } else if(x + width / 2 > maxWidth) {
            x = maxWidth - width
          }
          // baseTool.print([x, y])
          return [x, y]
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: true,
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            width: 0.5
          }
        },
        axisLine: {
          lineStyle: {
            color: "#999",
            type: "dotted"
          }
        },
        axisTick: {
          // alignWithLabel: true,
          lineStyle: {
            width: 2,
            type: "dotted",
            color: "#999"
          }
        },
        axisLabel: {
          show: false, // 此处不显示刻度
          lineStyle: {
            color: "#999"
          }
        },
        // interval:  // 分割
      },
      yAxis: {
        axisLabel: {
          formatter: function(value) {
            // baseTool.print(value)
            return parseInt(value / 100)
          }
        },
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted',
            width: 0.5
          }
        },
        // show: false,
        axisLine: {
          lineStyle: {
            color: "#999",
            type: "dotted"
          }
        }
      },
      series: [{
        name: '步数',
        type: 'line',
        symbol: "circle", // 实心还是空心,
        symbolSize: 6,
        smooth: false,
        lineStyle: {
          width: 3,
          color: "#008EFF"
        },
        data: [],
        itemStyle: {
          color: "#008EFF"
        }
      }]
    }
    return option
  }
}
export {
  ChartOption
}