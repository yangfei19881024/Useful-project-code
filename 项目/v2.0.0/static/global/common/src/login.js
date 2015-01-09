define(function(require, exports, module){
	var login;

    var CMF = require('{common}common.fun');
    require('static/global/common/src/dialog.js')($);

    function cookie2obj(){
        var cook = document.cookie.split(";")
        var obj={};
        for(i in cook){
            var cookie2 = cook[i].split("=")
            key = $.trim(cookie2[0])
            val = cookie2[1]
            obj[key] = val
        }
        return obj
    }
    function setCookie(name,value,days){
        var Days = days || 30;
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    var failCount = cookie2obj().failcount || 0;
    window.caps=undefined;

    var rememberMe = cookie2obj().rememberme || 0;
	
	$('[data-action=login]').live('click', function(){
		
		var content = '<div class="login-outer clearfix">'
					 +'	<div class="login-head clearfix">'
					 +'		<div class="login-logo sprites"></div><span class="login_welcome">欢迎来到喜地</span>'
					 +'	</div>'
					 +'	<div class="login-body clearfix">'
					 +'		<div class="pt24 clearfix login-user-outer">'
					 +'			<input type="text" name="user" class="textBox login-user" tabindex="0" data-id="login-user-error" placeholder="邮箱 / 手机 / 用户名"/>'
					 +'			<p class="login-error clearfix" id="login-user-error"></p>'
					 +'		</div>'
					 +'		<div class="pt24 clearfix login-pass-outer">'
					 +'			<input type="password" name="pass" class="textBox login-pass" tabindex="1" data-id="login-pass-error" placeholder="密码" />'
					 +'			<p class="login-error clearfix" id="login-pass-error"></p>'
					 +'		</div>'
					 +'		<div class="pt24 clearfix login-code-outer" id="verifyCode">'
					 +'			<span class="fl">'
					 +'				<input type="text" name="code" class="textBox login-code" tabindex="2" data-id="login-code-error" maxlength="4" placeholder="验证码" />'
					 +'			</span>'
					 +'			<span class="ml24 fl">'
					 +'				<a href="javascript:;" class="fl"><img src="" class="block" id="codeImage" /></a>'
					 +'				<a href="javascript:;" class="login-reloadCode sprites fl"></a>'
					 +'			</span>'
					 +'			<div class="cb"></div>'
					 +'			<p class="login-error clearfix" id="login-code-error"></p>'
					 +'		</div>'
					 +'		<div class="pt24 clearfix">'
					 +'			<a href="javascript:;" tabindex="3" class="login-button anim-all">登录</a>'
					 +'		</div>'
					 +'		<div class="pt12 clearfix">'
					 +'			<label for="rememberMe" class="fl"><input type="checkbox" name="rememberMe" id="rememberMe" tabindex="4" /> 记住用户名</label>'
					 +'			<div class="fr">'
					 +'				<a href="/signup/index" tabindex="5" class="color-blue">注册</a>'
					 +'				<a href="/findpw/index" tabindex="6" class="color-blue ml12">忘记密码</a>'
					 +'			</div>'
					 +'		</div>'
					 +'	</div>'
					 +'	<div class="login-foot pt12 clearfix">'
					 +'		<div class="login-other clearfix">'
					 +'			<div class="login-line"></div>'
					 +'			<span class="login-oter-text">其他帐号登录</span>'
					 +'		</div>'
					 +'		<div class="pt24 clearfix">'
					 +'			<a href="/user/thirdLogin?type=sina" tabindex="7" class="sina-login fl"><span class="login-sina-icon sprites"></span><span class="pl12">微博</span></a>'
					 +'			<a href="/user/thirdLogin?type=qq" tabindex="8" class="qq-login fr"><span class="login-qq-icon sprites"></span><span class="pl12">QQ</span></a>'
					 +'		</div>'
					 +'	</div>'
					 +'</div>';
		
		$.dialog_block({
			title: ' ',
			content: content
		});
		
        if(failCount>3)
		{
            check.showCode();
            $('.login-reloadCode').css({ background: 'url('+ IMAGE_DOMAIN +'static/global/images/1.0.0/sprites.png)'});
        }
        if(rememberMe==1)
		{
            $('.login-user').val(cookie2obj().username);
            $('#rememberMe').attr('checked', true);
        }

        $('.plugs-close').bind('click',function(){
			
            $.dialog_unblock();
			
        });

		return false;

	});

    var reg_mail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    var mail=["qq.com", "126.com", "163.com", "hotmail.com", "yahoo.com", "yahoo.com.cn", "live.com", "sohu.com", "sina.com", "chinavalue.net", "chinaksp.net"];
    var check={
        user:function(obj){
            var val = obj.val();
            var status=false;
            var s = check.empty(obj,function(){
                if(val.indexOf('@')>-1){
                    if(!reg_mail.test(val)){
                        check.showError(obj,'请输入正确的邮箱');
                        status = false;
                        //console.log('wrong email');
                    }else{status=true}
                }else{
                    if(isNaN(val)){//字符
                        //console.log('asd')
                        status = true;
                    }else{//number
                        if(val.length == 11){
                            //console.log('right')
                            status = true;
                        }else{
                            check.showError(obj,'请输入正确的手机号码');
                            status = false;
                        }
                    }
                }
                
            })
            // console.log(status)

            status = (status && s);
            return status
        },

        pass:function(obj){
            var val = obj.val();
            return check.empty(obj,function(){
                if(val.length>16 || val.length<8){
                    check.showError(obj,'请输入正确的密码')
                }else{
                    check.hideError(obj)
                }
            })
        },

        vcode:function(obj){
            var val = obj.val();
            var coderight;
            var empty = check.empty(obj,function(){
                $.ajax({
                    type:"POST",
                    url:"/Signup/ajaxCheckImgCode",
                    dataType: "json",
                    data:{verifyCode:val},           
                    success:function(data){
                        switch(data.code){
                            case 0:
                                coderight=1;
                                check.hideError(obj)
                            break;
                            default:
                               coderight=0;
                               check.showError(obj,data.msg);
                            break;
                        }
                    },
                    error:function(){
                      alert('连接异常');   
                    }
                });
            })
            return empty
        },

        showError:function(obj,content){
            var error_p = check.getErrorP(obj);
            obj.addClass('border-red');
            error_p.text(content).show().addClass('color-red');
        },

        hideError:function(obj){
            var error_p = check.getErrorP(obj);
            error_p.text('').hide().removeClass('color-red');
            obj.removeClass('border-red');
        },

        getErrorP:function(obj){
                id = obj.data('id'),
                error_p = $("#"+id);
                return error_p;
        },

        showCode:function(){
            $('#verifyCode').show().find('img').attr('src','http://captcha.xidibuy.com/getimage?'+Math.random());
        },

        checkCaps:function(e){
            var keyCode = e.which;
            var shifKey = e.shiftKey ? e.shiftKey:((keyCode == 16) ? true : false);
            if(e.type=='keypress'){
                if(((keyCode >= 65 && keyCode <= 90) && !shifKey)||((keyCode >= 97 && keyCode <= 122) && shifKey)){
                   //console.log('true'); capsLock = true;
                }else{
                   //console.log('false'); capsLock = false;
                }
            }
            
            if(keyCode == 20){
                //console.log(window.caps)
                if(window.caps==true){
                    window.caps=false;
                }else{
                    window.caps=true;
                }
                //console.log(window.caps)
            }
            if(!$.browser.webkit){
                if(window.caps){
                    //console.log('kaiqi')
                    $('.login-pass').addClass('capslock');
                    check.showError($('.login-pass'),'键盘大写锁定已启动，请注意！');
                }else{
                    //console.log('guanbi')
                    $('.login-pass').removeClass('capslock');
                    check.hideError($('.login-pass'));
                }
            }
            
        },

        empty:function(obj,callback,status){
            if(obj.val()==""){
                check.showError(obj,'请输入'+obj.attr('placeholder'))
                return false;
            }else{
                callback();
                return true;
            }
        },

        toggleMail:function(obj){
            var val = obj.val();
            if(val.indexOf('@')>-1){
                var mailList = '<ul id="toggleMail">',mailContent='';
                var name = val.split("@")[0];
                var server = val.split('@')[1];
                $.each(mail,function(i,n){
                    if(server && server != ""){//@之后有输入
                        if(n.indexOf(server)==0){
                           mailContent += '<li><b>'+name+'</b>@'+n+'</li>'; 
                        }else{
                           //没有匹配项
                        }
                    }else{
                        mailContent += '<li><b>'+name+'</b>@'+n+'</li>';
                    }
                })
                mailList += mailContent;
                mailList +='</ul>';
                if($("#toggleMail").length==0){
                    obj.parent().append(mailList);
                }else{
                    $("#toggleMail").html(mailContent);
                }
            }else{
                $("#toggleMail").remove();
            }
        },

        ajaxLogin:function(){
            if(cookie2obj().rememberme==1){
                setCookie('username',$('.login-user').val());
            }
            
            $.ajax({
                type:"POST",
                url:"/user/ajaxLogin",
                dataType: "json",
                data:{name:$('.login-user').val(),pw:$('.login-pass').val(),verifyCode:$('.login-code').val()},
                success:function(data){
                    switch(data.code){
                        case 0:
                            // alert('asd')
                            setCookie('failcount',0);
                            var str = '<span>您好，</span>';
                            str+='<a href="http://www.xidibuy.com/Myspace" class="user-lo">'+$(".login-user").val()+'</a>';
                            str+='<a href="http://www.xidibuy.com/order/orderlist" class="user-lo">我的订单</a>';
                            str+='<a href="http://www.xidibuy.com/user/logout" class="user-lo">退出</a>';
                            $('.userLogin').html(str);
                            //console.log('ads');
                            CMF.Actions.getCartNum();
                            $.dialog_unblock();
                        break;
                        case -1000:
                        case -2001:
                        case -1101:
                            $('.login-code').addClass('border-red');
                            check.showCode();
                            $("#login-code-error").html(data.msg).show().addClass('color-red');
                            setCookie('failcount',failCount+1)
                        break;
                        
                        case -1105:
                            $('.login-pass').addClass('border-red');
                            $("#login-pass-error").html(data.msg).show().addClass('color-red');
                        break;
                        case -1106:
                            setCookie('failcount',failCount+1);
                            check.showCode();
                        break;
                        // case -1104:
                        //     $('.login-user').addClass('border-red');
                        //     $("#login-user-error").html(data.msg).show().addClass('color-red');
                        //     setCookie('blocked',$('.login-user').val(),1);
                        // break;
                        case -1109:
                            window.location.href='/signup/verifyMail';
                        break;
                        case -1100:
                        case -1102:
                        case -1103:
                            $('.login-user').addClass('border-red');
                            $("#login-user-error").html(data.msg).show().addClass('color-red');
                        break;
                    }
                },
                error:function(){
                  alert('网络故障，登录失败！');   
                }
            });
        }
    }

    $('.login-user').live('blur',function(e){
        // if(cookie2obj().blocked && cookie2obj().blocked==$('.login-user').val()){
        //     $('.login-user').addClass('border-red');
        //     $("#login-user-error").html('账户已被锁定，24小时后解锁').show().addClass('color-red');
        //     return false;
        // }
        
        var status = check.user($(this));
        $('#toggleMail').remove();
    })
    $('.login-user').live('keyup',function(){
        check.toggleMail($(this));
    });
    $('.login-user').live('focus',function(){
        check.hideError($(this));
        check.toggleMail($(this));
    })
    $('#toggleMail li').live('mousedown',function(){
        $('.login-user').val($(this).text());
        check.hideError($('.login-user'));
        $("#toggleMail").remove();
    })

    $('.login-pass').live('blur',function(e){
        var status = check.pass($(this));
        $(this).removeClass('capslock');
    })
    $('.login-pass').live('focus',function(e){
        check.hideError($(this));
        capsLock=check.checkCaps(e);
    })
    $('.login-pass').live('keypress',function(e){
        capsLock=check.checkCaps(e);
        var keyCode = e.keyCode? e.keyCode : e.which;
        if(keyCode==13){
            $('.login-button').trigger('click')
        }
    })
    $('.login-pass').live('keydown',function(e){
        capsLock=check.checkCaps(e);
    })

    $('.login-button').live('click',function(e){
        e.preventDefault?e.preventDefault():e.returnValue=false;

        var status_user = check.user($('.login-user'));
        if(status_user){
           var status_pass = check.pass($('.login-pass'));
           if(status_pass){
                if(failCount>3){
                    var status_code = check.vcode($('.login-code'));
                    if(status_code){
                        check.ajaxLogin();
                    }
                }else{
                    check.ajaxLogin();
                }
                
           }
        }
        
    })

    $('.login-code').live('blur',function(){
        check.vcode($(this));
    })
    $('.login-reloadCode').live('click',function(){
        check.showCode();
    })
    $('#codeImage').live('click',function(){
        check.showCode();
    })
    $('.login-code').live('keyup',function(){
        var val = $(this).val();
    })
    $('.login-code').live('focus',function(){
        check.hideError($(this))
    })
    $("#rememberMe").live('click',function(){
        if($("#rememberMe").filter(':checked').length==0){
            setCookie('rememberme',0)
            setCookie('username','')
        }else{
            setCookie('rememberme','1');
        }
    })
	
    module.exports = login;
});