Component({
  behaviors: [],
  properties: {
    yamoData: {
      type: Object,
      value: {
        rightUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        rightDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        leftUp: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        leftDown: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
      }
    },
    yamoTitle: {
      type: String,
      value: '牙结石',
      observer: function (newVal, oldVal) { }
    }
  },
  methods: {
    onTapYamo: function (e){
      let dataset = e.currentTarget.dataset
      dataset.type = parseInt(dataset.type)
      var myEventDetail = dataset    
      var myEventOption = {} 
      this.triggerEvent('tapYamo', myEventDetail, myEventOption)
    }
  }

})