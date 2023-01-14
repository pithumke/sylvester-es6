"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mht = mht;
exports.makeLookAt = makeLookAt;
exports.makeOrtho = makeOrtho;
exports.makePerspective = makePerspective;
exports.makeFrustum = makeFrustum;

var _Vector = require("./Vector");

var _Matrix = require("./Matrix");

//From glUtils.js
function mht(m) {
    var s = "";
    if (m.length == 16) {
        for (var i = 0; i < 4; i++) {
            s += "<span style='font-family: monospace'>[" + m[i * 4 + 0].toFixed(4) + "," + m[i * 4 + 1].toFixed(4) + "," + m[i * 4 + 2].toFixed(4) + "," + m[i * 4 + 3].toFixed(4) + "]</span><br>";
        }
    } else if (m.length == 9) {
        for (var i = 0; i < 3; i++) {
            s += "<span style='font-family: monospace'>[" + m[i * 3 + 0].toFixed(4) + "," + m[i * 3 + 1].toFixed(4) + "," + m[i * 3 + 2].toFixed(4) + "]</font><br>";
        }
    } else {
        return m.toString();
    }
    return s;
}

//From glUtils.js
//
// gluLookAt
//
function makeLookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz) {
    var eye = new _Vector.Vector([ex, ey, ez]);
    var center = new _Vector.Vector([cx, cy, cz]);
    var up = new _Vector.Vector([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = new _Matrix.Matrix([[x.e(1), x.e(2), x.e(3), 0], [y.e(1), y.e(2), y.e(3), 0], [z.e(1), z.e(2), z.e(3), 0], [0, 0, 0, 1]]);

    var t = new _Matrix.Matrix([[1, 0, 0, -ex], [0, 1, 0, -ey], [0, 0, 1, -ez], [0, 0, 0, 1]]);
    return m.x(t);
}

//From glUtils.js
//
// glOrtho
//
function makeOrtho(left, right, bottom, top, znear, zfar) {
    var tx = -(right + left) / (right - left);
    var ty = -(top + bottom) / (top - bottom);
    var tz = -(zfar + znear) / (zfar - znear);

    return new _Matrix.Matrix([[2 / (right - left), 0, 0, tx], [0, 2 / (top - bottom), 0, ty], [0, 0, -2 / (zfar - znear), tz], [0, 0, 0, 1]]);
}

//From glUtils.js
//
// gluPerspective
//
function makePerspective(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return makeFrustum(xmin, xmax, ymin, ymax, znear, zfar);
}

//From glUtils.js
//
// glFrustum
//
function makeFrustum(left, right, bottom, top, znear, zfar) {
    var X = 2 * znear / (right - left);
    var Y = 2 * znear / (top - bottom);
    var A = (right + left) / (right - left);
    var B = (top + bottom) / (top - bottom);
    var C = -(zfar + znear) / (zfar - znear);
    var D = -2 * zfar * znear / (zfar - znear);

    return new _Matrix.Matrix([[X, 0, A, 0], [0, Y, B, 0], [0, 0, C, D], [0, 0, -1, 0]]);
}
