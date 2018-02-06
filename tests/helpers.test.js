import test from 'ava';
import * as Helpers from '../src/helpers';

test('Tests parseCssText', t => {

    // Given
    const cssText = 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px;';

    // When
    const cssObject = Helpers.parseCssText(cssText);

    // Then
    t.deepEqual(cssObject, {
        height: '41px',
        width: '25px',
        'margin-left': '-12px',
        'margin-top': '-41px'
    });
});

test('Tests renderCssText', t => {

    // Given
    const styleDefinitions = {
        height: '41px',
        width: '25px',
        'margin-left': '-12px',
        'margin-top': '-41px'
    };

    // When
    const cssText = Helpers.renderCssText(styleDefinitions);

    // Then
    t.true(cssText.includes('margin-left: -12px;'));
    t.true(cssText.includes('margin-top: -41px;'));
    t.true(cssText.includes('width: 25px;'));
    t.true(cssText.includes('height: 41px;'));
});

test('Tests calculateLine', t => {

    // Given
    const x = 100,
        y = 100,
        angle = - Math.PI / 4,
        length = 30;

    // When
    const line = Helpers.calculateLine(x, y, angle, length);

    // Then
    t.deepEqual(line, [
        [ 100, 100 ],
        [ 101, 99 ],
        [ 102, 98 ],
        [ 103, 97 ],
        [ 104, 96 ],
        [ 105, 95 ],
        [ 106, 94 ],
        [ 107, 93 ],
        [ 108, 92 ],
        [ 109, 91 ],
        [ 110, 90 ],
        [ 111, 89 ],
        [ 112, 88 ],
        [ 113, 87 ],
        [ 114, 86 ],
        [ 115, 85 ],
        [ 116, 84 ],
        [ 117, 83 ],
        [ 118, 82 ],
        [ 119, 81 ],
        [ 120, 80 ],
        [ 121, 79 ],
        [ 122, 78 ],
        [ 123, 77 ],
        [ 124, 76 ],
        [ 125, 75 ],
        [ 126, 74 ],
        [ 127, 73 ],
        [ 128, 72 ],
        [ 129, 71 ]
    ]);
});

test('Tests calculateIconMovePoints', t => {

    // Given
    const x = 100,
        y = 100,
        length = 30;

    // When
    const points = Helpers.calculateIconMovePoints(x, y, length);

    // Then
    t.deepEqual(points, [
        [ 100, 100 ],
        [ 100, 99 ],
        [ 100, 98 ],
        [ 100, 97 ],
        [ 100, 96 ],
        [ 100, 95 ],
        [ 100, 94 ],
        [ 100, 93 ],
        [ 100, 92 ],
        [ 100, 91 ],
        [ 100, 90 ],
        [ 100, 89 ],
        [ 100, 88 ],
        [ 100, 87 ],
        [ 100, 86 ],
        [ 100, 85 ],
        [ 100, 84 ],
        [ 100, 83 ],
        [ 100, 82 ],
        [ 100, 81 ],
        [ 100, 80 ],
        [ 100, 79 ],
        [ 100, 78 ],
        [ 100, 77 ],
        [ 100, 76 ],
        [ 100, 75 ],
        [ 100, 74 ],
        [ 100, 73 ],
        [ 100, 72 ],
        [ 100, 71 ],
        [ 100, 70 ]
    ]);
});

test('Tests calculateShadowMovePoints with angle', t => {

    // Given
    const x = 100,
        y = 100,
        bounceHeight = 30,
        angle = - Math.PI / 4;

    // When
    const points = Helpers.calculateShadowMovePoints(x, y, bounceHeight, angle);

    // Then
    t.deepEqual(points, [
        [ 100, 100 ],
        [ 101, 99 ],
        [ 102, 98 ],
        [ 103, 97 ],
        [ 104, 96 ],
        [ 105, 95 ],
        [ 106, 94 ],
        [ 107, 93 ],
        [ 108, 92 ],
        [ 109, 91 ],
        [ 110, 90 ],
        [ 111, 89 ],
        [ 112, 88 ],
        [ 113, 87 ],
        [ 114, 86 ],
        [ 115, 85 ],
        [ 116, 84 ],
        [ 117, 83 ],
        [ 118, 82 ],
        [ 119, 81 ],
        [ 120, 80 ],
        [ 121, 79 ],
        [ 122, 78 ],
        [ 123, 77 ],
        [ 124, 76 ],
        [ 125, 75 ],
        [ 126, 74 ],
        [ 127, 73 ],
        [ 128, 72 ],
        [ 129, 71 ],
        [ 130, 70 ],
    ]);
});

test('Tests calculateShadowMovePoints with null angle', t => {

    // Given
    const x = 100,
        y = 100,
        bounceHeight = 5;

    // When
    const points = Helpers.calculateShadowMovePoints(x, y, bounceHeight, null);

    // Then
    t.deepEqual(points, [
        [ 100, 100 ],
        [ 100, 100 ],
        [ 100, 100 ],
        [ 100, 100 ],
        [ 100, 100 ],
        [ 100, 100 ]
    ]);
});
