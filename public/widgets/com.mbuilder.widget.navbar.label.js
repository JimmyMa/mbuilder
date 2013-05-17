mbuilder.createWidget( "com.mbuilder.widget.navbar.label", "Nav Label", "",
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
                widget.find( "a" ).text( value );
            }
        }
    }, 
    { 
    
    }
);