module.exports = {
  /**
   * 获取验证码
   */
  getVerifyCode: 'api/smscode/generate',
  /**
   * 绑定手机号
   */
  bindPhoneNumber: 'bindPhoneNumber',
  /**
   * 获取用户信息
   */
  login:'login',
  /**
   * 添加参赛者
   */
  addContestUser : 'addPlayer',
  /**
   * 获取参赛者列表
   */
  getContestUserList : 'getPlayers',
  /**
   * 首页接口
   */
  homePage: 'homePage',
  /** 
   * 选择参赛者
   */
  selectContestUser: 'choosePlayers',
  /**
   * 添加比赛
   */
  addContest: 'addGame',
  /**
   * 删除比赛
   */
  deleteContest: 'delGame',
  /**
   * 绑定用户
   */
  bindContestUser: 'joinMatch',
  /**
   * 我的历史刷牙比赛
   */
  pageQueryContest: 'pageQueryGames',
  /**
   * 获取我的页面里的比赛数量与参赛者数量
   */
  getMyGameCount: 'getMyGameCount',
  /**
   * 获得参赛人员数据
   */
  getContestgMembers: 'getParticipatingMembers',
  /**
   * 更新用户信息
   */
  updatePlayers: 'updatePlayers',
  /**
   * 删除用户
   */
  delPlayers: 'delPlayers',
  /**
   * 合并数据
   */
  mergeData: 'combinedData'
}