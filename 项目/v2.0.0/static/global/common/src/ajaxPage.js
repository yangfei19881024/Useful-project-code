define(function(require, exports, module){
	return function($){
		
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