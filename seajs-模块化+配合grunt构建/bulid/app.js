define("app", [ "./drag", "./range" ], function(require, exports, module) {
    var box = document.getElementById("box");
    var drag = require("./drag");
    // console.log(drag);
    drag.drag(box);
});
