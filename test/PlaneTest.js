"use strict";

import { assert } from "chai";

import {
    Plane,
    Line,
    Vector
} from "../target/Sylvester";

describe("Plane", function () {

    it("eql", function() {
        assert( Plane.XY.dup().eql(new Plane([34,-99,0], [0,0,-4])) )
        assert.isNotOk( Plane.XY.dup().eql(new Plane([34,-99,1], [0,0,-4])) )
        assert.isNotOk( Plane.XY.dup().eql(new Plane([34,-99,0], [1,0,-4])) )
        assert.isNotOk( Plane.XY.dup().eql(new Plane([34,-99,0], [0,-1,-4])) )
    });

    it("dup", function() {
        var P = Plane.XY.dup()
        P.anchor.setElements([3,4,5])
        P.normal.setElements([0,2,6])
        assert( Plane.XY.anchor.eql([0,0,0]) )
        assert( Plane.XY.normal.eql(Vector.k) )
    });

    it("translate", function() {
        assert( Plane.XY.translate([5,12,-14]).eql(new Plane([89,-34,-14], Vector.k)) )
        assert( Plane.XY.anchor.eql(Vector.Zero(3)) )
    });

    it("isParallelTo", function() {
        assert( Plane.XY.dup().translate([5,12,-14]).isParallelTo(Plane.XY) )
        assert( Plane.XY.isParallelTo(new Line([4,8,10], [2,-6,0])) )
    });

    it("distanceFrom", function() {
        assert.equal( 14, Plane.XY.dup().translate([5,12,-14]).distanceFrom(Plane.XY) )
        assert.equal( 0, Plane.XY.dup().translate([5,12,-14]).distanceFrom(new Plane([0,0,0], [1,0,1])) )
        assert.equal( 10, Plane.XY.distanceFrom(new Line([4,8,10], [2,-6,0])) )
        assert.equal( 0, Plane.XY.distanceFrom(new Line([4,8,10], [2,-6,2])) )
    });

    it("contains", function() {
        assert( Plane.XY.contains(Line.X) )
        assert( Plane.XY.contains(Vector.i) )
    });

    it("pointClosestTo", function() {
        assert( Plane.YZ.pointClosestTo([3,6,-3]).eql([0,6,-3]) )
    });

    it("rotate", function() {
        assert( Plane.XY.rotate(Math.PI/2, Line.Y).eql(Plane.YZ) )
    });

    it("reflectionIn", function() {
        assert( Plane.XY.reflectionIn(new Vector([12,65,-4])).eql(new Plane([0,0,-8], Vector.k)) )
        assert( Plane.XY.reflectionIn(Line.Z).eql(Plane.XY) )
        assert( Plane.XY.reflectionIn(new Line([0,0,0], [1,0,1])).eql(Plane.YZ) )
        assert( new Plane([5,0,0], [1,1,0]).reflectionIn(new Plane([5,0,0], [0,1,0])).eql(new Plane([5,0,0], [-1,1,0])) )
        assert( new Plane([0,5,0], [0,1,1]).reflectionIn(new Plane([0,5,0], [0,0,1])).eql(new Plane([0,5,0], [0,-1,1])) )
        assert( new Plane([0,0,5], [1,0,1]).reflectionIn(new Plane([0,0,5], [1,0,0])).eql(new Plane([0,0,5], [1,0,-1])) )
    });

    it("containment", function() {
        var i, P1, P2, L1, L2;
        for (i = 0; i < 10; i++) {
            P1 = new Plane(new Vector([-50,-50,-50]).add(Vector.Random(3).x(100)), new Vector([-50,-50,-50]).add(Vector.Random(3).x(100)))
            P2 = new Plane(new Vector([-50,-50,-50]).add(Vector.Random(3).x(100)), new Vector([-50,-50,-50]).add(Vector.Random(3).x(100)))
            if (P1.intersects(P2)) {
                L1 = P1.intersectionWith(P2)
                L2 = P2.intersectionWith(P1)
                assert( L1.eql(L2) )
                assert( L1.liesIn(P1) )
                assert( P2.contains(L1) )
            }
        }
    });
});