function init() {
    $.pubsub( "subscribe", "codes.widget.create", function( topic, action ) {
        var el = $(action.widgetData);
        if ( action.targetWidget == undefined ) {
            getCurrentPage().append(el);
        } else {
            var filter = "*[mbuilderid='" + action.targetWidget + "']";
            var target = $(filter);
            if ( action.position == "before" ) {
                target.before( el );
            } else if ( action.position == "after" ) {
                target.after( el );
            }  else if ( action.position == "in" ) {
                target.append( el );
            }
            parent.mbuilder.loadWidget( target.data("widgetid") ).methods.codeLayout(target);
        }

    });
    
    $.pubsub( "subscribe", "codes.widget.newpage", function( topic, action ) {
        var el = $(action.widgetData);
        $("#" + action.currentPage).after( el );
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
        } else if ( action.position == "in" ) {
            target.append( source );
        }
        parent.mbuilder.loadWidget( target.data("widgetid") ).methods.codeLayout(target);
    });
    
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $(filter);
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].codeSetter( target, updateInfo.value );
    });
    
    $.pubsub( "subscribe", "codes.widget.delete", function( topic, deleteInfo ) {
        var filter = "*[mbuilderid='" + deleteInfo.mbuilderid + "']";
        $(filter ).remove();
    });
    
    $.pubsub( "subscribe", "widget.binding.updated", function( topic, updateInfo ) {
        updateBinding( updateInfo );
    });
}

function getCurrentPage() {
	return $("#" + getCurrentPageId() );
}

function getCurrentPageId() {
	return parent.$("#childIframe").get(0).contentWindow.$.mobile.activePage.attr('id');
}
