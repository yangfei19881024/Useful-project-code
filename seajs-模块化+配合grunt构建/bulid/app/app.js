define("app/app", [ "../drag/drag", "../range/range" ], function(require, exports, module) {
    var box = document.getElementById("box");
    var drag = require("../drag/drag");
    // console.log(drag);
    drag.drag(box);
});
