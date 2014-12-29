define(function(require, exports, module){
	var order;
	
	var commonFun = require('{common}common.fun');
	var Plugs = require('{common}jquery.plugs')($);
	
	// 订单列表的内容垂直居中
	(function(){
		
		var sBody = '[data-class=order-body]';
		var sMain = '[data-class=order-main]';
		var sPro = '[data-class=order-pro]';
		var sImage = '[data-class=order-image]';
		var sInfo = '[data-class=order-info]';
		var sPrice = '[data-class=order-price]';
		var sCount = '[data-class=order-count]';
		var sAfter = '[data-class=order-after]';
		var sTotal = '[data-class=order-total]';
		var sState = '[data-class=order-state]';
		var sOper = '[data-class=order-oper]';
		
		var aBody = $(sBody);
		var aTotal = $(sTotal);
		
		if(aBody.length < 1)
		{
			return false;
		}
		
		aBody.each(function(){
			
			var _this = $(this);
			var iBodyHeight = _this.height();
			var iMainHeight = $(sMain, _this).height();
			var oProHeight = $(sPro, _this).height();
			
			var oInfo = $(sInfo, _this);
			var iBeforeInfoHeight = oInfo.height();
			var iInfoPaddingTop = Math.floor((oProHeight - iBeforeInfoHeight) / 2);
			
			var oPrice = $(sPrice, _this);
			var iBeforePriceHeight = oPrice.height();
			var iPricePaddingTop = Math.floor((oProHeight - iBeforePriceHeight) / 2);
			
			var oCount = $(sCount, _this);
			var iBeforeCountHeight = oCount.height();
			var iCountPaddingTop = Math.floor((oProHeight - iBeforeCountHeight) / 2);
			
			var oAfert = $(sAfter, _this);
			var iBeforeAfterHeight = oAfert.height();
			var iAfterPaddingTop = Math.floor((oProHeight - iBeforeAfterHeight) / 2);
			
			var oOper = $(sOper, _this);
			var iBeforeOperHeight = oOper.height();
			var iOperPaddingTop = Math.floor((iBodyHeight - iBeforeOperHeight) / 2);
			
			oInfo.css({ paddingTop: iInfoPaddingTop});
			oPrice.css({ paddingTop: iPricePaddingTop});
			oCount.css({ paddingTop: iCountPaddingTop});
			oAfert.css({ paddingTop: iAfterPaddingTop});
			oOper.css({ paddingTop: iOperPaddingTop});
		});
		
		aTotal.each(function(){
			
			var _this = $(this);
			var oParentMain = _this.siblings(sMain);
			var iParentMainHeight = oParentMain.height();
			
			var oTotal = _this;
			var iBeforeTotalHeight = oTotal.height();
			var iTotalPaddingTop = Math.floor((iParentMainHeight - iBeforeTotalHeight) / 2);
			
			var oState = oTotal.siblings(sState);
			var iBeforeStateHeight = oState.height();
			var iStatePaddingTop = Math.floor((iParentMainHeight - iBeforeStateHeight) / 2);
			
			oTotal.css({ paddingTop: iTotalPaddingTop});
			oState.css({ paddingTop: iStatePaddingTop});
		});	
		
	})();
		
	//订单列表 筛选/翻页
	(function(){
		
		var url = location.href;
		var parames = commonFun.Methods.parseUrl(url);
		var t = parames.t;
			t = t ? t : 1;
		var s = parames.s;
			s = s ? s : 0;
		var orderPageForm = $('#orderPageForm');
		var orderType = $('#orderFilter-select');
		var orderState = $('#orderState-select');
		var pageBtn = $('.pageBtn');
		
		orderType.selects({
			selects: t,
			callback: function()
			{
				orderPageForm.submit();
			}
		});
		
		orderState.selects({
			selects: s,		
			callback: function()
			{
				orderPageForm.submit();
			}
		});
		
		pageBtn.bind('click', function(){
			
			orderPageForm.submit();
			
		});
		
	})();	
	
	/*------------------------------------------------------------------
	@Class: 物流信息
	------------------------------------------------------------------*/
	(function(){
		
		var xidiUrl = location.href;
		var oExpress = $('#logistics');
		var oButton = $('h3', oExpress);
		var oExpressMsg = $('.expressMsg', oExpress);
		var bAction = true;
		
		if(!oExpress[0]) return false;
		
		if(xidiUrl.indexOf('logistics') > 0 )
		{
			oExpress.addClass('expressCur');
			oExpressMsg.show();
			
			showExpInfo();
		}
		
		oButton.on('click', function(){
			
			oExpress.toggleClass('expressCur');
			oExpressMsg.stop(true, true).toggle();
			
			showExpInfo();
			
		});
		
		function showExpInfo()
		{
			if(bAction)
			{
				bAction = false;
				commonFun.Actions.getOrderExpressInfoAction(oButton, oExpressMsg, commonFun.Methods.loadExpressInfo );
			}
		}
		
	})();
	
	// 选择发票信息
	(function(){
		
		var radioCompany = $('#radio-company');
		var radioPersonal = $('#radio-personal');
		var companyTxt = radioCompany.siblings('.companyTxt');
		
		// 显示单位信息输入框
		radioCompany.bind('click', function(){
			
			companyTxt.show();
			
		});
		
		// 隐藏单位信息输入框
		radioPersonal.bind('click', function(){
			
			companyTxt.hide();
			
		});
		
	})();
	
	// 收起/展开全部地址	
	$('#addressMore').bind('click', function(){
		
		var _this = $(this);
		
		if(_this.html() == '显示全部地址')
		{		
			$('#addressList').css({ height: 'auto'});
			_this.html('收起部分地址');
		}
		else
		{
			$('#addressList').attr('style', '');
			_this.html('显示全部地址');
		}
		
	});
	
	// 选择收货地址, 更改运费
	$('#addressList > .address-item').live('click', function(){
		
		var _this = $(this);
		
		var aid = _this.attr('val');
		var orderAddress = $('#orderAddress');
		/*var oDetailAddress = $('[data-class=receivingInfo]');
		var sName = $('[data-class=consignee]', _this).text();
		var sMobile = $('[data-class=mobile]', _this).text();
		var sAddress = $('[data-class=address]', _this).text();
		var sDetailAddress = $('[data-class=detailAddress]', _this).text();*/
		
		var oTotalBox = $('.total-box');
		var weight = oTotalBox.attr('data-weight');
		var oFee = $('[data-class=fee]', oTotalBox);
		var oTotalPrice = $('[data-class=totalPrice]', oTotalBox);
		var oPrice = $('.total-info[data-price]', oTotalBox);
		var iPrice = oPrice.attr('data-price');
			iPrice = parseFloat(iPrice);
			
		var datas = {};
			datas.provinceId = _this.attr('data-province');
			datas.cityId = _this.attr('data-city');
			datas.weight = weight;
		
		_this.addClass('address-current').siblings().removeClass('address-current');
		
		$.ajax({
			type: 'POST',
			url: '/order/getFeeByAddress',
			data: datas,
			dataType: 'json',
			success: function(ajaxData)
			{
				var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
				
				if(ajaxData.code == 0)
				{
					var iFee = parseFloat(ajaxData.data);
					var iTotal = iPrice + iFee;
					
						iFee = iFee.toFixed(2);
						iTotal = iTotal.toFixed(2);
					
					oFee.text(iFee);
					oTotalPrice.text(iTotal);
					orderAddress.val(aid);
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
		
		return false;
		
	});
	
	// 进入页面的时候默认选中第一个地址
	(function(){
		
		var addressItem = $('.address-item');
		
		addressItem.first().click();
		
		if(addressItem.length < 4)
		{
			$('#addressMore').addClass('hide');
		}
		
	})();
	
	// 单位名称长度控制
	(function(){
		
		var companyTxt = $('.companyTxt');
		
		companyTxt.bind('focus', function(){
			
			var _this = $(this);
			
			_this.attr('autocomplete', 'off');
			
			_this.bind('keydown', function(ev){
				
				var str = _this.val();
				var str_len = str.length;
				var key = ev.keyCode;			
				
				if((str_len >= 50 && !(key == 8 || key == 46 || key == 37 || key == 38 || key == 39 || key == 40)) || key == 13)
				{
					return false;
				}
				
			});
			
		});
		
	})();
	
	// 轮询更改 购物清单下面的 收货信息
	(function(){
		
		setInterval(getAddInfo, 100);
		
		function getAddInfo()
		{
			var currentAdd = $('.address-current');
			var sName = $('[data-class=consignee]', currentAdd).text();
			var sMobile = $('[data-class=mobile]', currentAdd).text();
			var sAddress = $('[data-class=address]', currentAdd).text();
			var sDetailAddress = $('[data-class=detailAddress]', currentAdd).text();
			var oDetailAddress = $('[data-class=receivingInfo]');
			
			oDetailAddress.text(sName +' '+ sMobile +' '+ sAddress +' '+ sDetailAddress);
		}
		
	})();
	
	// 运费 了解更多
	(function(){
		
		var oBody = $('body');
		var sInfo = '<div class="order-more-content pa" id="order-more-content">'
				   +'	<div class="tip-box pa">'
				   +'		<div class="tip-top pa"></div>'
				   +'		<div class="tip-bot pa"></div>'
				   +'	</div>'								   
				   +'	<div class="plr24 ptb12">'
				   +'		<p>秉持为顾客争取中准公道价格的理念，去除进口商运营商加价，平台销售的商品，均不包邮，期待您的理解与支持，更多价格详情...</p>'
				   +'	</div>'
				   +'</div>';
				   				   
		var oInfo = $(sInfo);
		
		$('[data-class=order-more-content]').bind('mouseover', function(){
			
			var _this = $(this);
			var _this_left = _this.offset().left;
			var _this_top = _this.offset().top;
			var _this_width = _this.outerWidth();
			var _this_height = _this.outerHeight();
			var iLeft = _this_left + _this_width - 196;
			var iTop = _this_top + _this_height + 8;
			
			oBody.append(oInfo);
			
			oInfo.css({ left: iLeft, top: iTop}).fadeIn();
			
		}).bind('mouseout', function(){
			
			oInfo.stop().fadeOut(function(){
				
				oInfo.remove();
				
			});
			
		});
		
	})();
	
	// 提交订单
	$('#finalOrderSubmit').bind('click', function(){
		
		var _this = $(this);
		var t = $('[name="invoice[head]"]:checked').val();
		
		if(t == 2 && $.trim($('.companyTxt').val()) == '')
		{
			var invoiceText = '请填写发票信息！';
			
			faildNotice(invoiceText);
			
			return false;
		}
		
		$.ajax({
			type: 'POST',
			url: '/Order/save',
			data: $('#orderForm').serialize(),
			dataType: 'json',
			success: function(ajaxData)
			{
				var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
				
				if (ajaxData.code == 0)
				{
					location.href = '/' + ajaxData.url;
				}
				else if(ajaxData.code == -10105)
				{
					//console.log('faild');
					faildNotice(ajaxData, true);
				}
				else
				{
					//console.log('faild');
					faildNotice(ajaxData);
				}
			},
			error: function()
			{
				//console.log('error');
			}
		});
		
		return false;
		
	});
	
	// 选择支付方式
	(function(){
		// 更改付款方式
		$('#otherPayMothed').bind('click', function(){
			
			var oThis = $(this);
			
			var content = '<div class="payMothed clearfix">'
						  +'	<dl class="clearfix">'
						  +'		<dt class="hide clearfix">支付平台</dt>'
						  +'		<dd class="clearfix">'
						  +'			<ul class="clearfix">'
						  +'				<li><input type="radio" name="payType" value="alipay" id="alipay" /><label for="alipay" class="pl12"><img src="'+ JS_DOMAIN +'static/global/images/1.0.0/zfb.gif" /></label></li>'
						  +'				<li><input type="radio" name="payType" value="union" id="union" /><label for="union" class="pl12"><img src="'+ JS_DOMAIN +'static/global/images/1.0.0/pay.png" /></label></li>'
						  +'			</ul>'
						  +'		</dd>'
						  +'	</dl>'
						  +'</div>';
			
			$.block({
				title: '支付方式',
				content: content
			});
			
			var oPayHidden = $('.payType');
			
			if(oPayHidden.val() == 'alipay')
			{
				$('#alipay').attr('checked', true);
			}
			else
			{
				$('#union').attr('checked', true);
			}
			
			$('input[type=radio][name=payType]').live('click', function(){
				
				var payType = $(this).val();
				var src = $(this).siblings('label').find('img').attr('src');
				
				//console.log(src)
				
				//更改hidden值
				oPayHidden.val(payType);
				
				$.unblock();
				
				//更改主页图标
				if(payType == 'union')
				{
					$('#PayMethodText').html('在线支付');
					$('#payMethodIcon').attr('src', src);
				}
				else
				{
					$('#PayMethodText').html('支付宝');
					$('#payMethodIcon').attr('src', src);
				}
				
			});
			
			$('.plugs-close').live('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			return false;
			
		});
		
		// 立即付款
		$('a[data-action=paynow]').bind('click', function(){
			
			var _this = $(this);
			
			if(_this.hasClass('button-notFund'))
			{
				return false;
			}
			
			if(_this.attr('data-action') == 'paynow')
			{
				var sClass = _this.attr('data-class');
				var sTarget = '';
				var sDataHref = '';
				var sDataClose = '';
				var sPayType = '';
				
				if(sClass == 'list')
				{
					sTarget = 'target="_blank"';
					sDataHref = 'data-href="orderDetail"';
					sDataClose = 'data-action="close"';
				}
				else if(sClass == 'detail')
				{
					sDataClose = 'data-action="close"';
					sDataHref = 'data-href="orderDetail"';
				}
				else
				{
					sDataHref = 'data-href="orderDetail"';
					sPayType = 'data-class="otherPayType"';
				}
				
				
				var content = '<div class="payRst clearfix">'
							 +'	<div class="payRst-item fl">'
							 +'		<div class="icon-success-36 sprites fl"></div>'
							 +'		'
							 +'		<dl class="payRst-outer fl">'
							 +'			<dt>已完成支付</dt>'
							 +'			<dd><a href="javascript:;" class="color-blue" '+ sDataHref +' '+ sTarget +' '+ sDataClose +'>查看订单详情</a></dd>'
							 +'		</dl>'
							 +'	</div>'
							 +'	'
							 +'	<div class="payRst-item fl">'
							 +'		<div class="icon-warning-36 ml36 sprites fl"></div>'
							 +'		'
							 +'		<dl class="payRst-outer fl">'
							 +'			<dt>支付遇到问题</dt>'
							 +'			<dd><a href="javascript:;" class="color-blue" '+ sPayType +' '+ sDataHref +' '+ sTarget +' '+ sDataClose +'>修改支付方式</a></dd>'
							 +'			<dd><a href="/help/pay" class="color-blue" target="_blank">查看支付帮助</a></dd>'
							 +'		</dl>'
							 +'	</div>'
							 +'</div>';
				
				$.block({
					title: '付款确认',
					content: content
				});
				
				$('[data-class=otherPayType]').bind('click', function(){
					
					$.unblock(function(){
						
						$('#otherPayMothed').trigger('click');
						
					});
					
					return false;
				});
				
				$('[data-action=close]').bind('click', function(){
					
					$.unblock();
					
					//return false;
				});
			
				changePayForm(_this, '[data-href=orderDetail]');
			}
			else if(_this.attr('data-action') == 'error')
			{
				var msg = _this.attr('data-msg');
				
				faildNotice(msg);
			}
			
		});
		
		// 通过接口调用支付表单
		function changePayForm(_this, detailBtn)
		{
			var datas = {};
				datas[TOKEN_KEY] = TOKEN_VAL;
				datas.orderId = _this.siblings('.orderId').val();
				datas.payType = _this.siblings('.payType').val();
			
			$.ajax({
				type: 'POST',
				url: '/Order/changePayForm',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{						
						$(detailBtn).attr('href', ajaxData.url);
						_this.attr('data-action', 'paynow').attr('data-msg', '');
						
						var oHiddenForm = $('<div id="hiddenForm"></div>');
						
						oHiddenForm.html(ajaxData.data);
						$('body').append(oHiddenForm);
					}
					else if(ajaxData.code == -1)
					{
						if(ajaxData.url)
						{
							_this.attr('href', ajaxData.url);
						}
						else
						{
							_this.attr('data-action', 'error').attr('data-msg', ajaxData.msg);
						}
					}
					else if(ajaxData.code == -1300)
					{
						_this.attr('data-action', 'login');
					}
				}
			});
			
			$('#payform').attr('target', '_blank').submit();
			
			removePayForm();
		}
		
		// 删除支付表单
		function removePayForm()
		{
			var oHiddenForm = $('#hiddenForm');
			oHiddenForm && oHiddenForm.remove();
		}
		
	})();
	
	// 付款倒计时
	(function(){
		
		var payButton = $('[data-action=paynow]');
		
		if(typeof ALL_TIME == 'undefined')
		{
			return false;
		}
		
		if(ALL_TIME <= 0)
		{
			payButton.addClass('button-notFund');
			return false;
		}
		
		commonFun.Methods.countdown(ALL_TIME, '#countdown', function(){
			
			payButton.addClass('button-notFund');
			
		});
		
	})();	
	
	// 确认收货
	(function(){
		
		$('a[data-action=confirm]').bind('click', function(){
			
			var confirmBtn = $(this);
			var oParent = confirmBtn.parent();
			var oid = confirmBtn.attr('data-oid');
			var createBtn = '<p class="mb6"><a href="javascript:;" class="button-light-80 anim-all" data-action="submit">确认</a></p>'
						   +'<p class="mb6"><a href="javascript:;" class="button-default-80 anim-all" data-action="cancel">取消</a></p>';
			
			oParent.before(createBtn).hide();
			
			// 发送确认收货请求
			$('a[data-action=submit]').bind('click', function(){
				
				$.ajax({
					type: 'GET',
					url: '/order/modOrderState?orderId='+ oid,
					success: function(ajaxData)
					{
						location.reload();
					},
					error: function()
					{
						alert('网络故障！');
					}
				});
				
				return false;
			});
			
			// 取消确认收货
			$('a[data-action=cancel]').bind('click', function(){
				
				var _parent = $(this).parent();
				
				_parent.prev().remove();
				_parent.remove();
				oParent.show();
				
				return false;
			});
			
			return false;
			
		});
		
	})();
		
	// 错误提示
	function faildNotice(data, _confirm)
	{
		var newData = {};
		var content = '';
		
		if(typeof data == 'string')
		{
			newData.msg = data;
		}
		else
		{
			newData = data;
		}
		
		if(_confirm)
		{
			content = '<div class="pt12 tc clearfix">'
					 +'    <p class="f16">'+ newData.msg +'</p>'
					 +'    <div class="pt24 clearfix">'
					 +'        <a href="javascript:;" class="button-light-100 anim-all" data-action="backCartList">确定</a>'
					 +'    </div>'
					 +'</div>';
		}
		else
		{
			content = '<p class="p12 f16">'+ newData.msg +'</p>';
		}
		
		$.block({
			title: ' ',
			hideCloseButton: true,
			content: content
		});
		
		if(_confirm)
		{
			$('[data-action=backCartList]').bind('click', function(){
			
				location.href = newData.url;
				
				return false;
				
			});
		}
		else
		{
			setTimeout(function(){
				
				$.unblock();
				
			}, 1500);
		}
	}
	
    module.exports = order;
});