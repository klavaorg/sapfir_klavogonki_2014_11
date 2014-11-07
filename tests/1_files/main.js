// John Resig - http://ejohn.org/ - MIT Licensed
(function() {
    var cache = {};

    this._tpl = function _tpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.    	
        var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        _tpl(document.getElementById("_tpl__"+str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
      new Function("__data",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(__data){p.push('" +

        // Convert the template into pure JavaScript
str.replace(/[\r\t\n]/g, " ")
   .replace(/'(?=[^%]*%>)/g,"\t")
   .split("'").join("\\'")
   .split("\t").join("'")
   .replace(/<%=(.+?)%>/g, "',$1,'")
   .split("<%").join("');")
   .split("%>").join("p.push('")
   + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();

jQuery.fn.hint = function (blurClass) {
	  if (!blurClass) { 
	    blurClass = 'blur';
	  }

	  return this.each(function () {
	    // get jQuery version of 'this'
	    var $input = jQuery(this),

	    // capture the rest of the variable to allow for reuse
	      title = $input.attr('title'),
	      $form = jQuery(this.form),
	      $win = jQuery(window);

	    function remove() {
	      if ($input.val() === title && $input.hasClass(blurClass)) {
	        $input.val('').removeClass(blurClass);
	      }
	    }

	    // only apply logic if the element has the attribute
	    if (title) { 
	      // on blur, set value to title attr if text is blank
	      $input.blur(function () {
	        if (this.value === '') {
	          $input.val(title).addClass(blurClass);
	        }
	      }).focus(remove).blur(); // now change all inputs to title

	      // clear the pre-defined text when form is submitted
	      $form.submit(remove);
	      $win.unload(remove); // handles Firefox's autocomplete
	    }
	  });
	};
	
	
	
	// tipsy, facebook style tooltips for jquery
	// version 1.0.0a
	// (c) 2008-2010 jason frame [jason@onehackoranother.com]
	// released under the MIT license

	(function($) {
	    
	    function maybeCall(thing, ctx) {
	        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
	    };
	    
	    function Tipsy(element, options) {
	        this.$element = $(element);
	        this.options = options;
	        this.enabled = true;
	        this.fixTitle();
	    };
	    
	    Tipsy.prototype = {
	        show: function() {
	            var title = this.getTitle();
	            if (title && this.enabled) {
	                var $tip = this.tip();
	                
	                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
	                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
	                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);
	                
	                var pos = $.extend({}, this.$element.offset(), {
	                    width: this.$element[0].offsetWidth,
	                    height: this.$element[0].offsetHeight
	                });
	                
	                var actualWidth = $tip[0].offsetWidth,
	                    actualHeight = $tip[0].offsetHeight,
	                    gravity = maybeCall(this.options.gravity, this.$element[0]);
	                
	                var tp;
	                switch (gravity.charAt(0)) {
	                    case 'n':
	                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
	                        break;
	                    case 's':
	                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
	                        break;
	                    case 'e':
	                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
	                        break;
	                    case 'w':
	                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
	                        break;
	                }
	                
	                if (gravity.length == 2) {
	                    if (gravity.charAt(1) == 'w') {
	                        tp.left = pos.left + pos.width / 2 - 15;
	                    } else {
	                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
	                    }
	                }
	                
	                $tip.css(tp).addClass('tipsy-' + gravity);
	                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
	                if (this.options.className) {
	                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
	                }
	                
	                if (this.options.fade) {
	                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
	                } else {
	                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
	                }
	            }
	        },
	        
	        hide: function() {
	            if (this.options.fade) {
	                this.tip().stop().fadeOut(function() { $(this).remove(); });
	            } else {
	                this.tip().remove();
	            }
	        },
	        
	        fixTitle: function() {
	            var $e = this.$element;
	            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
	                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
	            }
	        },
	        
	        getTitle: function() {
	            var title, $e = this.$element, o = this.options;
	            this.fixTitle();
	            var title, o = this.options;
	            if (typeof o.title == 'string') {
	                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
	            } else if (typeof o.title == 'function') {
	                title = o.title.call($e[0]);
	            }
	            title = ('' + title).replace(/(^\s*|\s*$)/, "");
	            return title || o.fallback;
	        },
	        
	        tip: function() {
	            if (!this.$tip) {
	                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
	            }
	            return this.$tip;
	        },
	        
	        validate: function() {
	            if (!this.$element[0].parentNode) {
	                this.hide();
	                this.$element = null;
	                this.options = null;
	            }
	        },
	        
	        enable: function() { this.enabled = true; },
	        disable: function() { this.enabled = false; },
	        toggleEnabled: function() { this.enabled = !this.enabled; }
	    };
	    
	    $.fn.tipsy = function(options) {
	        
	        if (options === true) {
	            return this.data('tipsy');
	        } else if (typeof options == 'string') {
	            var tipsy = this.data('tipsy');
	            if (tipsy) tipsy[options]();
	            return this;
	        }
	        
	        options = $.extend({}, $.fn.tipsy.defaults, options);
	        
	        function get(ele) {
	            var tipsy = $.data(ele, 'tipsy');
	            if (!tipsy) {
	                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
	                $.data(ele, 'tipsy', tipsy);
	            }
	            return tipsy;
	        }
	        
	        function enter() {
	            var tipsy = get(this);
	            tipsy.hoverState = 'in';
	            if (options.delayIn == 0) {
	                tipsy.show();
	            } else {
	                tipsy.fixTitle();
	                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
	            }
	        };
	        
	        function leave() {
	            var tipsy = get(this);
	            tipsy.hoverState = 'out';
	            if (options.delayOut == 0) {
	                tipsy.hide();
	            } else {
	                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
	            }
	        };
	        
	        if (!options.live) this.each(function() { get(this); });
	        
	        if (options.trigger != 'manual') {
	            var binder   = options.live ? 'live' : 'bind',
	                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
	                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
	            this[binder](eventIn, enter)[binder](eventOut, leave);
	        }

            this.on('$destroy', function() {
                get(this).hide();
            });
	        
	        return this;
	        
	    };
	    
	    $.fn.tipsy.defaults = {
	        className: null,
	        delayIn: 0,
	        delayOut: 0,
	        fade: false,
	        fallback: '',
	        gravity: 'n',
	        html: false,
	        live: false,
	        offset: 0,
	        opacity: 0.8,
	        title: 'title',
	        trigger: 'hover'
	    };
	    
	    // Overwrite this method to provide options on a per-element basis.
	    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
	    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
	    // (remember - do not modify 'options' in place!)
	    $.fn.tipsy.elementOptions = function(ele, options) {
	        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
	    };
	    
	    $.fn.tipsy.autoNS = function() {
	        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
	    };
	    
	    $.fn.tipsy.autoWE = function() {
	        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
	    };
	    
	    /**
	     * yields a closure of the supplied parameters, producing a function that takes
	     * no arguments and is suitable for use as an autogravity function like so:
	     *
	     * @param margin (int) - distance from the viewable region edge that an
	     *        element should be before setting its tooltip's gravity to be away
	     *        from that edge.
	     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
	     *        if there are no viewable region edges effecting the tooltip's
	     *        gravity. It will try to vary from this minimally, for example,
	     *        if 'sw' is preferred and an element is near the right viewable 
	     *        region edge, but not the top edge, it will set the gravity for
	     *        that element's tooltip to be 'se', preserving the southern
	     *        component.
	     */
	     $.fn.tipsy.autoBounds = function(margin, prefer) {
			return function() {
				var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
				    boundTop = $(document).scrollTop() + margin,
				    boundLeft = $(document).scrollLeft() + margin,
				    $this = $(this);

				if ($this.offset().top < boundTop) dir.ns = 'n';
				if ($this.offset().left < boundLeft) dir.ew = 'w';
				if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
				if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

				return dir.ns + (dir.ew ? dir.ew : '');
			}
		};
	    
	})(jQuery);


jQuery(function($){
    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
            'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
            'Июл','Авг','Сен','Окт','Ноя','Дек'],
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        weekHeader: 'Не',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''};
    $.datepicker.setDefaults($.datepicker.regional['ru']);
});
	
	

var __test_log = {};
var __test_ver = 11;
var __test_log_cnt = 1;

/*** Sets a Cookie with the given name and value.
 *
 * name       Name of the cookie
 * value      Value of the cookie
 * [expires]  Expiration date of the cookie (default: end of current session)
 * [path]     Path where the cookie is valid (default: path of calling document)
 * [domain]   Domain where the cookie is valid
 *              (default: domain of calling document)
 * [secure]   Boolean value indicating if the cookie transmission requires a
 *              secure transmission
 */
function setCookie( name, value, expires, path, domain, secure )
{	
	var cookie = name + "=" + encodeURIComponent(value) +
		((expires) ? "; expires=" + expires.toUTCString() : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
	document.cookie = cookie;
}

/**
 * Gets the value of the specified cookie.
 *
 * name  Name of the desired cookie.
 *
 * Returns a string containing value of specified cookie,
 *   or null if cookie does not exist.
 */
function getCookie( name )
{
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf( "; " + prefix );
	if( begin == -1 )
	{
		begin = dc.indexOf( prefix );
		if( begin != 0 ) return null;
	}
	else
	{
		begin += 2;
	}
	var end = document.cookie.indexOf( ";", begin );
	if( end == -1 )
	{
		end = dc.length;
	}
	return decodeURIComponent(dc.substring( begin + prefix.length, end ));
}

/**
 * Deletes the specified cookie.
 *
 * name      name of the cookie
 * [path]    path of the cookie (must be same as path used to create cookie)
 * [domain]  domain of the cookie (must be same as domain used to create cookie)
 */
function deleteCookie( name, path, domain )
{
	if( getCookie( name ) )
	{
		document.cookie = name + "=" +
			((path) ? "; path=" + path : "") +
			((domain) ? "; domain=" + domain : "") +
			"; expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
}

var prefs_ver = 2;

function setPrefCookie( name, value )
{
	var raw = getCookie('__prefs'+prefs_ver);
	var cookies = new Object();
	if(raw)
	{
		var arr = raw.split('|');
		for(var i=0;i<arr.length;i++)
		{
			var m = arr[i].match('(.*)=(.*)');
			cookies[m[1]] = m[2];
		}
	}
	cookies[name] = value;
	
	var newarr = new Array();
	for(var i in cookies)
	{
		if(typeof cookies[i] != 'function')
			newarr.push(i+'='+cookies[i]);
	}
	
	var expires = new Date();
	expires.setTime( expires.getTime() + 3600*1000*24*365);
	setCookie('__prefs'+prefs_ver, newarr.join('|'), expires, '/');
}

function getPrefCookie( name )
{
	var raw = getCookie('__prefs'+prefs_ver);	
	if(!raw)
		return null;
	
	var arr = raw.split('|');
	for(var i=0;i<arr.length;i++)
	{
		var m = arr[i].match('(.*)=(.*)');
		if(m[1] == name)
			return m[2];
	}	
	return null;
}

function deletePrefCookie( name )
{
	var raw = getCookie('__prefs'+prefs_ver);
	var cookies = new Object();
	if(raw)
	{
		var arr = raw.split('|');
		for(var i=0;i<arr.length;i++)
		{
			var m = arr[i].match('(.*)=(.*)');
			if( m[1] != name )
				cookies[m[1]] = m[2];
		}
	}	
	var newarr = new Array();
	for(var i in cookies)
	{
		newarr.push(i+'='+cookies[i]);
	}
	
	var expires = new Date();
	expires.setTime( expires.getTime() + 3600*1000*24*365);
	setCookie('__prefs'+prefs_ver, newarr.join('|'), expires, '/');
}

// To cover IE 5.0's lack of the push method
if( typeof(Array.prototype.push) == 'undefined' )
{
	Array.prototype.push =
		function( fValue ) { this[this.length] = fValue; }
}
if( typeof(Array.prototype.indexOf) == 'undefined' )
{
	Array.prototype.indexOf = function(val)
	{
		for(var i=0;i<this.length;i++)
			if(this[i] == val)
				return i;
		return -1;
	}
}

if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}


Number.prototype.format = function()
{
	var result = Math.floor(this);
	if(result<10)
		return '0'+result;
	else
		return result;
}


if (!Prototype.Browser.IE) document.captureEvents(Event.MOUSEMOVE)
document.onmousemove = getMouseXY;
var mouseX = 0;
var mouseY = 0;
function getMouseXY(e)
{
	if (Prototype.Browser.IE) { // grab the x-y pos.s if browser is IE
	mouseX = event.clientX + document.documentElement.scrollLeft;
	mouseY = event.clientY + document.documentElement.scrollTop;
	}
	else {  // grab the x-y pos.s if browser is NS
	mouseX = e.pageX;
	mouseY = e.pageY;
	}  
	if (mouseX < 0){mouseX = 0;}
	if (mouseY < 0){mouseY = 0;}
	return true;
}

var WindowSize = {};
WindowSize.width =  function()
    {
        var myWidth = 0;
        if (typeof(window.innerWidth) == 'number')
        {
            //Non-IE
            myWidth = window.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientWidth)
        {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
        }
        else if (document.body && document.body.clientWidth)
        {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
        }
        return myWidth;
    };
WindowSize.height = function()
    {
        var myHeight = 0;
        if (typeof(window.innerHeight) == 'number')
        {
            //Non-IE
            myHeight = window.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight)
        {
            //IE 6+ in 'standards compliant mode'
            myHeight = document.documentElement.clientHeight;
        }
        else if (document.body && document.body.clientHeight)
        {
            //IE 4 compatible
            myHeight = document.body.clientHeight;
        }
        return myHeight;
    };
WindowSize.getPopupLeft = function(w)
    {	
	if(WindowSize.width() > w + mouseX + 5 - (document.body.scrollLeft ? document.body.scrollLeft : document.documentElement.scrollLeft) )
    		return mouseX+5+'px';
    	else
    		return mouseX-5-w+'px';
    };    
WindowSize.getPopupTop = function(h)
{
	if(WindowSize.height() > h + mouseY + 5 - (document.body.scrollTop ? document.body.scrollTop : document.documentElement.scrollTop) )
		return mouseY+5+'px';
	else
		return mouseY-5-h+'px';
};
WindowSize.setPopupPos = function(obj)
{
	obj.style.left = WindowSize.getPopupLeft(obj.getWidth());
	obj.style.top = WindowSize.getPopupTop(obj.getHeight());
};

function submitLogin(login,pass)
{
	var form = document.createElement('FORM');
	var redirect = window.location;
	form.setAttribute('action','/login?redirect='+encodeURI(redirect));
	form.setAttribute('method','POST');
	
	var element = document.createElement('INPUT');
	element.setAttribute('name','login');
	element.setAttribute('value',login);
	element.setAttribute('type','hidden');
	form.appendChild(element);
	
	var element = document.createElement('INPUT');
	element.setAttribute('name','pass');
	element.setAttribute('value',pass);
	element.setAttribute('type','hidden');
	form.appendChild(element);
	
	var element = document.createElement('INPUT');
	element.setAttribute('name','submit_login');
	element.setAttribute('value','1');
	element.setAttribute('type','hidden');
	form.appendChild(element);
	
	document.documentElement.appendChild(form);
	form.submit();
	
	$('register_block').hide();
}

function logout()
{
	var form = document.createElement('FORM');
	form.setAttribute('method','POST');
	
	var element = document.createElement('INPUT');
	element.setAttribute('name','submit_logout');
	element.setAttribute('value',1);
	element.setAttribute('type','hidden');
	form.appendChild(element);	
	
	document.documentElement.appendChild(form);
	form.submit();
}

function dbg(text) {
  ((window.console && console.log) ||
   (window.opera && opera.postError) ||
   window.alert).call(this, text);
}

function clone(obj)
{	
	if(obj == null || typeof(obj) != 'object')
        return obj;

	if (obj && typeof obj.length === 'number' &&
            !(obj.propertyIsEnumerable('length')) &&
            typeof obj.splice === 'function')
       var temp = new Array();
	else
		var temp = new Object();
    //var temp = new obj.constructor();
    for(var key in obj)
    {
        temp[key] = clone(obj[key]);
    }
    return temp;
}

function showProfile(id)
{	
	return;
	
	var obj = $('popup');
	var content = $('popup_content');
	if(profilesCache[id] == undefined)
	{		
		content.update(strLoading);
		profilesCache[id] = 0;
		new Ajax.Request('/profile/'+id+'.popup', {
			method: 'get',
			parameters: url_params,
			onSuccess: function(transport) {
				eval('var json='+transport.responseText+';');
				profilesCache[json.id] = json.html;
				$('popup_content').update(profilesCache[json.id]);
			}
		});
	}	
	else if(profilesCache[id] != 0)
	{
		content.update(profilesCache[id]);
	}
	obj.style.left = mouseX+10+'px';
	obj.style.top = mouseY+10+'px';
	obj.show();
}

function changeGametypeClick()
{
	$('gametype-link').hide();	
	var select = $('gametype-select');
	select.show();
	select.absolutize();
	select.style.width = 'auto';
	select.style.height = 'auto';
	select.focus();
}
function changeGametypeBlur()
{
	$('gametype-select').hide();
	$('gametype-link').show();	
}
function changeGametypeSelect()
{
	var select = $('gametype-select');
	var link = $('gametype-link');
	select.hide();
	var value = '';
	var name = '';
	for(var i=0;i<select.options.length;i++)
		if(select.options[i].selected)
		{
			value = select.options[i].value;
			var m = select.options[i].innerHTML.match(/^(.*) \(\d+\)$/);
			name = m[1];
		}
	link.update(name);
	
	var className = value;
	if(/voc-\d+/.test(className))
		className = 'voc';	
	link.className = 'gametype-'+className;
	$('gametype-mdash').className = 'gametype-'+className;
	
	link.show();
	
	loadGametype(value);	
}

function loadGametype(gametype)
{
	$('gametype-loading').show();	
	new Ajax.Request('/.userinfo',{
		method: 'post',
		parameters: {gametype: gametype},
		onSuccess: function(transport) { 
			$('stats-block').update(transport.responseText); 
			$('gametype-loading').hide();
		}});
	var expires = new Date();
	expires.setTime( expires.getTime() + 7*24*3600*1000 ); 
	setPrefCookie('stats_gametype',gametype);
	
}

function show_popup(id)
{	
	$(id).setStyle({height: '2000px', width: $(document.body).getWidth()+'px'});
	if(Prototype.Browser.IE)
		$$('#'+id+' .back').each(function(el) { $(el).setStyle({filter: 'progid:DXImageTransform.Microsoft.Alpha(opacity=50)'}); }); 
	$(id).show();
	$(id).select('input[type=button]')[0].focus();
}

var _popalert_callback = null;
function popalert(msg, params)
{
	if(!$('popalert'))
	{
		setTimeout(function(){popalert(msg,params);}, 300);
		return;
	}
	_popalert_callback = null;
	if(params && params.callback)
		_popalert_callback = params.callback;
	$('popalert-content').update(msg);	
	show_popup('popalert');
}

function popconfirm(msg, callback)
{
	if(!$('popconfirm'))
	{
		setTimeout(function(){popconfirm(msg,callback);}, 300);
		return;
	}
	$('popconfirm-content').update(msg);
	$('popconfirm-btn-ok').onclick = function()
	{
		if(callback == null)
			$('popconfirm').hide();
		else
		{
			var result = callback();
			if(result)
				$('popconfirm-btn-ok').disabled = true;
			else
				$('popconfirm').hide();
		}
	};
	
	$('popconfirm-btn-ok').disabled = false;
	show_popup('popconfirm');
}

function getImgOriginalWidth(img_element)
{
	var t = new Image();
	t.src = (img_element.getAttribute ? img_element.getAttribute("src") : false) || img_element.src;
	return t.width;
}

Number.prototype.toHex = function()
{
	var hex = this.toString(16);
	if(hex.length<2)
		hex = '0'+hex;
	return hex;
};

colortools = function () {};
colortools.getBrightness = function(color)
{
	var r = parseInt(color.substr(1,2), 16);
	var g = parseInt(color.substr(3,2), 16);
	var b = parseInt(color.substr(5,2), 16);
		
	return (r*299 + g*587 + b*114)/1000/255;
};

colortools.capByBrightness = function(color, cap)
{
	if(cap == undefined)
		cap = 0.5;
	var brightness = colortools.getBrightness(color);
	if(brightness <= cap)
		return color;
	
	var r = parseInt(color.substr(1,2), 16);
	var g = parseInt(color.substr(3,2), 16);
	var b = parseInt(color.substr(5,2), 16);
	
	var diff = brightness - cap;
	
	r -= r*diff;
	b -= b*diff;
	g -= g*diff;
	
	return '#'+parseInt(r).toHex()+parseInt(g).toHex()+parseInt(b).toHex();
};

/*var now = new Date();
var bt = Math.round(now.getTime()/1000 - 28);
var speed = Math.floor(300 * 60 / (new Date().getTime()/1000 - bt));
setTimeout( function()
	{
		var speed2 = Math.floor(300 * 60 / (new Date().getTime()/1000 - bt));
		alert(speed+' '+speed2);
	}, 500);*/



var _top_popup_close_callback = null;
var _top_popup_btn_callback = null;
function top_popup(text, btn, btn_callback, close_callback)
{
	$$('#top-popup .content').each( function(el){ el.update(text); } );
	if(btn)
		$$('#top-popup .right input').each( function(el){ el.value = btn; el.show(); } );
	else
		$$('#top-popup .right input').each( function(el){ el.hide(); } );
	_top_popup_close_callback = close_callback;
	_top_popup_btn_callback = btn_callback;
	
	$('top-popup').show();
	
	new Effect.Move('top-popup', {x: 0, y: 0, mode: 'absolute'});
	
}
function close_top_popup()
{
	new Effect.Move('top-popup', {x:0, y:-50, mode: 'relative'}); 
	if(typeof _top_popup_close_callback == 'function') 
		_top_popup_close_callback();
}

function IEAlert()
{
	if( !getCookie('IEAlert') )
	{	
		$('top-popup').style.position = 'absolute';
		top_popup('Вы используете браузер Internet Explorer версии 6.0 или ниже. Это устаревшая версия браузера, в которой некоторые функции сайта могут работать некорректно.',
				  'Обновить Internet Explorer',
				  function()
				  {
					window.location = 'http://www.microsoft.com/rus/windows/internet-explorer/default.aspx';
				  },
				  function()
				  {
					  var expires = new Date();
					  expires.setTime(expires.getTime() + 3*3600*1000);
					  setCookie('IEAlert',1,expires,'/');
				  });
		
	}
}

function OperaAlert()
{
	if( !getCookie('OperaAlert') )
	{	
		top_popup('Вы используете браузер Opera устаревшей версии, некоторые функции сайта могут работать некорректно. Пожалуйста, обновите браузер для увеличения производительности.',
				  'Обновить Opera',
				  function()
				  {
					window.location = 'http://ru.opera.com/';
				  },
				  function()
				  {
					  var expires = new Date();
					  expires.setTime(expires.getTime() + 3*24*3600*1000);
					  setCookie('OperaAlert',1,expires,'/');
				  });
		
	}
}

var invite = null;
var closed_invites = new Array();
var invite_timeout_interval = null;
function showInvite()
{
	if(closed_invites.indexOf(invite.timestamp) != -1)
		return;
	if(invite.gamestatus == 'racing')
		return;
	var avatar = '';
	if(invite.invited_by.avatar)
		avatar = 'style="padding-left: 20px; background: transparent url(\''+invite.invited_by.avatar+'\') no-repeat 0% 0%;"';

	var type_html = '';
	if(invite.type == 'normal')
		type_html = 'открытой игре';
	if(invite.type == 'private')
		type_html = 'игре с друзьями';
	
	var timeout_html = '';
	/*if(invite.gamestatus == 'waiting')
	{
		var now = new Date();
		var begintime_client = (invite.begintime - invite.timestamp) * 1000 + now.getTime();
		var time_remaining = invite.begintime - invite.timestamp;
		if(time_remaining<0)
			return;
		var min = Math.floor(time_remaining / 60).format();
		var sec = (time_remaining % 60).format();
		timeout_html = ' Старт через <span id=invite_timeout>'+min+':'+sec+'</span>.';
		invite_timeout_interval = setInterval(function()
		{
			var now = new Date();
			var time_remaining = (begintime_client - now.getTime())/1000;
			var min = Math.floor(time_remaining / 60).format();
			var sec = (time_remaining % 60).format();
			$('invite_timeout').update(min+':'+sec);
		}, 300);
	}*/
	
	var text = '<span style="font-size: 13px;">Пользователь <a href="/profile/'+invite.invited_by.id+'/" '+avatar+'>'+invite.invited_by.login+'</a> приглашает вас присоединиться к '+type_html+' '+invite.gametype_html+'.'+timeout_html+'</span>';
	var btn_text = 'Присоединиться';
	var btn_act = function()
	{
		new Ajax.Request('/g/'+invite.game_id+'.inviteReceive');
		window.location = '/g/?gmid='+invite.game_id;
	}
	var close_act = function()
	{
		closed_invites.push(invite.timestamp);
		new Ajax.Request('/g/'+invite.game_id+'.inviteReceive');
	}
	top_popup(text, btn_text, btn_act, close_act);
}

var mail_popup = null;
function showMailPopup()
{
	
	var text = '<span style="font-size: 13px;">Вам пришло личное сообщение от пользователя '+mail_popup.name+'.</span>';
	var btn_text = 'Прочитать';
	var btn_act = function()
	{		
		window.location = '/profile/'+__user__+'/mail/in/';
	}
	top_popup(text, btn_text, btn_act);
}


function initLoginForm()
{
	$$('#login-form .close').last().observe('click', function()
	{
		$('login-form').hide();
	});
	/*$$('#login-form .close').last().observe('mousemove', function()
	{
		this.addClassName('close_hover');
	});
	$$('#login-form .close').last().observe('mouseout', function()
	{
		this.removeClassName('close_hover');
	});*/
}

function changePin()
{
	if( getPrefCookie( 'userpanel_pinned' ) )
	{
		deletePrefCookie( 'userpanel_pinned' );
		$$('.userpanel').last().style.position = 'static';
        $$$('.userpanel').removeClass('pinned');
		$('pin').removeClassName('active');
		$('userpanel-dummy').hide();
	}
	else
	{
		 var expires = new Date();
		  expires.setTime( expires.getTime() + 3*365*24*3600*1000 );
		  setPrefCookie( 'userpanel_pinned', 1 );
		  $$('.userpanel').last().style.position = 'fixed';
          $$$('.userpanel').addClass('pinned');
		  $('pin').addClassName('active');
		  $('userpanel-dummy').show();
	}
}



// Effect.NumberChange

Effect.NumberChange = Class.create();
Object.extend(Object.extend(Effect.NumberChange.prototype,
  Effect.Base.prototype), {
	initialize: function(element, val) {
	  
	  var options = arguments[2] || {};	  

	  this.element = $(element);

	  this.startVal = parseInt(this.element.innerHTML);
	  

	  this.finishVal = val;
	  this.delta = (this.finishVal-this.startVal);
	  var defaultDuration = Math.abs(this.delta * 1.5 / 100);
	  options.duration = options.duration || (defaultDuration > 2 ? 2 : defaultDuration);

	  this.start(options);
	},
	
	update: function(position) {
	  
	  var value = parseInt(this.startVal + (this.delta*position)).toString();

	  Element.update(this.element, value);
	}
});

function pluralForm(n, form1, form2, form5)
{
    n = Math.abs(n) % 100;
    n1 = n % 10;
    if (n > 10 && n < 20) return form5;
    if (n1 > 1 && n1 < 5) return form2;
    if (n1 == 1) return form1;
    return form5;
}

String.prototype.encodeHTMLEntities = function()
{
	var str = this;
	str = str.replace( /\&/g, '&amp;' );
	str = str.replace( /\</g, '&lt;' );
	return str;
};

function checkCompetitionAlert(timeout,tryNum)
{
	if(__user_prefs && __user_prefs.popup && !__user_prefs.popup.competitions)
		return;
	if(tryNum>5)
	{
		//initCompetitionAlert();	
		return;
	}
	setTimeout(function()
	{		
		new Ajax.Request('/ajax/check-competition', {
			onSuccess: function(transport)
			{
				eval('var json='+transport.responseText+';');
				if(json.result == 'ok')
				{
					if(game && game.id == json.info.game_id)
						return;
					top_popup('<span class=bitmore>Соревнование по расписанию с рейтингом <strong>x'+json.info.rate+'</strong> скоро начнется.</span>', 
							  'Войти в игру', 
							  function() { window.location = '/g/?gmid='+json.info.game_id; },
							  null);
					setTimeout(function(){ close_top_popup(); }, 30000);
				}
				else
				{
					checkCompetitionAlert(0,tryNum+1);
				}
			}});
	}, timeout*1000+10000);
}

function tlog(str,data)
{
	//console.log(str);
	if(!__testmode)
		return;
	var now = new Date;	
	if(!data)
		data = null;
	
	__test_log[__test_log_cnt + " ["+now.toString()+"] "+str] = clone(data);
	__test_log_cnt++;
	
}

if( typeof(JSON) == 'undefined' || typeof(JSON.stringify) == 'undefined')
{
	var JSON = {};
	JSON.stringify = function(object)
	{
		return Object.toJSON(object);
	};
}
else
{
	delete Array.prototype.toJSON;
	delete Object.prototype.toJSON;
	delete Number.prototype.toJSON;
	delete String.prototype.toJSON;
}

function showTestLog()
{
	if(!__testmode)
		return;
	
	var data = {
		URL: document.location.href,
		remote_addr: __remote_addr,
		browsers: clone(Prototype.Browser),
		prefs: getCookie('__prefs2').split('\|'),
		log: __test_log};	
		
	var w = window.open('about:blank','testlog','width=500,height=300,toolbar=no,status=no,scrollbars=yes,location=no,menubar=yes');
	w.document.write("<html><body>Версия лога: "+__test_ver+"<br>"+JSON.stringify(data).encodeHTMLEntities()+'</body></html>');
	w.focus();
}

function __dump_item(item,value,level)
{
	var dumped_text = "";
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "      ";
	
	if(typeof(value) == 'object') { //If it is an array,
		if(value===null)
			dumped_text += "\n"+level_padding + "[:i]" + item + "[/:i] => [i]null[/i]";
		else
		{
			dumped_text += "\n"+level_padding + "[:i]" + item + "[/:i] [richinfo "+(level+1)+"]";
			dumped_text += dump(value,level+1);
			dumped_text += '[/richinfo '+(level+1)+"]";
		}
	} else if(typeof(value) != 'function') {
		dumped_text += "\n"+level_padding + "[:i]" + item + "[/:i] => " + value + "";
	}
	
	return dumped_text;
}

function dump(arr,level)
{
	var level_padding = "";
	var dumped_text = "";
	if(!level) level = 0;
	
	for(var j=0;j<level+1;j++) level_padding += "      ";
		
	if(typeof(arr) == 'object') { //Array/Hashes/Objects
		for(var item in arr) {	
			if(typeof(arr[item]) == 'function')
				continue;
			var value = arr[item];
			if(typeof(value) == 'object') { //If it is an array,
				if(value===null)
					dumped_text += "\n"+level_padding + "[:i]" + item + "[/:i] => [i]null[/i]";
				else
				{
					dumped_text += "\n"+level_padding + "[:i]" + item + "[/:i] [richinfo "+(level+1)+"]";
					dumped_text += dump(value,level+1);
					dumped_text += '[/richinfo '+(level+1)+"]";
				}
			} else if(typeof(value) != 'function') {
				dumped_text += "\n"+level_padding + "[:i]" + item + "[/:i] => " + value + "";
			}
		}
		/*if(!dumped_text && arr.length)
			for(var i=0;i<arr.length;i++)	
				if(arr[i])
				{
					dumped_text += __dump_item(i,arr[i],level);
				}*/
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	if(level == 0)
		return '[richinfo '+level+']'+dumped_text+'[/richinfo '+level+']';
	else
		return dumped_text;
}


Ajax.Responders.register({
	onCreate: function(request)
		{
			if(request.options.timeout)
				request['timeoutId'] = window.setTimeout(
					function()
					{
						if (request.transport.readyState >=1 && request.transport.readyState <=3)
						{
							request.transport.abort();
							if (request.options['onFailure'])
								request.options['onFailure'](request.transport, request.json);
						}
					},
					request.options.timeout
				);
			
			if(request.options.tries && request.options.tries > 1)
			{
				var onFailure = request.options.onFailure ? request.options.onFailure : null;
				request.options.onFailure = function(transport,json)
				{
					setTimeout( function(){
						var options = request.options;
						options.tries--;
						options.onFailure = onFailure;
						new Ajax.Request(request.url,options); 
					}, 500 );
				};
			}
		},
	onComplete: function(request)
	{	
		if(request.options.timeout)
			window.clearTimeout(request['timeoutId']);
	}});


function getMovie(movieName)
{
    if (navigator.appName.indexOf("Microsoft") != -1) {
        return window[movieName];
    } else {
        return document[movieName];
    }
}

$selection = {
  getText : function() {
    var txt = '';
    if (txt = window.getSelection) // Not IE, используем метод getSelection
      txt = window.getSelection().toString();
    else // IE, используем объект selection
      txt = document.selection.createRange().text;
    return txt;
  }
}

function initBBWidgets(elm, callback)
{
    Element.select(elm || document.body, '.hidetop').each(function(el) {
		el.onclick = function()
		{
			var m = this.id.match(/hidetop-(.+)/);
			if(this.nextSibling.id == 'hidecont-'+m[1])
				Effect.toggle(this.nextSibling, 'slide', {duration: 0.3});				
			this.toggleClassName('expanded');
            setTimeout(function() {
                callback && callback();
            }, 300);
		};
	});
}

$c = (function(){	
  var c = { };
  var cnt = 0;
  return function(id) {
	  cnt++;
    return (c[id] || (c[id] = $(id)));
  }
})();


Effect.PlayerEnterRace = Class.create();
Object.extend(Object.extend(Effect.PlayerEnterRace.prototype,
  Effect.Base.prototype), {
	initialize: function(element) {
	  
	  var options = arguments[1] || {};	  

	  this.element = $(element);

	  this.startX = -40; 
	  this.finishX = 0;
	  
	  this.startOpacity = 0;
	  this.finishOpacity = 1;
	  
	  this.deltaX = (this.finishX-this.startX);
	  this.deltaOpacity = (this.finishOpacity-this.startOpacity);
	  options.duration = options.duration || 1;
	  options.transition = Effect.Transitions.linear;
	  
	  this.update(0);

	  this.start(options);
	},
	
	update: function(position) {
	  
	  
	  var x = this.finishX - this.deltaX*Math.exp(-position*5);
	  var opacity = this.finishOpacity - this.deltaOpacity*Math.exp(-position*5);
	  if(position == 1)
	  {
		  x = this.finishX;
		  opacity = this.finishOpacity;
	  }

	  this.element.setStyle({left: x+'px',
		  					 opacity: opacity});
	}
});

Effect.DropIn = function(element) {
	
	  element = $(element);
	  var oldStyle = {
	    top: element.getStyle('top'),
	    opacity: element.getInlineOpacity() };
	  element.setStyle(
	        	{top: parseFloat(element.getStyle('top'))-100 + 'px',
		         opacity: 0.0});
	  return new Effect.Parallel(
	    [ new Effect.MoveY(element, {y: 100, sync: true }),
	      new Effect.Opacity(element, { sync: true, from: 0.0, to: 1.0 }) ],
	    Object.extend(
	      { duration: 0.5,
	        beforeSetup: function(effect) {
	          effect.effects[0].element.makePositioned();	          
	        },
	        afterFinishInternal: function(effect) {
	          effect.effects[0].element.undoPositioned().setStyle(oldStyle);
	        }
	      }, arguments[1] || { }));
	};
	
Effect.DropOut = function(element) {
		  element = $(element);
		  var oldStyle = {
		    top: element.getStyle('top'),
		    left: element.getStyle('left'),
		    opacity: element.getInlineOpacity() };
		  return new Effect.Parallel(
		    [ new Effect.MoveY(element, {y: 100, sync: true }),
		      new Effect.Opacity(element, { sync: true, to: 0.0 }) ],
		    Object.extend(
		      { duration: 0.5,
		        beforeSetup: function(effect) {
		          effect.effects[0].element.makePositioned();
		        },
		        afterFinishInternal: function(effect) {
		          effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);
		        }
		      }, arguments[1] || { }));
		};
	
Effect.MoveY = Class.create(Effect.Base, {
		  initialize: function(element) {
		    this.element = $(element);
		    if (!this.element) throw(Effect._elementDoesNotExistError);
		    var options = Object.extend({
		      y:    0,
		      mode: 'relative'
		    }, arguments[1] || { });
		    this.start(options);
		  },
		  setup: function() {
		    this.element.makePositioned();
		    this.originalTop  = parseFloat(this.element.getStyle('top')  || '0');
		    if (this.options.mode == 'absolute') {
		      this.options.y = this.options.y - this.originalTop;
		    }
		  },
		  update: function(position) {
		    this.element.setStyle({
		      top:  (this.options.y  * position + this.originalTop).round()  + 'px'
		    });
		  }
		});

function drop_message(content, options)
{		
	options = options || {};
	
	var box = $('drop_message').down('.popup-box');
	
	box.down('.c').update(content);
	new Effect.DropIn(box);
	$('drop_message').show();
	box.show();
	if(options.autohide)
		var dropout_timeout = setTimeout( function() { new Effect.DropOut(box); }, options.autohide*1000 );
	$('drop_message').down('.close').onclick = function () {
		if(dropout_timeout)
			clearInterval(dropout_timeout);
		new Effect.DropOut(box);
	};
}

function postUrl(url) {
	var form = document.createElement('FORM');
	form.method = 'POST';
	form.action = url;
	$$('body')[0].appendChild(form);
	
	var token = document.createElement('INPUT');
	token.setAttribute('type','hidden');
	token.setAttribute('name','csrftoken');
	token.setAttribute('value',window.__csrftoken);
	form.appendChild(token);
	
	form.submit();
}

function abuse(user_id) {
	popconfirm(_tpl('abuse', {}), function() {
		var reason = $$$('#popconfirm-content input[name="reason"]:checked').val();
		var message = $$$('#popconfirm-content textarea[name="message"]').val();
		
		new Ajax.Request('/ajax/abuse', {
			parameters: {
				reason: reason,
				message: message,
				user_id: user_id,
				recaptcha_challenge: Recaptcha.get_challenge(),
				recaptcha_response: Recaptcha.get_response()},
			onSuccess: function(transport)
			{
				switch (transport.responseText) {
					case 'ok':
						popalert("Ваша жалоба принята.");
						$('popconfirm').hide();
						Recaptcha.destroy();
					break;
					case 'captcha invalid':
						('popconfirm-btn-ok').disabled = false;
						$$$('#popconfirm-content .captcha_error').show();
					break;
					default:
						popalert("Произошла ошибка, попроуйте позже.");
						$('popconfirm').hide();
						Recaptcha.destroy();
					break;
				}
			}});
		return true;
	});
	
	$('popconfirm-btn-ok').disabled = true;
	$$$('#popconfirm-content input[name="reason"]').click(function() {
		$('popconfirm-btn-ok').disabled = false;
	});
	
	
	Recaptcha.create("6LclGwsAAAAAAO-MbuynCJHWeKSmmsTAxZZxJvdO", "abuse_recaptcha", {theme: 'white'});
			
}

function userModerator(user_id, period) {
	popconfirm(_tpl('user_moderator', {period: period}), function() {
		var reason = $$$('#popconfirm-content input[name="reason"]:checked').val();
		var message = $$$('#popconfirm-content textarea[name="message"]').val();
		
		new Ajax.Request('/ajax/user-moderator', {
			parameters: {
				reason: reason,
				message: message,
				user_id: user_id},
			onSuccess: function(transport)
			{
				if(transport.responseText == "ok")
					popalert("Действие выполнено.");
			}});
		
	});
	
	$('popconfirm-btn-ok').disabled = true;
	$$$('#popconfirm-content input[name="reason"]').click(function() {
		$('popconfirm-btn-ok').disabled = false;
	});
}


$$$.fn.ratingStars = function(options) {
	options.rating = options.rating || 0;
	
	var jEl = this;
	
	function updateStars(rating) {
		if(rating>0) {
			jEl.find('.star:nth-child('+rating+')').removeClass('star_off');
			jEl.find('.star:nth-child('+rating+')').prevAll('.star').removeClass('star_off');
			jEl.find('.star:nth-child('+rating+')').nextAll('.star').addClass('star_off');
		}
		else
			jEl.find('.star').addClass('star_off');
	}
	
	this.find('.star')
		.mouseover(function() {
			var jthis = $$$(this);
			jthis.removeClass('star_off');
			jthis.prevAll('.star').removeClass('star_off');
			jthis.nextAll('.star').addClass('star_off');
			jEl.find('.star:not(.star_off)').addClass('star_over');
		})
		.mouseout(function() {
			jEl.find('.star_over').removeClass('star_over');
			updateStars(options.rating);
		})
		.click(function() {
			options.rating = $$$('.star.star_over').length;
			options.callback(options.rating);
		});
	
	updateStars(options.rating);
}

function logout() {
	jQuery.post('/logout',
		{},
		function(data) {
			if(data == 'ok')
				window.location.reload();
		});
}



var Base64 = {

		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

		// public method for encoding
		encode : function (input) {
		    var output = "";
		    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		    var i = 0;

		    input = Base64._utf8_encode(input);

		    while (i < input.length) {

		        chr1 = input.charCodeAt(i++);
		        chr2 = input.charCodeAt(i++);
		        chr3 = input.charCodeAt(i++);

		        enc1 = chr1 >> 2;
		        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		        enc4 = chr3 & 63;

		        if (isNaN(chr2)) {
		            enc3 = enc4 = 64;
		        } else if (isNaN(chr3)) {
		            enc4 = 64;
		        }

		        output = output +
		        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
		        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		    }

		    return output;
		},

		// public method for decoding
		decode : function (input) {
		    var output = "";
		    var chr1, chr2, chr3;
		    var enc1, enc2, enc3, enc4;
		    var i = 0;

		    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		    while (i < input.length) {

		        enc1 = this._keyStr.indexOf(input.charAt(i++));
		        enc2 = this._keyStr.indexOf(input.charAt(i++));
		        enc3 = this._keyStr.indexOf(input.charAt(i++));
		        enc4 = this._keyStr.indexOf(input.charAt(i++));

		        chr1 = (enc1 << 2) | (enc2 >> 4);
		        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		        chr3 = ((enc3 & 3) << 6) | enc4;

		        output = output + String.fromCharCode(chr1);

		        if (enc3 != 64) {
		            output = output + String.fromCharCode(chr2);
		        }
		        if (enc4 != 64) {
		            output = output + String.fromCharCode(chr3);
		        }

		    }

		    output = Base64._utf8_decode(output);

		    return output;

		},

		// private method for UTF-8 encoding
		_utf8_encode : function (string) {
		    string = string.replace(/\r\n/g,"\n");
		    var utftext = "";

		    for (var n = 0; n < string.length; n++) {

		        var c = string.charCodeAt(n);

		        if (c < 128) {
		            utftext += String.fromCharCode(c);
		        }
		        else if((c > 127) && (c < 2048)) {
		            utftext += String.fromCharCode((c >> 6) | 192);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }
		        else {
		            utftext += String.fromCharCode((c >> 12) | 224);
		            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
		            utftext += String.fromCharCode((c & 63) | 128);
		        }

		    }

		    return utftext;
		},

		// private method for UTF-8 decoding
		_utf8_decode : function (utftext) {
		    var string = "";
		    var i = 0;
		    var c = c1 = c2 = 0;

		    while ( i < utftext.length ) {

		        c = utftext.charCodeAt(i);

		        if (c < 128) {
		            string += String.fromCharCode(c);
		            i++;
		        }
		        else if((c > 191) && (c < 224)) {
		            c2 = utftext.charCodeAt(i+1);
		            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
		            i += 2;
		        }
		        else {
		            c2 = utftext.charCodeAt(i+1);
		            c3 = utftext.charCodeAt(i+2);
		            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
		            i += 3;
		        }

		    }

		    return string;
		}

		}


function screenshot() {
    html2canvas(document.body, {
        onrendered: function(canvas) {
            var img = canvas.toDataURL('image/png');
            window.open(img);
        }
    })
}

_.complexMerge = function(dest, src) {
    for(var i in src) {
        if(_.isObject(src[i])) {
            if(_.isArray(src[i])) {
                if(!_.isArray(dest[i]))
                    throw new Error('cannot merge an object with an array');
                dest[i] = _.union(dest[i], src[i]);
            }
            else {
                if(_.isArray(dest[i]))
                    throw new Error('cannot merge an object with an array');
                _.extend(dest[i], src[i]);
            }
        }
        else
            dest[i] = src[i];
    }
}

function angularCompile(elm) {
    angularApply(function($compile) {
        var scope = angular.element(elm).scope();
        $compile(elm)(scope);
    })
}

function angularApply(fn, elm) {
    elm = elm || 'body';

    var update = function() {
        var scope = angular.element(elm).scope();
        var injector = angular.element(elm).injector();
        if(!scope) {
            setTimeout(update, 100);
            return;
        }
        scope.$apply( injector.invoke.call(injector, fn) );
    }

    setTimeout(update, 10);
}