define(function(require, exports, module){
	var common;
	
	var commonFun = require('{common}common.fun');
	var Plugs = require('{common}jquery.plugs')($);
	
	// 初始化顶部购物车数量
	commonFun.cart.getCartNum();
	
	/*------------------------------------------------------------------
	@Class: 导航菜单
	------------------------------------------------------------------*/
	(function() {
		
		var button = $('[data-class=all-pro]');
		var button_parents = button.parents('.prdSet-tit');
		var category_list = $('.prdSet-con');
        var timer = null;
		
        button.bind('mouseenter', function(){
			
            show();
			
        }).bind('mouseleave', function(){
			
            hide();
			
        });
		
        category_list.bind('mouseenter', function(){
			
            show();
			
        }).bind('mouseleave', function(){
			
            hide();
			
        });
		
		
		function show()
		{
			clearTimeout(timer);
            timer = setTimeout(function(){
				
            	button_parents.addClass('prdSet-cur');
                category_list.fadeIn(300);
				
            }, 200);
		}
		
		function hide()
		{
			clearTimeout(timer);
            timer = setTimeout(function() {
				
            	button_parents.removeClass('prdSet-cur');
                category_list.fadeOut(300);
				
            }, 200);
		}
		
    })();
	
	/*------------------------------------------------------------------
	@Class: 当用户点击底部投诉时，判断用户是否登录，未登录给出登录弹框
	------------------------------------------------------------------*/
	$('a[data-action=footer-complaint]').live('click', function(){
		
		var isLogin = commonFun.Actions.isLoginAction();
	
		//console.log(isLogin);
		
		if(!isLogin)
		{
			$('.header [data-action=login]').trigger('click');
			return false;
		}
		
	});
	
	/*------------------------------------------------------------------
	@Class: 私信弹出框, 发表新留言
	------------------------------------------------------------------*/
	$('[data-state=pm]').live('click', function(){
		
		var oThis = $(this);		
		var isLogin = commonFun.Actions.isLoginAction();
		
		if(!isLogin)
		{
			$('[data-action=login]').trigger('click');
			return false;
		}
		
		var content = '<dl class="message-form" id="privMsg">'
					 +'		<dt class="message-to">发留言给：<cite id="shopName"></cite></dt>'
					 +' 	<dd class="message-content">'
					 +' 		<textarea class="message-article" data-min="0" data-max="140" data-area="enterArea"></textarea>'
					 +' 	</dd>'
					 +' 	<dd class="message-count clearfix">'
					 +' 		<p class="color-red fl" data-class="notice"></p>'
					 +' 		<p class="fr"><var data-state="currentWord">140</var>/140</p>'
					 +' 	</dd>'
					 +' 	<dd class="message-button">'
					 +' 		<a href="javascript:;" class="button-light-80 button-light-disabled anim-all" data-action="submit">发送</a>'
					 +' 	</dd>'
					 +' </dl>';
		
		$.block({
			title: '留言',
			content: content,
		});
		
		// 监听留言输入框状态
		commonFun.Message.enterStatus('#privMsg', 'button-light-disabled');
		
		var oShop = $('#shopName');
		var to = oThis.attr('data-to');
		
		oShop.html(to);
		
		$('.message-button > [data-action=submit]').die().live('click', function(){				
			
			var _this = $(this);
			
			if(_this.hasClass('button-light-disabled'))
			{
				return false;
			}
			
			var datas = {};
				datas[TOKEN_KEY] = TOKEN_VAL;
				datas.to_id = oThis.attr('data-to_id');
				datas.shop_id = oThis.attr('data-shop_id');
				datas.content = $('#privMsg .message-article').val();
			
			commonFun.Message.sendMessage('#MsgReplyInfo', datas, $.unblock);
			
		});
		
		$('.plugs-close').die().live('click', function(){
			
			$.unblock();
			
			return false;
			
		});
		
		return false;
		
	});
	
	/*------------------------------------------------------------------
	@Class: 意见反馈
	------------------------------------------------------------------*/
	$('[data-action=feedback]').live('click', function(){
		
		var _this = $(this);
		var current_value = _this.attr('data-value');
			current_value = current_value ? current_value : 1;
			
		var title = '意见反馈';
		
		var content = '<div class="suggestion-outer clearfix">'					  
					  +'	<ul class="clearfix">'
					  +'		<li class="mt24 clearfix">'
					  +'			<label class="w75 lh36 fl">意见类型&nbsp;<span class="color-red">*</span></label>'
					  +'			<div class="plugs-select fl" id="selectSuggestion">'
					  +'				<div class="plugs-select-hd" data-state="databutton">'
					  +'					<h6 class="plugs-select-title" data-id="1" data-state="title" data-value="1">账号问题相关</h6>'
					  +'					<div class="plugs-select-tip">'
					  +'						<div class="plugs-select-tip"></div>'
					  +'					</div>'
					  +'				</div>'
					  +'				<ul class="plugs-select-bd" data-state="datalist">'
					  +'					<li class="plugs-select-option" data-state="option" data-id="1" data-value="1">账号问题相关</li>'
					  +'					<li class="plugs-select-option" data-state="option" data-id="2" data-value="2">购买操作问题相关</li>'
					  +'					<li class="plugs-select-option" data-state="option" data-id="3" data-value="3">支付问题相关</li>'
					  +'					<li class="plugs-select-option" data-state="option" data-id="4" data-value="4">物流售后问题相关</li>'
					  +'					<li class="plugs-select-option" data-state="option" data-id="6" data-value="6">商品推荐</li>'
					  +'					<li class="plugs-select-option" data-state="option" data-id="5" data-value="5">其它问题</li>'
					  +'				</ul>'
					  +'				<input type="hidden" name="feedType" class="plugs-select-value" value="'+ current_value +'" key="账号问题相关">'
					  +'			</div>'
					  +'		</li>'
					  +'		<li class="mt24 clearfix">'
					  +'			<label for="" class="w75 lh36 fl">意见内容&nbsp;<span class="color-red">*</span></label>'
					  +'			<dl class="suggestion-box fl">'
					  +'				<dt><textarea name="content" data-area="enterArea" data-min="1" data-max="500" class="message-article" placeholder="请输入意见或建议"></textarea></dt>'
					  +'				<dd class="color-888 tr clearfix"><p class="color-red fl" data-class="notice"></p><p class="fr"><var data-state="currentWord">500</var>/500</p></dd>'
					  +'				<dd class="color-333 clearfix">上传截图</dd>'
					  +'				<dd class="clearfix">'
					  +'					<form name="upLoadImageForm" action="" method="post" enctype="multipart/form-data" target="feedUpframe">'
					  +'					<ul class="certificate-list upimage-list clearfix" data-class="upLoadImageOuter">'
					  +'						<li class="certificate-item certificate-item-upload mr12 pr fl" data-class="upLoadImageButtonBox">'
					  +'							<div class="icon-add-button sprites"></div>'
					  +'							<input type="file" name="FILES" class="uploadCertificate pointer pa" data-action="upLoadImageButton" />'
					  +'							<input type="hidden" name="token" value="" />'
					  +'							<input type="hidden" name="getTokenType" value="2" />'
					  +'							<input type="hidden" name="callback" value="parent.upCallback" />'
					  +'						</li>'
					  +'						<li class="f12 pr fl"><span class="color-red pa" data-class="suggestUpLoadImageError"></span></li>'
					  +'					</ul>'
					  +'					</form>'
					  +'					<iframe id="feedUpframe" name="feedUpframe" src="" class="hide"></iframe>'
					  +'				</dd>'
					  +'				<dd class="color-888">支持JPG、GIF、PNG格式，1500宽高以下，小于5M，最多5张</dd>'
					  +'				<dd class="apply-button pt24">'
					  +'					<a href="javascript:;" class="button-light-100 button-light-disabled anim-all" id="suggestionSubmit" data-action="submit">提交</a>'
					  +'				</dd>'
					  +'			</dl>'
					  +'		</li>'
					  +'	</ul>'
					  +'</div>';
		
		$.block({
			title: title,
			content: content
		});
		
		// 监听意见反馈的输入状态
		commonFun.Message.enterStatus('.suggestion-box', 'button-light-disabled', '意见');
		
		$('#selectSuggestion').selects({
			selects: current_value
		});
		
		var UPLOAD_IMAGE_URI = commonFun.Methods.uploadImage('[data-class=suggestUpLoadImageError]');
		
		// 提交反馈
		$('#suggestionSubmit').die().live('click', function(){
			
			if($(this).hasClass('button-light-disabled'))
			{
				return false;
			}
			
			var datas = {};
				datas[TOKEN_KEY] = TOKEN_VAL;
				datas.feedType = $('input[name=feedType]').val();
				datas.content = $('textarea[name=content]').val();
				datas.feedImg = UPLOAD_IMAGE_URI;
			
			$.ajax({
				type: 'POST',
				url: '/FeedBack/addFeed',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					//console.log(ajaxData);
					
					switch(ajaxData.code)
					{
						case -10400:
						case -10401:
							$('#error-warning-suggestionDes').html(ajaxData.msg);
							break;
						case -10402:
							sendAfterNotice(300, ajaxData.msg);
							break;	
						default:
							sendAfterNotice(300, ajaxData.msg);
					}
				},
				error: function()
				{
					//console.log('error');
				}
			});
			
			return false;
			
		});
		
		// 关闭反馈
		$('.plugs-close').live('click', function(){
			
			$.unblock();
			
			return false;
			
		});
			
		// 发送 成功/失败 后的提示
		function sendAfterNotice(width, msg)
		{
			var sendTimer = null;
			
			$.unblock(function(){
				$.block({
					title: ' ',
					content: '<div class="pr12 clearfix">'
							+'	<div class="clearfix">'
							+'		<div class="icon-warning-36 sprites fl"></div>'
							+'		<div class="pl12 f18 lh36 fl">'+ msg +'！</div>'
							+'	</div>'
							+'	<div class="pt24 tc clearfix">'
							+'		<a href="javascript:;" class="button-light-100 anim-all" data-action="sendAfterNotice">确定</a>'
							+'	</div>'
							+'</div>'
				});
				
				sendTimer = setTimeout(function(){
					
					$.unblock();
					clearTimeout(sendTimer);
					
				}, 3000);
				
				$('[data-action=sendAfterNotice]').live('click', function(){
					
					clearTimeout(sendTimer);					
					$.unblock();
					
					return false;
					
				});
			});			
		}
		
		return false;
		
	});
	
	/*------------------------------------------------------------------
	@Class: 小控件，返回顶部等
	------------------------------------------------------------------*/
	$(function(){
	    $(window).on('scroll',function(e){
	    	var scroll = window.scrollY || document.documentElement.scrollTop;
	        floatSidebarPosition(scroll)
	    })

	    function floatSidebarPosition(scroll){
	        var right_position = $(window).height()+scroll-204;
	        var status = $(document).height() - $(window).height() - scroll-120;
	        var footerHeight = $('.footer').height();
	        if(status < footerHeight){
	            right_position = $(document).height() - 607;
	        }
	        $('.float_sidebar').css('top',right_position);
	        
	        if(scroll>700){
	            $('.top').attr({'id':'notTheTop','title':'返回顶部'})
	        }else{
	            $('.top').attr({'id':'','title':''})
	        }
	    }
	    var scroll = window.scrollY || document.documentElement.scrollTop;
	    floatSidebarPosition(scroll);

	    $('.top').live('click',function(e){
	        if($(this).attr('id')=='notTheTop')
			{	

	            $('html,body').animate({ scrollTop: 0}, { duration: 300, queue: false}); //正常
				
	            if (navigator.userAgent.indexOf('Firefox') >= 0) //火狐
				{
	                document.documentElement.scrollTop=0;
	            }

	            if(navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)){//手机
	            	window.scrollTo(0,0)
	            }
	        }
	    })

	    function openChat(width,height){
	    	var enterurl = escape(document.location.href),
	    		pagereferrer = escape(document.referrer),
	    		pagetitle = document.title;
	    	var urlpatch = '&enterurl='+enterurl+'&pagereferrer='+pagereferrer+'&pagetitle='+pagetitle;

	    	var w = Math.ceil((window.screen.width-width)/2),
	    		h = Math.ceil((window.screen.height-height)/2);
	    	window.open('http://chat10.live800.com/live800/chatClient/chatbox.jsp?companyID=393498&configID=202781&lan=zh&jid=2022100001'+urlpatch,'newwindow','top='+h+',left='+w+',toolbar=no,menubar=no,width=860,height=500')
	    }

	    $('.service').live('click',function(e){
	    	e.preventDefault ? e.preventDefault():e.returnValue=false;
	    	openChat(860,600);
	    })

	    //menu
	    $('.nav a').hover(function(){
	    	$(this).find('p').animate({'top':"-34",'opacity':1},{queue:false})
	    },function(){
	    	$(this).find('p').animate({'top':"-20","opacity":0},{queue:false})
	    })
	    
	});
	
    module.exports = common;
});