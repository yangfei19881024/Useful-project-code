define(function(require, exports, module){
	var cart;
	
	var commonFun = require('{common}common.fun');
	var Plugs = require('{common}jquery.plugs')($);
	var LazyLoad = require('{common}lazyload')($);
	var CT = require('{cart}cart.fun');
	
	CT.Actions.getCartGoodsAction(PageInit);
	
	function PageInit(datalist)
	{
		/*------------------------------------------------------------------
		@Class: 加载页面
		------------------------------------------------------------------*/
		CT.LoadCartListModule.pushModuleInPage(datalist);
		
		/*------------------------------------------------------------------
		@Class: 加载图片
		------------------------------------------------------------------*/
		$.lazy_init();
		
		/*------------------------------------------------------------------
		@Class: 页面载入后，根据 cookie 选择相应的商品
		------------------------------------------------------------------*/
		CT.Methods.setCheckGoods();
		
		/*------------------------------------------------------------------
		@Class: 页面载入后，计算所选商品的价格/数量
		------------------------------------------------------------------*/
		CT.Methods.calculatorTotalPriceAndCount();	
		
		/*------------------------------------------------------------------
		@Class: 商品数量控制
		------------------------------------------------------------------*/	
		(function(){
			
			$('.icon-minus').on('click', function(){
				
				var _this = $(this);
				var input = _this.next();
				var iNum = input.val();				
				
				commonFun.Methods.hideNumNotice(input, true);
				
				if(_this.hasClass('minus-disabled'))
				{
					return false;
				}
				
				iNum --;				
				input.val(iNum);
				
				commonFun.Methods.formatGoodsNum(input);
				CT.Methods.updateCartGoodsMethod(input);
				
				return false;
				
			});
			
			$('.icon-plus').on('click', function(){
				
				var _this = $(this);
				var input = _this.prev();
				var iNum = input.val();
				
				if(_this.hasClass('plus-disabled'))
				{
					commonFun.Methods.isGoodsNumInMax(input, true);
					return false;
				}
				
				iNum ++;
				input.val(iNum);
							
				commonFun.Methods.formatGoodsNum(input);
				CT.Methods.updateCartGoodsMethod(input);
				
				return false;
				
			});
			
			$('.addCartNum').on('keydown', function(ev){
				
				var _this = $(this);
				var key = ev.keyCode;
				
				if(!commonFun.Methods.detect(key))
				{
					return false;
				}
				
			}).on('keyup', function(){
				
				var _this = $(this);
				
				commonFun.Methods.isGoodsNumInMax(_this, true);
				commonFun.Methods.formatGoodsNum(_this);
				CT.Methods.updateCartGoodsMethod(_this);
				
			}).on('blur', function(){
				
				var _this = $(this);
				
				commonFun.Methods.hideNumNotice(_this, true);
				commonFun.Methods.formatGoodsNum(_this);
				CT.Methods.updateCartGoodsMethod(_this);
				
			});
			
		})();
	
		/*------------------------------------------------------------------
		@Class: 鼠标经过小图时，显示大图
		------------------------------------------------------------------*/
		(function(){
			
			var oBody = $('body');
			var cart_image = $('.cart-image img');
			var oViewPic = null;
			
			cart_image.on('mouseover', function(){
				
				var _this = $(this);
				var _this_left = _this.offset().left;
				var _this_top = _this.offset().top;
				var _this_width = _this.outerWidth();
				var _this_height = _this.outerHeight();
				var iLeft = _this_left + _this_width + 12;
				var iTop = _this_top;
				var image_src = _this.attr('data-pic');
				var view_picture = '<div class="view_picture" style="left:'+ iLeft +'px; top:'+ iTop +'px;"><img src="'+ image_src +'" width="316" height="316" class="vt" /></div>';
				
				oViewPic = $(view_picture);
				
				oBody.append(oViewPic);
				
				oViewPic.fadeIn();
				
			}).on('mouseout', function(){
				
				oViewPic.remove();
				
			});
			
		})();
		
		/*------------------------------------------------------------------
		@Class: 商品选择
		------------------------------------------------------------------*/
		// 选择所有商品
		$('span[data-class="checkAll"]').on('click', function(){
			
			var _this = $(this);
			var bCheck = _this.hasClass('checkbox');
			var cartWrap = _this.parents(CT.Datas.cartWrap);
			var goods = $('span[data-class="goods"]', cartWrap);
			
			commonFun.Methods.checkbox('span[data-class="checkAll"]');
			
			if(bCheck)
			{
				commonFun.Methods.checkbox(goods, 'uncheck');
				commonFun.Methods.checkbox('span[data-class="checkAgent"]', 'uncheck');
			}
			else
			{
				commonFun.Methods.checkbox(goods, 'check');
				commonFun.Methods.checkbox('span[data-class="checkAgent"]', 'check');
			}
			
			CT.Methods.saveCookie('.checkbox[data-class="goods"]');
			
		});
		
		// 选择店铺下面的所有商品
		$('span[data-class="checkAgent"]').on('click', function(){
			
			var _this = $(this);
			var bCheck = _this.hasClass('checkbox');
			var agent = _this.parents('.cartAgent');
			var goods = $('span[data-class="goods"]', agent);
			
			commonFun.Methods.checkbox(_this);
			CT.Methods.checkAllGoods('span[data-class="checkAll"]');
			
			if(bCheck)
			{
				commonFun.Methods.checkbox(goods, 'uncheck');
			}
			else
			{
				commonFun.Methods.checkbox(goods, 'check');
			}
			
			CT.Methods.saveCookie('.checkbox[data-class="goods"]');
			
		});
		
		// 选择单个商品
		$('span[data-class="goods"]').on('click', function(event){
			
			var _this = $(this);
			
			commonFun.Methods.checkbox(_this);
			CT.Methods.checkAgent('[data-class="checkAgent"]');
			CT.Methods.checkAllGoods('span[data-class="checkAll"]');
			CT.Methods.saveCookie('.checkbox[data-class="goods"]');
			
		});
		
		/*------------------------------------------------------------------
		@Class: 删除商品
		------------------------------------------------------------------*/		
		// 删除单个商品
		$('a[data-class=cart-delete]').on('click', function(){
			
			var _this = $(this);
			var oParent = _this.parent();
			var base = oParent.parent(CT.Datas.cartGoods);
			
			var cartDialog = $('<div class="cart-dialog pa" style="width:112px; right:0; bottom:12px;"></div>');
			var submits = $('<a href="javascript:;" class="button-light-50 fl anim-all" data-action="submit">删除</a>');
			var cancel = $('<a href="javascript:;" class="button-default-50 ml12 fl anim-all" data-action="cancel">取消</a>');
			
			cartDialog.append(submits);
			cartDialog.append(cancel);		
			oParent.append(cartDialog);
			
			CT.Events.regRemoveGoodsEvent(submits, base);
			CT.Events.regCancelRemoveEvent(cancel, cartDialog);
			
			return false;
			
		});
		
		//批量删除商品 / 清除失效商品	
		$('a[data-class=batchDelete]').on('click', function(){
			
			var _this = $(this);
			var did = _this.attr('data-id');
			
			if(did != 'lose')
			{
				var aCheckGoods = $(CT.Datas.cartBody).find('.checkbox');
				var aCheckGoods_leng = aCheckGoods.length;
				
				if(aCheckGoods_leng <= 0)
				{
					CT.Methods.removeGoodsNotice('您未选择商品！');
					
					return false;
				}
			}
			
			var content = '<div class="pt12 tc clearfix">'
						 +'    <p class="f14">确定要删除这些商品么？</p>'
						 +'    <div class="pt24 clearfix">'
						 +'        <a href="javascript:;" class="button-light-100 anim-all" data-action="submit">确定</a>'
						 +'        <a href="javascript:;" class="button-default-100 ml12 anim-all" data-action="close">取消</a>'
						 +'    </div>'
						 +'</div>';
				
			$.block({
				title: ' ',
				content: content
			});
			
			if(did == 'lose')
			{
				CT.Events.regBatchRemoveLoseEvent('a[data-action=submit]');
			}
			else
			{
				CT.Events.regBatchRemoveEvent('a[data-action=submit]');
			}
			
			$('a[data-action=submit]').on('click', function(){
				
				$.unblock();
				
				return false;
			});
			
			$('a[data-action=close]').on('click', function(){
				
				$.unblock();
				
				return false;
			});
			
			return false;
			
		});
	
		/*------------------------------------------------------------------
		@Class: 结算
		------------------------------------------------------------------*/
		$('a[data-class=totalButton]').bind('click', function(){
			
			var _this = $(this);
			
			if(_this.hasClass('button-notFund'))
			{
				return false;
			}		
					
			delete CT.Datas.CART_LIST;
			
			CT.Methods.isLoseGoods();
			
			if(_this.hasClass('button-notFund'))
			{
				return false;
			}
			
			var isLogin = commonFun.Actions.isLoginAction();
		
			//console.log(isLogin);
			
			if(!isLogin)
			{
				$('.header [data-action=login]').trigger('click');
				return false;
			}
			
			var totalTip = '<div class="cartTipInfo">'
						  +'	<p>正在转向订单信息页面，请稍候</p>'
						  +'</div>';
			
			_this.after(totalTip);
			
			$('#cart_submit').submit();
			
			return false;
			
		});
	}
	
    module.exports = cart;
});