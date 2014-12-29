define(function(require, exports, module){
	var user;
	
	var avatorUpload = require('{common}avatorUpload');
	
	// 轮询更新未读消息数
	(function(){
		
		var msgCountBox = $('#msgCountBox');
		var interval = 60000;	// 执行间隔
		var timer = null;
		
		timer = setInterval(function(){
			
			pollingInterval(msgCountBox);
			
		}, interval);
		
		// 轮询更新
		function pollingInterval(obj)
		{
			getMessageAction(obj, updatePageMessage);
		}
		
		// 更新页面中的消息数
		function updatePageMessage(obj, data)
		{
			var count = data.data;
			
			if(count <= 0)
			{
				return false;
			}
			
			obj.text(count);
		}
		
		// 获取消息数 ajax 请求
		function getMessageAction(obj, callback)
		{
			$.ajax({
				typ: 'POST',
				url: '/Myspace/messageUnreadCount',
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					if(ajaxData.code == 0)
					{
						callback && callback(obj, ajaxData);
					}
					else
					{
						//console.log('faild');
					}
				},
				error: function()
				{
					//console.log('erro');
				}
			});
		}
		
	})();
	
    module.exports = user;
});