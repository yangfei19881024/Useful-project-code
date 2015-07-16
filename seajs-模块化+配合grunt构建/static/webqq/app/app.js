define(function(require, exports, module) {

    var $ = require("jquery");
    var box = document.getElementById("box");
    var drag = require("../drag/drag");
    // console.log(drag);
    drag.drag(box);
});
