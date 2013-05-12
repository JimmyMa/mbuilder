var mbuilderAttributes = ["mbuilderid", "data-widgetid"];
var myLayout;


	/*
	*#######################
	* OUTER LAYOUT SETTINGS
	*#######################
	*
	* This configuration illustrates how extensively the layout can be customized
	* ALL SETTINGS ARE OPTIONAL - and there are more available than shown below
	*
	* These settings are set in 'sub-key format' - ALL data must be in a nested data-structures
	* All default settings (applied to all panes) go inside the defaults:{} key
	* Pane-specific settings go inside their keys: north:{}, south:{}, center:{}, etc
	*/
	var layoutSettings_Outer = {
		name: "outerLayout" // NO FUNCTIONAL USE, but could be used by custom code to 'identify' a layout
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
    
    initWidgets();
    
    initEvents();
    
    dragObject.init();
}

function initPropertiesView() {
    $.pubsub( "subscribe", "widget.action.selected", function( topic, widgetData ) {
        var widget = mbuilder.loadWidget( widgetData.widgetid );
        $( "#Propeerties_widgetname" ).empty().append( widget.name );
        initProperties( widget, widgetData );
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
        $.ajax({
          url: "editors/" + property.type + ".html",
          async: false
        }).done(function(data) {
           var id = IDCounter++;
           var compiled = _.template( data, {id: id, property: property, widgetData: widgetData, value: widgetData[key] } );
           content.append( compiled );
           mbuilder.loadEditor( property.type ).initializer( id, key, widgetData );
        });
    });
}

function publishToChildren( topic, data ) {
    $("#childIframe").get(0).contentWindow.$.pubsub( 'publish', topic, data );
    $("#codesIframe").get(0).contentWindow.$.pubsub( 'publish', topic, data );
}

function initWidgets() {
    mbuilder.loadWidget( "com.mbuilder.widget.header" );
    mbuilder.loadWidget( "com.mbuilder.widget.button" );
    mbuilder.loadWidget( "com.mbuilder.widget.footer" );
    mbuilder.loadWidget( "com.mbuilder.widget.list" );
    mbuilder.loadWidget( "com.mbuilder.widget.navbar" );
    mbuilder.loadWidget( "com.mbuilder.widget.image" );
    
    
    var content = $( "#WidgetsView" );
    $.ajax({
      url: "templates/widgetslist.html",
      async: false
    }).done(function(data) {
       var compiled = _.template( data, {widgets: mbuilder.widgets } );
       content.append( compiled );
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