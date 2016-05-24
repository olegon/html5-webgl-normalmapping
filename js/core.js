var Keyboad = (function () {
    function Keyboad() {
    }
    return Keyboad;
}());
var CoreState = (function () {
    function CoreState() {
        this.keyboard = new Keyboad();
    }
    return CoreState;
}());
var Core = (function () {
    function Core(canvasId) {
        this.canvasId = canvasId;
        this.canvasElement = window.document.getElementById(this.canvasId);
        if (this.canvasElement == null) {
            throw new Error('O elemento com Id ' + this.canvasId + ' não existe.');
        }
        this.canvasContext = this.canvasElement.getContext('webgl');
        if (this.canvasContext == null) {
            throw new Error("O elemento não existe.");
        }
        this.coreState = new CoreState();
    }
    Core.prototype.init = function (initCallback) {
        if (initCallback != null) {
            initCallback(this.gameState);
        }
    };
    Core.prototype.start = function () {
        var self = this;
        this.coreState;
        (function inputEventSetup() {
            function preventScrolling(e) {
                if ([37, 38, 39, 40, 32].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }
            window.addEventListener('keydown', function (e) {
                if (e.keyCode === 37) {
                    self.coreState.keyboard.left = true;
                }
                else if (e.keyCode === 38) {
                    self.coreState.keyboard.up = true;
                }
                else if (e.keyCode === 39) {
                    self.coreState.keyboard.right = true;
                }
                else if (e.keyCode === 40) {
                    self.coreState.keyboard.down = true;
                }
                preventScrolling(e);
            });
            window.addEventListener('keyup', function (e) {
                if (e.keyCode === 37) {
                    self.coreState.keyboard.left = false;
                }
                else if (e.keyCode === 38) {
                    self.coreState.keyboard.up = false;
                }
                else if (e.keyCode === 39) {
                    self.coreState.keyboard.right = false;
                }
                else if (e.keyCode === 40) {
                    self.coreState.keyboard.down = false;
                }
                preventScrolling(e);
            });
        })();
        (function gameLoopSetup() {
            var accTime = 0;
            var previousTime = performance.now();
            function gameloop(currentTime) {
                var dt = currentTime - previousTime;
                previousTime = currentTime;
                if (self.updateCallback)
                    self.updateCallback(dt, self.gameState);
                if (self.drawCallback)
                    self.drawCallback(dt, self.gameState);
                window.requestAnimationFrame(gameloop);
            }
            window.requestAnimationFrame(gameloop);
        })();
    };
    Core.prototype.setUpdateCallback = function (updateCallback) {
        this.updateCallback = updateCallback;
    };
    ;
    Core.prototype.setDrawCallback = function (drawCallback) {
        this.drawCallback = drawCallback;
    };
    ;
    return Core;
}());
