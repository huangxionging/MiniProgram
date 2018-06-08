
import Rect from "./base/rect.js"

let ctx = canvas.getContext("2d")

/**
 * 小游戏入口
 */
export default class Main {
  constructor() {
    this.aniId = 0
    this.rect1 = new Rect(30, 40, 200, 300, "red")
    this.rect2 = new Rect(30, 40, 200, 300, "red")
    this.rect3 = new Rect(30, 40, 200, 300, "red")
    this.rect4 = new Rect(30, 40, 200, 300, "red")
    this.restart()
  }

  restart() {
    // 删除触摸事件
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )
    // 事件绑定设置为 false
    this.hasEventBind = false
    // 绑定关系
    this.bindLoop = this.loop.bind(this)
    // 清除上一帧
    window.cancelAnimationFrame(this.aniId)

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )

  }

  touchEventHandler(e) {
    console.log(e)
  }
  
  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.rect1.render()
    this.rect2.render()
    this.rect3.render()
    this.rect4.render()

    // if (!this.hasEventBind) {
    //   this.hasEventBind = true
    //   this.touchHandler = this.touchEventHandler.bind(this)
    //   canvas.addEventListener('touchstart', this.touchHandler)
    // }
  }
  /**
   * 游戏循环
   */
  loop() {
    this.render() 
    // this.rect1.move()
    // this.rect2.move()
    // this.rect3.move()
    // this.rect4.move()
    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}