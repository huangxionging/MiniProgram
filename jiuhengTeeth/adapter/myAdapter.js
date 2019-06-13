const baseTool = require('../utils/baseTool.js')

function myIndexSectionDataArray() {
  return [
    {
      headerHeight: 0,
      rowDataArray: [
        {
          id: 0,
          section: 1,
          icon: 'my_customer_service.png',
          title: '联系客服',
          detail: '400-900-3032',
          styleCalss: 'my-detail',
          url: '../brushContest/brushContest',
        }
      ]
    }
  ]
}

module.exports = {
  myIndexSectionDataArray: myIndexSectionDataArray
}