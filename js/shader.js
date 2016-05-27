function Shader(elementId, type) {
    this.elementId = elementId;
    this.type = type;
}

Shader.VERTEX_SHADER = 'VERTEX_SHADER';
Shader.FRAGMENT_SHADER = 'FRAGMENT_SHADER';

Shader.prototype.compile = function(gl) {
    var glShader;

    glShader = gl.createShader(this.type);

    gl.shaderSource(glShader, tools.loadShaderSource(this.elementId));
    gl.compileShader(glShader);

    return glShader;
};





function ShaderProgram(vertexShader, fragmentShader) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;

    this.glProgram = null;

    this.attribsLocation = {

    };

    this.uniformsLocation = {

    };
}

ShaderProgram.prototype.compile = function(gl) {
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

    if(glAttribLocation == -1) {
        throw new Error("Attrib não localizado");
    }

    this.attribsLocation[attribName] = glAttribLocation;
};

ShaderProgram.prototype.createUniformLocation = function (gl, uniformName) {
    var glUniformLocation = gl.getUniformLocation(this.glProgram, uniformName);

    if(glUniformLocation == null) {
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
