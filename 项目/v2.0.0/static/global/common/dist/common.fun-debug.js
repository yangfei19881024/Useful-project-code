define("static/global/common/2.0.0/common.fun-debug", [ "static/global/common/2.0.0/dialog-debug", "static/global/common/2.0.0/slider-debug" ], function(require, exports, module) {
    var CMF = {};
    XD = {};
    var DOMAIN = "http://www.xidibuy.com";
    require("static/global/common/2.0.0/dialog-debug.js")($);
    require("static/global/common/2.0.0/slider-debug.js")($);
    var TOKEN_INPUT = $("#form_token");
    TOKEN_KEY = TOKEN_INPUT.attr("name");
    TOKEN_VAL = TOKEN_INPUT.val();
    XD.Datas = {
        topCart: "#top_cart",
        cartMax: 3,
        skuGoodsNums: 0,
        cartNum: 0
    };
    /*------------------------------------------------------------------
	@Class: ajax 请求
	------------------------------------------------------------------*/
    CMF.Actions = {
        /*---------------------------------------------
		@Class: 获取商品数量
		---------------------------------------------*/
        getSkuGoodsNums: function() {
            $.ajax({
                type: "GET",
                url: DOMAIN + "/cart/getSkuGoodsNums?jsoncallback=?",
                dataType: "json",
                async: false,
                success: function(ajaxData) {
                    XD.Datas.skuGoodsNums = parseInt(ajaxData);
                    if (isNaN(XD.Datas.skuGoodsNums)) {
                        XD.Datas.skuGoodsNums = 0;
                    }
                }
            });
        },
        /*---------------------------------------------
		@Class: 初始化页面顶部购物车数量
		---------------------------------------------*/
        getCartNum: function() {
            $.ajax({
                type: "GET",
                url: DOMAIN + "/cart/getGoodsNum?jsoncallback=?",
                dataType: "json",
                async: false,
                success: function(ajaxData) {
                    XD.Datas.cartNum = parseInt(ajaxData);
                    if (isNaN(XD.Datas.cartNum)) {
                        XD.Datas.cartNum = 0;
                    } else if (XD.Datas.cartNum > 99) {
                        XD.Datas.cartNum = "99+";
                    }
                    if (XD.Datas.cartNum != 0) {
                        $(XD.Datas.topCart).html(XD.Datas.cartNum);
                        $(".userCart-text").removeClass("userCart-text").addClass("userCart-text-full");
                    }
                }
            });
        },
        /*---------------------------------------------
		@Class: 获取购物车中的商品
		---------------------------------------------*/
        getCartGoods: function(callback) {
            $.ajax({
                type: "GET",
                url: DOMAIN + "/Cart/cList?jsoncallback=?",
                dataType: "json",
                async: false,
                success: function(ajaxData) {
                    var ajaxData = typeof ajaxData == "string" ? $.parseJSON(ajaxData) : ajaxData;
                    if (ajaxData.code == 0) {
                        callback && callback(ajaxData);
                    } else {}
                },
                error: function() {}
            });
        },
        /*---------------------------------------------
		@Class: 返回用户登录状态
		---------------------------------------------*/
        isLogin: function() {
            var isLogin = 0;
            $.ajax({
                type: "POST",
                url: DOMAIN + "/User/ajaxIsLogin",
                async: false,
                success: function(ajaxData) {
                    var ajaxData = typeof ajaxData == "string" ? $.parseJSON(ajaxData) : ajaxData;
                    if (ajaxData.code == 0) {
                        isLogin = 1;
                    }
                }
            });
            return isLogin;
        },
        /*---------------------------------------------
		@Class: 发送留言
		---------------------------------------------*/
        sendMessage: function(datas, callback) {
            $.ajax({
                type: "POST",
                url: DOMAIN + "/Message/send",
                data: datas,
                async: false,
                success: function(ajaxData) {
                    var ajaxData = typeof ajaxData == "string" ? $.parseJSON(ajaxData) : ajaxData;
                    if (ajaxData.code == 0) {
                        datas.create_time = ajaxData.data.create_time;
                        datas.avator = ajaxData.data.avatar;
                        CMF.Methods.sendSuccess("发送留言成功！");
                        callback && callback(datas);
                    } else {
                        CMF.Methods.sendError("发送留言失败！");
                    }
                },
                error: function() {
                    CMF.Methods.sendError("发送留言失败！");
                }
            });
        }
    };
    /*------------------------------------------------------------------
	@Class: 公用方法
	------------------------------------------------------------------*/
    CMF.Methods = {
        /*---------------------------------------------
		@Class: 图片上传 / 删除
		---------------------------------------------*/
        uploadImage: function(errorBox) {
            var oUpLoadImageButton = $("[data-action=upLoadImageButton]");
            var oUpLoadImageButtonBox = null;
            var aUpLoadModuleList = null;
            var oFormBox = null;
            var IMAGES_URI = [];
            // 图片上传
            oUpLoadImageButton.live("change", function() {
                document.domain = "xidibuy.com";
                oUpLoadImageButtonBox = $(this).parent("[data-class=upLoadImageButtonBox]");
                aUpLoadModuleList = oUpLoadImageButtonBox.parent("[data-class=upLoadImageOuter]");
                oFormBox = oUpLoadImageButton.parents("form[name=upLoadImageForm]");
                getToken(oFormBox);
                oFormBox.attr("action", IMAGE_DOMAIN + "upload").submit();
                return false;
            });
            // 创建上传的图片模块
            window.upCallback = function(upCallbackData) {
                if (typeof upCallbackData == "object" && upCallbackData.code == 0) {
                    $(errorBox).html("");
                    var image = upCallbackData.data.key[0];
                    var createImgaeModule = '<li class="certificate-item mr12 pr fl" data-class="upLoadImageBox" data-uri="' + image + '">' + '	<img src="' + IMAGE_DOMAIN + image + '" width="58" height="58">' + '	<div class="certificate-oper hide pa" data-action="removeUpLoadImage">' + '		<span class="icon-remove sprites"></span>' + "	</div>" + "</li>";
                    IMAGES_URI.push(image);
                    if (aUpLoadModuleList[0]) // 上传多张图片时
                    {
                        oUpLoadImageButtonBox.before(createImgaeModule);
                        isDisabledUpload();
                    } else // 头像上传/只上传一张图片是
                    {
                        $("[data-class=imagePreview]").attr("src", IMAGE_DOMAIN + image);
                    }
                } else {
                    if (upCallbackData.msg) {
                        var errorMsg = upCallbackData.msg;
                    } else {
                        var errorMsg = "上传失败";
                    }
                    $(errorBox).html(errorMsg);
                }
            };
            // 删除凭证
            $("[data-action=removeUpLoadImage]").live("click", function() {
                var oUpLoadImageBox = $(this).parent("[data-class=upLoadImageBox]");
                var nowURI = oUpLoadImageBox.attr("data-uri");
                oUpLoadImageBox.fadeOut(function() {
                    IMAGES_URI.splice($.inArray(nowURI, IMAGES_URI), 1);
                    oUpLoadImageBox.remove();
                    isDisabledUpload();
                });
                return false;
            });
            // 获取 token
            function getToken(oForm) {
                var tokenType = $('input[name="getTokenType"]', oForm).val();
                $.ajax({
                    type: "POST",
                    url: DOMAIN + "/Feedback/getToken",
                    data: {
                        type: tokenType
                    },
                    async: false,
                    success: function(ajaxData) {
                        var ajaxData = typeof ajaxData == "string" ? $.parseJSON(ajaxData) : ajaxData;
                        oForm.find("input[name=token]").val(ajaxData.token);
                    }
                });
            }
            // 显示/隐藏 上传按钮
            function isDisabledUpload() {
                var oUpLoadButtonBox = $("[data-class=upLoadImageButtonBox]", aUpLoadModuleList);
                if (IMAGES_URI.length >= 5) {
                    oUpLoadButtonBox.hide();
                } else {
                    oUpLoadButtonBox.show();
                }
            }
            return IMAGES_URI;
        },
        /*---------------------------------------------
		@Class: 格式化商品数量
		---------------------------------------------*/
        formatGoodsNum: function(input, addButton) {
            var addButton = typeof addButton == "string" ? $(addButton) : addButton;
            var input = typeof input == "string" ? $(input) : input;
            var tip = input.parents(".addCartOperBox").next();
            var minus = input.prev();
            var plus = input.next();
            var iMin = 1;
            var iMax = input.attr("data-max");
            iMax = parseInt(iMax);
            iNow = isNaN(iMax) ? 1 : iMax;
            var iNow = input.val();
            iNow = parseInt(iNow);
            iNow = isNaN(iNow) ? 1 : iNow;
            if (iNow == iMin && iNow == iMax) {
                input.attr("disabled", true);
                minus.addClass("minus-disabled");
                plus.addClass("plus-disabled");
            } else if (iNow <= iMin) {
                iNow = iMin;
                minus.addClass("minus-disabled");
                plus.removeClass("plus-disabled");
            } else if (iNow >= iMax) {
                iNow = iMax;
                minus.removeClass("minus-disabled");
                plus.addClass("plus-disabled");
            } else {
                minus.removeClass("minus-disabled");
                plus.removeClass("plus-disabled");
            }
            input.val(iNow);
            addButton && addButton.attr("data-cat-num", iNow);
            return iNow;
        },
        /*---------------------------------------------
		@Class: 当数量增加到最时给出提示
		---------------------------------------------*/
        isGoodsNumInMax: function(input, bHide) {
            var input = typeof input == "string" ? $(input) : input;
            var val = input.val();
            val = parseInt(val);
            val = isNaN(val) ? 1 : val;
            var iMax = input.attr("data-max");
            iMax = parseInt(iMax);
            iMax = isNaN(iMax) ? 1 : iMax;
            var minus = input.prev();
            var plus = input.next();
            if (plus.hasClass("plus-disabled") && val >= iMax) {
                CMF.Methods.showNumNotice(input, bHide);
            } else if (minus.hasClass("minus-disabled") || val <= iMax) {
                CMF.Methods.hideNumNotice(input, true);
            }
        },
        /*---------------------------------------------
		@Class: 输入状态
		---------------------------------------------*/
        enterStatus: function(enterBox, sButtonDisabledClass, sType) {},
        /*---------------------------------------------
		@Class: 显示提示
		---------------------------------------------*/
        showNumNotice: function(input, bHide) {
            var currentOperBox = input.parent(".addCartOperBox");
            var currentVal = input.val();
            currentVal = parseInt(currentVal);
            currentVal = isNaN(currentVal) ? 1 : currentVal;
            var currentMax = input.attr("data-max");
            currentMax = parseInt(currentMax);
            currentMax = isNaN(currentMax) ? 1 : currentMax;
            //console.log(currentVal);
            //console.log(currentMax);
            if (currentVal >= currentMax) {
                //input.val(currentMax);
                currentOperBox.next().stop(true, true).show().find("[data-class=max-num]").text(currentMax);
            }
            if (bHide) {
                CMF.Methods.hideNumNotice(input);
            }
        },
        /*---------------------------------------------
		@Class: 隐藏提示
		---------------------------------------------*/
        hideNumNotice: function(input, nowHide) {
            var currentOperBox = input.parents(".addCartOperBox");
            if (nowHide) {
                currentOperBox.next().hide();
                return false;
            }
            setTimeout(function() {
                currentOperBox.next().hide();
            }, 1500);
        },
        /*---------------------------------------------
		@Class: 信息发送成功的提示
		---------------------------------------------*/
        sendSuccess: function(msg, isError) {
            var timer = null;
            if (isError) {
                var afterIcon = '<span class="icon-error-21" style="float: left;"></span>';
            } else {
                var afterIcon = '<span class="icon-success-21" style="float: left;"></span>';
            }
            var content = '<div class="clearfix">' + afterIcon + '    <p style="padding-left: 12px; font-size: 14px; float: left;">' + msg + "</p>" + "</div>";
            $.dialog_block({
                title: " ",
                hideCloseButton: true,
                content: content
            });
            timer = setTimeout(function() {
                $.dialog_unblock();
                clearTimeout(timer);
            }, 2e3);
        },
        /*---------------------------------------------
		@Class: 信息发送失败的提示
		---------------------------------------------*/
        sendError: function(msg) {
            CMF.Methods.sendSuccess(msg, true);
        },
        /*---------------------------------------------
		@Class: 倒计时
		---------------------------------------------*/
        countdown: function(alltime, box, diecallback) {
            var box = typeof box == "undefined" ? $("body") : box;
            box = typeof box == "string" ? $(box) : box;
            var alltime = alltime;
            var oDays = $("[data-class=days]", box);
            var oHours = $("[data-class=hours]", box);
            var oMinutes = $("[data-class=minutes]", box);
            var oSeconds = $("[data-class=seconds]", box);
            var timer = null;
            var i = 1;
            timer = setInterval(currentTime, 1e3);
            function currentTime() {
                var iNow = alltime - i;
                if (iNow > 0 && iNow < alltime) {
                    i++;
                    var iD = parseInt(iNow / 86400);
                    iD = iD < 10 ? "0" + iD : iD;
                    iNow %= 86400;
                    var iH = parseInt(iNow / 3600);
                    iH = iH < 10 ? "0" + iH : iH;
                    iNow %= 3600;
                    var iM = parseInt(iNow / 60);
                    iM = iM < 10 ? "0" + iM : iM;
                    iNow %= 60;
                    var iS = iNow;
                    iS = iS < 10 ? "0" + iS : iS;
                } else {
                    var iD = "00";
                    var iH = "00";
                    var iM = "00";
                    var iS = "00";
                    diecallback && diecallback();
                    clearInterval(timer);
                }
                oDays.text(iD);
                oHours.text(iH);
                oMinutes.text(iM);
                oSeconds.text(iS);
            }
        },
        /*---------------------------------------------
		@Class: 单选/复选框
		---------------------------------------------*/
        checkbox: function(label, isCheck) {
            var label = typeof label == "string" ? $(label) : label;
            if (isCheck == "check") {
                label.each(function() {
                    var _this = $(this);
                    var input = $("input", label);
                    _this.addClass("checkbox").removeClass("uncheckbox");
                    if (input[0]) {
                        input.attr("checked", true);
                    }
                });
            } else if (isCheck == "uncheck") {
                label.each(function() {
                    var _this = $(this);
                    var input = $("input", label);
                    _this.addClass("uncheckbox").removeClass("checkbox");
                    if (input[0]) {
                        input.attr("checked", false);
                    }
                });
            } else {
                var input = $("input", label);
                label.toggleClass("checkbox").toggleClass("uncheckbox");
                if (input[0] && input.prop("checked")) {
                    input.attr("checked", false);
                } else if (input[0]) {
                    input.attr("checked", true);
                }
            }
        },
        /*---------------------------------------------
		@Class: 解析URL参数
		---------------------------------------------*/
        parseUrl: function(url) {
            var reg = /(\w+)=(\w+)/gi;
            var parames = {};
            url.replace(reg, function(a, b, c) {
                parames[b] = c;
            });
            return parames;
        },
        /*---------------------------------------------
		@Class: 只能键入数字 回车 上下左右 删除
		---------------------------------------------*/
        detect: function(key) {
            if (key == 13 || key == 8 || key == 46 || key >= 37 && key <= 40 || key >= 48 && key <= 57 || key >= 96 && key <= 105) {
                return true;
            }
        },
        /*---------------------------------------------
		@Class: 设置cookie
		---------------------------------------------*/
        setCookie: function(name, value, iDay) {
            if (iDay !== false) {
                var oDate = new Date();
                if (iDay) {
                    oDate.setDate(oDate.getDate() + iDay);
                } else {
                    oDate.setDate(oDate.getDate());
                }
                document.cookie = name + "=" + value + ";expires=" + oDate + ";path=/";
            } else {
                document.cookie = name + "=" + value;
            }
        },
        /*---------------------------------------------
		@Class: 获取cookie
		---------------------------------------------*/
        getCookie: function(name) {
            var arr = document.cookie.split("; ");
            var i = 0;
            for (i = 0; i < arr.length; i++) {
                var arr2 = arr[i].split("=");
                if (arr2[0] == name) {
                    return arr2[1];
                }
            }
            return "";
        },
        /*---------------------------------------------
		@Class: 删除cookie
		---------------------------------------------*/
        removeCookie: function(name) {
            CMF.Methods.setCookie(name, "a", -1);
        }
    };
    /*------------------------------------------------------------------
	@Class: 各种验证方法
	------------------------------------------------------------------*/
    CMF.Check = {
        // 字符串验证
        string: function(obj, opts) {
            //var obj = (typeof obj == 'string') ? $(obj) : obj;
            var timer = null;
            $(document).on("focus", obj, function() {
                var _this = $(this);
                CMF.Check.hideError(_this);
            }).on("blur", obj, function() {
                var _this = $(this);
                opts.isCheck = true;
                CMF.Check.check(_this, opts);
            });
            $(document).on("keyup", obj, function(ev) {
                var _this = $(this);
                clearTimeout(timer);
                timer = setTimeout(function() {
                    clearTimeout(timer);
                    opts.isCheck = false;
                    CMF.Check.check(_this, opts);
                }, 50);
            });
        },
        // 提示信息
        check: function(obj, opts) {
            var defaults = {
                type: "string",
                isCheck: true,
                isFocus: false,
                required: "此项为必填项",
                format: "格式错误，请重新填写"
            };
            var opts = $.extend({}, defaults, opts || {});
            var obj = typeof obj == "string" ? $(obj) : obj;
            //var name = obj.attr('name');
            //var oId = opts.selector ? $(opts.selector) : $('#error-warning-'+ name);
            var required = obj.attr("data-required");
            var iMin = obj.attr("data-min");
            iMin = parseInt(iMin);
            iMin = isNaN(iMin) ? 0 : iMin;
            var iMax = obj.attr("data-max");
            iMax = parseInt(iMax);
            iMax = isNaN(iMax) ? Infinity : iMax;
            var str = obj.val();
            str = $.trim(str);
            var str_len = str.length;
            var bHide = true;
            if (str === "" && required) {
                showError(opts.required);
                return false;
            } else if (str !== "" && (str_len < iMin || str_len > iMax)) {
                showError(opts.format);
                return false;
            } else if (str !== "" && opts.type === "number") {
                var b = CMF.Regular.isNumber(str);
                if (!b) {
                    showError(opts.format);
                    return false;
                }
            } else if (str !== "" && opts.type === "email") {
                var b = CMF.Regular.isEmail(str);
                if (!b) {
                    showError(opts.format);
                    return false;
                }
            } else if (str !== "" && opts.type === "mobile") {
                var b = CMF.Regular.isMobile(str);
                if (!b) {
                    showError(opts.format);
                    return false;
                }
            }
            if (bHide) {
                hideError();
                return true;
            }
            function showError(msg) {
                bHide = false;
                //opts.isCheck && obj.addClass('textError');
                //opts.isCheck && oId.show().html(msg);
                if (opts.isCheck) {
                    CMF.Check.showError(obj, msg, opts.selector);
                }
                opts.isFocus && obj.focus();
            }
            function hideError() {
                bHide = true;
                //obj.removeClass('textError');
                //oId.hide().html('');
                CMF.Check.hideError(obj, opts.selector);
            }
        },
        // 显示错误提示
        showError: function(obj, msg, selector) {
            var obj = typeof obj == "string" ? $(obj) : obj;
            if (obj[0]) {
                var name = obj.attr("name");
                var name = name ? name : obj.attr("id");
                var oId = selector ? $(selector) : $("#error-warning-" + name);
                obj.addClass("textError");
                oId.show().html(msg);
            }
        },
        // 隐藏错误提示
        hideError: function(obj, selector) {
            var obj = typeof obj == "string" ? $(obj) : obj;
            if (obj[0]) {
                var name = obj.attr("name");
                var name = name ? name : obj.attr("id");
                var oId = selector ? $(selector) : $("#error-warning-" + name);
                obj.removeClass("textError");
                oId.hide().html("");
            }
        }
    };
    /*------------------------------------------------------------------
	@Class: 各种正则
	------------------------------------------------------------------*/
    CMF.Regular = {
        // 邮箱验证
        isEmail: function(str) {
            var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return reg.test(str);
        },
        // 手机验证
        isMobile: function(str) {
            var reg = /^(13[0-9]{9})|(14[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})$/;
            return reg.test(str);
        },
        // 网址验证
        isUrl: function(str) {
            var reg = /((http[s]?|ftp):\/\/)?[^\/\.]+?\..+\w$/i;
            return reg.test(str);
        },
        // 全部为数字
        isNumber: function(str) {
            var reg = /^[0-9]*$/;
            return reg.test(str);
        }
    };
    /*------------------------------------------------------------------
	@Class: 密码检测
	------------------------------------------------------------------*/
    CMF.passCheck = {
        //测试某个字符是属于哪一类. 
        charMode: function(iN) {
            if (iN >= 48 && iN <= 57) //数字
            {
                return 1;
            }
            if (iN >= 65 && iN <= 90) //大写字母
            {
                return 2;
            }
            if (iN >= 97 && iN <= 122) //小写
            {
                return 4;
            } else //特殊字符
            {
                return 8;
            }
        },
        //计算出当前密码当中一共有多少种模式 
        bitTotal: function(num) {
            var modes = 0;
            for (i = 0; i < 4; i++) {
                if (num & 1) {
                    modes++;
                }
                num >>>= 1;
            }
            return modes;
        },
        //返回密码的强度级别 
        checkStrong: function(sPW) {
            if (sPW.length <= 4) //密码太短
            {
                return 0;
            }
            Modes = 0;
            for (i = 0; i < sPW.length; i++) //测试每一个字符的类别并统计一共有多少种模式
            {
                Modes |= CMF.passCheck.charMode(sPW.charCodeAt(i));
            }
            return CMF.passCheck.bitTotal(Modes);
        },
        //当用户放开键盘或密码输入框失去焦点时，根据不同的级别显示不同的颜色 
        pwStrength: function(pwd, icon, text) {
            if (pwd == null || pwd == "") {
                icon.hide();
                text.text(" ");
            } else {
                var level = CMF.passCheck.checkStrong(pwd);
                switch (level) {
                  case 0:
                  //icon.removeClass('passLevel-low').removeClass('passLevel-medium').removeClass('passLevel-high');
                    case 1:
                    icon.show().addClass("passLevel-low").removeClass("passLevel-medium").removeClass("passLevel-high");
                    text.text("密码等级：低");
                    break;

                  case 2:
                    icon.show().addClass("passLevel-medium").removeClass("passLevel-low").removeClass("passLevel-high");
                    text.text("密码等级：中");
                    break;

                  default:
                    icon.show().addClass("passLevel-high").removeClass("passLevel-medium").removeClass("passLevel-low");
                    text.text("密码等级：高");
                }
            }
            return;
        }
    };
    module.exports = CMF;
});
