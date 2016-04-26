"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedList = exports.LinkedList = function () {
    function LinkedList() {
        _classCallCheck(this, LinkedList);

        this.length = 0;
        this.first = null;
        this.last = null;
    }

    _createClass(LinkedList, [{
        key: "forEach",
        value: function forEach(fn, context) {
            var node = this.first,
                n = this.length;
            for (var i = 0; i < n; i++) {
                fn.call(context, node, i);
                node = node.next;
            }
        }
    }, {
        key: "at",
        value: function at(i) {
            if (!(i >= 0 && i < this.length)) {
                return null;
            }
            var node = this.first;
            while (i--) {
                node = node.next;
            }
            return node;
        }
    }, {
        key: "randomNode",
        value: function randomNode() {
            var n = Math.floor(Math.random() * this.length);
            return this.at(n);
        }
    }, {
        key: "toArray",
        value: function toArray() {
            var arr = [],
                node = this.first,
                n = this.length;
            while (n--) {
                arr.push(node.data || node);
                node = node.next;
            }
            return arr;
        }
    }]);

    return LinkedList;
}();

LinkedList.prototype.each = LinkedList.prototype.forEach;
//# sourceMappingURL=LinkedList.js.map
