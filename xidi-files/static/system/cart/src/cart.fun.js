define(function(require, exports, module){
	var CT = {};
	
	var commonFun = require('{common}common.fun');
	
	/*------------------------------------------------------------------
	@Class: 常用数据
	------------------------------------------------------------------*/
	CT.Datas = {
		timer: null,
		C_LIST_URL: 'http://www.xidibuy.com/Cart/cList',
		C_DEL_URL: 'http://www.xidibuy.com/Cart/del',
		C_ADD_URL: 'http://www.xidibuy.com/Cart/add',
		C_EDIT_URL: 'http://www.xidibuy.com/Cart/up',
		cartWrap: '.cart-wrap',
		cartHead: '.cartHead',
		cartBody: '.cartBody',
		cartFoot: '.cartFoot',
		cartAgent: '.cartAgent',
		cartGoods: '.cartGoods',
		loseGoods: '.cartGoods-disabled',
		price: '[data-class="price"]',
		subtotal: '[data-class="subtotal"]',
		totalPrice: '[data-class="totalPrice"]',
		count: '[data-class="count"]',
		totalButton: '[data-class="totalButton"]',
		shelvedNum: 0
	};
	
	/*------------------------------------------------------------------
	@Class: AJAX 请求
	------------------------------------------------------------------*/
	CT.Actions = {
		/*---------------------------------------------
		@Class: 获取购物车中的商品
		---------------------------------------------*/
		getCartGoodsAction: function(callback)
		{
			$.ajax({
				type: 'GET',
				url: CT.Datas.C_LIST_URL + '?jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						callback && callback(ajaxData);
					}
					else
					{
						//console.log('faild');
					}
				},
				error: function()
				{
					//console.log('error');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 删除商品的通用 AJAX 请求
		---------------------------------------------*/
		removeGoodsAction: function(removeId, callback)
		{
			var removeId = $.isArray(removeId) ? ('['+ removeId +']') : removeId;
			
			$.ajax({
				type: 'POST',
				url: CT.Datas.C_DEL_URL + '?removeId='+ removeId + '&jsoncallback=?',
				data: {
					removeId: removeId,
					jsoncallback: '?'
				},
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						$(CT.Datas.totalPrice).text(ajaxData.data.amount);
						$(CT.Datas.count).text(ajaxData.data.buyNum);
						
						//commonFun.cart.getCartNum();
						
						callback && callback(removeId, ajaxData);
					}
				},
				error: function(ajaxData)
				{
					//console.log('删除失败！');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 更新购物车中的商品
		---------------------------------------------*/
		updateCartGoodsAction: function(pid, pnum)
		{
			var datas = {};
				datas.productId = '{"' + pid + '":' + pnum + "}";
			
			$.ajax({
				type: 'GET',
				url: CT.Datas.C_EDIT_URL + '?productId=' + datas.productId + '&jsoncallback=?',
				async: false,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					//console.log(ajaxData)
					
					if(ajaxData.code == 0)
					{					
						//console.log('success');
						
						$(XD.data.topCart).text(ajaxData.data.buyNum);
					}
					else
					{
						//console.log('faild');
					}
				},
				error: function()
				{
					//console.log('error');
				}
			});
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 载入购物车里的商品
	------------------------------------------------------------------*/
	CT.LoadCartListModule = {
		/*---------------------------------------------
		@Class: 将创建好的模块扔到页面中
		---------------------------------------------*/
		pushModuleInPage: function(datalist)
		{
			var cartWrap = $(CT.Datas.cartWrap);
			
			var cartHeadContent = CT.LoadCartListModule.createCartHeadModule();
			var cartBodyContent = CT.LoadCartListModule.createCartBodyModule(datalist);
			var cartFootContent = CT.LoadCartListModule.createCartFootModule(CT.Datas.shelvedNum);
			
			cartWrap.html(cartHeadContent + cartBodyContent + cartFootContent);
		},
		
		/*---------------------------------------------
		@Class: 创建购物车列表模块的头部
		---------------------------------------------*/
		createCartHeadModule: function()
		{
			var cartHeadHtml = '<div class="cartHead clearfix">'
							   +'	<div class="cart-check fl">'
							   +'		<div class="pl12">'
							   +'			<span class="uncheckbox sprites" data-class="checkAll"></span>'
							   +'		</div>'
							   +'	</div>'
							   +'	'
							   +'	<div class="cart-image fl">'
							   +'		<p class="pl12">全选</p>'
							   +'	</div>'
							   +'	'
							   +'	<div class="cart-goods fl">'
							   +'		<p class="pl24">商品</p>'
							   +'	</div>'
							   +'	'
							   +'	<div class="cart-price fl">'
							   +'		单价'
							   +'	</div>'
							   +'	'
							   +'	<div class="cart-count fl">'
							   +'		数量'
							   +'	</div>'
							   +'	'
							   +'	<div class="cart-sum fl">'
							   +'		<p class="pr24">小计</p>'
							   +'	</div>'
							   +'</div>';
			
			return cartHeadHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建购物车列表模块的底部
		---------------------------------------------*/
		createCartFootModule: function(shelvedNum)
		{
			var clearShelvedGoods = '';
			
			if(CT.Datas.shelvedNum > 0)
			{
				clearShelvedGoods = '<p class="pl24 fl"><a href="javascript:;" class="color-blue" data-class="batchDelete" data-id="lose">清除失效商品</a></p>';
			}
			
			var cartFootHtml = '<div class="cartFoot pt12 clearfix">'
							  +'	<div class="cart-check fl">'
							  +'		<div class="pl12">'
							  +'			<span class="sprites uncheckbox" data-class="checkAll"></span>'
							  +'		</div>'
							  +'	</div>'
							  +'	'
							  +'	<div class="fl">'
							  +'		<p class="pl12 fl">全选</p>'
							  +'		<p class="pl24 fl"><a href="javascript:;" class="color-blue" data-class="batchDelete" data-id="">删除</a></p>'
							  +			clearShelvedGoods
							  +'	</div>'
							  +'</div>';
			
			return cartFootHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建购物车列表模块的主体
		---------------------------------------------*/
		createCartBodyModule: function(datalist)
		{		
			var cartData = datalist.data;
			var shopItem = cartData.shopItem;
			
			var cartBodyHtml = '<div class="cartBody clearfix">'
							  + 	CT.LoadCartListModule.createShopModule(shopItem)
							  +'</div>';
			
			return cartBodyHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建店铺模块
		---------------------------------------------*/
		createShopModule: function(shopItem)
		{
			var shopModuleHtml = '';
			
			for(var shopKey in shopItem)
			{
				var shop = shopItem[shopKey];
				var goodsItem = shop.goodsItem;
				
				shopModuleHtml += '<div class="cartAgent clearfix">'
								 +	CT.LoadCartListModule.createShopHeadModule(shop)
								 +'	'
								 +'	<div class="cartList table">'
								 +		CT.LoadCartListModule.createGoodsModule(goodsItem)
								 +'	</div>'
								 +'</div>';			
			}
			
			return shopModuleHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建店铺头部模块
		---------------------------------------------*/
		createShopHeadModule: function(shop)
		{
			var shopName = shop.shopname;
			var shopIsShelved = shop.shopIsShelved;
			var agentId = shop.agentId;
			var shopId = shop.id;
			var shopLink ='http://www.xidibuy.com/brand/list?sid=' + shopId;
			var shopHeadHtml = '';
			
			shopHeadHtml = '<div class="cartHead clearfix">'
						  +'	<div class="cart-check fl" data-class="cart-agent-check">'
						  +		CT.LoadCartListModule.isShowCheckBox(shopIsShelved)
						  +'	</div>'
						  +'	'
						  +'	<div class="pl12 fl">'
						  +'		<a href="'+ shopLink +'" class="color-blue fl">'+ shopName +'</a>'
						  +'		<a href="javascript:;" class="icon-mail sprites fl" data-state="pm" data-to="'+ shopName +'" data-to_id="'+ agentId +'" data-shop_id="'+ shopId +'" title="联系商家"></a>'
						  +'	</div>'
						  +'</div>';
			
			return shopHeadHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建商品模块
		---------------------------------------------*/
		createGoodsModule: function(goodsItem)
		{
			var goodsInfoHtml = '';
			
			for(var key in goodsItem)
			{	
				var goods = goodsItem[key];
				var isShelved = goods.isShelved;
				var coverImg = goods.coverImg;
				var goodsImg = IMAGE_DOMAIN + coverImg;
				var goodsName = goods.name;
				var priceAttr = goods.priceAttr;
				var price = goods.price;
				var buyNum = goods.buyNum;
				var total = goods.total;
				var goodsId = goods.goodsId;
				var goodsLink = 'http://www.xidibuy.com/detail/?id=' + goodsId;
				var skuNum = goods.skuNum;
				var cartGoodsDisabled = 'cartGoods-disabled';
				
				if(isShelved == 1)
				{
					cartGoodsDisabled = '';
				}
				else
				{
					CT.Datas.shelvedNum = 1;
				}
				
				goodsInfoHtml += '<div class="cartGoods table-row '+ cartGoodsDisabled +'">'
								+'	<div class="cart-check table-cell">'
								+		CT.LoadCartListModule.isShowCheckBox(isShelved, goodsId, buyNum)
								+'	</div>'
								+'	'
								+'	<div class="cart-image table-cell">'
								+'		<div class="pl12">'
								+			CT.LoadCartListModule.createGoodsImageModule(goodsLink, goodsName, goodsImg, isShelved)
								+'		</div>'
								+'	</div>'
								+'	'
								+'	<div class="cart-goods table-cell">'
								+'		<div class="pl24">'
								+			CT.LoadCartListModule.createGoodsNameModule(goodsLink, goodsName, isShelved)
								+			CT.LoadCartListModule.createGoodsAttrModule(priceAttr)
								+'		</div>'
								+'	</div>'
								+'	'
								+'	<div class="cart-price table-cell">'
								+'		<!--<p class="price-del f14"></p>-->'
								+'		<p class="f14" data-class="price">'+ price +'</p>'
								+'		<!--<p></p>-->'
								+'	</div>'
								+'	'
								+	CT.LoadCartListModule.createGoodsNumModule(goodsId, buyNum, skuNum , isShelved)
								+'	'
								+'	<div class="cart-sum table-cell">'
								+'		<p class="color-green f14 pr12"><var data-class="subtotal">'+ total +'</var></p>'
								+'		<a href="javascript:;" class="icon-delete sprites" data-class="cart-delete">&nbsp;</a>'
								+'	</div>'
								+'</div>';
			}
			
			return goodsInfoHtml;
		},
		
		/*---------------------------------------------
		@Class: 根据 IsShelved 来确定是否显示复选框
		---------------------------------------------*/
		isShowCheckBox: function(IsShelved, goodsId, buyNum)
		{
			var count = 0;
			var resultHtml = '';
			
			if(goodsId && buyNum)
			{
				count = IsShelved;
			}
			else
			{
				for(var key in IsShelved)
				{
					if(IsShelved[key] == 1)
					{
						count ++;
					}
				}
			}
			
			if(count > 0 && goodsId && buyNum)
			{
				resultHtml = '<div class="pl12">'
							+'	<span class="uncheckbox sprites" data-class="goods" for="productId_goods_'+ goodsId +'">'
							+'		<input type="checkbox" name="productId['+ goodsId +']" id="productId_goods_'+ goodsId +'" class="checkGoods hide" value="'+ buyNum +'" data-goods-id="'+ goodsId +'" />'
							+'	</span>'
							+'</div>';
			}
			else if(count > 0)
			{
				resultHtml = '<div class="pl12">'
							+'	<span class="uncheckbox sprites" data-class="checkAgent"></span>'
							+'</div>';
			}
			else
			{
				resultHtml = '<p class="tr">失效</p>';
			}
			
			return resultHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建商品图片模块
		---------------------------------------------*/
		createGoodsImageModule: function(goodsLink, goodsName, goodsImg, isShelved)
		{
			var goodsImageHtml = '';
			
			if(isShelved == 1)
			{
				goodsImageHtml = '<a href="'+ goodsLink +'" target="_blank" title="'+ goodsName +'"><img src="" width="132" height="132" data-image="'+ goodsImg +'/132" data-pic="'+ goodsImg +'/316" data-class="lazyload" /></a>';
			}
			else
			{
				goodsImageHtml = '<img src="" width="132" height="132" class="op5" data-image="'+ goodsImg +'/132" data-pic="'+ goodsImg +'/316" data-class="lazyload" />';
			}
			
			return goodsImageHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建商品名称模块
		---------------------------------------------*/
		createGoodsNameModule: function(goodsLink, goodsName, isShelved)
		{
			var goodsNameHtml = '';
			
			if(isShelved == 1)
			{
				goodsNameHtml = '<p class="pb12 f13" data-class="goods-name"><a href="'+ goodsLink +'" target="_blank" title="'+ goodsName +'">'+ goodsName +'</a></p>';
			}
			else
			{
				goodsNameHtml = goodsName;
			}
			
			return goodsNameHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建商品属性模块
		---------------------------------------------*/
		createGoodsAttrModule: function(aPriceAttr)
		{
			var goodsAttrHtml = '';
			
			for(var i in aPriceAttr)
			{
				goodsAttrHtml += '<p>'+ aPriceAttr[i].type +'：'+ aPriceAttr[i].curChildren +'</p>';
			}
			
			return goodsAttrHtml;
		},
		
		/*---------------------------------------------
		@Class: 创建商品的数量控制模块
		---------------------------------------------*/
		createGoodsNumModule: function(goodsId, buyNum, skuNum, isShelved)
		{
			var inputDisabled = '';
			var minusDisabled = '';
			var plusDisabled = '';
			var hideClass = '';
			var goodsNumHtml = '';
			
			if(buyNum > skuNum)
			{
				plusDisabled = 'plus-disabled';
			}
			else if(buyNum == skuNum)
			{
				hideClass = 'hide';
				plusDisabled = 'plus-disabled';
			}
			else if(buyNum == 1)
			{
				hideClass = 'hide';
				minusDisabled = 'minus-disabled';
			}
			else
			{
				hideClass = 'hide';
			}
			
			if(buyNum == 1 && skuNum == 1)
			{
				hideClass = 'hide';
				inputDisabled = 'disabled="disabled"';
				plusDisabled = 'plus-disabled';
				minusDisabled = 'minus-disabled';
			}
			
			if(isShelved == 1)
			{
				goodsNumHtml = '<div class="cart-count table-cell">'
							   +'	<div class="addCartOperBox">'
							   +'		<a href="javascript:;" class="icon-minus sprites fl '+ minusDisabled +'">-</a>'
							   +'		<input type="text" class="addCartNum fl" value="'+ buyNum +'" '+ inputDisabled +' data-val="'+ buyNum +'" data-min="1" data-max="'+ skuNum +'" data-pid="'+ goodsId +'" data-class="pid" />'
							   +'		<a href="javascript:;" class="icon-plus sprites fl '+ plusDisabled +'">+</a>'
							   +'	</div>'
							   +'	<p class="color-red '+ hideClass +'" data-class="cart-tip">最多只能购买 <var data-class="max-num">'+ skuNum +'</var> 件</p>'
							   +'</div>';
			}
			else
			{
				goodsNumHtml = '<div class="cart-count table-cell">'
							   +'	<p>'+ buyNum +'</p>'
							   +'	<input type="hidden" value="'+ buyNum +'" data-min="1" data-max="'+ skuNum +'" data-pid="'+ goodsId +'" data-class="pid" />'
							   +'</div>';
			}
			
			return goodsNumHtml;
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 操作方法
	------------------------------------------------------------------*/
	CT.Methods = {
		/*---------------------------------------------
		@Class: 选择当前店铺下的所有商品
		---------------------------------------------*/
		checkAgent: function(checkAgent)
		{
			var checkAgent = (typeof checkAgent == 'string') ? $(checkAgent) : checkAgent;
			
			checkAgent.each(function(){
				
				var _this = $(this);
				var agent = _this.parents(CT.Datas.cartAgent);
				var unGoods = $('.uncheckbox[data-class="goods"]', agent);
				var unGoodsLength = unGoods.length;
				
				//console.log(unGoodsLength);
				
				if(unGoodsLength < 1)
				{
					commonFun.Methods.checkbox(_this, 'check');
				}
				else
				{
					commonFun.Methods.checkbox(_this, 'uncheck');
				}
				
			});
		},
		
		/*---------------------------------------------
		@Class: 选择所有商品
		---------------------------------------------*/
		checkAllGoods: function(allGoods)
		{
			var allGoods = (typeof allGoods == 'string') ? $(allGoods) : allGoods;
			var cartWrap = allGoods.parents(CT.Datas.cartWrap);
			var unAgent = $('.uncheckbox[data-class="checkAgent"]', cartWrap);
			var unAgentLength = unAgent.length;
			
			//console.log(unAgentLength);
			
			if(unAgentLength < 1)
			{
				commonFun.Methods.checkbox(allGoods, 'check');
			}
			else
			{
				commonFun.Methods.checkbox(allGoods, 'uncheck');
			}
		},
		
		/*---------------------------------------------
		@Class: 保存选择商品的 cookie
		---------------------------------------------*/
		saveCookie: function(goods)
		{
			var goods = (typeof goods == 'string') ? $(goods) : goods;
			var goodsLength = goods.length;
			var checkGoods = [];
			
			if(goodsLength < 1)
			{
				checkGoods.push(-1);
				CT.Methods.isDisabledButton(true);
			}
			else
			{
				goods.each(function(){
                    
					var _this = $(this);
					var input = $('input', _this);
					var id = input.attr('data-goods-id');
					
					checkGoods.push(id);
					
                });
				
				CT.Methods.isDisabledButton(false);
			}
			
			commonFun.Methods.setCookie('checkGoods', checkGoods);
			CT.Methods.calculatorTotalPriceAndCount();
		},
		
		/*---------------------------------------------
		@Class: 根据保存的 cookie 选择商品
		---------------------------------------------*/
		setCheckGoods: function()
		{
			var checkGoodsCookie = commonFun.Methods.getCookie('checkGoods');
			var checkGoods = checkGoodsCookie.split(',');
			
			//console.log(checkGoods[0]);
			
			if($.trim(checkGoods[0]) == '')
			{
				commonFun.Methods.checkbox('[data-class="goods"]', 'check');
			}
			else
			{			
				for(var i = 0, l = checkGoods.length; i < l; i++)
				{
					var id = checkGoods[i];
					
					commonFun.Methods.checkbox('[data-class="goods"][for="productId_goods_'+ id +'"]', 'check');
				}
			}
			if(checkGoods[0] == -1)
			{
				CT.Methods.isDisabledButton(true);
			}
			else
			{
				CT.Methods.isDisabledButton(false);
			}
			
			CT.Methods.checkAgent('[data-class="checkAgent"]');
			CT.Methods.checkAllGoods('span[data-class="checkAll"]');
		},
		
		/*---------------------------------------------
		@Class: 是否启用结算按钮
		---------------------------------------------*/
		isDisabledButton: function(bDis)
		{
			var totalButton = $(CT.Datas.totalButton);
			
			if(bDis)
			{
				totalButton.addClass('button-notFund');
			}
			else
			{
				totalButton.removeClass('button-notFund');
			}
		},
		
		/*---------------------------------------------
		@Class: 判断购物车里的商品数量是否大于最大数
		---------------------------------------------*/
		isCartFull: function(bAction)
		{
			var bGtMax = false;
			
			if(bAction)
			{
				//commonFun.cart.getSkuGoodsNums();
			}
			
			if(XD.data.skuGoodsNums > XD.data.cartMax)
			{
				bGtMax = true;
			}
			
			return bGtMax;
		},
		
		/*---------------------------------------------
		@Class: 当购物车里的商品数量大于最大数时，给出提示
		---------------------------------------------*/
		cartFullTip: function()
		{
			var bGtMax = CT.Methods.isCartFull(true);
			
			if(bGtMax)
			{
				var content = '<div class="p24 clearfix">'
							 +'	<p class="tc f16">购物车商品数量已超出'+ XD.data.cartMax +'件，请清理！</p>'
							 +'	<p class="pt24 tc"><a href="javascript:;" class="button-light-100 anim-all" data-action="close">知道了</a></p>'
							 +'</div>';
				
				$.block({
					title: ' ',
					content: content
				});
				
				$('[data-action=close]').on('click', function(){
					
					$.unblock();
					
					return false;
					
				});
			}
		},
		
		/*---------------------------------------------
		@Class: 如果商家下没有商品, 就删除当前商家
				如果购物里面没有商家, 重新加载页面
		---------------------------------------------*/
		reviewCartMethod: function(base)
		{			
			var base = (typeof base == 'string') ? $(base) : base;
			var input = base.parents(CT.Datas.cartGoods).find('.addCartNum');
			var pnum = input.val();
				pnum = parseInt(pnum);
				pnum = isNaN(pnum) ? 1 : pnum;
			var agent = base.parents(CT.Datas.cartAgent);
			var goods = $(CT.Datas.cartGoods, agent);
			var allAgent = $(CT.Datas.cartAgent);
			var allLoseGoods = $(CT.Datas.loseGoods);
			var cartGoodsDisabled = CT.Datas.loseGoods.substring(1);
			var validGoodsCount = 0;
			var loseGoodsCount = 0;
			
			goods.each(function(){
				
				var _this = $(this);
				
				if(!_this.hasClass(cartGoodsDisabled))
				{
					validGoodsCount ++;
				}
				else
				{
					loseGoodsCount ++;
				}
				
			});
			
			//console.log(validGoodsCount);
			
			//console.log(loseGoodsCount);
			
			if((loseGoodsCount <= 1 && validGoodsCount == 0) || (validGoodsCount <= 1 && loseGoodsCount == 0))
			{
				if(allAgent.length == 1)
				{
					location.reload();
				}
				else
				{
					agent.remove();
				}
			}
			else
			{
				base.remove();
			}
			
			if(allLoseGoods.length <= 1)
			{
				$('[data-class=batchDelete][data-id=lose]').remove();
			}
			
			CT.Methods.calculatorSubtotal(base, pnum);
			CT.Methods.updateTopCartNumberMethod();
		},
		
		/*---------------------------------------------
		@Class: 删除单个商品
		---------------------------------------------*/
		removeGoodsMethod: function(input, base)
		{
			var input = (typeof input == 'string') ? $(input) : input;
			var pid = input.attr('data-pid');
			var removeId = [];
			
			removeId.push(pid);
			
			CT.Actions.removeGoodsAction(removeId);
			pid && CT.Methods.reviewCartMethod(base);
		},
		
		/*---------------------------------------------
		@Class: 批量删除
		---------------------------------------------*/
		batchRemoveMethod: function()
		{
			var removeId = [];
			
			$(CT.Datas.cartGoods).each(function(index, element) {
                
				var base = $(this);
				var checkbox = base.find('.checkbox > input[type=checkbox]:checked');
				var pid = checkbox.attr('data-goods-id');
				
				pid && removeId.push(pid);
            });
			
			CT.Actions.removeGoodsAction(removeId);
			
			$(CT.Datas.cartGoods).each(function(index, element) {
                
				var base = $(this);
				var checkbox = base.find('.checkbox > input[type=checkbox]:checked');
				var pid = checkbox.attr('data-goods-id');
				
				pid && CT.Methods.reviewCartMethod(base);
            });
		},
		
		/*---------------------------------------------
		@Class: 清除失效商品
		---------------------------------------------*/
		batchRemoveLoseMethod: function()
		{
			var removeId = [];
			
			$(CT.Datas.loseGoods).each(function(index, element) {
                
				var base = $(this);
				var input = base.find('input[data-class=pid]');
				var pid = input.attr('data-pid');
				
				pid && removeId.push(pid);
            });
			
			CT.Actions.removeGoodsAction(removeId);
			
			$(CT.Datas.loseGoods).each(function(index, element) {
                
				var base = $(this);
				var input = base.find('input[data-class=pid]');
				var pid = input.attr('data-pid');
				
				pid && CT.Methods.reviewCartMethod(base);
            });
		},
		
		/*---------------------------------------------
		@Class: 计算当前商品的总价/个数
		---------------------------------------------*/
		calculatorSubtotal: function(_this, pnum)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			var base = _this.parents(CT.Datas.cartGoods);
			var oPrice = $(CT.Datas.price, base);
			var iPrice = parseFloat(oPrice.text());
			var oSubtotal = $(CT.Datas.subtotal, base);
			var pnum = parseInt(pnum);
			var iSubtotal = iPrice * pnum;
				iSubtotal = iSubtotal.toFixed(2);
			
			oSubtotal.text(iSubtotal);
			
			CT.Methods.saveCookie('.checkbox[data-class="goods"]');
			CT.Methods.calculatorTotalPriceAndCount();
		},
		
		/*---------------------------------------------
		@Class: 计算购物车中用户选择的商品总价和总数
		---------------------------------------------*/
		calculatorTotalPriceAndCount: function()
		{
			var checkGoods = $('.checkbox[data-class="goods"]');
			var oTotalPrice = $(CT.Datas.totalPrice);
			var iTotalPrice = 0;
			var iTotalCount = 0;
			
			//console.log(checkGoods.length);
			
			checkGoods.each(function(index, element) {
                
				var _this = $(this);
				var input = $('input', _this);
				var val = input.val();
					val = parseInt(val);
				var baseGoods = _this.parents(CT.Datas.cartGoods);
				
				var oSubtotal = $(CT.Datas.subtotal, baseGoods);
				var iSubtotal = parseFloat(oSubtotal.text());
				
				iTotalPrice += iSubtotal;
				iTotalCount += val;
				//iTotalCount = iTotalCount > 99 ? '99+' : iTotalCount;
				
            });
			
			iTotalPrice = iTotalPrice.toFixed(2);
			
			oTotalPrice.text(iTotalPrice);	
			$(CT.Datas.count).text(iTotalCount);
		},
		
		/*---------------------------------------------
		@Class: 更新头部购物中的数字
		---------------------------------------------*/
		updateTopCartNumberMethod: function()
		{
			var input = $(CT.Datas.cartGoods + ' input[data-class=pid]');
			var cartNum = 0;
			
			input.each(function(){
				
				var _this = $(this);
				var val = _this.val();
					val = parseInt(val);
				
				cartNum += val;
				
			});
			
			cartNum = cartNum > 99 ? '99+' : cartNum;
			$(XD.data.topCart).text(cartNum);
		},		
		
		/*---------------------------------------------
		@Class: 更新当前商品的购买数量
		---------------------------------------------*/
		updateCartGoodsMethod: function(input)
		{
			var cartGoods = input.parents(CT.Datas.cartGoods);
			var checkGoods = $('.checkGoods', cartGoods);
			var pid = input.attr('data-pid');
				pid = parseInt(pid);
			var pnum = input.val();
				pnum = parseInt(pnum);
				pnum = isNaN(pnum) ? 1 : pnum;
			
			checkGoods.val(pnum);
			
			CT.Actions.updateCartGoodsAction(pid, pnum);
			CT.Methods.updateTopCartNumberMethod();
			CT.Methods.calculatorSubtotal(input, pnum);
		},
		
		/*---------------------------------------------
		@Class: 删除商品时，如果未选中，给出提示
		---------------------------------------------*/
		removeGoodsNotice: function(msg)
		{
			var content = '<p class="p12 f16">'+ msg +'</p>';
			
			$.block({
				title: ' ',
				hideCloseButton: true,
				content: content
			});
			
			setTimeout(function(){
				
				$.unblock();
				
			}, 1200);
		},
		
		/*---------------------------------------------
		@Class: 设置当前商品的状态
		---------------------------------------------*/
		setCheckGoodsStatus: function(goodsId, goodsName, isShelved, buyNum, skuNum)
		{
			var currentCheckGoods = $('.checkbox[for="productId_goods_'+ goodsId +'"]');
			
			if(!currentCheckGoods[0])
			{
				return false;
			}
			
			var input = $('input:checked', currentCheckGoods);
			
			if(isShelved != 1 || buyNum > skuNum)
			{
				var currentGoods = currentCheckGoods.parents(CT.Datas.cartGoods);
				var cartGoodsTip = $('[data-class="cart-tip"]', cartGoodsCount);
				var oMaxNum = $('[data-class="max-num"]', cartGoodsTip);
				
				CT.Datas.isDisabledButton(true);
			}
			
			if(skuNum > 0 && buyNum > skuNum)
			{
				cartGoodsTip.show();
				oMaxNum.text(skuNum);
			}
			
			if(isShelved != 1 || skuNum == 0)
			{
				var agent = currentGoods.parent('.cartAgent');
				var agentGoodsList = $('[data-class="goods"]', agent);
				var agentGoodsLength = agentGoodsList.length;
				var cartGoodsCheck = $('.cart-check', currentGoods);
				var cartGoodsName = $('[data-class="goods-name"]', currentGoods);
				var cartGoodsCount = $('.cart-count', currentGoods);
				
				if(agentGoodsLength == 1)
				{
					var cartAgentCheck = $('[data-class="cart-agent-check"]', agent);
					
					cartAgentCheck.html('<p class="tr">失效</p>');
				}
				
				currentGoods.addClass(CT.Datas.loseGoods);
				cartGoodsCheck.html('<p class="tr">失效</p><input type="checkbox" class="checkGoods hide" name="productId['+ goodsId +']" value="'+ buyNum +'" data-goods-id="'+ goodsId +'">');
				cartGoodsName.html(goodsName);
				cartGoodsCount.html('<p>'+ buyNum +'</p><input type="text" class="hide" value="'+ buyNum +'" data-min="1" data-max="" data-pid="'+ goodsId +'" data-class="pid">');
			}
		},
		
		/*---------------------------------------------
		@Class: 提交订单时，判断有没有失效或库存不足的商品
		---------------------------------------------*/
		checkGoodsIsLose: function(datalist)
		{
			var shopItem = datalist.data.shopItem;
			
			for(var shopKey in shopItem)
			{
				var goodsItem = shopItem[shopKey].goodsItem;
				
				for(var goodsKey in goodsItem)
				{
					var goods = goodsItem[goodsKey];
					var goodsId = goods.goodsId;
					var goodsName = goods.name;
					var isShelved = goods.isShelved;
					var buyNum = goods.buyNum;
					var skuNum = goods.skuNum;
					
					CT.Methods.setCheckGoodsStatus(goodsId, isShelved, buyNum, skuNum);
				}
			}
		},
		
		/*---------------------------------------------
		@Class: 提交订单时，判断有没有失效或库存不足的商品
		---------------------------------------------*/
		isLoseGoods: function()
		{
			CT.Actions.getCartGoodsAction(CT.Datas.checkGoodsIsLose);
		}
	};	
	
	/*------------------------------------------------------------------
	@Class: 事件绑定
	------------------------------------------------------------------*/
	CT.Events = {
		/*---------------------------------------------
		@Class: 删除单个商品 --> 确认删除操作
		---------------------------------------------*/
		regRemoveGoodsEvent: function(submits, base)
		{
			var submits = (typeof submits == 'string') ? $(submits) : submits;
			var base = (typeof base == 'string') ? submits.parents(base) : base;
			var input = base.find('input[data-class=pid]');
			
			submits.on('click', function(){
				
				CT.Methods.removeGoodsMethod(input, base);
				
				return false;
			});
		},
		
		/*---------------------------------------------
		@Class: 批量删除 --> 确认删除操作
		---------------------------------------------*/
		regBatchRemoveEvent: function(submits)
		{
			var submits = (typeof submits == 'string') ? $(submits) : submits;
			
			submits.on('click', function(){
				
				CT.Methods.batchRemoveMethod();
				
				return false;
				
			});
		},
		
		/*---------------------------------------------
		@Class: 清空失效商品 --> 确认删除操作
		---------------------------------------------*/
		regBatchRemoveLoseEvent: function(submits)
		{
			var submits = (typeof submits == 'string') ? $(submits) : submits;
			
			submits.on('click', function(){
				
				CT.Methods.batchRemoveLoseMethod();
				
				return false;
				
			});
		},
		
		/*---------------------------------------------
		@Class: 取消删除操作
		---------------------------------------------*/
		regCancelRemoveEvent: function(cancel, dialog)
		{
			var cancel = (typeof cancel == 'string') ? $(cancel) : cancel;
			var dialog = (typeof dialog == 'string') ? cancel.parents(dialog) : dialog;
			
			cancel.on('click', function(){
				
				dialog.remove();
				
				return false;
			});
		}
		
	};
	
	module.exports = CT;
});