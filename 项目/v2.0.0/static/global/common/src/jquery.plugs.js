/*
**	常用效果插件
**	@jquery: jquery.1.7.2.js
**	$file: jquery.plugs.js
**/

define(function(require, exports, module){
	return function($){
		/*
		**	图片切换效果
		**	@version V1.0.0
		**	@author: yanshaojing <569363234@qq.com>
		**	$time: 2014/05/09
		**/
		$.fn.carousel = function(options)
		{
			return $.fn.carousel.defaults = {
				datalist 		: '[data-class=datalist]',	//切换列表
				buttons  		: '[data-class=buttons]',	//左右按钮容器
				arrows   		: '[data-class=arrows]',	//分页容器
				arrowsClass		: 'arrows',					//按钮默认 class
				arrowsCurrent	: 'current',				//按钮高亮 class
				numbers	 		: true,						//是否出现数字按钮 ( 此功能暂未开发)
				now		 		: 0,						//默认选择
				auto	 		: true,						//是否自动播放
				interval	 	: 3500,						//多长时间执行一次
				duration 		: 500,						//动画执行时间
				callback 		: null						//回调函数
			},
			
			this.each(function(){
				var opts = $.extend({}, $.fn.carousel.defaults, options),
					self = $(this),
					datalist = $(opts.datalist, self),
					elements = datalist.children(),
					elementW = elements.outerWidth(),
					length = elements.length,
					buttons = $(opts.buttons, self),
					prevButton = $('[data-class=previous]', buttons),
					nextButton = $('[data-class=next]', buttons),
					arrows = $(opts.arrows, self),
					arrowsClass = opts.arrowsClass,
					arrowsCurrent = opts.arrowsCurrent,
					arrowsButton = null,
					numbers = opts.numbers,
					now = opts.now,
					auto = opts.auto,
					interval = opts.interval,
					duration = opts.duration,
					callback = opts.callback,
					oldNow = now,
					bMover = true,
					timer = null;
				
				if(length <= 1)
				{
					buttons.add(arrows).css('display', 'none');			
					return null;
				}
				
				init();
				
				prevButton.bind('click', function(){
					
					if(bMover)
					{
						prev();
					}
					
					return false;
				});
				
				nextButton.bind('click', function(){
					
					if(bMover)
					{
						next();
					}
					
					return false;
				});
				
				arrowsButton && arrowsButton.bind('click', function(){
					
					var _this = $(this);
					var _index = _this.index();
					
					if(bMover && oldNow != _index)
					{
						oldNow = now;
						now = _index;
						move(1);
					}
					
					return false;
				});
				
				self.bind('mouseover', function(){
					
					pause();
					//buttons.show();
					
				}).bind('mouseout', function(){
					
					play();
					//buttons.hide();
					
				});
				
				function init()
				{
					setDom();
					play();
				}
				
				function prev()
				{
					oldNow = now;
					now --;
					move(0);
				}
				
				function next()
				{
					oldNow = now;
					now ++;
					move(1);
				}
				
				function play()
				{
					auto && (timer = setInterval(next, interval));
				}	
				
				function pause()
				{
					clearInterval(timer);
				}
				
				function setDom()
				{
					if(length <= 1)
					{
						buttons.add(arrows).css('display', 'none');			
						return null;
					}
					
					if(numbers)
					{
						createArrows();
					}
					//datalist.css('width', (length + 1) * elementW);
				}
				
				function createArrows()
				{	
					var html = '';
					
					arrows.empty();
								
					for(var i = 0; i < length; i++)
					{
						html += '<a href="javascript:;" class="'+ arrowsClass +'">&nbsp;</a>';
					}	
						
					arrows.append(html);
					
					arrowsButton = arrows.children();
					
					arrowsButton.eq(now).addClass(arrowsCurrent);
				}
				
				function setElementsPosition(d)
				{
					var oldElements = elements.eq(oldNow);
					
					elements.css({ position: 'absolute'});
					
					if(d)
					{
						oldElements.siblings().css({ left: elementW});
					}
					else
					{
						oldElements.siblings().css({ left: -elementW});
					}
				}
				
				function move(d)
				{
					bMover = false;
					
					if(now < 0)
					{
						now = length - 1;
					}
					else if(now > length - 1)
					{
						now = 0;
					}
					
					var oldElements = elements.eq(oldNow);
					var currentElements = elements.eq(now);
					var _this = currentElements;
					
					setElementsPosition(d);
					
					if(d)
					{
						oldElements.stop(true, true).animate({ left: -elementW}, duration);
					}
					else
					{
						oldElements.stop(true, true).animate({ left: elementW}, duration);
					}
					
					currentElements.stop(true, true).animate({ left: 0}, duration, function(){
						
						oldNow = now;
						bMover = true;
						
					});
					
					if(arrowsButton)
					{
						arrowsButton.eq(now).addClass(arrowsCurrent).siblings().removeClass(arrowsCurrent);
					}
					
					callback && callback(_this, now);
				}
			});
		};
		
		/*
		**	自定义下拉框
		**	@version V1.0.0
		**	@author: yanshaojing <569363234@qq.com>
		**	$time: 2014/05/07
		**/
		$.fn.selects = function(options)
		{
			return $.fn.selects.defaults = {
				container		: '#plugs-select',	// 下拉框容器
				selects			: -1,				// 默认选择
				turn			: false,			// 默认是否展开
				autoRunCallback	: false,			// 页面加载的时候是否执行 callback 方法
				callback		: null				// 回调函数
			},
			
			this.each(function(){
				var opts = $.extend({}, $.fn.selects.defaults, options),
					self = $(this),
					title = $('.plugs-select-title[data-state=title]', self),
					input = $('.plugs-select-value', self),
					datalist = $('.plugs-select-bd[data-state=datalist]', self),
					option = $('.plugs-select-option[data-state=option]', datalist),
					selects = opts.selects,
					turn = opts.turn,
					callback = opts.callback,
					autoRunCallback = opts.autoRunCallback,
					sToggleClass = 'plugs-select-open';
				
				var methods = {};
				
				self.unbind();
				self.on('click', function(ev){
					
					methods.cancelDefault(ev);
					
					self.toggleClass(sToggleClass);
					
				});
				
				self.on('keydown', function(ev){
					
					methods.moveSelect(ev);
					
				});
				
				option.on('click', function(ev){
					
					var data_id = $(this).attr('data-id');
					autoRunCallback = true;
					
					methods.init(data_id, callback);
					
				});
				
				$(document).on('click', function(){
					
					methods.turnOff();
					
				});
				
				self.on('mouseleave', function(){
					
					var time = setTimeout(function(){
						
						methods.turnOff();
						clearTimeout(time);
						
					}, 500);
					
				});
				
				methods.turnOn = function()
				{
					self.addClass(sToggleClass);
				}
				
				methods.turnOff = function()
				{
					self.removeClass(sToggleClass);
				}
				
				methods.moveSelect = function(ev)
				{
					var datalistHeight = datalist.height();
					var optionHeight = option.outerHeight();
					var selectOption = $('.plugs-select-select', datalist);
					var len = option.length;
					var nowIndex = 0;
						nowIndex = selectOption.index();
						nowIndex = parseInt(nowIndex);
						nowIndex = isNaN(nowIndex) ? 0 : nowIndex < 0 ? 0 : nowIndex;
					var key = ev.keyCode;
					
					if(key == 38)
					{
						methods.cancelDefault(ev);
						nowIndex --;
					}
					else if(key == 40)
					{
						methods.cancelDefault(ev);
						nowIndex ++;
					}
					else if(key == 13 && nowIndex >= 0)
					{
						methods.cancelDefault(ev);
						selectOption.click();
					}
					else if(key == 32)
					{
						methods.cancelDefault(ev);
						self.click();
						//console.log(1);
					}
					
					nowIndex = nowIndex < 0 ? len - 1 : nowIndex;
					nowIndex = nowIndex >= len ? 0 : nowIndex;
					option.eq(nowIndex).addClass('plugs-select-select').siblings().removeClass('plugs-select-select');
					
					if(nowIndex > 0)
					{
						var scrollT = (nowIndex - 1) * optionHeight;
					}
					else
					{
						var scrollT = 0;
					}
					
					datalist.animate({ scrollTop: scrollT}, { queue: false});
				}
				
				methods.cancelDefault = function(ev)
				{
					ev.preventDefault();
					ev.stopPropagation();
				}
				
				methods.init = function(selects)
				{
					var data_id = selects;
					
					for(var i = 0, len = option.length; i < len; i++)
					{
						var oSlt = option.eq(i);
						
						if(oSlt.attr('data-id') == data_id)
						{
							var data_value = oSlt.attr('data-value');
							var title_html  =  oSlt.html();
							
							oSlt.addClass('plugs-select-select').siblings().removeClass('plugs-select-select');
							title.attr('data-id', data_id).attr('data-value', data_value).html(title_html );
							input.val(data_value).attr('key', title_html);
							
							var data = {
								object : self,
								data_id : data_id,
								data_value : data_value,
								title_html: title_html
							};
							
							if(autoRunCallback)
							{
								callback && callback(data);
							}
							
							return data;
						}
					}
					
					return self;
				}
				
				methods.init(selects);
				
				if(turn)
				{
					methods.turnOn();
				}
				else
				{
					methods.turnOff();
				}
			});
		};
		
		/*
		**	ajax 无刷新分页 
		**	@version V1.0.0
		**	@author: yanshaojing <569363234@qq.com>
		**	$time: 2014/05/04
		**/
		$.fn.ajaxPage = function(options)
		{
			return $.fn.ajaxPage.defaults = {
				type			: 'POST',							// 请求方式
				data			: {									//
					page		: 1
				},
				pageSize		: 10,								//每页多少个
				url				: null,								//后端 url
				run				: false,							//是否开始加载
				beforeSend		: false,							//请求前调用
				complete		: false,							//请求后调用
				pageId			: null,								//分页容器
				pageCount		: null,								//总页
				recordCount		: null,								//总条数
				listBox			: null,								//显示数据的盒子
				noDataCallback	: null,								//没有数据时, 执行的方法
				callback		: null								//用于解析ajax返回的数据，并将其添加到 html dom 中
			},
			
			this.each(function(){
				var opts = $.extend({}, $.fn.ajaxPage.defaults, options),
					run = opts.run,
					data = opts.data,
					pageId = $(opts.pageId),
					listBox = $(opts.listBox),
					noData = opts.noData,
					bMove = false;
				
				var methods = {};
				
				methods.run = function()
				{
					methods.ajax();
				}
				
				methods.backtop = function()
				{
					$('html, body').animate({ scrollTop: listBox.offset().top - 100}, { duration:300, queue:false});
				}
				
				methods.ajax = function()
				{
					var url = opts.url;
					
					$.ajax({
						type		: opts.type,
						beforeSend	: opts.beforeSend,
						complete	: opts.complete,
						url			: url,
						data		: data,
						dataType	: 'json',
						success		: function(res){
							methods.callback(res);		//返回的json格式：{'code':0, 'msg': '', 'data': { 'total_pages': 2, 'items': {'id': '103', 'content': 'content', 'create_time': '2014-05-04 11:27:04', 'from': 'user', 'to': 'user', 'conversation': '67', 'is_read': true, 'msg_num': '88', 'from_shop': false}}}
							
							if(bMove)
							{
								methods.backtop();
							}
						}
					});
				}
				
				methods.callback = function(res)
				{
					var res = (typeof res == 'string') ? $.parseJSON(res) : res;
					
					if(res)
					{
						if(res.code == 0)
						{
							if(opts.callback && typeof opts.callback == 'function')
							{
								if(res.data)
								{
									opts.pageCount = res.data.total_pages;
									opts.recordCount = opts.pageCount * opts.pageSize;
									
									var listHtml = opts.callback(res);
									
									listBox.html(listHtml);
								}
								else
								{
									opts.pageCount = 0;
									opts.noDataCallback && opts.noDataCallback();
								}
							}
						}
						else
						{
							opts.pageCount = 0;
							opts.noDataCallback && opts.noDataCallback();
						}
						
						if(pageId)
						{
							methods.toPage();
							methods.toPageBind();
						}
					}
				}
				
				methods.get = function(i)
				{
					if(opts.pageCount < 1)
					{
						return opts;	
					}
					
					switch(i)
					{
						case 'pre':
							data.page --;
							break;	
						case 'next':
							data.page ++;
							break;	
						case 'first':
							data.page = 1;
							break;
						case 'last':
							data.page = opts.pageCount;
							break;
						default :
							if(isNaN(i))
							{
								break;	
							}
							
							i = parseInt(i);
							
							if(i > opts.pageCount)
							{
								i = opts.pageCount;	
							}
							
							if(i == data.page )
							{
								return false	
							}
							
							data.page = i;
							break;
					}
					
					methods.ajax();
					
					bMove = true;
				}
				
				methods.toPageBind = function()
				{
					pageId.find('a.page-first').click(function(){
						methods.get('first');
					
						return false;	
					});
					
					pageId.find('a.page-last').click(function(){
						methods.get('last');	
					
						return false;
					});
					
					pageId.find('a.page-prev').click(function(){
						methods.get('pre');	
					
						return false;
					});
					
					pageId.find('a.page-next').click(function(){
						methods.get('next');
					
						return false;	
					});
					
					pageId.find('a.page-num').click(function(){
						methods.get($(this).attr('data-page'));
					
						return false;
					});
					
					pageId.find('input.page-num').focus(function(){
						$(this).val('').keydown(function(e){
							if(e.keyCode === 13)
							{
							   methods.get($.trim($(this).val()));
							}
						});
					});
					
					pageId.find('input.page-btn').click(function(){
						methods.get($.trim(pageId.find('input.page-num').val()));
					});
				}
				
				methods.toPage = function()
				{
					var str='';
					
					if(opts.recordCount > opts.pageSize)	//当总数据大于每页显示个数是才显示分野马, 否则不显示
					{
						var page = data.page * 1,
							pageSize = opts.pageSize * 1,
							pageCount = opts.pageCount * 1;
		
						if(page > 1)
						{
							str += '<a href="#" class="page-button page-prev inline-block">&lt;</a>';
						}
						else
						{
							str += '<span class="page-button page-prev inline-block page-disabled">&lt;</span>';
						}
		
						if(pageCount < 7)
						{
							for(var i=1; i <= pageCount; i++)
							{
								if(page === i)
								{
									str += '<span class="page-button inline-block page-current">'+ i +'</span>';
								}
								else
								{
									str += '<a href="#" class="page-button page-num inline-block" data-page="'+ i +'">'+ i +'</a>';
								}
							}
						}
						else
						{
							var start, end;
							
							if(page === 1 || page === 0)
							{
								page = 1;
								str += '<span class="page-button inline-block page-current">1</span>';
							}
							else
							{
								str += '<a href="#" class="page-button inline-block page-first">1</a>';
							}
							
							if(page > 5)
							{
								str += '<span class="page-elps inline-block">...</span>';
							}
							
							if(page < 6)
							{
								start = 1;
							}
							else
							{
								start = page - 3;
							}
		
							if(page > (pageCount-5))
							{
								end = pageCount;
							}
							else
							{
								end = page + 4;
							}
							
							for(var i = start; i < end; i++)
							{
								if(i !== 1 && i !== pageCount)	//避免重复输出1和最后一页
								{
									if(i === page)
									{
										str += '<span class="page-button inline-block page-current">'+ i +'</span>';
									}
									else
									{
										str += '<a href="#" class="page-button page-num inline-block" data-page="'+ i +'">'+ i +'</a>';
									}
								}
							}
							
							if(page <= (pageCount-5))
							{
								str += '<span class="page-elps inline-block">...</span>';
							}
							
							if(page === pageCount)
							{
								str += '<span class="page-button inline-block page-current">'+ pageCount +'</span>';
							}
							else
							{
								str += '<a href="#" class="page-button inline-block page-last">'+ pageCount +'</a>';
							}
						}
		
						if(page >= pageCount)
						{
							str += '<span class="page-button page-next inline-block page-disabled">&gt;</span>';
						}
						else
						{
							str += '<a href="#" class="page-button page-next inline-block">&gt;</a>';
						}
						
						str += '<div class="pageGoto inline-block">到<span class="page-button inline-block"><input type="text" value="'+ page +'" class="pageNum page-num fl"><input type="button" class="pageBtn page-btn sprites fr"></span>页</div>';
					}
					else
					{
						pageId.hide();
					}
					
					pageId.html(str);
				}
				
				if( opts.run )
				{
					methods.run();
				}
				
			});
		};
		
	};
});