(function($){

    $.fn.color = function(options){

        var defaults = {

            "color":"#000"

        };

        var options = $.extend({},defaults,options);

        this.each(function(){

            $(this).css({"color":options.color});

        });

    }



})(jQuery);