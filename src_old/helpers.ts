/**
 * Helper functions used by plugin.
 *
 * @author hosuaby
 */

const regStyle = /([\w-]+): ([^;]+);/g;     // regex to parse style definitions
const css3Transforms = {                    // CSS3 transform properties for different browsers
    transform : 'transform',
    WebkitTransform : '-webkit-transform',
    OTransform : '-o-transform',
    MozTransform : '-moz-transform',
    msTransform : '-ms-transform'
};

/** CSS3 transform property for this browser. */
const transformProperty = css3Transforms[L.DomUtil.TRANSFORM];

/** Cache for motion data that not depends on x & y of the marker:
 *    - moveSteps
 *    - moveDelays
 *    - resizeSteps
 *    - resizeDelays
 */
const _bouncingMotionsCache = {};

type point = [number, number];  // cartesian point

/**
 * Parses cssText attribute into object. Style definitions becomes the keys of the object.
 * @param cssText  cssText string
 * @return object with style definitions as keys
 */
export function parseCssText(cssText: string): object {
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
 * @param styleDefinitions  object with style definitions
 * @return cssText string
 */
export function renderCssText(styleDefinitions: object): string {
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
 * @param x  x coordinate of origin
 * @param y  y coordinate of origin
 * @param angle  angle (radians)
 * @param length  length of line (px)
 *
 * @return array of ordered point coordinates
 *
 * @see http://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm#JavaScript
 */
export function calculateLine(x: number, y: number, angle: number, length: number): point[] {
    // TODO: use something else than multiply length by 2 to calculate the line with defined length
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
 * @param x  x coordinate of original position of the marker
 * @param y  y coordinate of original position of the marker
 * @param bounceHeight  height of bouncing (px)
 *
 * @return array of points
 */
export function calculateIconMovePoints(x: number, y: number, bounceHeight: number): point[] {
    let p = [],     // array of points
        dH = bounceHeight + 1;      // delta of height

    /* Use fast inverse while loop to fill the array */
    while (dH--) {
        p[dH] = [x, y - dH];
    }

    return p;
}

/**
 * Returns calculated array of points for shadow movement. Used to animate markers in browsers that
 * doesn't support 'transform' attribute.
 *
 * @param x  x coordinate of original position of the marker
 * @param y  y coordinate of original position of the marker
 * @param bounceHeight  height of bouncing (px)
 * @param angle  shadow inclination angle, if null shadow don't moves from it's initial position
 *      (radians)
 *
 * @return array of the points
 */
export function calculateShadowMovePoints(
        x: number,
        y: number,
        bounceHeight: number,
        angle: number): point[] {
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

/**
 * Returns calculated array of transformation definitions for the animation of icon movement.
 * Function defines one transform for every pixel of shift of the icon from it's original y
 * position.
 *
 * @param x  x coordinate of original position of the marker
 * @param y  y coordinate of original position of the marker
 * @param bounceHeight  height of bouncing (px)
 *
 * @return array of transformation definitions
 */
export function calculateIconMoveTransforms(x: number, y: number, bounceHeight: number): string[] {
    let t = [],     // array of transformations
        dY = bounceHeight + 1;      // delta Y

    /* Use fast inverse while loop to fill the array */
    while (dY--) {

        /* Use matrix3d for hardware acceleration */
        t[dY] = ' matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + x + ',' + (y - dY)
            + ',0,1) ';
    }

    return t;
}

/**
 * Returns calculated array of transformation definitions for the animation of shadow movement.
 * Function defines one transform for every pixel of shift of the shadow from it's original
 * position.
 *
 * @param x  x coordinate of original position of marker
 * @param y  y coordinate of original position of marker
 * @param bounceHeight  height of bouncing (px)
 * @param angle  shadow inclination angle, if null shadow don't moves from it's initial position
 *      (radians)
 *
 * @return array of transformation definitions
 */
export function calculateShadowMoveTransforms(
        x: number,
        y: number,
        bounceHeight: number,
        angle: number): string[] {
    // TODO: check this method to know if bounceHeight + 1 is normal
    let t: string[] = [],     // array of transformation definitions
        dY = bounceHeight + 1,      // delta Y
        p: point[] = [];

    if (angle != null) {  // important: 0 is not null
        p = calculateLine(x, y, angle, bounceHeight + 1);
    } else {
        for (let i = 0; i <= bounceHeight; i++) {
            p[i] = [x, y];
        }
    }

    /* Use fast inverse while loop to fill the array */
    while (dY--) {

        /* Use matrix3d for hardware acceleration */
        t[dY] = ' matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,' + p[dY][0] + ','
            + p[dY][1] + ',0,1) ';
    }

    return t;
}

/**
 * Returns calculated array of transformation definitions for the animation of icon resizing.
 * Function defines one transform for every pixel of resizing of marker from it's original height.
 *
 * @param x  x coordinate of original position of marker
 * @param y  y coordinate of original position of marker
 * @param height  original marker height (px)
 * @param contractHeight  height of marker contraction (px)
 *
 * @return array of transformation definitions
 */
export function calculateIconResizeTransforms(
        x: number,
        y: number,
        height: number,
        contractHeight: number): string[] {
    let t = [],     // array of transformations
        dH = contractHeight + 1;    // delta of height

    /* Use fast inverse while loop to fill the array */
    while (dH--) {

        /* Use matrix3d for hardware acceleration */
        t[dH] = ' matrix3d(1,0,0,0,0,' + ((height - dH) / height)
            + ',0,0,0,0,1,0,' + x + ',' + (y + dH) + ',0,1) ';
    }

    return t;
}

/**
 * Returns calculated array of anination steps. This function used to calculate both movement and
 * resizing animations. Arrays of steps are then cached in _bouncingMotionsCache. Function checks
 * this cache before make any calculations.
 *
 * @param height  height of movement or resizing (px)
 * @param prefix  prefix of the key in the cache. Must be any string with trailing "_" caracter.
 *
 * @return array of animation steps
 */
export function calculateSteps(height: number, prefix: string): number[] {
    let key = prefix + height,
        steps = [],
        i;

    /* Check the cache */
    if (_bouncingMotionsCache[key]) {
        return _bouncingMotionsCache[key];
    }

    /* Calculate the sequence of animation steps:
     * steps = [1 .. height] concat [height-1 .. 0]
     */
    i = 1;
    while (i <= height) {
        steps.push(i++);
    }

    i = height;
    while (i--) {
        steps.push(i);
    }

    /* Save steps to the cache */
    _bouncingMotionsCache[key] = steps;

    return steps;
}

/**
 * Returns calculated array of delays between animation start and the steps of animation. This
 * function used to calculate both movement and resizing animations. Element with index i of this
 * array contains the delay in milliseconds between animation start and the step number i. Those
 * delays are cached in _bouncingMotionsCache. Function checks this cache before make any
 * calculations.
 *
 * @param height  height of movement or resizing (px)
 * @param speed  speed coefficient
 * @param prefix  prefix of the key in the cache. Must be any string with trailing "_" caracter.
 *
 * @return array of delays before steps of animation
 */
export function calculateDelays(height: number, speed: number, prefix: string): number[] {
    let key = prefix + height + '_' + speed,
        deltas = [],    // time between steps of animation
        delays = [],    // delays before steps from beginning of animation
        totalDelay = 0,
        l,
        i;

    /* Check the cache */
    if (_bouncingMotionsCache[key]) {
        return _bouncingMotionsCache[key];
    }

    /* Calculate delta time for bouncing animation */

    /* Delta time to movement in one direction */
    deltas[height] = speed;
    deltas[0] = 0;
    i = height;
    while (--i) {
        deltas[i] = Math.round(speed / (height - i));
    }

    /* Delta time for movement in two directions */
    i = height;
    while (i--) {
        deltas.push(deltas[i]);
    }

    /* Calculate move delays (cumulated deltas) */
    // TODO: instead of deltas.lenght write bounceHeight * 2 - 1
    for (i = 0, l = deltas.length; i < l; i++) {
        totalDelay += deltas[i];
        delays.push(totalDelay);
    }

    /* Save move delays to cache */
    _bouncingMotionsCache[key] = delays;

    return delays;
}
