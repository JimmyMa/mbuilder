function init() {
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $($.find( filter )[0]);
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].setter( target, updateInfo.value );
    });
}

function controlSelected( control ) {
    var parent = control.parent();
    var offset = control.offset();

    var top = parent.append( "<div class='mbuilder-selected-control mbuilder-border-top'></div>" ).find(":last");
    top.offset({ top: offset.top, left: offset.left});
    top.width( control.width() ).height( 1 );
    
    var bottom = parent.append( "<div class='mbuilder-selected-control mbuilder-border-bottom'></div>" ).find(":last");
    bottom.offset({ top: offset.top + control.height() - 1, left: offset.left});
    bottom.width( control.width() ).height( 1 );
    
    var left = parent.append( "<div class='mbuilder-selected-control mbuilder-border-left'></div>" ).find(":last");
    left.offset({ top: offset.top, left: offset.left});
    left.height( control.height() ).width( 1 );
    
    var right = parent.append( "<div class='mbuilder-selected-control mbuilder-border-right'></div>" ).find(":last");
    right.offset({ top: offset.top, left: offset.left + control.width() - 1});
    right.height( control.height() ).width( 1 );

    publishTopic( "widget.action.selected", getControlData( control ) );
}

function getControlData( control ) {
    var widget = parent.mbuilder.loadWidget( control.data( "widgetid" ) );
    var widgetData = {
        widgetid: control.data( "widgetid" ),
        mbuilderid: control.attr( "mbuilderid" )
    };
    $.each( widget.properties, function( key, property ) {
        widgetData[key] = property.getter( control );
    });
    return widgetData;
}

function clearSelected() {
    $(".mbuilder-selected-control").remove();
}

function publishTopic( topic, data ) {
    parent.$.pubsub( 'publish', topic, data );
}