$(function(){

	var fun1 = function(){

		var defer = $.Deferred();

		var task = function(){
			alert("task start");
			defer.reject();
		}
		// task();
		setTimeout(task,1000);

		return defer.promise();
	}

	
	$.when(fun1())
	.then(function(){
		aert("success");
	},function(){
		alert("error");
	})

});