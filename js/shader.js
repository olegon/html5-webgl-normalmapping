import * as tools from './tools';

export class Shader {
    constructor (elementId, type) {
        this.elementId = elementId;
        this.type = type;
    }

    compile (gl) {
        var glShader;

        glShader = gl.createShader(this.type);

        gl.shaderSource(glShader, tools.getShaderSource(this.elementId));
        gl.compileShader(glShader);

        return glShader;
    }
}


export class ShaderProgram {
    constructor (vertexShader, fragmentShader) {
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;

        this.glProgram = null;

        this.attribsLocation = {

        };

        this.uniformsLocation = {

        };
    }

    compile (gl) {
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
    }

    checkAttribName (gl, attribName) {
        if (this.attribsLocation[attribName] == null) {
            this.createAttribLocation(gl, attribName);
        }
    }

    checkUniformName (gl, uniformName) {
        if (this.uniformsLocation[uniformName] == null) {
            this.createUniformLocation(gl, uniformName);
        }
    }

    createAttribLocation (gl, attribName) {
        var glAttribLocation = gl.getAttribLocation(this.glProgram, attribName);

        if(glAttribLocation == -1) {
            throw new Error("Attrib não localizado");
        }

        this.attribsLocation[attribName] = glAttribLocation;
    }

    createUniformLocation (gl, uniformName) {
        var glUniformLocation = gl.getUniformLocation(this.glProgram, uniformName);

        if(glUniformLocation == null) {
            throw new Error("Uniform não localizado");
        }

        this.uniformsLocation[uniformName] = glUniformLocation;
    }

    setVertexAttrib (gl, attribName, size, stride, offset) {
        this.checkAttribName(gl, attribName);

        var attribLocation = this.attribsLocation[attribName];

        gl.enableVertexAttribArray(attribLocation);
        gl.vertexAttribPointer(attribLocation, size, gl.FLOAT, false, stride, offset);
    }

    setMat (gl, uniformName, mat) {
        this.checkUniformName(gl, uniformName);

        var uniformLocation = this.uniformsLocation[uniformName];

        gl.uniformMatrix4fv(uniformLocation, false, mat);
    }

    setUniform2f (gl, uniformName, a, b) {
        this.checkUniformName(gl, uniformName);

        var uniformLocation = this.uniformsLocation[uniformName];

        gl.uniform2fv(uniformLocation, a, b);
    }

    setTexture (gl, uniformName, number) {
        this.checkUniformName(gl, uniformName);

        var uniformLocation = this.uniformsLocation[uniformName];

        gl.uniform1i(uniformLocation, number);
    }

    use (gl) {
        if (this.glProgram == null) {
            this.compile(gl);
        }

        gl.useProgram(this.glProgram);
    }
}
