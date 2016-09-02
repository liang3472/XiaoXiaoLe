require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"BaseDialog":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd92636jtC9Pqpwd+5My033T', 'BaseDialog');
// script/obj/dialogs/BaseDialog.js

var GameStatus = require('GameStatus');
var Utils = require('Utils');

cc.Class({
    'extends': cc.Component,

    properties: {
        close: cc.Button, // 退出按钮
        bg: cc.Node, // 背景节点
        plane: cc.Node // 中心容器
    },

    init: function init(game) {
        this.game = game;
    },

    /**
     * 关闭按钮事件
     */
    closeClick: function closeClick() {
        this.dimiss();
    },

    /**
     * 显示弹窗
     */
    show: function show() {
        this.game.switchGameStatus(GameStatus.DIALOG);
        this.node.setLocalZOrder(210);
        this.node.active = true;
        this.node.opacity = 255;
        this._doStartAnim();
    },

    /**
     * 隐藏弹窗
     */
    dimiss: function dimiss() {
        this.game.switchGameStatus(GameStatus.SHOWSTARTBTN);
        this._doEndAnim();
    },

    /**
     * 弹出动画
     */
    _doStartAnim: function _doStartAnim() {
        if (Utils.shouldRender()) {
            // 进行锚点坐标转换
            this.plane.scale = 0.8;
            var scaleBig = cc.scaleTo(0.5, 1, 1);
            this.plane.runAction(scaleBig.easing(cc.easeElasticOut(0)));
        }
    },

    /**
     * 结束动画
     */
    _doEndAnim: function _doEndAnim() {
        var _this = this;

        if (Utils.shouldRender()) {
            var fadeOut = cc.fadeOut(0.1);
            var func = cc.callFunc(function () {
                return _this.node.active = false;
            });
            this.node.runAction(cc.sequence(fadeOut, func));
        } else {
            this.node.active = false;
        }
    }

});

cc._RFpop();
},{"GameStatus":"GameStatus","Utils":"Utils"}],"DialogManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c28c2TQPK1O3ryv/or7dHzb', 'DialogManager');
// script/manager/DialogManager.js

var ResultDialog = require('ResultDialog');
var StartDialog = require('StartDialog');

cc.Class({
    'extends': cc.Component,

    properties: {
        resultDialog: cc.Prefab, // 结果弹窗
        startDialog: cc.Prefab // 开始按钮
    },

    init: function init(game) {
        this._resultDialog = this._getDialogNode(this.resultDialog).getComponent(ResultDialog);
        this._startDialog = this._getDialogNode(this.startDialog).getComponent(StartDialog);

        this._resultDialog.init(game);
        this._startDialog.init(game);
    },

    /**
     * 动态获取dialog节点
     * @param prefab
     * @returns {*}
     * @private
     */
    _getDialogNode: function _getDialogNode(prefab) {
        var dialog = cc.instantiate(prefab);
        this.node.parent.addChild(dialog);
        dialog.active = false;
        return dialog;
    },

    /**
     * 获取结果弹窗
     * @returns {Component|*}
     */
    getResultDialog: function getResultDialog() {
        return this._resultDialog;
    },

    /**
     * 获取开始弹窗
     * @returns {Component|*}
     */
    getStartDialog: function getStartDialog() {
        return this._startDialog;
    }

});

cc._RFpop();
},{"ResultDialog":"ResultDialog","StartDialog":"StartDialog"}],"GameManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3ae58Pl/4VJ4JUbwlQ7Qx5b', 'GameManager');
// script/manager/GameManager.js

var PlaneManager = require('PlaneManager');
var SquaresManager = require('SquaresManager');
var TimeManager = require('TimeManager');
var GameStatus = require('GameStatus');
var ScoreManager = require('ScoreManager');
var DialogManager = require('DialogManager');

cc.Class({
    'extends': cc.Component,

    properties: {
        planeMng: PlaneManager,
        squaresMng: SquaresManager,
        timeMng: TimeManager,
        scoreMng: ScoreManager,
        dialogMng: DialogManager
    },

    onLoad: function onLoad() {
        this.squaresMng.init(this);
        this.planeMng.init(this);
        this.timeMng.init(this);
        this.scoreMng.init(this);
        this.dialogMng.init(this);

        this.switchGameStatus(GameStatus.SHOWSTARTBTN);
        cc.director.setDisplayStats(true); // 显示fps
    },

    /**
     * 切换游戏状态
     */
    switchGameStatus: function switchGameStatus(status) {
        this._gameStatus = status;
        switch (status) {
            case GameStatus.SHOWSTARTBTN:
                // 显示开始按钮，关闭图层，激活当前节点事件监听
                cc.log('SHOWSTARTBTN');
                this.scoreMng.setScore(0);
                this.planeMng.flushPlane();
                this.startGame();
                break;
            case GameStatus.DIALOG:
                // 弹窗
                cc.log('DIALOG');
                break;
            case GameStatus.GAMEOVER:
                // 游戏结束
                cc.log('GAMEOVER');
                this.dialogMng.getResultDialog().showResult();
                break;
            case GameStatus.PLAYING:
                // 游戏开始，开始计时
                cc.log('PLAYING');
                this.timeMng.oneSchedule();
                break;
            default:
                break;
        }
    },

    startGame: function startGame() {
        this.switchGameStatus(GameStatus.PLAYING);
    },

    getGameState: function getGameState() {
        return this._gameStatus;
    },

    /**
     * 游戏结束
     */
    gameOver: function gameOver() {
        this.switchGameStatus(GameStatus.GAMEOVER);
        this.dialogMng.getResultDialog().showResult();
    }

});

cc._RFpop();
},{"DialogManager":"DialogManager","GameStatus":"GameStatus","PlaneManager":"PlaneManager","ScoreManager":"ScoreManager","SquaresManager":"SquaresManager","TimeManager":"TimeManager"}],"GamePlane":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1b71brLRz1DPI0SCdHl9Gp/', 'GamePlane');
// script/obj/GamePlane.js

cc.Class({
    "extends": cc.Component,

    properties: {},

    init: function init(game) {
        this.game = game;
    },

    setPlaneSize: function setPlaneSize(width, height) {
        this.node.width = width;
        this.node.height = height;
    }
});

cc._RFpop();
},{}],"GameStatus":[function(require,module,exports){
"use strict";
cc._RFpush(module, '58e57wbQ75CwrhnR8q9Asp9', 'GameStatus');
// script/status/GameStatus.js

var GameStatus = cc.Enum({
    SHOWSTARTBTN: -1, // 显示开始按钮
    PLAYING: -1, // 游戏进行中
    GAMEOVER: -1, // 游戏结束
    DIALOG: -1 // 弹窗
});
module.exports = GameStatus;

cc._RFpop();
},{}],"PlaneManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e5496hamndHNr2JOLMSWHSB', 'PlaneManager');
// script/manager/PlaneManager.js

var GamePlane = require('GamePlane');

cc.Class({
    'extends': cc.Component,

    properties: {
        planeSize: cc.Vec2,
        plane: GamePlane
    },

    init: function init(game) {
        this.game = game;
        this.plane.init(game);
    },

    flushPlane: function flushPlane() {
        // 初始化游戏面板大小
        this._width = this.game.squaresMng.squaresSize.x * this.planeSize.x;
        this._height = this.game.squaresMng.squaresSize.y * this.planeSize.y;
        this.plane.setPlaneSize(this._width, this._height);

        this.game.squaresMng.generateMap(this.planeSize.x, this.planeSize.y);
        this.game.squaresMng.renderMap(this.plane.node, this._width, this._height);
    }

});

