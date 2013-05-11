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
                console.log( codes );
                codes = html_beautify( codes ,{
                  'indent_size': 2,
                  'indent_char': ' ',
                  'max_char': 78,
                  'brace_style': 'expand',
                  'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
                });
                $("#codesArea").text( codes );
            }
        }
    }).find(".ui-tabs-nav").sortable({ axis: 'x', zIndex: 2 });

    myLayout = $('body').layout({
        west__size:	.25
    ,	east__size:	.25
    });
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
