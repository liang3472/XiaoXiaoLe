module.exports = {
  /**
   * 数字补0
   */
  prefixInteger: function (num, length) {
    return (Array(length).join('0') + num).slice(-length);
  },

  /**
   * 检测是否是微信
   */
  isWeChatBrowser: function () {
    return /MicroMessenger/i.test(navigator.userAgent);
  },

  /**
   * 检测是否是饿了么
   * @returns {boolean}
   */
  isElemeBrowser: function () {
    return /Eleme/i.test(navigator.userAgent);
  },

  /**
   * 检测是否是饿了么
   * @returns {boolean}
   */
  isWeiBoBrowser: function () {
    return /WeiBo/i.test(navigator.userAgent);
  },

  /**
   * 按字段名搜索Cookie值
   * @param name  字段名
   * @returns {null}
   */
  scanCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  },

  /**
   * 预加载SpriteFrame
   */
  preLoadSpriteFrame: function (path, targetSprite) {
    cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
      targetSprite.spriteFrame = spriteFrame;
    });
  },

  /**
   * 是否渲染动画
   * @returns {boolean}
   */
  shouldRender: function () {
    return this.isWeChatBrowser() || cc.sys.os === cc.sys.OS_IOS;
  }
};
