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
