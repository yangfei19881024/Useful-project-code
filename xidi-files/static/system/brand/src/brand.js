define(function(require, exports, module){
	var brand;	
	
	var commonFun = require('{common}common.fun');
	var CATE = require('{common}category.fun');
	
	init();
	
	// 添加/取消 收藏
	$('.add-favorite > [data-class=favorite]').each(function(index, element) {
        
		var _this = $(this);
		
		commonFun.Favorite.regProductCollectEvent(_this, '.pro-item');
		
    });
	
	function init()
	{
		commonFun.cart.regMouseoverGoodsModuleEvent();
		commonFun.cart.regDetailAttrEvent();
		commonFun.cart.regAddCartEvent();
		CATE.Methods.initGoodsInfoMethod('[data-class=category][data-goodsInfo-id]');
	}
	
    module.exports = brand;
});