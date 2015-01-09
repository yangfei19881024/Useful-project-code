/*
 * @jQuery version : v1.11.1
 *
 */
define("static/global/common/2.0.0/dialog-debug", [], function(require, exports, module) {
    return function($) {
        $.extend({
            // 默认参数配置
            dialog_defaults: {
                title: "Title",
                imagelist: 'img[data-class="lightbox"]',
                isFixed: true,
                hideCloseButton: false,
                content: null,
                callback: null
            },
            // 全局变量
            dialog_config: {
                windows: $(window),
                lightbox: '.dialog-lightbox[data-class="dialog-lightbox"]',
                section: '.dialog-lightbox-section[data-class="dialog-lightbox-section"]',
                imageTag: '.dialog-lightbox-list-image[data-class="dialog-lightbox-list-image"]',
                imageData: {},
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                paddingWidth: 0,
                paddingHeight: 0
            },
            dialog_block: function(opts) {
                if (opts.content) {
                    $.dialog_dialog(opts);
                } else {
                    $.dialog_lightbox(opts);
                }
                // 改变浏览器大小时，动态改变内容显示盒子的位置
                $.dialog_config.windows.on("resize", function() {
                    $.dialog_settings($.dialog_config.section);
                });
                // 关闭弹层
                $('.dialog-lightbox-close[data-class="dialog-lightbox-close"]').on("click", function() {
                    $.dialog_unblock();
                });
            },
            dialog_unblock: function() {
                var oLightBox = $($.dialog_config.lightbox);
                var oSection = $($.dialog_config.section);
                if ($.dialog_defaults.isFixed) {
                    oSection.animate({
                        marginTop: -($.dialog_config.top - 150),
                        opacity: 0
                    });
                } else {
                    oSection.animate({
                        top: $.dialog_config.top + 150,
                        opacity: 0
                    });
                }
                oLightBox.fadeOut(function() {
                    oLightBox.remove();
                    oSection.remove();
                });
            },
            dialog_dialog: function(opts) {
                $.dialog_install(opts);
                $.dialog_settings($.dialog_config.section, true, true);
            },
            dialog_lightbox: function(opts) {
                var clickObj_src = opts.clickObj.attr("data-src");
                $.dialog_config.now = 0;
                $.dialog_install(opts);
                $.dialog_getImages_src($.dialog_defaults.imagelist);
                $.dialog_loadImage(clickObj_src, true, $.dialog_settings);
                $.dialog_getNow(clickObj_src);
                $('.dialog-lightbox-prev[data-class="dialog-lightbox-prev"]').on("click", function() {
                    $.dialog_switchImage(false, false);
                });
                $('.dialog-lightbox-next[data-class="dialog-lightbox-next"]').on("click", function() {
                    $.dialog_switchImage(true, false);
                });
            },
            dialog_install: function(opts) {
                $.dialog_defaults = $.extend({}, $.dialog_defaults, opts || {});
                var oBody = $("body");
                var dialog_light_close = "";
                if (!$.dialog_defaults.content) {
                    var content = '<div class="dialog-lightbox-list" data-class="dialog-lightbox-list">' + '	<img src="" class="dialog-lightbox-list-image" data-class="dialog-lightbox-list-image" />' + "</div>" + "	" + '<span class="dialog-lightbox-prev" data-class="dialog-lightbox-prev">&lt;</span>' + '<span class="dialog-lightbox-next" data-class="dialog-lightbox-next">&gt;</span>';
                } else {
                    var content = $.dialog_defaults.content;
                }
                if (!$.dialog_defaults.hideCloseButton) {
                    dialog_light_close = '<span class="dialog-lightbox-close" data-class="dialog-lightbox-close"></span>';
                }
                var plugs_lightbox = '<div class="dialog-lightbox" data-class="dialog-lightbox"></div>';
                var plugs_lightbox_section = '<div class="dialog-lightbox-section" data-class="dialog-lightbox-section">' + '	<div class="dialog-lightbox-header" data-class="dialog-lightbox-header">' + "		<h2>" + $.dialog_defaults.title + "</h2>" + dialog_light_close + "	</div>" + "	" + '	<div class="dialog-lightbox-body" data-class="dialog-lightbox-body">' + content + "	</div>" + "</div>";
                oBody.append(plugs_lightbox);
                oBody.append(plugs_lightbox_section);
                $($.dialog_config.lightbox).fadeIn();
                $($.dialog_config.section).show();
                $.dialog_config.paddingWidth = $($.dialog_config.section).outerWidth();
                $.dialog_config.paddingHeight = $($.dialog_config.section).outerHeight();
            },
            dialog_getNow: function(loadImage_src) {
                for (var i = 0, len = $.dialog_config.images.length; i < len; i++) {
                    if (loadImage_src === $.dialog_config.images[i]) {
                        $.dialog_config.now = i;
                    }
                }
            },
            dialog_getImages_src: function(images) {
                var images = typeof images == "string" ? $(images) : images;
                $.dialog_config.images = [];
                for (var i = 0, len = images.length; i < len; i++) {
                    var currentImage = images.eq(i);
                    var currentImage_src = currentImage.attr("data-src");
                    var currentImage_src = $.trim(currentImage_src);
                    if (currentImage_src !== "") {
                        $.dialog_config.images.push(currentImage_src);
                    }
                }
            },
            dialog_loadImage: function(loadImage_src, isMove, callback) {
                var section = $($.dialog_config.section);
                var imageTag = $($.dialog_config.imageTag);
                var image = new Image();
                image.src = loadImage_src;
                image.onload = function() {
                    $.dialog_config.imageData = {
                        width: image.width,
                        height: image.height,
                        src: loadImage_src
                    };
                    callback && callback(section, imageTag, isMove);
                };
            },
            dialog_switchImage: function(d, isMove) {
                if (d) {
                    $.dialog_config.now++;
                } else {
                    $.dialog_config.now--;
                }
                if ($.dialog_config.now < 0) {
                    $.dialog_config.now = $.dialog_config.images.length - 1;
                }
                if ($.dialog_config.now > $.dialog_config.images.length - 1) {
                    $.dialog_config.now = 0;
                }
                var loadImage_src = $.dialog_config.images[$.dialog_config.now];
                $.dialog_loadImage(loadImage_src, isMove, $.dialog_settings);
            },
            // 设置内容显示盒子的大小，位置
            dialog_settings: function(section, imageTag, isMove) {
                var section = typeof section == "string" ? $(section) : section;
                if (!$.dialog_defaults.content) {
                    $.dialog_config.width = $.dialog_config.imageData.width;
                    $.dialog_config.height = $.dialog_config.imageData.height;
                } else {
                    $.dialog_config.width = section.width();
                    $.dialog_config.height = section.height();
                }
                var outerWidth = $.dialog_config.width + $.dialog_config.paddingWidth;
                var outerHeight = $.dialog_config.height + $.dialog_config.paddingHeight;
                if (typeof imageTag === "object") {
                    imageTag.hide().attr("src", $.dialog_config.imageData.src).css({
                        width: $.dialog_config.width,
                        height: $.dialog_config.height
                    }).fadeIn();
                }
                if ($.dialog_defaults.isFixed) {
                    $.dialog_config.left = Math.floor(outerWidth / 2);
                    $.dialog_config.top = Math.floor(outerHeight / 2);
                    section.css({
                        position: "fixed"
                    });
                    if (isMove) {
                        section.css({
                            marginLeft: -$.dialog_config.left,
                            marginTop: -$.dialog_config.top
                        });
                    } else {
                        section.animate({
                            marginLeft: -$.dialog_config.left,
                            marginTop: -$.dialog_config.top
                        }, {
                            queue: false
                        });
                    }
                } else {
                    var scrollLeft = $.dialog_config.windows.scrollLeft();
                    var scrollTop = $.dialog_config.windows.scrollTop();
                    var windowWidth = $.dialog_config.windows.width();
                    var windowHeight = $.dialog_config.windows.height();
                    $.dialog_config.left = Math.floor((windowWidth - outerWidth) / 2) + scrollLeft;
                    $.dialog_config.top = Math.floor((windowHeight - outerHeight) / 2) + scrollTop;
                    section.css({
                        position: "absolute",
                        marginLeft: 0,
                        marginTop: 0
                    });
                    if (isMove) {
                        section.css({
                            left: $.dialog_config.left,
                            top: $.dialog_config.top
                        });
                    } else {
                        section.animate({
                            left: $.dialog_config.left,
                            top: $.dialog_config.top
                        }, {
                            queue: false
                        });
                    }
                }
                if (imageTag) {
                    $.dialog_move(section, isMove);
                }
            },
            // 显示时的动画效果
            dialog_move: function(section, isMove) {
                if ($.dialog_defaults.isFixed && isMove) {
                    section.css({
                        marginTop: -($.dialog_config.top - 150)
                    }).animate({
                        marginTop: -$.dialog_config.top,
                        opacity: 1
                    });
                } else if (isMove) {
                    section.css({
                        top: $.dialog_config.top + 150
                    }).animate({
                        top: $.dialog_config.top,
                        opacity: 1
                    });
                }
                section.animate({
                    width: $.dialog_config.width,
                    height: $.dialog_config.height
                }, {
                    queue: false
                });
            },
            // 取消默认事件
            dialog_cancelDefault: function(e) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    };
});
