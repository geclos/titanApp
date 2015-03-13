(function() {
// 'use strict';

describe('Account', function () {
	var Account;
	beforeEach(module('titanApp', 'firebase'));
	beforeEach(inject(function (_$timeout_, _Account_) {
		$timeout = _$timeout_;
		Account = _Account_;
	}));

	it('Should get or set a new account from server', function (done) {
		var authData = {
			uid: 1,
			firstName: 'Gerard',
			lastName: 'Clos' 
		};
		MockFirebase.override();
		var account = Account.getAccount(authData).then(function (data) {
			return data;
		});
		expect(account.firstName).toEqual('Gerard');
	});
});

})();