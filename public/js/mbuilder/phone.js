function init() {
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $($.find( filter )[0]);
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].setter( target, updateInfo.value );
    });
    
    dragObject.init();
}

function controlSelected( control ) {
    var parent = control.parent();
    var offset = control.offset();

    var top = parent.append( "<div class='mbuilder-selected-control mbuilder-border-top'></div>" ).find(":last");
    top.offset({ top: offset.top, left: offset.left});
    top.width( control.outerWidth() ).height( 1 );
    
    var bottom = parent.append( "<div class='mbuilder-selected-control mbuilder-border-bottom'></div>" ).find(":last");
    bottom.offset({ top: offset.top + control.outerHeight() - 1, left: offset.left});
    bottom.width( control.outerWidth() ).height( 1 );
    
    var left = parent.append( "<div class='mbuilder-selected-control mbuilder-border-left'></div>" ).find(":last");
    left.offset({ top: offset.top, left: offset.left});
    left.height( control.outerHeight() ).width( 1 );
    
    var right = parent.append( "<div class='mbuilder-selected-control mbuilder-border-right'></div>" ).find(":last");
    right.offset({ top: offset.top, left: offset.left + control.outerWidth() - 1});
    right.height( control.outerHeight() ).width( 1 );

    publish2Parent( "widget.action.selected", getControlData( control ) );
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

function publish2Parent( topic, data ) {
    parent.$.pubsub( 'publish', topic, data );
}

function publish2Codes( topic, data ) {
    parent.$("#codesIframe").get(0).contentWindow.$.pubsub( 'publish', topic, data );
}

function createWidget(widgetid) {
    var url = "widgets/" + widgetid + ".tmp";
    $.get( url,function(data) {
        var compiled = _.template( data, {componentid: IDCounter ++ } );
        var component = $("#screen" ).append(compiled);
        publish2Codes( "codes.widget.create", compiled );
        component.click(function(e) {
            var target = document.elementFromPoint( e.clientX, e.clientY);
            clearSelected();
            controlSelected( $(target).hasClass( "selectable" ) ? $(target) : $(target).parents( ".selectable:first" ) );
        });
        $("#screen" ).trigger('pagecreate');
    });
}