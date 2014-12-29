define(function(require, exports, module){
    var CATE = {};
	
	CATE.Actions = {
		// 获取商品信息
		getBaseGoodsInfoAction: function(datas, callback)
		{
			$.ajax({
				type: 'GET',
				url: '/detail/getBaseGoodsInfo',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					var datalist = ajaxData.data;
					
					if(ajaxData.code == 0)
					{
						callback && callback(datalist);
					}
					else
					{
						//console.log(ajaxData.msg);
					}
				},
				error: function()
				{
					//console.log('error');
				}
			});
		}
	};
	
	CATE.Methods = {
		// 初始化商品信息
		initGoodsInfoMethod: function(selects)
		{
			CATE.Methods.selectSetGoodsMethod(selects);	
		},
		
		// 选择要设置的商品
		selectSetGoodsMethod: function(selects)
		{
			var selects = (typeof selects == 'string') ? $(selects) : selects;
			var datas = {};
			var arr = [];
			
			selects.each(function(){
				
				var _this = $(this);
				var id = _this.attr('data-goodsInfo-id');
				
				arr.push(id);
				
			});
			
			datas.ids = arr.join(',');
			
			CATE.Actions.getBaseGoodsInfoAction(datas, CATE.Methods.setBaseGoodsInfoMethod);
		},
		
		// 设置商品的价格/编辑时间
		setBaseGoodsInfoMethod: function(datalist)
		{		
			for(var id in datalist)
			{
				var sEditTime = datalist[id].editTime;
				var sPrice = datalist[id].price;
					sPrice = '¥' + sPrice;
					
				var categoryBox = $('[data-class=category][data-goodsInfo-id='+ id +']');
				var goodsEditTimeBox = $('[data-class=goodsEditTime][data-goodsInfo-id='+ id +']');
				
				categoryBox[0] && categoryBox.text(sPrice);
				goodsEditTimeBox[0] && goodsEditTimeBox.text(sEditTime);
			}
		}
	};
	
    module.exports = CATE;
});