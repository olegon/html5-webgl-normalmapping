export function vector(a, b, c, d) {
    return [a || 0.0, b || 0.0, c || 0.0, d || 1.0];
}

export function matrix() {
    return [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ];
}

export function matrixMultiply(a, b) {
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

export function rotate(angle, vec) {
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

export function translate(vec) {
    var mat = matrix();

    mat[12] = vec[0];
    mat[13] = vec[1];
    mat[14] = vec[2];

    return mat;
}

export function scale(vec) {
    var mat = matrix();

    mat[0] = vec[0];
    mat[5] = vec[1];
    mat[10] = vec[2];

    return mat;
}

export function orthoMatrix(left, right, bottom, top, near, far) {
    var mat = matrix();

    mat[0] = 2 / (right - left);
    mat[5] = 2 / (top - bottom);
    mat[10] = 2 / (near - far);
    mat[12] = -(right + left) / (right - left);
    mat[13] = -(top + bottom) / (top - bottom);
    mat[14] = -(far + near) / (far - near);

    return mat;
}
