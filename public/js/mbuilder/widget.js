(function(window) {
    if ( window.mbuilder == undefined ) {
        window.mbuilder = {
            createWidget: function( widgetId, name, image, properties, actions ) {
                mbuilder.widgets[ widgetId ] = {
                    widgetid: widgetId,
                    name: name, 
                    image: image, 
                    properties: properties, 
                    actions: actions
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