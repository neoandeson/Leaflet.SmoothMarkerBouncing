'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var regStyle = /([\w-]+): ([^;]+);/g; // regex to parse style definitions

/* CSS3 transform properties for different browsers */
var css3Transforms = {
    transform: 'transform',
    WebkitTransform: '-webkit-transform',
    OTransform: '-o-transform',
    MozTransform: '-moz-transform',
    msTransform: '-ms-transform'
};

/** CSS3 transform property for this browser. */
var transformProperty = css3Transforms[L.DomUtil.TRANSFORM];

var helpers = exports.helpers = function () {
    function helpers() {
        _classCallCheck(this, helpers);
    }

    _createClass(helpers, null, [{
        key: 'parseCssText',


        /**
         * Parses cssText attribute into object. Style definitions becomes the keys of the object.
         * @param cssText {string}  cssText string
         * @return {object} object with style definitions as keys
         */
        value: function parseCssText() {
            var styleDefinitions = {},
                match = regStyle.exec(cssText);

            while (match) {
                styleDefinitions[match[1]] = match[2];
                match = regStyle.exec(cssText);
            }

            return styleDefinitions;
        }

        /**
         * Renders object with style definitions as string. Created string is ready to put in cssText
         * attribute.
         * @param styleDefinitions {object}  object with style definitions
         * @return {string} cssText string
         */

    }, {
        key: 'renderCssText',
        value: function renderCssText(styleDefinitions) {
            var cssText = '',
                key = void 0;

            for (key in styleDefinitions) {
                cssText += key + ': ' + styleDefinitions[key] + '; ';
            }

            return cssText;
        }

        /**
         * Calculates the points to draw the continous line on the screen. Returns the array of ordered
         * point coordinates. Uses Bresenham algorithm.
         *
         * @param x {number}  x coordinate of origin
         * @param y {number}  y coordinate of origin
         * @param angle {number}  angle (radians)
         * @param length {number}  length of line (px)
         *
         * @return {[number, number][]} array of ordered point coordinates
         *
         * @see http://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm#JavaScript
         */

    }, {
        key: 'calculateLine',
        value: function calculateLine(x, y, angle, length) {
            // TODO: use something else than multiply length by 2 to calculate the line with defined
            // length
            var xD = Math.round(x + Math.cos(angle) * (length * 2)),
                yD = Math.round(y + Math.sin(angle) * (length * 2)),
                dx = Math.abs(xD - x),
                sx = x < xD ? 1 : -1,
                dy = Math.abs(yD - y),
                sy = y < yD ? 1 : -1,
                err = (dx > dy ? dx : -dy) / 2,
                e2 = void 0,
                p = [],
                i = 0;

            while (true) {
                p.push([x, y]);
                i++;
                if (i === length) break;
                e2 = err;
                if (e2 > -dx) {
                    err -= dy;
                    x += sx;
                }
                if (e2 < dy) {
                    err += dx;
                    y += sy;
                }
            }

            return p;
        }
    }]);

    return helpers;
}();

helpers._bouncingMotionsCache = {};