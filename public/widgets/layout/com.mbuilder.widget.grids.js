mbuilder.createWidget( 
	"com.mbuilder.widget.grids", 
	"Grids",
	"widgets/imgs/navbar.png",
    {

    }, 
    { 
    
    },
    {
        layout: function(widget) {
            if ( widget.children().length > 0 ) {
                widget.removeAttr('style');
            } else {
                widget.attr('style', "height:50px");
            }
            var aaa = ['a','b','c','d'];
            var i = 0;
            $.each( widget.children(), function( index, child ) {
                console.log( $(child).attr('class').indexOf( 'ui-block-' ) );
                if ( $(child).attr('class').indexOf( 'ui-block-' ) == 0 ) {
                    i++;
                    return;
                }
                var newDiv = $( "<div class='ui-block-" + (aaa[i++%2]) + "'></div>" );
                widget.append( newDiv );
                $(child).appendTo( newDiv );
            });
        },
        codeLayout: function(widget) {
            if ( widget.children().length > 0 ) {
                widget.removeAttr('style');
            } else {
                widget.attr('style', "height:50px");
            }
            var aaa = ['a','b','c','d'];
            var i = 0;
            $.each( widget.children(), function( index, child ) {
                console.log( $(child).attr('class').indexOf( 'ui-block-' ) );
                if ( $(child).attr('class').indexOf( 'ui-block-' ) == 0 ) {
                    i++;
                    return;
                }
                var newDiv = $( "<div class='ui-block-" + (aaa[i++%2]) + "'></div>" );
                widget.append( newDiv );
                $(child).appendTo( newDiv );
            });
        }
    }
);