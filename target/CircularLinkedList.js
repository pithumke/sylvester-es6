"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CircularLinkedList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _LinkedList2 = require("./LinkedList");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CircularLinkedList = exports.CircularLinkedList = function (_LinkedList) {
    _inherits(CircularLinkedList, _LinkedList);

    function CircularLinkedList() {
        _classCallCheck(this, CircularLinkedList);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CircularLinkedList).apply(this, arguments));
    }

    _createClass(CircularLinkedList, [{
        key: "append",
        value: function append(node) {
            if (this.first === null) {
                node.prev = node;
                node.next = node;
                this.first = node;
                this.last = node;
            } else {
                node.prev = this.last;
                node.next = this.first;
                this.first.prev = node;
                this.last.next = node;
                this.last = node;
            }
            this.length++;
        }
    }, {
        key: "prepend",
        value: function prepend(node) {
            if (this.first === null) {
                this.append(node);
                return;
            } else {
                node.prev = this.last;
                node.next = this.first;
                this.first.prev = node;
                this.last.next = node;
                this.first = node;
            }
            this.length++;
        }
    }, {
        key: "insertAfter",
        value: function insertAfter(node, newNode) {
            newNode.prev = node;
            newNode.next = node.next;
            node.next.prev = newNode;
            node.next = newNode;
            if (newNode.prev === this.last) {
                this.last = newNode;
            }
            this.length++;
        }
    }, {
        key: "insertBefore",
        value: function insertBefore(node, newNode) {
            newNode.prev = node.prev;
            newNode.next = node;
            node.prev.next = newNode;
            node.prev = newNode;
            if (newNode.next === this.first) {
                this.first = newNode;
            }
            this.length++;
        }
    }, {
        key: "remove",
        value: function remove(node) {
            if (this.length > 1) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
                if (node === this.first) {
                    this.first = node.next;
                }
                if (node === this.last) {
                    this.last = node.prev;
                }
            } else {
                this.first = null;
                this.last = null;
            }
            node.prev = null;
            node.next = null;
            this.length--;
        }
    }, {
        key: "withData",
        value: function withData(data) {
            var nodeFromStart = this.first,
                nodeFromEnd = this.last,
                n = Math.ceil(this.length / 2);
            while (n--) {
                if (nodeFromStart.data === data) {
                    return nodeFromStart;
                }
                if (nodeFromEnd.data === data) {
                    return nodeFromEnd;
                }
                nodeFromStart = nodeFromStart.next;
                nodeFromEnd = nodeFromEnd.prev;
            }
            return null;
        }
    }]);

    return CircularLinkedList;
}(_LinkedList2.LinkedList);

;

CircularLinkedList.fromArray = function (list, useNodes) {
    var linked = new CircularLinkedList();
    var n = list.length;
    while (n--) {
        linked.prepend(useNodes ? new _LinkedList2.LinkedList.Node(list[n]) : list[n]);
    }
    return linked;
};
//# sourceMappingURL=CircularLinkedList.js.map
