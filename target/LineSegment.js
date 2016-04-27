"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LineSegment = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector = require("./Vector");

var _Plane = require("./Plane");

var _Line = require("./Line");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LineSegment = exports.LineSegment = function () {
    function LineSegment(v1, v2) {
        _classCallCheck(this, LineSegment);

        this.setPoints(v1, v2);
    }

    _createClass(LineSegment, [{
        key: "eql",
        value: function eql(segment) {
            return this.start.eql(segment.start) && this.end.eql(segment.end) || this.start.eql(segment.end) && this.end.eql(segment.start);
        }
    }, {
        key: "dup",
        value: function dup() {
            return new LineSegment(this.start, this.end);
        }
    }, {
        key: "length",
        value: function length() {
            var A = this.start.elements,
                B = this.end.elements;
            var C1 = B[0] - A[0],
                C2 = B[1] - A[1],
                C3 = B[2] - A[2];
            return Math.sqrt(C1 * C1 + C2 * C2 + C3 * C3);
        }
    }, {
        key: "toVector",
        value: function toVector() {
            var A = this.start.elements,
                B = this.end.elements;
            return new _Vector.Vector([B[0] - A[0], B[1] - A[1], B[2] - A[2]]);
        }
    }, {
        key: "midpoint",
        value: function midpoint() {
            var A = this.start.elements,
                B = this.end.elements;
            return new _Vector.Vector([(B[0] + A[0]) / 2, (B[1] + A[1]) / 2, (B[2] + A[2]) / 2]);
        }
    }, {
        key: "bisectingPlane",
        value: function bisectingPlane() {
            return new _Plane.Plane(this.midpoint(), this.toVector());
        }
    }, {
        key: "translate",
        value: function translate(vector) {
            var V = vector.elements || vector;
            var S = this.start.elements,
                E = this.end.elements;
            return new LineSegment([S[0] + V[0], S[1] + V[1], S[2] + (V[2] || 0)], [E[0] + V[0], E[1] + V[1], E[2] + (V[2] || 0)]);
        }
    }, {
        key: "isParallelTo",
        value: function isParallelTo(obj) {
            return this.line.isParallelTo(obj);
        }
    }, {
        key: "distanceFrom",
        value: function distanceFrom(obj) {
            var P = this.pointClosestTo(obj);
            return P === null ? null : P.distanceFrom(obj);
        }
    }, {
        key: "contains",
        value: function contains(obj) {
            if (obj.start && obj.end) {
                return this.contains(obj.start) && this.contains(obj.end);
            }
            var P = (obj.elements || obj).slice();
            if (P.length === 2) {
                P.push(0);
            }
            if (this.start.eql(P)) {
                return true;
            }
            var S = this.start.elements;
            var V = new _Vector.Vector([S[0] - P[0], S[1] - P[1], S[2] - (P[2] || 0)]);
            var vect = this.toVector();
            return V.isAntiparallelTo(vect) && V.modulus() <= vect.modulus();
        }
    }, {
        key: "intersects",
        value: function intersects(obj) {
            return this.intersectionWith(obj) !== null;
        }
    }, {
        key: "intersectionWith",
        value: function intersectionWith(obj) {
            if (!this.line.intersects(obj)) {
                return null;
            }
            var P = this.line.intersectionWith(obj);
            return this.contains(P) ? P : null;
        }
    }, {
        key: "pointClosestTo",
        value: function pointClosestTo(obj) {
            if (obj.normal) {
                // obj is a plane
                var V = this.line.intersectionWith(obj);
                if (V === null) {
                    return null;
                }
                return this.pointClosestTo(V);
            } else {
                // obj is a line (segment) or point
                var P = this.line.pointClosestTo(obj);
                if (P === null) {
                    return null;
                }
                if (this.contains(P)) {
                    return P;
                }
                return (this.line.positionOf(P) < 0 ? this.start : this.end).dup();
            }
        }
    }, {
        key: "setPoints",
        value: function setPoints(startPoint, endPoint) {
            startPoint = new _Vector.Vector(startPoint).to3D();
            endPoint = new _Vector.Vector(endPoint).to3D();
            if (startPoint === null || endPoint === null) {
                return null;
            }
            this.line = new _Line.Line(startPoint, endPoint.subtract(startPoint));
            this.start = startPoint;
            this.end = endPoint;
            return this;
        }
    }]);

    return LineSegment;
}();
//# sourceMappingURL=LineSegment.js.map
