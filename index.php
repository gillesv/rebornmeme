<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Reborn Meme Generator</title>
	
	<script src="js/modernizr.js"></script>
	<script>
		//<![CDATA[
		
		Modernizr.load([
			'//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js',
			"js/reborn.js"
		]);
		//]]>
	</script>
	
	<style>
		
		#main {
			max-width: 512px;
			margin: 0 auto;
		}
		
		#meme {
		}
		
		form {
			border-radius: 5px;
			background: #ececec;
			padding: 20px;
		}
		
	</style>
	
</head>
<body>
	
	
	
	
	<div id="main">
	
		<form>
			<input type='file' name='img' size='65' id='uploadimage' />
		</form>
		
		<canvas id="meme" width="512" height="512">
		
		</canvas>
		
	</div>
	
</body>
</html>