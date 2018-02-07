import L from 'leaflet';
import {Marker} from 'leaflet';
import {
    calculateIconMovePoints,
    calculateIconMoveTransforms, calculateIconResizeTransforms, calculateShadowMovePoints,
    calculateShadowMoveTransforms
} from './helpers';

/** Default bouncing animation properties. */
const defaultBouncingOptions = {
    bounceHeight: 15,   // how high marker can bounce (px)
    contractHeight: 12, // how much marker can contract (px)
    bounceSpeed: 52,    // bouncing speed coefficient
    contractSpeed: 52,  // contracting speed coefficient
    shadowAngle: - Math.PI / 4, // shadow inclination angle(radians); null to cancel shadow movement
    elastic: true,      // activate contract animation
    exclusive: false    // many markers can bounce in the same time
};

/** Array of bouncing markers. */
Marker._bouncingMarkers = [];

/** Bouncing options shared by all markers. */
Marker.prototype._bouncingOptions = defaultBouncingOptions;

/**
 * Registers default options of bouncing animation.
 * @param options {object}  object with options
 */
Marker.setBouncingOptions = function(options) {
    L.extend(Marker.prototype._bouncingOptions, options);
};

/**
 * Returns array of currently bouncing markers.
 * @return {Marker[]} array of bouncing markers
 */
Marker.getBouncingMarkers = function() {
    return Marker._bouncingMarkers;
};

/**
 * Stops the bouncing of all currently bouncing markers. Purge the array of bouncing markers.
 */
Marker.stopAllBouncingMarkers = function() {
    var marker;

    while (marker = Marker._bouncingMarkers.shift()) {
        marker._bouncingMotion.isBouncing = false;    // stop bouncing
    }
};

/**
 * Registers options of bouncing animation for this marker. After registration of options for
 * this marker, it will ignore changes of default options. Function automatically recalculates
 * animation steps and delays.
 *
 * @param options {object}  options object
 * @return {Marker} this marker
 */
Marker.prototype.setBouncingOptions = function(options) {
    if (!this.hasOwnProperty('_bouncingOptions')) {
        this._bouncingOptions = L.extend({}, defaultBouncingOptions);
    }

    L.extend(this._bouncingOptions, options);

    // Recalculate steps & delays of movement & resize animations
    calculateTimeline(this);

    // Recalculate transformations
    calculateTransforms(this);

    return this;
};

/**
 * Returns true if this marker is bouncing. If this marker is not bouncing returns false.
 * @return {boolean} true if marker is bouncing, false if not
 */
Marker.prototype.isBouncing = function() {
    return this._bouncingMotion.isBouncing;
};

/**
 * Adds the marker to the list of bouncing markers. If flag 'exclusive' is set to true, stops all
 * bouncing markers before.
 *
 * @param marker {Marker}  marker object
 * @param exclusive {boolean}  flag of exclusive bouncing. If set to true, stops the bouncing of all
 *      other markers.
 */
function addBouncingMarker(marker, exclusive) {
    if (exclusive || marker._bouncingOptions.exclusive) {
        Marker.stopAllBouncingMarkers();
    } else {
        Marker._stopEclusiveMarkerBouncing();
    }

    Marker._bouncingMarkers.push(marker);
}

/**
 * Removes the marker from the list of bouncing markers.
 * @param marker {Marker}  marker object
 */
function removeBouncingMarker(marker) {
    let i;

    if (i = Marker._bouncingMarkers.length) {
        while (i--) {
            if (Marker._bouncingMarkers[i] == marker) {
                Marker._bouncingMarkers.splice(i, 1);
                break;
            }
        }
    }
}

/**
 * Stops the bouncing of exclusive marker.
 */
function stopEclusiveMarkerBouncing() {
    let i;

    if (i = Marker._bouncingMarkers.length) {
        while (i--) {
            if (Marker._bouncingMarkers[i]._bouncingOptions.exclusive) {
                Marker._bouncingMarkers[i]._bouncingMotion.isBouncing = false;  // stop bouncing
                Marker._bouncingMarkers.splice(i, 1);
                break;
            }
        }
    }
}

