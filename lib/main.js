(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Buffer = Buffer;
function Buffer(gl, data) {
    this.glBuffer = gl.createBuffer();
    this.bufferLength = data.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
}

Buffer.prototype.bind = function (gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
};

Buffer.prototype.draw = function (gl, from, to) {
    gl.drawArrays(gl.TRIANGLE_FAN, from, to);
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Core = Core;
function Core(canvasId) {
    this.coreState = {
        keyboard: {
            left: false,
            right: false,
            up: false,
            down: false
        },
        mouse: {
            x: 0,
            y: 0
        }
    };

    this.sharedState = {};

    this.coreState.canvasId = canvasId;
}

Core.prototype.init = function (initCallback) {
    var self = this;

    self.coreState.canvasElement = document.getElementById(self.coreState.canvasId);
    if (self.coreState.canvasElement == null) {
        throw new Error('Não foi possível encontrar o elemento Canvas.');
    }

    self.coreState.canvasElement.width = window.outerWidth;
    self.coreState.canvasElement.height = window.innerHeight;

    self.coreState.mouse.x = self.coreState.canvasElement.width * 0.75;
    self.coreState.mouse.y = self.coreState.canvasElement.height * 0.3;

    self.coreState.canvasContext = self.coreState.canvasElement.getContext('webgl') || self.coreState.canvasElement.getContext('experimental-webgl');
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

        window.addEventListener('keydown', function (e) {
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

        window.addEventListener('keyup', function (e) {
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
                y: e.clientY - rect.top
            };
        }

        window.addEventListener('mousemove', function (e) {
            self.coreState.mouse = getMousePosition(self.coreState.canvasElement, e);
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
};

Core.prototype.setUpdateCallback = function (updateCallback) {
    this.updateCallback = updateCallback;
};

Core.prototype.setDrawCallback = function (drawCallback) {
    this.drawCallback = drawCallback;
};

},{}],3:[function(require,module,exports){
'use strict';

var _core = require('./core');

var _shader = require('./shader');

var _buffer = require('./buffer');

var _texture = require('./texture');

var _math = require('./math');

var math = _interopRequireWildcard(_math);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.addEventListener('load', function () {
        setup();
});

// window.addEventListener('resize', function() {
//     setup();
// });

function setup() {
        var core = new _core.Core("canvasElement");

        var tile = document.getElementById('tile');
        var ntile = document.getElementById('ntile');

        var TILE_SIZE = tile.naturalWidth;

        core.init(function () {
                var gl = core.coreState.canvasContext;

                gl.clearColor(1.0, 0.0, 0.0, 1.0);
                gl.viewport(0, 0, core.coreState.canvasElement.width, core.coreState.canvasElement.height);

                var vertexShader = new _shader.Shader('default_vsh', gl.VERTEX_SHADER);
                var fragmentShader = new _shader.Shader('default_fsh', gl.FRAGMENT_SHADER);
                core.sharedState.defaultProgram = new _shader.ShaderProgram(vertexShader, fragmentShader);
                core.sharedState.defaultProgram.use(gl);

                core.sharedState.mv = math.matrix();
                core.sharedState.proj = math.orthoMatrix(0, core.coreState.canvasElement.width, core.coreState.canvasElement.height, 0, -1, 1);

                core.sharedState.geometryBuffer = new _buffer.Buffer(gl, [0.0, 0.0, 0.0, TILE_SIZE, 0.0, 0.0, TILE_SIZE, TILE_SIZE, 0.0, 0.0, TILE_SIZE, 0.0]);

                core.sharedState.textureBuffer = new _buffer.Buffer(gl, [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

                core.sharedState.texture = new _texture.Texture(tile);
                core.sharedState.texture.enable(gl, gl.TEXTURE0);

                core.sharedState.normalMap = new _texture.Texture(ntile);
                core.sharedState.normalMap.enable(gl, gl.TEXTURE1);

                core.sharedState.geometryBuffer.bind(gl);
                core.sharedState.defaultProgram.setVertexAttrib(gl, "a_vertex", 3, 0, 0);

                core.sharedState.textureBuffer.bind(gl);
                core.sharedState.defaultProgram.setVertexAttrib(gl, "a_textCoord", 2, 0, 0);

                core.sharedState.defaultProgram.setTexture(gl, "u_texture", 0);
                core.sharedState.defaultProgram.setTexture(gl, "u_map", 1);
        });

        core.setUpdateCallback(function () {
                var gl = core.coreState.canvasContext;

                core.sharedState.defaultProgram.setUniform2f(gl, "u_pos", [core.coreState.mouse.x, core.coreState.mouse.y]);
        });

        core.setDrawCallback(function () {
                var gl = core.coreState.canvasContext;

                gl.clear(gl.COLOR_BUFFER_BIT);

                var ic = Math.ceil(core.coreState.canvasElement.height / TILE_SIZE);
                var jc = Math.ceil(core.coreState.canvasElement.width / TILE_SIZE);

                for (var i = 0; i < ic; i++) {
                        for (var j = 0; j < jc; j++) {
                                var mv = math.translate(math.vector(j * TILE_SIZE, i * TILE_SIZE, 0.0));
                                var mvp = math.matrixMultiply(core.sharedState.proj, mv);

                                core.sharedState.defaultProgram.setMat(gl, "u_mv", mv);
                                core.sharedState.defaultProgram.setMat(gl, "u_mvp", mvp);

                                core.sharedState.geometryBuffer.draw(gl, 0, 4);
                        }
                }
        });
}

},{"./buffer":1,"./core":2,"./math":4,"./shader":5,"./texture":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.vector = vector;
exports.matrix = matrix;
exports.matrixMultiply = matrixMultiply;
exports.rotate = rotate;
exports.translate = translate;
exports.scale = scale;
exports.orthoMatrix = orthoMatrix;
function vector(a, b, c, d) {
    return [a || 0.0, b || 0.0, c || 0.0, d || 1.0];
}

function matrix() {
    return [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];
}

function matrixMultiply(a, b) {
    var mat = matrix();

    mat[0] = a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3];
    mat[1] = a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3];
    mat[2] = a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3];
    mat[3] = a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3];

    mat[4] = a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7];
    mat[5] = a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7];
    mat[6] = a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7];
    mat[7] = a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7];

    mat[8] = a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11];
    mat[9] = a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11];
    mat[10] = a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11];
    mat[11] = a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11];

    mat[12] = a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15];
    mat[13] = a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15];
    mat[14] = a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15];
    mat[15] = a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15];

    return mat;
}

