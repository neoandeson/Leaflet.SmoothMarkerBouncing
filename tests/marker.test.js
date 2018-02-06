import test from 'ava';
import L from 'leaflet';
import '../src/marker';

test('Tests marker#setBouncingOptions', t => {

    // Given
    const marker = L.marker([48.847547, 2.351074]);

    // When
    marker.setBouncingOptions({
        bounceHeight: 100,
        exclusive: true
    });

    // Then
    t.deepEqual(marker._bouncingOptions, {
        bounceHeight: 100,
        contractHeight: 12,
        bounceSpeed: 52,
        contractSpeed: 52,
        shadowAngle: - Math.PI / 4,
        elastic: true,
        exclusive: true
    });
});
