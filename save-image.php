<?php
	// write generated image to server
	$guid = $_POST['guid'];
	$image = $_POST['image'];
	
	$uri = substr($image,strpos($image,",")+1);
	
	$uploaddir = 'uploads/';
	$uploadfile = $uploaddir . basename($guid . '.png');
	
	
	$encodedData = str_replace(' ','+',$uri);
	$decodedData = base64_decode($encodedData);
	
	file_put_contents($uploadfile, $decodedData);
?>