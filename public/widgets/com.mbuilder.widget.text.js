mbuilder.createWidget( "com.mbuilder.widget.text", "Text",
    "widgets/imgs/button.png",
    {
        filter: {exclude:["text"]},
        value: {
            label: "Value",
            type: "property.input",
            getter: function(widget) {
                return widget.val();
            },
            setter: function(widget, value) {
                widget.val( value );
            },
            codeSetter: function(widget, value) {
                widget.val( value );
            }
        }
    }, 
    {
        click: {
            label: "Click",
            type: "binding.input",
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
        getRootElement: function(widget) {
            return widget.parent();
        }
    }
);