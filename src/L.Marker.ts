/**
 * Class "static" methods.
 *
 * @author hosuaby
 */

L.Marker._bouncingMarkers = [];     // array of bouncing markers

/**
 * Registers default options of bouncing animation.
 *
 * @param options    object with options
 */
L.Marker.setBouncingOptions = function(options) {
    L.extend(L.Marker.prototype._bouncingOptions, options);
};

/**
 * Returns array of currently bouncing markers.
 *
 * @return array of bouncing markers
 */
L.Marker.getBouncingMarkers = function() {
    return L.Marker._bouncingMarkers;
};

/**
 * Stops the bouncing of all currently bouncing markers. Purge the array of
 * bouncing markers.
 */
L.Marker.stopAllBouncingMarkers = function() {
    var marker;
    while (marker = L.Marker._bouncingMarkers.shift()) {
        marker._bouncingMotion.isBouncing = false;    // stop bouncing
    }
};

/**
 * Adds the marker to the list of bouncing markers. If flag 'exclusive' is
 * set to true, stops all bouncing markers before.
 *
 * @param marker      marker object
 * @param exclusive   flag of exclusive bouncing. If set to true, stops the
 *                    bouncing of all other markers.
 */
L.Marker._addBouncingMarker = function(marker, exclusive) {
    if (exclusive || marker._bouncingOptions.exclusive) {
        L.Marker.stopAllBouncingMarkers();
    } else {
        L.Marker._stopEclusiveMarkerBouncing();
    }
    L.Marker._bouncingMarkers.push(marker);
};

/**
 * Removes the marker from the list of bouncing markers.
 *
 * @param marker    marker object
 */
L.Marker._removeBouncingMarker = function(marker) {
    var i = L.Marker._bouncingMarkers.length;

    if (i) {
        while (i--) {
            if (L.Marker._bouncingMarkers[i] == marker) {
                L.Marker._bouncingMarkers.splice(i, 1);
                break;
            }
        }
    }
};

/**
 * Stops the bouncing of exclusive marker.
 */
L.Marker._stopEclusiveMarkerBouncing = function() {
    var i = L.Marker._bouncingMarkers.length;

    if (i) {
        while (i--) {
            if (L.Marker._bouncingMarkers[i]._bouncingOptions.exclusive) {
                L.Marker._bouncingMarkers[i]._bouncingMotion.isBouncing =
                    false;    // stop bouncing
                L.Marker._bouncingMarkers.splice(i, 1);
            }
        }
    }
};
