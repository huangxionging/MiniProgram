class HomeAdapter {
  getActionItems() {
    return [{
      iconName: "step_icon",
      titleName: "00000",
      detailName: "总步数",
      unitName: "步",
      titleColor: "#08A5F6",
    }, {
      iconName: "cal_icon",
      titleName: "0000",
      detailName: "总能量",
      unitName: "千卡",
      titleColor: "#FF2828",
    }, {
      iconName: "distance_icon",
      titleName: "0.00",
      detailName: "距离",
      unitName: "千米",
      titleColor: "#14D2B8",
    }, 
    {
      iconName: "sleep_icon",
      titleName: "0.00",
      detailName: "睡眠(今日)",
      unitName: "小时",
      titleColor: "#9013FE",
    }, 
    {
      iconName: "heart_icon",
      titleName: "0",
      detailName: "心率",
      unitName: "bmp",
      titleColor: "#FF2828",
    }, 
    {
      iconName: "blood_icon",
      titleName: "000/00",
      detailName: "血压",
      unitName: "",
      titleColor: "#FD3FB2",
    }
    ]
  }
}

export {
  HomeAdapter
}