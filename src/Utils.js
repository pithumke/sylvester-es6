"use strict";

import { Vector } from "./Vector";
import { Matrix } from "./Matrix";

//From glUtils.js
export function mht(m)
{
    var s = "";
    if (m.length == 16)
    {
        for (var i = 0; i < 4; i++)
        {
            s += "<span style='font-family: monospace'>[" + m[i*4+0].toFixed(4) + "," + m[i*4+1].toFixed(4) + "," + m[i*4+2].toFixed(4) + "," + m[i*4+3].toFixed(4) + "]</span><br>";
        }
    }
    else if (m.length == 9)
    {
        for (var i = 0; i < 3; i++)
        {
            s += "<span style='font-family: monospace'>[" + m[i*3+0].toFixed(4) + "," + m[i*3+1].toFixed(4) + "," + m[i*3+2].toFixed(4) + "]</font><br>";
        }
    }
    else
    {
        return m.toString();
    }
    return s;
}

//From glUtils.js
//
// gluLookAt
//
export function makeLookAt(ex, ey, ez,
                           cx, cy, cz,
                           ux, uy, uz)
{
    var eye = new Vector([ex, ey, ez]);
    var center = new Vector([cx, cy, cz]);
    var up = new Vector([ux, uy, uz]);

    var mag;

    var z = eye.subtract(center).toUnitVector();
    var x = up.cross(z).toUnitVector();
    var y = z.cross(x).toUnitVector();

    var m = new Matrix([
                [x.e(1), x.e(2), x.e(3), 0],
                [y.e(1), y.e(2), y.e(3), 0],
                [z.e(1), z.e(2), z.e(3), 0],
                [0, 0, 0, 1]
    ]);

    var t = new Matrix([
                [1, 0, 0, -ex],
                [0, 1, 0, -ey],
                [0, 0, 1, -ez],
                [0, 0, 0, 1]
    ]);
    return m.x(t);
}

//From glUtils.js
//
// glOrtho
//
export function makeOrtho(left, right,
                          bottom, top,
                          znear, zfar)
{
    var tx = -(right+left)/(right-left);
    var ty = -(top+bottom)/(top-bottom);
    var tz = -(zfar+znear)/(zfar-znear);

    return new Matrix([
                [2/(right-left), 0, 0, tx],
                [0, 2/(top-bottom), 0, ty],
                [0, 0, -2/(zfar-znear), tz],
                [0, 0, 0, 1]
    ]);
}

//From glUtils.js
//
// gluPerspective
//
export function makePerspective(fovy, aspect, znear, zfar)
{
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
export function makeFrustum(left, right,
                     bottom, top,
                     znear, zfar)
{
    var X = 2*znear/(right-left);
    var Y = 2*znear/(top-bottom);
    var A = (right+left)/(right-left);
    var B = (top+bottom)/(top-bottom);
    var C = -(zfar+znear)/(zfar-znear);
    var D = -2*zfar*znear/(zfar-znear);

    return new Matrix([
                [X, 0, A, 0],
                [0, Y, B, 0],
                [0, 0, C, D],
                [0, 0, -1, 0]
    ]);
}

//From glUtils.js
//
// glOrtho
//
export function makeOrtho(left, right, bottom, top, znear, zfar)
{
    var tx = - (right + left) / (right - left);
    var ty = - (top + bottom) / (top - bottom);
    var tz = - (zfar + znear) / (zfar - znear);

    return new Matrix([
            [2 / (right - left), 0, 0, tx],
            [0, 2 / (top - bottom), 0, ty],
            [0, 0, -2 / (zfar - znear), tz],
            [0, 0, 0, 1]
    ]);
}