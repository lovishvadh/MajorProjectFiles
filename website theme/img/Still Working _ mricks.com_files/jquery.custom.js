/*-----------------------------------------------------------------------------------

 	Custom JS - All front-end jQuery
 
-----------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------*/
/*	Let's get ready!
/*-----------------------------------------------------------------------------------*/

jQuery(document).ready(function($) { 

	$('html').removeClass('no-js');
 
/*-----------------------------------------------------------------------------------*/
/*	Superfish Settings - http://users.tpg.com.au/j_birch/plugins/superfish/
/*-----------------------------------------------------------------------------------*/

	$('#primary-menu')
		.superfish({
			delay: 200,
			animation: {opacity:'show', height:'show'},
			speed: 'fast',
			cssArrows: false,
			disableHI: true
		});

	
/*-----------------------------------------------------------------------------------*/
/*	Overlay States
/*-----------------------------------------------------------------------------------*/
	
	var portfolioItems = $('#portfolio-items li');
	var portfolioItemsEnabled = $('#portfolio-items.enabled li');
	var imageItems = $('.post-thumb');
	
	portfolioItems.hover( function () {
		$(this).not('.active, .invisible').find('.overlay').fadeIn(150);
	}, function () {
		$(this).not('.active, .invisible').find('.overlay').fadeOut(150);
	});
	
	imageItems.hover( function () {
		$(this).not('.active, .invisible').find('.overlay').fadeIn(150);
	}, function () {
		$(this).not('.active, .invisible').find('.overlay').fadeOut(150);
	});
	
/*-----------------------------------------------------------------------------------*/
/*	Portfolio Image Sorting
/*-----------------------------------------------------------------------------------*/

	var portfolioTerms = $('#portfolio-terms a');	
	var portfolioTermsAll = $('#portfolio-terms a.all');
	var magicDoor = $('#door-frame')
	var url = magicDoor.find('#magic-door').attr('data-url');
	
	if(magicDoor.hasClass('open') && $('#portfolio-items').hasClass('enabled')) {
		
		var postId = magicDoor.attr('data-id');
		
		portfolioItems.removeClass('active');
		$('#portfolio-' + postId).addClass('active');
		portfolioItems.not('.active').find('.overlay').css({ display: 'none' });
			
		tz_getPortfolio(postId);
	}
	
	/*	Sort it out! */
	function tz_sortPortfolios(cat) {

		if(portfolioItems.hasClass(cat)) {
			
			portfolioItems
				.not('.'+cat)
				.removeClass('visible')
				.addClass('invisible')
				.find('.hentry')
				.stop()
				.animate({
					opacity: 0
				}, 200);
			
			$('.'+cat)
				.addClass('visible')
				.removeClass('invisible')
				.find('.hentry')
				.stop()
				.animate({
					opacity: 1
				}, 200);
		}
		
	}
	
	
	portfolioTerms.click( function(e) { 
	
		var cat = $(this).attr('data-value')
		
		tz_sortPortfolios(cat);
		portfolioTerms.removeClass('active');
		$(this).addClass('active');
		
		e.preventDefault();

	});
	
	/*	When All is clicked */
	portfolioTermsAll.click( function(e) { 	
		
		portfolioItems
			.addClass('visible')
			.removeClass('invisible')
			.find('.hentry')
			.stop()
			.animate({
				opacity: 1
			}, 200);
			
		return false;
		
	});
	
	/*	When a portfolio item is clicked */
	portfolioItemsEnabled.click( function (e) {
		
		if(!$(this).hasClass('active') && $(this).hasClass('visible')) {
				
			portfolioItems.removeClass('active');
			$(this).addClass('active');
			portfolioItems.not('.active').find('.overlay').css({ display: 'none' });

			var postId = $(this).attr('id').split('portfolio-')[1];
			
			tz_getPortfolio(postId);
			
		}
		
		e.preventDefault();
		
	});
	
	function tz_changeNextPrev(postId) {
		
		var next = tz_getNext(postId)
		var prev = tz_getPrev(postId)
		
		$('#next-post').attr('data-id', next);
		$('#prev-post').attr('data-id', prev);
	}
	
	function tz_getPortfolio(postId, dontGet) {
		
		if(!dontGet)
			dontGet = false;
		
		var next = tz_getNext(postId);
		var prev = tz_getPrev(postId);
		
		if(dontGet == false) {
			
			var loader = $('#loading');
			
			loader.fadeIn(200);
			
			tz_closeDoor();
			
			magicDoor.find('#magic-door').load(url, {
				id: postId,
				next: next,
				prev: prev
			}, function() {
			
				tz_portfolioInit();
				tz_sliderInit();
				tz_openDoor();
				loader.fadeOut(200);
				
			});
			
		}
			
		$.scrollTo('#header', 500);
	}
	
	function tz_closeDoor() {
		
		if(magicDoor.height() != 0 ) {
			
			magicDoor.find('.inner').stop(true).animate({
				opacity: 0
			}, 200);
			
			magicDoor.stop(true).animate({
				height: 0
			}, 600, 'easeOutQuart');
		}
		
	}
	
	function tz_openDoor() {
		
		magicDoor.stop(true).animate({
			height: magicDoor.find('#magic-door').outerHeight()
		}, 800, 'easeOutQuart', function () {

			magicDoor.css({
				height: 'auto'
			});
	
		});
	}
	
	//tz_openDoor();
	
	function tz_getNext(postId) {
		
		var next = $('#portfolio-items li.visible').first().attr('id').split('portfolio-')[1];

		//has next var
		var hasNext = $('#portfolio-' + postId).next();
		
		//if there is a next object
		if(hasNext.length != 0) {
			
			while(hasNext.hasClass('visible') == false && hasNext.length != 0) {
				hasNext = hasNext.next();
			}
			
			if(hasNext.length != 0) {
				var next = hasNext
						.attr('id').split('portfolio-')[1];
			}
		}
		
		return next;
	}
	
	function tz_getPrev(postId) {
		
		var prev = $('#portfolio-items li.visible').last().attr('id').split('portfolio-')[1];

		//has next var
		var hasPrev = $('#portfolio-' + postId).prev();
		
		//if there is a next object
		if(hasPrev.length != 0) {
			
			while(hasPrev.hasClass('visible') == false && hasPrev.length != 0) {
				hasPrev = hasPrev.prev();
			}
			
			if(hasPrev.length != 0) {
				var prev = hasPrev
						.attr('id').split('portfolio-')[1];
			}
		}
		
		return prev;
	}
	
	//Initialize the portfolio
	function tz_portfolioInit() {

		
		$('#next-post, #prev-post').click( function() {

			var postId = $(this).attr('data-id');
			
			portfolioItems.removeClass('active');
			$('#portfolio-' + postId).addClass('active');
			portfolioItems.not('.active').find('.overlay').css({ display: 'none' });
			$('#portfolio-' + postId).find('.overlay').fadeIn(150);

			tz_getPortfolio(postId);
			
			return false;
			
		});
		
		
		$('.portfolio-close a').click( function() { 
			
			magicDoor.stop().animate({
				height: 0
			}, 600, 'easeOutQuart', function() {
				magicDoor.find('#slider').remove(); 
			});
			
			portfolioItems.find('.overlay').fadeOut(150);
			portfolioItems.removeClass('active');
			
			return false;
			
		});
	}
	
/*-----------------------------------------------------------------------------------*/
/*	Slider
/*-----------------------------------------------------------------------------------*/

	function tz_sliderInit() {
		
		if($().slides) {
			
			$(".slider").css({ height: 'auto' });
			
			$(".slider").slides({
				generatePagination: true,
				effect: 'fade',
				crossfade: true,
				autoHeight: true,
				bigTarget: true,
				preload: true,
				preloadImage: $("#loader").attr('data-loader')
			});
			
			$("#slider").slides({
				generatePagination: true,
				effect: 'fade',
				crossfade: true,
				autoHeight: true,
				bigTarget: true
			});
		}
		
	}
	
	tz_sliderInit();
	
/*-----------------------------------------------------------------------------------*/
/*	PrettyPhoto Lightbox
/*-----------------------------------------------------------------------------------*/
	
	function tz_fancybox() {
		
		if($().fancybox) {
			$("a.lightbox").fancybox({
				'transitionIn'	:	'fade',
				'transitionOut'	:	'fade',
				'speedIn'		:	300, 
				'speedOut'		:	300, 
				'overlayShow'	:	true,
				'autoScale'		:	false,
				'titleShow'		: 	false,
				'margin'		: 	10
			});
		}
	}
	
	tz_fancybox();
	
	$("#tabs").tabs();
	$(".tabs").tabs();
	

/*-----------------------------------------------------------------------------------*/
/*	Tabs and Toggles
/*-----------------------------------------------------------------------------------*/

	function tz_tabs_and_toggles() {
    	$(".toggle").each( function () {
    		if($(this).attr('data-id') == 'closed') {
    			$(this).accordion({ header: 'h4', collapsible: true, active: false  });
    		} else {
    			$(this).accordion({ header: 'h4', collapsible: true});
    		}
    	});
	}
	tz_tabs_and_toggles();
	
/*-----------------------------------------------------------------------------------*/
/*	All done!
/*-----------------------------------------------------------------------------------*/

});

