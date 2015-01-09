define("static/global/common/2.0.0/slider-debug", [], function(require, exports, module) {
    return function($) {
        $.fn.slider = function(options) {
            return $.fn.slider.defaults = {
                datalist: "[data-class=datalist]",
                //切换列表
                buttons: "[data-class=buttons]",
                //左右按钮容器
                arrows: "[data-class=arrows]",
                //分页容器
                arrowsClass: "arrows",
                //按钮默认 class
                arrowsCurrent: "current",
                //按钮高亮 class
                numbers: true,
                //是否出现数字按钮 ( 此功能暂未开发)
                now: 0,
                //默认选择
                auto: true,
                //是否自动播放
                interval: 3500,
                //多长时间执行一次
                duration: 500,
                //动画执行时间
                callback: null
            }, this.each(function() {
                var opts = $.extend({}, $.fn.slider.defaults, options), self = $(this), datalist = $(opts.datalist, self), elements = datalist.children(), elementW = elements.outerWidth(), length = elements.length, buttons = $(opts.buttons, self), prevButton = $("[data-class=previous]", buttons), nextButton = $("[data-class=next]", buttons), arrows = $(opts.arrows, self), arrowsClass = opts.arrowsClass, arrowsCurrent = opts.arrowsCurrent, arrowsButton = null, numbers = opts.numbers, now = opts.now, auto = opts.auto, interval = opts.interval, duration = opts.duration, callback = opts.callback, oldNow = now, bMover = true, timer = null;
                if (length <= 1) {
                    buttons.add(arrows).css("display", "none");
                    return null;
                }
                init();
                prevButton.bind("click", function() {
                    if (bMover) {
                        prev();
                    }
                    return false;
                });
                nextButton.bind("click", function() {
                    if (bMover) {
                        next();
                    }
                    return false;
                });
                arrowsButton && arrowsButton.bind("click", function() {
                    var _this = $(this);
                    var _index = _this.index();
                    if (bMover && oldNow != _index) {
                        oldNow = now;
                        now = _index;
                        move(1);
                    }
                    return false;
                });
                self.bind("mouseover", function() {
                    pause();
                }).bind("mouseout", function() {
                    play();
                });
                function init() {
                    setDom();
                    play();
                }
                function prev() {
                    oldNow = now;
                    now--;
                    move(0);
                }
                function next() {
                    oldNow = now;
                    now++;
                    move(1);
                }
                function play() {
                    auto && (timer = setInterval(next, interval));
                }
                function pause() {
                    clearInterval(timer);
                }
                function setDom() {
                    if (length <= 1) {
                        buttons.add(arrows).css("display", "none");
                        return null;
                    }
                    if (numbers) {
                        createArrows();
                    }
                }
                function createArrows() {
                    var html = "";
                    arrows.empty();
                    for (var i = 0; i < length; i++) {
                        html += '<a href="javascript:;" class="' + arrowsClass + '">&nbsp;</a>';
                    }
                    arrows.append(html);
                    arrowsButton = arrows.children();
                    arrowsButton.eq(now).addClass(arrowsCurrent);
                }
                function setElementsPosition(d) {
                    var oldElements = elements.eq(oldNow);
                    elements.css({
                        position: "absolute"
                    });
                    if (d) {
                        oldElements.siblings().css({
                            left: elementW
                        });
                    } else {
                        oldElements.siblings().css({
                            left: -elementW
                        });
                    }
                }
                function move(d) {
                    bMover = false;
                    if (now < 0) {
                        now = length - 1;
                    } else if (now > length - 1) {
                        now = 0;
                    }
                    var oldElements = elements.eq(oldNow);
                    var currentElements = elements.eq(now);
                    var _this = currentElements;
                    setElementsPosition(d);
                    if (d) {
                        oldElements.stop(true, true).animate({
                            left: -elementW
                        }, duration);
                    } else {
                        oldElements.stop(true, true).animate({
                            left: elementW
                        }, duration);
                    }
                    currentElements.stop(true, true).animate({
                        left: 0
                    }, duration, function() {
                        oldNow = now;
                        bMover = true;
                    });
                    if (arrowsButton) {
                        arrowsButton.eq(now).addClass(arrowsCurrent).siblings().removeClass(arrowsCurrent);
                    }
                    callback && callback(_this, now);
                }
            });
        };
    };
});
