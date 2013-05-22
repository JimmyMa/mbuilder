var dragWidget = {};
var selectedWidget;

function init() {
    $.pubsub( "subscribe", "widget.action.updated", function( topic, updateInfo ) {
        var filter = "*[mbuilderid='" + updateInfo.mbuilderid + "']";
        var target = $( filter );
        var widgetid = target.data("widgetid");
        var widget = parent.mbuilder.loadWidget( widgetid );
        widget.properties[updateInfo.property].setter( target, updateInfo.value, widget );
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
            if ( widget.bindings[key].attr ) {
                jsonData += "attr:{" + key + ":" + value + "},"
            } else {
                jsonData += key + ":" + value + ","
            }
        });
        target.attr( "data-bind", jsonData.substring( 0,jsonData.length - 1 ) );
    });
    
    $("#container-1062").click(function(e) {
        var target = document.elementFromPoint( e.clientX, e.clientY);
        clearSelected();
        var targetWidget = null;
        if ( $(target).is( ".selectable,.mbwidget" ) ) {
            targetWidget = $(target);
        } else if ( $(target).parents( ".selectable:first" ).length != 0 ) {
            targetWidget = $(target).parents( ".selectable:first" );
        } else if ( $(target).parents( ".mbwidget:first" ).length != 0 ) {
            targetWidget = $(target).parents( ".mbwidget:first" );
        }
        if ( targetWidget != null &&  selectedWidget != null 
            && targetWidget.length > 0 &&  selectedWidget.length > 0
            && targetWidget.attr( "mbuilderid" ) == selectedWidget.attr( "mbuilderid" ) ) {
            var parentWidget = targetWidget.parents( ".selectable:first,.mbwidget:first" );
            if ( parentWidget.length != 0 ) {
                targetWidget = parentWidget;
            }
        }
        if ( targetWidget != null ) {
            controlSelected( targetWidget );
        }
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
    
    updatePageList();
}

function outlineWidget( control ) {
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
}

function controlSelected( control ) {
    outlineWidget( control );

    selectedWidget = control;
    publish2Parent( "widget.action.selected", getControlData( control ) );
}

function getControlData( control ) {
    var widget = parent.mbuilder.loadWidget( control.data( "widgetid" ) );
    var widgetData = {
        widgetid: control.data( "widgetid" ),
        mbuilderid: control.attr( "mbuilderid" ),
        properties: {},
        bindings: {}
    };
    if ( widget == undefined ) {
        return widgetData;
    }
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
        var widget = parent.mbuilder.loadWidget(transferData.getData( "widgetid" ));
        var url = "widgets/" + widget.group + "/" + widget.widgetid + ".tmp";
        $.get( url,function(data) {
            var compiled = _.template( data, {componentid: IDCounter ++ } );
            var el = $(compiled);
            
            if ( el.data("role") != "page" ) {
                createNewWidget(el, compiled);
            } else {
                createNewPage(el, compiled);
                updatePageList();
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
    if ( dragWidget != null && dragWidget.target != undefined && dragWidget.target.data( "role" ) != "page" ) {
        var target = parent.mbuilder.loadWidget( dragWidget.target.data( "widgetid" ) ).methods.getRootElement(dragWidget.target);
        if ( dragWidget.position == "before" ) {
            target.before( el );
        } else if ( dragWidget.position == "after" ) {
            target.after( el );
        } else if ( dragWidget.position == "in" ) {
            target.append( el );
        }
        parent.mbuilder.loadWidget( dragWidget.target.data( "widgetid" ) ).methods.layout(dragWidget.target);
        action = {widgetData: compiled, targetWidget: dragWidget.target.attr("mbuilderid"), position: dragWidget.position};
    } else {
        getCurrentPage().append(el);
        action = {widgetData: compiled };
    }
    publish2Codes( "codes.widget.create", action );
    getCurrentPage().trigger('pagecreate');
    getCurrentPage().css( "padding-bottom", 0 );
    parent.mbuilder.loadWidget( el.data( "widgetid" ) ).methods.getRootElement(el).draggable( {stack: "#" + getCurrentPageId() + " *", opacity: 0.7,
        start: function() {
       
        },
        revert: function(socketObj) {
            clearSelected();
            if ( dragWidget != null ) {
                var action = {sourceWidget: dragWidget.source.attr("mbuilderid"), targetWidget: dragWidget.target.attr("mbuilderid"), position: dragWidget.position};
                var target = parent.mbuilder.loadWidget( dragWidget.target.data( "widgetid" ) ).methods.getRootElement(dragWidget.target);
                if ( dragWidget.position == "before" ) {
                    target.before( dragWidget.source );
                } else if ( dragWidget.position == "after" ) {
                    target.after( dragWidget.source );
                } else if ( dragWidget.position == "in" ) {
                    target.append( dragWidget.source );
                }
                parent.mbuilder.loadWidget( dragWidget.target.data( "widgetid" ) ).methods.layout(dragWidget.target);
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
    controlSelected( el );    
}

function doMoveWidget( x, y, source ) {
    clearSelected();
    console.log("----------------------------");
//    var target = document.elementFromPoint( x, y );
//    target = ($(target).is( ".selectable,.mbwidget" ) ? $(target) : $(target).parents( ".selectable:first,.mbwidget:first" ));

    var selector = "#" + getCurrentPageId() + ",#" + getCurrentPageId();
    if ( source != undefined ) {
        selector += ' .mbwidget[mbuilderid!="' + source.attr( "mbuilderid" ) + '"]';
        selector += ",#" + getCurrentPageId() + ' .containable[mbuilderid!="' + source.attr( "mbuilderid" ) + '"]';
    } else {
        selector += ' .mbwidget';
        selector += ",#" + getCurrentPageId() + ' .containable';
    }
    var target = $(selector).filter(function() {
        console.log($(this));
        console.log( "" + (x > $(this).offset().left) + " : " + (x < ($(this).offset().left + $(this).outerWidth())
            ) + " : " + ( y > $(this).offset().top ) + " : " + ( y < ($(this).offset().top + $(this).outerHeight())) );
        return ( x > $(this).offset().left && x < ($(this).offset().left + $(this).outerWidth())
           && y > $(this).offset().top && y < ($(this).offset().top + $(this).outerHeight()) );
    }).filter( ":last" );

    var offset = target.offset();
    if ( offset == undefined ) {
        console.log( target ); 
        if ( getCurrentPage().children().filter('.containable:first').length > 0 ) {
            dragWidget.source = source;
            dragWidget.target = getCurrentPage().children().filter('.containable:first');
            console.log( "233" );
            console.log( dragWidget.target );
            dragWidget.position = "in";
        }
        return;
    }
    console.log( target );
    if ( y < ( 10  +  offset.top ) ) {
        var line = $( "<div class='mbuilder-selected-control mbuilder-border-left'></div>" );
        target.before( line );
        line.offset({ top: offset.top, left: offset.left});
        line.width( target.outerWidth() ).height( 1 );
        dragWidget.source = source;
        dragWidget.target = target;
        dragWidget.position = "before";
        console.log( "3" );
    } else if ( y > ( offset.top + target.outerHeight() - 10 ) ) {
        var line = $( "<div class='mbuilder-selected-control mbuilder-border-left'></div>" );
        target.after( line );
        line.offset({ top: offset.top + target.outerHeight() - 1, left: offset.left});
        line.width( target.outerWidth() ).height( 1 );
        dragWidget.source = source;
        dragWidget.target = target;
        dragWidget.position = "after";
        console.log( "4" );
    } else if ( target.hasClass( "containable" ) ) {
        outlineWidget( target );
        dragWidget.source = source;
        dragWidget.target = target;
        console.log( "1" );
        console.log( dragWidget.target );
        dragWidget.position = "in";
    } else {
        dragWidget.source = source;
        dragWidget.target = getCurrentPage();
        console.log( "2" );
        console.log( dragWidget.target );
        dragWidget.position = "in";
    }
}

function getSelectedWidget() {
    return parent.mbuilder.loadWidget( selectedWidget.data( "widgetid" ) ).methods.getRootElement(selectedWidget);
}

function updatePageList() {
    var pageList = {active: getCurrentPageId(), pages: []};
    var pages = $("div[data-role='page']");
    for ( var i = 0; i < pages.length; i ++ ) {
        pageList.pages.push( $(pages[i]).attr( "id" ) );
    }
    publish2Parent( "mbuilder.action.newpage", pageList );
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