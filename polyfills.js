/* eslint no-extend-native: 0 */
// core-js comes with Next.js. So, you can import it like below
import includes from 'core-js/library/fn/string/virtual/includes';
import repeat from 'core-js/library/fn/string/virtual/repeat';
import assign from 'core-js/library/fn/object/assign';
import 'core-js/es6/set';
import 'core-js/es6/map';
import 'core-js/es7/array';


if (typeof Promise === 'undefined') {
	// Rejection tracking prevents a common issue where React gets into an
	// inconsistent state due to an error, but it gets swallowed by a Promise,
	// and the user has no idea what causes React's erratic future behavior.
	require('promise/lib/rejection-tracking').enable();
	window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

// IE 에서 promise 를 쓰기 위해 polyfill 설정 추가
require('es6-promise').polyfill();

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
//Object.assign = require('object-assign');

// Add your polyfills
// This files runs at the very beginning (even before React and Next.js core)
console.log('Load your polyfills')

String.prototype.includes = includes
String.prototype.repeat = repeat
Object.assign = assign