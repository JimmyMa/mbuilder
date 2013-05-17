mbuilder.createWidget( "com.mbuilder.widget.label", "Label", 
    "widgets/imgs/button.png",
    {
        text: {
            label: "Text",
            type: "property.input",
            getter: function(widget) {
                return widget.text();
            },
            setter: function(widget, value) {
                widget.text( value );
            },
            codeSetter: function(widget, value) {
                widget.text( value );
            }
        }
    }, 
    { 
    
    }
);