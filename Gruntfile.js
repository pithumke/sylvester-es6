module.exports = function(grunt) {

    grunt.initConfig({
        "babel": {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            target: {
                files: {
                    "target/Sylvester.js": "src/Sylvester.js",
                    "target/CircularLinkedList.js": "src/CircularLinkedList.js",
                    "target/Line.js": "src/Line.js",
                    "target/LineSegment.js": "src/LineSegment.js",
                    "target/LinkedList.js": "src/LinkedList.js",
                    "target/LinkedListNode.js": "src/LinkedListNode.js",
                    "target/Matrix.js": "src/Matrix.js",
                    "target/Plane.js": "src/Plane.js",
                    "target/Polygon.js": "src/Polygon.js",
                    "target/Vector.js": "src/Vector.js",
                    "target/Vertex.js": "src/Vertex.js",
                    "target/PRECISION.js": "src/PRECISION.js",
                    "target/Utils.js": "src/Utils.js"
                }
            }
        },
        "mochaTest": {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false,
                    clearRequireCache: false,
                    require: "babel-core/register"
                },
                src: ['test/**/*.js']
            }
        }
    });

    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask("build", ["babel:target"]);
    grunt.registerTask("test", ["build", "mochaTest:test"]);

};