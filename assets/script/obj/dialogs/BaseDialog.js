var GameStatus = require('GameStatus');
var Utils = require('Utils');

cc.Class({
    extends: cc.Component,

    properties: {
        close: cc.Button,    // 退出按钮
        bg: cc.Node,         // 背景节点
        plane: cc.Node       // 中心容器
    },

    init: function (game) {
        this.game = game;
    },

    /**
     * 关闭按钮事件
     */
    closeClick: function () {
        this.dimiss();
    },

    /**
     * 显示弹窗
     */
    show: function () {
        this.game.switchGameStatus(GameStatus.DIALOG);
        this.node.setLocalZOrder(210);
        this.node.active = true;
        this.node.opacity = 255;
        this._doStartAnim();
    },

    /**
     * 隐藏弹窗
     */
    dimiss: function () {
        this.game.switchGameStatus(GameStatus.SHOWSTARTBTN);
        this._doEndAnim();
    },

    /**
     * 弹出动画
     */
    _doStartAnim: function () {
        if(Utils.shouldRender()){
            // 进行锚点坐标转换
            this.plane.scale = 0.8;
            var scaleBig = cc.scaleTo(0.5, 1, 1);
            this.plane.runAction(scaleBig.easing(cc.easeElasticOut(0)));
        }
    },

    /**
     * 结束动画
     */
    _doEndAnim: function () {
        if(Utils.shouldRender()){
            var fadeOut = cc.fadeOut(0.1);
            var func = cc.callFunc(()=>this.node.active = false);
            this.node.runAction(cc.sequence(fadeOut, func));
        }else{
            this.node.active = false;
        }
    },
    
});
