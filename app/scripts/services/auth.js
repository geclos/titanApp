(function() {
'use strict';

/**
* titanApp Module
*
* Description
*/
angular
	.module('titanApp')
	.factory('Auth', authService);

authService.$inject('$firebaseAuth');

function authService ($firebaseAuth) {
	// body...
}

})();