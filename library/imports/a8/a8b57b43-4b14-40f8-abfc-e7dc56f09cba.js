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