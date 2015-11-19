// function foo(name,age){
// 	a =2;
// 	this.bar();
// }

// function bar(){
// 	console.log(this.a); //2
// }
// foo(1,2);

// function baz(){
// 	console.log("baz");
// 	bar();
// }

// function bar(){
// 	console.log("bar");
// 	foo();
// }

// function foo(){
// 	console.log("foo");
// }

// baz();

function foo(){
	console.log(this.a);
}

var obj = {
	a:2,
	foo:foo
}

var bar = obj.foo;

var a = "hello";

bar();
