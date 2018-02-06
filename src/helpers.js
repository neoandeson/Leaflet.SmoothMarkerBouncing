import L from 'leaflet';

const regStyle = /([\w-]+): ([^;]+);/g;     // regex to parse style definitions

/* CSS3 transform properties for different browsers */
const css3Transforms = {
    transform : 'transform',
    WebkitTransform : '-webkit-transform',
    OTransform : '-o-transform',
    MozTransform : '-moz-transform',
    msTransform : '-ms-transform'
};

/** CSS3 transform property for this browser. */
const transformProperty = css3Transforms[L.DomUtil.TRANSFORM];

const bouncingMotionsCache = {};

/**
 * Parses cssText attribute into object. Style definitions becomes the keys of the object.
 * @param cssText {string}  cssText string
 * @return {object} object with style definitions as keys
 */
export function parseCssText(cssText) {
    let styleDefinitions = {},
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
export function renderCssText(styleDefinitions) {
    let cssText = '',
        key;

    for (key in styleDefinitions) {
        cssText += key + ': ' + styleDefinitions[key] + '; '
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
export function calculateLine(x, y, angle, length) {
    // TODO: use something else than multiply length by 2 to calculate the line with defined
    // length
    let xD = Math.round(x + Math.cos(angle) * (length * 2)),
        yD = Math.round(y + Math.sin(angle) * (length * 2)),

        dx = Math.abs(xD - x),
        sx = x < xD ? 1 : -1,

        dy = Math.abs(yD - y),
        sy = y < yD ? 1 : -1,

        err = (dx > dy ? dx : -dy) / 2,
        e2,

        p = [],
        i = 0;

    while (true) {
        p.push([x, y]);
        i++;
        if (i === length)
            break;
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

/**
 * Returns calculated array of points for icon movement. Used to animate markers in browsers that
 * doesn't support 'transform' attribute.
 *
 * @param x {number}  x coordinate of original position of the marker
 * @param y {number}  y coordinate of original position of the marker
 * @param bounceHeight {number}  height of bouncing (px)
 *
 * @return {[number, number][]} array of points
 */
export function calculateIconMovePoints(x, y, bounceHeight) {
    let p = [],     // array of points
        dH = bounceHeight + 1;  // delta of height

    // Use fast inverse while loop to fill the array
    while (dH--) {
        p[dH] = [x, y - dH];
    }

    return p;
}

/**
 * Returns calculated array of points for shadow movement. Used to animate markers in browsers that
 * doesn't support 'transform' attribute.
 *
 * @param x {number}  x coordinate of original position of the marker
 * @param y {number}  y coordinate of original position of the marker
 * @param bounceHeight {number}  height of bouncing (px)
 * @param angle {number}  shadow inclination angle, if null shadow don't moves from it's initial
 *      position (radians)
 *
 * @return {[number, number][]} array of points
 */
export function calculateShadowMovePoints(x, y, bounceHeight, angle) {
    if (angle != null) {  // important: 0 is not null
        return calculateLine(x, y, angle, bounceHeight + 1);
    } else {
        const p = [];

        for (let i = 0; i <= bounceHeight; i++) {
            p[i] = [x, y];
        }

        return p;
    }
}
