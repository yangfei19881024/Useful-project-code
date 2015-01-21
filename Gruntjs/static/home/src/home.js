(function(){

	function abc(){
		
		for( var i=0;i<10;i++ ){

			document.getElementById('btn').onclick = (function(){

				document.getElementById('div').innerHTML = i;

			})(i)

		}
	}


	abc();

})(home);