function rotate(angle, vec) {
    var mat = matrix();

    var x = vec[0],
        y = vec[1],
        z = vec[2];

    var c = Math.cos(angle),
        s = Math.sin(angle);

    var oneMinusCos = 1.0 - c;

    mat[0] = x * x * oneMinusCos + c;
    mat[1] = x * y * oneMinusCos + z * s;
    mat[2] = x * z * oneMinusCos - y * s;

    mat[4] = y * x * oneMinusCos - z * s;
    mat[5] = y * y * oneMinusCos + c;
    mat[6] = y * z * oneMinusCos + x * s;

    mat[8] = z * x * oneMinusCos + y * s;
    mat[9] = z * y * oneMinusCos - x * s;
    mat[10] = z * z * oneMinusCos + c;

    return mat;
}

function translate(vec) {
    var mat = matrix();

    mat[12] = vec[0];
    mat[13] = vec[1];
    mat[14] = vec[2];

    return mat;
}

function scale(vec) {
    var mat = matrix();

    mat[0] = vec[0];
    mat[5] = vec[1];
    mat[10] = vec[2];

    return mat;
}

function orthoMatrix(left, right, bottom, top, near, far) {
    var mat = matrix();

    mat[0] = 2 / (right - left);
    mat[5] = 2 / (top - bottom);
    mat[10] = 2 / (near - far);
    mat[12] = -(right + left) / (right - left);
    mat[13] = -(top + bottom) / (top - bottom);
    mat[14] = -(far + near) / (far - near);

    return mat;
}

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Shader = Shader;
exports.ShaderProgram = ShaderProgram;

var _tools = require('./tools');

var tools = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Shader(elementId, type) {
    this.elementId = elementId;
    this.type = type;
}

