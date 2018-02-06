import L from 'leaflet';
import {Marker} from 'leaflet';

/* Default bouncing animation properties */
const defaultBouncingOptions = {
    bounceHeight: 15,    // how high marker can bounce (px)
    contractHeight: 12,    // how much marker can contract (px)
    bounceSpeed: 52,    // bouncing speed coefficient
    contractSpeed: 52,    // contracting speed coefficient
    shadowAngle: - Math.PI / 4, // shadow inclination angle(radians); null to cancel shadow movement
    elastic: true,  // activate contract animation
    exclusive: false // many markers can bounce in the same time
};

Marker._bouncingMarkers = [];   // array of bouncing markers

/**
 * Registers default options of bouncing animation.
 *
 * @param options {object}  object with options
 */
Marker.setBouncingOptions = function(options) {
    L.extend(L.Marker.prototype._bouncingOptions, options);
};

Marker.prototype._bouncingOptions = defaultBouncingOptions;

/**
 * Registers options of bouncing animation for this marker. After registration of options for
 * this marker, it will ignore changes of default options. Function automatically recalculates
 * animation steps and delays.
 *
 * @param options {object}  options object
 *
 * @return this marker
 */
Marker.prototype.setBouncingOptions = function(options) {

    /* If _bouncingOptions was not redefined yet for this marker create
     * own property and clone _bouncingOptions of prototype.
     */
    if (!this.hasOwnProperty('_bouncingOptions')) {
        this._bouncingOptions = L.extend({}, defaultBouncingOptions);
    }

    /* Copy options passed as param */
    L.extend(this._bouncingOptions, options);

    /* Recalculate steps & delays of movement & resize animations */
    // TODO: uncomment
    // this._calculateTimeline();

    /* Recalculate transformations */
    // TODO: uncomment
    // this._calculateTransforms();

    return this;    // fluent API
};
