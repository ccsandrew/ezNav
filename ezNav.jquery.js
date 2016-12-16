/*
	Plugin: ezNav 
	Version: 1.0.0
	Author: andrew.russell@gd-ms.com
	Dependencies: jQuery, but optimal presentation should include Bootstrap 3 css.  
	basic HTML needed: (note that .navigation-links, and its containing .row, can be omitted.)
		<div class="ezNav">
		    <ul class="index">
		        <li>index header 1</li>
		        <li>index header 2</li>
		        <li>index header 3</li>
		    </ul>
			<div class="row">
			    <div class="col-md-4"></div>
			    <div class="col-md-4 navigation-links"></div>
			    <div class="col-md-4"></div>
			</div>
		    <ul class="content">
		        <li>content of first</li>
		        <li>content of second</li>
		        <li>content of third</li>
		    </ul>
		</div>	
 */
;( function($){
	

	var defaultOptions = {
		contentClass : "bg-info roundedRow",
		navInContents: false,
		hideContent: false
	};

    function Plugin(element, userOptions) {

    	var self = this;
    	self.plugin_id = PLUGIN_NAME + "-" + (++plugin_count);
    	//$.extend() doesn't overwrite booleans or strings, need to do that manually.
    	for (var prop in defaultOptions){
    		if(userOptions[prop] === undefined) { 
    			userOptions[prop] = defaultOptions[prop];
    		}
    	}
    	self.options = userOptions;
	    //things that must be in the DOM
	    self.$root = $(element).prop("id", self.plugin_id).addClass(PLUGIN_NAME);
	    self.$idx = self.$root.find(".index");
	    self.$cnt = self.$root.find(".content");
	    self.$nav = self.$root.find(".navigation-links");
	    self.$indicies = self.$root.find("ul.index > li, ol.index > li");
	    self.$contents = self.$root.find("ul.content > li, ol.content > li");

	    //these get generated for the dom
		self.$linkPrev = $("<a href='#prev' class='link prev'><span class='glyphicon glyphicon-backward'></span> Previous</a>");
		self.$linkNext = $("<a href='#next' class='link next pull-right'>Next <span class='glyphicon glyphicon-forward'></span></a>");
		self.$cntWrapper = $("<div class='ezNav-content-wrapper'></div>");

		var $linksPrevSelection;
		var $linksNextSelection;


	    self.methods = {

	    	init: function (callback)  {
			    self.$contents.each(function(i,e){
			    	var $e = $(e);
			    	$e.hide();
			    	$e.prop("id", self.methods.idScheme(i) );
			    });
			    self.$indicies.each(function(i,e){
			    	var $e = $(e);
			    	var $a = $("<a></a>");
			    	$a.html( $e.html() );
			    	$a.addClass("link");
			    	$a.prop("href", "#" + self.methods.idScheme(i));
			    	$a.data("navtoid", self.methods.idScheme(i) );
			    	$e.html($a);
			    });
				self.$linkNext.on("click.shiftnav", function(event) {
					self.methods.shiftNav.call(this, event, "next");
				});
				self.$linkPrev.on("click.shiftnav", function(event) {
					self.methods.shiftNav.call(this, event, "prev");
				});
				self.$nav.prepend(self.$linkNext)
					.prepend(self.$linkPrev);
				$linksPrevSelection = self.$root.find(".navigation-links .prev");
				$linksNextSelection = self.$root.find(".navigation-links .next");
			    self.$indicies.on("click.directnav", "a.link", function(event) {
			    	self.methods.directNav.call(this, event);
			    });	    		
			    self.$cntWrapper.addClass(self.options.contentClass);
			    self.$cnt.wrap( self.$cntWrapper );
				    
			    callback();
	    	},

	    	ready: function(options) {		
	    		$("ul.content, ul.content ul").css({
				    "-webkit-padding-start" : "0",
				    "-moz-padding-start" : "0",
				    "list-style-type" : "disc"    			
	    		});
	    		$linksPrevSelection.hide();
	    		if (!self.options.hideContent) {
	    			self.$contents.first().show();
	    		}
	    	},

	    	idScheme : function(i) {
	    		return self.plugin_id +"-id-" + i;
	    	},

	    	nav: function(id) {
	  			self.$contents.hide();  
	  			self.$cnt.find("#"+id).show();
	  			 
	    	},

	    	directNav : function(event) {
	    		event.preventDefault();  //so it doesn't 'jump' around
	    		var $target = $(event.target);
	    		var navtoid = $target.data("navtoid");
	    		self.methods.nav(navtoid);
	    		self.methods.setNavButtons(navtoid);
	 		
	    	},

	    	shiftNav: function(event, shiftDirection) {
	    		var $this = $(this);
	    		var $current = self.$contents.filter(":visible");
	    		var $shift = $current[shiftDirection]();
	    		var targetId = $shift.prop("id");
	    		self.methods.nav(targetId);
	    		self.methods.setShiftNavButton($this, $shift, shiftDirection);

	    	},

	    	setNavButtons: function(id) {
	    		var $shift = self.$cnt.find("#"+id);
	    		if ($shift.next().length > 0 ) {$linksNextSelection.show();} else { $linksNextSelection.hide();}
	    		if ($shift.prev().length > 0 ) {$linksPrevSelection.show();} else { $linksPrevSelection.hide();}
	    	},

	    	setShiftNavButton: function($this, $shift, shiftDirection) {
	    		// var $siblings = $this.siblings(".link");
	    		// if ($shift[shiftDirection]().length <= 0) {
	    		// 	$this.hide();  
	    		// }
	    		// $siblings.show();
	    		var $current = self.$contents.filter(":visible");
	    		self.methods.setNavButtons($current.prop("id"));
	    	}


	    };


	    self.methods.init( self.methods.ready );

	}


	var PLUGIN_NAME = "ezNav";
	var plugin_count = 0;   
	//register the plugin with the jQuery object
    $.fn[PLUGIN_NAME] = function(options) {

        return new Plugin(this, options); 
    };
    
    
})(jQuery)