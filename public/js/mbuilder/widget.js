(function(window) {
    if ( window.mbuilder == undefined ) {
        window.mbuilder = {
            createWidget: function( widgetId, name, image, properties, bindings, methods, dependencies ) {
                mbuilder.widgets[ widgetId ] = {
                    widgetid: widgetId,
                    name: name, 
                    image: image, 
                    properties: BaseWidget.extendProperties( properties ), 
                    bindings: BaseWidget.extendBindings( bindings ),
                    methods: BaseWidget.extendMethods( methods ),
                    dependencies: (dependencies == undefined? {} : dependencies)
                };
            },
            loadWidget: function( widgetId, groupId, show ) {
                if ( mbuilder.widgets[ widgetId ] == undefined ) {
                    var url = "widgets/" + groupId + "/" +  widgetId + ".js";
                    $.cachedScript( url ).done(function(script, textStatus) {
                        
                    });
                    mbuilder.widgets[ widgetId ].group = groupId;
                    mbuilder.widgets[ widgetId ].showinpallete = show;
                    mbuilder.groups[ groupId ].widgets[widgetId] = mbuilder.widgets[ widgetId ];
                }
                return mbuilder.widgets[ widgetId ];
            },
            loadGroup: function( groupId ) {
                if ( mbuilder.groups[ groupId ] == undefined ) {
                    var url = "widgets/" + groupId + "/definition.js";
                    $.cachedScript( url ).done(function(script, textStatus) {
                        
                    });
                    $.each( mbuilder.groups[ groupId ].widgets, function( index, widget ) {
                        mbuilder.loadWidget( widget, groupId, true );
                    });
                    $.each( mbuilder.groups[ groupId ].noshownwidgets, function( index, widget ) {
                        mbuilder.loadWidget( widget, groupId, false );
                    });
                }
                return mbuilder.groups[ groupId ];
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
            loadEditorTmp: function( editorType ) {
                var key = editorType+"tmp";
                if ( mbuilder.editors[ key ] == undefined ) {
                    $.ajax({
                      url: "editors/" + editorType + ".html",
                      async: false
                    }).done(function(data) {
                       mbuilder.editors[ key ] = data;
                    });
                }
                return mbuilder.editors[ key ];
            },
            defineGroup: function( group, groupName, widgets, noshownwidgets ) {
                mbuilder.groups[ group ] = {
                    groupName: groupName,
                    widgets: widgets,
                    noshownwidgets: noshownwidgets
                };
            },
        };
        
        mbuilder.editors = {};
        mbuilder.widgets = {};
        mbuilder.groups = {};
    }
})(window);

var BaseWidget = {
	extendProperties: function( properties ) {
		var baseProperties = {
	        id: {
	            label: "ID",
	            type: "property.input",
	            getter: function(widget) {
	                return widget.attr( "id" );
	            },
	            setter: function(widget, value) {
	                widget.attr( "id", value );
	            },
	            codeSetter: function(widget, value) {
	                widget.attr( "id", value );
	            }
	        },
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
	        },
	        theme: {
	            label: "Theme",
	            type: "property.input",
	            getter: function(widget) {
	                return widget.attr( "data-theme" );
	            },
	            setter: function(widget, value) {
	                setTheme( widget, "ui-bar", value);
	            },
	            codeSetter: function(widget, value) {
	                widget.attr( "data-theme", value );
	            }
	        },
	        class: {
	            label: "Class",
	            type: "property.input",
	            getter: function(widget) {
	                return widget.attr( "class" );
	            },
	            setter: function(widget, value) {
	                widget.addClass( value );
	            },
	            codeSetter: function(widget, value) {
	                widget.addClass( value );
	            }
	        },
	        mini: {
	            label: "Mini Size",
	            type: "property.checkbox",
	            getter: function(widget) {
	                return widget.attr( "data-mini" );
	            },
	            setter: function(widget, value, widgetType) {
                    if ( value ) {
                        widgetType.methods.getRootElement( widget ).addClass( "ui-mini" );
                    } else {
                        widgetType.methods.getRootElement( widget ).removeClass( "ui-mini" );
                    }
                    this.codeSetter( widget, value );
	            },
	            codeSetter: function(widget, value) {
                    if ( value ) {
                        widget.attr( "data-mini", value );
                    } else {
                        widget.removeAttr( "data-mini" );
                    }
	                
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
                type: "binding.input"
            },
            text: {
                label: "Text",
                type: "binding.input"
            },
            html: {
                label: "HTML Content",
                type: "binding.input"
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
                if ( widget.parent().attr('class').indexOf( 'ui-block-' ) == 0 ) {
                    return widget.parent();
                }
	            return widget;
	        },
	        layout: function(widget) {
	        },
	        codeLayout: function(widget) {
	        },
            postCreated: function(widget, page) {
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

var themes = " a b c d e";
function setTheme(widget, themeClass, theme) {
    widget
        .removeClass(themes.split(" ").join(" " + themeClass + "-"))
        .addClass(themeClass + "-" + theme)
        .attr("data-theme", theme);
}
