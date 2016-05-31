export function Buffer(gl, data) {
    this.glBuffer = gl.createBuffer();
    this.bufferLength = data.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(data),
        gl.STATIC_DRAW);
}

Buffer.prototype.bind = function (gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
};

Buffer.prototype.draw = function (gl, from, to) {
    gl.drawArrays(gl.TRIANGLE_FAN, from, to);
};
