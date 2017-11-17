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
}