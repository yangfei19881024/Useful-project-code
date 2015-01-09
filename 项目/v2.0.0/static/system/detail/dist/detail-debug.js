define("static/system/detail/2.0.0/detail-debug", [ "static/global/common/2.0.0/lazyload-debug", "static/global/common/2.0.0/dialog-debug", "static/global/common/2.0.0/slider-debug" ], function(require, exports, module) {
    var detail;
    require("static/global/common/2.0.0/lazyload-debug.js")($);
    require("static/global/common/2.0.0/dialog-debug.js")($);
    require("static/global/common/2.0.0/slider-debug.js")($);
    /*var CATE = require('static/global/common/src/category.fun.js');
	
	CATE.Events.detailSelectedAttr('#detail-goods-info');
	
	CATE.Events.clickAddCartButton('.add-cart-button');
	
	CATE.Events.clickFavoriteButton('[data-class="favorite"]', '#detail-share');*/
    // 当日汇率
    $(".detail-rmb-icon").on("mouseover", function() {
        $(this).next().show();
    }).on("mouseout", function() {
        $(this).next().hide();
    });
    // 分享
    (function() {
        var oDetailShareBox = $("#detail-share-box");
        var timer = null;
        $("#show-share").on("mouseover", function() {
            timer = setTimeout(function() {
                oDetailShareBox.animate({
                    marginLeft: -110
                }, 200);
            }, 100);
        }).on("mouseout", function() {
            clearTimeout(timer);
        });
        $("#detail-share-list").on("mouseleave", function() {
            oDetailShareBox.animate({
                marginLeft: 0
            }, 200);
        });
    })();
    // 商品介绍
    $("#detail-goods-more-button").on("click", function() {
        var _this = $(this);
        _this.toggleClass("detail-goods-more-show").toggleClass("detail-goods-more-hide");
        $("#detail-goods-prop-box .detail-goods-prop:gt(5)").toggle();
    });
    // 更多商品切换
    $(".relate-products").slider({
        arrowsClass: "relate-arrow",
        arrowsCurrent: "relate-arrow-current",
        numbers: true,
        duration: 500
    });
    // 图片懒加载
    $.lazy_init();
    // 查看大图
    $(".detail-country-photo-list img").on("click", function() {
        var _this = $(this);
        $.dialog_block({
            clickObj: _this,
            title: " ",
            imagelist: ".detail-country-photo-list img",
            isFixed: false
        });
    });
    module.exports = detail;
});
