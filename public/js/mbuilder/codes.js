function init() {
    $.pubsub( "subscribe", "codes.widget.create", function( topic, action ) {
        var el = $(action.widgetData);
        if ( action.targetWidget == undefined ) {
            getCurrentPage().append(el);
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
    
    $.pubsub( "subscribe", "codes.widget.newpage", function( topic, action ) {
        var el = $(action.widgetData);
        $("#" + action.currentPage).before( el );
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

function getCurrentPage() {
	return $("#" + getCurrentPageId() );
}

function getCurrentPageId() {
	return parent.$("#childIframe").get(0).contentWindow.$.mobile.activePage.attr('id');
}
