"use strict";

export class LinkedList
{
    constructor ()
    {
        this.length= 0;
        this.first= null;
        this.last= null;
    }

    forEach (fn, context)
    {
        var node = this.first, n = this.length;
        for (var i = 0; i < n; i++)
        {
            fn.call(context, node, i);
            node = node.next;
        }
    }

    at (i)
    {
        if (!(i >= 0 && i < this.length))
        {
            return null;
        }
        var node = this.first;
        while (i--)
        {
            node = node.next;
        }
        return node;
    }

    randomNode ()
    {
        var n = Math.floor(Math.random() * this.length);
        return this.at(n);
    }

    toArray ()
    {
        var arr = [], node = this.first, n = this.length;
        while (n--)
        {
            arr.push(node.data || node);
            node = node.next;
        }
        return arr;
    }
}

LinkedList.prototype.each = LinkedList.prototype.forEach;