define(function(require,exports,module){

	require("jquery");

	(function($){

		$.fn.lazyload = function(opts){

			var defaults = {
				container:"box"
			}

			var options = $.extend({},defaults,opts||{});


			this.each(function(){

				var $this = $(this);

				var $window = $(window);

				var $images =  $this.find("image");

				var $lis = $this.find("li");

				var count = 0;

				var ajaxState = true;
				
				window.onscroll = function(){
                
                   if( count < 4 ){
                       if( ajaxState && scrollStates($lis) ){

						  ajaxState = false;

                           $.ajax({
                               type:"post",
                               dataType:"json",
                               url:"index.php",
                               data:{"count":count++},
                               beforeSend:function(){

                                  var $lastItem = $(".box").find("li").last();
                                  var load = '<p class="loading"><span>数据正在加载中..</span></p>';

                                  $("body").append(load);

                                  $(".loading").css({
                                      "position":"absolute",
                                      "top":($lastItem.outerHeight() + $lastItem.offset().top + 20)
                                  });
                               },
                               success:function(data){
                                    var scollTop = $(window).scrollTop();
                                    var str = "";
                                    for( var i=0;i<data.length;i++ ){

                                        str += '<li class="item new_add">'
                                            +    '<a href="javascript:;">'
                                            +       '<img src="'+data[i].src+'" alt=""/>'
                                            +    '</a>'
                                            +   '</li>';
                                    }

                                   $(".box ul").append(str);

                                   $(".new_add img").animate({"opacity":1},1000); //新加载的元素动画效果

                                   //$(window).scrollTop( $(".box li").outerHeight()*2 + scollTop );

                               },
                               complete:function(){
                                   $(".loading").remove();
                                   ajaxState = true;

                                   if(count == 3){
                                       $(".page").show();
                                   }

                               }
                           });

                       }
                   }

               }



			});

			var scrollStates = function(lis){

				var oLi = lis;

				var $lastItem = oLi.last();

                var lastItemH = $lastItem.outerHeight() + $lastItem.offset().top;

                var clientH = $(window).height() + $(window).scrollTop();

                return (lastItemH < clientH)?true:false;


			}

		}


	})(jQuery)


	


});