"use strict";

import { assert } from "chai";

import {
	PRECISION,
	Vector,
	Line,
	LineSegment,
	Plane
} from "../target/Sylvester";

describe("Vector", function () {

    it("create", function() {
        assert.equal( '[0, 1, 7, 5]', new Vector([0, 1, 7, 5]).inspect() )
        assert.equal( '[0, 1.4, 7.034, 5.28638]', new Vector([0, 1.4, 7.034, 5.28638]).inspect() )
    });

    it("e", function() {
        var V = new Vector([0,3,4,5])
        assert.equal( 0, V.e(1) )
        assert.equal( 5, V.e(4) )
        assert.equal( null, V.e(5) )
    });

    it("Zero", function() {
        assert.equal( '[0, 0, 0, 0]', Vector.Zero(4).inspect() )
        for (var i = 1; i < 8; i++) {
            assert.equal( 0, Vector.Zero(i).modulus() )
            assert.equal( i, Vector.Zero(i).dimensions() )
        }
    });

    it("Random", function() {
        for (var i = 1; i < 8; i++) {
            assert.equal( i, Vector.Random(i).dimensions() )
        }
    });

    it("modulus", function() {
        assert.equal( Math.sqrt(50), new Vector([0,3,4,5]).modulus() )
        assert.equal( 1, Vector.i.modulus() )
    });

    it("dimensions", function() {
        assert.equal( 4, new Vector([0,3,4,5]).dimensions() )
    });

    it("eql", function() {
        var V = Vector.Random(6)
        assert( V.eql(V) )
        assert( Vector.Zero(3).eql([0,0,0]) )
        assert( new Vector([3,6,9]).eql([3.0,6.0,9.0]) )
        assert.isNotOk( new Vector([3.01,6,9]).eql([3.0,6.0,9.0]) )
        assert.isNotOk( new Vector([3,6,9]).eql([3,6,10]) )
        assert.isNotOk( new Vector([3,6,9]).eql([3,7,9]) )
        assert.isNotOk( new Vector([3,6,9]).eql([4,6,9]) )
    });

    it("single element", function() {
        var V = new Vector([4])
        assert.equal( '[4]', V.inspect() )
        assert.equal( 4, V.modulus() )
    });

    it("dup", function() {
        var V = new Vector([3,4,5])
        var dup = V.dup()
        assert( V.eql(dup) )
        dup.elements[0] = 24
        assert( V.eql([3,4,5]) )
        assert( dup.eql([24,4,5]) )
    });

    it("map", function() {
        var V = new Vector([1,6,3,9])
        assert( V.map(function(x) { return x*x }).eql([1,36,9,81]) )
    });

    it("normalize", function() {
        var V = new Vector([8,2,9,4])
        assert.equal( 1, V.toUnitVector().modulus() )
        assert( V.toUnitVector().x(Math.sqrt(165)).eql(V) )
        assert( V.toUnitVector().isParallelTo(V) )
    });

    it("angleFrom", function() {
        var k = PRECISION
        assert.equal( Math.PI/2, Vector.i.angleFrom(Vector.j) )
        assert.equal(
            Math.round((Math.PI/4)*k)/k,
            Math.round((new Vector([1,0]).angleFrom(new Vector([1,1])))*k)/k
        )
        assert.isNull( Vector.i.angleFrom([1,6,3,5]) )
    });

    it("angle types", function() {
        assert( Vector.i.isParallelTo(Vector.i.x(235457)) )
        assert.isNull( Vector.i.isParallelTo([8,9]) )
        assert( Vector.i.isAntiparallelTo(Vector.i.x(-235457)) )
        assert.isNull( Vector.i.isAntiparallelTo([8,9]) )
        assert( Vector.i.isPerpendicularTo(Vector.k) )
        assert.isNull( Vector.i.isPerpendicularTo([8,9,0,3]) )
    });

    it("arithmetic", function() {
        var V1 = new Vector([2,9,4])
        var V2 = new Vector([5,13,7])
        assert( V1.add(V2).eql([7,22,11]) )
        assert( V1.subtract(V2).eql([-3,-4,-3]) )
        assert.isNull( V1.add([2,8]) )
        assert.isNull( V1.subtract([9,3,6,1,7]) )
        assert( V1.x(4).eql([8,36,16]) )
    });

    it("products", function() {
        var V1 = new Vector([2,9,4])
        var V2 = new Vector([5,13,7])
        assert.equal( 2* 5 + 9*13 + 4*7, V1.dot(V2) )
        assert( V1.cross(V2).eql([9*7-4*13, 4*5-2*7, 2*13-9*5]) )
        assert.isNull( V1.dot([7,9]) )
        assert.isNull( V2.cross([9,1,4,3]) )
    });

    it("max", function() {
        var V = new Vector([2,8,5,9,3,7,12])
        assert.equal( 12, V.max() )
        V = new Vector([-17,8,5,9,3,7,12])
        assert.equal( -17, V.max() )
    });

    it("indexOf", function() {
        var V = new Vector([2,6,0,3])
        assert.equal( 1, V.indexOf(2) )
        assert.equal( 4, V.indexOf(3) )
        assert.equal( 2, V.indexOf(V.max()) )
        assert.isNull( V.indexOf(7) )
    });

    it("toDiagonalMatrix", function() {
        assert(
            new Vector([2,6,4,3]).toDiagonalMatrix().eql([
                [2,0,0,0],
                [0,6,0,0],
                [0,0,4,0],
                [0,0,0,3]
            ])
        )
    });

    it("round", function() {
        assert( new Vector([2.56, 3.5, 3.49]).round().eql([3,4,3]) )
    });

    it("distanceFrom", function() {
        assert.equal( new Vector([1,9,0,13]).modulus(), new Vector([3,9,4,6]).distanceFrom([2,0,4,-7]) )
        assert.equal( Math.sqrt(64 + 49), new Vector([2,8,7]).distanceFrom(Line.X) )
        assert.equal( 78, new Vector([28,-43,78]).distanceFrom(Plane.XY) )
        assert.equal( 5, new Vector([7,4,0]).distanceFrom(new LineSegment([0,0,0], [4,0,0])) )
    });

    it("liesIn", function() {
        assert( new Vector([12,0,0]).liesOn(Line.X) )
        assert.isNotOk( new Vector([12,1,0]).liesOn(Line.X) )
        assert.isNotOk( new Vector([12,0,3]).liesOn(Line.X) )
        assert( new Vector([9,16,4]).liesOn(new LineSegment([2,9,4], [14,21,4])) )
        assert.isNotOk( new Vector([9,17,4]).liesOn(new LineSegment([2,9,4], [14,21,4])) )
        assert( new Vector([0,-3,6]).liesIn(Plane.YZ) )
        assert.isNotOk( new Vector([4,-3,6]).liesIn(Plane.YZ) )
    });

    it("reflectionIn", function() {
        assert( new Vector([3,0,0]).reflectionIn([0,3,0]).eql([-3,6,0]) )
        assert( new Vector([3,0,0]).reflectionIn(new Line([0,0,0], [1,0,1])).eql([0,0,3]) )
        var V1 = new Vector([25,-48,77])
        var V2 = new Vector([25,-48,-77])
        assert( V1.reflectionIn(Plane.XY).eql(V2) )
        assert( V2.reflectionIn(Plane.YX).eql(V1) )
    });

    it("rotate", function() {
        assert( new Vector([12,1]).rotate(Math.PI/2, [5,1]).eql([5,8]) )
        assert( Vector.i.rotate(-Math.PI/2, new Line([10, 0, 100], Vector.k)).eql([10,9,0]) )
    });

});