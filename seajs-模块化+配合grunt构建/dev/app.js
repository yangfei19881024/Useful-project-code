define("app", [ "./drag", "./range" ], function(require, exports, module) {
    var box = document.getElementById("box");
    var drag = require("./drag");
    // console.log(drag);
    drag.drag(box);
});

define("drag", [ "./range" ], function(require, exports, module) {
    function drag(obj) {
        document.onmousedown = function(event) {
            var startx = event.clientX - obj.offsetLeft;
            var starty = event.clientY - obj.offsetTop;
            document.onmousemove = function(event) {
                var leftx = event.clientX - startx;
                var lefty = event.clientY - starty;
                var L = require("./range").range(leftx, document.documentElement.clientWidth - obj.offsetWidth, 0);
                var T = require("./range").range(lefty, document.documentElement.clientHeight - obj.offsetHeight, 0);
                obj.style.left = L + "px";
                obj.style.top = T + "px";
            };
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }
    exports.drag = drag;
});

define("range", [], function(require, exports, module) {
    function range(val, max, min) {
        if (val >= max) {
            val = max;
        } else if (val <= min) {
            val = min;
        } else {
            val = val;
        }
        return val;
    }
    exports.range = range;
});
