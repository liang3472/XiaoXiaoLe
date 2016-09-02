cc.Class({
    extends: cc.Component,

    properties: {

    },

    init: function (game) {
        this.game = game;
    },
    
    setPlaneSize: function (width, height) {
        this.node.width = width;
        this.node.height = height;
    }
});
