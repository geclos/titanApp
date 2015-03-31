describe('retrieving image from content', function() {
	var Post;
	beforeEach(function() {
		module('titanApp');
		inject(function ($injector) {
			Post = $injector.get('Post');
		})
	});

	var content = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. <img src="adkjfdskjfdskfhlsdkhsdkghfk" alt="dlkjhdlkjfasfasdkfhdsalfhsdal">Consectetur assumenda laudantium <img src="adkjfdskjfdskfhlsdkhsdkghfk" alt="dlkjhdlkjfasfasdkfhdsalfhsdal"> ex recusandae culpa porro, reiciendis eum aperiam quidem, sed quibusdam fugiat! Doloremque, ut, eius! Perferendis laborum ut minima odio!';
	
	it('retrieves an img tag from an html string', function() {
		var imgSrc = Post.stripImg(content);
		expect(imgSrc).toEqual('adkjfdskjfdskfhlsdkhsdkghfk');	
	});
});