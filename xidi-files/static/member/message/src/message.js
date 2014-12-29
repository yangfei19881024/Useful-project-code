define(function(require, exports, module) {
	var message;
	
	$(function(){
	
		var commonFun = require('{common}common.fun');
		var Plugs = require('{common}jquery.plugs')($);
		
		 //自定义下拉框
		$('#serviceNotice-select').selects({
			selects		: 0,
			callback	: function(res)
			{ // 筛选服务通知
				var filter_type = res.data_id;
				
				getServiceNoticeData(filter_type);
			}
		});
		
		// 消息中心选项卡切换
		$('#messageList').tab({
			section : '.msg-tabContent',
			control : '.msg-tabHd',
			currentClass: 'msg-tabCur',
			now: 2,
			callback: function(now){
				$('#page').children().eq(now).show().siblings().hide();
				
				if(now == 0) // 获取服务通知的数据
				{
					getServiceNoticeData(0);
				}
				else if(now == 1) // 获取公告的数据
				{
					getAnnounceData();
				}
				else // 获取留言的数据
				{
					getMessageData();
				}
			}
		});
		
		// 消息设置
		$('.setting-field-merger[data-section=section]').checkButton({
			checkClass : 'checkbox',
			unCheckClass : 'uncheckbox',
			callback: function(oThis){
				
				var oInput = oThis.find('input');
				var datas = {};
					datas.keys = oInput.attr('keys');
				
				$.ajax({
					type: 'POST',
					url: '/Settings/modify',
					data: datas,
					success: function(ajaxData)
					{
						var ajaxData = $.parseJSON(ajaxData);
						
						if(ajaxData.code == 0)
						{
							//console.log(ajaxData)
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
		});
		
		// 留言回复
		(function(){
			
			getMessageReplyInfo();
			
			// 监听留言输入框状态
			commonFun.Message.enterStatus('.message-form', 'button-light-disabled');
			
			// 留言回复
			$('#sendMsg[data-action=submit]').die().live('click', function(){
				
				if($(this).hasClass('button-light-disabled')) return false;
				
				var oShop = $('#shopName');
				var datas = {};
					datas[TOKEN_KEY] = TOKEN_VAL;
					datas.to_id = oShop.attr('data-to_id');
					datas.content = $('.message-article').val();
					datas.shop_id = oShop.attr('data-shop_id');
					datas.conversation = CONVERSATION;
					//datas.avator = oShop.find('.avator-pic').attr('src');
					
				commonFun.Message.sendMessage('#MsgReplyInfo', datas, function(callback){
					
					$('.message-article').val('');
					$('[data-state=currentWord]').html($('.message-article').attr('data-max'));
					$('.button-light-100').addClass('button-light-disabled');
					callback && callback();
					
				});
				
			});
			
		})();
		
		// 用户查看留言时，隐藏当前留言的未读数
		$('[data-class=read-message]').live('click', function(){
			
			var _this = $(this);
			var _parents = _this.parents('.msg-item');
			var unRead = $('[data-class=unReadCount]', _parents);
			
			if(!unRead[0])
			{
				return;
			}
			
			unRead.remove();
			
		});
		
		// 删除留言
		$('.icon-delete').live('click', function(){
			
			var _this = $(this);
			var oParents = _this.parents('.msg-item');
			
			var msgDialog = $('<div class="msg-dialog pa" style="width:112px; right:26px; top:12px;"></div>');
			var submits = $('<a href="javascript:;" class="button-light-50 fl anim-all" data-action="submit">确认</a>');
			var cancel = $('<a href="javascript:;" class="button-default-50 ml12 fl anim-all" data-action="cancel">取消</a>');
			
			msgDialog.append(submits);
			msgDialog.append(cancel);		
			oParents.append(msgDialog);
			
			// 确认删除
			submits.bind('click', function(){
				
				removeMsg(_this, '.msg-item');
				
				return false;
			});
			
			// 取消删除
			cancel.bind('click', function(){
				
				msgDialog.remove();
				
				return false;
			});
			
			return false;
			
		});
		
		// 获取服务通知的数据
		function getServiceNoticeData(filter_type)
		{
			$('#serviceNoticeList').ajaxPage({
				data			: {
					type		: filter_type,
					page		: 1
				},
				pageSize		: 10,
				url				: '/Servicenotice/list',
				run				: true,
				pageId			: '#serviceNoticePage',
				listBox			: '#serviceNoticeList',
				noDataCallback	: function()
				{
					noListData('#serviceNoticeList', '暂无任何服务通知！');
				},
				callback		: function(ajaxData)
				{
					var sHtml = '';
					
					//console.log(ajaxData);
					
					if(ajaxData.code == 0 && ajaxData.data.items.length > 0)
					{	
						var aList = ajaxData.data.items;
						var iLen = aList.length;
						
						for(var i = 0; i < iLen; i ++)
						{
							var code = $.parseJSON(aList[i].code);
							var sDes = '';
							var title = aList[i].title;
							var CODE_URL = code.url;
								CODE_URL = $.trim(CODE_URL);
							var IMAGE_URL = code.img;
								IMAGE_URL = $.trim(IMAGE_URL);
							var bMatch = match_url(IMAGE_URL);
							
							if(!bMatch && IMAGE_URL != '')
							{
								IMAGE_URL = IMAGE_DOMAIN + IMAGE_URL;
							}
							
							if(IMAGE_URL == '')
							{
								IMAGE_URL = 'http://image.xidibuy.com/ht';
							}
							
							if(aList[i].type == 1)
							{
								var urlRes = '';
								
								if(CODE_URL != '' && title == '付款提醒')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">立即付款</a></p>';
								}
								else if(CODE_URL != '')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">去看看</a></p>';
								}
								
								sDes = '<dd class="msg-des pt12 clearfix">'
									  +'	<p>订单号：'+ code.orderId +'</p>'
									  +'	<p>'+ code.content +'</p>'
									  +		urlRes
									  +'</dd>';
							}
							else if(aList[i].type == 2)
							{
								var urlRes = '';
								
								if(CODE_URL != '')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">查看详情</a></p>';
								}
								
								sDes = '<dd class="msg-des pt12 clearfix">'
									  +'	<p>退货退款编号：'+ code.refundId +'</p>'
									  +'	<p>'+ code.content +'</p>'
									  +		urlRes
									  +'</dd>';
							}
							else if(aList[i].type == 3)
							{
								var urlRes = '<p>如有疑问，请 <a href="/about/contact" class="color-blue" target="_blank">联系客服</a></p>';
								
								if(CODE_URL != '')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">查看详情</a></p>';
								}
								
								sDes = '<dd class="msg-des pt12 clearfix">'
									  +'	<p>编号：'+ code.id +'</p>'
									  +'	<p>'+ code.content +'</p>'
									  +		urlRes
									  +'</dd>';
							}
							else if(aList[i].type == 4)
							{
								var urlRes = '<p>如不是本人操作，请 <a href="/about/contact" class="color-blue" target="_blank">联系客服</a></p>';	
													
								if(CODE_URL != '')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">查看详情</a></p>';
								}
								
								sDes = '<dd class="msg-des pt12 clearfix">'
									  +'	<p>'+ code.content +'</p>'
									  +'	<!--'+ urlRes +'-->'
									  +'</dd>';
							}
							else if(aList[i].type == 5)
							{
								var urlRes = '';
														
								if(CODE_URL != '')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">查看详情</a></p>';
								}
								
								sDes = '<dd class="msg-des pt12 clearfix">'
									  +'	<p>商品编号：'+ code.goodsId +'</p>'
									  +'	<p>'+ code.content +'</p>'
									  +		urlRes
									  +'</dd>';
							}
							else if(aList[i].type == 6)
							{
								var urlRes = '';	
													
								if(CODE_URL != '')
								{
									urlRes = '<p><a href="'+ CODE_URL +'" class="color-blue" target="_blank">查看详情</a></p>';
								}
								
								sDes = '<dd class="msg-des pt12 clearfix">'
									  +'	<p>产品编号：'+ code.productId +'</p>'
									  +'	<p>'+ code.content +'</p>'
									  +		urlRes
									  +'</dd>';
							}
							
							sHtml += '<li class="msg-item ptb12 anim-all pr clearfix" data-id="'+ aList[i].id +'">'
									+'	<div class="ml12 pr fl">'
									+'		<img src="'+ IMAGE_URL +'" width="132" height="132" class="block">'
									+'	</div>'							        	
									+'	<dl class="msg-notice mt12 ml24 fl">'
									+'		<dt class="msg-tit clearfix">'+ title +'</dt>'	
									+		sDes
									+'	</dl>'							        	
									+'	<p class="msg-time mt12 fr">'+ aList[i].ctime +'</p>'							        	 
									+'	<div class="operating pa">'
									+'		<a href="javascript:;" class="icon-delete sprites" data-remove="servicenotice">删除</a>'
									+'	</div>'
									+'</li>'
						}
					}
					else
					{
						sHtml = noListData('#serviceNoticeList', '暂无任何服务通知！');
					}
					
					return sHtml;
				}
			});
		}
		
		// 获取公告的数据
		function getAnnounceData()
		{
			$('#announcementList').ajaxPage({
				type			: 'POST',
				data			: {
					page		: 1
				},
				pageSize		: 15,
				url				: '/Announce/list',
				run				: true,
				pageId			: '#announcementPage',
				listBox			: '#announcementList',
				noDataCallback	: function()
				{
					noListData('#announcementList', '暂无任何公告！');
				},
				callback		: function(ajaxData)
				{
					var sHtml = '';
					
					//console.log(ajaxData);
					
					if(ajaxData.code == 0 && ajaxData.data.items.length > 0)
					{	
						var aList = ajaxData.data.items;
						var iLen = aList.length;
						var sHref = '';
										
						for(var i=0; i<iLen; i++)
						{
							var sLink = aList[i]['link'];
								sLink = $.trim(sLink);
							var IMAGE_URL = aList[i].image;
							var bMatch = match_url(IMAGE_URL);
							
							if(!bMatch && $.trim(IMAGE_URL) != '')
							{
								IMAGE_URL = IMAGE_DOMAIN + IMAGE_URL;
							}
							
							if($.trim(IMAGE_URL) == '')
							{
								IMAGE_URL = 'http://image.xidibuy.com/ht';
							}
							
							if(sLink != '')
							{
								sHref = '<p class="msg-des pt12 clearfix"><a href="'+ sLink +'" class="color-blue" target="_blank">去看看</a></p>';
							}
							
							sHtml += '<li class="msg-item ptb12 anim-all pr clearfix" data-id='+ aList[i].id +'>'
									+'	 <div class="ml12 pr fl">'
									+'		 <img src="'+ IMAGE_URL +'" width="132" height="132" class="block">'
									+'	 </div>'
									+'	 <div class="msg-notice table pl24 fl">'
									+'		 <div class="table-cell">'
									+'			 <p class="msg-tit clearfix">'+ aList[i].title +'</p>'
									+'			 <p class="msg-des pt12 clearfix">'+ aList[i].content +'</p>'
									+			 sHref
									+'		 </div>'
									+'	 </div>'
									+'	 <p class="msg-time mt12 fr">'+ aList[i].publishTime +'</p>'
									+'	 '
									+'	 <div class="operating pa">'
									+'		 <a href="javascript:;" class="icon-delete sprites" data-remove="announce">删除</a>'
									+'	 </div>'
									+'</li>'
						}
					}
					else
					{
						sHtml = noListData('#announcementList', '暂无任何公告！');
					}
					
					return sHtml;
				}
			});
		}
		
		// 获取留言的数据
		function getMessageData()
		{
			$('#MsgListInfo').ajaxPage({
				type			: 'POST',
				data			: {
					page		: 1
				},
				pageSize		: 10,
				url				: '/Message/list',
				run				: true,
				pageId			: '#messageListPage',
				listBox			: '#MsgListInfo',
				noDataCallback	: function()
				{
					noListData('#MsgListInfo', '暂无任何留言！');
				},
				callback		: function(ajaxData)
				{
					var sHtml = '';
					
					//console.log(ajaxData);
					
					if(ajaxData.code == 0 && ajaxData.data.items.length > 0)
					{	
						var aList = ajaxData.data.items;	
						var iLen = aList.length;
						var sDtInner = '';
						var unReadStr = '';
						
						for(var i=0; i<iLen; i++)
						{
							if(aList[i].from_shop)
							{
								sDtInner = '<a href="/brand/list?sid='+ aList[i].shopId +'" class="color-blue" target="_blank">'+ aList[i].from +'</a>对 '+ aList[i].to +' 说';
							}
							else
							{
								sDtInner = aList[i].from +'对 <a href="/brand/list?sid='+ aList[i].shopId +'" class="color-blue" target="_blank">'+ aList[i].to +'</a> 说';
							}
							
							if(aList[i].unread_num > 0)
							{
								unReadStr = '<var class="msg-count tc pa circle" data-class="unReadCount">'+ aList[i].unread_num +'</var>';
							}
							else
							{
								unReadStr = '';
							}
							
							sHtml += '<li class="msg-item ptb24 pr anim-all clearfix" data-conversation="'+ aList[i].conversation +'">'
								   +'	<div class="mt12 mr36 ml12 pr fl">'
								   +'		<img src="'+ aList[i].from_avatar +'" width="60" height="60" class="block circle" />'
								   +		unReadStr
								   +'	</div>'							
								   +'	<dl class="msg-inner fl">'
								   +'		<dt class="msg-tit color-888 clearfix">'
								   +			sDtInner
								   +'		</dt>'								
								   +'		<dd class="msg-des pt12 clearfix">'
								   +'			<a href="'+ DOMAIN +'message/newmessage?conversation='+ aList[i].conversation +'" class="no-unl" data-class="read-message" target="_blank">'+ aList[i].content +'</a>'
								   +'		</dd>'
								   +'	</dl>'
								   +'   <p class="msg-time fr">'+ aList[i].create_time +'</p>'
								   +'   <div class="operating pa">'
								   +'   	<a href="javascript:;" class="icon-delete sprites" data-remove="message">删除</a>'
								   +'   </div>'
								   +'</li>';
						}
					}
					else
					{
						sHtml = noListData('#MsgListInfo', '暂无任何留言！');
					}
					
					return sHtml;
				}
			});
		}
		
		// 获取留言回复信息
		function getMessageReplyInfo()
		{
			$('#MsgReplyInfo').ajaxPage({
				type			: 'GET',
				data			: {
					type		: 1,
					page		: 1
				},
				pageSize		: 10,
				url				: '/Message/view?conversation='+ CONVERSATION,
				run				: true,
				pageId			: '#messageReplyPage',
				listBox			: '#MsgReplyInfo',
				callback		: function(ajaxData)
				{
					var sHtml = '';
					
					//console.log(ajaxData);
					
					if(ajaxData.code == 0 && ajaxData.data.items.length > 0)
					{	
						var aList = ajaxData.data.items;
						var iLen = aList.length;					
						for(var i=0; i<iLen; i++)
						{
							var messageUserName = '';
							
							if(aList[i].from_shop)
							{
								messageUserName = '<a href="/brand/list?sid='+ aList[i].shop_id +'" target="_blank" class="color-blue">'+ aList[i].from +'</a>';
							}
							else
							{
								messageUserName = aList[i].from;
							}
							
							sHtml += '<li class="msg-item ptb24 pr anim-all clearfix">'
								   +'	<div class="mr36 pr fl">'
								   +'		<img src="'+ aList[i].from_avatar +'" width="60" height="60" class="block circle" />'
								   +'		<!--<var class="msg-count tc pa circle">6</var>-->'
								   +'	</div>'							
								   +'	<dl class="msg-inner fl">'
								   +'		<dt class="msg-tit clearfix">'
								   +'			<cite class="color-888 fl">'+ messageUserName +'</cite>'
								   +'			<p class="msg-time fr">'+ aList[i].create_time +'</p>'
								   +'		</dt>'								
								   +'		<dd class="msg-des pt12 clearfix">'
								   +'			<div class="msg-art fl">'+ aList[i].content +'</div>'
								   +'		</dd>'
								   +'	</dl>'
								   +'</li>';
						}
					}
					
					return sHtml;
				}
			});
		}
		
		// 列表无数据
		function noListData(listBox, text)
		{
			var listBox = (typeof listBox == 'string') ? $(listBox) : listBox;		
			var sHtml = '<li class="tc clearfix" style="padding-top:135px;"><p class="f14 color-333">'+ text +'</p></li>';
			
			listBox.html(sHtml);
			listBox.parent().css({ border: 'none'});
			
			return sHtml;
		}
		
		// 删除留言
		function removeMsg(oThis, oParents)
		{
			var oParents = oThis.parents(oParents);
			var removeURL = '/';
			var datas = {};
			
			if(oThis.attr('data-remove') == 'message')
			{
				removeURL = '/Message/delete';
				datas.conversation = oParents.attr('data-conversation');
			}
			else if(oThis.attr('data-remove') == 'servicenotice')
			{
				removeURL = '/Servicenotice/delete';
				datas.id = oParents.attr('data-id');
			}
			else if(oThis.attr('data-remove') == 'announce')
			{
				removeURL = '/Announce/delete';
				datas.id = oParents.attr('data-id');
			}
			else
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: removeURL,
				data: datas,
				success: function(ajaxData){
					
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						if(oParents.siblings().length <= 0)
						{
							location.reload();
						}
						
						oParents.fadeOut(function(){
							oParents.remove();
						});
					}
				}
			});
		}
		
		// 匹配 http[s] | ftp[s]
		function match_url(str)
		{
			var reg=/(http[s]?|ftp[s]?):\/\//i;
			
			return reg.test(str);
		}
	
	});
	
    module.exports = message;
});