cc._RFpop();
},{"GamePlane":"GamePlane"}],"ResultDialog":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c86e8zMLChFfamPX2wpcIsK', 'ResultDialog');
// script/obj/dialogs/ResultDialog.js

var BaseDialog = require('BaseDialog');
cc.Class({
    'extends': BaseDialog,

    properties: {},

    showResult: function showResult() {
        this.show();
    }

});

cc._RFpop();
},{"BaseDialog":"BaseDialog"}],"ScoreManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '567d7PxqIlHkrGstecwXCrs', 'ScoreManager');
// script/manager/ScoreManager.js

var Utils = require('Utils');

cc.Class({
    'extends': cc.Component,

    properties: {
        score: cc.Label
    },

    init: function init(game) {
        this.game = game;
        this._score = 0;
    },

    /**
     * 获取分数
     * @returns {number|*}
     */
    getScore: function getScore() {
        return this._score;
    },

    /**
     * 设置分数
     * @param score
     */
    setScore: function setScore(score) {
        this._score = score;
        this._updateScore();
    },

    /**
     * 增加分数
     */
    addScore: function addScore() {
        this._score += 1;
        this._updateScore();
    },

    /**
     * 更新分数
     */
    _updateScore: function _updateScore() {
        this.score.string = Utils.prefixInteger(this._score, 3);
    }

});

cc._RFpop();
},{"Utils":"Utils"}],"SquaresManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a8b57tDSxRA+Kv859xW8Jy6', 'SquaresManager');
// script/manager/SquaresManager.js

cc.Class({
    'extends': cc.Component,

    properties: {
        blueSquares: cc.Prefab,
        greenSquares: cc.Prefab,
        redSquares: cc.Prefab,
        yellowSquares: cc.Prefab,
        squaresSize: cc.Vec2
    },

    init: function init(game) {
        this.game = game;
        this.firstFocus = null;
        this.secondFocus = null;
    },

    /**
     * 获取方块大小
     * @returns {*}
     */
    getSquaresRect: function getSquaresRect() {
        return this.squaresSize;
    },

    /**
     * 获取方块类型集合
     */
    getSquaresTypeList: function getSquaresTypeList() {
        return [this.blueSquares, this.greenSquares, this.redSquares, this.yellowSquares];
    },

    /**
     * 生成地图
     */
    generateMap: function generateMap(row, col) {
        this._row = row;
        this._col = col;
        this.pairCount = 0;
        this._maps = [this._row];

        var id = 0;
        for (var i = 0; i < this._row; i++) {
            this._maps[i] = [this._col];
            for (var j = 0; j < this._col; j++) {
                if ((i * this._row + j) % 2 === 0) {
                    id = this.createId();
                }
                this._maps[i][j] = id;
            }
        }

        this.change();
        this.testMap();
    },

    /**
     * 打乱顺序
     */
    change: function change() {
        // 临时变量,用来交换两个位置的数据
        var tempX, tempY, tempM;

        for (var x = 0; x < this._row; x++) {
            for (var y = 0; y < this._col; y++) {
                tempX = parseInt(cc.random0To1() * (this._row - 1));
                tempY = parseInt(cc.random0To1() * (this._col - 1));
                tempM = this._maps[x][y];
                this._maps[x][y] = this._maps[tempX][tempY];
                this._maps[tempX][tempY] = tempM;
            }
        }
    },

    /**
     * 产生id
     */
    createId: function createId() {
        var id = this.pairCount % this.getSquaresTypeList().length;
        this.pairCount += 1;
        return id;
    },

    /**
     * 渲染地图
     * @param planeNode 地图容器
     * @param width     地图宽
     * @param height    地图高
     */
    renderMap: function renderMap(planeNode, width, height) {
        this.resetFocus();
        this.clearAllSquares(planeNode);
        for (var i = 0; i < this._row; i++) {
            for (var j = 0; j < this._col; j++) {
                var arrays = this.getSquaresTypeList();
                var prefab = arrays[this._maps[i][j]];
                var child = cc.instantiate(prefab);
                child.width = this.squaresSize.x;
                child.height = this.squaresSize.y;
                planeNode.addChild(child);
                var x = j * this.squaresSize.x + this.squaresSize.x / 2 - width / 2;
                var y = -i * this.squaresSize.y - this.squaresSize.y / 2 + height / 2;
                child.setPosition(cc.p(x, y));

                var square = child.getComponent('Square');
                square.init(this.game);
                square.setId(this._maps[i][j]);
                square.setMapPlace(i, j);
            }
        }
    },

    /**
     * 设置当前获得焦点的方块
     * @param focus
     */
    checkABFocus: function checkABFocus(focus) {
        if (this.secondFocus !== null) {
            // 清除前两个方块的焦点,使当前方块高亮
            if (this.secondFocus !== focus && this.firstFocus !== focus) {
                // 如果当前方块不是第一第二个获得焦点的方块
                this.firstFocus.clearFocus();
                this.secondFocus.clearFocus();

                this.resetFocus();
                this.firstFocus = focus;
            }
        } else if (this.firstFocus !== null) {
            // 如果存在第一个获得焦点的方块,则和当前方块作对比
            if (this.firstFocus !== focus && this.firstFocus.getId() === focus.getId()) {
                // 如果两个方块相等,并且不是自己,则两方块消除,并加分
                this.firstFocus.destorySquare();
                this.firstFocus = null;
                this.game.scoreMng.addScore();
                focus.destorySquare();
                focus = null;
                this.addScore();
            } else {
                // 如果两个方块不相等,则存储第二个方块
                if (this.firstFocus !== focus) {
                    // 如果当前方块不是第一个获得焦点的方块
                    this.secondFocus = focus;
                }
            }
        } else {
            this.firstFocus = focus; // 如果之前都没操作,则记录第一个方块选中
        }
    },

    addScore: function addScore() {
        this.pairCount -= 1;
        cc.log('消除一对 +1分');
        if (this.pairCount === 0) {
            this.game.planeMng.flushPlane();
        }
    },

    resetFocus: function resetFocus() {
        this.firstFocus = null;
        this.secondFocus = null;
    },

    /**
     * 清空方块
     */
    clearAllSquares: function clearAllSquares(planeNode) {
        planeNode.removeAllChildren();
    },

    /**
     * 测试地图id顺序
     */
    testMap: function testMap() {
        for (var i = 0; i < this._row; i++) {
            var line = '';
            for (var j = 0; j < this._col; j++) {
                line = line + this._maps[i][j];
            }
            cc.log(line);
            cc.log('');
        }
    }
});

cc._RFpop();
},{}],"Square":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd94b269redAPLhwhXn0T5R2', 'Square');
// script/obj/Square.js

var GameStatus = require('GameStatus');

