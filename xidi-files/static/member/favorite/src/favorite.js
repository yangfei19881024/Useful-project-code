define(function(require, exports, module){
	var favorite;	
	
	var commonFun = require('{common}common.fun');
	
	commonFun.cart.regMouseoverGoodsModuleEvent();
	commonFun.cart.regDetailAttrEvent();
	commonFun.cart.regAddCartEvent();
	
	// 添加/取消 收藏
	$('.add-favorite > [data-class=favorite]').each(function(index, element) {
        
		var _this = $(this);
		
		commonFun.Favorite.regFavoriteCollectEvent(_this, '.pro-item');
		
    });
	
    module.exports = favorite;
});