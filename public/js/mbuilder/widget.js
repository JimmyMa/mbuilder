(function(window) {
    if ( window.mbuilder == undefined ) {
        window.mbuilder = {
            createWidget: function( widgetId, name, image, properties, bindings, methods ) {
                mbuilder.widgets[ widgetId ] = {
                    widgetid: widgetId,
                    name: name, 
                    image: image, 
                    properties: BaseWidget.extendProperties( properties ), 
                    bindings: BaseWidget.extendBindings( bindings ),
                    methods: BaseWidget.extendMethods( methods )
                };
            },
            loadWidget: function( widgetId ) {
                if ( mbuilder.widgets[ widgetId ] == undefined ) {
                    var url = "widgets/" + widgetId + ".js";
                    $.cachedScript( url ).done(function(script, textStatus) {
                        
                    });
                }
                return mbuilder.widgets[ widgetId ];
            },
            createEditor: function( editorType, initializer ) {
                mbuilder.editors[ editorType ] = {initializer: initializer};
            },
            loadEditor: function( editorType ) {
                if ( mbuilder.editors[ editorType ] == undefined ) {
                    var url = "editors/" + editorType + ".js";
                    $.cachedScript( url ).done(function(script, textStatus) {
                        
                    });
                }
                return mbuilder.editors[ editorType ];
            },
        };
        
        mbuilder.editors = {};
        mbuilder.widgets = {};
    }
})(window);

var BaseWidget = {
	extendProperties: function( properties ) {
		var baseProperties = {
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
		};
        
        if ( properties.filter != undefined ) {
            if ( properties.filter.exclude != undefined ) {
                $.each( properties.filter.exclude, function( index, value ) {
                    delete baseProperties[value];
                });            
            }
        }
		
		$.each( properties, function( key, value ) {
			baseProperties[key] = value;
		});
		return baseProperties;
	},
	extendBindings: function( bindings ) {
		var baseBindings = {
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
		};
		
		$.each( bindings, function( key, value ) {
			baseBindings[key] = value;
		});
		return baseBindings;
	},
	extendMethods: function( methods ) {
		var baseMethods = {
	        getRootElement: function(widget) {
	            return widget;
	        }
		};
		
        if ( methods !== undefined ) {
            $.each( methods, function( key, value ) {
                baseMethods[key] = value;
            });
        }
		return baseMethods;
	}
};
