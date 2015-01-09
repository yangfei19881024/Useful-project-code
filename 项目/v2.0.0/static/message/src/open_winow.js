define(function(require,exports,module){

	(function($){

		$(".dialog-btn").click(function(){

			$(this).next(".dialog-list").show();

		});

		$(".dialog-list ul").on("click","a",function(){
			
			var winWidth = document.documentElement.clientWidth||document.body.clientWidth;
            var winHeight = document.documentElement.clientHeight||document.documentElement.clientHeight;

            var newWin_left = (winWidth - 1000)/2;
            var newWin_top = (winHeight - 600) /2;

            //登录窗口

            /*window.open('../../apps/message/login.html',
                        '正在接通客服',
                        'height=600,width=980,top='+newWin_top+',left='+newWin_left+',' +
                        'toolbar=yes,menubar=no,scrollbars=no, ' +
                        'resizable=no,location=no, status=no'
            );*/

            //商家聊天窗口
            window.open('../../apps/message/message.html',
                        '正在接通客服',
                        'height=600,width=980,top='+newWin_top+',left='+newWin_left+',' +
                        'toolbar=yes,menubar=no,scrollbars=no, ' +
                        'resizable=no,location=no, status=no'
            );

		});

		$(".collspan").click(function(){
			$(this).parents(".dialog-list").hide();
		});

	})(jQUery);

});