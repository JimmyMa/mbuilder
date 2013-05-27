function getCurrentPage() {
	return $.mobile.activePage;
}

function getCurrentPageId() {
	return $.mobile.activePage.attr('id');
}


function getBindingData( widget ) {
    var tmp = widget.attr( "data-bind" );
    if ( tmp == null ) {
        return {};
    }

    var tmparray = tmp.split( "," );
    var bindData = {};
    for ( var i = 0; i < tmparray.length; i ++ ) {
        var temp = tmparray[i];
        if ( temp.indexOf( "attr:" ) == 0) {
            temp = temp.substring(6);
            temp = temp.substring(0,temp.length - 1 );
        }
        var index = temp.indexOf( ":" );
        bindData[temp.substring(0, index )] = temp.substring( index + 1 );
    }
    return bindData;
}

function updateBinding(updateInfo) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $( filter );
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        if ( widget.bindings[updateInfo.property].target != undefined ) {
            target = target.find( widget.bindings[updateInfo.property].target );
        }
        var bindingData = getBindingData( target );
        bindingData[updateInfo.property] = updateInfo.value;
        var jsonData = "";
        $.each( bindingData, function( key, value ) {
            if ( widget.bindings[key].attr ) {
                jsonData += "attr:{" + key + ":" + value + "},"
            } else {
                jsonData += key + ":" + value + ","
            }
        });
        jsonData = jsonData.substring( 0,jsonData.length - 1 );
        if ( widget.bindings[updateInfo.property].setter != undefined ) {
            widget.bindings[updateInfo.property].setter( target, jsonData );
        } else {
            target.attr( "data-bind", jsonData );
        }
}