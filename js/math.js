var math = (function () {
	var module = {};

	module.getVec4 = function() {
		return [0.0, 0.0, 0.0, 1.0];
	};

	module.getIdentityMat44= function() {
		return [
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 1.0
		];
	};

	module.mat44Multiply = function(mat1, mat2) {
		var mat = module.getIdentityMat44();

		mat[0] = mat1[0] * mat2[0] + mat1[4] * mat2[1] + mat1[8] * mat2[2] + mat1[12] * mat2[3];
		mat[1] = mat1[1] * mat2[0] + mat1[5] * mat2[1] + mat1[9] * mat2[2] + mat1[13] * mat2[3];
		mat[2] = mat1[2] * mat2[0] + mat1[6] * mat2[1] + mat1[10] * mat2[2] + mat1[14] * mat2[3];
		mat[3] = mat1[3] * mat2[0] + mat1[7] * mat2[1] + mat1[11] * mat2[2] + mat1[15] * mat2[3];

		mat[4] = mat1[0] * mat2[4] + mat1[4] * mat2[5] + mat1[8] * mat2[6] + mat1[12] * mat2[7];
		mat[5] = mat1[1] * mat2[4] + mat1[5] * mat2[5] + mat1[9] * mat2[6] + mat1[13] * mat2[7];
		mat[6] = mat1[2] * mat2[4] + mat1[6] * mat2[5] + mat1[10] * mat2[6] + mat1[14] * mat2[7];
		mat[7] = mat1[3] * mat2[4] + mat1[7] * mat2[5] + mat1[11] * mat2[6] + mat1[15] * mat2[7];

		mat[8] = mat1[0] * mat2[8] + mat1[4] * mat2[9] + mat1[8] * mat2[10] + mat1[12] * mat2[11];
		mat[9] = mat1[1] * mat2[8] + mat1[5] * mat2[9] + mat1[9] * mat2[10] + mat1[13] * mat2[11];
		mat[10] = mat1[2] * mat2[8] + mat1[6] * mat2[9] + mat1[10] * mat2[10] + mat1[14] * mat2[11];
		mat[11] = mat1[3] * mat2[8] + mat1[7] * mat2[9] + mat1[11] * mat2[10] + mat1[15] * mat2[11];

		mat[12] = mat1[0] * mat2[12] + mat1[4] * mat2[13] + mat1[8] * mat2[14] + mat1[12] * mat2[15];
		mat[13] = mat1[1] * mat2[12] + mat1[5] * mat2[13] + mat1[9] * mat2[14] + mat1[13] * mat2[15];
		mat[14] = mat1[2] * mat2[12] + mat1[6] * mat2[13] + mat1[10] * mat2[14] + mat1[14] * mat2[15];
		mat[15] = mat1[3] * mat2[12] + mat1[7] * mat2[13] + mat1[11] * mat2[14] + mat1[15] * mat2[15];

		return mat;
	};

	module.rotate = function(mat, angle, vec) {
		var tmat = module.getIdentityMat44();

		var x = vec[0],
			y = vec[1],
			z = vec[2];

		var c = Math.cos(angle),
			s = Math.sin(angle);

		var oneMinusCos = 1.0 - c;

		tmat[0] = x * x * oneMinusCos + c;
		tmat[1] = x * y * oneMinusCos + z * s;
		tmat[2] = x * z * oneMinusCos - y * s;
		//tmat[3] = 0.0;

		tmat[4] = y * x * oneMinusCos - z * s;
		tmat[5] = y * y * oneMinusCos + c;
		tmat[6] = y * z * oneMinusCos + x * s;
		//tmat[7] = 0.0;

		tmat[8] = z * x * oneMinusCos + y * s;
		tmat[9] = z * y * oneMinusCos - x * s;
		tmat[10] = z * z * oneMinusCos + c;
		//tmat[11] = 0.0;

		//tmat[12] = 0.0;
		//tmat[13] = 0.0;
		//tmat[14] = 0.0;
		//tmat[15] = 1.0;

        if (mat == null) {
            return tmat;
        }
        else {
            return module.mat44Multiply(mat, tmat);
        }
	};

	module.translate = function(mat, vec) {
		var tmat = module.getIdentityMat44();

		tmat[12] = vec[0];
		tmat[13] = vec[1];
		tmat[14] = vec[2];

		return module.mat44Multiply(mat, tmat);
	};

	module.scale = function(mat, vec) {
		var tmat = module.getIdentityMat44();

		tmat[0] = vec[0];
		tmat[5] = vec[1];
		tmat[10] = vec[2];

		return module.mat44Multiply(mat, tmat);
	};

	module.getOrthoMatrix = function(l, r, b, t, n, f) {
		var mat = module.getIdentityMat44();

		mat[0] = 2 / (r - l);
		mat[5] = 2 / (t - b);
		mat[10] = 2 / (n - f);
		mat[12] = -(r + l) / (r - l);
		mat[13] = -(t + b) / (t - b);
		mat[14] = -(f + n) / (f - n);
		//mat[15] = 1;

		return mat;
	};

	return module;
})();
