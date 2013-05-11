function init() {
    $.pubsub( "subscribe", "codes.widget.create", function( topic, widgetData ) {
        $("#screen" ).append(widgetData);
    });
    
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $($.find( filter )[0]);
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].codeSetter( target, updateInfo.value );
    });
}
