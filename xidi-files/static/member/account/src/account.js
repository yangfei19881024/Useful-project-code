define(function(require, exports, module){
	var account;
	
	var commonFun = require('{common}common.fun');
	var jQueryUi = require('{common}jquery-ui')($);
	var Plugs = require('{common}jquery.plugs')($);
	var avatorUpload = require('{common}avatorUpload');
		
	// 单选按钮
	$('.userSex-select[data-section=section]').checkButton({
		checkClass : 'radio',
		unCheckClass : 'unradio'
	});
	
	// 日期控件
	$('#profile-birthday').datetimepicker({
		format: 'yyyy-mm-dd',
		minView: 'month',
		autoclose: true
	});
	
	commonFun.Check.string('#profile-mobile', { type: 'number', required: '手机号码为必填项', format: '手机必须是11个长度数字'});
	commonFun.Check.string('#profile-email', { type: 'email', required: '邮箱为必填项', format: '邮箱格式填写错误'});
	
	/*------------------------------------------------------------------
	@Class: 保存个人基本信息
	------------------------------------------------------------------*/
	(function(){
		$('#saveUserInfo[data-action=saveUserInfo]').bind('click', function(){
			var datas = {};
				datas[TOKEN_KEY] = TOKEN_VAL;
				datas.name = $('input[name=name]').val();
				datas.mobile = $('#profile-mobile').val();
				datas.email = $('#profile-email').val();
				datas.sex = $('input[name=profile-sex]:checked').val();
				datas.birthday = $('#profile-birthday').val();
				datas.provinceId = $('#profile-province').val();
				datas.cityId = $('#profile-city').val();
				datas.areaID = $('#profile-district').val();
				datas.address = $('#profile-address').val();
				datas.postcode = $('#profile-zipcode').val();
				datas.tel = $('#profile-code').val() + '-' + $('#profile-tel').val() + '-' + $('#profile-ext').val();
			
			$.ajax({
				type: 'POST',
				url: '/Account/saveProfile',
				data: datas,
				dataType: 'json',
				success: function(ajaxData)
				{
					var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
					
					switch(ajaxData.code)
					{
						case 0:
							saveSuccess();
							break;
						case -10900:
						case -10901:
							$('#error-warning-mobile').html(ajaxData.msg);
							break;
						case -10902:
						case -10903:
							$('#error-warning-email').html(ajaxData.msg);
							break;
						default:
							saveFaild(ajaxData.msg);
					}
				}
			});
			
			return false;
		});
		
		function saveSuccess()
		{
			var content = '<p class="p24 f16 tc">基本信息保存成功！</p>';
			
			$.block({
				title: ' ',
				content: content
			});
			
			$('.plugs-close').bind('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			setTimeout(function(){
				
				$.unblock();
				
				location.reload();
				
			}, 2000);
		}
		
		function saveFaild(text)
		{
			var content = '<p class="p24 f16 tc">'+ text +'</p>';
			
			$.block({
				title: ' ',
				content: content
			});
			
			$('.plugs-close').bind('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			setTimeout(function(){
				
				$.unblock();
				
			}, 1000);
		}
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 绑定邮箱
	------------------------------------------------------------------*/
	(function(){
		// 验证身份 --> 获取短信验证码
		$('#addEmail-getCode').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldMobile',
				dataType: 'json',
				success: function(ajaxData)
				{
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
						isEnableGetCodeButton(oThis, '重新获取短信验证码');
					}
					else
					{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});
			
		});

		$('#addEmail-code').on('keyup',function(e){
			var state;
			var val = $(this).val();
			if(val.length==4){
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckMobileCode',
					data: {verifyCode:val},
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						//console.log(ajaxData);
						if(ajaxData.code == 0)
						{
							state = true;
							$('#error-warning-code').html('<i class="account-right"></i>');
						}
						else
						{
							$('#error-warning-code').html(ajaxData.msg);
						}
					}
				});
			}
			if(e.which == 13 && state && state == true){
				window.location.href = $('#addEmail-next').attr('href')
			}
		})
		
		
		// 验证身份 --> 验证短信验证码
		$('#addEmail-next').bind('click', function(){
			
			var mobileCode = $('#addEmail-code').val();
			var bRun = false;
			var datas = {};
				datas.verifyCode = mobileCode;
				
			if($('.account-right').length==1){
				bRun=true;
			}else{
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckMobileCode',
					data: datas,
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						//console.log(ajaxData);
						if(ajaxData.code == 0)
						{
							bRun = true;
						}
						else
						{
							$('#error-warning-code').html(ajaxData.msg);
						}
					}
				});
			}
			
			if(!bRun)
			{
				return false;
			}
		});

		$('#addNewEmail-next').keyup(function(e){
			if( e.which == 13 ){
				var email = $('#addNewEmail-email').val();
				var bRun = false;
				
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckEmail',
					data: {
						email: email
					},
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						if(ajaxData.code == 0)
						{
							window.location.href = $('#addNewEmail-next').attr('href')
						}
						else
						{	
							$('#cheNewEmail-email').addClass('border-red');
							$('#error-warning-email').html(ajaxData.msg).addClass('color-red').show();
						}
					}
				});
			}
		})
		
		// 设置邮箱地址 --> 邮箱格式验证
		$('#addNewEmail-next').bind('click', function(){
			
			var email = $('#addNewEmail-email').val();
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckEmail',
				data: {
					email: email
				},
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						bRun = true;
					}
					else
					{	
						$('#cheNewEmail-email').addClass('border-red');
						$('#error-warning-email').html(ajaxData.msg).addClass('color-red').show();
					}
				}
			});
			
			if(!bRun)
			{
				return false;
			}			
		});
		
		// 设置邮箱地址 --> 给邮箱发送激活信息
		$(window).load(function(){
			
			$('#adeNewEmailSend-activationEmail').trigger('click');
			
		});
		
		$('#adeNewEmailSend-activationEmail').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendNewEmail',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
					
						isEnableGetCodeButton(oThis, '重新发送');
					}
				}
			});
			
			return false;
		});
	})();
	
	/*------------------------------------------------------------------
	@Class: 绑定手机
	------------------------------------------------------------------*/
	(function(){
		// 验证身份 --> 给邮箱发送激活信息
		$(window).load(function(){
			
			$('#admOldEmailSend-activationEmail').trigger('click');
			
		});
		
		$('#admOldEmailSend-activationEmail').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldEmail',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
					
						isEnableGetCodeButton(oThis, '重新发送');
					}
				}
			});
			
			return false;
		});
		
		// 设置手机号码 --> 验证手机号
		$('#admNewMobile-mobile').bind('blur', function(){
			
			var datas = {};
				datas.mobile = $(this).val();
				
			ajaxCheckMobile(datas);
			
		});
		
		// 设置手机号码 --> 获取短信验证码
		$('#admNewMobile-getCode').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendNewMobile',
				data: {
					mobile: $('#admNewMobile-mobile').val()
				},
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
						isEnableGetCodeButton(oThis, '重新获取短信验证码');
					}
					else if(ajaxData.code == -1024 || ajaxData.code == -1021){

					}
					else{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});
			
			return false;
		});
		
		// 设置手机号码 --> 验证短信验证码
		$('#admNewMobile-code').bind('blur', function(){
			
			var datas = {};
				datas.mobile = $('#admNewMobile-mobile').val();
				datas.verifyCode = $(this).val();
				
			ajaxCheckMobileCode(datas);
			
		});

		$('#admNewMobile-code').bind('keyup',function(e){
			if(e.which==13){
				$("#admNewMobile-next").trigger('click');
			}
		})
		
		// 设置手机号码 --> 点击下一步按钮
		$('#admNewMobile-next').bind('click', function(){
			
			var datas = {};
				datas.mobile = $('#admNewMobile-mobile').val();
			
			if(!ajaxCheckMobile(datas))
			{
				return false;
			}
			
			datas.verifyCode = $('#admNewMobile-code').val();
			if(!ajaxCheckMobileCode(datas))
			{
				return false;
			}
			
			if(!ajaxSaveMobile(datas))
			{
				return false;
			}

			window.location.href = $(this).attr('href')
			
		});
		
		// 设置手机号码 --> 检验手机号码
		function ajaxCheckMobile(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckMobile',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					if(ajaxData.code == 0)
					{
						$('[name=mobile]').removeClass('border-red');
						$('#error-warning-mobile').removeClass('color-red').html('<i class="account-right"></i>').show();
						bRun = true;
					}
					else
					{
						$('[name=mobile]').addClass('border-red');
						$('#error-warning-mobile').html(ajaxData.msg).addClass('color-red').show();
					}
				}
			});
			
			return bRun;
		}
		
		// 设置手机号码 --> 保存手机号码
		function ajaxSaveMobile(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSaveMobile',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-mobile').html('');
						bRun = true;
					}
					else
					{
						$('#error-warning-mobile').html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
		
		// 设置手机号码 --> 验证短信验证码
		function ajaxCheckMobileCode(datas)
		{
			var bRun = false;
			if(datas.verifyCode==""){
				$('#error-warning-code').html('请输入验证码');
				$('[name-code]').addClass('border-red');
				return false;
			}else{
				$('#error-warning-code').html('');
				$('[name-code]').removeClass('border-red');
			}
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckMobileCode',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-code').html('');
						bRun = true;
					}
					else
					{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
	})();
	
	/*------------------------------------------------------------------
	@Class: 修改邮箱 --> 邮箱方式
	------------------------------------------------------------------*/
	(function(){
		// 验证身份 --> 给邮箱发送激活信息
		$(window).load(function(){
			
			$('#cheOldEmailSend-activationEmail').trigger('click');
			
		});
		
		$('#cheOldEmailSend-activationEmail').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldEmail',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
					
						isEnableGetCodeButton(oThis, '重新发送');
					}
				}
			});
			
			return false;
		});
		
	})();
	
	/*-------------------------------------------------------
	@Class: 修改邮箱 --> 手机方式
	-------------------------------------------------------*/
	(function(){
		// 身份验证 --> 获取短信验证码
		$('#cheOldMobile-getCode').bind('click', function(e){

			e.preventDefault();

			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldMobile',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
						isEnableGetCodeButton(oThis, '重新获取短信验证码');
					}
					else
					{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});

		});

		$('#cheOldMobile-code').on('keyup',function(e){
			var val = $(this).val();
			if(val.length==4){
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckMobileCode',
					data: {verifyCode:val},
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						//console.log(ajaxData);
						if(ajaxData.code == 0)
						{
							bRun = true;
							$('#error-warning-code').html('<i class="account-right"></i>')
						}
						else
						{
							$('#error-warning-code').html(ajaxData.msg);
						}
					}
				});
			}
			if(e.which == 13){
				$('#cheOldMobile-next').trigger('click');
			}
		})
		
		// 身份验证 --> 验证短信验证码
		$('#cheOldMobile-next').bind('click', function(){
			
			var mobileCode = $('#cheOldMobile-code').val();
			var bRun = false;
			var datas = {};
				datas.verifyCode = mobileCode;
			if($('.account-right').length==0){
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckMobileCode',
					data: datas,
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						//console.log(ajaxData);
						if(ajaxData.code == 0)
						{
							bRun = true;
						}
						else
						{
							$('#error-warning-code').html(ajaxData.msg);
						}
					}
				});
			}else{
				bRun=true;
			}
				
			
			if(!bRun)
			{
				return false;
			}
			
			window.location.href=$(this).attr('href')
		});
		
		// 设置新邮箱地址 --> 邮箱格式验证
		$('#cheNewEmail-next').bind('click', function(){
			
			var email = $('#cheNewEmail-email').val();
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckEmail',
				data: {
					email: email
				},
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						// $('#cheNewEmail-email').removeClass('border-red');
						// $('#error-warning-email').html('<i class="account-right"></i>').removeClass('color-red').show();
						bRun = true;
					}
					else
					{
						$('#cheNewEmail-email').addClass('border-red');
						$('#error-warning-email').html(ajaxData.msg).addClass('color-red').show();
					}
				}
			});
			
			if(!bRun)
			{
				return false;
			}			
		});
		
		// 设置新邮箱地址 --> 给邮箱发送激活信息
		$(window).load(function(){
			
			$('#cheNewEmailSend-activationEmail').trigger('click');
			
		});
		
		$('#cheNewEmailSend-activationEmail').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendNewEmail',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
					
						isEnableGetCodeButton(oThis, '重新发送');
					}
				}
			});
			
			return false;
		});
	})();
	
	/*------------------------------------------------------------------
	@Class: 修改手机 --> 邮箱方式
	------------------------------------------------------------------*/
	// 修改手机 --> 身份验证
	(function(){
		// 身份验证 --> 给邮箱发送激活信息
		
		$('#chmOldEmailSend-activationEmail').bind('click', function(e){

			e.preventDefault();

			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldEmail',
				dataType: 'json',
				success: function(ajaxData)
				{
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
					
						isEnableGetCodeButton(oThis, '重新发送');
					}
				}
			});
			
			return false;
		});

		$('#chmOldEmailSend-activationEmail').trigger('click');
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 修改手机 --> 手机
	------------------------------------------------------------------*/
	// 修改手机 --> 身份验证
	(function(){
		// 身份验证 --> 获取短信验证码
		$('#chmOldMobile-getCode').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldMobile',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
						isEnableGetCodeButton(oThis, '重新获取短信验证码');
					}
					
				}
			});
			
			return false;
		});
		
		// 身份验证 --> 验证短信验证码
		$('#chmOldMobile-code').bind('blur', function(){
			
			var datas = {};
				datas.verifyCode = $(this).val();
				
			ajaxCheckMobileCode(datas);
			
		});
		
		// 身份验证 --> 点击下一步按钮
		$('#chmOldMobile-activationEmail').bind('click', function(){
			
			var datas = {};
				datas.verifyCode = $('#chmOldMobile-code').val();
				
			if(!ajaxCheckMobileCode(datas))
			{
				return false;
			}
		});
		
		// 设置手机号码 --> 验证手机号
		$('#chmNewMobile-mobile').bind('blur', function(){
			
			var datas = {};
				datas.mobile = $(this).val();
				
			ajaxCheckMobile(datas);
			
		});
		
		// 设置手机号码 --> 获取短信验证码
		$('#chmNewMobile-getCode').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendNewMobile',
				data: {
					mobile: $('#chmNewMobile-mobile').val()
				},
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
						isEnableGetCodeButton(oThis, '重新获取短信验证码');
					}
					else if(ajaxData.code == -1024 || ajaxData.code == -1021){

					}
					else
					{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});
			
			return false;
		});
		
		// 设置手机号码 --> 验证短信验证码
		$('#chmNewMobile-code').bind('blur', function(){
			
			var datas = {};
				datas.mobile = $('#chmNewMobile-mobile').val();
				datas.verifyCode = $(this).val();
				
			ajaxCheckMobileCode(datas);
			
		});
		
		// 设置手机号码 --> 点击下一步按钮
		$('#chmNewMobile-next').bind('click', function(){
			
			var datas = {};
				datas.mobile = $('#chmNewMobile-mobile').val();
			
			if(!ajaxCheckMobile(datas))
			{
				return false;
			}
			
			datas.verifyCode = $('#chmNewMobile-code').val();
			if(!ajaxCheckMobileCode(datas))
			{
				return false;
			}
			
			if(!ajaxSaveMobile(datas))
			{
				return false;
			}
		});
		
		// 设置手机号码 --> 检验手机号码
		function ajaxCheckMobile(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckMobile',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					if(ajaxData.code == 0)
					{
						$('[name=mobile]').removeClass('border-red');
						$('#error-warning-mobile').removeClass('color-red').html('<i class="account-right"></i>').show();
						bRun = true;
					}
					else
					{
						$('[name=mobile]').addClass('border-red');
						$('#error-warning-mobile').html(ajaxData.msg).addClass('color-red').show();
					}
				}
			});
			
			return bRun;
		}
		
		// 设置手机号码 --> 保存手机号码
		function ajaxSaveMobile(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSaveMobile',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-mobile').html('');
						bRun = true;
					}
					else
					{
						$('#error-warning-mobile').html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
		
		// 设置手机号码 --> 验证短信验证码
		function ajaxCheckMobileCode(datas)
		{
			var bRun = false;

			if(datas.verifyCode==""){//空则不检查
				$('#error-warning-code').html('请输入验证码');
				$('[name-code]').addClass('border-red');
				return false;
			}else{
				$('#error-warning-code').html('');
				$('[name-code]').removeClass('border-red');
			}

			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckMobileCode',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-code').html('<i class="account-right"></i>');
						bRun = true;
					}
					else
					{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
	})();
	
	/*------------------------------------------------------------------
	@Class: 修改密码 --> 邮箱方式
	------------------------------------------------------------------*/
	(function(){
		// 验证身份 --> 给邮箱发送激活信息
		$(window).load(function(){
			
			$('#chpOldEmailSend-activationEmail').trigger('click');
			
		});
		
		$('#chpOldEmailSend-activationEmail').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldEmail',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
					
						isEnableGetCodeButton(oThis, '重新发送');
					}
				}
			});
			
			return false;
		});
		
	})();
	
	/*------------------------------------------------------------------
	@Class: 修改密码 --> 手机方式
	------------------------------------------------------------------*/
	(function(){		
		// 身份验证 --> 获取短信验证码
		$('#chpOldMobile-getCode').bind('click', function(){
			
			var oThis = $(this);
			var sDisabledClass = 'button-default-disabled';
			
			if(oThis.hasClass(sDisabledClass))
			{
				return false;
			}
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSendOldMobile',
				dataType: 'json',
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						oThis.addClass(sDisabledClass);
						isEnableGetCodeButton(oThis, '重新获取短信验证码');
					}
					else
					{
						$('#error-warning-code').html(ajaxData.msg);
					}
				}
			});
			
			return false;
		});
		
		$('#chpOldMobile-ode').on('keyup',function(e){
			var val = $(this).val();
			var state;
			if(val.length==4){
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckMobileCode',
					data: {verifyCode:val},
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						//console.log(ajaxData);
						if(ajaxData.code == 0)
						{
							bRun = true;state=true;
							$('#error-warning-code').html('<i class="account-right"></i>')
						}
						else
						{
							$('#error-warning-code').html(ajaxData.msg);
						}
					}
				});
			}

			if(e.which == 13){
				if(state && state == true){
					window.location.href=$('#chpOldMobile-next').attr('href')
				}
			}
		})

		// 身份验证 --> 验证短信验证码
		$('#chpOldMobile-next').bind('click', function(){
			
			var mobileCode = $('#chpOldMobile-ode').val();
			var bRun = false;
			var datas = {};
				datas.verifyCode = mobileCode;
			if($('.account-right').length==1){
				bRun=true;
			}else{
				$.ajax({
					type: 'POST',
					url: '/safeajax/ajaxCheckMobileCode',
					data: datas,
					dataType: 'json',
					async: false,
					success: function(ajaxData)
					{
						//console.log(ajaxData);
						if(ajaxData.code == 0)
						{
							bRun = true;
						}
						else
						{
							$('#error-warning-code').html(ajaxData.msg);
						}
					}
				});
			}
			
			
			if(!bRun)
			{
				return false;
			}
			
		});
		
		// 设置新登录密码 --> 验证旧密码
		$('#chpNewPw-oldPass').bind('blur', function(){
			
			var datas = {};
				datas.oldPw = $(this).val();
			
			ajaxCheckOldPw(datas);
			
		});
		
		// 设置新登录密码 --> 验证设置新密码
		$('#chpNewPw-newPass').bind('blur', function(){
			
			var datas = {};
				datas.pw = $(this).val();
				datas.repw = $('#chpNewPw-reNewPass').val();
			
			ajaxCheckNewPw(datas);
			
		});
		
		// 设置新登录密码 --> 验证确认新密码
		$('#chpNewPw-reNewPass').bind('blur', function(){
			
			var datas = {};
				datas.pw = $('#chpNewPw-newPass').val();
				datas.repw = $(this).val();
			
			ajaxCheckNewPw(datas);
			
		});
		$('#chpNewPw-reNewPass').bind('keyup', function(e){
			if(e.which == 13){
				var oldDatas = {};
				var newDatas = {};
					oldDatas.oldPw = $('#chpNewPw-oldPass').val();
				
				if(!ajaxCheckOldPw(oldDatas))
				{
					return false;
				}
				
				newDatas.pw = $('#chpNewPw-newPass').val();
				newDatas.repw = $('#chpNewPw-reNewPass').val();
				if(!ajaxCheckNewPw(newDatas))
				{
					return false;
				}
				
				if(!ajaxSavePw(newDatas))
				{
					return false;
				}
				window.location.href=$('#chpNewPw-submit').attr('href')
			}
		});
		
		// 设置新登录密码 --> 点击下一步按钮
		$('#chpNewPw-submit').bind('click', function(e){
			
			e.preventDefault();

			var oldDatas = {};
			var newDatas = {};
				oldDatas.oldPw = $('#chpNewPw-oldPass').val();

			if(!ajaxCheckOldPw(oldDatas))
			{
				return false;
			}
			
			newDatas.pw = $('#chpNewPw-newPass').val();
			newDatas.repw = $('#chpNewPw-reNewPass').val();
			if(!ajaxCheckNewPw(newDatas))
			{
				return false;
			}
			
			if(!ajaxSavePw(newDatas))
			{
				return false;
			}
			
			window.location.href=$(this).attr('href');
		});
		
		// 设置新登录密码 --> 旧密码
		function ajaxCheckOldPw(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckOldPw',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-oldPass').hide().html('');
						bRun = true;
					}
					else
					{
						$('#error-warning-oldPass').show().html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
		
		// 设置新登录密码 --> 设置新密码
		function ajaxCheckNewPw(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxCheckNewPw',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-newPass').hide().html('');
						bRun = true;
					}
					else
					{
						$('#error-warning-newPass').show().html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
		
		// 设置新登录密码 --> 保存新密码
		function ajaxSavePw(datas)
		{
			var bRun = false;
			
			$.ajax({
				type: 'POST',
				url: '/safeajax/ajaxSavePw',
				data: datas,
				dataType: 'json',
				async: false,
				success: function(ajaxData)
				{
					//console.log(ajaxData);
					
					if(ajaxData.code == 0)
					{
						$('#error-warning-newPass').hide().html('');
						bRun = true;
					}
					else
					{
						$('#error-warning-newPass').show().html(ajaxData.msg);
					}
				}
			});
			
			return bRun;
		}
	})();
	
	
	// 禁用/启用 获取验证码按钮
	function isEnableGetCodeButton(obj, str)
	{
		var getCodeTimer = null;
		var allTime = 60;
		
		getCodeTimer = setInterval(function(){
			
			allTime--;
			
			if(allTime == 0)
			{
				clearInterval(getCodeTimer);
				obj.removeClass('button-default-disabled').text(str);
			}
			else
			{
				obj.text(allTime + '秒之后重新获取');
			}
			
		}, 1000);
	}
	
    module.exports = account;
});