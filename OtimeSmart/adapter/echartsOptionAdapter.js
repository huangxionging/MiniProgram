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
        // left: 10,
        bottom: 10,
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          let object = baseTool.getObjectForDate(params.name)
          let time = baseTool.zeroFormat(object.month + "") + "-" + baseTool.zeroFormat(object.day + "") + " " + baseTool.zeroFormat(object.hour + "") + ":" + baseTool.zeroFormat(object.minute + "")
          return time + " 的收缩压: " + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        // data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
        // show: true
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
            baseTool.print(value)
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
        }
      },
      series: [{
        name: '血压收缩',
        type: 'line',
        smooth: true,
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
    //   var option = {
    //     dataset: {
    //         source: [
    //             ['score', 'amount', 'product'],
    //             ['00:15:09', 197, "00:00"],
    //             ['00:28:55', 122, '00:25'],
    //             ['00:37:17', 146, 'Milk Tea'],
    //             ['00:43:19', 175, 'Cheese Cocoa'],
    //             ['00:54:21', 155, 'Cheese Brownie'],
    //             ['01:01:25', 153, 'Matcha Cocoa'],
    //             ['01:19:28', 153, 'Tea'],
    //             ['01:21:22', 130, 'Orange Juice'],
    //             ['01:31:53', 195, 'Lemon Juice'],
    //             ['01:46:17', 154, 'Walnut Brownie']
    //         ]
    //     },
    //     grid: {containLabel: true},
    //     xAxis: {type: 'category'},
    //     yAxis: {type: 'value'},
    //     series: [
    //         {
    //             type: 'line',
    //             smooth: true,
    //             encode: {
    //                 // Map the "amount" column to X axis.
    //                 x: 'score',
    //                 // Map the "product" column to Y axis
    //                 y: 'amount'
    //             }
    //         }
    //     ]
    // };
    return option
  }
}
export {
  ChartOption
}