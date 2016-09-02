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