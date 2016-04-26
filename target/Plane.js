"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Plane = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PRECISION = require("./PRECISION");

var _Matrix = require("./Matrix");

var _Vector = require("./Vector");

var _Line = require("./Line");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plane = exports.Plane = function () {
    function Plane(anchor, v1, v2) {
        _classCallCheck(this, Plane);

        this.setVectors(anchor, v1, v2);
    }

    _createClass(Plane, [{
        key: "eql",
        value: function eql(plane) {
            return this.contains(plane.anchor) && this.isParallelTo(plane);
        }
    }, {
        key: "dup",
        value: function dup() {
            return new Plane(this.anchor, this.normal);
        }
    }, {
        key: "translate",
        value: function translate(vector) {
            var V = vector.elements || vector;
            return new Plane([this.anchor.elements[0] + V[0], this.anchor.elements[1] + V[1], this.anchor.elements[2] + (V[2] || 0)], this.normal);
        }
    }, {
        key: "isParallelTo",
        value: function isParallelTo(obj) {
            var theta;
            if (obj.normal) {
                // obj is a plane
                theta = this.normal.angleFrom(obj.normal);
                return Math.abs(theta) <= _PRECISION.PRECISION || Math.abs(Math.PI - theta) <= _PRECISION.PRECISION;
            } else if (obj.direction) {
                // obj is a line
                return this.normal.isPerpendicularTo(obj.direction);
            }
            return null;
        }
    }, {
        key: "isPerpendicularTo",
        value: function isPerpendicularTo(plane) {
            var theta = this.normal.angleFrom(plane.normal);
            return Math.abs(Math.PI / 2 - theta) <= _PRECISION.PRECISION;
        }
    }, {
        key: "distanceFrom",
        value: function distanceFrom(obj) {
            if (this.intersects(obj) || this.contains(obj)) {
                return 0;
            }
            if (obj.anchor) {
                // obj is a plane or line
                var A = this.anchor.elements,
                    B = obj.anchor.elements,
                    N = this.normal.elements;
                return Math.abs((A[0] - B[0]) * N[0] + (A[1] - B[1]) * N[1] + (A[2] - B[2]) * N[2]);
            } else {
                // obj is a point
                var P = obj.elements || obj;
                var A = this.anchor.elements,
                    N = this.normal.elements;
                return Math.abs((A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2]);
            }
        }
    }, {
        key: "contains",
        value: function contains(obj) {
            if (obj.normal) {
                return null;
            }
            if (obj.direction) {
                return this.contains(obj.anchor) && this.contains(obj.anchor.add(obj.direction));
            } else {
                var P = obj.elements || obj;
                var A = this.anchor.elements,
                    N = this.normal.elements;
                var diff = Math.abs(N[0] * (A[0] - P[0]) + N[1] * (A[1] - P[1]) + N[2] * (A[2] - (P[2] || 0)));
                return diff <= _PRECISION.PRECISION;
            }
        }
    }, {
        key: "intersects",
        value: function intersects(obj) {
            if (typeof obj.direction === 'undefined' && typeof obj.normal === 'undefined') {
                return null;
            }
            return !this.isParallelTo(obj);
        }
    }, {
        key: "intersectionWith",
        value: function intersectionWith(obj) {
            if (!this.intersects(obj)) {
                return null;
            }
            if (obj.direction) {
                // obj is a line
                var A = obj.anchor.elements,
                    D = obj.direction.elements,
                    P = this.anchor.elements,
                    N = this.normal.elements;
                var multiplier = (N[0] * (P[0] - A[0]) + N[1] * (P[1] - A[1]) + N[2] * (P[2] - A[2])) / (N[0] * D[0] + N[1] * D[1] + N[2] * D[2]);
                return new _Vector.Vector([A[0] + D[0] * multiplier, A[1] + D[1] * multiplier, A[2] + D[2] * multiplier]);
            } else if (obj.normal) {
                // obj is a plane
                var direction = this.normal.cross(obj.normal).toUnitVector();
                // To find an anchor point, we find one co-ordinate that has a value of
                // zero somewhere on the intersection, and remember which one we picked
                var N = this.normal.elements,
                    A = this.anchor.elements,
                    O = obj.normal.elements,
                    B = obj.anchor.elements;
                var solver = _Matrix.Matrix.Zero(2, 2),
                    i = 0;
                while (solver.isSingular()) {
                    i++;
                    solver = new _Matrix.Matrix([[N[i % 3], N[(i + 1) % 3]], [O[i % 3], O[(i + 1) % 3]]]);
                }
                // Then we solve the simultaneous equations in the remaining dimensions
                var inverse = solver.inverse().elements;
                var x = N[0] * A[0] + N[1] * A[1] + N[2] * A[2];
                var y = O[0] * B[0] + O[1] * B[1] + O[2] * B[2];
                var intersection = [inverse[0][0] * x + inverse[0][1] * y, inverse[1][0] * x + inverse[1][1] * y];
                var anchor = [];
                for (var j = 1; j <= 3; j++) {
                    // This formula picks the right element from intersection by cycling
                    // depending on which element we set to zero above
                    anchor.push(i === j ? 0 : intersection[(j + (5 - i) % 3) % 3]);
                }
                return new _Line.Line(anchor, direction);
            }
        }
    }, {
        key: "pointClosestTo",
        value: function pointClosestTo(point) {
            var P = point.elements || point;
            var A = this.anchor.elements,
                N = this.normal.elements;
            var dot = (A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2];
            return new _Vector.Vector([P[0] + N[0] * dot, P[1] + N[1] * dot, (P[2] || 0) + N[2] * dot]);
        }
    }, {
        key: "rotate",
        value: function rotate(t, line) {
            var R = t.determinant ? t.elements : _Matrix.Matrix.Rotation(t, line.direction).elements;
            var C = line.pointClosestTo(this.anchor).elements;
            var A = this.anchor.elements,
                N = this.normal.elements;
            var C1 = C[0],
                C2 = C[1],
                C3 = C[2],
                A1 = A[0],
                A2 = A[1],
                A3 = A[2];
            var x = A1 - C1,
                y = A2 - C2,
                z = A3 - C3;
            return new Plane([C1 + R[0][0] * x + R[0][1] * y + R[0][2] * z, C2 + R[1][0] * x + R[1][1] * y + R[1][2] * z, C3 + R[2][0] * x + R[2][1] * y + R[2][2] * z], [R[0][0] * N[0] + R[0][1] * N[1] + R[0][2] * N[2], R[1][0] * N[0] + R[1][1] * N[1] + R[1][2] * N[2], R[2][0] * N[0] + R[2][1] * N[1] + R[2][2] * N[2]]);
        }
    }, {
        key: "reflectionIn",
        value: function reflectionIn(obj) {
            if (obj.normal) {
                // obj is a plane
                var A = this.anchor.elements,
                    N = this.normal.elements;
                var A1 = A[0],
                    A2 = A[1],
                    A3 = A[2],
                    N1 = N[0],
                    N2 = N[1],
                    N3 = N[2];
                var newA = this.anchor.reflectionIn(obj).elements;
                // Add the plane's normal to its anchor, then mirror that in the other plane
                var AN1 = A1 + N1,
                    AN2 = A2 + N2,
                    AN3 = A3 + N3;
                var Q = obj.pointClosestTo([AN1, AN2, AN3]).elements;
                var newN = [Q[0] + (Q[0] - AN1) - newA[0], Q[1] + (Q[1] - AN2) - newA[1], Q[2] + (Q[2] - AN3) - newA[2]];
                return new Plane(newA, newN);
            } else if (obj.direction) {
                // obj is a line
                return this.rotate(Math.PI, obj);
            } else {
                // obj is a point
                var P = obj.elements || obj;
                return new Plane(this.anchor.reflectionIn([P[0], P[1], P[2] || 0]), this.normal);
            }
        }
    }, {
        key: "setVectors",
        value: function setVectors(anchor, v1, v2) {
            anchor = new _Vector.Vector(anchor);
            anchor = anchor.to3D();if (anchor === null) {
                return null;
            }
            v1 = new _Vector.Vector(v1);
            v1 = v1.to3D();if (v1 === null) {
                return null;
            }
            if (typeof v2 === 'undefined') {
                v2 = null;
            } else {
                v2 = new _Vector.Vector(v2);
                v2 = v2.to3D();
                if (v2 === null) {
                    return null;
                }
            }
            var A1 = anchor.elements[0],
                A2 = anchor.elements[1],
                A3 = anchor.elements[2];
            var v11 = v1.elements[0],
                v12 = v1.elements[1],
                v13 = v1.elements[2];
            var normal, mod;
            if (v2 !== null) {
                var v21 = v2.elements[0],
                    v22 = v2.elements[1],
                    v23 = v2.elements[2];
                normal = new _Vector.Vector([(v12 - A2) * (v23 - A3) - (v13 - A3) * (v22 - A2), (v13 - A3) * (v21 - A1) - (v11 - A1) * (v23 - A3), (v11 - A1) * (v22 - A2) - (v12 - A2) * (v21 - A1)]);
                mod = normal.modulus();
                if (mod === 0) {
                    return null;
                }
                normal = new _Vector.Vector([normal.elements[0] / mod, normal.elements[1] / mod, normal.elements[2] / mod]);
            } else {
                mod = Math.sqrt(v11 * v11 + v12 * v12 + v13 * v13);
                if (mod === 0) {
                    return null;
                }
                normal = new _Vector.Vector([v1.elements[0] / mod, v1.elements[1] / mod, v1.elements[2] / mod]);
            }
            this.anchor = anchor;
            this.normal = normal;
            return this;
        }
    }]);

    return Plane;
}();

