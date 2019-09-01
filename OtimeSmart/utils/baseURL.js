
// 测试环境
let baseDomain = 'https://shouhuan.taoyt.cn/'
let baseBrushDomain = 'https://shouhuan.taoyt.cn/'
let socketDomain = 'wss://dev-dos.32teeth.cn/'
let baseWebDomain = 'https://api.32.ink'
let debug = false
if (!debug) {
  // 正式环境
  baseDomain = 'https://shouhuan.taoyt.cn/'
  baseBrushDomain = 'https://shouhuan.taoyt.cn/'
  socketDomain = 'wss://shouhuan.taoyt.cn/'
  // baseWebDomain = 'https://32teeth.cn'
}
module.exports = {
  /**
   * 域名 正式环境和测试环境的域名
   */
  baseDomain: baseDomain,
  /**
   * 刷牙数据上传域名
   */
  baseBrushDomain: baseBrushDomain,
  /**
   * socket 域名
   */
  socketDomain: socketDomain,
  /**
   * 基本路径
   */
  basePath: 'api/',
  /**
   * socket 路径
   */
  socketPath: 'mini/socket/challengeGame/',
  /**
   * 现在处于正式环境还是测试状态
   */
  baseState: debug,
  baseWebDomain: baseWebDomain,

}
