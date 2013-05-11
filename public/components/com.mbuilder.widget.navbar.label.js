mbuilder.createWidget( "com.mbuilder.widget.navbar.label", "Nav Label",
    {
        text: {
            label: "Text",
            type: "input",
            getter: function(widget) {
                return widget.text();
            },
            setter: function(widget, value) {
                widget.find( ".ui-btn-inner" ).text( value );
            }
        }
    }, 
    { 
    
    }
);