define(function(require,exports,module){
  function drag(obj){
    document.onmousedown = function(event){

      var startx = event.clientX - obj.offsetLeft;
      var starty = event.clientY - obj.offsetTop;

      document.onmousemove = function(event){

        var leftx = event.clientX - startx;
        var lefty = event.clientY - starty;

        var L = require("../range/range").range(leftx,document.documentElement.clientWidth-obj.offsetWidth,0);
        var T = require("../range/range").range(lefty,document.documentElement.clientHeight-obj.offsetHeight,0);

        obj.style.left = L + "px";
        obj.style.top = T + "px";

      }

      document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup = null;
      }

    }

  }

  exports.drag = drag;

})
