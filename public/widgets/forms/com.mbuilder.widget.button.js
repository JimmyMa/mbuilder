mbuilder.createWidget( "com.mbuilder.widget.button", "Button",
    "widgets/imgs/button.png",
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
        },
        inline: {
            label: "In Line",
            type: "property.checkbox",
            getter: function(widget) {
                return widget.attr( "data-inline" );
            },
            setter: function(widget, value) {
                if ( value ) {
                    widget.addClass( "ui-btn-inline" );
                } else {
                    widget.removeClass( "ui-btn-inline" );
                }
                this.codeSetter( widget, value );
            },
            codeSetter: function(widget, value) {
                if ( value ) {
                    widget.attr( "data-inline", "true" );
                } else {
                    widget.attr( "data-inline", "false" );
                }
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