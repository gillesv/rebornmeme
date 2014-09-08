$(document).ready(function(){
	if(!Modernizr.canvas) {
		alert("No canvas support detected — please upgrade your browser");
	
		return false;
	}
	
	var $canvas = $('#meme'),
		$upload = $('#upload'),
		$editorUI = $('#editorUI'),
		$rebornLogo,
		context2d = $canvas[0].getContext('2d'),
		canvas_w = canvas_h = 512,
		original_image,
		scale = 1.0,
		center = { x: 0, y: 0},
		offset = { x:0, y:0 };
	
	// events
	document.getElementById('uploadimage').addEventListener('change', getUserImage, false);
	document.getElementById('scale_slider').addEventListener('change', onScaleChange, false);
	
	/*
	 * render
	 */
	function render() {
		if(!context2d) {
			return false;
		}
		
		// clear canvas by setting its width to its width (LOGICAL)
		$canvas[0].width = $canvas[0].width;
		
		// draw the image
		context2d.drawImage(original_image, center.x + offset.x, center.y + offset.y, original_image.width*scale, original_image.height*scale);
		
		// lazy init the reborn branding
		if(!$rebornLogo) {
			$rebornLogo = $('#rebornLogo');
		}
		
		context2d.drawImage($rebornLogo[0], 0, 0, canvas_w, canvas_h);
	}
	
	/*
	 * getUserImage: get the user's image via the HTML5 File API (TODO: fallback with temporary file upload)
	 */
	function getUserImage(evt){
		original_image = new Image();
		
		var f = document.getElementById('uploadimage').files[0],
			url = window.URL || window.webkitURL,
			src = url.createObjectURL(f);
			
		original_image.src = src;
		original_image.onload = function() {
			var dim = {
					w: original_image.width,
					h: original_image.height
			},
				resize = calculateAspectRatioCover(dim.w, dim.h, canvas_w, canvas_h);
				
			scale = resize.width / dim.w;
			
			document.getElementById('scale_slider').min = document.getElementById('scale_slider').value = scale;
			document.getElementById('scale_slider').max = scale*2;
			
			// calculate initial offset to center within crop
			center.x = (canvas_w - resize.width)/2;
			center.y = (canvas_h - resize.height)/2;
						
			url.revokeObjectURL(src);
			
			initEditor();
		}
	}
	
	/*
	 * init the editor and enable the editing controls
	 */
	function initEditor() {
		$upload.toggleClass('hidden', true);
	
		if(!Modernizr.touch) {
			initEditorUI();
		} else {
			// do something else	
		}
	
		render();
	}
	
	/*
	 * show device-appropriate UI for scaling/cropping image
	 */
	function initEditorUI() {
		$editorUI.toggleClass('hidden', false);
	}
	
	/*
	 * scale image
	 */
	function onScaleChange(evt){
		scale = document.getElementById('scale_slider').value;
		
		center.x = (canvas_w - (original_image.width*scale))/2;
		center.y = (canvas_h - (original_image.height*scale))/2;
		
		render();
	}
	
	/*
	 * save image
	 */
	function saveImage(evt) {
		
	}
	
	/*********** HELPERS ************/
	
	function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
		var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
		
	    return { width: srcWidth*ratio, height: srcHeight*ratio };
	}
	
	function calculateAspectRatioCover(srcWidth, srcHeight, maxWidth, maxHeight) {
		var ratio,
			returner = { width: srcWidth, height: srcHeight };
		
		if(returner.width > maxWidth) {
			ratio = maxWidth/returner.width;
			returner.width = returner.width*ratio;
			returner.height = returner.height*ratio;
		}
		
		if(returner.height < maxHeight) {
			ratio = maxHeight/returner.height;
			
			returner.width = returner.width*ratio;
			returner.height = returner.height*ratio;
		}
		
		if(returner.height > maxHeight) {
			ratio = maxHeight/returner.height;
			returner.width = returner.width*ratio;
			returner.height = returner.height*ratio;
		}
		
		if(returner.width < maxWidth) {
			ratio = maxWidth/returner.width;
			
			returner.width = returner.width*ratio;
			returner.height = returner.height*ratio;
		}
		
		return returner;
	}
});