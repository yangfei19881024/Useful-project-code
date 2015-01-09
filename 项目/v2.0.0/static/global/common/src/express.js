define(function(require, exports, module){
    var EXP = {};
	
	//EXP.Datas = {};
	
	EXP.Actions = {		
		/*---------------------------------------------
		@Class: 获取订单的物流信息
		---------------------------------------------*/
		getOrderExpressInfo: function(obj, expModule, callback)
		{
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			var orderId = obj.attr('data-orderId');
				orderId = orderId || '123' + (new Date).getTime() + '987';
			
			var datas = {};
				datas.orderId = orderId;
			
			$.ajax({
				type: 'POST',
				url: DOMAIN + '/order/getExpressInfo',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					//console.log(ajaxData)；
					
					if(ajaxData.code == 0)
					{
						//console.log('success');
						
						callback && callback(expModule, ajaxData);
					}
					else
					{
						//console.log('faild');
						callback && callback(expModule, '暂时无法提供物流信息');
					}
				},
				error: function()
				{
					//console.log('error');
					callback && callback(expModule, '暂时无法提供物流信息');
				}
			});
		},
		
		/*---------------------------------------------
		@Class: 获取退货退款的物流信息
		---------------------------------------------*/
		getRefundExpressInfo: function(obj, expModule, callback)
		{
			var obj = (typeof obj == 'string') ? $(obj) : obj;
			var shippingName = obj.attr('data-shippingName');
				shippingName = shippingName || 'XDEXP';
			var waybill = obj.attr('data-waybill');
				waybill = waybill || '123' + (new Date).getTime() + '987';
			
			var datas = {};
				datas.shippingName = shippingName;
				datas.waybill = waybill;
			
			$.ajax({
				type: 'POST',
				url: DOMAIN + '/order/getExpressInfoByWaybill',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					//console.log(ajaxData)；
					
					if(ajaxData.code == 0)
					{
						//console.log('success');
						
						callback && callback(expModule, ajaxData);
					}
					else
					{
						//console.log('faild');
						callback && callback(expModule, '暂时无法提供物流信息');
					}
				},
				error: function()
				{
					//console.log('error');
					callback && callback(expModule, '暂时无法提供物流信息');
				}
			});
		}
	};
	
	EXP.Methods = {		
		/*---------------------------------------------
		@Class: 载入物流信息（订单详情页/退货退款详情页）
		---------------------------------------------*/
		loadExpressInfo: function(expModule, data)
		{
			var expModule = (typeof expModule == 'string') ? $(expModule) : expModule;
			
			if(typeof data == 'string')
			{
				expModule.html(data);
				
				return false;
			}
			
			var datalist = data.data;
			
			var exp_content = '<dl class="clearfix">'
							  +'	<dt class="fl">发货方式：</dt>'
							  +'		<dd class="fl">'+ datalist.shipping_type_name +'</dd>'
							  +'	</dl>'
							  +'<dl class="clearfix">'
							  +'	<dt class="fl">物流公司：</dt>'
							  +'	<dd class="fl">'+ datalist.shipping_name +'</dd>'
							  +'</dl>'
							  +'<dl class="clearfix">'
							  +'	<dt class="fl">运单号码：</dt>'
							  +'	<dd class="fl">'+ datalist.invoice_no +'</dd>'
							  +'</dl>'
							  +'<dl class="clearfix">'
							  +'	<dt class="fl">物流跟踪：</dt>'
							  +'	<dd class="fl">'
							  +'		<ul>'
							  +				EXP.Methods.readExpressState(datalist.shipping_info)
							  +'		</ul>'
							  +'		'
							  +'		<div class="expressExplan mt12">以上信息由物流公司提供，如无跟踪信息或有疑问，请查询 <a href="'+ datalist.shipping_url +'" class="color-blue" target="_blank">'+ datalist.shipping_name +'</a> 官方网站或联系其公示电话</div>'
							  +'	</dd>'
							  +'</dl>';
			
			expModule.html(exp_content);
		},
		
		/*---------------------------------------------
		@Class: 载入物流信息（订单详情页/退货退款详情页）
		---------------------------------------------*/
		loadRefundExpressInfo: function(expModule, data)
		{
			var expModule = (typeof expModule == 'string') ? $(expModule) : expModule;
			
			if(typeof data == 'string')
			{
				expModule.html(data);
				
				return false;
			}
			
			var datalist = data.data;
			
			var exp_content = '<dd class="expressInfo triangle plr24 pb24 pt12 hide pa">'
							 +'		<div class="expressInfo-hd clearfix">'
							 +'		<p>发货方式：'+ datalist.shipping_type_name +'<span class="pl24">物流公司：'+ datalist.shipping_name +'</span><span class="pl24">运单号码：'+ datalist.invoice_no +'</span></p>'
							 +'	</div>'
							 +'	'
							 +'	<ul class="pt12 clearfix">'
							 +		EXP.Methods.readExpressState(datalist.shipping_info, 1)
							 +'	</ul>'
							 +'</dd>';
			
			expModule.html(exp_content);
		},
		
		/*---------------------------------------------
		@Class: 读取物流流转状态
				$desc: 1 代表倒序 !1 代表正序
		---------------------------------------------*/
		readExpressState: function(datalist, desc)
		{
			var exp_state_list = '';
			
			if(desc)
			{
				var datalist = datalist.reverse();
			}
			
			for(var i = 0, l = datalist.length; i < l; i ++)
			{
				if((!desc && i == l - 1) || (desc && i == 0))
				{
					exp_state_list += '<li class="color-green">'+ datalist[i].time +' '+ datalist[i].process +'</li>';
				}
				else
				{
					exp_state_list += '<li>'+ datalist[i].time +' '+ datalist[i].process +'</li>';
				}
			}
			
			return exp_state_list;
		}
	};
	
	//EXP.Events = {};
	
    module.exports = EXP;
});