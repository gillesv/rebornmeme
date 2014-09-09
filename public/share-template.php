<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<title>Reborn Share Page</title>
	
	<meta name="viewport" content="width=532" />
	
	<style>
	
		body, html {
			font-family: sans-serif;
		}
		
		body {
			padding: 10px;
		}
		
		#main {
			max-width: 512px;
			margin: 0 auto;
		}
		
		#meme {
			background: #ccc;
			display: block;
			width: 100%;
		}
		
		.hidden {
			display: none;
		}
		
		img {
			max-width: 100%;
			display: block;
		}
		
	</style>
</head>
<body>
	
	<div id="main">
		<div id="meme">
			<img id="<?php echo $guid; ?>" src="../uploads/<?php echo $guid; ?>.png" alt="Reborn" />
		</div>
	
		<div id="share">
			<a href="#">Share this on Facebook</a> <br />
			<a href="#">Share this on Twitter</a> <br />
			<a href="#">Share this on Pinterest</a> <br />
			<a href="#">Share this on Google+</a> <br />
			<a href="#">Share this on Tumblr</a>
		</div>
	</div>
	
</body>
</html>