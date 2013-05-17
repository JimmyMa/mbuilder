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
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $( filter );
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        if ( widget.bindings[updateInfo.property].target != undefined ) {
            target = target.find( widget.bindings[updateInfo.property].target );
        }
        var bindingData = getBindingData( target );
        bindingData[updateInfo.property] = updateInfo.value;
        var jsonData = JSON.stringify(bindingData);
        target.attr( "data-bind", jsonData.substr(1,jsonData.length - 2).replace( new RegExp("\"", 'g'), "" ) );
    });
}

function getCurrentPage() {
	return $("#" + getCurrentPageId() );
}

function getCurrentPageId() {
	return parent.$("#childIframe").get(0).contentWindow.$.mobile.activePage.attr('id');
}

function getBindingData( widget ) {
    var tmp = widget.data( "bind" );
    if ( tmp == null ) {
        tmp = "";
    }
    var tmparray = tmp.split( /:|,/ );
    var bindData = {};
    for ( var i = 0; i < tmparray.length; i = i + 2 ) {
        bindData[tmparray[i]] = tmparray[i+1];
    }
    return bindData;
}