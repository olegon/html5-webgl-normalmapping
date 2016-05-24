class Keyboad {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

class CoreState {
    keyboard: Keyboad;

    constructor() {
        this.keyboard = new Keyboad();
    }
}

interface InitCallback<T> {
    (state: T): void;
}

interface UpdateCallback<T> {
    (dt: number, state: T): void;
}

interface DrawCallback<T> {
    (dt: number, state: T): void;
}

class Core<T> {
    canvasId: string;
    canvasElement: HTMLCanvasElement;
    canvasContext: WebGLRenderingContext;

    updateCallback: UpdateCallback<T>;
    drawCallback: DrawCallback<T>;

    coreState: CoreState;

    gameState: T;

    constructor(canvasId: string) {
        this.canvasId = canvasId;

        this.canvasElement = <HTMLCanvasElement>window.document.getElementById(this.canvasId);

        if (this.canvasElement == null) {
            throw new Error('O elemento com Id ' + this.canvasId + ' não existe.');
        }

        this.canvasContext = <WebGLRenderingContext>this.canvasElement.getContext('webgl');

        if (this.canvasContext == null) {
            throw new Error("O elemento não existe.");
        }

        this.coreState = new CoreState();
    }

    init(initCallback: InitCallback<T>) {
        if (initCallback != null) {
            initCallback(this.gameState);
        }
    }

    start() {
        let self = this;

        this.coreState;

        (function inputEventSetup() {
            function preventScrolling(e: KeyboardEvent): void {
                if ([37, 38, 39, 40, 32].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
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

        (function gameLoopSetup() {
            let accTime = 0;
            let previousTime = performance.now();

            function gameloop(currentTime: number) {
                // delta time
                let dt = currentTime - previousTime;
                previousTime = currentTime;

                if (self.updateCallback) self.updateCallback(dt, self.gameState);
                if (self.drawCallback) self.drawCallback(dt, self.gameState);

                window.requestAnimationFrame(gameloop);
            }

            window.requestAnimationFrame(gameloop);
        })();
    }

    setUpdateCallback(updateCallback: UpdateCallback<T>) {
        this.updateCallback = updateCallback;
    };

    setDrawCallback(drawCallback: DrawCallback<T>) {
        this.drawCallback = drawCallback;
    };
}
