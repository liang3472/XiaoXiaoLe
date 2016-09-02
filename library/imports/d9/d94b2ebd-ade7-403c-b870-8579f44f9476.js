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