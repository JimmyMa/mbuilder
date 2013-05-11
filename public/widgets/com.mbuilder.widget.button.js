mbuilder.createWidget( "com.mbuilder.widget.button", "Button",
    "widgets/imgs/button.png",
    {
        text: {
            label: "Text",
            type: "input",
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
    
    }
);