define("app/app", [ "jquery", "../drag/drag", "../range/range" ], function(require, exports, module) {
    var $ = require("jquery");
    alert($);
    var box = document.getElementById("box");
    var drag = require("../drag/drag");
    // console.log(drag);
    drag.drag(box);
});
