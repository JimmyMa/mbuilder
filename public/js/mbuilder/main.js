var mbuilderAttributes = ["mbuilderid", "data-widgetid"];
var myLayout;


var layoutSettings_Outer = {
    name: "outerLayout" 
,   south__initClosed:			true
,   west__size:	.20
,	east__size:	.25
,	north: {
        resizable: 				false
    ,   siez:   42
    }
};

function init() {
    $("#codesIframe").hide();
    
    jQuery.cachedScript = function(url, options) {
     
      // allow user to set any option except for dataType, cache, and url
      options = $.extend(options || {}, {
        dataType: "script",
        cache: false,
        url: url,
        async: false
      });
     
      // Use $.ajax() since it is more flexible than $.getScript
      // Return the jqXHR object so we can chain callbacks
      return jQuery.ajax(options);
    }
    
    initLayout();
    
    initPropertiesView();
    
    initBindingView();
    
    initWidgets();
    
    initEvents();
    
    dragObject.init();
    
    $("#jsArea").css("width", $("#Javascript").parent().css("width"));
    $("#jsArea").css("height", $("#Javascript").parent().css("height"));
}

function initPropertiesView() {
    $.pubsub( "subscribe", "widget.action.selected", function( topic, widgetData ) {
        var widget = mbuilder.loadWidget( widgetData.widgetid );
        $( "#Propeerties_widgetname" ).empty().append( widget.name );
        initProperties( widget, widgetData );
    });
}

function initBindingView() {
    $.pubsub( "subscribe", "widget.action.selected", function( topic, widgetData ) {
        var widget = mbuilder.loadWidget( widgetData.widgetid );
        $( "#Binding_widgetname" ).empty().append( widget.name );
        initBinding( widget, widgetData );
    });
}

function initLayout() {

    $(".ui-layout-west").tabs().find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });

    $(".ui-layout-east").tabs().find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });

    $(".ui-layout-center").tabs({
        activate: function( event, ui ) {
            if ( ui.newTab && ui.newTab.text() == "Source" ) {
                var codes = $("#codesIframe").get(0).contentWindow.$("body" ).html();
                codes = html_beautify( removeMBuilderCodes( codes  ),{
                  'indent_size': 2,
                  'indent_char': ' ',
                  'max_char': 78,
                  'brace_style': 'expand',
                  'unformatted': []
                });
                $("#codesArea").text( codes );
            } else if ( ui.newTab && ui.newTab.text() == "JS" ) {
                $(".javascript").hide();
                var currentPageId = "#" + getCurrentPageId() + "_js";
                if ( $(currentPageId).length == 0 ) {
                    $("#globalcodes").before( "<div id='" + getCurrentPageId() + "_js' class='javascript' contenteditable></div>" );
                } else {
                    $(currentPageId).show();
                }
                $("#global_js").show();
            } else if ( ui.newTab && ui.newTab.text() == "Preview" ) {
                $("#previewIframe").get(0).contentWindow.refreshPages();
            }
        }
    }).find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });

    myLayout = $('body').layout( layoutSettings_Outer );
    
    $(".ui-layout-north").height( 42 );
}

function initProperties( widget, widgetData ) {
    var content = $( "#PropertiesContent" );
    content.empty();
    $.each( widget.properties, function( key, property ) {
        if( key == "filter" ) {
            return;
        }
        $.ajax({
          url: "editors/" + property.type + ".html",
          async: false
        }).done(function(data) {
           var id = IDCounter++;
           var compiled = _.template( data, {id: id, property: property, widgetData: widgetData, value: widgetData.properties[key] } );
           content.append( compiled );
           mbuilder.loadEditor( property.type ).initializer( id, key, widgetData );
        });
    });
}

function initBinding( widget, widgetData ) {
    var content = $( "#BindingContent" );
    content.empty();
    $.each( widget.bindings, function( key, binding ) {
        if( key == "filter" ) {
            return;
        }
        $.ajax({
          url: "editors/" + binding.type + ".html",
          async: false
        }).done(function(data) {
           var id = IDCounter++;
           var compiled = _.template( data, {id: id, property: binding, widgetData: widgetData, value: widgetData.bindings[key] } );
           content.append( compiled );
           mbuilder.loadEditor( binding.type ).initializer( id, key, widgetData );
        });
    });
}