Shader.VERTEX_SHADER = 'VERTEX_SHADER';
Shader.FRAGMENT_SHADER = 'FRAGMENT_SHADER';

Shader.prototype.compile = function (gl) {
    var glShader;

    glShader = gl.createShader(this.type);

    gl.shaderSource(glShader, tools.getShaderSource(this.elementId));
    gl.compileShader(glShader);

    return glShader;
};

function ShaderProgram(vertexShader, fragmentShader) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.glProgram = null;

    this.attribsLocation = {};

    this.uniformsLocation = {};
}

ShaderProgram.prototype.compile = function (gl) {
    var glVertexShader = this.vertexShader.compile(gl);
    var glFragmentShader = this.fragmentShader.compile(gl);

    var glProgram = gl.createProgram();

    gl.attachShader(glProgram, glVertexShader);
    gl.attachShader(glProgram, glFragmentShader);
    gl.linkProgram(glProgram);

    var glProgramStatus = gl.getProgramParameter(glProgram, gl.LINK_STATUS);

    if (glProgramStatus) {
        this.glProgram = glProgram;
        return true;
    } else {
        throw new Error(gl.getProgramInfoLog(glProgram));
    }
};

ShaderProgram.prototype.checkAttribName = function (gl, attribName) {
    if (this.attribsLocation[attribName] == null) {
        this.createAttribLocation(gl, attribName);
    }
};

ShaderProgram.prototype.checkUniformName = function (gl, uniformName) {
    if (this.uniformsLocation[uniformName] == null) {
        this.createUniformLocation(gl, uniformName);
    }
};

ShaderProgram.prototype.createAttribLocation = function (gl, attribName) {
    var glAttribLocation = gl.getAttribLocation(this.glProgram, attribName);

    if (glAttribLocation == -1) {
        throw new Error("Attrib não localizado");
    }

    this.attribsLocation[attribName] = glAttribLocation;
};

ShaderProgram.prototype.createUniformLocation = function (gl, uniformName) {
    var glUniformLocation = gl.getUniformLocation(this.glProgram, uniformName);

    if (glUniformLocation == null) {
        throw new Error("Uniform não localizado");
    }

    this.uniformsLocation[uniformName] = glUniformLocation;
};

ShaderProgram.prototype.setVertexAttrib = function (gl, attribName, size, stride, offset) {
    this.checkAttribName(gl, attribName);

    var attribLocation = this.attribsLocation[attribName];

    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(attribLocation, size, gl.FLOAT, false, stride, offset);
};

ShaderProgram.prototype.setMat = function (gl, uniformName, mat) {
    this.checkUniformName(gl, uniformName);

    var uniformLocation = this.uniformsLocation[uniformName];

    gl.uniformMatrix4fv(uniformLocation, false, mat);
};

ShaderProgram.prototype.setUniform2f = function (gl, uniformName, a, b) {
    this.checkUniformName(gl, uniformName);

    var uniformLocation = this.uniformsLocation[uniformName];

    gl.uniform2fv(uniformLocation, a, b);
};

ShaderProgram.prototype.setTexture = function (gl, uniformName, number) {
    this.checkUniformName(gl, uniformName);

    var uniformLocation = this.uniformsLocation[uniformName];

    gl.uniform1i(uniformLocation, number);
};

ShaderProgram.prototype.use = function (gl) {
    if (this.glProgram == null) {
        this.compile(gl);
    }

    gl.useProgram(this.glProgram);
};

},{"./tools":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Texture = Texture;
function Texture(image) {
    this.image = image;
    this.glTexture = null;
}

Texture.prototype.send = function (gl) {
    this.glTexture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);

    return this.glTexture;
};

Texture.prototype.bind = function (gl) {
    if (this.glTexture == null) {
        this.send(gl);
    }

    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
};

Texture.prototype.enable = function (gl, glTextureDest) {
    gl.activeTexture(glTextureDest);
    this.bind(gl);
};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getShaderSource = getShaderSource;
function getShaderSource(elementId) {
    var element = document.getElementById(elementId);

    if (element == null) {
        throw new Error("Elemento shader não encontrado.");
    }

    return element.text;
}

},{}]},{},[3]);
