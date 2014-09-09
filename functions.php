<?php

	/**
	 * Prints/load cached page.
	 * @param string $template The dynamic page to cache.
	 * @param integer $uid The user ID (security precaution to prevent collissions).
	 * @param array $vars Set of variables passed to dynamic page.
	 */
	function cache_page($template,$uid,$vars){
	    $cache='public/'.$uid.'.html';
	    if(!file_exists()){
	        // set the value of a variable.
	        foreach($vars as $name=>$value)$$name=$value;
	        // start output buffering and render page
	        ob_start();
	        include_once $template;
	        // end output buffering and save data to cache file
	        file_put_contents($cache,ob_get_clean());
	    }
	    readfile($cache);
	}

?>