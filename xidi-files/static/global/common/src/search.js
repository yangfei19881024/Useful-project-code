define(function(require, exports, module){
	var searchGoods;
	
	var commonFun = require('{common}common.fun');
	
	var searchBox = $('.searchBox');
	var searchBar = $('.search-bar', searchBox)
	var searchkey = $('.searchkey', searchBar);
	var searchsugbox = $('.searchsugbox', searchBox);
	var historyList = $('.search-his', searchsugbox);
	var interestList = $('.search-interest', searchsugbox);
	var suggessList = $('.search-sug', searchsugbox);
	var searchButton = $('#header-search');
	var searchForm= $('#searchForm');
	
	init();
	
	// 提交搜索
	searchButton.bind('click', function(){
		
		var k = searchkey.val();
			k = $.trim(k);
		
		if(k == '')
		{
			return false;
		}
		
		$('#searchForm').submit();
		
	});
	
	// 改变搜索框大小
	searchkey.bind('focus', function(){
		
		searchBar.addClass('sFocus');
		
		searchsugbox.fadeIn(200);
		
	}).bind('blur', function(){
		
		searchBar.addClass('sFocus');
		
		searchsugbox.fadeOut(200);
		
	});
	
	/*searchBox.bind('mouseleave', function(){		
		
		searchBar.removeClass('sFocus');
		
		searchsugbox.fadeOut(200);
		
	});*/
	
	// 获取建议的商品
	searchkey.bind('keyup', function(e){
		
		var keycode = e.keyCode;
		var k = searchkey.val();
			k = $.trim(k);
		var bAct = true;
		
		if(keycode == 37 || keycode == 38 || keycode == 39 || keycode == 40)
		{
			bAct = false;
		}
		
		if(k == '' && bAct)
		{
			historyList.show();
			interestList.show();
			suggessList.hide();
		}
		else if(bAct)
		{
			suggestAction(k, suggessList, suggessMethod);
		}
		
	});
	
	// 删除搜索内容
	var delHis = $('.icon-delete', historyList);
	delHis.bind('click', function(){
		
		var _this = $(this);
		
		removeHistory(_this, historyList);
		
		return false;
		
	});
	
	// 清空最近搜索
	var emptyHis = $('.icon-empty', historyList);
	emptyHis.bind('click', function(){
		
		var _this = $(this);
		
		emptyHistory(_this);
		
		return false;
		
	});
	
	// 单击推荐的内容, 进行搜索
	var searchItem = $('.search-item');
	searchItem.live('click', function(){
		
		var _this = $(this);
		var k = _this.attr('data-key');
			k = $.trim(k);
			
		if(k == '')
		{
			return false;
		}
		
		searchkey.val(k);
		
		searchForm.submit();
		
		return false;
		
	}).live('mouseover', function(){
		
		var _this = $(this);
		var k = _this.attr('data-key');
			k = $.trim(k);
		
		_this.addClass('search-current').siblings().removeClass('search-current');
		
	}).live('mouseout', function(){
		
		var _this = $(this);
		
		_this.removeClass('search-current');		
		
	});
	
	// 分页跳转
	$('#page-button').bind('click', function(){
		
		$('#pageForm').submit();
		
	});
			
	$(document).bind('keyup', function(e){
		
		moveCurrent(e);
		
	});
	
	// 初始化搜索
	function init()
	{
		getHistory(historyList, true);
	}
	
	// 搜索建议的 ajax 请求
	function suggestAction(k, suggessList, callback)
	{
		$.ajax({
			type: 'GET',
			url: '/search/suggest',
			data: {
				k: k
			},
			dataType: 'json',
			success: function(ajaxData)
			{
				var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
				
				if(ajaxData.code == 0)
				{
					callback && callback(suggessList, ajaxData.data);
				}				
			},
			error: function()
			{
				//console.log('error');
			}
		});
	}
	
	// ajax 请求成功执行的方法
	function suggessMethod(suggessList, data)
	{
		var suggessList = (typeof suggessList == 'string') ? $(suggessList) : suggessList;
		var suggessHtml = '';
		var goodsList = data.good;
		
		for(var key in goodsList)
		{
			var goods = goodsList[key];
			var num = goods.num;
			var str = goods.name;
			var arr = str.split(' ');
			var name = arr[0] 
				name = name ? name : '';
			var country = arr[1] ;
				country = country ? country : '';
			var goodsName= arr[2]; 
				goodsName = goodsName ? goodsName : '';
			
			suggessHtml += '<li class="search-item" data-key="'+ str +'">'+ country +' <strong>'+ name +'</strong> '+ goodsName +'<div class="search-notice pa"><var class="fr">'+ num +'</var></div></li>';
		}
		
		suggessList.html(suggessHtml);
		
		suggessList.fadeIn().siblings().hide();
	}
	
	// 获取用户最近搜索的内容
	function getHistory(historyList, bApd)
	{
		var aCookie = commonFun.Methods.getCookie('search_history');
			aCookie = unescape(aCookie);
			aCookie = $.trim(aCookie);
			
		if(aCookie == '')
		{
			return false;
		}
			
		aCookie = $.parseJSON(aCookie);
			
		if(aCookie == null || aCookie.length < 1)
		{
			return false;
		}
		
		if(bApd)
		{
			var historyHtml = '<li class="search-default">最近搜索<span class="icon-empty sprites pa"></span></li>';
			
			for(var i = 0; i < aCookie.length; i++)
			{
				historyHtml += '<li class="search-item" data-key="'+ aCookie[i] +'">'+ aCookie[i] +'<div class="search-notice pa"><span class="icon-delete sprites"></span></div></li>'
			}
			
			historyList.html(historyHtml);
		}
		
		return aCookie;
	}
	
	// 删除最近搜索内容
	function removeHistory(_this, historyList)
	{
		var base = _this.parents('.search-item');
		var k = base.attr('data-key');
		var aHistory = getHistory(historyList);
		
		// 从 cookie 中删除搜索的内容
		aHistory.splice($.inArray(k, aHistory), 1);
		
		var sHistory = arrayToStrArray(aHistory);
		
		commonFun.Methods.setCookie('search_history', sHistory);
		
		base.remove();
	}
	
	// 清空最近搜索的内容
	function emptyHistory(_this)
	{
		var base = _this.parents('.search-default');
		
		base.siblings().remove();
		
		commonFun.Methods.removeCookie('search_history');
	}
	
	// 数组对象 转 字符串数组
	function arrayToStrArray(arr)
	{
		var strArray = '';
		var l = arr.length;
		for(var i = 0; i < l; i++)
		{
			if(i == (l - 1))
			{
				strArray += '"'+ arr[i] +'"';
			}
			else
			{
				strArray += '"'+ arr[i] +'",';
			}			
		}
		
		strArray = '['+ strArray +']';
		
		return strArray;
	}
	
	// 键盘操作推荐的内容
	function moveCurrent(e)
	{
		var searchItem = $('.search-sug > .search-item');
		var searchItem_len = searchItem.length;
		var searchCurrent = $('.search-current');
		var nowIndex = searchCurrent.index();
			nowIndex = parseInt(nowIndex);
			nowIndex = isNaN(nowIndex) ? -1 : nowIndex;
		var key = e.keyCode;
		
		if(key == 38)
		{
			nowIndex --;
		}
		else if(key == 40)
		{
			nowIndex ++;
		}
		else if(key == 13 && nowIndex >= 0)
		{
			searchCurrent.click();
			return false;
		}
		
		nowIndex = nowIndex < -1 ? searchItem_len - 1 : nowIndex;
		nowIndex = nowIndex >= searchItem_len ? 0 : nowIndex;		
		searchItem.eq(nowIndex).addClass('search-current').siblings().removeClass('search-current');
	}
	
	// 取消默认行为
	function cancelDefault(e)
	{
		e.preventDefault();
		e.stopPropagation();
	}
	
    module.exports = searchGoods;
});