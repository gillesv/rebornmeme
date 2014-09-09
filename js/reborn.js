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
		canvas_w = 512,
		canvas_h = 512,
		original_image,
		scale = 1.0,
		center = { x: 0, y: 0},
		offset = { x:0, y:0 };

	// events
	document.getElementById('uploadimage').addEventListener('change', getUserImage, false);
	
	document.getElementById('scale_slider').addEventListener('change', onScaleChange, false);
	document.getElementById('btnsave').addEventListener('click', saveImage, false);
	document.getElementById('btnreset').addEventListener('click', resetEditor, false);
	
	/*
	 * render
	 */
	function render() {
		if(!context2d) {
			return false;
		}
		
		// clear canvas by setting its width to its width (LOGICAL)
		$canvas[0].width = $canvas[0].width;
		
		if(original_image !== null) {
		
			// limit the dragging to keep the image in frame
			var xpos = Math.max(-1 * (original_image.width*scale - canvas_w), Math.min(0, center.x + offset.x)),
				ypos = Math.max(-1 * (original_image.height*scale - canvas_h), Math.min(0, center.y + offset.y));
		
			// draw the image
			context2d.drawImage(original_image, xpos, ypos, original_image.width*scale, original_image.height*scale);
			
			// lazy init the reborn branding
			if(!$rebornLogo) {
				$rebornLogo = $('#rebornLogo');
			}
			
			context2d.drawImage($rebornLogo[0], canvas_w - $rebornLogo.width(), canvas_h - $rebornLogo.height());			
		}
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
		$canvas.toggleClass('active', true);	// show dragging hand cursor
		
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
	
	function resetEditor(evt) {
		evt.preventDefault();
		
		original_image = null;
		scale = 1.0,
		center = { x: 0, y: 0},
		offset = { x:0, y:0 };
		
		render();
		
		$canvas.toggleClass('active', true);	// don't show dragging hand cursor
		$upload.toggleClass('hidden', false);		
		$editorUI.toggleClass('hidden', true);
	}
	
	/*
	 * save image
	 */
	function saveImage(evt) {
		evt.preventDefault();
		
		var uid = guid().toString();
		
		$.ajax({
			type: "POST",
			url: "save-image.php",
			data: { 
				guid: uid, 
				image: $canvas[0].toDataURL() 
			},
			success: function(result) {
				// redirect
				window.location = 'public/' + uid + '.html';
			}
		})
		
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

/*
 * GUID (Generated Unique IDentifier) generator — use as: var id = guid();
 */
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();