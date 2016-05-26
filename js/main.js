window.addEventListener('load', function() {

    var core = new Core("canvasElement");

    var tile = document.getElementById('tile');
    var ntile = document.getElementById('ntile');

    core.init(function() {
        var gl = core.coreState.canvasContext;

        gl.clearColor(0.6, 0.6, 0.6, 1.0);
        gl.viewport(0, 0, core.coreState.canvasElement.width, core.coreState.canvasElement.height);
        gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);



        var vertexShader = new Shader('default_vsh', gl.VERTEX_SHADER);
        var fragmentShader = new Shader('default_fsh', gl.FRAGMENT_SHADER);
        core.sharedState.defaultProgram = new ShaderProgram(vertexShader, fragmentShader);
        core.sharedState.defaultProgram.use(gl);



        core.sharedState.mv = math.getIdentityMat44();
        core.sharedState.proj = math.getOrthoMatrix(0, core.coreState.canvasElement.width, core.coreState.canvasElement.height, 0, -1, 1);


        core.sharedState.geometryBuffer = new Buffer(gl, [
            0.0, 0.0, 0.0,
            32.0, 0.0, 0.0,
            32.0, 32.0, 0.0,
            0.0, 32.0, 0.0
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
    });

    core.setUpdateCallback(function() {
        var gl = core.coreState.canvasContext;



    });
    core.setDrawCallback(function() {
        var gl = core.coreState.canvasContext;

        gl.clear(gl.COLOR_BUFFER_BIT);

        var identity = math.getIdentityMat44();

        var ic = Math.ceil(core.coreState.canvasElement.height / 32.0);
        var jc = Math.ceil(core.coreState.canvasElement.width / 32.0);

        for (var i = 0; i < ic; i++) {
            for (var j = 0; j < jc; j++) {
                var mv = math.translate(identity, [j * 32.0, i * 32.0, 0.0]);
                var mvp = math.mat44Multiply(core.sharedState.proj, mv);
                core.sharedState.defaultProgram.setMat(gl, "u_mvp", mvp);
                core.sharedState.geometryBuffer.draw(gl);
            }
        }
    });

});
