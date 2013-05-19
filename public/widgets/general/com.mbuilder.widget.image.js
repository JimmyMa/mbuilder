mbuilder.createWidget( 
	"com.mbuilder.widget.image", 
	"Image",
	"widgets/imgs/image.png",
    {
        src: {
            label: "Image URL",
            type: "property.input",
            property: "src",
            getter: function(widget) {
                return widget.prop( "src" );
            },
            setter: function(widget, value) {
                widget.prop( "src", value );
            },
            codeSetter: function(widget, value) {
                widget.prop( "src", value );
            }
        },
        width: {
            label: "Width",
            type: "property.input",
            property: "width",
            getter: function(widget) {
                return widget.prop( "width" );
            },
            setter: function(widget, value) {
                widget.prop( "width", value );
            },
            codeSetter: function(widget, value) {
                widget.prop( "width", value );
            }
        },
        height: {
            label: "Height",
            type: "property.input",
            property: "height",
            getter: function(widget) {
                return widget.prop( "height" );
            },
            setter: function(widget, value) {
                widget.prop( "height", value );
            },
            codeSetter: function(widget, value) {
                widget.prop( "height", value );
            }
        }
    }, 
    { 
        attr: {
            label: "Img",
            type: "binding.input"
        }
    }
);