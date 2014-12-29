define(function(require, exports, module){
	var favorite;	
	
	var commonFun = require('{common}common.fun');
	var Plugs = require('{common}jquery.plugs')($);
	var complaintsBtn = $('#complaints');
	var UPLOAD_IMAGE_URI = [];
	var userOrderNumber = '';
	
	// 投诉类型
	$('#selectReason').selects({
		selects: $('input[name=complaintType]').val(),
		autoRunCallback: true,
		callback: function(res)
		{
			var oEle = $('[data-class=orderRel]');
			var oInput = $('input[name=orderNumber]', oEle);
			
			if(res.data_id == 1 || res.data_id == 2 || res.data_id == 3)
			{
				oEle.show();
				oInput.attr('data-required', 'required').val(userOrderNumber);
			}
			else
			{
				userOrderNumber = oInput.val();
				userOrderNumber = $.trim(userOrderNumber);
				oEle.hide();
				oInput.removeAttr('data-required').val('');
			}
		}
	});
	
	/*------------------------------------------------------------------
	@Class: 订单编号输入状态
	------------------------------------------------------------------*/
	(function(){
	
		commonFun.Check.string('input[name=orderNumber]', { type: 'number', required: '订单编号为必填项', format: '订单编号只能是大于10位的数字'});
		
		$('input[name=orderNumber]').on('blur', function(){
			
			var _this = $(this);
			var bNumber = commonFun.Check.check(_this, { type: 'number', required: '订单编号为必填项', format: '订单编号只能是大于10位的数字'});
			
			if(!bNumber)
			{
				return false;
			}
			
			complaintCheck();
			
		});
	
	})();
	
	/*------------------------------------------------------------------
	@Class: 提交投诉
	------------------------------------------------------------------*/	
	(function(){
	
		UPLOAD_IMAGE_URI = commonFun.Methods.uploadImage('[data-class=upLoadImageError]');
		
		commonFun.Message.enterStatus('.refundDescription', 'button-light-disabled', '投诉');
		
		complaintsBtn.on('click', function(){
			
			var oThis = $(this);
			
			if(oThis.hasClass('button-light-disabled'))
			{
				return false;
			}
			
			complaintCheck();
			
			return false;
			
		});
	
	})();
	
	function complaintCheck()
	{
		var datas = {};
			datas[TOKEN_KEY] = TOKEN_VAL;
			datas.type = $('input[name=complaintType]').val();
			datas.orderId = $('input[name=orderNumber]').val();
			datas.content = $('textarea[name=description]').val();
			datas.attachments = UPLOAD_IMAGE_URI.join(',');
		
		$('#error-warning-complaintType').hide().html('');
		$('#error-warning-orderNumber').hide().html('');
		$('#error-warning-description').hide().html('');
		$('[data-class=upLoadImageError]').hide().html('');
		
		$.ajax({
			type: 'POST',
			url: '/complaint/save',
			data: datas,
			dataType: 'json',
			success: function(ajaxData)
			{
				var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
				
				//console.log(ajaxData);
				
				switch(ajaxData.code)
				{
					case -10119:
						$('.certificate-item-notice > .color-red').show().html(ajaxData.msg);
						break;
					case -10502:
					case -10509:
						$('#error-warning-complaintType').show().html('投诉类型为必选项！');
						break;
					case -10500:
					case -10501:
					case -10505:
					case -10506:
					case -10508:
						complaintNotice(320, ajaxData.msg);
						break;
					case -10114:
					case -10503:
						$('#error-warning-orderNumber').show().html(ajaxData.msg);
						break;
					case -10504:
						$('#error-warning-description').show().html(ajaxData.msg);
						break;
					case 0:					
						location.href = '/complaint/success';
					default:
						//console.log(ajaxData.msg);
				}
			}
		});
	}		
			
	// 提交投诉出现错误的情况
	function complaintNotice(width, msg)
	{
		$.block({
			title: ' ',
			content: '<div class="clearfix" style="width:'+ width +'px;">'
					+'	<div class="icon-warning-36 sprites fl"></div>'
					+'	<dl class="pl12 fl">'
					+'		<dt class="f18 lh36">'+ msg +'！</dt>'
					+'		<dd class="pt24 pl48">'
					+'			<a href="javascript:;" class="button-light-100 anim-all" data-action="close">知道了</a>'
					+'		</dd>'
					+'	</dl>'
					+'</div>'
		});
		
		$(document).on('click', '[data-action=close]', function(){
			
			$.unblock();
			
			return false;
			
		});
	}	
	
    module.exports = favorite;
});