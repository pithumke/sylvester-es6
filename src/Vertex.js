"use strict";

import { Vector } from "./Vector";
import { PRECISION } from "./PRECISION";
import { Polygon } from "./Polygon";

export class Vertex extends Vector
{
    constructor (point)
    {
        super(point);
        this.setElements(point);
        if (this.elements.length === 2)
        {
            this.elements.push(0);
        }
        if (this.elements.length !== 3)
        {
            return null;
        }
    }

    // Returns true iff the vertex's internal angle is 0 <= x < 180
    // in the context of the given polygon object. Returns null if the
    // vertex does not exist in the polygon.
    isConvex (polygon)
    {
        var node = polygon.nodeFor(this);
        if (node === null)
        {
            return null;
        }
        var prev = node.prev.data, next = node.next.data;
        var A = next.subtract(this);
        var B = prev.subtract(this);
        var theta = A.angleFrom(B);
        if (theta <= PRECISION)
        {
            return true;
        }
        if (Math.abs(theta - Math.PI) <= PRECISION)
        {
            return false;
        }
        return (A.cross(B).dot(polygon.plane.normal) > 0);
    }

    // Returns true iff the vertex's internal angle is 180 <= x < 360
    isReflex (polygon)
    {
        var result = this.isConvex(polygon);
        return (result === null) ? null : !result;
    }

    type (polygon)
    {
        var result = this.isConvex(polygon);
        return (result === null) ? null : (result ? 'convex' : 'reflex');
    }
}


// Method for converting a set of arrays/vectors/whatever to a set of Vertex objects
Vertex.convert = function(points)
{
    var pointSet = points.toArray ? points.toArray() : points;
    var list = [], n = pointSet.length;
    for (var i = 0; i < n; i++)
    {
        list.push(new Vertex(pointSet[i]));
    }
    return list;
};
