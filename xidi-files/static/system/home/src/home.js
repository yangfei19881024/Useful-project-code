define(function(require, exports, module){

	console.log("++++++++------+++++");

	console.log( require.resolve("$") );

	require("jquery");

	console.log($);
	/*var homepage;
	
	var commonFun = require('{common}common.fun');
	var Plugs = require('{common}jquery.plugs')($);
	var CATE = require('{common}category.fun');
	
	init();
	
	function init()
	{
		commonFun.cart.regMouseoverGoodsModuleEvent();
		commonFun.cart.regDetailAttrEvent();
		commonFun.cart.regAddCartEvent();
		CATE.Methods.initGoodsInfoMethod('[data-class=category][data-goodsInfo-id]');
	}
	
	$('.banner[data-class=picture]').carousel({	
		arrowsClass		: 'control-list-button',
		arrowsCurrent	: 'control-list-current',
		numbers			: true,
		duration 		: 500
	});
	
	(function(){
				   
		var oInfo = null;
		
		$('[data-class=country]').unbind();
		$('[data-class=country]').bind('mouseenter', function(){
			
			var _this = $(this);
			var viewW = $(window).width();
			var otherW = Math.ceil((viewW - 996) / 2);
				otherW = otherW > 0 ? otherW : 0;
			var w = _this.outerWidth();
			var h = _this.outerHeight();
			var l = 996 + otherW;
			var t = _this.offset().top;
				t = t + h + 5;
			var thisL = _this.offset().left;
			var id = _this.attr('data-id');
			var datas = {};
				datas.id= id;
			
			$.ajax({
				type: 'GET',
				url: '/index/special',
				data: datas,
				async: false,
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0 && ajaxData.data)
					{
						var items = ajaxData.data;
						var cnName = items.cnName;
						var desc = items.desc;
							desc = desc.length > 44 ? (desc.substring(0, 45) + '……') : desc;
						
						var sInfo = '<div class="countryInfo pa" style="display:none; left:'+ l +'px; top:'+ t +'px;">'
								   +'	<div class="tip-box pa">'
								   +'		<div class="tip-top pa"></div>'
								   +'		<div class="tip-bot pa"></div>'
								   +'	</div>'								   
								   +'	<dl class="plr24 ptb12">'
								   +'		<dt class="f14 ellipsis">'+ cnName +'</dt>'
								   +'		<dd>'+ desc +'</dd>'
								   +'	</dl>'
								   +'</div>';
						
						$('body').append(sInfo);
						oInfo = $('.countryInfo');
						
						var infoW = oInfo.outerWidth();
							l = l - infoW;
						var newL = l + otherW;
							newL = newL > l ? l : newL;
						var tipL = thisL - newL + Math.floor(w/2);
						
						$('.tip-box').css({ left: tipL});
						oInfo.css({ display: 'block', left: newL});
					}
					
				},
				error: function()
				{
					//console.log('error');
				}
			});		
			
		}).bind('mouseleave', function(){
			
			oInfo && oInfo.remove();
			
		});
		
	})();*/
	
	
    module.exports = homepage;
});