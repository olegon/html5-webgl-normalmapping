import { Core } from './core';
import { Shader, ShaderProgram } from './shader';
import { Buffer } from './buffer';
import { Texture } from './texture';
import * as math from './math'


window.addEventListener('load', function() {
    setup();
});

// window.addEventListener('resize', function() {
//     setup();
// });

function setup () {
    var core = new Core("canvasElement");

    var tile = document.getElementById('tile');
    var ntile = document.getElementById('ntile');

    var TILE_SIZE = tile.naturalWidth;

    core.init(function() {
        var gl = core.coreState.canvasContext;

        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        gl.viewport(0, 0, core.coreState.canvasElement.width, core.coreState.canvasElement.height);

        var vertexShader = new Shader('default_vsh', gl.VERTEX_SHADER);
        var fragmentShader = new Shader('default_fsh', gl.FRAGMENT_SHADER);
        core.sharedState.defaultProgram = new ShaderProgram(vertexShader, fragmentShader);
        core.sharedState.defaultProgram.use(gl);

        core.sharedState.mv = math.matrix();
        core.sharedState.proj = math.orthoMatrix(0, core.coreState.canvasElement.width, core.coreState.canvasElement.height, 0, -1, 1);


        core.sharedState.geometryBuffer = new Buffer(gl, [
            0.0, 0.0, 0.0,
            TILE_SIZE, 0.0, 0.0,
            TILE_SIZE, TILE_SIZE, 0.0,
            0.0, TILE_SIZE, 0.0
        ]);

        core.sharedState.textureBuffer = new Buffer(gl, [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);

        core.sharedState.texture = new Texture(tile);
        core.sharedState.texture.enable(gl, gl.TEXTURE0);

        core.sharedState.normalMap = new Texture(ntile);
        core.sharedState.normalMap.enable(gl, gl.TEXTURE1);


        core.sharedState.geometryBuffer.bind(gl);
        core.sharedState.defaultProgram.setVertexAttrib(gl, "a_vertex", 3, 0, 0);

        core.sharedState.textureBuffer.bind(gl);
        core.sharedState.defaultProgram.setVertexAttrib(gl, "a_textCoord", 2, 0, 0);


        core.sharedState.defaultProgram.setTexture(gl, "u_texture", 0);
        core.sharedState.defaultProgram.setTexture(gl, "u_map", 1);
    });

    core.setUpdateCallback(function() {
        var gl = core.coreState.canvasContext;

        core.sharedState.defaultProgram.setUniform2f(gl, "u_pos", [core.coreState.mouse.x, core.coreState.mouse.y]);
    });

    core.setDrawCallback(function() {
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
