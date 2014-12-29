define(function(require, exports, module){
	var refund;	
	
	var commonFun = require('{common}common.fun');
	var Plugs = require('{common}jquery.plugs')($);
	var jQueryUi = require('{common}jquery-ui')($);
	
	$('#startTime').datetimepicker({
		format: 'yyyy-mm-dd hh:mm:ss',
		autoclose: true
	});
	$('#endTime').datetimepicker({
		format: 'yyyy-mm-dd hh:mm:ss',
		autoclose: true
	});
	
	/*------------------------------------------------------------------
	@Class: 退款/退货 左侧物流信息
	------------------------------------------------------------------*/
	(function(){
		
		var refundOrderExpInfo = $('#refund-orderExpInfo');
		var expressInfo = $('.expressInfo', refundOrderExpInfo);
		var bAction = true;
		
		refundOrderExpInfo.on('mouseover', function(){
			
			if(bAction)
			{
				bAction = false;
				commonFun.Actions.getOrderExpressInfoAction(refundOrderExpInfo, expressInfo, commonFun.Methods.loadRefundExpressInfo );
			}
			
		});
		
	})();
		
	
	/*------------------------------------------------------------------
	@Class: 退款退货物流信息
	------------------------------------------------------------------*/
	(function(){
		
		var xidiUrl = location.href;
		var oExpress = $('#logistics');
		var oButton = $('h3', oExpress);
		var oExpressMsg = $('.expressMsg', oExpress);
		var bAction = true;
		
		if(!oExpress[0]) return false;
		
		if(xidiUrl.indexOf('logistics') > 0 )
		{
			oExpress.addClass('expressCur');
			oExpressMsg.show();
			
			showExpInfo();
		}
		
		oButton.on('click', function(){
			
			oExpress.toggleClass('expressCur');
			oExpressMsg.stop(true, true).toggle();
			
			showExpInfo();
			
		});
		
		function showExpInfo()
		{
			if(bAction)
			{
				bAction = false;
				commonFun.Actions.getRefundExpressInfoAction(oButton, oExpressMsg, commonFun.Methods.loadExpressInfo );
			}
		}
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 倒计时
	------------------------------------------------------------------*/
	(function(){
		
		var cancelApply = $('#cancelApply');
		
		if(typeof ALL_TIME == 'undefined')
		{
			return false;
		}
		
		if(ALL_TIME <= 0)
		{
			cancelApply.addClass('button-notFund');
			return false;
		}
		
		commonFun.Methods.countdown(ALL_TIME, '#countdown', function(){
			
			cancelApply.addClass('button-notFund');
			
		});
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 退款/退货列表 筛选
	------------------------------------------------------------------*/
	(function(){
			
		// 退款状态下拉框
		$('#refundState').selects({
			selects: $('input[name=status]').val()
		});
		$('#refundListState').selects({
			selects: $('input[name=status]').val(),
			callback: function(datas)
			{
				$('input[name=status]').val(datas.data_id);
				$('form[name=search]').submit();
			}
		});
		// 订单筛选下拉框
		$('#orderFilter').selects({
			selects: $('input[name=type]').val(),
			callback: function(datas)
			{
				$('form[name=search]').submit();
			}
		});
		
		$('[data-action=refundSearch]').bind('click', function(){
			
			$('form[name=search]').submit();
			
			return false;
			
		});
		
		$('.pageBtn').bind('click', function(){
			
			$('form[name=search]').submit();
			
			return false;
			
		});
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 取消退款申请
	------------------------------------------------------------------*/
	(function(){
		
		var url = location.href;
		var parames = commonFun.Methods.parseUrl(url);
		
		var datas = {};
			datas[TOKEN_KEY] = TOKEN_VAL;
			datas.id = parames.id;
		
		$('#cancelApply').on('click', function(){
			
			var _this = $(this);
			
			if(_this.hasClass('button-notFund'))
			{
				return false;
			}
			
			var content = '<div class="clearfix">'
						  +'	<div class="icon-warning-36 sprites fl"></div>'
						  +'	<dl class="pl12 fl">'
						  +'		<dt class="f18 lh36">确认要取消退款/退货申请吗？</dt>'
						  +'		<dd class="pt24">'
						  +'			<a href="javascript:;" class="button-light-100 anim-all" data-type="submit">确定</a>'
						  +'			<a href="javascript:;" class="button-default-100 ml12 anim-all" data-action="close">取消</a>'
						  +'		</dd>'
						  +'	</dl>'
						  +'</div>';
			
			$.block({
				title: ' ',
				content: content
			});
			
			// 确认取消申请
			$(document).on('click', 'a[data-type=submit]', function(){
				
				$.ajax({
					type: 'GET',
					url: '/refund/cancel',
					data: datas,
					dataType: 'json',
					success: function(ajaxData)
					{
						if(ajaxData.code == 0)
						{
							location.href = '/refund/list';
						}
						
					}
				});
				
				return false;
			});
			
			// 关闭取消申请窗口
			$(document).on('click', 'a[data-action=close]', function(){
				
				$.unblock();
				
				return false;
			});
			
		});
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 提交退款申请
	------------------------------------------------------------------*/
	var UPLOAD_IMAGE_URI = commonFun.Methods.uploadImage('[data-class=uploadRefundError]');
	
	(function(){
		
		var otherRsn = '';
		
		// 退款理由下拉框
		$('#selectReason').selects({
			selects: $('input[name=selectReason]').val(),
			autoRunCallback: true,
			callback: function(res)
			{
				if(res.data_id >= 0)
				{
					$('#error-warning-selectReason').html('');
				}
				
				$('.refundDescription div[data-id]').addClass('hide');
				$('.refundDescription div[data-id='+ res.data_id +']').removeClass('hide');
			}
		});
		
		var url = location.href;
		var parames = commonFun.Methods.parseUrl(url);
		var oCount = $('input[name=count]');
		var oSum = $('[data-name=sum]');
		var oReason = $('input[name=selectReason]');
		var otherReason = $('input[name=reason]');
		var oRemarks = $('textarea[name=description]');
		var oMobile = $('input[name=mobile]');
		var datas = {};
			datas[TOKEN_KEY] = TOKEN_VAL;
			datas.orderId = parames.oid;
			datas.subOrderId = parames.sid;
			datas.goodsId = parames.gid;
			datas.type = parames.type;
		
		var refundPrice = $('[data-id=refundPrice]').val();
			refundPrice = parseFloat(refundPrice);
			refundPrice = isNaN(refundPrice) ? 1 : refundPrice;
		var allNum = oCount.val();
		
		oCount.on('focus', function(){
			
			var oThis = $(this);
			oThis.on('keydown', function(ev){
				
				var key = ev.keyCode;
				
				// 防止用户键入除数字 和 回车键以外按键
				if(!commonFun.Methods.detect(key))
				{
					return false;
				}
				
			}).on('keyup', function(){
				
				var now = $.trim(oThis.val());
					now = parseInt(now);
				
				if(now > allNum)
				{
					commonFun.Check.showError(oCount, '退款/退货数量不能超过购买数量');
				}
				else if(isNaN(now) || now == 0)
				{
					now = 0;
					commonFun.Check.showError(oCount, '退款/退货数量必须为大于0的整数');
				}
				else
				{
					commonFun.Check.hideError(oCount);
				}
				
				$('[data-name=sum]').text(now * refundPrice);
				
			});
			
		});
		
		// 提交申请弹框
		$('#refundApply').on('click', function(){
			
			datas.quantity = oCount.val();
			datas.sum = oSum.text();
			datas.reason = oReason.val();
			datas.reasonKey = oReason.attr('key');
			datas.otherReason = otherReason.val();
			datas.remarks = oRemarks.val();
			datas.attachments = UPLOAD_IMAGE_URI.join(',');
			datas.senderMobile = oMobile.val();
			
			if(!saveRefundCheck(datas.quantity, allNum))
			{
				return false;
			}
			
			if(datas.type == 0)
			{
				var sRefundType = '退款商品';
			}
			else
			{
				var sRefundType = '退货商品';
			}
			var sRefundName = $('input[data-id=refundName]').val();
			var sRefundImage = $('input[data-id=refundImage]').val();
			var aRefundAttr = $('input[data-id=refundAttr]');
			var sRefundAttr = '';
			
			for(var i = 0; i < aRefundAttr.length; i++)
			{
				sRefundAttr += '<p class="color-888">'+ aRefundAttr.eq(i).val() +'</p>';
			}
			
			var content = '<div class="table clearfix">'
						  +'	<div class="table-row">'
						  +'		<div class="w75 table-cell">'
						  +'			<div class="ptb24 color-666">'+ sRefundType +'</div>'
						  +'		</div>'
						  +'		<div class="w132 table-cell">'
						  +'			<div class="ptb24">'
						  +'				<img src="'+ sRefundImage +'" width="132" height="132" class="block">'
						  +'			</div>'
						  +'		</div>'
						  +'		<div class="w210 table-cell">'
						  +'			<div class="ptb24 pl24">'
						  +'				<p class="pb12 f13">'+ sRefundName +'</p>'
						  +					sRefundAttr
						  +'			</div>'
						  +'		</div>'
						  +'	</div>'
						  +'</div>'
						  +'<dl class="lh30 clearfix">'
						  +'	<dt class="w75 fl">退款数量</dt>'
						  +'	<dd class="fl">'+ datas.quantity +'</dd>'
						  +'</dl>'
						  +'<dl class="lh30 clearfix">'
						  +'	<dt class="w75 fl">退款金额</dt>'
						  +'	<dd class="color-green f14 fl">¥'+ datas.sum +'</dd>'
						  +'</dl>'
						  +'<dl class="lh30 clearfix">'
						  +'	<dt class="w75 fl">退款理由</dt>'
						  +'	<dd class="fl">'+ datas.reasonKey +' '+ datas.otherReason +'</dd>'
						  +'</dl>'
						  +'<div class="pt12 clearfix">'
						  +'	<a href="javascript:;" class="button-light-100 anim-all" data-type="submit">确定</a>'
						  +'	<a href="javascript:;" class="button-default-100 ml12 anim-all" data-type="close">取消</a>'
						  +'</div>';
			
			$.block({
				title: '提交退款/退货申请',
				content: content
			});
			
			// 确认提交申请
			$('[data-type=submit]').on('click', function(){
								
				var _this = $(this);
					_this.addClass('button-light-disabled');
				
				$('#error-warning-count').hide().html('');
				$('#error-warning-selectReason').hide().html('');
				$('#error-warning-description').hide().html('');
				$('[data-class=upLoadImageError]').hide().html('');
				
				$.ajax({
					type: 'POST',
					url: '/refund/save',
					data: datas,
					dataType: 'json',
					success: function(ajaxData)
					{
						var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
						
						switch(ajaxData.code)
						{
							case -10115:
								$('#error-warning-count').show().html(ajaxData.msg);
								$.unblock();
								break;
							case -10118:
								$('#error-warning-selectReason').show().html(ajaxData.msg);
								$.unblock();
								break;
							case -10119:
								$('[data-class=upLoadImageError]').show().html(ajaxData.msg);
								$.unblock();
								break;
							case -10128:				
								applyError(320, ajaxData.msg);
								break;
							case -10135:
								$('#error-warning-description').show().html(ajaxData.msg);
								$.unblock();
								break;
							case 0:
								location.href = '/refund/list';
								$.unblock();
								break;
							default:								
								applyError(285, ajaxData.msg);
						}
					}
				});
				
				return false;
				
			});
			
			// 关闭提交申请弹窗
			$('.plugs-close').on('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			$('a[data-type=close]').on('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			// 提交退款申请出现错误的情况
			function applyError(width, msg)
			{
				$.unblock(function(){
					$.block({
						title: ' ',
						content: '<div class="clearfix" style="width:'+ width +'px;">'
								+'	<div class="icon-warning-36 sprites fl"></div>'
								+'	<dl class="pl12 fl">'
								+'		<dt class="f18 lh36">'+ msg +'！</dt>'
								+'		<dd class="pt24 pl48">'
								+'			<a href="javascript:;" class="button-light-100 anim-all" data-type="close">知道了</a>'
								+'		</dd>'
								+'	</dl>'
								+'</div>'
					});
				});
			}
			
			return false;		
				
		});
		
		enterRefundCheck();
		
		// 输入时验证
		function enterRefundCheck()
		{
			commonFun.Message.enterStatus('#refundDescriptionForm');
			commonFun.Check.string('#refundOtherRsn', { type: 'string', selector: '#error-warning-selectReason', required: '退款理由为必填项', format: '退款理由不能超过10个字'});
			commonFun.Check.string('input[name=mobile]', { type: 'number', required: '寄件人手机号为必填项', format: '寄件人手机号格式错误'});
		}
		
		// 保存时验证
		function saveRefundCheck(num, allNum)
		{
			var result = true;
			var bMbl = true;
			
			var bNum = checkNum(num, allNum);
			var bSltRsn = checkReason();
			var bRsn = commonFun.Check.check('input[name=reason]', { type: 'string', required: '退货理由为必填项', format: '退货理由不能超过10个字'});
			var bMsg = commonFun.Check.check('textarea[name=description]', { type: 'string', required: '留言内容不能为空', format: '留言内容不能超过500个字'});
			
			if(oMobile[0])
			{
				bMbl = commonFun.Check.check('input[name=mobile]', { type: 'number', required: '寄件人手机号为必填项', format: '寄件人手机号格式错误'});
			}
			
			result = (bNum && bSltRsn && bRsn && bMbl && bMsg);
			
			return result;
		}
		
		// 退款数量验证
		function checkNum(num, allNum)
		{
			num = $.trim(num);
			
			if(num == '')
			{
				commonFun.Check.showError(oCount, '退款/退货数量为必填项');
				return false;
			}
			else if(num == 0 || !commonFun.Regular.isNumber(num))
			{
				commonFun.Check.showError(oCount, '退款/退货数量必须为大于0的整数');
				return false;
			}
			else if(num > allNum)
			{
				commonFun.Check.showError(oCount, '退款/退货数量不能超过购买数量');
				return false;
			}
			else
			{
				commonFun.Check.hideError(oCount);
				return true;
			}
			
			return true;
		}
		
		// 退货理由验证
		function checkReason()
		{
			var rsnIpt = $('input[name="selectReason"]');
			var val = rsnIpt.val();
			var sltRsn = $('#error-warning-selectReason');
			
			if(val < 0)
			{
				sltRsn.show().html('请选择退款理由');
				return false;
			}
			else
			{
				sltRsn.hide().html('');
			}
						
			return true;
		}
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 保存退款/退货留言
	------------------------------------------------------------------*/
	$('#refundMessage').on('click', function(){
		
		var bMsg = commonFun.Check.check('input[name=description]', { type: 'number', required: '留言内容不能为空', format: '留言内容不能超过500个字'});
		
		if(!bMsg)
		{
			return false;
		}
		
		var url = location.href;
		var parames = commonFun.Methods.parseUrl(url);
		var refundId = parames.id || '';
		var datas = {};
			datas[TOKEN_KEY] = TOKEN_VAL;
			datas.refundId = refundId;
			datas.content = $('.message-article[data-area=enterArea]').val();
			datas.attachments = UPLOAD_IMAGE_URI.join(',');
		
		$.ajax({
			type: 'POST',
			url: '/refund/saveMessage',
			data: datas,
			success: function(ajaxData)
			{
				var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
				
				if(ajaxData.code == 0)
				{
					location.reload();
				}
				else
				{
					$('#error-warning-description').html(ajaxData.msg);
				}
			}
		});
		
		return false;
		
	});
	
	/*------------------------------------------------------------------
	@Class: 提交物流信息
	------------------------------------------------------------------*/
	(function(){
		
		//填写物流信息
		var exContent = '<div class="clearfix">'
					   +'	<ul class="clearfix">'
					   +'		<li class="mt24 clearfix">'
					   +'			<label for="" class="w75 f13 lh36 fl">物流公司&nbsp;<span class="color-red">*</span></label>'
					   +'			<div class="plugs-select company-select fl" id="selectCompany">'
					   +'   			<div class="plugs-select-hd" data-state="databutton">'
					   +'        			<h6 class="plugs-select-title" data-id="-1" data-state="title" data-value="YTO">圆通快递</h6>'
					   +'       			 <div class="plugs-select-tip">'
					   +'            			<div class="plugs-select-tip"></div>'
					   +'        			</div>'
					   +'    			</div>'
					   +'    			<ul class="plugs-select-bd" data-state="datalist">'
					   +'        			<li class="plugs-select-option" data-state="option" data-id="YTO" data-value="YTO">圆通快递</li>'
					   +'        			<li class="plugs-select-option" data-state="option" data-id="ZTO" data-value="ZTO">中通快递</li>'
					   +'        			<li class="plugs-select-option" data-state="option" data-id="OTHER" data-value="OTHER">其他</li>'
					   +'    			</ul>'
					   +'				<input type="hidden" name="company" class="plugs-select-value " id="company" value="YTO" key="" />'
					   +'			</div>'
					   +'			<input type="text" name="company_other" class="textBox company-input-text hide" id="company_other" value="" />'
					   +'		</li>'
					   +'		'
					   +'		<li class="mt24 clearfix">'
					   +'			<label for="" class="w75 f13 lh36 fl">运单编号&nbsp;<span class="color-red">*</span></label>'
					   +'			<div class="fl">'
					   +'				<input type="text" name="count" id="dsn" class="textBox expr-text">'
					   +'			</div>'
					   +'		</li>'
					   +'		'
					   +'		<li class="mt24 clearfix">'
					   +'			<label for="" class="w75 f13 lh36 fl">寄回运费&nbsp;<span class="color-red">*</span></label>'
					   +'			<div class="fl">'
					   +'				<input type="text" name="count" id="dfee" class="textBox count-text">'
					   +'			</div>'
					   +'			<p class="pl12 lh36 fl"><a href="http://www.xidibuy.com/help/delivery#cost" target="_blank" class="color-blue">运费模板说明</a></p>'
					   +'		</li>'
					   +'		<li class="clearfix hide" id="error-warning-dfee"></li>'
					   +'		<li class="mt12 clearfix">'
					   +'			<label for="" class="w75 f13 lh36 fl">&nbsp;</label>'
					   +'			<p class="color-888 fl">为确保您的货物顺利送达，物流信息真实有效，<br>保持您的联系电话畅通</p>'
					   +'		</li>'
					   +'		'
					   +'		<li class="mt12 clearfix">'
					   +'			<label for="" class="w75 f13 lh36 fl">&nbsp;</label>'
					   +'			<div class="clearfix">'
					   +'				<a href="javascript:;" class="button-light-100 anim-all" data-type="submit">确定</a>'
					   +'				<a href="javascript:;" class="button-default-100 ml12 anim-all" data-type="close" data-action="close">取消</a>'
					   +'			</div>'
					   +'		</li>'
					   +'	</ul>'
					   +'</div>';

		// $('dt').attr('id','expressInfo')
		$('#expressInfo').on('click',function(e){
			
			$.block({
				title: '填写退货物流信息',
				content: exContent
			});

			$(document).on('keyup', '#dfee', function(){

				var _this = $(this);
				var nowVal = _this.val();

				var isNumber = $.isNumeric(nowVal);
				var dFeeNotice = $('#error-warning-dfee');

				if(!isNumber)
				{
					_this.addClass('border-red');
					dFeeNotice.html('请输入有效数字').show().addClass('color-red').css('padding-left','75px');
				}else{
					_this.removeClass('border-red');
					dFeeNotice.html('').hide();

				}

			});

			$('#selectCompany').selects({
				selects: $('input[name=company]').val(),
				callback: function(res)
				{
					// console.log(res)
					$('#company').data('code','')
					if(res.data_value=='OTHER'){
						$('#company_other').removeClass('hide');
					}else{
						$('#company_other').addClass('hide');
					}		
				}
			});

			$(document).on('click', '[data-type=submit]', function(){
				
				var datas = {};
					datas[TOKEN_KEY] = TOKEN_VAL;
					datas.id = $('#expressInfo').data('id');
					datas.companyCode = $('#company').val();
					datas.logisticsCompany = $('#company').val() == 'OTHER' ? $('#company_other').val() : $('#company').attr('key');
					datas.logisticsSn = $('#dsn').val();
					datas.freight = $('#dfee').val();
				
				$.ajax({
					type: 'POST',
					url: '/refund/saveLogistics',
					data: datas,
					dataType: 'json',
					success: function(ajaxData)
					{
						var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
						
						if(!ajaxData.code)
						{
							$.unblock();
							location.reload();
						}
						else
						{
							$.unblock(function(){
								
								$.block({
									title:'',
									content:'<div class="p24 f16">'+ajaxData.msg+'</div>'
								})
								
								$('[data-action=close]').bind('click', function(){
									
									$.unblock();
									
									return false;
									
								});
								
							});
						}
					},
					error: function()
					{
						//console.log('error');
					}
				});
				
				return false;
				
			});
			
			$(document).on('click', '[data-action=close]', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			return false;
			
		});
		
	})();
		
    module.exports = refund;
});