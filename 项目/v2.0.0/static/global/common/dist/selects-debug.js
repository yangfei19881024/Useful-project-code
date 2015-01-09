define("static/global/common/2.0.0/selects-debug", [], function(require, exports, module) {
    return function($) {
        $.fn.selects = function(options) {
            return $.fn.selects.defaults = {
                container: "#plugs-select",
                // 下拉框容器
                selects: -1,
                // 默认选择
                turn: false,
                // 默认是否展开
                autoRunCallback: false,
                // 页面加载的时候是否执行 callback 方法
                callback: null
            }, this.each(function() {
                var opts = $.extend({}, $.fn.selects.defaults, options), self = $(this), title = $(".plugs-select-title[data-state=title]", self), input = $(".plugs-select-value", self), datalist = $(".plugs-select-bd[data-state=datalist]", self), option = $(".plugs-select-option[data-state=option]", datalist), selects = opts.selects, turn = opts.turn, callback = opts.callback, autoRunCallback = opts.autoRunCallback, sToggleClass = "plugs-select-open";
                var methods = {};
                self.unbind();
                self.on("click", function(ev) {
                    methods.cancelDefault(ev);
                    self.toggleClass(sToggleClass);
                });
                self.on("keydown", function(ev) {
                    methods.moveSelect(ev);
                });
                option.on("click", function(ev) {
                    var data_id = $(this).attr("data-id");
                    autoRunCallback = true;
                    methods.init(data_id, callback);
                });
                $(document).on("click", function() {
                    methods.turnOff();
                });
                self.on("mouseleave", function() {
                    var time = setTimeout(function() {
                        methods.turnOff();
                        clearTimeout(time);
                    }, 500);
                });
                methods.turnOn = function() {
                    self.addClass(sToggleClass);
                };
                methods.turnOff = function() {
                    self.removeClass(sToggleClass);
                };
                methods.moveSelect = function(ev) {
                    var datalistHeight = datalist.height();
                    var optionHeight = option.outerHeight();
                    var selectOption = $(".plugs-select-select", datalist);
                    var len = option.length;
                    var nowIndex = 0;
                    nowIndex = selectOption.index();
                    nowIndex = parseInt(nowIndex);
                    nowIndex = isNaN(nowIndex) ? 0 : nowIndex < 0 ? 0 : nowIndex;
                    var key = ev.keyCode;
                    if (key == 38) {
                        methods.cancelDefault(ev);
                        nowIndex--;
                    } else if (key == 40) {
                        methods.cancelDefault(ev);
                        nowIndex++;
                    } else if (key == 13 && nowIndex >= 0) {
                        methods.cancelDefault(ev);
                        selectOption.click();
                    } else if (key == 32) {
                        methods.cancelDefault(ev);
                        self.click();
                    }
                    nowIndex = nowIndex < 0 ? len - 1 : nowIndex;
                    nowIndex = nowIndex >= len ? 0 : nowIndex;
                    option.eq(nowIndex).addClass("plugs-select-select").siblings().removeClass("plugs-select-select");
                    if (nowIndex > 0) {
                        var scrollT = (nowIndex - 1) * optionHeight;
                    } else {
                        var scrollT = 0;
                    }
                    datalist.animate({
                        scrollTop: scrollT
                    }, {
                        queue: false
                    });
                };
                methods.cancelDefault = function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                };
                methods.init = function(selects) {
                    var data_id = selects;
                    for (var i = 0, len = option.length; i < len; i++) {
                        var oSlt = option.eq(i);
                        if (oSlt.attr("data-id") == data_id) {
                            var data_value = oSlt.attr("data-value");
                            var title_html = oSlt.html();
                            oSlt.addClass("plugs-select-select").siblings().removeClass("plugs-select-select");
                            title.attr("data-id", data_id).attr("data-value", data_value).html(title_html);
                            input.val(data_value).attr("key", title_html);
                            var data = {
                                object: self,
                                data_id: data_id,
                                data_value: data_value,
                                title_html: title_html
                            };
                            if (autoRunCallback) {
                                callback && callback(data);
                            }
                            return data;
                        }
                    }
                    return self;
                };
                methods.init(selects);
                if (turn) {
                    methods.turnOn();
                } else {
                    methods.turnOff();
                }
            });
        };
    };
});
