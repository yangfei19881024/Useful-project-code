/*
 * @jQuery version : v1.11.1
 *
 */
define(function(require, exports, module){
	return function($){
		
		$.extend({
			lazy_defaults: 
			{
				lazyload: 'img[data-class="lazyload"]',
			},
			
			lazy_config:
			{
				windows: $(window),
			},
			
			lazy_init: function(opts)
			{
				var opts = $.extend({}, $.lazy_defaults, opts || {});
				
				$.lazy_loadImg(opts.lazyload);
				
				// 滚动滚动条
				$.lazy_config.windows.on('scroll', function(){
					
					$.lazy_loadImg(opts.lazyload);
					
				}).on('resize', function(){
					
					$.lazy_loadImg(opts.lazyload);
					
				});
			},
			
			lazy_loadImg: function(aImg)
			{
				var aImg = (typeof aImg == 'string') ? $(aImg) : aImg;
				var viewImg = $.lazy_getImg(aImg);
				
				for(var i = 0, len = viewImg.length; i < len; i ++)
				{
					var currentImg = viewImg[i];
					
					$.lazy_setImg(currentImg);
				}
			},
			
			lazy_getImg: function(aImg)
			{
				var resultImg = [];
				var screenHeight = $.lazy_config.windows.height();
				var scrollTop = $.lazy_config.windows.scrollTop();
				
				aImg.each(function(index, element) {
					
					var _this = $(this);
					var lazy = _this.attr('data-class');
					var offsetHeight = _this.height();
					var offsetTop = _this.offset().top;
					var viewArea = (scrollTop + screenHeight) - offsetTop;
					var hiddenArea = scrollTop - (offsetTop + offsetHeight);
					
					if(viewArea > 20 && lazy === 'lazyload'/* && hiddenArea <= 0*/)
					{
						resultImg.push(_this);
					}
					
				});
				
				return resultImg;
			},
			
			lazy_setImg: function(currentImg)
			{
				if(!currentImg) return false;
				
				var currentImg = (typeof currentImg == 'string') ? $.parseJSON(currentImg) : currentImg;
				var lazy = currentImg.attr('data-class');
				var src = currentImg.attr('data-image');
				
				if(lazy !== 'lazyload') return false;
				
				if(src)
				{
					//var image = new Image();
					//	image.src = src;
					
					//image.onload = function ()
					//{
						currentImg.attr('src', src).removeAttr('data-image').removeAttr('data-class').css({ opacity: 0}).animate({ opacity: 1});
					//}
				}
			}
		});
	};
});