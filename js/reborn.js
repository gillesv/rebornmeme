var $canvas,
	$upload,
	$editorUI,
	$rebornLogo,
	context2d,
	canvas_w = canvas_h = 512,
	original_image,
	scale = 1.0,
	center = { x: 0, y: 0},
	offset = { x:0, y:0 },
	
	
	renderfunction;

$(document).ready(function(){
	if(!Modernizr.canvas) {
		alert("No canvas support detected — please upgrade your browser");
	
		return false;
	}
	
	$canvas = $('#meme'),
	$upload = $('#upload'),
	$editorUI = $('#editorUI'),
	$rebornLogo,
	context2d = $canvas[0].getContext('2d'),
	canvas_w = canvas_h = 512,
	original_image,
	scale = 1.0,
	center = { x: 0, y: 0},
	offset = { x:0, y:0 };
	
	renderfunction = render;

	// events
	document.getElementById('uploadimage').addEventListener('change', getUserImage, false);
	
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
				resize = { width:  dim.w, height: dim.h}; //calculateAspectRatioCover(dim.w, dim.h, canvas_w, canvas_h);
				
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
		
		document.getElementById('scale_slider').addEventListener('change', onScaleChange, false);
		document.getElementById('btnsave').addEventListener('click', saveImage, false);
		
		// click & drag
		document.getElementById('meme').addEventListener('mousedown', onMemeMouseDown, false);
		document.addEventListener('mouseup', onMemeMouseUp, false);
	}
	
	var startDrag = { x:0, y:0 }
		dragging = { x:0, y:0 };
	
	function onMemeMouseDown(evt) {
		evt.preventDefault();
		
		startDrag.x = evt.clientX;
		startDrag.y = evt.clientY;
		
		document.getElementById('meme').addEventListener('mousemove', onMemeMouseMove, false);
	}
	
	function onMemeMouseMove(evt) {
		evt.preventDefault();
		
		dragging.x = evt.clientX - startDrag.x;
		dragging.y = evt.clientY - startDrag.y;
		
		offset.x = dragging.x;
		offset.y = dragging.y;
		
		render();
	}
	
	function onMemeMouseUp(evt) {
		center.x += offset.x;
		center.y += offset.y;
		
		offset.x = 0;
		offset.y = 0;
	
		document.getElementById('meme').removeEventListener('mousemove', onMemeMouseMove, false);
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
		evt.preventDefault();
	
		alert($canvas[0].toDataURL());
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