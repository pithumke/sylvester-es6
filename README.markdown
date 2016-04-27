# Sylvester

Fork of the famous Sylvester vector, matrix and geometry library.

Please have a look at the [original author's website](http://sylvester.jcoglan.com) for documentation and credits.

## Modifications:
  - Rewriting in ES6
  - Including [glUtils.js](https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/glUtils.js) (see [MDN tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context) for details)
  - Removing shorthand notations ($M, $L, ...)
  - Replaced "Line.Segment" with "LineSegment"
  - Replaced "Polygon.Vertex" with "Vertex"
  - Separate export for constant "precision"
  - Replacing "create"-functions with class constructors
  - Putting curly braces on the next line where ever ES6 allows it.

## Notes
  - The test "toRightTriangular" of class "Matrix" is failing, commented out for now
  - An assertion in the test "intersectionWith" of class "Line" fails sporadically (line number 58), commented out for now

## License

(The MIT License)

Copyright (c) 2007-2015 James Coglan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.