Plane.XY = new Plane(_Vector.Vector.Zero(3), _Vector.Vector.k);
Plane.YZ = new Plane(_Vector.Vector.Zero(3), _Vector.Vector.i);
Plane.ZX = new Plane(_Vector.Vector.Zero(3), _Vector.Vector.j);
Plane.YX = Plane.XY;Plane.ZY = Plane.YZ;Plane.XZ = Plane.ZX;

Plane.fromPoints = function (points) {
    var np = points.length,
        list = [],
        i,
        P,
        n,
        N,
        A,
        B,
        C,
        D,
        theta,
        prevN,
        totalN = _Vector.Vector.Zero(3);
    for (i = 0; i < np; i++) {
        P = new _Vector.Vector(points[i]).to3D();
        if (P === null) {
            return null;
        }
        list.push(P);
        n = list.length;
        if (n > 2) {
            // Compute plane normal for the latest three points
            A = list[n - 1].elements;B = list[n - 2].elements;C = list[n - 3].elements;
            N = new _Vector.Vector([(A[1] - B[1]) * (C[2] - B[2]) - (A[2] - B[2]) * (C[1] - B[1]), (A[2] - B[2]) * (C[0] - B[0]) - (A[0] - B[0]) * (C[2] - B[2]), (A[0] - B[0]) * (C[1] - B[1]) - (A[1] - B[1]) * (C[0] - B[0])]).toUnitVector();
            if (n > 3) {
                // If the latest normal is not (anti)parallel to the previous one, we've
                // strayed off the plane. This might be a slightly long-winded way of
                // doing things, but we need the sum of all the normals to find which
                // way the plane normal should point so that the points form an
                // anticlockwise list.
                theta = N.angleFrom(prevN);
                if (theta !== null) {
                    if (!(Math.abs(theta) <= _PRECISION.PRECISION || Math.abs(theta - Math.PI) <= _PRECISION.PRECISION)) {
                        return null;
                    }
                }
            }
            totalN = totalN.add(N);
            prevN = N;
        }
    }
    // We need to add in the normals at the start and end points, which the above
    // misses out
    A = list[1].elements;B = list[0].elements;C = list[n - 1].elements;D = list[n - 2].elements;
    totalN = totalN.add(new _Vector.Vector([(A[1] - B[1]) * (C[2] - B[2]) - (A[2] - B[2]) * (C[1] - B[1]), (A[2] - B[2]) * (C[0] - B[0]) - (A[0] - B[0]) * (C[2] - B[2]), (A[0] - B[0]) * (C[1] - B[1]) - (A[1] - B[1]) * (C[0] - B[0])]).toUnitVector()).add(new _Vector.Vector([(B[1] - C[1]) * (D[2] - C[2]) - (B[2] - C[2]) * (D[1] - C[1]), (B[2] - C[2]) * (D[0] - C[0]) - (B[0] - C[0]) * (D[2] - C[2]), (B[0] - C[0]) * (D[1] - C[1]) - (B[1] - C[1]) * (D[0] - C[0])]).toUnitVector());
    return new Plane(list[0], totalN);
};
//# sourceMappingURL=Plane.js.map
