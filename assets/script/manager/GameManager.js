var PlaneManager = require('PlaneManager');
var SquaresManager = require('SquaresManager');
var TimeManager = require('TimeManager');
var GameStatus = require('GameStatus');
var ScoreManager = require('ScoreManager');
var DialogManager = require('DialogManager');

cc.Class({
    extends: cc.Component,

    properties: {
        planeMng: PlaneManager,
        squaresMng: SquaresManager,
        timeMng: TimeManager,
        scoreMng: ScoreManager,
        dialogMng: DialogManager
    },

    onLoad: function () {
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
    switchGameStatus: function (status) {
        this._gameStatus = status;
        switch (status) {
            case GameStatus.SHOWSTARTBTN: // 显示开始按钮，关闭图层，激活当前节点事件监听
                cc.log('SHOWSTARTBTN');
                this.scoreMng.setScore(0);
                this.planeMng.flushPlane();
                this.startGame();
                break;
            case GameStatus.DIALOG: // 弹窗
                cc.log('DIALOG');
                break;
            case GameStatus.GAMEOVER: // 游戏结束
                cc.log('GAMEOVER');
                this.dialogMng.getResultDialog().showResult();
                break;
            case GameStatus.PLAYING: // 游戏开始，开始计时
                cc.log('PLAYING');
                this.timeMng.oneSchedule();
                break;
            default:
                break;
        }
    },
    
    startGame: function () {
        this.switchGameStatus(GameStatus.PLAYING);
    },

    getGameState: function () {
        return this._gameStatus;
    },

    /**
     * 游戏结束
     */
    gameOver: function () {
        this.switchGameStatus(GameStatus.GAMEOVER);
        this.dialogMng.getResultDialog().showResult();
    }

});
