mbuilder.createWidget( "com.mbuilder.widget.switch", "Flip Switch",
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
        value: {
            attr: true,
            label: "Value",
            type: "binding.input"
        }
    },
    {
        getRootElement: function(widget) {
            return widget.parent();
        }
    }
);