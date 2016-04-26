"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Polygon = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LinkedList = require("./LinkedList");

var _PRECISION = require("./PRECISION");

var _Matrix = require("./Matrix");

var _Vector = require("./Vector");

var _Plane = require("./Plane");

var _Line = require("./Line");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = exports.Polygon = function () {
    function Polygon(points, plane) {
        _classCallCheck(this, Polygon);

        this.setVertices(points, plane);
    }

    _createClass(Polygon, [{
        key: "v",
        value: function v(i) {
            return this.vertices.at(i - 1).data;
        }
    }, {
        key: "nodeFor",
        value: function nodeFor(vertex) {
            return this.vertices.withData(vertex);
        }
    }, {
        key: "dup",
        value: function dup() {
            return new Polygon(this.vertices, this.plane);
        }
    }, {
        key: "translate",
        value: function translate(vector) {
            var P = vector.elements || vector;
            this.vertices.each(function (node) {
                var E = node.data.elements;
                node.data.setElements([E[0] + P[0], E[1] + P[1], E[2] + (P[2] || 0)]);
            });
            this.plane = this.plane.translate(vector);
            this.updateTrianglePlanes(function (plane) {
                return plane.translate(vector);
            });
            return this;
        }
    }, {
        key: "rotate",
        value: function rotate(t, line) {
            var R = _Matrix.Matrix.Rotation(t, line.direction);
            this.vertices.each(function (node) {
                node.data.setElements(node.data.rotate(R, line).elements);
            });
            this.plane = this.plane.rotate(R, line);
            this.updateTrianglePlanes(function (plane) {
                return plane.rotate(R, line);
            });
            return this;
        }
    }, {
        key: "scale",
        value: function scale(k, point) {
            var P = point.elements || point;
            this.vertices.each(function (node) {
                var E = node.data.elements;
                node.data.setElements([P[0] + k * (E[0] - P[0]), P[1] + k * (E[1] - P[1]), (P[2] || 0) + k * (E[2] - (P[2] || 0))]);
            });
            var anchor = this.vertices.first.data;
            this.plane.anchor.setElements(anchor);
            this.updateTrianglePlanes(function (plane) {
                return new _Plane.Plane(anchor, plane.normal);
            });
            return this;
        }

        // Updates the plane properties of all the cached triangles belonging to the
        // polygon according to the given function. For example, suppose you just
        // rotated the polygon, you should call:
        //
        //   poly.updateTrianglePlanes(function(plane) { return plane.rotate(t, line); });
        //
        // This method is called automatically by Polygon.translate,
        // Polygon.rotate and Polygon.scale transformation methods.

    }, {
        key: "updateTrianglePlanes",
        value: function updateTrianglePlanes(fn) {
            var i;
            if (this.cached.triangles !== null) {
                i = this.cached.triangles.length;
                while (i--) {
                    this.cached.triangles[i].plane = fn(this.cached.triangles[i].plane);
                }
            }
            if (this.cached.surfaceIntegralElements !== null) {
                i = this.cached.surfaceIntegralElements.length;
                while (i--) {
                    this.cached.surfaceIntegralElements[i].plane = fn(this.cached.surfaceIntegralElements[i].plane);
                }
            }
        }
    }, {
        key: "isTriangle",
        value: function isTriangle() {
            return this.vertices.length === 3;
        }

        // Returns a collection of triangles used for calculating area and center of
        // mass. Some of the triangles will not lie inside the polygon - this
        // collection is essentially a series of itervals in a surface integral, so
        // some are 'negative'. If you want the polygon broken into constituent
        // triangles, use toTriangles(). This method is used because it's much faster
        // than toTriangles().
        //
        // The triangles generated share vertices with the original polygon, so they
        // transform with the polygon. They are cached after first calculation and
        // should remain in sync with changes to the parent polygon.

    }, {
        key: "trianglesForSurfaceIntegral",
        value: function trianglesForSurfaceIntegral() {
            if (this.cached.surfaceIntegralElements !== null) {
                return this.cached.surfaceIntegralElements;
            }
            var triangles = [];
            var firstVertex = this.vertices.first.data;
            var plane = this.plane;
            this.vertices.each(function (node, i) {
                if (i < 2) {
                    return;
                }
                var points = [firstVertex, node.prev.data, node.data];
                // If the vertices lie on a straigh line, give the polygon's own plane. If
                // the element has no area, it doesn't matter which way its normal faces.
                triangles.push(new Polygon(points, _Plane.Plane.fromPoints(points) || plane));
            });
            return this.setCache('surfaceIntegralElements', triangles);
        }
    }, {
        key: "area",
        value: function area() {
            if (this.isTriangle()) {
                // Area is half the modulus of the cross product of two sides
                var A = this.vertices.first,
                    B = A.next,
                    C = B.next;
                A = A.data.elements;B = B.data.elements;C = C.data.elements;
                return 0.5 * new _Vector.Vector([(A[1] - B[1]) * (C[2] - B[2]) - (A[2] - B[2]) * (C[1] - B[1]), (A[2] - B[2]) * (C[0] - B[0]) - (A[0] - B[0]) * (C[2] - B[2]), (A[0] - B[0]) * (C[1] - B[1]) - (A[1] - B[1]) * (C[0] - B[0])]).modulus();
            } else {
                var trigs = this.trianglesForSurfaceIntegral(),
                    area = 0;
                var i = trigs.length;
                while (i--) {
                    area += trigs[i].area() * trigs[i].plane.normal.dot(this.plane.normal);
                }
                return area;
            }
        }
    }, {
        key: "centroid",
        value: function centroid() {
            if (this.isTriangle()) {
                var A = this.v(1).elements,
                    B = this.v(2).elements,
                    C = this.v(3).elements;
                return new _Vector.Vector([(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3]);
            } else {
                var A,
                    M = 0,
                    V = _Vector.Vector.Zero(3),
                    P,
                    C,
                    trigs = this.trianglesForSurfaceIntegral();
                var i = trigs.length;
                while (i--) {
                    A = trigs[i].area() * trigs[i].plane.normal.dot(this.plane.normal);
                    M += A;
                    P = V.elements;
                    C = trigs[i].centroid().elements;
                    V.setElements([P[0] + C[0] * A, P[1] + C[1] * A, P[2] + C[2] * A]);
                }
                return V.x(1 / M);
            }
        }
    }, {
        key: "projectionOn",
        value: function projectionOn(plane) {
            var points = [];
            this.vertices.each(function (node) {
                points.push(plane.pointClosestTo(node.data));
            });
            return new Polygon(points);
        }
    }, {
        key: "removeVertex",
        value: function removeVertex(vertex) {
            if (this.isTriangle()) {
                return;
            }
            var node = this.nodeFor(vertex);
            if (node === null) {
                return null;
            }
            this.clearCache();
            // Previous and next entries in the main vertex list
            var prev = node.prev,
                next = node.next;
            var prevWasConvex = prev.data.isConvex(this);
            var nextWasConvex = next.data.isConvex(this);
            if (node.data.isConvex(this)) {
                this.convexVertices.remove(this.convexVertices.withData(node.data));
            } else {
                this.reflexVertices.remove(this.reflexVertices.withData(node.data));
            }
            this.vertices.remove(node);
            // Deal with previous vertex's change of class
            if (prevWasConvex !== prev.data.isConvex(this)) {
                if (prevWasConvex) {
                    this.convexVertices.remove(this.convexVertices.withData(prev.data));
                    this.reflexVertices.append(new _LinkedList.LinkedList.Node(prev.data));
                } else {
                    this.reflexVertices.remove(this.reflexVertices.withData(prev.data));
                    this.convexVertices.append(new _LinkedList.LinkedList.Node(prev.data));
                }
            }
            // Deal with next vertex's change of class
            if (nextWasConvex !== next.data.isConvex(this)) {
                if (nextWasConvex) {
                    this.convexVertices.remove(this.convexVertices.withData(next.data));
                    this.reflexVertices.append(new _LinkedList.LinkedList.Node(next.data));
                } else {
                    this.reflexVertices.remove(this.reflexVertices.withData(next.data));
                    this.convexVertices.append(new _LinkedList.LinkedList.Node(next.data));
                }
            }
            return this;
        }
    }, {
        key: "contains",
        value: function contains(point) {
            return this.containsByWindingNumber(point);
        }
    }, {
        key: "containsByWindingNumber",
        value: function containsByWindingNumber(point) {
            var P = point.elements || point;
            if (!this.plane.contains(P)) {
                return false;
            }
            if (this.hasEdgeContaining(P)) {
                return false;
            }
            var V,
                W,
                A,
                B,
                theta = 0,
                dt,
                loops = 0,
                self = this;
            this.vertices.each(function (node) {
                V = node.data.elements;
                W = node.next.data.elements;
                A = new _Vector.Vector([V[0] - P[0], V[1] - P[1], V[2] - (P[2] || 0)]);
                B = new _Vector.Vector([W[0] - P[0], W[1] - P[1], W[2] - (P[2] || 0)]);
                dt = A.angleFrom(B);
                if (dt === null || dt === 0) {
                    return;
                }
                theta += (A.cross(B).isParallelTo(self.plane.normal) ? 1 : -1) * dt;
                if (theta >= 2 * Math.PI - _PRECISION.PRECISION) {
                    loops++;theta -= 2 * Math.PI;
                }
                if (theta <= -2 * Math.PI + _PRECISION.PRECISION) {
                    loops--;theta += 2 * Math.PI;
                }
            });
            return loops !== 0;
        }
    }, {
        key: "hasEdgeContaining",
        value: function hasEdgeContaining(point) {
            var P = point.elements || point;
            var success = false;
            this.vertices.each(function (node) {
                if (_Line.Line.Segment.create(node.data, node.next.data).contains(P)) {
                    success = true;
                }
            });
            return success;
        }
    }, {
        key: "toTriangles",
        value: function toTriangles() {
            if (this.cached.triangles !== null) {
                return this.cached.triangles;
            }
            return this.setCache('triangles', this.triangulateByEarClipping());
        }

        // Implementation of ear clipping algorithm
        // Found in 'Triangulation by ear clipping', by David Eberly
        // at http://www.geometrictools.com
        // This will not deal with overlapping sections - contruct your polygons
        // sensibly

    }, {
        key: "triangulateByEarClipping",
        value: function triangulateByEarClipping() {
            var poly = this.dup(),
                triangles = [],
                success,
                convexNode,
                mainNode,
                trig;
            while (!poly.isTriangle()) {
                success = false;
                while (!success) {
                    success = true;
                    // Ear tips must be convex vertices - let's pick one at random
                    convexNode = poly.convexVertices.randomNode();
                    mainNode = poly.vertices.withData(convexNode.data);
                    // For convex vertices, this order will always be anticlockwise
                    trig = new Polygon([mainNode.data, mainNode.next.data, mainNode.prev.data], this.plane);
                    // Now test whether any reflex vertices lie within the ear
                    poly.reflexVertices.each(function (node) {
                        // Don't test points belonging to this triangle. node won't be equal
                        // to convexNode as node is reflex and vertex is convex.
                        if (node.data !== mainNode.prev.data && node.data !== mainNode.next.data) {
                            if (trig.contains(node.data) || trig.hasEdgeContaining(node.data)) {
                                success = false;
                            }
                        }
                    });
                }
                triangles.push(trig);
                poly.removeVertex(mainNode.data);
            }
            // Need to do this to renumber the remaining vertices
            triangles.push(new Polygon(poly.vertices, this.plane));
            return triangles;
        }
    }, {
        key: "setVertices",
        value: function setVertices(points, plane) {
            var pointSet = points.toArray ? points.toArray() : points;
            this.plane = plane && plane.normal ? plane.dup() : _Plane.Plane.fromPoints(pointSet);
            if (this.plane === null) {
                return null;
            }
            this.vertices = new _LinkedList.LinkedList.Circular();
            // Construct linked list of vertices. If each point is already a polygon
            // vertex, we reference it rather than creating a new vertex.
            var i = pointSet.length,
                newVertex;
            while (i--) {
                newVertex = pointSet[i].isConvex ? pointSet[i] : new Polygon.Vertex(pointSet[i]);
                this.vertices.prepend(new _LinkedList.LinkedList.Node(newVertex));
            }
            this.clearCache();
            this.populateVertexTypeLists();
            return this;
        }
    }, {
        key: "populateVertexTypeLists",
        value: function populateVertexTypeLists() {
            this.convexVertices = new _LinkedList.LinkedList.Circular();
            this.reflexVertices = new _LinkedList.LinkedList.Circular();
            var self = this;
            this.vertices.each(function (node) {
                // Split vertices into convex / reflex groups. The
                // LinkedList.Node class wraps each vertex so it can belong to
                // many linked lists.
                self[node.data.type(self) + 'Vertices'].append(new _LinkedList.LinkedList.Node(node.data));
            });
        }
    }, {
        key: "copyVertices",
        value: function copyVertices() {
            this.clearCache();
            this.vertices.each(function (node) {
                node.data = new Polygon.Vertex(node.data);
            });
            this.populateVertexTypeLists();
        }
    }, {
        key: "clearCache",
        value: function clearCache() {
            this.cached = {
                triangles: null,
                surfaceIntegralElements: null
            };
        }
    }, {
        key: "setCache",
        value: function setCache(key, value) {
            this.cached[key] = value;
            return value;
        }
    }, {
        key: "inspect",
        value: function inspect() {
            var points = [];
            this.vertices.each(function (node) {
                points.push(node.data.inspect());
            });
            return points.join(' -> ');
        }
    }]);

    return Polygon;
}();
//# sourceMappingURL=Polygon.js.map
