define(function(require, exports, module){
    var commonFun = {};
	var Plugs = require('{common}jquery.plugs')($);
	
	var TOKEN_INPUT = $('#form_token');
		TOKEN_KEY = TOKEN_INPUT.attr('name');
		TOKEN_VAL = TOKEN_INPUT.val();
	
	XD.data = {
		topCart: '#top_cart',
		cartMax: 100,
		skuGoodsNums: 0,
		cartNum: 0,
		addCartButtonBox: '.addCart-button',
		addCartButton: '.addCart-button > a',
		collectButton: 'a[data-class=favorite]',
		goodsInfo: {},
		goodsList: {},
		attrList: {},
		addCartSuccess: function(_this)
		{
			var sClass = _this.attr('class');
			var okIcon = '<span class="cart-success-small sprites"></span>';
			var timer = null;
			
			if(_this.hasClass('button-light-292'))
			{
				okIcon = '<span class="cart-success-big sprites"></span>';
			}
			
			_this.after('<p class="'+ sClass +' cart-after-box" id="sOkCart">'+ okIcon +'</p>');
			
			var sOkCart = $('#sOkCart');
			
			sOkCart.animate({ top: 0});
			
			timer = setInterval(function(){
				
				clearInterval(timer);
				
				sOkCart.animate({ top: 48}, function(){
					
					sOkCart.remove();
					
				});
				
			}, 2000);
		},
		
		addCartFaild: function(text)
		{
			var content = '<p class="p24 f16">'+ text +'</p>';
			var timer = null;
			
			$.block({
				title: ' ',
				content: content
			});
			
			$('a[data-action=close]').bind('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			timer = setTimeout(function(){
				
				clearTimeout(timer);
				$.unblock();
				
			}, 2000);
		}
	};
	
	// 主要作用是获取单品详情页的 goodsList 和 attrList 数据
	if(typeof goodsList == 'object')
	{
		var gid = $(XD.data.addCartButton).attr('data-cat-pid');
			gid = gid || $('[data-class=goodsEditTime]').attr('data-goodsinfo-id');
		XD.data.goodsList[gid] = goodsList;
	}
	
	if(typeof attrList == 'object')
	{
		var gid = $(XD.data.addCartButton).attr('data-cat-pid');
			gid = gid || $('[data-class=goodsEditTime]').attr('data-goodsinfo-id');
		XD.data.attrList[gid] = attrList;
	}
	
	/*------------------------------------------------------------------
	@Class: 加入购物车/头部购物车 相关
	------------------------------------------------------------------*/
	commonFun.cart = {
		/*---------------------------------------------
		@Class: 获取商品数量
		---------------------------------------------*/
		getSkuGoodsNums: function()
		{
			$.ajax({
				type: 'GET',
				url: '/cart/getSkuGoodsNums?jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					XD.data.skuGoodsNums = parseInt(ajaxData);
				
					if(isNaN(XD.data.skuGoodsNums))
					{
						XD.data.skuGoodsNums = 0;
					}
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 初始化页面顶部购物车数量
		---------------------------------------------*/
		getCartNum: function()
		{
			$.ajax({
				type: 'GET',
				url: '/cart/getGoodsNum?jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					XD.data.cartNum = parseInt(ajaxData);
				
					if(isNaN(XD.data.cartNum))
					{
						XD.data.cartNum = 0;
					}
					else if(XD.data.cartNum > 99)
					{
						XD.data.cartNum = '99+'; 
					}
					
					if(XD.data.cartNum != 0)
					{
						$(XD.data.topCart).html(XD.data.cartNum);
						$('.userCart-text').removeClass('userCart-text').addClass('userCart-text-full');
					}
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 获取商品信息 AJAX 请求
		---------------------------------------------*/
		getGoodsAction: function(pid, _this, callback)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			
			$.ajax({
				type: 'POST',
				url: '/detail/get?id=' + pid + '&jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					XD.data.goodsInfo[gid] = ajaxData;
					
					if(ajaxData.code == 0)
					{
						var isFavourite = ajaxData.data[gid].isFavourite;
						var _collectBtn = _this.find(XD.data.collectButton);
						
						XD.data.goodsList[gid] = ajaxData.data[gid].goodList;
						XD.data.attrList[gid] = ajaxData.data[gid].attrList;
						
						commonFun.Favorite.initCollectButtonAttr(_collectBtn, isFavourite);
						
						callback && callback(_this, pid, XD.data.attrList[gid]);
					}
				},
				error: function()
				{
					//console.log('获取商品信息失败！');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 获取商品信息
		---------------------------------------------*/
		getGoodsInfo: function(pid, _this, callback)
		{
			gid = pid;
			
			if(typeof XD.data.goodsInfo[gid] == 'undefined')
			{
				commonFun.cart.getGoodsAction(gid, _this, callback);
			}
			else
			{
				callback && callback(_this, pid, XD.data.attrList[gid]);
			}
			
			commonFun.cart.setAddCartState(pid);
		},
		
		/*---------------------------------------------
		@Class: 设置加入购物车按钮的状态
		---------------------------------------------*/
		setAddCartState: function(pid)
		{
			//console.log(pid);
			
			//if((typeof XD.data.goodsList[gid] == 'undefined') || XD.data.goodsList[gid][pid].stockNum <= 0)
			//{
				var addCartButton = $(XD.data.addCartButton + '[data-cat-pid='+ pid +']');
				var addCartButton_icon = $('span', addCartButton);
				var addCartButton_text = $('em', addCartButton);
				
				if(typeof XD.data.goodsList[gid] == 'undefined')
				{
					//addCartButton_icon.addClass();
					addCartButton_text.text('商品不存在');
					addCartButton.addClass('button-notFund');
				}				
				else if(XD.data.goodsList[gid][pid].stockNum <= 0)
				{
					//addCartButton_icon.addClass();
					addCartButton_text.text('商品已售完');
					addCartButton.addClass('button-notFund');
				}
				else
				{
					//addCartButton_icon.removeClass();
					addCartButton_text.text('加入购物车');
					addCartButton.removeClass('button-notFund');
				}
			//}
		},
		
		/*---------------------------------------------
		@Class: 将所有商品 disabled 设为 false
		---------------------------------------------*/
		disabled: function(_this)
		{
			var bool = _this.hasClass('proData-item');
			var disClass = bool  ? 'proData-disabled' : 'param-disabled';
			
			for(var g_attr in XD.data.goodsList[gid])
			{
				XD.data.goodsList[gid][g_attr].enabled = false;
			}
			
			_this.siblings().removeClass(disClass);
			_this.parents('[data-class=param-list]').siblings('[data-class=param-list]').find('[data-class=param-item]').addClass(disClass);
		},
		
		/*---------------------------------------------
		@Class: 将所有匹配到的商品 disabled 设 为true
		---------------------------------------------*/
		enabled: function(_this, key, type)
		{
			var bool = _this.hasClass('proData-item');
			var currentClass = bool  ? 'proData-current' : 'param-select';
			var disClass = bool  ? 'proData-disabled' : 'param-disabled';
			
			for(var g_attr in XD.data.goodsList[gid])
			{
				var goods = XD.data.goodsList[gid][g_attr];
				
				for(var attr_key in goods.priceAttr)
				{
					if(attr_key == key)
					{
						goods.enabled = true;
					}
				}
			}
				
			for(var g_attr in XD.data.goodsList[gid])
			{
				var goods = XD.data.goodsList[gid][g_attr];
				
				if(goods.enabled)
				{
					for(var attr_key in goods.priceAttr)
					{
						_this.parents('[data-class=param-list]').siblings('[data-class=param-list]').find('[data-class=param-item][data-product-attr='+ attr_key +']').removeClass(disClass);
						
						if(type != 'detail')
						{
							//$('.'+ disClass).removeClass(currentClass).siblings().eq(0).removeClass(disClass).addClass(currentClass);
						}
					}
				}
			}
		},
		
		/*---------------------------------------------
		@Class: 组合已选择的属性
		---------------------------------------------*/	
		selectedAttr: function(_this)
		{
			var bool = _this.hasClass('proData-item');
			var addCartInfoBox = _this.parents('[data-class=param-list]').parent();
			var currentClass = bool  ? 'proData-current' : 'param-select';
			var aCurrentEle = addCartInfoBox.find('.'+ currentClass);
			var result = [];
			
			aCurrentEle.each(function(index, element){
                
				var attr = $(this).attr('data-product-attr');
				
				result.push(attr);
				
            });
			
			return result;
		},
		
		/*---------------------------------------------
		@Class: 获取匹配到的商品 id
		---------------------------------------------*/		
		getPid: function(selectedAttr, addCatBtn)
		{
			var pid = 0;
			
			for(var g_attr in XD.data.goodsList[gid])
			{
				var goods_list = XD.data.goodsList[gid][g_attr];
					goods_list.arr = [];
					
				for(var attr_key in goods_list.priceAttr)
				{
					goods_list.arr.push(attr_key);
				}
			}
			
			for(var g_attr in XD.data.goodsList[gid])
			{
				var g_list = XD.data.goodsList[gid][g_attr];
					pid	= g_list.id;
				
				if(g_list.enabled && commonFun.Methods.compareArray(g_list.arr, selectedAttr))
				{
					break;
				}
				else
				{
					pid = 0;
				}
			}
			
			if(pid == 0 || g_list.stockNum == 0)
			{
				addCatBtn.addClass('button-notFund');
			}
			else
			{
				addCatBtn.removeClass('button-notFund');
			}
			
			addCatBtn.attr('data-cat-pid', pid);
			
			return pid;
		},
		
		/*---------------------------------------------
		@Class: 商品属性选择
		---------------------------------------------*/
		getGoodsAttr: function(_this, addCatBtn, type)
		{
			var bool = _this.hasClass('proData-item');
			var currentClass = bool  ? 'proData-current' : 'param-select';
			var disClass = bool  ? 'proData-disabled' : 'param-disabled';
			
			if(_this.hasClass(currentClass) || _this.hasClass(disClass))
			{
				return false;
			}
			
			_this.addClass(currentClass).siblings().removeClass(currentClass);
			
			var key = _this.attr('data-product-attr');
			
			commonFun.cart.disabled(_this);
			commonFun.cart.enabled(_this, key, type);
			
			var url = location.href;
			var param = commonFun.Methods.parseUrl(url);
			var selAttr  = commonFun.cart.selectedAttr(_this);
			
			var pid = commonFun.cart.getPid(selAttr, addCatBtn);
			
			if(pid == param.id || pid == 0)
			{
				return false;
			}
			else if(type == 'detail')
			{
				location.href = '/detail/?id='+ pid;
			}
			else if(type == 'preview')
			{
				location.href = '/preview/home?token='+ show_token +'&id='+ pid;
			}
			else
			{
				var addCartInfoBox = _this.parents('.add-cart');
				var oProNameA = addCartInfoBox.siblings('.pro-name').find('a');
				var oProImgaeA = addCartInfoBox.siblings('.pro-image').find('a');
				var oPrice = addCartInfoBox.siblings('.pro-price').children();
				
				oPrice.html('¥'+ XD.data.goodsList[gid][pid].price);
				oProNameA.attr('href', '/detail?id='+ pid);
				oProImgaeA.attr('href', '/detail?id='+ pid);
				commonFun.cart.setAddCartState(pid);
			}
		},
		
		/*---------------------------------------------
		@Class: 给商品属性注册点击事件
		---------------------------------------------*/	
		regDetailAttrEvent: function(type)
		{
			$('[data-class=param-item]').bind('click', function(){
				
				var _this = $(this);
				var bool = _this.hasClass('proData-item');
				var currentClass = bool  ? 'proData-current' : 'param-select';
				var addCatBtn = _this.parents('[data-class=param-list]').siblings('.addCart-button').children('a');
				
				if(_this.hasClass(currentClass))
				{
					return false;
				}
				
				commonFun.cart.getGoodsAttr(_this, addCatBtn, type);
				
				return false;
			});
		},
		
		/*---------------------------------------------
		@Class: 判断购物车中有没有用户要插入的商品
		---------------------------------------------*/
		isExist: function(pid)
		{
			var cart_list = {};
			var bExist = false;
			
			$.ajax({
				type: 'GET',
				url: '/Cart/cList?jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						cart_list = ajaxData;
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
			
			var shopItem = cart_list.data.shopItem;
			
			for(var shop in shopItem)
			{
				var goodsItem = shopItem[shop].goodsItem;
				
				for(var goods in goodsItem)
				{
					if(goodsItem[goods].goodsId == pid)
					{
						bExist = true;
						break;
					}
				}
			}
			
			return bExist;
		},
		
		/*---------------------------------------------
		@Class: 判断当前用户还能添加几件商品到购物车
		---------------------------------------------*/
		isInsertGoods: function(pid)
		{
			var bExist = commonFun.cart.isExist(pid);
			
			commonFun.cart.getSkuGoodsNums();
			
			if(XD.data.skuGoodsNums >= XD.data.cartMax && !bExist)
			{
				XD.data.addCartFaild('购物车已满！');
				
				return false;
			}
			
			return true;
		},
		
		/*---------------------------------------------
		@Class: 插入商品到购物车
		---------------------------------------------*/
		insertCart: function(pid, pnum, _this, callback)
		{
			var bool = commonFun.cart.isInsertGoods(pid);
			
			if(!bool)
			{
				return false;
			}
			
			var datas = {};
				datas.productId = '{"' + pid + '":' + pnum + "}";
			
			$.ajax({
				type: 'GET',
				url: '/Cart/add?productId=' + datas.productId + '&jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					commonFun.cart.getCartNum();
					
					if(ajaxData.code == 0)
					{
						$(XD.data.topCart).html(XD.data.cartNum);
						
						callback && callback(_this);					
					}
					else
					{
						//console.log('faild');
					}
				},
				error: function()
				{
					XD.data.addCartFaild('添加购物车失败！');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 列表页，鼠标滑入商品模块，获取商品信息
		---------------------------------------------*/
		regMouseoverGoodsModuleEvent: function()
		{
			var timer = null;
			
			$('.pro-item[data-goods-pid]').unbind();
			$('.pro-item[data-goods-pid]').bind('mouseenter', function(){
				
				var _this = $(this);
				var pid = _this.attr('data-goods-pid');
				
				clearTimeout(timer);
				timer = setTimeout(function(){
					
					commonFun.cart.getGoodsInfo(pid, _this, commonFun.Methods.getListGoodsImage);
					
				}, 50);
				
			});
		},
		
		/*---------------------------------------------
		@Class: 添加购物车操作
		---------------------------------------------*/
		addCartOper:function(_this)
		{
			_this.prev('.cart-dialog').remove();
			
			var oTopCart = $(XD.data.topCart);
			
			//计算要添加的库存数
			var pnum = parseInt(_this.attr('data-cat-num'));
			
			// 格式化 pnum
			if(isNaN(pnum))
			{
				pnum = 1;
			}
			
			pnum = Math.max(1, pnum);
			
			// 格式化 pid
			var pid = parseInt(_this.attr('data-cat-pid'));
			
			if(isNaN(pid))
			{
				pid = 0;
			}
			
			if(pid == 0)
			{
				_this.before('<p class="cart-dialog color-red">请选择您要购买的商品属性</p>');
				
				return false;
			}
			
			commonFun.cart.insertCart(pid, pnum, _this, XD.data.addCartSuccess);
			
			return false;
		},
		
		/*---------------------------------------------
		@Class: 给添加购物车按钮注册点击事件
		---------------------------------------------*/
		regAddCartEvent: function()
		{
			$(XD.data.addCartButton).bind('click', function(){
				
				var _this = $(this);
				
				if(_this.hasClass('button-notFund'))
				{
					return false;
				}
				
				commonFun.cart.addCartOper(_this);
				
				return false;
			});
		}
	};
	
	/*------------------------------------------------------------------
	@Class: ajax 请求
	------------------------------------------------------------------*/
	commonFun.Actions = {
		/*---------------------------------------------
		@Class: 返回用户登录状态
		---------------------------------------------*/
		isLoginAction: function()
		{
			var isLogin = 0;
			
			$.ajax({
				type: 'POST',
				url: '/User/ajaxIsLogin',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						isLogin = 1;
					}
				}
			});
			
			return isLogin;
		},
		
		/*---------------------------------------------
		@Class: 获取订单的物流信息
		---------------------------------------------*/
		getOrderExpressInfoAction: function(obj, expModule, callback)
		{
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			var orderId = obj.attr('data-orderId');
				orderId = orderId || '123' + (new Date).getTime() + '987';
			
			var datas = {};
				datas.orderId = orderId;
			
			$.ajax({
				type: 'POST',
				url: '/order/getExpressInfo',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					//console.log(ajaxData)；
					
					if(ajaxData.code == 0)
					{
						//console.log('success');
						
						callback && callback(expModule, ajaxData);
					}
					else
					{
						//console.log('faild');
						callback && callback(expModule, '暂时无法提供物流信息');
					}
				},
				error: function()
				{
					//console.log('error');
					callback && callback(expModule, '暂时无法提供物流信息');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 获取退货退款的物流信息
		---------------------------------------------*/
		getRefundExpressInfoAction: function(obj, expModule, callback)
		{
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			var shippingName = obj.attr('data-shippingName');
				shippingName = shippingName || 'XDEXP';
			var waybill = obj.attr('data-waybill');
				waybill = waybill || '123' + (new Date).getTime() + '987';
			
			var datas = {};
				datas.shippingName = shippingName;
				datas.waybill = waybill;
			
			$.ajax({
				type: 'POST',
				url: '/order/getExpressInfoByWaybill',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					//console.log(ajaxData)；
					
					if(ajaxData.code == 0)
					{
						//console.log('success');
						
						callback && callback(expModule, ajaxData);
					}
					else
					{
						//console.log('faild');
						callback && callback(expModule, '暂时无法提供物流信息');
					}
				},
				error: function()
				{
					//console.log('error');
					callback && callback(expModule, '暂时无法提供物流信息');
				}
			});
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 公用方法
	------------------------------------------------------------------*/
	commonFun.Methods = {
		/*---------------------------------------------
		@Class: 获取单品页的产品信息
		---------------------------------------------*/
		getDetailGoodsInfo: function(_this)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			
			commonFun.cart.getGoodsAction(gid, _this);
		},
		
		/*---------------------------------------------
		@Class: 像列表页的产品模块里面插入图片
		---------------------------------------------*/
		getListGoodsImage: function(_this, pid, attrList)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			
			var oProImage = _this.find('.pro-image');
			var oPorImgageList = oProImage.children('.pro-imageList');
			var nowAttr = oPorImgageList.find('a').attr('data-product-attr');
			
			var json = oProImage.attr('data-size');
				json = eval('('+ json +')');
			var size = json.width;
			var bShow = false;
			
			if(oPorImgageList.children().length > 1)
			{
				return false;
			}
			
			for(var i in attrList)
			{
				if(attrList[i].name == '颜色')
				{
					var imageSrcList = attrList[i].colorimg;
				}
			}
			
			for(var key in imageSrcList)
			{
				if(key != nowAttr)
				{
					var appendImg = '<a href="/detail?id='+ pid +'" class="fl" data-product-attr="'+ key +'" target="_blank"><img src="'+ IMAGE_DOMAIN + imageSrcList[key] +'/'+ size +'" width="'+ size +'" height="'+ size +'" alt=""></a>';
					oPorImgageList.append(appendImg);
					bShow = true;
				}
			}
			
			if(bShow)
			{
				$('[data-class=buttons]', oProImage).show();
			}
			
			oProImage.carousel({
				auto: false,
				callback: function(rthis, now)
				{
					var key = rthis.attr('data-product-attr');
					
					//console.log(key)
					
					var nowBtn = _this.find('.pro-param').eq(0).find('a[data-class=param-item][data-product-attr='+ key +']');
					nowBtn.trigger('click');
					
					var pid = $(XD.data.addCartButton, _this).attr('data-cat-pid');
					
					commonFun.cart.setAddCartState(pid);
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 图片上传 / 删除
		---------------------------------------------*/
		uploadImage: function(errorBox)
		{
			var oUpLoadImageButton = $('[data-action=upLoadImageButton]');
			var oUpLoadImageButtonBox = null;
			var aUpLoadModuleList = null;
			var oFormBox = null;
			var IMAGES_URI = [];
			
			// 图片上传
			oUpLoadImageButton.live('change', function(){
				
				document.domain = 'xidibuy.com';				
				oUpLoadImageButtonBox = $(this).parent('[data-class=upLoadImageButtonBox]');
				aUpLoadModuleList = oUpLoadImageButtonBox.parent('[data-class=upLoadImageOuter]');
				oFormBox = oUpLoadImageButton.parents('form[name=upLoadImageForm]');
				
				getToken(oFormBox);
				
				oFormBox.attr('action', IMAGE_DOMAIN + 'upload').submit();
				
				return false;
				
			});
			
			// 创建上传的图片模块
			window.upCallback = function(upCallbackData)
			{
				if((typeof upCallbackData == 'object') && upCallbackData.code == 0)
				{
					$(errorBox).html('');
					
					var image = upCallbackData.data.key[0];
					var createImgaeModule = '<li class="certificate-item mr12 pr fl" data-class="upLoadImageBox" data-uri="'+ image +'">'
												 +'	<img src="'+ IMAGE_DOMAIN + image +'" width="58" height="58">'
												 +'	<div class="certificate-oper hide pa" data-action="removeUpLoadImage">'
												 +'		<span class="icon-remove sprites"></span>'
												 +'	</div>'
												 +'</li>';
					
					IMAGES_URI.push(image);
					
					if(aUpLoadModuleList[0])	// 上传多张图片时
					{
						oUpLoadImageButtonBox.before(createImgaeModule);
											
						isDisabledUpload();
					}
					else	// 头像上传/只上传一张图片是
					{
						$('[data-class=imagePreview]').attr('src', IMAGE_DOMAIN + image);
					}
				}
				else
				{
					if(upCallbackData.msg)
					{
						var errorMsg = upCallbackData.msg;
					}
					else
					{
						var errorMsg = '上传失败';
					}
					
					$(errorBox).html(errorMsg);
				}
			};
			
			// 删除凭证
			$('[data-action=removeUpLoadImage]').live('click', function(){
				
				var oUpLoadImageBox = $(this).parent('[data-class=upLoadImageBox]');
				var nowURI = oUpLoadImageBox.attr('data-uri');
				
				oUpLoadImageBox.fadeOut(function(){
					
					IMAGES_URI.splice($.inArray(nowURI, IMAGES_URI), 1);
					
					oUpLoadImageBox.remove();
					isDisabledUpload();
					
				});
				
				return false;
				
			});
			
			// 获取 token
			function getToken(oForm)
			{
				var tokenType = $('input[name="getTokenType"]', oForm).val();
				$.ajax({
					type: 'POST',
					url: '/Feedback/getToken',
					data: {
						type: tokenType
					},
					async: false,
					success: function(ajaxData)
					{
						var ajaxData = (typeof ajaxData == 'string') ?  $.parseJSON(ajaxData) : ajaxData;
						
						oForm.find('input[name=token]').val(ajaxData.token);
					}
				});
			}
	
			// 显示/隐藏 上传按钮
			function isDisabledUpload()
			{
				var oUpLoadButtonBox = $('[data-class=upLoadImageButtonBox]', aUpLoadModuleList);
				
				if(IMAGES_URI.length >= 5)
				{
					oUpLoadButtonBox.hide();
				}
				else
				{
					oUpLoadButtonBox.show();
				}
			}
			
			return IMAGES_URI;
		},
		
		/*---------------------------------------------
		@Class: 格式化商品数量
		---------------------------------------------*/
		formatGoodsNum: function(input, addButton)
		{
			var addButton = (typeof addButton == 'string') ? $(addButton) : addButton;
			var input = (typeof input == 'string') ? $(input) : input;
			var tip = input.parents('.addCartOperBox').next();
			var minus = input.prev();
			var plus = input.next();
			var iMin = 1;
			var iMax = input.attr('data-max');
				iMax = parseInt(iMax);
				iNow = isNaN(iMax) ? 1 : iMax;
			var iNow = input.val();
				iNow = parseInt(iNow);
				iNow = isNaN(iNow) ? 1 : iNow;
			
			if(iNow == iMin && iNow == iMax)
			{
				input.attr('disabled', true);
				minus.addClass('minus-disabled');
				plus.addClass('plus-disabled');
			}
			else if(iNow <= iMin)
			{
				iNow = iMin;
				minus.addClass('minus-disabled');
				plus.removeClass('plus-disabled');
			}
			else if(iNow >= iMax)
			{
				iNow = iMax;
				minus.removeClass('minus-disabled');
				plus.addClass('plus-disabled');
			}
			else
			{
				minus.removeClass('minus-disabled');
				plus.removeClass('plus-disabled');
			}
			
			input.val(iNow);
			addButton && addButton.attr('data-cat-num', iNow);
			
			return iNow;
		},
		
		/*---------------------------------------------
		@Class: 当数量增加到最时给出提示
		---------------------------------------------*/
		isGoodsNumInMax: function(input, bHide)
		{
			var input = (typeof input == 'string') ? $(input) : input;
			var val = input.val();
				val = parseInt(val);
				val = isNaN(val) ? 1 : val;
			var iMax = input.attr('data-max');
				iMax = parseInt(iMax);
				iMax = isNaN(iMax) ? 1 : iMax;
			var minus = input.prev();
			var plus = input.next();
			
			if(plus.hasClass('plus-disabled') && val >= iMax)
			{
				commonFun.Methods.showNumNotice(input, bHide);
			}
			else if(minus.hasClass('minus-disabled') || val <= iMax)
			{
				commonFun.Methods.hideNumNotice(input, true);
			}
		},
		
		/*---------------------------------------------
		@Class: 显示提示
		---------------------------------------------*/		
		showNumNotice: function(input, bHide)
		{
			var currentOperBox = input.parent('.addCartOperBox');
			var currentVal = input.val();
				currentVal = parseInt(currentVal);
				currentVal = isNaN(currentVal) ? 1 : currentVal;
			var currentMax = input.attr('data-max');
				currentMax = parseInt(currentMax);
				currentMax = isNaN(currentMax) ? 1 : currentMax;
			
			//console.log(currentVal);
			//console.log(currentMax);
			
			if(currentVal >= currentMax)
			{
				//input.val(currentMax);
				currentOperBox.next().stop(true, true).show().find('[data-class=max-num]').text(currentMax);
			}
			
			if(bHide)
			{
				commonFun.Methods.hideNumNotice(input);
			}
		},
		
		/*---------------------------------------------
		@Class: 隐藏提示
		---------------------------------------------*/
		hideNumNotice: function(input, nowHide)
		{
			var currentOperBox = input.parents('.addCartOperBox');
			
			if(nowHide)
			{
				currentOperBox.next().hide();
				return false;
			}
			
			setTimeout(function(){
				
				currentOperBox.next().hide();
				
			}, 1500);
		},
		
		/*---------------------------------------------
		@Class: 载入物流信息（订单详情页/退货退款详情页）
		---------------------------------------------*/
		loadExpressInfo: function(expModule, data)
		{
			var expModule = (typeof expModule == 'string') ? $(expModule) : expModule;
			
			if(typeof data == 'string')
			{
				expModule.html(data);
				
				return false;
			}
			
			var datalist = data.data;
			
			var exp_content = '<dl class="clearfix">'
							  +'	<dt class="fl">发货方式：</dt>'
							  +'		<dd class="fl">'+ datalist.shipping_type_name +'</dd>'
							  +'	</dl>'
							  +'<dl class="clearfix">'
							  +'	<dt class="fl">物流公司：</dt>'
							  +'	<dd class="fl">'+ datalist.shipping_name +'</dd>'
							  +'</dl>'
							  +'<dl class="clearfix">'
							  +'	<dt class="fl">运单号码：</dt>'
							  +'	<dd class="fl">'+ datalist.invoice_no +'</dd>'
							  +'</dl>'
							  +'<dl class="clearfix">'
							  +'	<dt class="fl">物流跟踪：</dt>'
							  +'	<dd class="fl">'
							  +'		<ul>'
							  +				commonFun.Methods.readExpressState(datalist.shipping_info)
							  +'		</ul>'
							  +'		'
							  +'		<div class="expressExplan mt12">以上信息由物流公司提供，如无跟踪信息或有疑问，请查询 <a href="'+ datalist.shipping_url +'" class="color-blue" target="_blank">'+ datalist.shipping_name +'</a> 官方网站或联系其公示电话</div>'
							  +'	</dd>'
							  +'</dl>';
			
			expModule.html(exp_content);
		},
		
		/*---------------------------------------------
		@Class: 载入物流信息（订单详情页/退货退款详情页）
		---------------------------------------------*/
		loadRefundExpressInfo: function(expModule, data)
		{
			var expModule = (typeof expModule == 'string') ? $(expModule) : expModule;
			
			if(typeof data == 'string')
			{
				expModule.html(data);
				
				return false;
			}
			
			var datalist = data.data;
			
			var exp_content = '<dd class="expressInfo triangle plr24 pb24 pt12 hide pa">'
							 +'		<div class="expressInfo-hd clearfix">'
							 +'		<p>发货方式：'+ datalist.shipping_type_name +'<span class="pl24">物流公司：'+ datalist.shipping_name +'</span><span class="pl24">运单号码：'+ datalist.invoice_no +'</span></p>'
							 +'	</div>'
							 +'	'
							 +'	<ul class="pt12 clearfix">'
							 +		commonFun.Methods.readExpressState(datalist.shipping_info, 1)
							 +'	</ul>'
							 +'</dd>';
			
			expModule.html(exp_content);
		},
		
		/*---------------------------------------------
		@Class: 读取物流流转状态
				$desc: 1 代表倒序 !1 代表正序
		---------------------------------------------*/
		readExpressState: function(datalist, desc)
		{
			var exp_state_list = '';
			
			if(desc)
			{
				var datalist = datalist.reverse();
			}
			
			for(var i = 0, l = datalist.length; i < l; i ++)
			{
				if((!desc && i == l - 1) || (desc && i == 0))
				{
					exp_state_list += '<li class="color-green">'+ datalist[i].time +' '+ datalist[i].process +'</li>';
				}
				else
				{
					exp_state_list += '<li>'+ datalist[i].time +' '+ datalist[i].process +'</li>';
				}
			}
			
			return exp_state_list;
		},
		
		/*---------------------------------------------
		@Class: 比较两个数组中的内容是否一致
		---------------------------------------------*/
		compareArray: function(arr_1, arr_2)
		{
			var joinArr_1 = arr_1.sort().join(', ');
			var joinArr_2 = arr_2.sort().join(', ');
			
			if(joinArr_1 == joinArr_2)
			{
				return true;
			}
			
			return false;
		},
		
		/*---------------------------------------------
		@Class: 单选/复选框
		---------------------------------------------*/
		checkbox: function(label, isCheck)
		{
			var label = (typeof label == 'string') ? $(label) : label;
			
			if(isCheck == 'check')
			{
				label.each(function(){
					
					var _this = $(this);
					var input = $('input', label);
					
					_this.addClass('checkbox').removeClass('uncheckbox');
					
					if(input[0])
					{
						input.attr('checked', true);
					}
					
				});
			}
			else if(isCheck == 'uncheck')
			{
				label.each(function(){
					
					var _this = $(this);
					var input = $('input', label);
					
					_this.addClass('uncheckbox').removeClass('checkbox');
					
					if(input[0])
					{
						input.attr('checked', false);
					}
					
				});
			}
			else
			{
				var input = $('input', label);
				
				label.toggleClass('checkbox').toggleClass('uncheckbox');
				
				if(input[0] && input.prop('checked'))
				{
					input.attr('checked', false);
				}
				else if(input[0])
				{
					input.attr('checked', true);
				}
			}
		},
		
		/*---------------------------------------------
		@Class: 解析URL参数
		---------------------------------------------*/
		parseUrl: function(url)
		{
			var reg = /(\w+)=(\w+)/ig;
			var parames = {};
			
			url.replace(reg, function(a, b, c){
				parames[b] = c;
			});
			
			return parames;
		},
		
		/*---------------------------------------------
		@Class: 倒计时
		---------------------------------------------*/
		countdown: function(alltime, box, diecallback)
		{
			var box = (typeof box == 'undefined') ? $('body') : box;
				box = (typeof box == 'string') ? $(box) : box;
			var alltime = alltime;
			var oDays = $('[data-class=days]', box);
			var oHours = $('[data-class=hours]', box);
			var oMinutes = $('[data-class=minutes]', box);
			var oSeconds = $('[data-class=seconds]', box);
			var timer = null;
			var i = 1;
			
			timer = setInterval(currentTime, 1000);
			
			function currentTime()
			{
				var iNow = alltime - i;
				
				if(iNow > 0 && iNow < alltime)
				{
					i++;
					
					var iD = parseInt(iNow / 86400);
						iD = iD < 10 ? ('0' + iD) : iD;
						iNow %= 86400;
						
					var iH = parseInt(iNow / 3600);
						iH = iH < 10 ? ('0' + iH) : iH;
						iNow %= 3600;
						
					var iM = parseInt(iNow / 60);
						iM = iM < 10 ? ('0' + iM) : iM;
						iNow %= 60;
						
					var iS = iNow;
						iS = iS < 10 ? ('0' + iS) : iS;
				}
				else
				{
					var iD = '00';
					var iH = '00';
					var iM = '00';
					var iS = '00';
					
					diecallback && diecallback();
					
					clearInterval(timer);
				}
				
				oDays.text(iD);
				oHours.text(iH);
				oMinutes.text(iM);
				oSeconds.text(iS);
			}
		},
		
		/*---------------------------------------------
		@Class: 只能键入数字 回车 上下左右 删除
		---------------------------------------------*/
		detect: function(key)
		{
			if((key == 13) || (key == 8) || (key == 46) || (key >= 37 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))
			{
				return true;
			}
		},
		
		/*---------------------------------------------
		@Class: 设置cookie
		---------------------------------------------*/
		setCookie: function(name, value, iDay)
		{
			if(iDay !== false)
			{
				var oDate = new Date();
				
				if(iDay)
				{
					oDate.setDate(oDate.getDate() + iDay);
				}
				else
				{
					oDate.setDate(oDate.getDate());
				}
				
				document.cookie = name + '=' + value + ';expires=' + oDate + ';path=/';
			}
			else
			{
				document.cookie = name +'='+ value;
			}
		},
		
		/*---------------------------------------------
		@Class: 获取cookie
		---------------------------------------------*/
		getCookie: function(name)
		{
			var arr = document.cookie.split('; ');
			var i = 0;
			
			for(i = 0; i < arr.length; i++)
			{
				var arr2 = arr[i].split('=');
				
				if(arr2[0] == name)
				{
					return arr2[1];
				}
			}
			
			return '';
		},
	
		/*---------------------------------------------
		@Class: 删除cookie
		---------------------------------------------*/
		removeCookie: function(name)
		{
			commonFun.Methods.setCookie(name, 'a', -1);
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 留言相关
	------------------------------------------------------------------*/
	commonFun.Message = {
		/*---------------------------------------------
		@Class: 输入状态
		---------------------------------------------*/
		enterStatus: function(enterBox, sButtonDisabledClass, sType)
		{
			var oEnterBox = $(enterBox);
			var oEnterArea = $('[data-area=enterArea]', oEnterBox);
			var oNotice = $('[data-class=notice]', oEnterBox);
			var oCurrentWord = $('[data-state=currentWord]', oEnterBox);
			var oSubmitButton = $('[data-action=submit]', oEnterBox);
			var sType = sType ? sType : '留言';
			var iMin = oEnterArea.attr('data-min');
				iMin = iMin ? iMin : 0;
			var iMax = oEnterArea.attr('data-max');
				iMax = iMax ? iMax : Infinity;
			var iNow = 0;
			
			oEnterArea.keyup(function(){
				
				var _this = $(this);
					iNow = _this.val().length;
				
				if(iNow >= iMin && iNow <= iMax)
				{
					if (iNow > iMax)
					{
						_this.addClass('textError');
						oCurrentWord && oCurrentWord.addClass('color-red');
					}
					else
					{
						_this.removeClass('textError');
						oCurrentWord && oCurrentWord.removeClass('color-red');
					}
					
					if(iNow <= iMin)
					{
						_this.addClass('textError');
						oSubmitButton && oSubmitButton.addClass(sButtonDisabledClass);
					}
					else
					{
						_this.removeClass('textError');
						oSubmitButton && oSubmitButton.removeClass(sButtonDisabledClass);
					}
					
					oNotice && oNotice.text('');
				}
				else
				{
					_this.addClass('textError');
					oNotice && oNotice.text(sType +'内容不能超过'+ iMax +'个字！');
					oCurrentWord && oCurrentWord.addClass('color-red');
					oSubmitButton && oSubmitButton.addClass(sButtonDisabledClass);
				}
				
				oCurrentWord && oCurrentWord.text(iMax-iNow);		
					
			}).bind('blur', function(){
				
				var _this = $(this);
				var sVal = _this.val();
					sVal = $.trim(sVal);
				var leng = sVal.length;
				
				if(sVal == ''/* || leng < iMin*/)
				{
					//_this.addClass('textError');
					fadeTip(_this);
					//oNotice && oNotice.text(sType +'内容不能为空，或者不能少于'+ iMin +'个字！');
					oNotice && oNotice.text(sType +'内容不能为空！');
				}
				
			});
			
			
			function fadeTip(_this)
			{
				_this.now = 0;
				clearInterval(_this.timer);
				_this.timer = setInterval(function(){
					
					_this.now ++;
					
					if(_this.hasClass('textError'))
					{
						_this.removeClass('textError');
					}
					else
					{
						_this.addClass('textError');
					}
					
					if(_this.now > 3)
					{
						clearInterval(_this.timer);
						_this.addClass('textError');
					}
					
				}, 100);
			}
		},
		
		/*---------------------------------------------
		@Class: 发送留言
		---------------------------------------------*/
		sendMessage: function(MsgListBox, datas, callback)
		{
			$.ajax({
				type: 'POST',
				url: '/Message/send',
				data: datas,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						datas.create_time = ajaxData.data.create_time;
						datas.avator = ajaxData.data.avatar;
						commonFun.Message.insertMessage(MsgListBox, datas);	
						callback && callback(commonFun.Message.successNotice);
					}
					else
					{
						callback && callback(commonFun.Message.errorNotice);
					}
				},
				error: function()
				{
					callback && callback(commonFun.Message.errorNotice);
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 发送成功的提示
		---------------------------------------------*/
		successNotice: function()
		{
			var content = '<div class="clearfix">'
						 +'	<div class="icon-success-21 sprites fl"></div>'
						 +'	<p class="pl12 lh22 f14 fl">发送留言成功！</p>'
						 +'</div>';
			
			$.block({
				title: ' ',
				hideCloseButton: true,
				content: content
			});
			
			setTimeout(function(){
				
				$.unblock();
				
			}, 1500);
		},
		
		/*---------------------------------------------
		@Class: 发送失败的提示
		---------------------------------------------*/
		errorNotice: function()
		{
			var content = '<div class="clearfix">'
						 +'	<div class="icon-error-21 sprites fl"></div>'
						 +'	<p class="pl12 lh22 f14 fl">发送留言失败！</p>'
						 +'</div>';
			
			$.block({
				title: ' ',
				hideCloseButton: true,
				content: content
			});
			
			setTimeout(function(){
				
				$.unblock();
				
			}, 1500);
		},
		
		/*---------------------------------------------
		@Class: 将回复成功的留言插入到页面中
		---------------------------------------------*/
		insertMessage: function(MsgListBox, datas)
		{
			var oMsgListBox = $(MsgListBox);
			
			if(!oMsgListBox[0]) return false;
			
			var aList = oMsgListBox.children();
			var sHtml = '';
				
				//console.log(datas);
				
				sHtml += '<li class="msg-item ptb24 anim-all clearfix">'
					  +'	<div class="mr36 pr fl">'
					  +'		<img src="'+ datas.avator +'" width="60" height="60" class="block circle" />'
					  +'	</div>'							
					  +'	<dl class="msg-inner pr fl">'
					  +'		<dt class="msg-tit clearfix">'
					  +'			<cite class="fl">我</cite>'
					  +'			<p class="msg-time fr">'+ datas.create_time +'</p>'
					  +'		</dt>'								
					  +'		<dd class="msg-des pt12 clearfix">'
					  +'			<div class="msg-art fl">'+ datas.content +'</div>'
					  +'		</dd>'
					  +'	</dl>'
					  +'</li>';
			
			if(aList.length)
			{
				oMsgListBox.prepend(sHtml);
			}
			else
			{
				oMsgListBox.empty().append(sHtml);
			}
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 添加喜欢 / 取消喜欢
	------------------------------------------------------------------*/
	commonFun.Favorite = {
		/*---------------------------------------------
		@Class: 初始化收藏按钮的自定义属性
		---------------------------------------------*/
		initCollectButtonAttr: function(collectButton, isFavorite)
		{
			var collectButton = (typeof collectButton == 'string') ? $(collectButton) : collectButton;
			
			if(isFavorite == 1)
			{
				collectButton.addClass('icon-favorite').removeClass('icon-unfavorite');
				collectButton.attr('data-action', 'cancelFavorite');
			}
			else
			{
				collectButton.addClass('icon-unfavorite').removeClass('icon-favorite');
				collectButton.attr('data-action', 'addFavorite');
			}
		},
		
		/*---------------------------------------------
		@Class: 添加收藏成功
		---------------------------------------------*/
		success: function(_this, isFavorite)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			
			if(isFavorite == 1)
			{
				_this.addClass('icon-favorite').removeClass('icon-unfavorite');
				_this.attr('data-action', 'cancelFavorite');
			}
			else
			{
				_this.addClass('icon-unfavorite').removeClass('icon-favorite');
				_this.attr('data-action', 'addFavorite');
			}
		},
		
		/*---------------------------------------------
		@Class: 添加收藏失败
		---------------------------------------------*/
		faild: function()
		{
			//console.log('请先登录！');
		},
		
		/*---------------------------------------------
		@Class: 列表 添加收藏
		---------------------------------------------*/
		productAddCollectAction: function(psn, _this, isFavorite)
		{
			$.ajax({
				type: 'POST',
				url: '/Favourite/productAdd',
				data: {
					prodSn: psn
				},
				success: function(ajaxData)
				{					
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{						
						commonFun.Favorite.success(_this, isFavorite);
					}
					else if(ajaxData.code == 1)
					{
						commonFun.Favorite.faild();
						location.href = ajaxData.gotoUrl;
					}
					
				},
				error: function()
				{
					//console.log('error!');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 列表 取消收藏
		---------------------------------------------*/
		productCancelCollectAction: function(psn, _this, isFavorite)
		{
			$.ajax({
				type: 'POST',
				url: '/Favourite/productCancel',
				data: {
					prodSn: psn
				},
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					if(ajaxData.code == 0)
					{						
						commonFun.Favorite.success(_this, isFavorite);
					}
					else if(ajaxData.code == 1)
					{
						commonFun.Favorite.faild();
					}					
				},
				error: function()
				{
					//console.log('error!');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 列表 添加/取消 收藏，注册点击事件
		---------------------------------------------*/
		regProductCollectEvent: function(_this, _parents)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			var oParents = _this.parents(_parents);
			var psn = oParents.attr('data-product-sn');
			var isFavorite = 0;
			
			if(!_this[0])
			{
				return false;
			}
			
			_this.unbind();
			_this.bind('click', function(){
			
				var isLogin = commonFun.Actions.isLoginAction();
			
				//console.log(isLogin);
				
				if(!isLogin)
				{
					$('.header [data-action=login]').trigger('click');
					return false;
				}
				
				var action = _this.attr('data-action');
				
				if(action == 'addFavorite')
				{
					isFavorite = 1;
					commonFun.Favorite.productAddCollectAction(psn, _this, isFavorite);
				}
				else if(action == 'cancelFavorite')
				{
					isFavorite = 0;
					commonFun.Favorite.productCancelCollectAction(psn, _this, isFavorite);
				}
				
				return false;
			});
		},
		
		/*---------------------------------------------
		@Class: 我的喜欢 添加收藏
		---------------------------------------------*/
		favoriteAddCollectAction: function(pid, _this, isFavorite)
		{
			$.ajax({
				type: 'POST',
				url: '/Favourite/favouriteAdd',
				data: {
					id: pid
				},
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{						
						commonFun.Favorite.success(_this, isFavorite);
					}
					else
					{
						commonFun.Favorite.faild();
					}
					
				},
				error: function()
				{
					//console.log('error!');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 我的喜欢 取消收藏
		---------------------------------------------*/
		favoriteCancelCollectAction: function(pid, _this, isFavorite)
		{
			$.ajax({
				type: 'POST',
				url: '/Favourite/favouriteCancel',
				data: {
					id: pid
				},
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{						
						commonFun.Favorite.success(_this, isFavorite);
					}
					else
					{
						commonFun.Favorite.faild();
					}
					
				},
				error: function()
				{
					//console.log('error!');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 我的喜欢 添加/取消 收藏，注册点击事件
		---------------------------------------------*/
		regFavoriteCollectEvent: function(_this, _parents)
		{
			var _this = (typeof _this == 'string') ? $(_this) : _this;
			var oParents = _this.parents(_parents);
			var pid = oParents.attr('data-f-id');
			var isFavorite = 0;
			
			if(!_this[0])
			{
				return false;
			}
			
			_this.bind('click', function(){
				
				var action = _this.attr('data-action');
				
				if(action == 'addFavorite')
				{
					isFavorite = 1;
					commonFun.Favorite.favoriteAddCollectAction(pid, _this, isFavorite);
				}
				else if(action == 'cancelFavorite')
				{
					isFavorite = 0;
					commonFun.Favorite.favoriteCancelCollectAction(pid, _this, isFavorite);
				}
				
				return false;
			});
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 各种验证方法
	------------------------------------------------------------------*/
	commonFun.Check = {
		// 字符串验证
		string: function(obj, opts)
		{
			//var obj = (typeof obj == 'string') ? $(obj) : obj;
			var timer = null;
				
			$(document).on('focus', obj, function(){
				
				var _this = $(this);
				
				commonFun.Check.hideError(_this);
				
			}).on('blur', obj, function(){
				
				var _this = $(this);
				opts.isCheck = true;
				
				commonFun.Check.check(_this, opts);
				
			});
			
			$(document).on('keyup', obj, function(ev){
				
				var _this = $(this);
				
				clearTimeout(timer);
				timer = setTimeout(function(){
					
					clearTimeout(timer);
					opts.isCheck = false;
					commonFun.Check.check(_this, opts);
					
				}, 50);
									
			});
		},
		
		// 提示信息
		check: function(obj, opts)
		{
			var defaults = {
				type: 'string',
				isCheck: true,
				isFocus: false,
				required: '此项为必填项',
				format: '格式错误，请重新填写'
			};			
			var opts = $.extend({}, defaults, opts || {});
			
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			//var name = obj.attr('name');
			//var oId = opts.selector ? $(opts.selector) : $('#error-warning-'+ name);
			var required = obj.attr('data-required');
			var iMin = obj.attr('data-min');
				iMin = parseInt(iMin);
				iMin = isNaN(iMin) ? 0 : iMin;
			var iMax = obj.attr('data-max');
				iMax = parseInt(iMax);
				iMax = isNaN(iMax) ? Infinity : iMax;
			var str = obj.val();
				str = $.trim(str);
			var str_len = str.length;
			var bHide = true;
			
			if(str === '' && required)
			{
				showError(opts.required);
				return false;
			}
			else if(str !== '' && (str_len < iMin || str_len > iMax))
			{
				showError(opts.format);
				return false;
			}
			else if(str !== '' && opts.type === 'number')
			{
				var b = commonFun.Regular.isNumber(str);
				
				if(!b)
				{
					showError(opts.format);
					return false;
				}
			}
			else if(str !== '' && opts.type === 'email')
			{
				var b = commonFun.Regular.isEmail(str);
				
				if(!b)
				{
					showError(opts.format);
					return false;
				}
			}
			else if(str !== '' && opts.type === 'mobile')
			{
				var b = commonFun.Regular.isMobile(str);
				
				if(!b)
				{
					showError(opts.format);
					return false;
				}
			}
			
			if(bHide)
			{
				hideError();
				return true;
			}
			
			function showError(msg)
			{
				bHide = false;
				//opts.isCheck && obj.addClass('textError');
				//opts.isCheck && oId.show().html(msg);
				if(opts.isCheck)
				{
					commonFun.Check.showError(obj, msg, opts.selector);
				}
				opts.isFocus && obj.focus();
			}
			
			function hideError()
			{
				bHide = true;
				//obj.removeClass('textError');
				//oId.hide().html('');
				commonFun.Check.hideError(obj, opts.selector);
			}
		},
		
		// 显示错误提示
		showError: function(obj, msg, selector)
		{
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			
			if(obj[0])
			{
				var name = obj.attr('name');
				var name = name ? name : obj.attr('id');
				var oId = selector ? $(selector) : $('#error-warning-'+ name);
				
				obj.addClass('textError');
				oId.show().html(msg);
			}
		},
		
		// 隐藏错误提示
		hideError: function(obj, selector)
		{
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			
			if(obj[0])
			{
				var name = obj.attr('name');
				var name = name ? name : obj.attr('id');
				var oId = selector ? $(selector) : $('#error-warning-'+ name);
				
				obj.removeClass('textError');
				oId.hide().html('');
			}
		}
	};
	
	/*------------------------------------------------------------------
	@Class: 各种正则
	------------------------------------------------------------------*/
	commonFun.Regular = {
		// 邮箱验证
		isEmail: function(str)
		{
			var reg=/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			
			return reg.test(str);
		},
		
		// 手机验证
		isMobile:function(str)
		{
			var reg=/^(13[0-9]{9})|(14[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})$/;
			
			return reg.test(str);
		},
		
		// 网址验证
		isUrl:function(str)
		{
			var reg=/((http[s]?|ftp):\/\/)?[^\/\.]+?\..+\w$/i;
			
			return reg.test(str);
		},
		
		// 全部为数字
		isNumber: function(str)
		{
			var reg=/^[0-9]*$/;
			
			return reg.test(str);
		}
	}
	
	/*------------------------------------------------------------------
	@Class: 密码检测
	------------------------------------------------------------------*/
	commonFun.passCheck = {
		//测试某个字符是属于哪一类. 
		charMode: function(iN)
		{
			if (iN>=48 && iN<=57) //数字
			{
				return 1;
			}
			if (iN>=65 && iN<=90) //大写字母
			{
				return 2;
			}
			if (iN>=97 && iN<=122) //小写
			{
				return 4;
			}
			else	//特殊字符
			{
				return 8;
			}
				
		},
		
		//计算出当前密码当中一共有多少种模式 
		bitTotal: function(num)
		{
			var modes=0;
			for (i=0; i<4; i++)
			{
				if (num & 1)
				{
					modes++;
				}
				num>>>=1;
			}
			
			return modes;
		},
		
		//返回密码的强度级别 
		checkStrong: function(sPW)
		{
			if (sPW.length<=4)	//密码太短
			{
				return 0;
			}
			Modes=0;
			for (i=0; i<sPW.length; i++)	//测试每一个字符的类别并统计一共有多少种模式
			{
				Modes|=commonFun.passCheck.charMode(sPW.charCodeAt(i));
			}
			
			return commonFun.passCheck.bitTotal(Modes);
		},
		
		//当用户放开键盘或密码输入框失去焦点时，根据不同的级别显示不同的颜色 
		pwStrength: function(pwd, icon, text)
		{
			if (pwd==null || pwd=='')
			{
				icon.hide();
				text.text(' ');
			}
			else
			{
				var level=commonFun.passCheck.checkStrong(pwd);
				
				switch(level)
				{
					case 0:
						//icon.removeClass('passLevel-low').removeClass('passLevel-medium').removeClass('passLevel-high');
					case 1:
						icon.show().addClass('passLevel-low').removeClass('passLevel-medium').removeClass('passLevel-high');
						text.text('密码等级：低');
						break;
					case 2:
						icon.show().addClass('passLevel-medium').removeClass('passLevel-low').removeClass('passLevel-high');
						text.text('密码等级：中');
						break;
					default:
						icon.show().addClass('passLevel-high').removeClass('passLevel-medium').removeClass('passLevel-low');
						text.text('密码等级：高');
				}
			}
			
			return;
		}
	};
	
	// 获取系统时间
	commonFun.getNowTime = function()
	{
		var oD = new Date();
		var iY = oD.getFullYear();
		var iM = oD.getMonth() + 1;
			iM = iM < 10 ? '0' + iM : iM;
		var iD = oD.getDate();
			iD = iD < 10 ? '0' + iD : iD;
		var iH = oD.getHours();
			iH = iH < 10 ? '0' + iH : iH;
		var iM = oD.getMinutes();
			iM = iM < 10 ? '0' + iM : iM;
		var iS = oD.getSeconds();
			iS = iS < 10 ? '0' + iS : iS;
		
		return iY + '-' + iM + '-' + iD + ' ' + iH + ':' + iM + ':' + iS;
	}
	
    module.exports = commonFun;
});