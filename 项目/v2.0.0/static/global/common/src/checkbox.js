define(function(require, exports, module){
	return function($){
		
		$.fn.checkbox = function(options)
		{
			return $.fn.checkButton.defaults = {
				checkClass	 : 'checkbox',
				unCheckClass : 'uncheckbox',
				type 		 : 'checkbox',
				callback	 : null
			},
			
			this.each(function(){
				var opts = $.extend({}, $.fn.checkButton.defaults, options),
					self = $(this),
					button = $('[data-type=checkbox-radio]', self),
					checkClass = opts.checkClass,
					unCheckClass = opts.unCheckClass,
					callback = opts.callback;
				
				var methods = {};
				
				button.each(function() {
                    
					if($(this).hasClass(checkClass))
					{
						$(this).find('input').attr('checked', true);
					}
					
                });
				
				button.bind('click', function(){
					
					var oThis = $(this);
					var oInput = oThis.find('input');
					var type = oInput.attr('type');
					
					if(type == 'checkbox')
					{
						if(oThis.hasClass(unCheckClass))
						{
							oThis.removeClass(unCheckClass).addClass(checkClass);
							oInput.attr('checked', true);
						}
						else
						{
							oThis.addClass(unCheckClass).removeClass(checkClass);
							oInput.attr('checked', false);
						}
					}
					else if(type == 'radio')
					{
						var aInput = button.find('input');
						
						button.addClass(unCheckClass).removeClass(checkClass);
						aInput.attr('checked', false);
						
						oThis.removeClass(unCheckClass).addClass(checkClass);
						oInput.attr('checked', true);
					}
					else
					{
						return;
					}
					
					callback && callback(oThis);
				}).bind('focus', function(){
					
					var _this = $(this);
					
					_this.bind('keypress', function(ev){
						
						if(ev.keyCode == 32)
						{
							_this.click();
						}
						
						return false;
						
					});
					
				});
				
			});
		};
		
	};
});