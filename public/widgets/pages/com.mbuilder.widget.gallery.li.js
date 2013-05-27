mbuilder.createWidget( 
	"com.mbuilder.widget.gallery.li", 
	"Gallery Image",
	"widgets/imgs/navbar.png",
    {

    }, 
    { 
        img: {
            label: "Image",
            attr: true,
            type: "binding.input",
            setter: function( widget, bindValue ) {
                widget.find( "a" ).attr( "data-bind", bindValue.replace( "img", "href" ) );
                widget.find( "img" ).attr( "data-bind", bindValue.replace( "img", "src" ) );
            }
        }
    },
    {
    
    },
    //this is dependency
    {

    }
);