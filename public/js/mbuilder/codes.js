function init() {
    $.pubsub( "subscribe", "codes.widget.create", function( topic, action ) {
        var el = $(action.widgetData);
        if ( action.targetWidget == undefined ) {
            $("#screen" ).append(el);
        } else {
            var filter = "*[mbuilderid='" + action.targetWidget + "']";
            var target = $($.find( filter )[0]);
            if ( action.position == "before" ) {
                target.before( el );
            } else if ( action.position == "after" ) {
                target.after( el );
            }
        }

    });
    
    $.pubsub( "subscribe", "codes.widget.move", function( topic, action ) {
        var filter = "*[mbuilderid='" + action.sourceWidget + "']";
        var source = $($.find( filter )[0]);
        filter = "*[mbuilderid='" + action.targetWidget + "']";
        var target = $($.find( filter )[0]);
        if ( action.position == "before" ) {
            target.before( source );
        } else if ( action.position == "after" ) {
            target.after( source );
        }

    });
    
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $($.find( filter )[0]);
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].codeSetter( target, updateInfo.value );
    });
}
