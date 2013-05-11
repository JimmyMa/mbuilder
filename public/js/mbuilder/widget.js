(function(window) {
    if ( window.mbuilder == undefined ) {
        window.mbuilder = {
            createWidget: function( widgetId, name, properties, actions ) {
                mbuilder[ widgetId ] = {name: name, properties: properties, actions: actions};
            },
            loadWidget: function( widgetId ) {
                if ( mbuilder[ widgetId ] == undefined ) {
                    var url = "components/" + widgetId + ".js";
                    $.cachedScript( url ).done(function(script, textStatus) {
                        
                    });
                }
                return mbuilder[ widgetId ];
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
    }
})(window);