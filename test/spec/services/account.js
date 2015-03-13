(function() {
// 'use strict';

describe('Account', function () {
	var Account;
	beforeEach(module('titanApp'));
	beforeEach(inject(function (_$timeout_, _Account_) {
		$timeout = _$timeout_;
		Account = _Account_;
	}));

	// body...
});

})();