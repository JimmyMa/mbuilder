function init() {
    
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
        change: function () {  }
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
           var compiled = _.template( data, {property: property, widgetData: widgetData, value: widgetData[key] } );
           content.append( compiled );
           mbuilder.loadEditor( property.type ).initializer( key, widgetData );
        });
    });
}

function publishToPhone( topic, data ) {
    $("#childIframe").get(0).contentWindow.$.pubsub( 'publish', topic, data );
}

