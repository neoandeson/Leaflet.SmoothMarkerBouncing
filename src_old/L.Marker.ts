import {BouncingOptions} from "./BouncingOptions";
import {L, Marker} from "leaflet";

/**
 * Extension of L.Marker to add bouncing.
 *
 * @author hosuaby
 */
declare global {
    namespace L {
        class Marker {
            public static setBouncingOptions(options: BouncingOptions);
            public static getBouncingMarkers(): L.Marker[];
            public static stopAllBouncingMarkers();

            private static _addBouncingMarker(marker: L.Marker, exclusive: boolean);
            private static _removeBouncingMarker(marker: L.Marker);
            private static _stopEclusiveMarkerBouncing();
            private static _bouncingMarkers: Marker[];

            public setBouncingOptions(options: BouncingOptions);
            public isBouncing(): boolean;
            public bounce(times?: number);
            public stopBouncing(): L.Marker;
            public toggleBouncing(): L.Marker;

            private _calculateTimeline();
            private _calculateTransforms();
            _bouncingOptions: BouncingOptions;
        }
    }
}

L.Marker._bouncingMarkers = [];     // array of bouncing markers

/**
 * Registers default options of bouncing animation.
 *
 * @param options  object with options
 */
L.Marker.setBouncingOptions = function(options: BouncingOptions) {
    L.extend(L.Marker.prototype._bouncingOptions, options);
};

/**
 * Returns array of currently bouncing markers.
 *
 * @return array of bouncing markers
 */
L.Marker.getBouncingMarkers = function(): L.Marker[] {
    return L.Marker._bouncingMarkers;
};

/**
 * Stops the bouncing of all currently bouncing markers. Purge the array of bouncing markers.
 */
L.Marker.stopAllBouncingMarkers = function() {
    var marker;

    while (marker = L.Marker._bouncingMarkers.shift()) {
        marker._bouncingMotion.isBouncing = false;    // stop bouncing
    }
};

/**
 * Adds the marker to the list of bouncing markers. If flag 'exclusive' is set to true, stops all
 * bouncing markers before.
 *
 * @param marker  marker object
 * @param exclusive  flag of exclusive bouncing. If set to true, stops the bouncing of all other
 *      markers.
 */
L.Marker._addBouncingMarker = function(marker: L.Marker, exclusive: boolean) {
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
 * @param marker  marker object
 */
L.Marker._removeBouncingMarker = function(marker: L.Marker) {
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
