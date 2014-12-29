define(function(require, exports, module){
    var pictureUpload = {};
	
	var commonFun = require('{common}common.fun');
	
	/*------------------------------------------------------------------
	@Class: 头像上传
	------------------------------------------------------------------*/
	(function(){
		var oUserAvator = $('#userAvator');
		var oUserAvatorState = $('.userAvator-state', oUserAvator);
		var state = oUserAvator.attr('data-state');
		var systemIndex = 0;
		var nowAvator = '';
		var uploadAvatorButton = '';
		var avatorPlaceHolder = '';
		
		// 鼠标滑过头像区域
		oUserAvator.bind('mouseenter', function(){
			
			nowAvator = $(this).attr('data-image');
			
			systemIndex = $(this).attr('data-systemIndex');
			systemIndex = systemIndex + '';
			systemIndex = systemIndex == 'undefined' ? -1 : systemIndex;
			
			avatorPlaceHolder = '<img src="'+ nowAvator +'" width="312" height="312" data-class="imagePreview" />';
			
			oUserAvatorState.removeClass('hide');
			
			if(state == 'default' && systemIndex < 0)
			{
				oUserAvatorState.html('上传头像');
				
				uploadAvatorButton = '<div class="uploadAvator-button uploadAvator-addButton table pa" data-class="uploadAvatorButton" data-state="default">'
						 			+'	<div class="table-cell f14 tc">'
						 			+'		<div class="icon-add-button sprites"></div>'
						 			+'		<p class="mt24 color-888">请选择上传图像</p>'
						 			+'	</div>'
						 			+'</div>';
			}
			else if(state == 'upload' || systemIndex >= 0)
			{
				oUserAvatorState.html('编辑头像');
				
				uploadAvatorButton = '<div class="uploadAvator-button uploadAvator-editButton table pa hide" data-class="uploadAvatorButton" data-state="upload">'
						 			+'	<div class="table-cell f14 tc">'
						 			+'		<div class="icon-edit-button sprites"></div>'
						 			+'		<p class="mt24 color-white">编辑头像</p>'
						 			+'	</div>'
						 			+'</div>';
			}
			
		}).bind('mouseleave', function(){
			
			oUserAvatorState.addClass('hide').html('');
			
		});
		
		// 鼠标单击头像区域
		oUserAvator.bind('click', function(){
			
			var title = '上传头像';
			var content = '	<div class="ml12 clearfix" style="width:638px;">'
						 +'		<p class="ptb12 color-888">仅支持JPG、GIF、PNG图片文件，且文件在312 X 312px以上并小于5M，建议使用正方形图片 </p>'
						 +'		<div class="upload-avator clearfix">'
						 +'			<div class="uploadAvator-view pr fl">'
						 +'				<div id="uploadAvator-oper-box">'
						 +					uploadAvatorButton	
						 +'				</div>'					 
						 +'				<form name="upLoadImageForm" action="" method="POST" enctype="multipart/form-data" target="upframe">'
						 +'					<input type="file" name="FILES" class="uploadAvator-fileUpload pa" data-action="upLoadImageButton" />'
						 +'					<input type="hidden" name="token" value="">'
						 +'					<input type="hidden" name="getTokenType" value="1">'
						 +'					<input type="hidden" name="callback" value="parent.upCallback">'
						 +'				</form>'
						 +'				<iframe id="upframe" name="upframe" src="" class="hide"></iframe>'
						 +'				<div class="uploadAvator-button table pr">'
						 +'					<div class="userAvatorBox table-cell tc">'
						 +						avatorPlaceHolder
						 +'					</div>'
						 +'				</div>'
						 +'			</div>'
						 +'			<div class="uploadAvator-list fr">'
						 +'				<h6 class="f16">推荐头像</h6>'
						 +'				<ul class="uploadAvator-system clearfix">'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_01.jpg" data-systemIndex="0">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_01.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_02.jpg" data-systemIndex="1">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_02.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_03.jpg" data-systemIndex="2">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_03.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_04.jpg" data-systemIndex="3">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_04.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_05.jpg" data-systemIndex="4">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_05.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_06.jpg" data-systemIndex="5">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_06.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_07.jpg" data-systemIndex="6">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_07.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_08.jpg" data-systemIndex="7">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_08.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_09.jpg" data-systemIndex="8">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_09.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_10.jpg" data-systemIndex="9">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_10.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_11.jpg" data-systemIndex="10">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_11.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'					<li class="uploadAvator-item mt12 mr12 fl" data-image="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_12.jpg" data-systemIndex="11">'
						 +'						<img src="'+ JS_DOMAIN +'static/global/images/1.0.0/avator_12.jpg" width="60" height="60" />'
						 +'						<div class="uploadAvator-border hide pa">'
						 +'							<div class="uploadAvator-select sprites pa"></div>'
						 +'						</div>'
						 +'					</li>'
						 +'				</ul>'
						 +'			</div>'
						 +'		</div>'
						 +'	</div>'
						 +'	<div class="mt36 mb12 ml12 clearfix">'
						 +'		<a href="javascript:;" class="button-light-100 anim-all" data-action="save">保存</a>'
						 +'		<span class="ml24 color-red" data-class="uploadAvatorError"></span>'
						 +'	</div>';
			
			$.block({
				title: title,
				content: content
			});
			
			var UPLOAD_IMAGE_URI = commonFun.Methods.uploadImage('[data-class=uploadAvatorError]');
			var oAvatorOperBox = $('#uploadAvator-oper-box');
			var oAvatorViewPlaceHolder = $('#userAvatorBox > img');
			var oImagePreview = $('[data-class=imagePreview]');
			
			uploadArea();
			
			selectSystemAvator();
			
			$('[data-action=upLoadImageButton]').bind('change', function(){
				
				oImagePreview.attr('data-systemIndex', '').attr('data-state', 'upload');
				
			});
			
			// 保存头像
			$('[data-action=save]').die().live('click', function(){
				
				var datas = {};
					datas[TOKEN_KEY] = TOKEN_VAL;
					datas.icon = oImagePreview.attr('src');
					datas.systemIndex = oImagePreview.attr('data-systemIndex');
					datas.state = oImagePreview.attr('data-state');
				
				$.ajax({
					type: 'POST',
					url: '/Account/saveTopImg',
					data: datas,
					dataType: 'json',
					success: function(ajaxData)
					{
						var ajaxData = (typeof ajaxData == 'string') ? $.parseJSON(ajaxData) : ajaxData;
						
						if(ajaxData.code == 0)
						{
							oUserAvator.attr('data-systemIndex', datas.systemIndex).attr('data-image', datas.icon).attr('data-state', datas.state);
							$('#topImg').attr('src', datas.icon);
							
							$.unblock(function(){
								
								saveTopImgNotice('头像保存成功');
								
							});
						}
						else
						{
							$.unblock(function(){
								
								saveTopImgNotice(ajaxData.msg);
								
							});
						}
					}
				});
				
				return false;
				
			});
			
			// 关闭头像上传模块
			$('.plugs-close').live('click', function(){
				
				$.unblock();
				
				return false;
				
			});
			
			// 鼠标滑过上传区域，依据当前用户头像是否是自定义头像，从而显示不同的上传按钮
			function uploadArea()
			{
				var oUploadAvatorView = $('.uploadAvator-view');
				var oUploadAvatorButton = $('[ data-class=uploadAvatorButton]', oUploadAvatorView);
				var nowState = oUploadAvatorButton.attr('data-state');
				
				oUploadAvatorView.bind('mouseenter', function(){
					
					if(nowState == 'upload')
					{
						oUploadAvatorButton.removeClass('hide');
					}
					
				}).bind('mouseleave', function(){
					
					if(nowState == 'upload')
					{
						oUploadAvatorButton.addClass('hide');
					}
					
				});
			}
			
			// 选取系统推荐头像
			function selectSystemAvator()
			{
				var aSystemList = $('.uploadAvator-system > .uploadAvator-item');
				
				if(state == 'default' && systemIndex >= 0)
				{
					var tempButton = aSystemList.eq(systemIndex);
					var image = tempButton.attr('data-image');
					tempButton.addClass('uploadAvator-current');
					oImagePreview.attr('src', image).attr('data-systemIndex', systemIndex);
				}
				
				aSystemList.bind('click', function(){
					
					var oThis = $(this);
					var image = oThis.attr('data-image');
					var systemIndex = oThis.attr('data-systemIndex');
					
					oThis.addClass('uploadAvator-current').siblings().removeClass('uploadAvator-current');
					
					oImagePreview.attr('src', image).attr('data-systemIndex', systemIndex).attr('data-state', 'default');
					
					editOperBoxHtml();
					
					return false;
					
				});
				
				function editOperBoxHtml()
				{
				
					var content = '<div class="uploadAvator-button uploadAvator-editButton table pa hide" data-class="uploadAvatorButton" data-state="upload">'
								  +'	<div class="table-cell f14 tc">'
								  +'		<div class="icon-edit-button sprites"></div>'
								  +'		<p class="mt24 color-white">编辑头像</p>'
								  +'	</div>'
								  +'</div>';
								  
					oAvatorOperBox.html(content);
					
					uploadArea();
				}
			}
			
			// 保存头像时的提示
			function saveTopImgNotice(msg)
			{
				$.block({
					title: ' ',
					content: '<div class="pr12 clearfix">'
							+'	<div class="clearfix">'
							+'		<div class="icon-success-36 sprites fl"></div>'
							+'		<div class="pl12 f18 lh36 fl">'+ msg +'</div>'
							+'	</div>'
							+'</div>'
				});
				
				var sendTimer = setTimeout(function(){
					
					$.unblock();
					clearTimeout(sendTimer);
					
				}, 1500);
				
				$('[data-action=sendAfterNotice]').live('click', function(){
					
					clearTimeout(sendTimer);					
					$.unblock();
					
					return false;
					
				});
			}
			
			return false;
			
		});
	})();
	
    module.exports = pictureUpload;
});