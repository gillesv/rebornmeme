$(document).ready(function(){
	
	var $canvas = $("#meme"),
		canvas_w = canvas_h = 512,
		ctx = $canvas[0].getContext('2d');
	
	
	// triggered when user picks a file
	function getUserImage(ev) {
		var img = new Image(),
			f = document.getElementById('uploadimage').files[0],
			url = window.URL || window.webkitURL,
			src = url.createObjectURL(f);
			
		img.src = src;
		img.onload = function() {
			// scale the image
			var ratio = img.width / img.height,
				w = img.width,
				h = img.height;
			
			if(w > canvas_w) {
				ratio = canvas_w / w;
				h = h*ratio;
				w = w*ratio;
			}
			
			if(h > canvas_h) {
				ratio = canvas_h / h;
				w = w*ratio;
				h = h*ratio;
			}
			
			ctx.drawImage(img, 0, 0, w, h);
			url.revokeObjectURL(src);
		}
	}
	
	// TODO
	function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
		var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
		
	    return { width: srcWidth*ratio, height: srcHeight*ratio };
	}
	
	document.getElementById('uploadimage').addEventListener('change', getUserImage, false);
});