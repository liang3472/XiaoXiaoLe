var Utils = require('Utils');

cc.Class({
  'extends': cc.Component,

  properties: {
    maxTime: 0, // 最大游戏时间
    leftCount: cc.Label, // 左边数字
    rightCount: cc.Label // 右边数字

  },

  init: function init(game) {
    this.game = game;
    this.time = this.maxTime;
  },

  /**
   * 计时回调
   */
  _countCallback: function _countCallback() {
    this.counting = false;
    this.leftCount.string = '30';
    this.rightCount.string = '00';
    this.game.gameOver();
  },

  /**
   * 停止计时
   */
  stopCounting: function stopCounting() {
    this.unschedule(this._countCallback);
    this.time = this.maxTime;
  },

  /**
   * 开始游戏计时器
   */
  oneSchedule: function oneSchedule() {
    this.stopCounting();
    this.scheduleOnce(this._countCallback, this.maxTime);
    this.counting = true;
  },

  update: function update(dt) {
    /** 更新计时板计时 */
    if (this.counting && this.time > 0) {
      this.time -= dt;
      var text = this.time.toFixed(2);
      if (text.length === 4) {
        text = '0' + text;
      }
      var textArray = text.split('.');
      this.leftCount.string = textArray[0];
      this.rightCount.string = Utils.prefixInteger((textArray[1] * 0.6).toFixed(0), 2);
    }
  }
});