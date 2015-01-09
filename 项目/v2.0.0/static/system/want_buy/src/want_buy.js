define(function(require, exports, module){
	var want_buy;	
	
	require('static/global/common/2.0.0/lazyload.js')($);
	var CATE = require('static/global/common/2.0.0/category.fun.js');

	// 图片懒加载
    $.lazy_init();
	
	/*$('.products-outer').on('mouseenter', function(){
		
		var _this = $(this);
		
		CATE.Methods.isGetGoodsInfo(_this, CATE.Methods.getGoodsImage);
		
		CATE.Events.listSelectedAttr(_this);
		
	});
	
	CATE.Events.clickAddCartButton('.add-cart-button');
	
	CATE.Events.clickFavoriteButton('[data-class="favorite"]', '.products-outer');*/
	
    module.exports = want_buy;
});