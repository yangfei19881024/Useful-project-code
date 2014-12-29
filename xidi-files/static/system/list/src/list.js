define(function(require, exports, module){
	var list;	
	
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
		moreCategory('.more-category', '.filter-box');
		commonFun.cart.regMouseoverGoodsModuleEvent();
		commonFun.cart.regDetailAttrEvent();
		commonFun.cart.regAddCartEvent();
		CATE.Methods.initGoodsInfoMethod('[data-class=category][data-goodsInfo-id]');
	}
	
	function moreCategory(button, catebox)
	{
		var button = (typeof button == 'string') ? $(button) : button;
		var catebox = (typeof catebox == 'string') ? $(catebox) : catebox;
		var cateMoreList = catebox.children(':gt(3)');
		var CK_MORELIST = isUserFilter();
		var bShow = true;
		
		if(!cateMoreList.length)
		{
			button.remove();
			return false;
		}
		
		if(CK_MORELIST == 1)
		{
			fnShow(button);
		}
		else
		{
			fnHide(button);
		}
		
		button.on('click', function(){
			
			var _this = $(this);
			
			if(bShow)
			{
				fnShow(_this);
			}
			else
			{
				fnHide(_this);
			}
			
			return false;
			
		});		
		
		function fnHide(_this)
		{
			cateMoreList.addClass('hide');
			_this.removeClass('more-category-current').text('更多');
			bShow = true;			
		}		
		
		function fnShow(_this)
		{
			cateMoreList.removeClass('hide');
			_this.addClass('more-category-current').text('收起');
			bShow = false;			
		}
	}
	
	function isUserFilter()
	{
		var aUserSelect = $('.pro-cate-current');
		var isFilter = 0;
		
		aUserSelect.each(function(index, element) {
            
			var _this = $(this);
			var nowIndex = _this.index();
			var oDl = _this.parent('.pro-cate-list').parent('dl');
			var dlIndex = oDl.index();
			
			if(dlIndex > 3 && nowIndex != 0)
			{
				isFilter = 1;
			}
			
        });
		
		return isFilter;
	}
	
    module.exports = list;
});