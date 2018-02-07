import test from 'ava';
import L from 'leaflet';
import {Marker} from 'leaflet';
import '../src/marker';

test('Test both setBouncingOptions', t => {

    // Given
    const marker = L.marker([48.847547, 2.351074]);

    // When
    Marker.setBouncingOptions({
        contractSpeed: 32
    });
    marker.setBouncingOptions({
        bounceHeight: 100,
        exclusive: true
    });

    // Then
    t.deepEqual(marker._bouncingOptions, {
        bounceHeight: 100,
        contractHeight: 12,
        bounceSpeed: 52,
        contractSpeed: 32,
        shadowAngle: - Math.PI / 4,
        elastic: true,
        exclusive: true
    });
});
