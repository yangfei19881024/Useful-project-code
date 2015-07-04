define("range/range", [], function(require, exports, module) {
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