function publishToChildren( topic, data ) {
    $("#childIframe").get(0).contentWindow.$.pubsub( 'publish', topic, data );
    $("#codesIframe").get(0).contentWindow.$.pubsub( 'publish', topic, data );
}

function initWidgets() {
/*
    mbuilder.loadWidget( "com.mbuilder.widget.header" );
    mbuilder.loadWidget( "com.mbuilder.widget.button" );
    mbuilder.loadWidget( "com.mbuilder.widget.footer" );
    mbuilder.loadWidget( "com.mbuilder.widget.listview" );
    mbuilder.loadWidget( "com.mbuilder.widget.navbar" );
    mbuilder.loadWidget( "com.mbuilder.widget.image" );
    mbuilder.loadWidget( "com.mbuilder.widget.label" );
    
    mbuilder.loadWidget( "com.mbuilder.widget.tabs" );
    mbuilder.loadWidget( "com.mbuilder.widget.text" );
    mbuilder.loadWidget( "com.mbuilder.widget.simpletmp" );
*/
    
    mbuilder.loadGroup( "general" );
    mbuilder.loadGroup( "forms" );
    mbuilder.loadGroup( "toolbars" );
    mbuilder.loadGroup( "listviews" );
//    mbuilder.loadGroup( "layout" );
    mbuilder.loadGroup( "pages" );

    var content = $( "#widget_groups" );
    $.ajax({
      url: "templates/widgetslist.html",
      async: false
    }).done(function(data) {
       var compiled = _.template( data, {groups: mbuilder.groups, mbuilder: mbuilder} );
       content.append( compiled );
       content.accordion({ heightStyle: "content" });
       myLayout.sizeContent("east");
    });
}

function removeMBuilderCodes( htmlcodes ) {
    var results = "";
 
    HTMLParser(htmlcodes, {
      start: function( tag, attrs, unary ) {
        results += "<" + tag;
     
        for ( var i = 0; i < attrs.length; i++ ) {
            if ( $.inArray( attrs[i].name, mbuilderAttributes ) < 0 ) {
                var attrValue = attrs[i].escaped;
                attrValue = attrValue.replace( "selectable", "" );
                attrValue = attrValue.replace( "mbwidget", "" );
                if ( attrValue != "" ) {
                    results += " " + attrs[i].name + '="' + attrValue + '"';
                }
            }
        }
     
        results += (unary ? "/" : "") + ">";
      },
      end: function( tag ) {
        results += "</" + tag + ">";
      },
      chars: function( text ) {
        results += text;
      },
      comment: function( text ) {
        results += "<!--" + text + "-->";
      }
    });
    
    return results;
}

function initEvents() {
    $("#action_save").click( function() {
        save();
    });
    $("#action_export").click( function() {
        doexport();
    });
}

function save() {
    var codes = $("#codesIframe").get(0).contentWindow.$("body" ).html();
    var cleanCodes = removeMBuilderCodes( codes  );
    var data = "{codes:" + codes + ", cleanCodes:" + cleanCodes + "}";
    $.ajax({  
      url: "/editor/save",  
      type: "POST",  
      dataType: "json",  
      contentType: "application/json",  
      data: JSON.stringify({ codes: codes, cleanCodes: cleanCodes }),  
      success: function(){              
      },  
      error: function(){  
      }  
    });  
}

function doexport() {
    var codes = $("#codesIframe").get(0).contentWindow.$("body" ).html();
    var cleanCodes = removeMBuilderCodes( codes  );
    var javascript = [];
    $.each( $(".javascript"), function( index, jsDiv ) {
        var id = jsDiv.id;
        id = id.substring( 0,id.length - 3 );
        javascript.push( {pageId: id, javascript: jsDiv.textContent} );
    });
    
    var data = {};
    data.rawHtmlCodes = codes;
    data.cleanedHtmlCodes = cleanCodes;
    data.javascriptCodes = javascript;
    $.ajax({  
      url: "/actions/export",  
      type: "POST",  
      dataType: "json",  
      contentType: "application/json",  
      data: JSON.stringify(data),  
      success: function(){
        window.open( "/actions/download" );
      },  
      error: function(){  
      }  
    });  
}

function getCurrentPageId() {
	return $("#childIframe").get(0).contentWindow.$.mobile.activePage.attr('id');
}