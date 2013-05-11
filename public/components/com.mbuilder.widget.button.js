mbuilder.createWidget( "com.mbuilder.widget.button", "Button",
    {
        text: {
            label: "Text",
            type: "input",
            getter: function(widget) {
                return widget.text();
            },
            setter: function(widget, value) {
                widget.text( value );
            }
        }
    }, 
    { 
    
    }
);