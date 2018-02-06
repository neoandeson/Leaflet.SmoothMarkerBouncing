import test from 'ava';
import {helpers} from '../src/helpers';

test('Tests helpers#parseCssText', t => {

    // Given
    const cssText = 'margin-left: -12px; margin-top: -41px; width: 25px; height: 41px;';

    // When
    const cssObject = helpers.parseCssText(cssText);

    // Then
    t.deepEqual(cssObject, {
        height: '41px',
        width: '25px',
        'margin-left': '-12px',
        'margin-top': '-41px'
    });
});

test('Tests helpers#renderCssText', t => {

    // Given
    const styleDefinitions = {
        height: '41px',
        width: '25px',
        'margin-left': '-12px',
        'margin-top': '-41px'
    };

    // When
    const cssText = helpers.renderCssText(styleDefinitions);

    // Then
    t.true(cssText.includes('margin-left: -12px;'));
    t.true(cssText.includes('margin-top: -41px;'));
    t.true(cssText.includes('width: 25px;'));
    t.true(cssText.includes('height: 41px;'));
});

test('Tests helpers#calculateLine', t => {

    // Given
    const x = 100,
        y = 100,
        angle = - Math.PI / 4,
        length = 30;

    // When
    const line = helpers.calculateLine(x, y, angle, length);

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
