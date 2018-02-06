'use strict';

var _leaflet = require('leaflet');

// import L from 'leaflet';
// declare L;

_leaflet.Marker._bouncingMarkers = []; // array of bouncing markers

/**
 * Registers default options of bouncing animation.
 *
 * @param options {object}  object with options
 */
_leaflet.L.Marker.setBouncingOptions = function (options) {
  _leaflet.L.extend(_leaflet.L.Marker.prototype._bouncingOptions, options);
};