cc.Class({
    'extends': cc.Component,

    properties: {
        focusBg: cc.Node
    },

    init: function init(game) {
        var _this = this;

        this.game = game;
        this.item = {
            id: -1,
            row: -1,
            col: -1,
            isFocus: false,
            focusBg: this.focusBg
        };
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (_this.game.getGameState() === GameStatus.PLAYING) {
                _this.print();
                _this.toggleFocusState(true);
                _this.game.squaresMng.checkABFocus(_this);
            }
        }, this);
    },

    setMapPlace: function setMapPlace(row, col) {
        this.item._row = row;
        this.item._col = col;
    },

    setId: function setId(id) {
        this.item.id = id;
    },

    getId: function getId() {
        return this.item.id;
    },

    toggleFocusState: function toggleFocusState(flag) {
        this.item._isFocus = flag;
        this.item.focusBg.active = flag;

        if (flag) {
            this.node.setLocalZOrder(100);
        } else {
            this.node.setLocalZOrder(0);
        }
    },

    clearFocus: function clearFocus() {
        this.toggleFocusState(false);
    },

    /**
     * 是否获得焦点
     * @returns {*}
     */
    isFocusStatus: function isFocusStatus() {
        return this.item._isFocus;
    },

    destorySquare: function destorySquare() {
        this.node.destroy();
    },

    print: function print() {
        cc.log('test touch [' + this.item._row + '][' + this.item._col + ']');
    }
});

cc._RFpop();
},{"GameStatus":"GameStatus"}],"StartDialog":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bffdfgJYUJJr4eRV/8vJxVg', 'StartDialog');
// script/obj/dialogs/StartDialog.js

var BaseDialog = require('BaseDialog');
cc.Class({
    'extends': BaseDialog,

    properties: {},

    showStart: function showStart() {
        this.show();
    }

});

cc._RFpop();
},{"BaseDialog":"BaseDialog"}],"TimeManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e4af9nXKtlPcrVdcGyOUx6A', 'TimeManager');
// script/manager/TimeManager.js

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

cc._RFpop();
},{"Utils":"Utils"}],"Utils":[function(require,module,exports){
"use strict";
cc._RFpush(module, '20fdfJFMHtC8KlLHTVOrlE+', 'Utils');
// script/utils/Utils.js

module.exports = {
  /**
   * 数字补0
   */
  prefixInteger: function prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  },

  /**
   * 检测是否是微信
   */
  isWeChatBrowser: function isWeChatBrowser() {
    return (/MicroMessenger/i.test(navigator.userAgent)
    );
  },

  /**
   * 检测是否是饿了么
   * @returns {boolean}
   */
  isElemeBrowser: function isElemeBrowser() {
    return (/Eleme/i.test(navigator.userAgent)
    );
  },

  /**
   * 检测是否是饿了么
   * @returns {boolean}
   */
  isWeiBoBrowser: function isWeiBoBrowser() {
    return (/WeiBo/i.test(navigator.userAgent)
    );
  },

  /**
   * 按字段名搜索Cookie值
   * @param name  字段名
   * @returns {null}
   */
  scanCookie: function scanCookie(name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
  },

  /**
   * 预加载SpriteFrame
   */
  preLoadSpriteFrame: function preLoadSpriteFrame(path, targetSprite) {
    cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
      targetSprite.spriteFrame = spriteFrame;
    });
  },

  /**
   * 是否渲染动画
   * @returns {boolean}
   */
  shouldRender: function shouldRender() {
    return this.isWeChatBrowser() || cc.sys.os === cc.sys.OS_IOS;
  }
};

