#H5 开发规范 -- 持续整理
## 编码规范

+ css 样式写在header里面,js写在</body>前
+ [js书写代码规范](https://github.com/yangfeiloveG/javascript)

## 波奇前端项目开发用到的技术
+ html/html5 
+ css/css3 
+ [sass](http://sass.bootcss.com/)/[compass](http://compass-style.org/)
+ [coffeescript]()
+ [zeptojs](http://www.css88.com/doc/zeptojs/)
+ [angularjs](http://docs.angularjs.cn/api) 
+ [lodash](https://lodash.com/docs)
+ [gulp](http://www.gulpjs.com/)

##新项目将用的技术
+ [React](http://facebook.github.io/react)
+ [es6](https://github.com/yangfeiloveG/understandinges6)
+ [webpack](https://webpack.github.io/)

##H5 活动页面优化及说明
+ 活动页面单独文件夹,以当前日期命名
+ 上线前 需对图片压缩处理
+ 图片预加载 [demo](http://stest.boqii.com/activity/image_preload/index.html)
+ ajax 请求延迟 setTimeout

## common.js 常用方法
```
1.从浏览器获取解析参数  BQ.GetQueryString("UserId")
2.创建一个提示层 BQ.createTips("删除成功")
3.判断设备 BQ.Device() 值有 "IOS","ANDROID"
4.判断开发环境还是线上环境  BQ.isDevelopment()
5.BQ.storageInfo.set(cookiename) 存cookie 
BQ.storageInfo.set(cookiename) 取cookie
```

##H5跳APP 协议
###联合登陆 (H5 登陆成功 同时让APP也登陆)
```
IOS: 
var apiurl = encodeURIComponent("bqloginprotocol" + data.ResponseData.UserId + "bqloginprotocol");
$("#forms").attr("action",apiurl);$("#forms").submit();
------------------------------
ANDROID: 
Boqii.Login(jsonStr, username);
var jsonStr = JSON.stringify(data.ResponseData);
```
###H5 跳商品详情
```
IOS:
var apiurl = encodeURIComponent("boqii://MallProductDetailController/bqh5?paramGoodsID="+id);$("#forms").attr("action",apiurl);$("#forms").submit();
------------------------------
ANDROID: 
var path = "com.boqii.petlifehouse.shoppingmall.activities.ShoppingMallGoodsDetailActivity";Boqii.Jump(path, "GoodsId=" + id);```
###H5 跳商品列表
```
var goods_id = $(“. goods_list”).attr("goodsid");var url = "http://shopapi.boqii.com/mobile.getprolist-"+goods_id+".html?AppVersion=2.1&UDID=";if( device === "h5" ){
	localStorage.active_url = url;   window.location.href = "http://s.boqii.com/active_list.html";}else{   if( BQ.Device() == "IOS" ){     var json = {       param_URLProductList: url     };     var param = $.param(json);     var apiurl = encodeURIComponent("boqii://MallProductListVController/bqh5?"+param);     $("#forms").attr("action",apiurl);     $("#forms").submit();   }else if( BQ.Device() == "ANDROID" ){     Boqii.JumpListPage(1,url);   } }
```
###H5 跳优惠券页面
```
IOS:
 var ios_url = "boqii://MyCouponViewController/bqh5";
 $("#forms").attr("action",apiurl); $("#forms").submit();
------------------------------
ANDROID: 
var param = 'INDEX='+4;Boqii.Jump("com.boqii.petlifehouse.activities.MyCouponActivity", param);```
###H5 跳个人中心
```  
IOS:
var ios_url = "bqimallapp://myCenterViewController";$("#forms").attr("action",apiurl);$("#forms").submit();
------------------------------
ANDROID: 
var param = 'INDEX='+4;Boqii.Jump("com.boqii.petlifehouse.activities.MainActivity", param);```



