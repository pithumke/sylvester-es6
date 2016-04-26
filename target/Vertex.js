"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Vertex = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Vector2 = require("./Vector");

var _PRECISION = require("./PRECISION");

var _Polygon = require("./Polygon");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Vertex = exports.Vertex = function (_Vector) {
    _inherits(Vertex, _Vector);

    function Vertex(point) {
        _classCallCheck(this, Vertex);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Vertex).call(this, point));

        _this.setElements(point);
        if (_this.elements.length === 2) {
            _this.elements.push(0);
        }
        if (_this.elements.length !== 3) {
            var _ret;

            return _ret = null, _possibleConstructorReturn(_this, _ret);
        }
        return _this;
    }

    // Returns true iff the vertex's internal angle is 0 <= x < 180
    // in the context of the given polygon object. Returns null if the
    // vertex does not exist in the polygon.


    _createClass(Vertex, [{
        key: "isConvex",
        value: function isConvex(polygon) {
            var node = polygon.nodeFor(this);
            if (node === null) {
                return null;
            }
            var prev = node.prev.data,
                next = node.next.data;
            var A = next.subtract(this);
            var B = prev.subtract(this);
            var theta = A.angleFrom(B);
            if (theta <= _PRECISION.PRECISION) {
                return true;
            }
            if (Math.abs(theta - Math.PI) <= _PRECISION.PRECISION) {
                return false;
            }
            return A.cross(B).dot(polygon.plane.normal) > 0;
        }

        // Returns true iff the vertex's internal angle is 180 <= x < 360

    }, {
        key: "isReflex",
        value: function isReflex(polygon) {
            var result = this.isConvex(polygon);
            return result === null ? null : !result;
        }
    }, {
        key: "type",
        value: function type(polygon) {
            var result = this.isConvex(polygon);
            return result === null ? null : result ? 'convex' : 'reflex';
        }
    }]);

    return Vertex;
}(_Vector2.Vector);

// Method for converting a set of arrays/vectors/whatever to a set of Vertex objects


Vertex.convert = function (points) {
    var pointSet = points.toArray ? points.toArray() : points;
    var list = [],
        n = pointSet.length;
    for (var i = 0; i < n; i++) {
        list.push(new Vertex(pointSet[i]));
    }
    return list;
};
//# sourceMappingURL=Vertex.js.map
