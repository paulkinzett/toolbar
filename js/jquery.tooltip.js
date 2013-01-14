
if ( typeof Object.create !== 'function' ) {
    Object.create = function( obj ) {
        function F() {};
        F.prototype = obj;
        return new F();
    };
};

(function( $, window, document, undefined ) {
    
    var ToolTip = {
        init: function( options, elem ) {
            var self = this;

            self.elem = elem;
            self.$elem = $( elem );

            self.options = $.extend( {}, $.fn.tooltip.options, options );
            self.tooltip = $('<div class="tool-container gradient" />')
            .addClass('tool-'+self.options.position)
            .append('<div class="tool-items" />')
            .append('<div class="arrow" />')
            .appendTo('body')
            .css('opacity', 0);                     

            self.initializeTooltip();
        },
        
        initializeTooltip: function() {
            var self = this;
            self.populateContent();           
            self.setTrigger();            
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
                css = self.getCoordinates(self.options.position, 20);
                self.tooltip.stop().animate(css);
            });
        },
        
        populateContent: function() {
            var self = this;
            var location = self.tooltip.find('.tool-items');
            var content = $(self.options.content).clone().find('a').addClass('tool-item gradient');
            location.html(content);            
        },
        
        calculatePosition: function() {
            var self = this;  
            css = self.getCoordinates(self.options.position, 0);
            css.position = 'absolute';
            css.zIndex = 120;            
            self.tooltip.css(css);
        },
        
        getCoordinates: function( position, adjustment) {
            var self = this; 
            self.coordinates = self.$elem.offset();
            if(position == 'top') { 
                return coordinates = {
                    left: self.coordinates.left-(self.tooltip.width()/2)+(self.$elem.width()/2),
                    top: self.coordinates.top-self.$elem.height()-adjustment,
                }
            }

            if(position == 'left') { 
                return coordinates = {
                    left: self.coordinates.left-(self.tooltip.width()/2)-(self.$elem.width()/2)-adjustment,
                    top: self.coordinates.top-(self.tooltip.height()/2)+(self.$elem.height()/2),
                }
            }

        },

        show: function() {
            var self = this;
  
            self.$elem.addClass('pressed');
            self.calculatePosition();

            var animation = {
                'opacity': 1,
            };

            if(self.options.position == 'top') {
                animation.top = '-=20';
            }

            if(self.options.position == 'left') {
                animation.left = '-=20';
            }            

            self.tooltip.show().animate(animation, 200 );
        },

        hide: function() {
            var self = this;
            self.$elem.removeClass('pressed');
            var animation = {
                'opacity': 0,
            };

            if(self.options.position == 'top') {
                animation.top = '+=20';
            }

            if(self.options.position == 'left') {
                animation.left = '+=20';
            }             
            self.tooltip.animate(animation, 200, function() {
                self.tooltip.hide();
            } );
        },        

    }
    
    $.fn.tooltip= function( options ) {      
        return this.each(function() {
            var tooltipObj = Object.create( ToolTip );
            tooltipObj.init( options, this );
        });
    };    
    
    $.fn.tooltip.options = {
        content: '#myContent',
        position: 'top'
    };    
    
    
}) ( jQuery, window, document );