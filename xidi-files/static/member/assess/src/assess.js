define(function(require, exports, module){
	var assess;
	
	var commonFun = require('{common}common.fun');
	require('{common}jquery.plugs')($);

	$('#assessFilter-select').selects({
		selects		: 1
	});

	$("textarea").on("focus",function(){
		if($(this).val()=='这个商品还不错哦~'){$(this).val('');$(this).css('color',"#333");}
		var submit_button = $(".assess-submit");
		var count = $(this).parentsUntil(".assess-edit-textarea").find(".message-count");
		//submit_button.removeClass("assess-submit");
		$(this).on('keyup',function(e){
			count.html(140-$(this).val().length)
			submit_button.removeClass("button-light-disabled");
			if($(this).val().length>140){
				submit_button.addClass("button-light-disabled");
				count.css("color","#ff6162")
			}else{
				count.css("color","#333")
			}
		})
	});
	
	$('textarea').on('blur',function(){
		if($(this).val()==''){
			$(this).val('这个商品还不错哦~');
			$(this).css('color',"#c3c3c3");
		}
	})
	
	$('.message-article').each(function(){
		if($(this).val()=='这个商品还不错哦~'){
			$(this).css('color',"#c3c3c3");
		}
	})
	if($('.assess-edit-inner').length>1){
		
	}else{
		$('.message-form').append($('.assess-submit'))
	}

	var positive = "url("+JS_DOMAIN+"static/global/images/1.0.0/star_positive.png) left no-repeat",
		negative = "url("+JS_DOMAIN+"static/global/images/1.0.0/star_negative.png) left no-repeat";
		function star_comment(index){
			switch(index){
				case 0 : return "强烈不推荐";
				case 1 : return "不太推荐";
				case 2 : return "推荐";
				case 3 : return "非常推荐";
				case 4 : return "强烈推荐"; 
			}
		}
	$(".stars span").hover(function(){
		var index = $(this).index();
		$(this).parent().next().removeClass("star-error").html(star_comment(index)).removeClass("grayd")
		$(this).prevAll().andSelf().each(function(){
			$(this).css("background",positive);
		});
		$(this).nextAll().filter("span").each(function(){
			$(this).css("background",negative);
		})
		
	},function(){
		var count = $(this).siblings().filter(".star_input").attr("value");
		if(count == ""){
			$(this).parent().next().html("请点击星星进行评价").addClass("grayd");
			$(this).siblings().andSelf().each(function(){
				$(this).css("background",negative);
			});
		}else{
			$(this).parent().next().html(star_comment(parseInt(count) - 1));
			$(this).siblings().eq(parseInt(count)-1).prevAll().each(function(){
				$(this).css("background",positive);
			})
			$(this).siblings().eq(parseInt(count)-1).nextAll().each(function(){
				$(this).css("background",negative);
			})
		}
	})

	$(".stars span").click(function(){
		var index = $(this).index();
		$(this).prevAll().andSelf().each(function(){
			$(this).css("background",positive);
		});
		$(this).siblings().filter(".star_input").attr("value",index+1)
	})

	$(".assess-submit").click(function(e){
		e.preventDefault?e.preventDefault():e.returnValue=false;
		var error;
		$(".star_input").each(function(){
			var val = $(this).attr("value");
			if(val == ""){
				$(this).parent().next().addClass("star-error");
				error =true;
			}
		})
		if(!error && !$(this).hasClass('button-light-disabled')){
			$('.assess-submit').text('发布中').addClass('button-light-disabled');
			 $.ajax({
                type:"POST",
                url:"/Comment/addGoodsComment",
                dataType: "json",
                data:$('.assess-edit-outer form').serialize(),           
                success:function(data){
                    if(data.code == 0){
                    	window.location.href= DOMAIN+'Comment/showMyCommon';
                    }else if(data.code = -10303){
                    	alert(data.msg);
                    }
                },
                error:function(){
                  alert('网络连接异常');
                }
            });
		}
	})

	function showStar(level){
		var l='',l2='';
		if(level && level>0){
			var len = parseInt(level);
			for(s = 0;s<len;s++){
				l += '<span style="color:#50b1a2">★</span>';
			}
			
			for(s = 0;s<5-len;s++){
				l2 += '<span style="color:#c1c1c1">★</span>';
			}
			
		}
		var str = l+l2;
		return str;
	}

$('.pageTur .page-next').live('click', function(e){
	e.preventDefault?e.preventDefault():e.returnValue=false;
	var curPage = $('.page-current').text();
	
	if(!$(this).hasClass('page-disabled')){
		getList(parseInt(curPage)+1);
	}
});
$('.pageTur .page-prev').live('click', function(e){
	e.preventDefault?e.preventDefault():e.returnValue=false;
	var curPage = $('.page-current').text();
	if(!$(this).hasClass('page-disabled')){
		getList(parseInt(curPage)-1);
	}
});


function getList(curPage){
 	var orderTime = $('.plugs-select-value').val();
        $("#assessList").ajaxPage({
        	data:{page:curPage,orderTime:orderTime},
            pageSize: 20,
            url: "/Comment/getMyCommentList",
            run: true,
            pageId: "#assessListPagi",
            type:'GET',
            noData: "暂无数据...",
            listBox: "#assessList",
            callback: function(data) {
            	if(data.code==0){
					var str = '';
					if(data.data.orderList){
						$.each(data.data.orderList,function(k,v){
					        str +='<div class="assess-list assess-single">';
				            str +='<ul class="assess-list-head table clearfix">';
			                str +='<li class="inline-block assess-id ">订单号：'+v.orderInfo.orderParentId+'</li>';
			                str +='<li class="inline-block gray8 assess-time">'+v.orderInfo.addTime+'</li>';
			                str +='<li class="inline-block clearfix"><a href="'+DOMAIN+'brand/list?sid='+v.orderInfo.shopId+'" target="_blank" title="'+v.orderInfo.shopName+'" class="fl">'+v.orderInfo.shopName+'</a><a href="" class="shopMail sprites fl"  data-name="PrivateMessage" data-state="pm" data-to="'+v.orderInfo.shopName+'" data-to_id="'+v.orderInfo.agentId+'" data-shop_id="'+v.orderInfo.shopId+'"></a></li>';
				            str +='</ul>';
				            if(v.goodsList && v.goodsList.length>0){
				            	str +='<table class="assess-list-table">';
				            	$.each(v.goodsList,function(i,n){
					                str +='<tr>';
				                    str +='<td class="assess-list-td-first">';
			                        str +='<a href="'+DOMAIN+'goodsnap/index?gid='+n.goodsId+'&v='+n.version+'" target="_blank"><img src="'+IMAGE_DOMAIN+n.goodsImage+'" alt="'+n.goodsNameForTitle+'" class="assess-product" /></a>';
			                        str +='<div class="smalltext">';
			                        str +='<p><a href="'+DOMAIN+'goodsnap/index?gid='+n.goodsId+'&v='+n.version+'" target="_blank" title="'+n.goodsNameForTitle+'" class="hovergreen">'+n.goodsName+'</a></p>';
			                        var price = $.parseJSON(n.priceAttr);
			                        $.each(price,function(a,b){
			                        	str += '<p class="gray8">'+b.curChildren+'</p>';
			                        })
			                        str +='</div>';
				                    str +='</td>';
				                    str +='<td class="assess-list-content">';
				                    if( (n.commentState == '3' || n.commentState=='4') && n.commentContent){
				                    	str +='<p class="assess-content">'+n.commentContent+'</p>';
				                        str +='<p class="grayc">'+n.commentTime+'</p>';
				                        if(n.replyContent && n.replyContent.length>0){
				                        	str+= '<p class="assess-reply"><span>商家回复：</span>'+n.replyContent+'</p>';
			                        		str+= '<p class="grayc">'+n.replyTime+'</p>';
				                        }
				                    }

				                    str +='</td>';
				                    str +='<td class="assess-list-star">';
			                        str +='<p class="stars star4">';
			                        if(n.commentState == '3'||n.commentState=='4'){
			                        	str += showStar(n.starsLevel);
			                        }
			                        str +='</p>';
				                    str +='</td>';
				                    str +='<td class="assess-list-comment">';
				                    if(n.commentState=='2'){
				                    	str += '<a href="/Comment/showAddCommon?goodId='+n.goodsId+'&suborderId='+v.orderInfo.orderId+'" class="button-default-80 anim-all" target="_blank">评价</a>';
				                    }else{
				                    	str +='<p class="gray8">'+n.commentStateName+'</p>';
				                    }
			                        
				                    str +='</td>';
					                str +='</tr>';
					            })
								str +='</table>';
				            }
				        	str +='</div>';
						});
						if(curPage == 1){
							$('.pageTur .page-prev').addClass('page-disabled');
						}else{
							$('.pageTur .page-prev').removeClass('page-disabled');
						}

						if(curPage == data.data.total_pages){
							$('.pageTur .page-next').addClass('page-disabled');
						}else{
							$('.pageTur .page-next').removeClass('page-disabled');
						}
						
						if(data.data.total_pages>1){
							$('.pageTur').removeClass('hide');
						}
						
					}else{ str = '<div class="tc clearfix" style="padding-top:135px;"><p class="f14 color-333">暂无任何评价记录！</p></div>'; }
				}else{
					alert(data.msg);
				}

                return str;
            }
        });
    }



	if($('#assessList').length>0){
		getList(1);
	}

	$('.plugs-select-option').on('click',function(e){
		e.preventDefault?e.preventDefault():e.returnValue=false;
		getList(1);
		//console.log($('.plugs-select-value').val())
	});

 //    $("[data-state=pm]").live('click',function(e){
 //    	e.preventDefault?e.preventDefault():e.returnValue=false;
 //    	var ths = $(this);
 //    	$.block({
	//         title: "留言",
	//         content: '<dl class="message-form" id="privMsg"><dt class="message-to">发留言给：<cite id="shopName"></cite></dt><dd class="message-content"><textarea class="message-article" data-min="0" data-max="140" data-area="enterArea"></textarea></dd><dd class="message-count tr" data-state="currentWord">140</dd><dd class="message-button"><a href="javascript:;" class="button-light-80 button-light-disabled anim-all" data-action="submit">发送</a></dd></dl>',
	//         callback: function(remove) {
	//             // 监听留言输入框状态
	//             commonFun.Message.enterStatus(".message-form", "button-light-disabled");
	//             var oShop = $("#shopName");
	//             var to = ths.data("to");

	//             oShop.html(to);

	//             $(".message-button > [data-action=submit]").die().live("click", function() {
	//                 var datas = {};
	// 	                datas.to_id = ths.attr("data-to_id");
	// 	                datas.shop_id = ths.attr("data-shop_id");
	// 	                datas.content = $(".message-article").val();
	// 	                commonFun.Message.sendMessage("#MsgReplyInfo", datas, $.unblock );
	//             });
	//         }
	//     });

 //    })
	// $('[data-action=close]').live('click',function(e){
	// 	$.unblock();
	// })
	
    module.exports = assess;

});