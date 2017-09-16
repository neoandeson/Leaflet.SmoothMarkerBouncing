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