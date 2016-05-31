export class Buffer {
    constructor (data) {
        this.data = data;
        this.bufferLength = this.data.length;
        this.glBuffer = null;
    }

    bind (gl) {
        if (this.glBuffer == null) {
            this.create(gl);
        }
        else {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
        }
    }

    create (gl) {
        this.glBuffer = gl.createBuffer();
        this.bufferLength = this.data.length;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.data),
            gl.STATIC_DRAW);
    }

    draw (gl, from, to) {
        gl.drawArrays(gl.TRIANGLE_FAN, from, to);
    }
}
