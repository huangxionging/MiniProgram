
// 测试环境
var baseDomain = 'https://dev-dos.32teeth.cn/'
var baseBrushDomain = 'https://dev-os.32teeth.cn/'
var debug = false
if (!debug) {
  // 正式环境
  baseDomain = 'https://dos.32teeth.cn/'
  baseBrushDomain = 'https://os.32teeth.cn/'
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
   * 基本路径
   */
  basePath: 'mini/doctorOfflinegame/',
  /**
   * 现在处于正式环境还是测试状态
   */
  baseState: debug
}
