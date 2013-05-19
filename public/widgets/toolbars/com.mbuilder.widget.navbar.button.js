mbuilder.createWidget( "com.mbuilder.widget.navbar.button", "Nav Button",
    "",
    {
        text: {
            label: "Text",
            type: "property.input",
            getter: function(widget) {
                return widget.text();
            },
            setter: function(widget, value) {
                widget.find( ".ui-btn-inner" ).text( value );
            },
            codeSetter: function(widget, value) {
                widget.text( value );
            }
        }
    }, 
    {
        click: {
            label: "Click",
            type: "binding.input"
        }
    
    }
);