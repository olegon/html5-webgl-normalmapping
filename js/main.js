window.addEventListener('load', function() {

    var core = new Core("canvasElement");

    // var tile = document.getElementById('tile');

    core.init(function() {
        var gl = core.coreState.canvasContext;

        gl.clearColor(0.6, 0.6, 0.6, 1.0);

        // var texture = new Texture(tile);
        // texture.enable(gl, gl.TEXTURE0);

        var vertexShader = new Shader('default_vsh', gl.VERTEX_SHADER);
        var fragmentShader = new Shader('default_fsh', gl.FRAGMENT_SHADER);
        var shaderProgram = new ShaderProgram(vertexShader, fragmentShader);

        core.sharedState.defaultProgram = shaderProgram;

        core.sharedState.mat = math.getIdentityMat44();

        var size = 0.25;

        core.sharedState.buffer = new Buffer(gl, [-size, -size, -size, -size, -size, size, -size, size, size,
            size, size, -size, -size, -size, -size, -size, size, -size,
            size, -size, size, -size, -size, -size,
            size, -size, -size,
            size, size, -size,
            size, -size, -size, -size, -size, -size, -size, -size, -size, -size, size, size, -size, size, -size,
            size, -size, size, -size, -size, size, -size, -size, -size, -size, size, size, -size, -size, size,
            size, -size, size,
            size, size, size,
            size, -size, -size,
            size, size, -size,
            size, -size, -size,
            size, size, size,
            size, -size, size,
            size, size, size,
            size, size, -size, -size, size, -size,
            size, size, size, -size, size, -size, -size, size, size,
            size, size, size, -size, size, size,
            size, -size, size
        ]);


        core.sharedState.defaultProgram.use(gl);
        core.sharedState.defaultProgram.setVertexAttrib(gl, "a_vertex", 3, 0, 0);
        // debugger;
        // core.sharedState.defaultProgram.setTexture(gl, "u_texture", 0);
    });

    core.setUpdateCallback(function() {
        var gl = core.coreState.canvasContext;

        core.sharedState.mat = math.rotate(core.sharedState.mat, 0.035, [0.0, 0.0, 1.0]);
        core.sharedState.mat = math.rotate(core.sharedState.mat, -0.025, [0.0, 1.0, 0.0]);
        core.sharedState.mat = math.rotate(core.sharedState.mat, 0.015, [1.0, 0.0, 0.0]);

        core.sharedState.defaultProgram.setMat(gl, "u_mvp", core.sharedState.mat);
    });

    core.setDrawCallback(function() {
        var gl = core.coreState.canvasContext;

        gl.clear(gl.COLOR_BUFFER_BIT);

        core.sharedState.buffer.draw(gl);
    });

});
