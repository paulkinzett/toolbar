//jscs:disable
/* jshint ignore:start */

/**
 * Toolbar.js
 *
 * @fileoverview  jQuery plugin that creates tooltip style toolbars.
 * @link          http://paulkinzett.github.com/toolbar/
 * @author        Paul Kinzett (http://kinzett.co.nz/)
 * @version       1.0.4
 * @requires      jQuery 1.7+
 *
 * @license jQuery Toolbar Plugin v1.0.4
 * http://paulkinzett.github.com/toolbar/
 * Copyright 2013 Paul Kinzett (http://kinzett.co.nz/)
 * Released under the MIT license.
 * <https://raw.github.com/paulkinzett/toolbar/master/LICENSE.txt>
 */

if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function( $, window, document, undefined ) {

    var instances = [];

    var ToolBar = {
        init: function( options, elem ) {
            var self = this;
            self.elem = elem;
            self.$elem = $( elem );
            self.options = $.extend( {}, $.fn.toolbar.options, options );
            self.toolbar = $('<div class="tool-container gradient" />')
                .addClass('tool-'+self.options.position)
                .addClass('tool-rounded')
                .addClass( (self.options.className || "") )
                .append('<div class="tool-items" />')
                .append('<div class="arrow" />')
                .appendTo('body')
                .css('opacity', 0)
                .hide();
            self.toolbar_arrow = self.toolbar.find('.arrow');

            instances.push(self);

            self.initializeToolbar();
        },

        initializeToolbar: function() {
            var self = this;
            self.populateContent();
            self.setTrigger();
            self.toolbarWidth = self.toolbar.width();
        },

        setTrigger: function() {
            var self = this,
                moveTime;

            if (self.options.click) {
                self.$elem.on('click', function(event) {
                    event.preventDefault();
                    if (!self.showed_in_focus){
                        if(self.$elem.hasClass('pressed')) {
                            self.hide();
                        } else {
                            self.show();
                        }
                    }
                    self.showed_in_focus = false;
                });
            }

            if (self.options.hideOnClick) {
                $('html').on("click.toolbar", function ( event ) {
                    if (event.target != self.elem &&
                        self.$elem.has(event.target).length === 0 &&
                        self.toolbar.has(event.target).length === 0 &&
                        self.toolbar.is(":visible")) {
                        self.hide();
                    }
                });
            }

            function decideTimeout () {
                if (self.$elem.hasClass('pressed')) {
                    moveTime = setTimeout(function() {
                        self.hide();
                    }, 150);
                } else {
                    clearTimeout(moveTime);
                };
            };

            if (self.options.hover) {

                self.$elem.on({
                    mouseenter: function(event) {
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
                        } else {
                            self.show();
                        }
                    }
                });

                self.$elem.parent().on({
                    mouseleave: function(event){ decideTimeout(); }
                });

                $('.tool-container').on({
                    mouseenter: function(event){ clearTimeout(moveTime); },
                    mouseleave: function(event){ decideTimeout(); }
                });
            }

            if (self.options.focus) {

                self.$elem.on({
                    focus: function(event) {
                        self.showed_in_focus = true;
                        if (self.$elem.hasClass('pressed')) {
                            clearTimeout(moveTime);
                        } else {
                            self.show();
                        }
                    },
                    blur: function(event){
                        decideTimeout();
                    }
                });
            }

            $(window).resize(function( event ) {
                event.stopPropagation();
                if ( self.toolbar.is(":visible") ) {
                    self.toolbarCss = self.getCoordinates(self.options.position, 20);
                    self.collisionDetection();
                    self.toolbar.css( self.toolbarCss );
                    self.toolbar_arrow.css( self.arrowCss );
                }
            });
        },

        populateContent: function() {
            var self = this;
            var location = self.toolbar.find('.tool-items');
            var content = $(self.options.content).clone( true );
            //Add tool-item class to link elements
            content.find('a').addClass('tool-item gradient');
            //append all the content
            location.html(content.find( self.options.elementToAppend || "a" ));
            if (self.options.handleClick) {
                location.find('.tool-item').on('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    self.$elem.trigger('toolbarItemClick', this);
                });
            }

        },

        calculatePosition: function() {
            var self = this;
                self.arrowCss = {};
                self.toolbarCss = self.getCoordinates(self.options.position, 0);
                self.toolbarCss.position = 'absolute';
                self.toolbarCss.zIndex = self.options.zIndex;
                self.collisionDetection();
                self.toolbar.css(self.toolbarCss);
                self.toolbar_arrow.css(self.arrowCss);
        },

        getCoordinates: function( position, adjustment ) {
            var self = this;
            self.coordinates = self.$elem.offset();

            if (self.options.adjustment && self.options.adjustment[self.options.position]) {
                adjustment = self.options.adjustment[self.options.position] + adjustment;
            }

            switch(self.options.position) {
                case 'top':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.outerWidth()/2),
                        top: self.coordinates.top-self.$elem.height()-adjustment,
                        right: 'auto'
                    };
                case 'left':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)-(self.$elem.width()/2)-adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.outerHeight()/2),
                        right: 'auto'
                    };
                case 'right':
                    return {
                        left: self.coordinates.left+(self.$elem.width())+adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.outerHeight()/2),
                        right: 'auto'
                    };
                case 'bottom':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.outerWidth()/2),
                        top: self.coordinates.top+self.$elem.height()+adjustment,
                        right: 'auto'
                    };
            }
        },

        collisionDetection: function() {
            var self = this;
            var edgeOffset = 20;
            if(self.options.position == 'top' || self.options.position == 'bottom') {
                self.arrowCss = {left: '50%', right: '50%'};
                if( self.toolbarCss.left < edgeOffset ) {
                    self.toolbarCss.left = edgeOffset;
                    self.arrowCss.left = self.$elem.offset().left + self.$elem.width()/2-(edgeOffset);
                }
                else if(($(window).width() - (self.toolbarCss.left + self.toolbarWidth)) < edgeOffset) {
                    self.toolbarCss.right = edgeOffset;
                    self.toolbarCss.left = 'auto';
                    self.arrowCss.left = 'auto';
                    self.arrowCss.right = ($(window).width()-self.$elem.offset().left)-(self.$elem.width()/2)-(edgeOffset)-5;
                }
            }
        },

        show: function() {
            var self = this;
            var animation = {'opacity': 1};

            //Hide all other toolbars
            for (var i = instances.length - 1; i >= 0; i--) {
                instances[i].hide(true);
            };            

            self.$elem.addClass('pressed');
            self.calculatePosition();

            switch(self.options.position) {
                case 'top':
                    animation.top = '-=20';
                    break;
                case 'left':
                    animation.left = '-=20';
                    break;
                case 'right':
                    animation.left = '+=20';
                    break;
                case 'bottom':
                    animation.top = '+=20';
                    break;
            }

            self.toolbar.show().animate(animation, 200 );
            self.$elem.trigger('toolbarShown');
        },

        hide: function( no_anim ) {
            var self = this;
            var animation = {'opacity': 0};

            self.$elem.removeClass('pressed');

            if (no_anim) {
                self.toolbar.hide();
            } else {
                switch(self.options.position) {
                    case 'top':
                        animation.top = '+=20';
                        break;
                    case 'left':
                        animation.left = '+=20';
                        break;
                    case 'right':
                        animation.left = '-=20';
                        break;
                    case 'bottom':
                        animation.top = '-=20';
                        break;
                }

                self.toolbar.animate(animation, 200, function() {
                    self.toolbar.hide();
                });
            }


            self.$elem.trigger('toolbarHidden');
        },

        getToolbarElement: function () {
            return this.toolbar.find('.tool-items');
        }
    };

    $.fn.toolbar = function( options ) {
        if ($.isPlainObject( options )) {
            return this.each(function() {
                var toolbarObj = Object.create( ToolBar );
                toolbarObj.init( options, this );
                $(this).data('toolbarObj', toolbarObj);
            });
        } else if ( typeof options === 'string' && options.indexOf('_') !== 0 ) {
            var toolbarObj = $(this).data('toolbarObj');
            var method = toolbarObj[options];
            return method.apply(toolbarObj, $.makeArray(arguments).slice(1));
        }
    };

    $.fn.toolbar.options = {
        content: '#myContent',
        position: 'top',
        hideOnClick: false,
        zIndex: 120,
        hover: false,
        focus: false,
        click: true,
        handleClick: true
    };

}) ( jQuery, window, document );

/* jshint ignore:end */
