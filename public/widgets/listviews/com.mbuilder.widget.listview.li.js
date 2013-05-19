mbuilder.createWidget( 
	"com.mbuilder.widget.listview.li", 
	"List View Item",
	"",
    {
        text: {
            label: "Text",
            type: "property.input",
            getter: function(widget) {
                return widget.text().trim();
            },
            setter: function(widget, value) {
                widget.find( "a span" ).text( value );
            },
            codeSetter: function(widget, value) {
               this.setter( widget, value );
            }
        },
        img: {
            label: "Image",
            type: "property.input",
            getter: function(widget) {
                return widget.text().trim();
            },
            setter: function(widget, value) {
                widget.find( "a span" ).text( value );
            },
            codeSetter: function(widget, value) {
               this.setter( widget, value );
            }
        }
    }, 
    { 
        text: {
            label: "Text",
            type: "binding.input",
            target: "span"
        }
        
    }
);