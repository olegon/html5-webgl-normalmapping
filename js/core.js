export class Core {
    constructor (canvasId) {
        this.coreState = {
            keyboard: {
                left: false,
                right: false,
                up: false,
                down: false
            },
            mouse: {
                x: 0,
                y: 0,
                z: 128
            }
        };

        this.sharedState = {};

        this.coreState.canvasId = canvasId;
    }

    init (initCallback) {
        var self = this;

        self.coreState.canvasElement = document.getElementById(self.coreState.canvasId);
        if (self.coreState.canvasElement == null) {
            throw new Error('Não foi possível encontrar o elemento Canvas.');
        }

        self.coreState.canvasElement.width = self.coreState.canvasElement.clientWidth;
        self.coreState.canvasElement.height = self.coreState.canvasElement.clientHeight;

        self.coreState.mouse.x = self.coreState.canvasElement.width * 0.75;
        self.coreState.mouse.y = self.coreState.canvasElement.height * 0.3;

        self.coreState.canvasContext =  self.coreState.canvasElement.getContext('webgl') || self.coreState.canvasElement.getContext('experimental-webgl');
        if (this.coreState.canvasContext == null) {
            throw new Error('Não foi possível obter o contexto do WebGL.');
        }

        (function setupKeyboardEvents() {
            function preventScrolling(e) {
                var ignoreKeyCodesList = [37, 38, 39, 40];

                if (ignoreKeyCodesList.indexOf(e.keyCode) > -1) {
                    return e.preventDefault();
                }
            }

            window.addEventListener('keydown', function(e) {
                if (e.keyCode === 37) {
                    self.coreState.keyboard.left = true;
                } else if (e.keyCode === 38) {
                    self.coreState.keyboard.up = true;
                } else if (e.keyCode === 39) {
                    self.coreState.keyboard.right = true;
                } else if (e.keyCode === 40) {
                    self.coreState.keyboard.down = true;
                }

                preventScrolling(e);
            });

            window.addEventListener('keyup', function(e) {
                if (e.keyCode === 37) {
                    self.coreState.keyboard.left = false;
                } else if (e.keyCode === 38) {
                    self.coreState.keyboard.up = false;
                } else if (e.keyCode === 39) {
                    self.coreState.keyboard.right = false;
                } else if (e.keyCode === 40) {
                    self.coreState.keyboard.down = false;
                }

                preventScrolling(e);
            });
        })();

        (function setupMouseEvents() {
            function getMousePosition(canvas, e) {
                var rect = canvas.getBoundingClientRect();

                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    z: self.coreState.mouse.z
                };
            }

            window.addEventListener('mousemove', function(e) {
                self.coreState.mouse = getMousePosition(self.coreState.canvasElement, e);
            });

            window.addEventListener('wheel', function(e) {
                self.coreState.mouse = {
                    x: self.coreState.mouse.x,
                    y: self.coreState.mouse.y,
                    z: Math.max(15, Math.min(self.coreState.mouse.z + e.deltaY * 5, 500))
                };
            });

        })();

        if (initCallback) {
            initCallback();
        }

        (function setupGameLoop() {
            var now = performance.now();

            function gameloop(t) {
                var dt = t - now;
                now = t;

                if (self.updateCallback) {
                    self.updateCallback(dt);
                }

                if (self.drawCallback) {
                    self.drawCallback(dt);
                }

                window.requestAnimationFrame(gameloop);
            }

            window.requestAnimationFrame(gameloop);
        })();
    }

    resize () {
        var self = this;

        self.coreState.canvasElement.width = self.coreState.canvasElement.clientWidth;
        self.coreState.canvasElement.height = self.coreState.canvasElement.clientHeight;
        self.coreState.canvasContext.viewport(0, 0, self.coreState.canvasElement.width, self.coreState.canvasElement.height);

        if (this.resizeCallback) {
            this.resizeCallback();
        }
    }

    setUpdateCallback (updateCallback) {
        this.updateCallback = updateCallback;
    }

    setDrawCallback (drawCallback) {
        this.drawCallback = drawCallback;
    }

    setResizeCallback (resizeCallback) {
        this.resizeCallback = resizeCallback;
    }
}
