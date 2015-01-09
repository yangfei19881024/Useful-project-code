define(function(require,exports,module){

    (function($){

        //var $chat_msg = $("#richEditor");
        
        $chat_msg.on("keyup",function(ev){

            var $this = $(this);

            var txt = $.trim($this.val());

            var ev = ev||window.event;

            if( txt != '' ){
                $this.siblings("#btnPost").removeClass("btn_post_none").addClass("btn_post");
                

                if( ev.keyCode == 13 ) {
                    sendMsg(txt,function(){
                        $this.val("");
                        $this.siblings("#btnPost").removeClass("btn_post").addClass("btn_post_none");
                    });
                }
            }
        });

        $("#btnPost").on("click",function(){
            var $this = $(this);
            var txt = $.trim($this.siblings("#richEditor").val());

            if( txt !='' ){
                sendMsg(txt,function(){
                    $this.siblings("#richEditor").val("");
                    $this.removeClass("btn_post").addClass("btn_post_none");
                });
            }

        });

        var sendMsg = function(msg,callback){

            var dateTime = getDateTime();

            var msg_box =    '<div class="talk_b">'
                            +   '<p class="post_date">'+dateTime.time_str+'&nbsp;&nbsp;'+dateTime.apm+'</p>'
                            +   '<div class="text">'
                            +       '<i class="corner"></i>'+msg+''
                            +   '</div>'
                            + '</div>';

            $(".im_messageBox").append(msg_box);

            //$(".talk_box").scrollTop(200)

            var wrap_h = $(".im_messageBox").outerHeight();

            $(".talk_box").scrollTop(wrap_h - 400);

            callback&&callback();
        }

        var getDateTime = function(){

            var date = new Date();

            var hour = formatDate(date.getHours(),2);
            var min = formatDate(date.getMinutes(),2);
            var sec = formatDate(date.getSeconds(),2);

            var comma = ":";

            var time_str = hour+comma+min+comma+sec;

            if( hour>0 && hour<12 ){
                var apm = "上午";
            }else{
                var apm = "下午";
            }

            return{
               time_str:time_str,
               apm:apm 
            }

        }

        var formatDate = function(str,num){
            str=""+str;
            while( str.length < num ){
                str="0"+str;
            }

            return str;
        }

    })(jQuery)

});