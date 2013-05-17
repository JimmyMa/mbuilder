var dragWidget = {};
var selectedWidget;

function init() {
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $( filter );
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].setter( target, updateInfo.value );
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
        var jsonData = "";
        $.each( bindingData, function( key, value ) {
            jsonData += key + ":" + value + ","
        });
        target.attr( "data-bind", jsonData.substring( 0,jsonData.length - 1 ) );
    });
    
    $("#container-1062").click(function(e) {
        var target = document.elementFromPoint( e.clientX, e.clientY);
        clearSelected();
        var targetWidget = ($(target).hasClass( "selectable" ) ? $(target) : $(target).parents( ".selectable:first" ));
        if ( targetWidget != null &&  selectedWidget != null 
            && targetWidget.length > 0 &&  selectedWidget.length > 0
            && targetWidget[0] == selectedWidget[0] ) {
            var parentWidget = targetWidget.parents( ".selectable:first" );
            if ( parentWidget.length != 0 ) {
                targetWidget = parentWidget;
            }
        }
        controlSelected( targetWidget );
    });
    
    dragObject.init();
    
    getCurrentPage().droppable({
        drop: function( event, ui ) {
        }
    });
    
    $(document).keyup(function(e){
        e.stopPropagation();
        if(e.keyCode == 46) {
            var action = {mbuilderid: selectedWidget.attr( "mbuilderid" ) };
            publish2Codes( "codes.widget.delete", action );
            getSelectedWidget().remove();
        }
    }) 
}

function controlSelected( control ) {
    var parent = control.parent();
    var offset = control.offset();

    var top = parent.append( "<div class='mbuilder-selected-control mbuilder-border-top'></div>" ).find(":last");
    if ( top.length == 0 ) {
        return;
    }
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
    selectedWidget = control;
}

function getControlData( control ) {
    var widget = parent.mbuilder.loadWidget( control.data( "widgetid" ) );
    var widgetData = {
        widgetid: control.data( "widgetid" ),
        mbuilderid: control.attr( "mbuilderid" ),
        properties: {},
        bindings: {}
    };
    $.each( widget.properties, function( key, property ) {
        if( key == "filter" ) {
            return;
        }
        widgetData.properties[key] = property.getter( control );
    });
    $.each( widget.bindings, function( key, binding ) {
        if( key == "filter" ) {
            return;
        }
        if ( widget.bindings[key].target != undefined ) {
            control = control.find( widget.bindings[key].target );
        }
        $.extend(widgetData.bindings, getBindingData( control ));
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

function doaction(action, transferData) {
    if ( action == "create" ) {
        var url = "widgets/" + transferData.getData( "widgetid" ) + ".tmp";
        $.get( url,function(data) {
            var compiled = _.template( data, {componentid: IDCounter ++ } );
            var el = $(compiled);
            
            if ( el.data("role") != "page" ) {
                createNewWidget(el, compiled);
            } else {
                createNewPage(el, compiled);
            }
        });
    }
}

function createNewPage(el, compiled) {
    
    getCurrentPage().before( el );
    action = {widgetData: compiled, currentPage: getCurrentPageId() };
    publish2Codes( "codes.widget.newpage", action );
    
    $.mobile.changePage( "#" + el[0].id );
}

function createNewWidget(el, compiled) {
    clearSelected();
    var action = {};
    if ( dragWidget != null && dragWidget.target != undefined ) {
        if ( dragWidget.position == "before" ) {
            dragWidget.target.before( el );
        } else if ( dragWidget.position == "after" ) {
            dragWidget.target.after( el );
        }
        action = {widgetData: compiled, targetWidget: dragWidget.target.attr("mbuilderid"), position: dragWidget.position};
    } else {
        getCurrentPage().append(el);
        action = {widgetData: compiled };
    }
    
    publish2Codes( "codes.widget.create", action );
    getCurrentPage().trigger('pagecreate');
    parent.mbuilder.loadWidget( el.data( "widgetid" ) ).methods.getRootElement(el).draggable( {stack: "#" + getCurrentPageId() + " *", opacity: 0.7,
        start: function() {
       
        },
        revert: function(socketObj) {
            clearSelected();
            if ( dragWidget != null ) {
                var action = {sourceWidget: dragWidget.source.attr("mbuilderid"), targetWidget: dragWidget.target.attr("mbuilderid"), position: dragWidget.position};
                if ( dragWidget.position == "before" ) {
                    dragWidget.target.before( dragWidget.source );
                } else if ( dragWidget.position == "after" ) {
                    dragWidget.target.after( dragWidget.source );
                }
                dragWidget.source.removeAttr("style");
                publish2Codes( "codes.widget.move", action );
                return false;
            }
            return true;
        },
        drag: function( e, ui ) {
          doMoveWidget( e.clientX, e.clientY, ui.helper );
        },
        stop: function() {
        }
    });
}

function doMoveWidget( x, y, source ) {
    clearSelected();
    var selector = "";
    if ( source != undefined ) {
        selector = '#' + getCurrentPageId() + '>div[mbuilderid!="' + source.attr( "mbuilderid" ) + '"], #' + getCurrentPageId() + '>a[mbuilderid!="' + source.attr( "mbuilderid" ) + '"]';
    } else {
        selector = '#' + getCurrentPageId() + '>div, #' + getCurrentPageId() + '>a';
    }
    var target = $(selector).filter(function() {
//        console.log( "" + (x > $(this).offset().left) + " : " + (x < ($(this).offset().left + $(this).outerWidth())
//            ) + " : " + ( y > $(this).offset().top ) + " : " + ( y < ($(this).offset().top + $(this).outerHeight())) );
        return ( x > $(this).offset().left && x < ($(this).offset().left + $(this).outerWidth())
            && y > $(this).offset().top && y < ($(this).offset().top + $(this).outerHeight()) );
    });
    var offset = target.offset();
    if ( offset == undefined ) {
        return;
    }
    if ( y < ( 10  +  offset.top ) ) {
        var line = $( "<div class='mbuilder-selected-control mbuilder-border-left'></div>" );
        target.before( line );
        line.offset({ top: offset.top, left: offset.left});
        line.width( target.outerWidth() ).height( 1 );
        dragWidget.source = source;
        dragWidget.target = target;
        dragWidget.position = "before";
    } else if ( y > ( offset.top + target.outerHeight() - 10 ) ) {
        var line = $( "<div class='mbuilder-selected-control mbuilder-border-left'></div>" );
        target.after( line );
        line.offset({ top: offset.top + target.outerHeight() - 1, left: offset.left});
        line.width( target.outerWidth() ).height( 1 );
        dragWidget.source = source;
        dragWidget.target = target;
        dragWidget.position = "after";
    }
}

function getSelectedWidget() {
    return parent.mbuilder.loadWidget( selectedWidget.data( "widgetid" ) ).methods.getRootElement(selectedWidget);
}

function getBindingData( widget ) {
    var tmp = widget.attr( "data-bind" );
    if ( tmp == null ) {
        return {};
    }

    var tmparray = tmp.split( "," );
    var bindData = {};
    for ( var i = 0; i < tmparray.length; i ++ ) {
        var index = tmparray[i].indexOf( ":" );
        bindData[tmparray[i].substring(0, index )] = tmparray[i].substring( index + 1 );
    }
    return bindData;
}