(function($){

  var methods = {

    init:function(options){

      var defaults = {
        name:"dname",
        age:10,
        sex:"female"
      };

      var settings = $.extend({},defaults,options);

      console.log(settings);
    },
    show:function(){
      console.log("show function");
    },
    hide:function(){
      console.log("hide function");
    }
  };


  $.fn.myPlugin = function(method){


    if( methods[method] ){ //是上面的方法

      return methods[method].apply(this,Array.prototype.slice(arguments,1));

    }else if ( typeof method === "object" ){

      return methods.init.call(this,arguments);

    }else{

      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );

    }

  }

})(jQuery)
