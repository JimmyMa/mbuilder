mbuilder.createWidget( "com.mbuilder.widget.label", "Label", 
    "widgets/imgs/textlabel.gif",
    {
        text: {
            label: "Text",
            type: "input",
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