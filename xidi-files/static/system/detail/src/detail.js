define(function(require, exports, module){
	var detail;
	
	var commonFun = require('{common}common.fun');
	var CATE = require('{common}category.fun');
	var Plugs = require('{common}jquery.plugs')($);
	
	/*------------------------------------------------------------------
	@Class: 商品数量控制
	------------------------------------------------------------------*/
	(function(){
		
		var oMinus = $('.icon-minus');
		var oPlus = $('.icon-plus');
		var input = $('.addCartNum');
		var iMax = input.attr('data-max');
		//var iNum = input.val();
		
		initGoodsInfo();
		
		oMinus.on('click', function(){
			
			var mthis = $(this);
			var iNum = input.val();
			
			if(mthis.hasClass('minus-disabled'))
			{
				return false;
			}
			
			iNum --;
			
			input.val(iNum);
			
			commonFun.Methods.formatGoodsNum(input, XD.data.addCartButton, true);
			
			return false;
			
		});
		
		oPlus.on('click', function(){
			
			var pthis = $(this);
			var iNum = input.val();
			
			commonFun.Methods.isGoodsNumInMax(input, true);
			
			if(pthis.hasClass('plus-disabled'))
			{
				return false;
			}
			
			iNum ++;
			
			input.val(iNum);
			
			commonFun.Methods.formatGoodsNum(input, XD.data.addCartButton);
			
			return false;
			
		});
		
		input.on('focus', function(){
			
			var _this = $(this);
			
			_this.on('keydown', function(ev){
				
				var key = ev.keyCode;
				
				if(!commonFun.Methods.detect(key))
				{
					return false;
				}
				
			}).on('keyup', function(){
				
				commonFun.Methods.isGoodsNumInMax(input, true);
				
			});
			
		}).on('blur', function(){
			
			commonFun.Methods.formatGoodsNum(input, XD.data.addCartButton);
			
		});
		
		function initGoodsInfo()
		{
			var addCartButton = $(XD.data.addCartButton);
			var addCartButton_icon = $(XD.data.addCartButton).children('span');
			var addCartButton_text = $(XD.data.addCartButton).children('em');
			
			commonFun.Methods.formatGoodsNum(input, XD.data.addCartButton, true);
			
			if(iMax <= 0)
			{
				input.attr('disabled', true).val(0);
				addCartButton_icon.addClass();
				addCartButton_text.text('商品已售完');
			}
			
			if(iMax <= 1)
			{
				input.attr('disabled', true);
				oMinus.addClass('minus-disabled');
				oPlus.addClass('plus-disabled');
			}
		}
		
	})();
	
	// 商品选择
	(function(){
		
		if(typeof show_token == 'undefined')
		{
			commonFun.cart.regDetailAttrEvent('detail');
		}
		else
		{
			commonFun.cart.regDetailAttrEvent('preview');
		}
		commonFun.cart.regAddCartEvent();	
		
		commonFun.Methods.getDetailGoodsInfo('.proOper-box');
		commonFun.Favorite.regProductCollectEvent('.proOper-box > [data-class=favorite]', '.proOper');
		CATE.Methods.initGoodsInfoMethod('[data-class=category][data-goodsInfo-id], [data-class=goodsEditTime][data-goodsInfo-id]');
		
	})();	
	
	$('[data-rel=lightbox]').lightbox({
		title : '&nbsp;'
	});
	
	$('.relPrd-box').marquee({
		scrollBox: '.pro-list',
		button: { prev: '.control-pre', next: '.control-next'},
		page: '[data-class=arrows]',
		pageClassName: 'control-list-button',
		current: 'control-list-current',
		interval: 5000,
		callback: null
	});
	
	// 获取商品评价信息
	(function(){
		
		var pid = window.location.href.split('?')[1].split('=')[1];
		var proAssess = $('.pro-assess');
		
		if(!proAssess[0])
		{
			return false;
		}
		
		function getList(pid,curPage){
			$.post('/detail/detailComment',{pid:pid,page:curPage},function(data){
				if(data.code == 0){
					var str = '<div class="store-assess-in">';
					str += '<h2>用户评价<span>('+data.data.total_items+')</span></h2>';
					if(data.data && data.data.items && data.data.items.length>0){
						var items = data.data.items;
						$.each(items,function(k,v){
							str += '<div class="store-assess-detail clearfix">';
							str += '<div class="sADetailLeft fl">';
							str += '<p>'+v.content+'</p>';
							str += '<p class="grayc">'+v.addTime+' &nbsp;&nbsp;|&nbsp;&nbsp; ';
							$.each(v.priceAttr,function(i,n){
								str += ' '+n.curChildren+' ';
							})
							str += '</p>';
							if(v.replyContent.length>0){
								str += '<p class="assess-reply"><span>卖家回复：</span>'+v.replyContent+'</p>';
								str += '<p class="grayc">'+v.replyTime+'</p>';
							}
							str += '</div>';
							str += '<div class="sADetailRight fr">';
							str += '<p class="stars">'+showStar(v.starsLevel)+'</p>';
							str += '<p class="grayc">'+v.userName+'</p>';
							str += '</div></div>';
							
						})
					}else{
						str += '<div class="store-assess-detail clearfix"><div class="sADetailLeft fl"><p class="grayc">这个商品还没有评论,赶快来抢沙发~</p></div></div>';
					}
					str += '<ul class="pagination"></ul>';
					str+= '</div>';
					$(".pro-assess").html(str);
					pagination(curPage,data.data.total_pages);
	
				}else{alert(data.msg)}
			},'json');
		}
		getList(pid,1);
	
	function showStar(level){
			if(level && level>0){
				var len = parseInt(level);
				l=''
				for(s = 0;s<len;s++){
					l += '<span style="color:#50b1a2">★</span>';
				}
				
				l2=''
				for(s = 0;s<5-len;s++){
					l2 += '<span style="color:#c1c1c1">★</span>';
				}
				
			}
			var str = l+l2;
			return str;
		}
	
	
		function pagination(cur,total){
			  var str = '';
			  str += '<li class="firstPage"><a href="#" data-to="'+(cur-1)+'"><</a></li>';
			  if(total<6){
					for(i=1;i<=total;i++){
						str += '<li class="num" ><a href="#" data-to="'+i+'">'+i+'</a></li>';
					}  
					
			  }else{
				if(cur <= 3){
				  str += '<li  class="num"><a href="#" data-to="1">1</a></li>';
				  str += '<li class="num" ><a href="#" data-to="2">2</a></li>';
				  str += '<li class="num" ><a href="#" data-to="3">3</a></li>';
				  str += '<li class="num" ><a href="#" data-to="4">4</a></li>';
				  str += '<li ><a href="#" class="page-elps" >...</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+total+'">'+total+'</a></li>';
				}else if(total-cur <= 3 ){
				  str += '<li class="num" ><a href="#" data-to="1">1</a></li>';
				  str += '<li ><a href="#" class="page-elps" >...</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(total-4)+'">'+(total-4)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(total-3)+'">'+(total-3)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(total-2)+'">'+(total-2)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(total-1)+'">'+(total-1)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+total+'">'+total+'</a></li>';
				}else{
				  str += '<li class="num" ><a href="#" data-to="1">1</a></li>';
				  str += '<li ><a href="#" class="page-elps" >...</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(cur-3)+'">'+(cur-3)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(cur-2)+'">'+(cur-2)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(cur-1)+'">'+(cur-1)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+cur+'">'+cur+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(cur+1)+'">'+(cur+1)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(cur+2)+'">'+(cur+2)+'</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+(cur+3)+'">'+(cur+3)+'</a></li>';
				  str += '<li ><a href="#" class="page-elps" >...</a></li>';
				  str += '<li class="num" ><a href="#" data-to="'+total+'">'+total+'</a></li>';
				}
			  }
			  str += '<li class="lastPage"><a href="#" data-to="'+(cur+1)+'">></a></li>';
			 
	
			  if(total<=1){
						str = '';
					}
	
			  $(".pagination").html(str).find("a").each(function(){
					  if($(this).data("to")==cur && $(this).parent().hasClass("num")){
						$(this).parent().addClass("page-current").siblings().removeClass("page-current");
						if(cur == 1){
							$(".firstPage").addClass("disabled");
						}else{
							$(".firstPage").removeClass("disabled");
						}
						if(cur == total){$(".lastPage").addClass("disabled")}else{$(".lastPage").removeClass("disabled")}
					  }
			  });
			 
		}
	
		function gotoFunc(func){
			$(".pagination").find("[data-to]").live("click",function(e){
				e.preventDefault();
				if(!$(this).parent().hasClass("current") && !$(this).parent().hasClass("disabled")){
				  var page = parseInt($(this).data("to"));
				  func(pid,page);
				}else{
	
				}
			});
		}
		gotoFunc(getList);
		
	})();
	
    module.exports = detail;
});