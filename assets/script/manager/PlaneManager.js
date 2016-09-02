var GamePlane = require('GamePlane');

cc.Class({
    extends: cc.Component,

    properties: {
        planeSize: cc.Vec2,
        plane: GamePlane
    },

    init: function (game) {
        this.game = game;
        this.plane.init(game);
    },

    flushPlane: function () {
        // 初始化游戏面板大小
        this._width = this.game.squaresMng.squaresSize.x * this.planeSize.x;
        this._height = this.game.squaresMng.squaresSize.y * this.planeSize.y;
        this.plane.setPlaneSize(this._width, this._height);

        this.game.squaresMng.generateMap(this.planeSize.x, this.planeSize.y);
        this.game.squaresMng.renderMap(this.plane.node, this._width, this._height);
    }

});
