mbuilder.createWidget( "com.mbuilder.widget.label", "Label", 
    "widgets/imgs/button.png",
    {
        text: {
            label: "Text",
            type: "property.texteditor",
            getter: function(widget) {
                return widget.html();
            },
            setter: function(widget, value) {
                widget.html( value );
            },
            codeSetter: function(widget, value) {
                widget.html( value );
            }
        }
    }, 
    { 
    
    }
);