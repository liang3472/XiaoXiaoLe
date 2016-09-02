var GameStatus = require('GameStatus');

cc.Class({
    extends: cc.Component,

    properties: {
        focusBg: cc.Node
    },

    init: function (game) {
        this.game = game;
        this.item = {
            id: -1,
            row: -1,
            col: -1,
            isFocus: false,
            focusBg: this.focusBg
        };
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            if(this.game.getGameState() === GameStatus.PLAYING){
                this.print();
                this.toggleFocusState(true);
                this.game.squaresMng.checkABFocus(this);
            }
        }, this);
    },

    setMapPlace: function (row, col) {
        this.item._row = row;
        this.item._col = col;
    },

    setId: function (id) {
        this.item.id = id
    },

    getId: function () {
        return this.item.id;
    },

    toggleFocusState: function (flag) {
        this.item._isFocus = flag;
        this.item.focusBg.active = flag;

        if (flag) {
            this.node.setLocalZOrder(100);
        } else {
            this.node.setLocalZOrder(0);
        }
    },

    clearFocus: function () {
        this.toggleFocusState(false);
    },

    /**
     * 是否获得焦点
     * @returns {*}
     */
    isFocusStatus: function () {
        return this.item._isFocus;
    },

    destorySquare: function () {
        this.node.destroy();
    },

    print: function () {
        cc.log('test touch [' + this.item._row + '][' + this.item._col + ']');
    }
});
