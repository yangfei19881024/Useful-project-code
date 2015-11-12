function foo(name,age){
	a =2;
	this.bar();
}

function bar(){
	console.log(this.a); //2
}
foo(1,2);