cc._RFpop();
},{}]},{},["GamePlane","Utils","GameManager","ScoreManager","GameStatus","SquaresManager","StartDialog","DialogManager","ResultDialog","BaseDialog","Square","TimeManager","PlaneManager"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IgMi5hcHAvQ29udGVudHMvUmVzb3VyY2VzL2FwcC5hc2FyL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0L29iai9kaWFsb2dzL0Jhc2VEaWFsb2cuanMiLCJhc3NldHMvc2NyaXB0L21hbmFnZXIvRGlhbG9nTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHQvbWFuYWdlci9HYW1lTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHQvb2JqL0dhbWVQbGFuZS5qcyIsImFzc2V0cy9zY3JpcHQvc3RhdHVzL0dhbWVTdGF0dXMuanMiLCJhc3NldHMvc2NyaXB0L21hbmFnZXIvUGxhbmVNYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdC9vYmovZGlhbG9ncy9SZXN1bHREaWFsb2cuanMiLCJhc3NldHMvc2NyaXB0L21hbmFnZXIvU2NvcmVNYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdC9tYW5hZ2VyL1NxdWFyZXNNYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdC9vYmovU3F1YXJlLmpzIiwiYXNzZXRzL3NjcmlwdC9vYmovZGlhbG9ncy9TdGFydERpYWxvZy5qcyIsImFzc2V0cy9zY3JpcHQvbWFuYWdlci9UaW1lTWFuYWdlci5qcyIsImFzc2V0cy9zY3JpcHQvdXRpbHMvVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdkOTI2MzZqdEM5UHFwd2QrNU15MDMzVCcsICdCYXNlRGlhbG9nJyk7XG4vLyBzY3JpcHQvb2JqL2RpYWxvZ3MvQmFzZURpYWxvZy5qc1xuXG52YXIgR2FtZVN0YXR1cyA9IHJlcXVpcmUoJ0dhbWVTdGF0dXMnKTtcbnZhciBVdGlscyA9IHJlcXVpcmUoJ1V0aWxzJyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgY2xvc2U6IGNjLkJ1dHRvbiwgLy8g6YCA5Ye65oyJ6ZKuXG4gICAgICAgIGJnOiBjYy5Ob2RlLCAvLyDog4zmma/oioLngrlcbiAgICAgICAgcGxhbmU6IGNjLk5vZGUgLy8g5Lit5b+D5a655ZmoXG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlhbPpl63mjInpkq7kuovku7ZcbiAgICAgKi9cbiAgICBjbG9zZUNsaWNrOiBmdW5jdGlvbiBjbG9zZUNsaWNrKCkge1xuICAgICAgICB0aGlzLmRpbWlzcygpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmmL7npLrlvLnnqpdcbiAgICAgKi9cbiAgICBzaG93OiBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgICB0aGlzLmdhbWUuc3dpdGNoR2FtZVN0YXR1cyhHYW1lU3RhdHVzLkRJQUxPRyk7XG4gICAgICAgIHRoaXMubm9kZS5zZXRMb2NhbFpPcmRlcigyMTApO1xuICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgICAgIHRoaXMuX2RvU3RhcnRBbmltKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOmakOiXj+W8ueeql1xuICAgICAqL1xuICAgIGRpbWlzczogZnVuY3Rpb24gZGltaXNzKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3dpdGNoR2FtZVN0YXR1cyhHYW1lU3RhdHVzLlNIT1dTVEFSVEJUTik7XG4gICAgICAgIHRoaXMuX2RvRW5kQW5pbSgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDlvLnlh7rliqjnlLtcbiAgICAgKi9cbiAgICBfZG9TdGFydEFuaW06IGZ1bmN0aW9uIF9kb1N0YXJ0QW5pbSgpIHtcbiAgICAgICAgaWYgKFV0aWxzLnNob3VsZFJlbmRlcigpKSB7XG4gICAgICAgICAgICAvLyDov5vooYzplJrngrnlnZDmoIfovazmjaJcbiAgICAgICAgICAgIHRoaXMucGxhbmUuc2NhbGUgPSAwLjg7XG4gICAgICAgICAgICB2YXIgc2NhbGVCaWcgPSBjYy5zY2FsZVRvKDAuNSwgMSwgMSk7XG4gICAgICAgICAgICB0aGlzLnBsYW5lLnJ1bkFjdGlvbihzY2FsZUJpZy5lYXNpbmcoY2MuZWFzZUVsYXN0aWNPdXQoMCkpKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnu5PmnZ/liqjnlLtcbiAgICAgKi9cbiAgICBfZG9FbmRBbmltOiBmdW5jdGlvbiBfZG9FbmRBbmltKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmIChVdGlscy5zaG91bGRSZW5kZXIoKSkge1xuICAgICAgICAgICAgdmFyIGZhZGVPdXQgPSBjYy5mYWRlT3V0KDAuMSk7XG4gICAgICAgICAgICB2YXIgZnVuYyA9IGNjLmNhbGxGdW5jKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMubm9kZS5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5ub2RlLnJ1bkFjdGlvbihjYy5zZXF1ZW5jZShmYWRlT3V0LCBmdW5jKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm5vZGUuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzI4YzJUUVBLMU8zcnl2L29yN2RIemInLCAnRGlhbG9nTWFuYWdlcicpO1xuLy8gc2NyaXB0L21hbmFnZXIvRGlhbG9nTWFuYWdlci5qc1xuXG52YXIgUmVzdWx0RGlhbG9nID0gcmVxdWlyZSgnUmVzdWx0RGlhbG9nJyk7XG52YXIgU3RhcnREaWFsb2cgPSByZXF1aXJlKCdTdGFydERpYWxvZycpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHJlc3VsdERpYWxvZzogY2MuUHJlZmFiLCAvLyDnu5PmnpzlvLnnqpdcbiAgICAgICAgc3RhcnREaWFsb2c6IGNjLlByZWZhYiAvLyDlvIDlp4vmjInpkq5cbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG4gICAgICAgIHRoaXMuX3Jlc3VsdERpYWxvZyA9IHRoaXMuX2dldERpYWxvZ05vZGUodGhpcy5yZXN1bHREaWFsb2cpLmdldENvbXBvbmVudChSZXN1bHREaWFsb2cpO1xuICAgICAgICB0aGlzLl9zdGFydERpYWxvZyA9IHRoaXMuX2dldERpYWxvZ05vZGUodGhpcy5zdGFydERpYWxvZykuZ2V0Q29tcG9uZW50KFN0YXJ0RGlhbG9nKTtcblxuICAgICAgICB0aGlzLl9yZXN1bHREaWFsb2cuaW5pdChnYW1lKTtcbiAgICAgICAgdGhpcy5fc3RhcnREaWFsb2cuaW5pdChnYW1lKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5Yqo5oCB6I635Y+WZGlhbG9n6IqC54K5XG4gICAgICogQHBhcmFtIHByZWZhYlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2dldERpYWxvZ05vZGU6IGZ1bmN0aW9uIF9nZXREaWFsb2dOb2RlKHByZWZhYikge1xuICAgICAgICB2YXIgZGlhbG9nID0gY2MuaW5zdGFudGlhdGUocHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLnBhcmVudC5hZGRDaGlsZChkaWFsb2cpO1xuICAgICAgICBkaWFsb2cuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBkaWFsb2c7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOiOt+WPlue7k+aenOW8ueeql1xuICAgICAqIEByZXR1cm5zIHtDb21wb25lbnR8Kn1cbiAgICAgKi9cbiAgICBnZXRSZXN1bHREaWFsb2c6IGZ1bmN0aW9uIGdldFJlc3VsdERpYWxvZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jlc3VsdERpYWxvZztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6I635Y+W5byA5aeL5by556qXXG4gICAgICogQHJldHVybnMge0NvbXBvbmVudHwqfVxuICAgICAqL1xuICAgIGdldFN0YXJ0RGlhbG9nOiBmdW5jdGlvbiBnZXRTdGFydERpYWxvZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0RGlhbG9nO1xuICAgIH1cblxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICczYWU1OFBsLzRWSjRKVWJ3bFE3UXg1YicsICdHYW1lTWFuYWdlcicpO1xuLy8gc2NyaXB0L21hbmFnZXIvR2FtZU1hbmFnZXIuanNcblxudmFyIFBsYW5lTWFuYWdlciA9IHJlcXVpcmUoJ1BsYW5lTWFuYWdlcicpO1xudmFyIFNxdWFyZXNNYW5hZ2VyID0gcmVxdWlyZSgnU3F1YXJlc01hbmFnZXInKTtcbnZhciBUaW1lTWFuYWdlciA9IHJlcXVpcmUoJ1RpbWVNYW5hZ2VyJyk7XG52YXIgR2FtZVN0YXR1cyA9IHJlcXVpcmUoJ0dhbWVTdGF0dXMnKTtcbnZhciBTY29yZU1hbmFnZXIgPSByZXF1aXJlKCdTY29yZU1hbmFnZXInKTtcbnZhciBEaWFsb2dNYW5hZ2VyID0gcmVxdWlyZSgnRGlhbG9nTWFuYWdlcicpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBsYW5lTW5nOiBQbGFuZU1hbmFnZXIsXG4gICAgICAgIHNxdWFyZXNNbmc6IFNxdWFyZXNNYW5hZ2VyLFxuICAgICAgICB0aW1lTW5nOiBUaW1lTWFuYWdlcixcbiAgICAgICAgc2NvcmVNbmc6IFNjb3JlTWFuYWdlcixcbiAgICAgICAgZGlhbG9nTW5nOiBEaWFsb2dNYW5hZ2VyXG4gICAgfSxcblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLnNxdWFyZXNNbmcuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5wbGFuZU1uZy5pbml0KHRoaXMpO1xuICAgICAgICB0aGlzLnRpbWVNbmcuaW5pdCh0aGlzKTtcbiAgICAgICAgdGhpcy5zY29yZU1uZy5pbml0KHRoaXMpO1xuICAgICAgICB0aGlzLmRpYWxvZ01uZy5pbml0KHRoaXMpO1xuXG4gICAgICAgIHRoaXMuc3dpdGNoR2FtZVN0YXR1cyhHYW1lU3RhdHVzLlNIT1dTVEFSVEJUTik7XG4gICAgICAgIGNjLmRpcmVjdG9yLnNldERpc3BsYXlTdGF0cyh0cnVlKTsgLy8g5pi+56S6ZnBzXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWIh+aNoua4uOaIj+eKtuaAgVxuICAgICAqL1xuICAgIHN3aXRjaEdhbWVTdGF0dXM6IGZ1bmN0aW9uIHN3aXRjaEdhbWVTdGF0dXMoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuX2dhbWVTdGF0dXMgPSBzdGF0dXM7XG4gICAgICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0dXMuU0hPV1NUQVJUQlROOlxuICAgICAgICAgICAgICAgIC8vIOaYvuekuuW8gOWni+aMiemSru+8jOWFs+mXreWbvuWxgu+8jOa/gOa0u+W9k+WJjeiKgueCueS6i+S7tuebkeWQrFxuICAgICAgICAgICAgICAgIGNjLmxvZygnU0hPV1NUQVJUQlROJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZU1uZy5zZXRTY29yZSgwKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYW5lTW5nLmZsdXNoUGxhbmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0R2FtZSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdHVzLkRJQUxPRzpcbiAgICAgICAgICAgICAgICAvLyDlvLnnqpdcbiAgICAgICAgICAgICAgICBjYy5sb2coJ0RJQUxPRycpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBHYW1lU3RhdHVzLkdBTUVPVkVSOlxuICAgICAgICAgICAgICAgIC8vIOa4uOaIj+e7k+adn1xuICAgICAgICAgICAgICAgIGNjLmxvZygnR0FNRU9WRVInKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpYWxvZ01uZy5nZXRSZXN1bHREaWFsb2coKS5zaG93UmVzdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEdhbWVTdGF0dXMuUExBWUlORzpcbiAgICAgICAgICAgICAgICAvLyDmuLjmiI/lvIDlp4vvvIzlvIDlp4vorqHml7ZcbiAgICAgICAgICAgICAgICBjYy5sb2coJ1BMQVlJTkcnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVNbmcub25lU2NoZWR1bGUoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgc3RhcnRHYW1lOiBmdW5jdGlvbiBzdGFydEdhbWUoKSB7XG4gICAgICAgIHRoaXMuc3dpdGNoR2FtZVN0YXR1cyhHYW1lU3RhdHVzLlBMQVlJTkcpO1xuICAgIH0sXG5cbiAgICBnZXRHYW1lU3RhdGU6IGZ1bmN0aW9uIGdldEdhbWVTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dhbWVTdGF0dXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOa4uOaIj+e7k+adn1xuICAgICAqL1xuICAgIGdhbWVPdmVyOiBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICAgICAgdGhpcy5zd2l0Y2hHYW1lU3RhdHVzKEdhbWVTdGF0dXMuR0FNRU9WRVIpO1xuICAgICAgICB0aGlzLmRpYWxvZ01uZy5nZXRSZXN1bHREaWFsb2coKS5zaG93UmVzdWx0KCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzFiNzFickxSejFEUEkwU0NkSGw5R3AvJywgJ0dhbWVQbGFuZScpO1xuLy8gc2NyaXB0L29iai9HYW1lUGxhbmUuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIH0sXG5cbiAgICBzZXRQbGFuZVNpemU6IGZ1bmN0aW9uIHNldFBsYW5lU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHRoaXMubm9kZS53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLm5vZGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnNThlNTd3YlE3NUN3cmhuUjhxOUFzcDknLCAnR2FtZVN0YXR1cycpO1xuLy8gc2NyaXB0L3N0YXR1cy9HYW1lU3RhdHVzLmpzXG5cbnZhciBHYW1lU3RhdHVzID0gY2MuRW51bSh7XG4gICAgU0hPV1NUQVJUQlROOiAtMSwgLy8g5pi+56S65byA5aeL5oyJ6ZKuXG4gICAgUExBWUlORzogLTEsIC8vIOa4uOaIj+i/m+ihjOS4rVxuICAgIEdBTUVPVkVSOiAtMSwgLy8g5ri45oiP57uT5p2fXG4gICAgRElBTE9HOiAtMSAvLyDlvLnnqpdcbn0pO1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lU3RhdHVzO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTU0OTZoYW1uZEhOcjJKT0xNU1dIU0InLCAnUGxhbmVNYW5hZ2VyJyk7XG4vLyBzY3JpcHQvbWFuYWdlci9QbGFuZU1hbmFnZXIuanNcblxudmFyIEdhbWVQbGFuZSA9IHJlcXVpcmUoJ0dhbWVQbGFuZScpO1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHBsYW5lU2l6ZTogY2MuVmVjMixcbiAgICAgICAgcGxhbmU6IEdhbWVQbGFuZVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGFuZS5pbml0KGdhbWUpO1xuICAgIH0sXG5cbiAgICBmbHVzaFBsYW5lOiBmdW5jdGlvbiBmbHVzaFBsYW5lKCkge1xuICAgICAgICAvLyDliJ3lp4vljJbmuLjmiI/pnaLmnb/lpKflsI9cbiAgICAgICAgdGhpcy5fd2lkdGggPSB0aGlzLmdhbWUuc3F1YXJlc01uZy5zcXVhcmVzU2l6ZS54ICogdGhpcy5wbGFuZVNpemUueDtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5nYW1lLnNxdWFyZXNNbmcuc3F1YXJlc1NpemUueSAqIHRoaXMucGxhbmVTaXplLnk7XG4gICAgICAgIHRoaXMucGxhbmUuc2V0UGxhbmVTaXplKHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zcXVhcmVzTW5nLmdlbmVyYXRlTWFwKHRoaXMucGxhbmVTaXplLngsIHRoaXMucGxhbmVTaXplLnkpO1xuICAgICAgICB0aGlzLmdhbWUuc3F1YXJlc01uZy5yZW5kZXJNYXAodGhpcy5wbGFuZS5ub2RlLCB0aGlzLl93aWR0aCwgdGhpcy5faGVpZ2h0KTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYzg2ZTh6TUxDaEZmYW1QWDJ3cGNJc0snLCAnUmVzdWx0RGlhbG9nJyk7XG4vLyBzY3JpcHQvb2JqL2RpYWxvZ3MvUmVzdWx0RGlhbG9nLmpzXG5cbnZhciBCYXNlRGlhbG9nID0gcmVxdWlyZSgnQmFzZURpYWxvZycpO1xuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogQmFzZURpYWxvZyxcblxuICAgIHByb3BlcnRpZXM6IHt9LFxuXG4gICAgc2hvd1Jlc3VsdDogZnVuY3Rpb24gc2hvd1Jlc3VsdCgpIHtcbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzU2N2Q3UHhxSWxIa3JHc3RlY3dYQ3JzJywgJ1Njb3JlTWFuYWdlcicpO1xuLy8gc2NyaXB0L21hbmFnZXIvU2NvcmVNYW5hZ2VyLmpzXG5cbnZhciBVdGlscyA9IHJlcXVpcmUoJ1V0aWxzJyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgc2NvcmU6IGNjLkxhYmVsXG4gICAgfSxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLl9zY29yZSA9IDA7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOiOt+WPluWIhuaVsFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ8Kn1cbiAgICAgKi9cbiAgICBnZXRTY29yZTogZnVuY3Rpb24gZ2V0U2NvcmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY29yZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6+572u5YiG5pWwXG4gICAgICogQHBhcmFtIHNjb3JlXG4gICAgICovXG4gICAgc2V0U2NvcmU6IGZ1bmN0aW9uIHNldFNjb3JlKHNjb3JlKSB7XG4gICAgICAgIHRoaXMuX3Njb3JlID0gc2NvcmU7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVNjb3JlKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOWinuWKoOWIhuaVsFxuICAgICAqL1xuICAgIGFkZFNjb3JlOiBmdW5jdGlvbiBhZGRTY29yZSgpIHtcbiAgICAgICAgdGhpcy5fc2NvcmUgKz0gMTtcbiAgICAgICAgdGhpcy5fdXBkYXRlU2NvcmUoKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5pu05paw5YiG5pWwXG4gICAgICovXG4gICAgX3VwZGF0ZVNjb3JlOiBmdW5jdGlvbiBfdXBkYXRlU2NvcmUoKSB7XG4gICAgICAgIHRoaXMuc2NvcmUuc3RyaW5nID0gVXRpbHMucHJlZml4SW50ZWdlcih0aGlzLl9zY29yZSwgMyk7XG4gICAgfVxuXG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2E4YjU3dERTeFJBK0t2ODU5eFc4Snk2JywgJ1NxdWFyZXNNYW5hZ2VyJyk7XG4vLyBzY3JpcHQvbWFuYWdlci9TcXVhcmVzTWFuYWdlci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGJsdWVTcXVhcmVzOiBjYy5QcmVmYWIsXG4gICAgICAgIGdyZWVuU3F1YXJlczogY2MuUHJlZmFiLFxuICAgICAgICByZWRTcXVhcmVzOiBjYy5QcmVmYWIsXG4gICAgICAgIHllbGxvd1NxdWFyZXM6IGNjLlByZWZhYixcbiAgICAgICAgc3F1YXJlc1NpemU6IGNjLlZlYzJcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuZmlyc3RGb2N1cyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2Vjb25kRm9jdXMgPSBudWxsO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDojrflj5bmlrnlnZflpKflsI9cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXRTcXVhcmVzUmVjdDogZnVuY3Rpb24gZ2V0U3F1YXJlc1JlY3QoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNxdWFyZXNTaXplO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDojrflj5bmlrnlnZfnsbvlnovpm4blkIhcbiAgICAgKi9cbiAgICBnZXRTcXVhcmVzVHlwZUxpc3Q6IGZ1bmN0aW9uIGdldFNxdWFyZXNUeXBlTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmJsdWVTcXVhcmVzLCB0aGlzLmdyZWVuU3F1YXJlcywgdGhpcy5yZWRTcXVhcmVzLCB0aGlzLnllbGxvd1NxdWFyZXNdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDnlJ/miJDlnLDlm75cbiAgICAgKi9cbiAgICBnZW5lcmF0ZU1hcDogZnVuY3Rpb24gZ2VuZXJhdGVNYXAocm93LCBjb2wpIHtcbiAgICAgICAgdGhpcy5fcm93ID0gcm93O1xuICAgICAgICB0aGlzLl9jb2wgPSBjb2w7XG4gICAgICAgIHRoaXMucGFpckNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5fbWFwcyA9IFt0aGlzLl9yb3ddO1xuXG4gICAgICAgIHZhciBpZCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcm93OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21hcHNbaV0gPSBbdGhpcy5fY29sXTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoKGkgKiB0aGlzLl9yb3cgKyBqKSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWQgPSB0aGlzLmNyZWF0ZUlkKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX21hcHNbaV1bal0gPSBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hhbmdlKCk7XG4gICAgICAgIHRoaXMudGVzdE1hcCgpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmiZPkubHpobrluo9cbiAgICAgKi9cbiAgICBjaGFuZ2U6IGZ1bmN0aW9uIGNoYW5nZSgpIHtcbiAgICAgICAgLy8g5Li05pe25Y+Y6YePLOeUqOadpeS6pOaNouS4pOS4quS9jee9rueahOaVsOaNrlxuICAgICAgICB2YXIgdGVtcFgsIHRlbXBZLCB0ZW1wTTtcblxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMuX3JvdzsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMuX2NvbDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgdGVtcFggPSBwYXJzZUludChjYy5yYW5kb20wVG8xKCkgKiAodGhpcy5fcm93IC0gMSkpO1xuICAgICAgICAgICAgICAgIHRlbXBZID0gcGFyc2VJbnQoY2MucmFuZG9tMFRvMSgpICogKHRoaXMuX2NvbCAtIDEpKTtcbiAgICAgICAgICAgICAgICB0ZW1wTSA9IHRoaXMuX21hcHNbeF1beV07XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwc1t4XVt5XSA9IHRoaXMuX21hcHNbdGVtcFhdW3RlbXBZXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBzW3RlbXBYXVt0ZW1wWV0gPSB0ZW1wTTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDkuqfnlJ9pZFxuICAgICAqL1xuICAgIGNyZWF0ZUlkOiBmdW5jdGlvbiBjcmVhdGVJZCgpIHtcbiAgICAgICAgdmFyIGlkID0gdGhpcy5wYWlyQ291bnQgJSB0aGlzLmdldFNxdWFyZXNUeXBlTGlzdCgpLmxlbmd0aDtcbiAgICAgICAgdGhpcy5wYWlyQ291bnQgKz0gMTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiDmuLLmn5PlnLDlm75cbiAgICAgKiBAcGFyYW0gcGxhbmVOb2RlIOWcsOWbvuWuueWZqFxuICAgICAqIEBwYXJhbSB3aWR0aCAgICAg5Zyw5Zu+5a69XG4gICAgICogQHBhcmFtIGhlaWdodCAgICDlnLDlm77pq5hcbiAgICAgKi9cbiAgICByZW5kZXJNYXA6IGZ1bmN0aW9uIHJlbmRlck1hcChwbGFuZU5vZGUsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgdGhpcy5yZXNldEZvY3VzKCk7XG4gICAgICAgIHRoaXMuY2xlYXJBbGxTcXVhcmVzKHBsYW5lTm9kZSk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fcm93OyBpKyspIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5fY29sOyBqKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJyYXlzID0gdGhpcy5nZXRTcXVhcmVzVHlwZUxpc3QoKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJlZmFiID0gYXJyYXlzW3RoaXMuX21hcHNbaV1bal1dO1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGNjLmluc3RhbnRpYXRlKHByZWZhYik7XG4gICAgICAgICAgICAgICAgY2hpbGQud2lkdGggPSB0aGlzLnNxdWFyZXNTaXplLng7XG4gICAgICAgICAgICAgICAgY2hpbGQuaGVpZ2h0ID0gdGhpcy5zcXVhcmVzU2l6ZS55O1xuICAgICAgICAgICAgICAgIHBsYW5lTm9kZS5hZGRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgdmFyIHggPSBqICogdGhpcy5zcXVhcmVzU2l6ZS54ICsgdGhpcy5zcXVhcmVzU2l6ZS54IC8gMiAtIHdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgeSA9IC1pICogdGhpcy5zcXVhcmVzU2l6ZS55IC0gdGhpcy5zcXVhcmVzU2l6ZS55IC8gMiArIGhlaWdodCAvIDI7XG4gICAgICAgICAgICAgICAgY2hpbGQuc2V0UG9zaXRpb24oY2MucCh4LCB5KSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3F1YXJlID0gY2hpbGQuZ2V0Q29tcG9uZW50KCdTcXVhcmUnKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuaW5pdCh0aGlzLmdhbWUpO1xuICAgICAgICAgICAgICAgIHNxdWFyZS5zZXRJZCh0aGlzLl9tYXBzW2ldW2pdKTtcbiAgICAgICAgICAgICAgICBzcXVhcmUuc2V0TWFwUGxhY2UoaSwgaik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog6K6+572u5b2T5YmN6I635b6X54Sm54K555qE5pa55Z2XXG4gICAgICogQHBhcmFtIGZvY3VzXG4gICAgICovXG4gICAgY2hlY2tBQkZvY3VzOiBmdW5jdGlvbiBjaGVja0FCRm9jdXMoZm9jdXMpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kRm9jdXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIOa4hemZpOWJjeS4pOS4quaWueWdl+eahOeEpueCuSzkvb/lvZPliY3mlrnlnZfpq5jkuq5cbiAgICAgICAgICAgIGlmICh0aGlzLnNlY29uZEZvY3VzICE9PSBmb2N1cyAmJiB0aGlzLmZpcnN0Rm9jdXMgIT09IGZvY3VzKSB7XG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c5b2T5YmN5pa55Z2X5LiN5piv56ys5LiA56ys5LqM5Liq6I635b6X54Sm54K555qE5pa55Z2XXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdEZvY3VzLmNsZWFyRm9jdXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZEZvY3VzLmNsZWFyRm9jdXMoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRGb2N1cygpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1cyA9IGZvY3VzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZmlyc3RGb2N1cyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8g5aaC5p6c5a2Y5Zyo56ys5LiA5Liq6I635b6X54Sm54K555qE5pa55Z2XLOWImeWSjOW9k+WJjeaWueWdl+S9nOWvueavlFxuICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RGb2N1cyAhPT0gZm9jdXMgJiYgdGhpcy5maXJzdEZvY3VzLmdldElkKCkgPT09IGZvY3VzLmdldElkKCkpIHtcbiAgICAgICAgICAgICAgICAvLyDlpoLmnpzkuKTkuKrmlrnlnZfnm7jnrYks5bm25LiU5LiN5piv6Ieq5bexLOWImeS4pOaWueWdl+a2iOmZpCzlubbliqDliIZcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXMuZGVzdG9yeVNxdWFyZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1cyA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnNjb3JlTW5nLmFkZFNjb3JlKCk7XG4gICAgICAgICAgICAgICAgZm9jdXMuZGVzdG9yeVNxdWFyZSgpO1xuICAgICAgICAgICAgICAgIGZvY3VzID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFNjb3JlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOS4pOS4quaWueWdl+S4jeebuOetiSzliJnlrZjlgqjnrKzkuozkuKrmlrnlnZdcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5maXJzdEZvY3VzICE9PSBmb2N1cykge1xuICAgICAgICAgICAgICAgICAgICAvLyDlpoLmnpzlvZPliY3mlrnlnZfkuI3mmK/nrKzkuIDkuKrojrflvpfnhKbngrnnmoTmlrnlnZdcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRGb2N1cyA9IGZvY3VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1cyA9IGZvY3VzOyAvLyDlpoLmnpzkuYvliY3pg73msqHmk43kvZws5YiZ6K6w5b2V56ys5LiA5Liq5pa55Z2X6YCJ5LitXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgYWRkU2NvcmU6IGZ1bmN0aW9uIGFkZFNjb3JlKCkge1xuICAgICAgICB0aGlzLnBhaXJDb3VudCAtPSAxO1xuICAgICAgICBjYy5sb2coJ+a2iOmZpOS4gOWvuSArMeWIhicpO1xuICAgICAgICBpZiAodGhpcy5wYWlyQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGFuZU1uZy5mbHVzaFBsYW5lKCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgcmVzZXRGb2N1czogZnVuY3Rpb24gcmVzZXRGb2N1cygpIHtcbiAgICAgICAgdGhpcy5maXJzdEZvY3VzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWNvbmRGb2N1cyA9IG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOa4heepuuaWueWdl1xuICAgICAqL1xuICAgIGNsZWFyQWxsU3F1YXJlczogZnVuY3Rpb24gY2xlYXJBbGxTcXVhcmVzKHBsYW5lTm9kZSkge1xuICAgICAgICBwbGFuZU5vZGUucmVtb3ZlQWxsQ2hpbGRyZW4oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICog5rWL6K+V5Zyw5Zu+aWTpobrluo9cbiAgICAgKi9cbiAgICB0ZXN0TWFwOiBmdW5jdGlvbiB0ZXN0TWFwKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3JvdzsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbGluZSA9ICcnO1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLl9jb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lICsgdGhpcy5fbWFwc1tpXVtqXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNjLmxvZyhsaW5lKTtcbiAgICAgICAgICAgIGNjLmxvZygnJyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2Q5NGIyNjlyZWRBUExod2hYbjBUNVIyJywgJ1NxdWFyZScpO1xuLy8gc2NyaXB0L29iai9TcXVhcmUuanNcblxudmFyIEdhbWVTdGF0dXMgPSByZXF1aXJlKCdHYW1lU3RhdHVzJyk7XG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZm9jdXNCZzogY2MuTm9kZVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGdhbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLml0ZW0gPSB7XG4gICAgICAgICAgICBpZDogLTEsXG4gICAgICAgICAgICByb3c6IC0xLFxuICAgICAgICAgICAgY29sOiAtMSxcbiAgICAgICAgICAgIGlzRm9jdXM6IGZhbHNlLFxuICAgICAgICAgICAgZm9jdXNCZzogdGhpcy5mb2N1c0JnXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5nYW1lLmdldEdhbWVTdGF0ZSgpID09PSBHYW1lU3RhdHVzLlBMQVlJTkcpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5wcmludCgpO1xuICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZUZvY3VzU3RhdGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuZ2FtZS5zcXVhcmVzTW5nLmNoZWNrQUJGb2N1cyhfdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG5cbiAgICBzZXRNYXBQbGFjZTogZnVuY3Rpb24gc2V0TWFwUGxhY2Uocm93LCBjb2wpIHtcbiAgICAgICAgdGhpcy5pdGVtLl9yb3cgPSByb3c7XG4gICAgICAgIHRoaXMuaXRlbS5fY29sID0gY29sO1xuICAgIH0sXG5cbiAgICBzZXRJZDogZnVuY3Rpb24gc2V0SWQoaWQpIHtcbiAgICAgICAgdGhpcy5pdGVtLmlkID0gaWQ7XG4gICAgfSxcblxuICAgIGdldElkOiBmdW5jdGlvbiBnZXRJZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXRlbS5pZDtcbiAgICB9LFxuXG4gICAgdG9nZ2xlRm9jdXNTdGF0ZTogZnVuY3Rpb24gdG9nZ2xlRm9jdXNTdGF0ZShmbGFnKSB7XG4gICAgICAgIHRoaXMuaXRlbS5faXNGb2N1cyA9IGZsYWc7XG4gICAgICAgIHRoaXMuaXRlbS5mb2N1c0JnLmFjdGl2ZSA9IGZsYWc7XG5cbiAgICAgICAgaWYgKGZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS5zZXRMb2NhbFpPcmRlcigxMDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ub2RlLnNldExvY2FsWk9yZGVyKDApO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGNsZWFyRm9jdXM6IGZ1bmN0aW9uIGNsZWFyRm9jdXMoKSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRm9jdXNTdGF0ZShmYWxzZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIOaYr+WQpuiOt+W+l+eEpueCuVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGlzRm9jdXNTdGF0dXM6IGZ1bmN0aW9uIGlzRm9jdXNTdGF0dXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW0uX2lzRm9jdXM7XG4gICAgfSxcblxuICAgIGRlc3RvcnlTcXVhcmU6IGZ1bmN0aW9uIGRlc3RvcnlTcXVhcmUoKSB7XG4gICAgICAgIHRoaXMubm9kZS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIHByaW50OiBmdW5jdGlvbiBwcmludCgpIHtcbiAgICAgICAgY2MubG9nKCd0ZXN0IHRvdWNoIFsnICsgdGhpcy5pdGVtLl9yb3cgKyAnXVsnICsgdGhpcy5pdGVtLl9jb2wgKyAnXScpO1xuICAgIH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnYmZmZGZnSllVSkpyNGVSVi84dkp4VmcnLCAnU3RhcnREaWFsb2cnKTtcbi8vIHNjcmlwdC9vYmovZGlhbG9ncy9TdGFydERpYWxvZy5qc1xuXG52YXIgQmFzZURpYWxvZyA9IHJlcXVpcmUoJ0Jhc2VEaWFsb2cnKTtcbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IEJhc2VEaWFsb2csXG5cbiAgICBwcm9wZXJ0aWVzOiB7fSxcblxuICAgIHNob3dTdGFydDogZnVuY3Rpb24gc2hvd1N0YXJ0KCkge1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICB9XG5cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnZTRhZjluWEt0bFBjclZkY0d5T1V4NkEnLCAnVGltZU1hbmFnZXInKTtcbi8vIHNjcmlwdC9tYW5hZ2VyL1RpbWVNYW5hZ2VyLmpzXG5cbnZhciBVdGlscyA9IHJlcXVpcmUoJ1V0aWxzJyk7XG5cbmNjLkNsYXNzKHtcbiAgJ2V4dGVuZHMnOiBjYy5Db21wb25lbnQsXG5cbiAgcHJvcGVydGllczoge1xuICAgIG1heFRpbWU6IDAsIC8vIOacgOWkp+a4uOaIj+aXtumXtFxuICAgIGxlZnRDb3VudDogY2MuTGFiZWwsIC8vIOW3pui+ueaVsOWtl1xuICAgIHJpZ2h0Q291bnQ6IGNjLkxhYmVsIC8vIOWPs+i+ueaVsOWtl1xuXG4gIH0sXG5cbiAgaW5pdDogZnVuY3Rpb24gaW5pdChnYW1lKSB7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLnRpbWUgPSB0aGlzLm1heFRpbWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOiuoeaXtuWbnuiwg1xuICAgKi9cbiAgX2NvdW50Q2FsbGJhY2s6IGZ1bmN0aW9uIF9jb3VudENhbGxiYWNrKCkge1xuICAgIHRoaXMuY291bnRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmxlZnRDb3VudC5zdHJpbmcgPSAnMzAnO1xuICAgIHRoaXMucmlnaHRDb3VudC5zdHJpbmcgPSAnMDAnO1xuICAgIHRoaXMuZ2FtZS5nYW1lT3ZlcigpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDlgZzmraLorqHml7ZcbiAgICovXG4gIHN0b3BDb3VudGluZzogZnVuY3Rpb24gc3RvcENvdW50aW5nKCkge1xuICAgIHRoaXMudW5zY2hlZHVsZSh0aGlzLl9jb3VudENhbGxiYWNrKTtcbiAgICB0aGlzLnRpbWUgPSB0aGlzLm1heFRpbWU7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOW8gOWni+a4uOaIj+iuoeaXtuWZqFxuICAgKi9cbiAgb25lU2NoZWR1bGU6IGZ1bmN0aW9uIG9uZVNjaGVkdWxlKCkge1xuICAgIHRoaXMuc3RvcENvdW50aW5nKCk7XG4gICAgdGhpcy5zY2hlZHVsZU9uY2UodGhpcy5fY291bnRDYWxsYmFjaywgdGhpcy5tYXhUaW1lKTtcbiAgICB0aGlzLmNvdW50aW5nID0gdHJ1ZTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgIC8qKiDmm7TmlrDorqHml7bmnb/orqHml7YgKi9cbiAgICBpZiAodGhpcy5jb3VudGluZyAmJiB0aGlzLnRpbWUgPiAwKSB7XG4gICAgICB0aGlzLnRpbWUgLT0gZHQ7XG4gICAgICB2YXIgdGV4dCA9IHRoaXMudGltZS50b0ZpeGVkKDIpO1xuICAgICAgaWYgKHRleHQubGVuZ3RoID09PSA0KSB7XG4gICAgICAgIHRleHQgPSAnMCcgKyB0ZXh0O1xuICAgICAgfVxuICAgICAgdmFyIHRleHRBcnJheSA9IHRleHQuc3BsaXQoJy4nKTtcbiAgICAgIHRoaXMubGVmdENvdW50LnN0cmluZyA9IHRleHRBcnJheVswXTtcbiAgICAgIHRoaXMucmlnaHRDb3VudC5zdHJpbmcgPSBVdGlscy5wcmVmaXhJbnRlZ2VyKCh0ZXh0QXJyYXlbMV0gKiAwLjYpLnRvRml4ZWQoMCksIDIpO1xuICAgIH1cbiAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcyMGZkZkpGTUh0QzhLbExIVFZPcmxFKycsICdVdGlscycpO1xuLy8gc2NyaXB0L3V0aWxzL1V0aWxzLmpzXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvKipcbiAgICog5pWw5a2X6KGlMFxuICAgKi9cbiAgcHJlZml4SW50ZWdlcjogZnVuY3Rpb24gcHJlZml4SW50ZWdlcihudW0sIGxlbmd0aCkge1xuICAgIHJldHVybiAoQXJyYXkobGVuZ3RoKS5qb2luKCcwJykgKyBudW0pLnNsaWNlKC1sZW5ndGgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmo4DmtYvmmK/lkKbmmK/lvq7kv6FcbiAgICovXG4gIGlzV2VDaGF0QnJvd3NlcjogZnVuY3Rpb24gaXNXZUNoYXRCcm93c2VyKCkge1xuICAgIHJldHVybiAoL01pY3JvTWVzc2VuZ2VyL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuICAgICk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIOajgOa1i+aYr+WQpuaYr+mlv+S6huS5iFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICovXG4gIGlzRWxlbWVCcm93c2VyOiBmdW5jdGlvbiBpc0VsZW1lQnJvd3NlcigpIHtcbiAgICByZXR1cm4gKC9FbGVtZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICApO1xuICB9LFxuXG4gIC8qKlxuICAgKiDmo4DmtYvmmK/lkKbmmK/ppb/kuobkuYhcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc1dlaUJvQnJvd3NlcjogZnVuY3Rpb24gaXNXZWlCb0Jyb3dzZXIoKSB7XG4gICAgcmV0dXJuICgvV2VpQm8vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpXG4gICAgKTtcbiAgfSxcblxuICAvKipcbiAgICog5oyJ5a2X5q615ZCN5pCc57SiQ29va2ll5YC8XG4gICAqIEBwYXJhbSBuYW1lICDlrZfmrrXlkI1cbiAgICogQHJldHVybnMge251bGx9XG4gICAqL1xuICBzY2FuQ29va2llOiBmdW5jdGlvbiBzY2FuQ29va2llKG5hbWUpIHtcbiAgICB2YXIgYXJyLFxuICAgICAgICByZWcgPSBuZXcgUmVnRXhwKFwiKF58IClcIiArIG5hbWUgKyBcIj0oW147XSopKDt8JClcIik7XG4gICAgaWYgKGFyciA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChyZWcpKSByZXR1cm4gdW5lc2NhcGUoYXJyWzJdKTtlbHNlIHJldHVybiBudWxsO1xuICB9LFxuXG4gIC8qKlxuICAgKiDpooTliqDovb1TcHJpdGVGcmFtZVxuICAgKi9cbiAgcHJlTG9hZFNwcml0ZUZyYW1lOiBmdW5jdGlvbiBwcmVMb2FkU3ByaXRlRnJhbWUocGF0aCwgdGFyZ2V0U3ByaXRlKSB7XG4gICAgY2MubG9hZGVyLmxvYWRSZXMocGF0aCwgY2MuU3ByaXRlRnJhbWUsIGZ1bmN0aW9uIChlcnIsIHNwcml0ZUZyYW1lKSB7XG4gICAgICB0YXJnZXRTcHJpdGUuc3ByaXRlRnJhbWUgPSBzcHJpdGVGcmFtZTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICog5piv5ZCm5riy5p+T5Yqo55S7XG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgc2hvdWxkUmVuZGVyOiBmdW5jdGlvbiBzaG91bGRSZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNXZUNoYXRCcm93c2VyKCkgfHwgY2Muc3lzLm9zID09PSBjYy5zeXMuT1NfSU9TO1xuICB9XG59O1xuXG5jYy5fUkZwb3AoKTsiXX0=
