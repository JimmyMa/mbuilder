mbuilder.createWidget( 
	"com.mbuilder.widget.listview.li", 
	"List View Item",
	"",
    {
        content: {
            label: "Content",
            type: "property.texteditor",
            getter: function(widget) {
                return widget.html();
            },
            setter: function(widget, value) {
                widget.html( value );
                widget.find( "img" ).addClass( "ui-li-thumb" );
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