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

    var ToolBar = {
        init: function( options, elem ) {
            var self = this;
            self.elem = elem;
            self.$elem = $( elem );
            self.options = $.extend( {}, $.fn.toolbar.options, options );
            self.toolbar = $('<div class="tool-container gradient" />')
            .addClass('tool-'+self.options.position)
            .addClass('tool-rounded')
            .append('<div class="tool-items" />')
            .append('<div class="arrow" />')
            .appendTo('body')
            .css('opacity', 0)
            .hide();
            self.initializeToolbar();
        },

        initializeToolbar: function() {
            var self = this;
            self.populateContent();           
            self.setTrigger();     
            self.toolbarWidth = self.toolbar.width();
        },

        setTrigger: function() {
            var self = this;

            self.$elem.on('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if(self.$elem.hasClass('pressed')) {
                    self.hide();
                } else {
                    self.show();
                }
            });

            $(window).resize(function( event ) {
                event.stopPropagation();
                if ( self.toolbar.is(":visible") ) {
                    self.toolbarCss = self.getCoordinates(self.options.position, 20);
                    self.collistionDetection();
                    self.toolbar.css( self.toolbarCss );
                    self.toolbar.find('.arrow').css( self.arrowCss );
                }
            });
        },

        populateContent: function() {
            var self = this;
            var location = self.toolbar.find('.tool-items');
            var content = $(self.options.content).clone( true ).find('a').addClass('tool-item gradient');
            location.html(content);
            location.find('.tool-item').on('click', function(event) {
                event.preventDefault();
                self.$elem.trigger('toolbarItemClick', this);
            });
        },

        calculatePosition: function() {
            var self = this;  
                self.arrowCss = {};
                self.toolbarCss = self.getCoordinates(self.options.position, 0);
                self.toolbarCss.position = 'absolute';
                self.toolbarCss.zIndex = self.options.zIndex;            
                self.collistionDetection();
                self.toolbar.css(self.toolbarCss);
                self.toolbar.find('.arrow').css(self.arrowCss);
        },
        
        getCoordinates: function( position, adjustment ) {
            var self = this; 
            self.coordinates = self.$elem.offset();
            
            switch(self.options.position) {
                case 'top':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.width()/2),
                        top: self.coordinates.top-self.$elem.height()-adjustment,
                        right: 'auto'
                    };
                case 'left':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)-(self.$elem.width()/2)-adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.height()/2),
                        right: 'auto'
                    };
                case 'right':
                    return {
                        left: self.coordinates.left+(self.toolbar.width()/2)+(self.$elem.width()/3)+adjustment,
                        top: self.coordinates.top-(self.toolbar.height()/2)+(self.$elem.height()/2),
                        right: 'auto'
                    };
                case 'bottom':
                    return {
                        left: self.coordinates.left-(self.toolbar.width()/2)+(self.$elem.width()/2),
                        top: self.coordinates.top+self.$elem.height()+adjustment,
                        right: 'auto'
                    };
            }
        },

        collistionDetection: function() {
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

            self.bindHideEvent();
            self.toolbar.show().animate(animation, 200 );
            self.$elem.trigger('toolbarShown');
        },

        bindHideEvent: function() {
            var self = this;
            var hideEvent = "click.toolbar";
            if(self.options.hideOnClick) {
                $('html').off(hideEvent).on(hideEvent, function( event ) {
                    if(self.toolbar.has(event.target).length === 0 ) {
                        self.hide();
                    }
                });
            }
        },

        hide: function() {
            var self = this;
            var animation = {'opacity': 0};

            self.$elem.removeClass('pressed');

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

            self.$elem.trigger('toolbarHidden');
        }
    };

    $.fn.toolbar= function( options ) {
        return this.each(function() {
            var toolbarObj = Object.create( ToolBar );
            toolbarObj.init( options, this );
        });
    };

    $.fn.toolbar.options = {
        content: '#myContent',
        position: 'top',
        hideOnClick: false,
        zIndex: 120
    };


}) ( jQuery, window, document );
