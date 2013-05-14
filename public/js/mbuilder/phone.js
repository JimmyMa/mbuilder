function init() {
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $($.find( filter )[0]);
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].setter( target, updateInfo.value );
    });
    
    
    $( "#screen" ).click(function(e) {
        var target = document.elementFromPoint( e.clientX, e.clientY);
        clearSelected();
        controlSelected( $(target).hasClass( "selectable" ) ? $(target) : $(target).parents( ".selectable:first" ) );
    });
    
    dragObject.init();
    
    $( "#screen" ).droppable({
        drop: function( event, ui ) {
            console.log( "=======================dropped" );
        }
    });
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

function doaction(action, transferData) {
    if ( action == "create" ) {
        var url = "widgets/" + transferData.getData( "widgetid" ) + ".tmp";
        $.get( url,function(data) {
            var compiled = _.template( data, {componentid: IDCounter ++ } );
            var el = $(compiled);
            
            clearSelected();
            var action = {};
            if ( dragWidget != null && dragWidget.target != undefined ) {
                //dragWidget.source.remove();
                if ( dragWidget.position == "before" ) {
                    dragWidget.target.before( el );
                } else if ( dragWidget.position == "after" ) {
                    dragWidget.target.after( el );
                }
                action = {widgetData: compiled, targetWidget: dragWidget.target.attr("mbuilderid"), position: dragWidget.position};
            } else {
                $("#screen" ).append(el);
                action = {widgetData: compiled };
            }
            
            publish2Codes( "codes.widget.create", action );
            $("#screen" ).trigger('pagecreate');
            el.draggable( {stack: "#screen *", opacity: 0.7,
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
                  console.log( "dragging " + e.pageX + ":" + e.pageY);
                  doMoveWidget( e.clientX, e.clientY, ui.helper );
                },
                stop: function() {
                }
            });
        });
    }
}

var dragWidget = {};
function doMoveWidget( x, y, source ) {
    clearSelected();
    var selector = "";
    if ( source != undefined ) {
        selector = '#screen>div[mbuilderid!="' + source.attr( "mbuilderid" ) + '"], #screen>a[mbuilderid!="' + source.attr( "mbuilderid" ) + '"]';
    } else {
        selector = '#screen>div, #screen>a';
    }
    var target = $(selector).filter(function() {
        console.log($(this));
        console.log( "" + (x > $(this).offset().left) + " : " + (x < ($(this).offset().left + $(this).outerWidth())
            ) + " : " + ( y > $(this).offset().top ) + " : " + ( y < ($(this).offset().top + $(this).outerHeight())) );
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