define(function(require, exports, module){
    var CATE = {};
	
	require('static/global/common/2.0.0/dialog.js')($);
	require('static/global/common/2.0.0/slider.js')($);
	var CMF = require('static/global/common/2.0.0/common.fun.js');
	
	var DOMAIN = 'http://www.xidibuy.com';
	
	CATE.Datas = {
		isExist: true,
		insertGid: 0,
		goodsInfo: {},
		goodsList: {},
		attrList: {},
		isFavorite: {},
		addCartSuccess: function(curAddCartBtn)
		{
			var timer = null;
			
			curAddCartBtn.attr('data-disabled', 'disabled').html('已加入购物车');
			
			timer = setTimeout(function(){
				
				clearTimeout(timer);
				curAddCartBtn.removeAttr('data-disabled').html('<em></em>加入购物车');
				
			}, 2000);
		},
		
		addCartFaild: function(text)
		{
			var content = '<p style="font-size: 16px;">'+ text +'</p>';
			var timer = null;
			
			$.dialog_block({
				title: ' ',
				content: content
			});
			
			timer = setTimeout(function(){
				
				clearTimeout(timer);
				$.dialog_unblock();
				
			}, 2000);
		}
	};
	
	CATE.Actions = {
		// 获取商品的 价格/编辑时间
		getBaseGoodsInfo: function(datas, callback)
		{
			$.ajax({
				type: 'GET',
				url: DOMAIN + '/detail/getBaseGoodsInfo',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					var datalist = ajaxData.data;
					
					if(ajaxData.code == 0)
					{
						callback && callback(datalist);
					}
					else
					{
						//console.log(ajaxData.msg);
					}
				},
				error: function()
				{
					//console.log('error');
				}
			});
		},
		
		// 获取商品的 属性/库存 等信息
		getGoodsInfo: function(_this, callback)
		{
			var pid = _this.attr('data-product-id');
			
			$.ajax({
				type: 'POST',
				url: DOMAIN + '/detail/get?id=' + pid + '&jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					CATE.Datas.goodsInfo[pid] = ajaxData;
					
					if(ajaxData.code == 0)
					{
						CATE.Datas.isFavorite[pid] = CATE.Datas.goodsInfo[pid].data[pid].isFavourite;
						CATE.Datas.goodsList[pid] = CATE.Datas.goodsInfo[pid].data[pid].goodList;
						CATE.Datas.attrList[pid] = CATE.Datas.goodsInfo[pid].data[pid].attrList;
						
						callback && callback(_this, CATE.Datas.attrList[pid]);
					}
					
					CATE.Methods.setAddCartButtonState(pid);
					CATE.Methods.setGoodsFavoriteState(pid);
				},
				error: function()
				{
					//console.log('获取商品信息失败！');
				}
			});
		},
		
		// 插入商品到购物车
		insertCart: function(curAddCartBtn, callback)
		{
			var id = curAddCartBtn.attr('data-product-id');
			var num = curAddCartBtn.attr('data-product-num');
			var datas = {};
				datas.productId = '{"' + id + '":' + num + "}";
			
			$.ajax({
				type: 'GET',
				url: DOMAIN + '/Cart/add?productId=' + datas.productId + '&jsoncallback=?',
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					CMF.Actions.getCartNum();
					
					if(ajaxData.code == 0)
					{						
						callback && callback(curAddCartBtn);						
					}
					else
					{
						//console.log('faild');
					}
				},
				error: function()
				{
					CATE.Datas.addCartFaild('添加购物车失败！');
				}
			});
		},
		
		// 列表/单品页 添加/取消喜欢
		productCollect: function(oParents, isAdd)
		{
			var pid = oParents.attr('data-product-id');
			var psn = oParents.attr('data-product-sn');
			var actionUrl = isAdd ? '/Favourite/productAdd' : '/Favourite/productCancel';
			var datas = {};
				datas.prodSn = psn;
			
			$.ajax({
				type: 'POST',
				url: DOMAIN + actionUrl,
				data: datas,
				success: function(ajaxData)
				{					
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{						
						CATE.Methods.setGoodsFavoriteState(pid);
					}
					else
					{
						//console.log('faild!');
					}
					
				},
				error: function()
				{
					//console.log('error!');
				}
			});
		},
		
		// 我的喜欢 添加/取消喜欢
		favoriteCollect: function(oParents, isAdd)
		{
			var pid = oParents.attr('data-product-id');
			var actionUrl = isAdd ? '/Favourite/favouriteAdd' : '/Favourite/favouriteCancel';
			var datas = {};
				datas.id = pid;
			
			$.ajax({
				type: 'POST',
				url: DOMAIN + actionUrl,
				data: datas,
				success: function(ajaxData)
				{					
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{						
						CATE.Methods.setGoodsFavoriteState(pid);
					}
					else
					{
						//console.log('faild!');
					}
					
				},
				error: function()
				{
					//console.log('error!');
				}
			});
		}
	};
	
	CATE.Methods = {
		// 初始化商品信息
		initGoodsInfo: function(selects)
		{
			CATE.Methods.selectSetGoods(selects);	
		},
		
		// 选择要设置 价格/编辑时间 的商品
		selectSetGoods: function(selects)
		{
			var selects = (typeof selects == 'string') ? $(selects) : selects;
			var datas = {};
			var arr = [];
			
			selects.each(function(){
				
				var _this = $(this);
				var id = _this.attr('data-goodsInfo-id');
				
				arr.push(id);
				
			});
			
			datas.ids = arr.join(',');
			
			CATE.Actions.getBaseGoodsInfo(datas, CATE.Methods.setBaseGoodsInfo);
		},
		
		// 设置商品的 价格/编辑时间
		setBaseGoodsInfo: function(datalist)
		{		
			for(var id in datalist)
			{
				var sEditTime = datalist[id].editTime;
				var sPrice = datalist[id].price;
					sPrice = '¥' + sPrice;
					
				var categoryBox = $('[data-class=category][data-goodsInfo-id='+ id +']');
				var goodsEditTimeBox = $('[data-class=goodsEditTime][data-goodsInfo-id='+ id +']');
				
				categoryBox[0] && categoryBox.text(sPrice);
				goodsEditTimeBox[0] && goodsEditTimeBox.text(sEditTime);
			}
		},
		
		// 根据 pid 判断是否请求 ajax 获取商品信息
		isGetGoodsInfo: function(_this, callback)
		{
			var pid = _this.attr('data-product-id');
			
			if(typeof CATE.Datas.goodsInfo[pid] == 'undefined')
			{
				CATE.Actions.getGoodsInfo(_this, callback);
			}
			else
			{
				callback && callback(_this, CATE.Datas.attrList[pid]);
				
				CATE.Methods.setAddCartButtonState(pid);
			}
		},
		
		// 设置加入购物车按钮的状态
		setAddCartButtonState: function(pid, gid)
		{
			var addCartButton = $('.products-outer[data-product-id='+ pid +'] .add-cart-button');
			var newGid = gid ? gid : pid;
			
			if(typeof CATE.Datas.goodsList[pid] == 'undefined')
			{
				addCartButton.html('商品不存在');
				addCartButton.addClass('button-disabled');
			}				
			else if(CATE.Datas.goodsList[pid][newGid].stockNum < 1)
			{
				addCartButton.html('缺货登记');
				addCartButton.addClass('button-disabled');
			}
			else
			{
				addCartButton.html('<em></em>加入购物车');
				addCartButton.removeClass('button-disabled');
			}
			
			if(gid)
			{
				addCartButton.attr('data-product-id', gid);
			}
		},
		
		// 设置当前商品的 喜欢 状态
		// @pid: 商品id 或者 sn
		// @type: 用于区分是 id 还是 sn
		setGoodsFavoriteState: function(pid)
		{
			var isFavorite = CATE.Datas.isFavorite[pid];
			var oFavorite = $('[data-product-id="'+ pid +'"] [data-class="favorite"]');
			
			if(isFavorite)
			{
				CATE.Datas.isFavorite[pid] = 0;
				oFavorite.addClass('icon-favorite').removeClass('icon-unfavorite');
			}
			else
			{
				CATE.Datas.isFavorite[pid] = 1;
				oFavorite.addClass('icon-unfavorite').removeClass('icon-favorite');
			}
		},
		
		// 获取已选择的属性
		getSelectedAttr: function(_this)
		{
			var sDataClass = _this.attr('data-class');
			var selectedClass = sDataClass == 'list' ? 'products-attr-select' : 'detail-goods-attr-select';
			var oSelectedAttr = $('.' + selectedClass, _this);
			var aSelectedAttr = [];
			var sSelectedAttr = '';
			
			oSelectedAttr.each(function(index, element){
                
				var currentAttr = $(this).attr('data-product-attr');
				
				aSelectedAttr.push(currentAttr);
				
            });
			
			sSelectedAttr = aSelectedAttr.sort().join(', ');
			
			return sSelectedAttr;
		},
		
		// 组合 ajax 请求获取的商品的属性
		connectGoodsAttr: function(pid)
		{
			var goodsList = CATE.Datas.goodsList[pid];
			var goodsAttr = {};
			
			for(var gid in goodsList)
			{
				var priceAttr = goodsList[gid].priceAttr;
				
				goodsAttr[gid] = connectPriceAttr(priceAttr);
			}
			
			function connectPriceAttr(priceAttr)
			{
				var aAttr = [];
				var sAttr = '';
				
				for(var attr in priceAttr)
				{
					aAttr.push(attr);
				}
				
				sAttr = aAttr.sort().join(', ');
				
				return sAttr;
			}
			
			return goodsAttr;
		},
		
		// 获取选择的商品 id
		getId: function(pid, selectedAttr)
		{
			var goodsAttr = CATE.Methods.connectGoodsAttr(pid);
			var getId = 0;
			
			for(var gid in goodsAttr)
			{
				if(selectedAttr == goodsAttr[gid])
				{
					getId = gid;
				}
			}
			
			return getId;
		},
		
		// 获取商品图片
		getGoodsImage: function(_this, attrList)
		{
			var pid = _this.attr('data-product-id');
			var products_image = $('.products-image', _this);
			var products_image_list = $('.products-image-list', _this);
			var products_image_control = $('.products-image-control', _this);
			var coverImg = $('img', products_image_list);
			var imgWidth = coverImg.width();
			var imgHeight = coverImg.height();
			var coverA = coverImg.parent();
			var coverAttr = coverA.attr('data-product-attr');
			var imgHtml = '';
			var i = 0;
			
			if(coverImg.length > 1)
			{
				return false;
			}
			
			for(var i in attrList)
			{
				if(attrList[i].name == '颜色')
				{
					var colorimg = attrList[i].colorimg;
				}
			}
			
			for(var attr in colorimg)
			{
				if(attr != coverAttr && coverImg.length < 2)
				{
					imgHtml += '<a href="" data-product-attr="'+ attr +'" style="position:absolute; left:'+ imgWidth +'px;"><img src="http://image.xidibuy.com/'+ colorimg[attr] +'" width="'+ imgWidth +'" height="'+ imgHeight +'"></a>';
					
					i ++;
				}
			}
			
			if(i)
			{
				products_image_list.append(imgHtml);
				
				_this.slider({
					autoPlay: false,
					duration: 400,
					callback: function(currenObj)
					{
						var attr = currenObj.attr('data-product-attr');
						
						_this.find('.products-attr-val-list').eq(0).find('[data-product-attr="'+ attr +'"]').click();
					}
				});
			}
		},
		
		// 判断购物车中有没有当前要插入的商品
		isExist: function(datalist)
		{			
			var shopItem = datalist.data.shopItem;
			
			CATE.Datas.isExist = false;
			
			for(var shop in shopItem)
			{
				var goodsItem = shopItem[shop].goodsItem;
				
				for(var goods in goodsItem)
				{
					if(goodsItem[goods].goodsId == CATE.Datas.insertGid)
					{
						CATE.Datas.isExist = true;
						break;
					}
				}
			}
		},
		
		// 判断当前用户还能添加几件商品到购物车
		isInsertGoods: function(insertGid)
		{
			CATE.Datas.insertGid = insertGid;
			
			CMF.Actions.getSkuGoodsNums();
			CMF.Actions.getCartGoods(CATE.Methods.isExist);
			
			if(XD.Datas.skuGoodsNums >= XD.Datas.cartMax && !CATE.Datas.isExist)
			{
				CATE.Datas.addCartFaild('购物车已满！');
				
				return false;
			}
			
			return true;
		}
	};
	
	CATE.Events = {
		// 选择商品属性<列表页>
		listSelectedAttr: function(_this)
		{
			var oProAttr = $('.products-attr-val', _this);
			
			oProAttr.on('click', function(){
				
				var pthis = $(this);
				
				if(pthis.hasClass('products-attr-select'))
				{
					return false;
				}
				
				pthis.addClass('products-attr-select').siblings().removeClass('products-attr-select');
				
				var pid = _this.attr('data-product-id');
				var selectedAttr = CATE.Methods.getSelectedAttr(_this);
				var gid =  CATE.Methods.getId(pid, selectedAttr);
				
				CATE.Methods.setAddCartButtonState(pid, gid);
				
			});
		},
		
		// 选择商品属性<单品页>
		detailSelectedAttr: function(currentObj, type)
		{
			var currentObj = (typeof currentObj == 'string') ? $(currentObj) : currentObj;
			var oProAttrBox = $('.detail-goods-attr-val', currentObj);
			var oProAttr = oProAttrBox.children('[data-product-attr]');
			
			CATE.Actions.getGoodsInfo(currentObj);
			
			oProAttr.on('click', function(){
				
				var pthis = $(this);
				
				if(pthis.hasClass('products-attr-select'))
				{
					return false;
				}
				
				pthis.addClass('detail-goods-attr-select').siblings().removeClass('detail-goods-attr-select');
				
				var pid = currentObj.attr('data-product-id');
				var selectedAttr = CATE.Methods.getSelectedAttr(currentObj);
				var gid =  CATE.Methods.getId(pid, selectedAttr);
				
				if(type == 'preview')
				{
					location.href = DOMAIN + '/preview/home?token='+ show_token +'&id='+ gid;
				}
				else
				{
					location.href = DOMAIN + '/detail/?id='+ gid;
				}
			});
		},
		
		// 单击加入购物车按钮
		clickAddCartButton: function(addCartButton)
		{
			var addCartButton = (typeof addCartButton == 'string') ? $(addCartButton) : addCartButton;
			
			addCartButton.on('click', function(){
				
				var _this = $(this);
				var hasClass = _this.hasClass('button-disabled');
				var isDis = _this.attr('data-disabled');
				
				if(hasClass || isDis == 'disabled')
				{
					return false;
				}
				
				var insertGid = _this.attr('data-product-id');
				
				if(CATE.Methods.isInsertGoods(insertGid))
				{
					CATE.Actions.insertCart(_this, CATE.Datas.addCartSuccess);
				}
				
				return false;
				
			});
		},
		
		// 单击喜欢按钮
		clickFavoriteButton: function(favoriteButton, parents, isMyFavorite)
		{
			var oFavoriteButton = (typeof favoriteButton == 'string') ? $(favoriteButton) : favoriteButton;
			var oParents = (typeof parents == 'string') ? $(parents) : parents;
			
			if(oFavoriteButton.length < 1)
			{
				return false;
			}
			
			oFavoriteButton.on('click', function(){
				
				var _this = $(this);
				var hasFavorite = _this.hasClass('icon-favorite');
				
				if(hasFavorite)
				{
					if(isMyFavorite)
					{
						CATE.Actions.favoriteCollect(oParents, 'addFavorite');
					}
					else
					{
						CATE.Actions.productCollect(oParents, 'addFavorite');
					}
				}
				else
				{
					if(isMyFavorite)
					{
						CATE.Actions.favoriteCollect(oParents);
					}
					else
					{
						CATE.Actions.productCollect(oParents);
					}
				}
				
				return false;
				
			});
		}
	};
	
    module.exports = CATE;
});