/*-----------------------------------------------------------------------------------*/
/*	Plugins!
/*-----------------------------------------------------------------------------------*/

/**
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.6
 */
;(function($){var h=$.scrollTo=function(a,b,c){$(window).scrollTo(a,b,c)};h.defaults={axis:'xy',duration:parseFloat($.fn.jquery)>=1.3?0:1,limit:true};h.window=function(a){return $(window)._scrollable()};$.fn._scrollable=function(){return this.map(function(){var a=this,isWin=!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!isWin)return a;var b=(a.contentWindow||a).document||a.ownerDocument||a;return/webkit/i.test(navigator.userAgent)||b.compatMode=='BackCompat'?b.body:b.documentElement})};$.fn.scrollTo=function(e,f,g){if(typeof f=='object'){g=f;f=0}if(typeof g=='function')g={onAfter:g};if(e=='max')e=9e9;g=$.extend({},h.defaults,g);f=f||g.duration;g.queue=g.queue&&g.axis.length>1;if(g.queue)f/=2;g.offset=both(g.offset);g.over=both(g.over);return this._scrollable().each(function(){if(e==null)return;var d=this,$elem=$(d),targ=e,toff,attr={},win=$elem.is('html,body');switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=$(targ,this);if(!targ.length)return;case'object':if(targ.is||targ.style)toff=(targ=$(targ)).offset()}$.each(g.axis.split(''),function(i,a){var b=a=='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,old=d[key],max=h.max(d,a);if(toff){attr[key]=toff[pos]+(win?0:old-$elem.offset()[pos]);if(g.margin){attr[key]-=parseInt(targ.css('margin'+b))||0;attr[key]-=parseInt(targ.css('border'+b+'Width'))||0}attr[key]+=g.offset[pos]||0;if(g.over[pos])attr[key]+=targ[a=='x'?'width':'height']()*g.over[pos]}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)=='%'?parseFloat(c)/100*max:c}if(g.limit&&/^\d+$/.test(attr[key]))attr[key]=attr[key]<=0?0:Math.min(attr[key],max);if(!i&&g.queue){if(old!=attr[key])animate(g.onAfterFirst);delete attr[key]}});animate(g.onAfter);function animate(a){$elem.animate(attr,f,g.easing,a&&function(){a.call(this,targ,g)})}}).end()};h.max=function(a,b){var c=b=='x'?'Width':'Height',scroll='scroll'+c;if(!$(a).is('html,body'))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,html=a.ownerDocument.documentElement,body=a.ownerDocument.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);