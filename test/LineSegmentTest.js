"use strict";

import { assert } from "chai";

import {
    Line,
    LineSegment,
    Plane,
    PRECISION
} from "../target/Sylvester";

describe("LineSegment", function () {

    let oLineSegment = new LineSegment([5,5,5], [10,10,10]);
    let oLineSegment2 = new LineSegment([1,1,0], [1,2,0]);

    it("eql", function() {
        assert( oLineSegment.eql(oLineSegment) )
        assert.isNotOk( oLineSegment.eql(oLineSegment2) )
        assert( oLineSegment.eql(new LineSegment(oLineSegment.end, oLineSegment.start)) )
    });

    it("dup", function() {
        var seg = oLineSegment.dup()
        assert( oLineSegment.eql(seg) )
        seg.start.setElements([23,87,56])
        assert.isNotOk( oLineSegment.eql(seg) )
        assert( oLineSegment.start.eql([5,5,5]) )
    });

    it("length()", function() {
        assert( oLineSegment.length() - Math.sqrt(75) <= PRECISION )
    });

    it("toVector", function() {
        assert( oLineSegment.toVector().eql([5,5,5]) )
    });

    it("midpoint", function() {
        assert( oLineSegment.midpoint().eql([7.5,7.5,7.5]) )
    });

    it("bisectingPlane", function() {
        assert( oLineSegment.bisectingPlane().eql(new Plane([7.5,7.5,7.5], [1,1,1])) )
    });

    it("translate", function() {
        assert( oLineSegment.translate([9,2,7]).eql(new LineSegment([14,7,12], [19,12,17])) )
    });

    it("isParallelTo", function() {
        assert( oLineSegment2.isParallelTo(Line.Y) )
        assert.isNotOk( oLineSegment2.isParallelTo(Line.Z) )
        assert( oLineSegment2.isParallelTo(Plane.XY) )
        assert( oLineSegment2.isParallelTo(Plane.YZ) )
        assert.isNotOk( oLineSegment2.isParallelTo(Plane.ZX) )
        assert.isNotOk( oLineSegment.isParallelTo(oLineSegment2) )
        assert( oLineSegment2.isParallelTo(oLineSegment2) )
    });

    it("contains", function() {
        assert( oLineSegment.contains(oLineSegment.midpoint()) )
        assert( oLineSegment.contains([5,5,5]) )
        assert( oLineSegment.contains([10,10,10]) )
        assert.isNotOk( oLineSegment.contains([4.9999,4.9999,4.9999]) )
        assert.isNotOk( oLineSegment.contains([10.00001, 10.00001, 10.00001]) )
        assert( oLineSegment.contains(new LineSegment([5,5,5], [8,8,8])) )
        assert( oLineSegment.contains(new LineSegment([7,7,7], [10,10,10])) )
        assert.isNotOk( oLineSegment.contains(new LineSegment([4,4,4], [8,8,8])) )
    });

    it("distanceFrom", function() {
        assert.equal( 5, oLineSegment.distanceFrom([5,5,0]) )
        assert.equal( 2, oLineSegment.distanceFrom([10,12,10]) )
        assert.equal( Math.sqrt(2* 25), oLineSegment.distanceFrom(Line.X) )
        assert.equal( 1, oLineSegment.distanceFrom(new Line([11,10,10], [0,1])) )
        assert.equal( 5, oLineSegment.distanceFrom(Plane.XY) )
        assert.equal( Math.sqrt(4 + 25 + 25), oLineSegment.distanceFrom(new LineSegment([7,0,0], [9,0,0])) )
    });

    it("intersection", function() {
        assert.isNotOk( oLineSegment.intersects(Line.X) )
        assert.isNotOk( oLineSegment.intersects(Line.Y) )
        assert.isNotOk( oLineSegment.intersects(Line.Z) )
        assert.isNotOk( oLineSegment.intersects(Plane.XY) )
        assert.isNotOk( oLineSegment.intersects(Plane.YZ) )
        assert.isNotOk( oLineSegment.intersects(Plane.ZX) )
        assert( oLineSegment.intersectionWith(oLineSegment.bisectingPlane()).eql(oLineSegment.midpoint()) )
        assert(
            new LineSegment([0,4,4], [0,8,4]).intersectionWith(
                new LineSegment([0,6,2], [0,6,6])
            ).eql([0,6,4])
        )
        assert.isNull(
            new LineSegment([0,4,4], [0,8,4]).intersectionWith(
                new LineSegment([2,6,2], [0,6,6])
            )
        )
        assert( oLineSegment.intersects(new LineSegment([6,7,7], [9,7,7])) )
        assert.isNotOk( oLineSegment.intersects(oLineSegment2) )
    });

    it("pointClosestTo", function() {
        assert.isNull( oLineSegment2.pointClosestTo(Line.Y) )
        assert( oLineSegment2.pointClosestTo(Line.X).eql([1,1,0]) )
        assert( oLineSegment2.pointClosestTo(Line.X.translate([0,10])).eql([1,2,0]) )
        assert( oLineSegment2.pointClosestTo(new Line([0,1.5,0], [0,0,1])).eql([1,1.5,0]) )
        assert( oLineSegment2.pointClosestTo(Plane.XZ).eql([1,1,0]) )
        assert.isNull( oLineSegment2.pointClosestTo(Plane.YZ) )
    });
});