/**
 * Calculates moveSteps, moveDelays, resizeSteps & resizeDelays for animation of supplied marker.
 * @param marker {Marker}  marker object
 * @return {Marker} the same updated marker
 */
function calculateTimeline(marker) {

    /* Animation is defined by shifts of the marker from it's original position. Each step of the
     * animation is a shift of 1px.
     *
     * We define function f(x) - time of waiting between shift of x px and shift of x+1 px.
     *
     * We use for this the inverse function f(x) = a / x; where a is the animation speed and x is
     * the shift from original position in px.
     */

    // Recalculate steps & delays of movement & resize animations
    marker._bouncingMotion.moveSteps = calculateSteps(
        marker._bouncingOptions.bounceHeight, 'moveSteps_');

    marker._bouncingMotion.moveDelays = calculateDelays(
        marker._bouncingOptions.bounceHeight,
        marker._bouncingOptions.bounceSpeed,
        'moveDelays_');

    // Calculate resize steps & delays only if elastic animation is enabled
    if (marker._bouncingOptions.elastic) {
        marker._bouncingMotion.resizeSteps = calculateSteps(
            marker._bouncingOptions.contractHeight, 'resizeSteps_');

        marker._bouncingMotion.resizeDelays = calculateDelays(
            marker._bouncingOptions.contractHeight,
            marker._bouncingOptions.contractSpeed,
            'resizeDelays_');
    }

    return marker;
}

/**
 * Calculated the transformations of supplied marker.
 * @param marker {Marker}  marker object
 * @return {Marker} the same updated marker
 */
function calculateTransforms(marker) {
    if (L.Browser.any3d) {

        // Calculate transforms for 3D browsers
        let iconHeight;

        if (marker.options.icon.options.iconSize) {
            iconHeight = marker.options.icon.options.iconSize[1];
        } else {
            // To fix the case when icon is in _iconObj
            iconHeight = marker._iconObj.options.iconSize[1];
        }

        // Calculate move transforms of icon
        marker._bouncingMotion.iconMoveTransforms = calculateIconMoveTransforms(
            marker._bouncingMotion.x,
            marker._bouncingMotion.y,
            marker._bouncingOptions.bounceHeight);

        // Calculate resize transforms of icon
        marker._bouncingMotion.iconResizeTransforms = calculateIconResizeTransforms(
            marker._bouncingMotion.x,
            marker._bouncingMotion.y,
            iconHeight,
            marker._bouncingOptions.contractHeight);

        if (marker._shadow) {

            // Calculate move transformations of shadow
            marker._bouncingMotion.shadowMoveTransforms = calculateShadowMoveTransforms(
                this._bouncingMotion.x,
                this._bouncingMotion.y,
                this._bouncingOptions.bounceHeight,
                this._bouncingOptions.shadowAngle);

            // Calculate resize transforms of shadow
            // TODO: use function calculateShadowResizeTransforms
            marker._bouncingMotion.shadowResizeTransforms = calculateIconResizeTransforms(
                marker._bouncingMotion.x,
                marker._bouncingMotion.y,
                marker.options.icon.options.shadowSize[1],
                marker._bouncingOptions.contractHeight);
        }
    } else {

        // Calculate move points

        // For the icon
        marker._bouncingMotion.iconMovePoints = calculateIconMovePoints(
            marker._bouncingMotion.x,
            marker._bouncingMotion.y,
            marker._bouncingOptions.bounceHeight);

        // And for the shadow
        marker._bouncingMotion.shadowMovePoints = calculateShadowMovePoints(
            marker._bouncingMotion.x,
            marker._bouncingMotion.y,
            marker._bouncingOptions.bounceHeight,
            marker._bouncingOptions.shadowAngle);
    }

    return marker;
}
