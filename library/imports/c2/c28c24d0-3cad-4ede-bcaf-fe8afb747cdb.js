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