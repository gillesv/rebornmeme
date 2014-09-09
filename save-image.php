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
	
	/*
	$uploaddir = 'uploads';
	$uploadfile = $uploaddir . basename($_FILES['userfile']['name']);
	
	echo '<pre>';
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
	    echo "File is valid, and was successfully uploaded.\n";
	} else {
	    echo "Possible file upload attack!\n";
	}
	
	echo 'Here is some more debugging info:';
	print_r($_FILES);
	
	print "</pre>";
	*/
?>