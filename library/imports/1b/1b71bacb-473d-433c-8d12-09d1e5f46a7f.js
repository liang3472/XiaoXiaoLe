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