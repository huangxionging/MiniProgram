
let ctx = canvas.getContext('2d')

export default class Rect {
  constructor(x = 0, y = 0, width = 0, height = 0, color = "red") {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.x1 = x + width
    this.y1 = y + height

    // 标识跟随手指
    this.touched = false
    this.initEnvent()
  }

  /**
   * 渲染
   */
  render() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  moveLeft() {
    this.x -= 10
    this.x1 = this.x + this.width
  }

  moveRight() {
    this.x += 10
    this.x1 = this.x + this.width
  }

  moveUp () {
    this.y -= 10
    this.y1 = this.y + this.height
  }

  moveDown() {
    this.y += 10
    this.y1 = this.y + this.height
  }

  move() {
    var direct = Math.ceil(Math.random() * 100) % 4
    var red = Math.ceil(Math.random() * 1000) % 256 
    var green = Math.ceil(Math.random() * 1000) % 256 
    var blue = Math.ceil(Math.random() * 1000) % 256 
    var color = "#" + red.toString(16) + green.toString(16) + blue.toString(16)
    this.color = color
    console.log(direct, color)
    switch (direct) {
      case 0: {
        if (this.x  < 0) {
          this.moveRight()
        } else {
          this.moveLeft()
        }
        
        break
      }
      case 1: {
        if (this.x1 > canvas.width) {
          this.moveLeft()
        } else {
          this.moveRight()
        }

        break
      }
      case 2: {
        if (this.y < 0) {
          this.moveDown()
        } else {
          this.moveUp()
        }
        break
      }
      case 3: {
        if (this.y1 > canvas.height) {
          this.moveUp()
        } else {
          this.moveDown()
        }
        break
      }
    }
  }

  initEnvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      console.log(e)
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      if (this.checkIsFingerOnRect(x, y)) {
        this.touched = true
        this.setRectPosAcrossFinger(x, y)
      }
    }).bind(this))

    canvas.addEventListener('touchmove', ((e) => {
      e.preventDefault()
      console.log(e)
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      if (this.touched) {
        this.setRectPosAcrossFinger(x, y)
      }
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      console.log(e)
      this.touched = false
    }).bind(this))
  }

  checkIsFingerOnRect(x, y) {
    var deviation = 30
     return !!(
       this.x >= this.x - deviation 
       && this.y >= this.y - deviation 
       && this.x <= this.x1 + deviation 
       && this.y <= this.y1 + deviation
     )
  }

  setRectPosAcrossFinger(x, y) {
    var offSetX = x - this.width / 2
    var offSetY = y - this.height / 2

    if (offSetX < 0) {
      offSetX = 0
    } else if (offSetX > canvas.width - this.width) {
      offSetX = canvas.width - this.width
    }

    if (offSetY < 0) {
      offSetY = 0
    } else if (offSetY > canvas.height - this.height) {
      offSetY = canvas.height - this.height
    }

    this.x = offSetX
    this.y = offSetY
    this.x1 = offSetX + this.width
    this.y1 = offSetY + this.height
  }
}